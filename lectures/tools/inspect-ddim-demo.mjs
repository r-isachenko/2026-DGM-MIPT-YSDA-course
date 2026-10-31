import { chromium } from 'playwright-chromium'
import { resolve } from 'node:path'
import { mkdirSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { root, lecturePaths, readSlides } from './course.mjs'
import { ddimConfig, ddimStep, predictor } from '../lecture8/lib/ddim-demo.mjs'

const lecture=lecturePaths('8')
const slide=readSlides(lecture).find(s=>s.id==='ddim-shared-paths-demo')
assert.ok(slide,'Missing DDIM visualization slide')
const base=process.env.SLIDEV_QA_URL||`http://localhost:${lecture.port}`
const qa=resolve(root,'output/qa/lecture8/ddim-demo')
mkdirSync(qa,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.SLIDEV_BROWSER_PATH||'/Applications/Yandex.app/Contents/MacOS/Yandex',headless:true})
const context=await browser.newContext({viewport:{width:1280,height:720}})
const page=await context.newPage()
const errors=[],http=[],external=[],states=[]
page.on('pageerror',e=>errors.push(String(e)))
page.on('response',r=>{if(r.status()>=400)http.push([r.status(),r.url()])})
await context.route('**/*',route=>{
  const url=new URL(route.request().url())
  if(['http:','https:'].includes(url.protocol)&&url.origin!==new URL(base).origin){external.push(url.href);return route.abort()}
  return route.continue()
})

const near=(a,b,tolerance=1e-10)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`)
const data=demo=>demo.evaluate(e=>({...e.dataset}))
const numeric=d=>({x:+d.currentX,u:+d.currentU,clean:+d.clean,noise:+d.noise,stage:+d.stage})
const observed=d=>({x:+d.currentX,u:+d.currentU})
const probabilities=d=>d.probabilities.split(',').map(Number)
const transition=ddimStep(ddimConfig.initialX,ddimConfig.initialU,.1)
const refreshed=predictor(transition.to.x,transition.to.u)
const actionLabels=['Build the path','Choose lower noise','Move to this point','Predict again','Replay step']
const stageNames=['estimate','build-path','preview','move','predict-again']
const guide=demo=>demo.locator('[data-current-guide]').getAttribute('d')
const backButton=demo=>demo.getByRole('button',{name:'Back',exact:true})
async function assertStage(demo,stage){
  const d=await data(demo),expectedState=stage<3?transition.from:transition.to
  const expectedPair=stage<4?transition.prediction:refreshed
  assert.equal(d.mode,'sampling');assert.equal(+d.stage,stage)
  near(+d.currentX,expectedState.x);near(+d.currentU,expectedState.u)
  near(+d.clean,expectedPair.clean);near(+d.noise,expectedPair.noise)
  near(+d.nextX,transition.to.x)
  assert.ok(Object.values(numeric(d)).every(Number.isFinite))
  assert.equal(await demo.getByRole('button',{name:actionLabels[stage],exact:true}).isEnabled(),true)
  assert.equal(await backButton(demo).isDisabled(),stage===0)
  for(const [selector,present] of [
    ['[data-estimated-origin]',true],['[data-current-guide]',stage>=1],
    ['[data-next-state]',stage===2],['[data-realized-path]',stage>=3],['[data-start-state]',stage>=3],
  ])assert.equal(await demo.locator(selector).count(),present?1:0,`${selector} at stage ${stage}`)
  assert.equal(await demo.locator('input[type="range"]').count(),0,'The observation slider must be removed')
  return d
}
async function go(tools=false){
  await page.goto(`${base}/${slide.slide}?clicks=${slide.clicks}${tools?'&tools':''}`,{waitUntil:'networkidle'})
  await page.evaluate(()=>document.fonts.ready)
  return page.locator('[data-demo="ddim-paths"]:visible')
}
async function snapshot(name){
  await page.mouse.move(1240,20)
  const violations=await page.locator('.slidev-layout:visible').evaluate(layout=>{
    const r=layout.getBoundingClientRect(),scale=r.width/1280
    const source=layout.querySelector('.source').getBoundingClientRect().top
    const visible=el=>{
      for(let a=el;a&&a!==layout;a=a.parentElement){const s=getComputedStyle(a);if(s.visibility==='hidden'||s.display==='none'||+s.opacity===0)return false}
      return true
    }
    return [...layout.querySelectorAll('[data-demo], .demo-takeaway, .demo-note, .context-line, .demo-controls, .readouts, .walkthrough, .stage-description, .stage-equation, .prediction-row, .ddim-plot, .ddim-plot text, button, input')]
      .filter(visible).map(e=>({tag:e.tagName,text:e.textContent.slice(0,90),r:e.getBoundingClientRect().toJSON()}))
      .filter(e=>e.r.width&&e.r.height&&(e.r.bottom>Math.min(source-10*scale,r.top+665*scale)||e.r.left<r.left+40*scale||e.r.right>r.right-40*scale))
  })
  const plotChecks=await page.locator('.slidev-layout:visible .ddim-plot').evaluateAll((plots,bounds)=>plots.map(svg=>{
    const frame=svg.querySelector(':scope > rect')
    const rect={x:+frame.getAttribute('x'),y:+frame.getAttribute('y'),width:+frame.getAttribute('width'),height:+frame.getAttribute('height')}
    const marker=svg.querySelector('[data-current-state]')
    const point={x:+marker.getAttribute('cx'),y:+marker.getAttribute('cy')}
    const demo=svg.closest('[data-demo]')
    const xy=(x,u)=>({x:rect.x+8+u*(rect.width-16),y:rect.y+rect.height-8-(x-bounds.xmin)/(bounds.xmax-bounds.xmin)*(rect.height-16)})
    const expected=xy(+demo.dataset.currentX,+demo.dataset.currentU)
    const secondary=[['[data-estimated-origin]',+demo.dataset.clean,0],['[data-next-state]',+demo.dataset.nextX,.1]]
      .map(([selector,x,u])=>({marker:svg.querySelector(selector),expected:xy(x,u)})).filter(v=>v.marker)
      .map(({marker,expected})=>({point:{x:+marker.getAttribute('cx'),y:+marker.getAttribute('cy')},expected}))
    const tickY=[-2,0,2].map(value=>[...svg.querySelectorAll(':scope > text')].find(el=>+el.getAttribute('x')===rect.x-10&&el.textContent===String(value)))
      .map(el=>el?+el.getAttribute('y'):NaN)
    const outside=[...svg.querySelectorAll('circle, rect[data-future-origin]')].filter(el=>!el.closest('defs')).map(el=>{
      const r=el.getBBox();return {tag:el.tagName,x:r.x+r.width/2,y:r.y+r.height/2}
    }).filter(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<rect.x||p.x>rect.x+rect.width||p.y<rect.y||p.y>rect.y+rect.height)
    const invalidPaths=[...svg.querySelectorAll('path:not(defs path)')].filter(el=>/NaN|Infinity/.test(el.getAttribute('d')||'')).length
    return {rect,point,expected,secondary,tickY,outside,invalidPaths}
  }),ddimConfig.bounds)
  await page.screenshot({path:resolve(qa,`${name}.png`)})
  states.push({name,violations,plotChecks})
  assert.deepEqual(violations,[],`Layout in ${name}`)
  for(const plot of plotChecks){
    assert.deepEqual(plot.outside,[],`Marks lie outside the chart in ${name}`)
    assert.ok(plot.tickY.every(Number.isFinite),`Missing numeric y ticks in ${name}`)
    assert.ok(plot.tickY[0]>plot.tickY[1]&&plot.tickY[1]>plot.tickY[2],`Y ticks are not ordered in ${name}`)
    assert.ok(plot.tickY[0]-plot.tickY[2]>.7*plot.rect.height,`Y coordinates collapsed in ${name}`)
    near(plot.point.x,plot.expected.x,.01);near(plot.point.y,plot.expected.y,.01)
    for(const marker of plot.secondary){near(marker.point.x,marker.expected.x,.01);near(marker.point.y,marker.expected.y,.01)}
    assert.equal(plot.invalidPaths,0)
  }
  assert.equal(await page.locator('.katex-error:visible').count(),0)
  assert.equal(await page.locator('.slidev-layout:visible [data-demo]').evaluate(el=>/NaN|Infinity/.test(el.textContent)),false)
}
async function reentry(demo){
  const before=await data(demo)
  await page.locator('.slidev-layout:visible h1').click()
  await page.keyboard.press('ArrowRight')
  await page.waitForURL(new RegExp(`/${slide.slide+1}(?:\\?|$)`))
  await page.keyboard.press('ArrowLeft')
  await page.waitForURL(new RegExp(`/${slide.slide}(?:\\?|$)`))
  assert.deepEqual(await data(demo),before,'Next-slide return changes the demo')
  await page.keyboard.press('ArrowUp')
  await page.waitForURL(new RegExp(`/${slide.slide-1}(?:\\?|$)`))
  await page.keyboard.press('ArrowDown')
  await page.waitForURL(new RegExp(`/${slide.slide}(?:\\?|$)`))
  for(let i=0;i<slide.clicks;i++)await page.keyboard.press('ArrowRight')
  assert.deepEqual(await data(demo),before,'Previous-slide return changes the demo')
}
async function penClick(locator,cdp){
  const box=await locator.boundingBox()
  assert.ok(box)
  for(const type of ['mousePressed','mouseReleased'])await cdp.send('Input.dispatchMouseEvent',{
    type,x:box.x+box.width/2,y:box.y+box.height/2,button:'left',buttons:type==='mousePressed'?1:0,clickCount:1,pointerType:'pen',
  })
}

try{
  let demo=await go()
  await demo.getByRole('button',{name:'Reset',exact:true}).click()
  let d=await data(demo)
  assert.equal(d.mode,'forward');assert.equal(d.known,'unknown')
  near(+d.currentU,ddimConfig.initialU);near(+d.currentX,ddimConfig.initialX)
  assert.equal(await demo.locator('input[type="range"]').count(),0,'The observation slider must be removed')
  const fixed=observed(d),originalProbabilities=probabilities(d)
  near(originalProbabilities[0]+originalProbabilities[1],1)
  assert.ok(originalProbabilities.every(p=>p>0&&p<1))
  await snapshot('forward-unknown')
  for(const [label,known,expected] of [['Also x₀ = −1','minus',[1,0]],['Also x₀ = +1','plus',[0,1]]]){
    await demo.getByRole('button',{name:label,exact:true}).click()
    d=await data(demo)
    assert.equal(d.known,known);assert.deepEqual(probabilities(d),expected)
    assert.deepEqual(observed(d),fixed,'Revealing history moves the present state')
    await snapshot(`forward-known-${known}`)
  }
  await demo.getByRole('button',{name:'Only xₜ',exact:true}).click()
  assert.deepEqual(probabilities(await data(demo)),originalProbabilities)

  // The learned MSE predictor sees the current state, not the selected true origin.
  const predictions=[]
  for(const label of ['Also x₀ = −1','Also x₀ = +1']){
    await demo.getByRole('button',{name:'Forward paths',exact:true}).click()
    await demo.getByRole('button',{name:label,exact:true}).click()
    await demo.getByRole('button',{name:'How DDIM moves',exact:true}).click()
    d=await assertStage(demo,0)
    predictions.push(numeric(d))
  }
  assert.deepEqual(predictions[0],predictions[1],'DDIM uses the revealed true history')
  near(predictions[0].clean,predictor(ddimConfig.initialX,ddimConfig.initialU).clean)
  assert.ok(Math.abs(predictions[0].clean)<1,'Prediction unexpectedly selects a true component')
  const stageData=[await data(demo)]
  await snapshot('sampling-0-estimate')

  let cachedGuide
  for(let stage=1;stage<=4;stage++){
    await demo.getByRole('button',{name:actionLabels[stage-1],exact:true}).click()
    d=await assertStage(demo,stage)
    stageData.push(d)
    const currentGuide=await guide(demo)
    if(stage===1)cachedGuide=currentGuide
    if(stage===2||stage===3)assert.equal(currentGuide,cachedGuide,'Choosing or moving changed the cached guide')
    if(stage===3){
      near(+d.clean,+stageData[2].clean);near(+d.noise,+stageData[2].noise)
      assert.notDeepEqual(observed(d),observed(stageData[2]),'Move failed to change the current point')
    }
    if(stage===4){
      assert.deepEqual(observed(d),observed(stageData[3]),'Predicting again moved the current point')
      assert.notEqual(currentGuide,cachedGuide,'Predicting again retained the previous guide')
      assert.ok(Math.abs(+d.clean-+stageData[3].clean)>.5,'Clean estimate was not recomputed')
      assert.ok(Math.abs(+d.noise-+stageData[3].noise)>1,'Noise estimate was not recomputed')
    }
    await snapshot(`sampling-${stage}-${stageNames[stage]}`)
    if(stage===2||stage===4)await reentry(demo)
  }

  // Back retraces the explanation, including the cached pair before refresh.
  for(let stage=3;stage>=0;stage--){
    await backButton(demo).click()
    await assertStage(demo,stage)
    assert.deepEqual(await data(demo),stageData[stage],`Back did not restore stage ${stage}`)
  }
  for(let stage=0;stage<4;stage++)await demo.getByRole('button',{name:actionLabels[stage],exact:true}).click()
  await demo.getByRole('button',{name:'Replay step',exact:true}).click()
  await assertStage(demo,0)
  assert.deepEqual(await data(demo),stageData[0],'Replay must restart this explanation')

  const build=demo.getByRole('button',{name:actionLabels[0],exact:true})
  await build.focus()
  const url=page.url(),beforeKeyboard=await data(demo)
  for(const key of ['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','Home','End']){
    await page.keyboard.press(key)
    assert.equal(page.url(),url,`Focused-control ${key} navigated away from the demo`)
    assert.deepEqual(await data(demo),beforeKeyboard,`${key} unexpectedly advanced the explanation`)
  }
  await page.keyboard.press('Enter')
  await assertStage(demo,1)
  await demo.getByRole('button',{name:'Forward paths',exact:true}).click()
  await demo.getByRole('button',{name:'How DDIM moves',exact:true}).click()
  await assertStage(demo,0)
  await demo.getByRole('button',{name:'Reset',exact:true}).click()
  d=await data(demo)
  assert.equal(d.mode,'forward');assert.equal(d.known,'unknown');assert.equal(+d.stage,0)
  assert.deepEqual(observed(d),fixed)

  // Synthetic pen verifies controls remain operable with annotation mode active.
  demo=await go(true)
  const pen=page.getByRole('navigation',{name:'Lecture annotation tools'}).getByRole('button',{name:'Pen',exact:true})
  if(await pen.getAttribute('aria-pressed')!=='true')await pen.click()
  const cdp=await context.newCDPSession(page)
  await penClick(demo.getByRole('button',{name:'Also x₀ = −1',exact:true}),cdp)
  assert.deepEqual(probabilities(await data(demo)),[1,0])
  await penClick(demo.getByRole('button',{name:'How DDIM moves',exact:true}),cdp)
  await assertStage(demo,0)
  for(let stage=0;stage<4;stage++){
    await penClick(demo.getByRole('button',{name:actionLabels[stage],exact:true}),cdp)
    await assertStage(demo,stage+1)
  }
  await snapshot('pen-walkthrough')
  await penClick(backButton(demo),cdp)
  await assertStage(demo,3)
  await penClick(demo.getByRole('button',{name:'Reset',exact:true}),cdp)
  await cdp.detach()
  d=await data(demo)
  assert.equal(d.mode,'forward');assert.equal(d.known,'unknown');assert.deepEqual(observed(d),fixed)
  await snapshot('pen-controls')
  await pen.click()

  assert.deepEqual(errors,[]);assert.deepEqual(http,[]);assert.deepEqual(external,[])
  console.log(`DDIM demo: ${states.length} visual states; fixed observation, history conditioning, cached guide, preview, deterministic move, refreshed prediction, Back/Replay, keyboard, reentry, Reset, offline and synthetic pen controls passed.`)
}finally{
  writeFileSync(resolve(qa,'report.json'),JSON.stringify({states,errors,http,external},null,2))
  await browser.close()
}
