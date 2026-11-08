import { chromium } from 'playwright-chromium'
import { resolve } from 'node:path'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { root, lecturePaths, readSlides } from './course.mjs'
const lecture=lecturePaths('9'),base=process.env.SLIDEV_QA_URL||`http://localhost:${lecture.port}`
const map=readSlides(lecture),qa=resolve(root,'output/qa/lecture9/dynamics-demos')
mkdirSync(qa,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.SLIDEV_BROWSER_PATH||'/Applications/Yandex.app/Contents/MacOS/Yandex',headless:true})
const context=await browser.newContext({viewport:{width:1280,height:720}}),page=await context.newPage()
const errors=[],http=[],external=[],states=[]
page.on('pageerror',e=>errors.push(String(e)));page.on('response',r=>{if(r.status()>=400)http.push([r.status(),r.url()])})
await context.route('**/*',route=>{const url=new URL(route.request().url());if(['http:','https:'].includes(url.protocol)&&url.origin!==new URL(base).origin){external.push(url.href);return route.abort()}return route.continue()})
const slide=title=>map.find(s=>s.title===title)
const selected=[slide('ODE Solvers: Accuracy and Cost'),slide('Langevin: Moving Particles, Stationary Density')]
const data=demo=>demo.evaluate(el=>({...el.dataset}))
async function go(s,query=''){await page.goto(`${base}/${s.slide}${query}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);return page.locator('[data-demo]:visible')}
async function snapshot(name){
  await page.mouse.move(1270,20)
  const bad=await page.locator('.slidev-layout:visible').evaluate(layout=>{
    const rect=layout.getBoundingClientRect(),source=layout.querySelector('.source').getBoundingClientRect().top
    return [...layout.querySelectorAll('[data-demo],.demo-note,.demo-takeaway,svg text,button,input,.l9-formula')].filter(el=>el.getBoundingClientRect().width&&getComputedStyle(el).visibility!=='hidden').map(el=>({tag:el.tagName,text:el.textContent.slice(0,70),rect:el.getBoundingClientRect().toJSON()})).filter(({rect:r})=>r.bottom>Math.min(source-8,rect.top+672)||r.left<rect.left+40||r.right>rect.right-40)
  })
  assert.deepEqual(bad,[],`Layout ${name}`);assert.equal(await page.locator('.katex-error:visible').count(),0)
  await page.screenshot({path:resolve(qa,`${name}.png`)});states.push(name)
}
async function reentry(demo,s){
  const before=await data(demo);await page.locator('.slidev-layout:visible h1').click();await page.keyboard.press('ArrowRight');await page.waitForURL(new RegExp(`/${s.slide+1}(?:\\?|$)`));await page.keyboard.press('ArrowLeft');await page.waitForURL(new RegExp(`/${s.slide}(?:\\?|$)`));await demo.waitFor({state:'visible'});assert.deepEqual(await data(demo),before)
  await page.keyboard.press('ArrowUp');await page.waitForURL(new RegExp(`/${s.slide-1}(?:\\?|$)`));await page.keyboard.press('ArrowDown');await page.waitForURL(new RegExp(`/${s.slide}(?:\\?|$)`));await demo.waitFor({state:'visible'});assert.deepEqual(await data(demo),before)
}
try{
  let demo=await go(selected[0]);await snapshot('solver-initial')
  for(const n of [4,8,16,32]){
    await demo.getByRole('button',{name:String(n),exact:true}).click();await demo.getByRole('button',{name:'Complete',exact:true}).click();assert.equal(+(await data(demo)).count,n);await snapshot(`solver-${n}`)
  }
  await demo.getByRole('button',{name:'Reset',exact:true}).click();await demo.getByRole('button',{name:'One step',exact:true}).click();assert.equal(+(await data(demo)).count,2);await reentry(demo,selected[0])
  demo=await go(selected[1]);for(const mode of ['Drift only','Diffusion only','Both']){await demo.getByRole('button',{name:mode,exact:true}).click();for(const step of ['0','60','120']){await demo.getByRole('slider').fill(step);await snapshot(`stationary-${mode.replaceAll(' ','-')}-${step}`)}}await reentry(demo,selected[1])
  await demo.getByRole('button',{name:'Reset',exact:true}).click();await demo.getByRole('button',{name:'Step',exact:true}).click();assert.equal(+(await data(demo)).step,1);await demo.getByRole('button',{name:'Run',exact:true}).click();await page.waitForFunction(()=>+document.querySelector('[data-demo="stationary-langevin"]').dataset.step>3);await page.locator('.slidev-layout:visible h1').click();await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowLeft');assert.equal((await data(demo)).running,'false')
  for(const s of selected){
    demo=await go(s,'?tools');const slider=demo.getByRole('slider')
    if(await slider.count()){await slider.focus();const url=page.url();await page.keyboard.press('ArrowRight');assert.equal(page.url(),url)}
    const pen=page.getByRole('navigation',{name:'Lecture annotation tools'}).getByRole('button',{name:'Pen',exact:true});if(await pen.getAttribute('aria-pressed')!=='true')await pen.click()
    const reset=await demo.getByRole('button',{name:'Reset',exact:true}).boundingBox(),cdp=await context.newCDPSession(page)
    for(const type of ['mousePressed','mouseReleased'])await cdp.send('Input.dispatchMouseEvent',{type,x:reset.x+reset.width/2,y:reset.y+reset.height/2,button:'left',buttons:type==='mousePressed'?1:0,clickCount:1,pointerType:'pen'})
    await cdp.detach();await snapshot(`pen-${s.slide}`);await pen.click()
    await go(s,'?print');assert.equal(await page.locator('[data-demo]:visible .demo-controls').count(),0);await snapshot(`print-${s.slide}`)
  }
  const wienerSlide = map.find(s => s.id === 'stochastic-differential-equation-sde')
  demo = await go(wienerSlide)
  const time = demo.getByRole('slider', { name: 'Brownian motion time' })
  const paths = () => demo.locator('svg g path').evaluateAll(lines => lines.map(line => line.getAttribute('d')))
  await time.fill('5')
  const fullPaths = await paths()
  assert.equal(new Set(fullPaths).size, 5)
  await time.fill('2.5')
  const halfPaths = await paths()
  halfPaths.forEach((line, i) => assert.ok(fullPaths[i].startsWith(line) && fullPaths[i].length > line.length))
  await time.fill('0')
  const origins = await paths()
  assert.equal(new Set(origins).size, 1)
  assert.ok(!origins[0].includes('L'))
  await time.focus()
  await page.keyboard.press('ArrowRight')
  assert.equal(await time.inputValue(), '0.01')
  await time.fill('2.5')
  assert.deepEqual(await paths(), halfPaths)
  await snapshot('wiener-half')
  await page.locator('.slidev-layout:visible h1').click()
  await page.keyboard.press('ArrowDown')
  await page.waitForURL(new RegExp(`/${wienerSlide.slide + 1}(?:\\?|$)`))
  await page.keyboard.press('ArrowUp')
  await time.waitFor({ state: 'visible' })
  assert.equal(await time.inputValue(), '2.5')
  demo = await go(wienerSlide, '?print')
  assert.equal(await demo.getByRole('slider').count(), 0)
  assert.deepEqual(await paths(), fullPaths)
  await snapshot('wiener-print')
  const trajectorySlide = map.find(s => s.id === 'stochastic-differential-equation-sde-3')
  await go(trajectorySlide)
  const plots = page.locator('.slidev-layout:visible svg.trajectory-plot')
  assert.equal(await plots.count(), 2, 'Both trajectory plots must render in the browser')
  for (const expected of [0, 1, 2]) {
    if (expected) await page.keyboard.press('ArrowRight')
    await page.waitForFunction(count => {
      const layout = [...document.querySelectorAll('.slidev-layout')].find(el => el.getBoundingClientRect().width > 0)
      return [...layout.querySelectorAll('svg.trajectory-plot')].filter(el => el.checkVisibility({opacityProperty: true, visibilityProperty: true})).length === count
    }, expected)
  }
  const pairs = await plots.evaluateAll(figures => figures.map(svg =>
    [...svg.querySelectorAll('g path')].map(line => {
      if (line.getTotalLength() <= 0) throw new Error('Empty trajectory curve')
      return line.getAttribute('d')
    })
  ))
  assert.deepEqual(pairs.map(pair => pair.length), [2, 2])
  assert.notEqual(pairs[0][0], pairs[0][1])
  assert.equal(pairs[0][0], pairs[1][0])
  const vertices = d => [...d.matchAll(/[ML](-?[\d.]+),(-?[\d.]+)/g)].map(([, x, y]) => [Number(x), Number(y)])
  const [upper, lower] = pairs[1].map(vertices)
  const gap = lower[0][1] - upper[0][1]
  assert.ok(gap > 0, 'The shared-noise solutions must start at different heights')
  assert.equal(lower.length, upper.length)
  upper.forEach(([x, y], i) => {
    assert.equal(lower[i][0], x)
    assert.ok(Math.abs(lower[i][1] - y - gap) < 1e-6, 'Brownian increments must match')
  })
  assert.deepEqual(errors,[]);assert.deepEqual(http,[]);assert.deepEqual(external,[])
  console.log(`Lecture 9: ${states.length} states passed; presets, endpoints, step/run/pause, reentry, keyboard, offline, print, synthetic pen.`)
}finally{writeFileSync(resolve(qa,'report.json'),JSON.stringify({states,errors,http,external},null,2));await browser.close()}
