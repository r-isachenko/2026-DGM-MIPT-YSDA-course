import { chromium } from 'playwright-chromium'
import { resolve } from 'node:path'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import { lecturePaths, root } from './course.mjs'
import { elboPresets, elboTerms, logEvidence } from '../lecture3/lib/variational.mjs'

const lecture = lecturePaths('3')
const base = process.env.SLIDEV_QA_URL || `http://localhost:${lecture.port}`
const map = JSON.parse(readFileSync(lecture.map,'utf8'))
const slide = frame => map.find(s=>s.frame===frame)
const elboSlide=slide(12)
const qa=resolve(root,'output/qa/lecture3/variational-demos')
mkdirSync(qa,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.SLIDEV_BROWSER_PATH||'/Applications/Yandex.app/Contents/MacOS/Yandex',headless:true})
const context=await browser.newContext({viewport:{width:1280,height:720}})
const page=await context.newPage()
const errors=[],failures=[],external=[],states=[]
page.on('pageerror',e=>errors.push(String(e)))
page.on('response',r=>{if(r.status()>=400)failures.push([r.status(),r.url()])})
await context.route('**/*',route=>{
  const url=new URL(route.request().url())
  if(['http:','https:'].includes(url.protocol)&&url.origin!==new URL(base).origin){external.push(url.href);return route.abort()}
  return route.continue()
})
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,`${a} differs from ${b}`)
async function go(s,tools=false){
  await page.goto(`${base}/${s.slide}?clicks=${s.clicks}${tools?'&tools':''}`,{waitUntil:'networkidle'})
  await page.evaluate(()=>document.fonts.ready)
  assert.match(await page.locator('.course-folio:visible').last().innerText(),new RegExp(`/ ${map.length}$`),'Wrong deck or stale server')
  const demo=page.locator('[data-demo]:visible')
  await demo.waitFor({state:'visible'})
  return demo
}
async function snapshot(name){
  await page.mouse.move(1240,690)
  const overflow=await page.locator('[data-demo]:visible').evaluate(demo=>{
    const layout=demo.closest('.slidev-layout'),r=layout.getBoundingClientRect(),scale=r.width/1280
    const bottom=Math.min(r.top+672*scale,layout.querySelector('.source').getBoundingClientRect().top-12*scale)
    return [...demo.querySelectorAll('button,label,svg,.katex-html,.demo-note,.derivatives,.gradient-path')].map(el=>({text:el.textContent.slice(0,90),r:el.getBoundingClientRect().toJSON()})).filter(el=>el.r.width>0&&(el.r.bottom>bottom+.5||el.r.right>r.right-30*scale||el.r.left<r.left+30*scale))
  })
  assert.deepEqual(overflow,[],`Overflow in ${name}`)
  await page.screenshot({path:resolve(qa,`${name}.png`)})
  states.push(name)
}
async function dataset(demo){return demo.evaluate(el=>({...el.dataset}))}
async function checkReturn(demo,s){
  const previous=await dataset(demo)
  await page.locator('.slidev-layout:visible h1').click()
  await page.keyboard.press('ArrowRight')
  await page.waitForURL(new RegExp(`/${s.slide+1}(?:\\?|$)`))
  await page.keyboard.press('ArrowLeft')
  await page.waitForURL(new RegExp(`/${s.slide}(?:\\?|$)`))
  assert.deepEqual(await dataset(demo),previous,'Exploration should survive a return from the next slide')
  // Up / down navigate directly and let us verify a return from the previous slide too.
  await page.keyboard.press('ArrowUp')
  await page.waitForURL(new RegExp(`/${s.slide-1}(?:\\?|$)`))
  await page.keyboard.press('ArrowDown')
  await page.waitForURL(new RegExp(`/${s.slide}(?:\\?|$)`))
  for(let i=0;i<s.clicks;i++)await page.keyboard.press('ArrowRight')
  assert.deepEqual(await dataset(demo),previous,'Exploration should survive a return from the previous slide')
}
try{
  let demo=await go(elboSlide)
  const evidenceLine=await demo.locator('[data-evidence-line]').getAttribute('y1')
  for(const preset of elboPresets){
    await demo.getByRole('button',{name:preset.label,exact:true}).click()
    const d=await dataset(demo),t=elboTerms(preset.mean,preset.sigma)
    close(+d.mean,preset.mean);close(+d.sigma,preset.sigma);close(+d.elbo,t.elbo);close(+d.gap,t.gap);close(+d.evidence,logEvidence)
    assert.equal(await demo.locator('[data-evidence-line]').getAttribute('y1'),evidenceLine)
    await snapshot(`elbo-${preset.label.toLowerCase()}`)
  }
  for(const [mean,sigma] of [[-1,.45],[2,1.4]]){
    await demo.getByRole('slider',{name:'Variational mean',exact:true}).fill(String(mean))
    await demo.getByRole('slider',{name:'Variational standard deviation',exact:true}).fill(String(sigma))
    const d=await dataset(demo);close(+d.elbo+ +d.gap,logEvidence)
    await snapshot(`elbo-extreme-${mean}`)
  }
  await demo.getByRole('slider',{name:'Variational mean',exact:true}).focus()
  const beforeURL=page.url();await page.keyboard.press('ArrowLeft')
  assert.equal(page.url(),beforeURL,'Slider arrow key must not navigate');close(+(await dataset(demo)).mean,1.95)
  await checkReturn(demo,elboSlide)
  await demo.getByRole('button',{name:'Reset',exact:true}).click();close(+(await dataset(demo)).mean,elboPresets[0].mean)

  for(const s of [elboSlide]){
    demo=await go(s,true)
    const toolbar=page.getByRole('navigation',{name:'Lecture annotation tools'})
    const pen=toolbar.getByRole('button',{name:'Pen',exact:true})
    if(await pen.getAttribute('aria-pressed')!=='true')await pen.click()
    await demo.getByRole('button',{name:'Better',exact:true}).click()
    close(+(await dataset(demo)).mean,.7)
    await snapshot(`pen-${s.slide}`)
    // Chromium's synthetic pen pointer also hits the control above the drawing layer.
    const button=demo.getByRole('button',{name:'Reset',exact:true}),box=await button.boundingBox()
    const cdp=await context.newCDPSession(page)
    await cdp.send('Input.dispatchMouseEvent',{type:'mousePressed',x:box.x+box.width/2,y:box.y+box.height/2,button:'left',buttons:1,clickCount:1,pointerType:'pen'})
    await cdp.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:box.x+box.width/2,y:box.y+box.height/2,button:'left',buttons:0,clickCount:1,pointerType:'pen'})
    close(+(await dataset(demo)).mean,elboPresets[0].mean)
    await cdp.detach();await pen.click()
  }
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);assert.deepEqual(external,[])
  console.log(`Variational demos: ${states.length} visual states, exact readouts, keyboard, return, reset, offline and pen hit-testing passed.`)
}finally{
  await page.screenshot({path:resolve(qa,'last-state.png')})
  writeFileSync(resolve(qa,'report.json'),JSON.stringify({states,errors,failures,external,sourceSha256:createHash('sha256').update(readFileSync(lecture.entry)).digest('hex')},null,2))
  await browser.close()
}
