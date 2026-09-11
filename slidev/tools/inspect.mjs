import { chromium } from 'playwright-chromium'
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
const browser = await chromium.launch({ executablePath: process.env.SLIDEV_BROWSER_PATH || '/Applications/Yandex.app/Contents/MacOS/Yandex', headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 })
const errors = [], failed = [], result = []
page.on('pageerror', err => errors.push(String(err)))
page.on('response', res => { if(res.status()>=400) failed.push([res.status(),res.url()]) })
mkdirSync('output/qa', { recursive: true })
const selected = process.env.QA_SLIDES?.split(',').map(Number)
const map = JSON.parse(readFileSync('lecture01-map.json','utf8'))
async function ready() {
  await page.waitForFunction(()=>[...document.querySelectorAll('.slidev-layout')].some(el=>el.getBoundingClientRect().width>0))
  await page.evaluate(() => document.fonts.ready)
}
async function sample() {
  return page.evaluate(() => {
    const layout = [...document.querySelectorAll('.slidev-layout')].find(el=>el.getBoundingClientRect().width>0)
    function visible(el) { for(let a=el; a && a!==layout; a=a.parentElement) { const s=getComputedStyle(a); if(+s.opacity===0||s.display==='none'||s.visibility==='hidden') return false } return true }
    const nodes=[...layout.querySelectorAll('h1,h2,p,li,img,table,.katex-display,.math-chain,.katex-html,.mord')]
    const rects=nodes.map(el=>{const r=el.getBoundingClientRect();return [r.x,r.y,r.width,r.height].map(v=>Math.round(v*100)/100)})
    return { rects, visible:nodes.map(visible), overflow:nodes.map((el,i)=>({tag:el.tagName,text:el.textContent.slice(0,70),r:rects[i]})).filter(n=>n.r[0]+n.r[2]>1255 || n.r[1]+n.r[3]>672), rawMath:layout.innerText.includes('$'), mathErrors:layout.querySelectorAll('.katex-error').length, images:[...layout.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0) }
  })
}
try {
 for (const slide of map.filter(s => !selected || selected.includes(s.slide))) {
  await page.goto(`http://localhost:3031/${slide.slide}`, { waitUntil: 'networkidle' }); await ready()
  const states=[await sample()]
  for(let click=1;click<=slide.clicks;click++) {
    await page.keyboard.press('ArrowRight')
    await page.waitForFunction(c=>+(new URLSearchParams(location.search).get('clicks')||0)===c,click)
    const state=await sample(); assert.deepEqual(state.rects,states[0].rects,`Geometry moved on slide ${slide.slide} click ${click}`)
    assert.notDeepEqual(state.visible,states[click-1].visible,`Empty click ${slide.slide}/${click}`)
    states.push(state)
  }
  await page.screenshot({ path: `output/qa/slide-${String(slide.slide).padStart(2,'0')}.png` })
  for(let click=slide.clicks-1;click>=0;click--) {
    await page.keyboard.press('ArrowLeft')
    await page.waitForFunction(c=>+(new URLSearchParams(location.search).get('clicks')||0)===c,click)
    assert.deepEqual(await sample(),states[click],`Backward state mismatch on slide ${slide.slide}/${click}`)
  }
  const last=states.at(-1)
  assert.equal(last.mathErrors,0);assert.equal(last.rawMath,false);assert.equal(last.images,true)
  result.push({...slide,overflow:last.overflow,states:states.length,geometryStable:true,backwardStable:true})
  console.log(`${slide.slide}: ${states.length} states; ${last.overflow.length ? JSON.stringify(last.overflow) : 'OK'}`)
 }
 // Annotation integration: use a fresh dev server before handoff and an isolated browser profile.
 await page.goto('http://localhost:3031/25?tools', {waitUntil:'networkidle'}); await ready()
 const toolbar=page.getByRole('navigation',{name:'Lecture annotation tools'})
 await toolbar.waitFor({state:'visible'})
 await toolbar.getByRole('button',{name:'Ink #007f82',exact:true}).click()
 // Keep the test stroke above Slidev's navigation, which appears near the bottom.
 await page.mouse.move(450,540); await page.mouse.down(); await page.mouse.move(640,550,{steps:12}); await page.mouse.up()
 await toolbar.getByRole('button',{name:'Undo',exact:true}).waitFor({state:'visible'})
 assert.equal(await toolbar.getByRole('button',{name:'Undo',exact:true}).isEnabled(),true)
 await toolbar.getByRole('button',{name:'Undo',exact:true}).click()
 assert.equal(await toolbar.getByRole('button',{name:'Redo',exact:true}).isEnabled(),true)
 await toolbar.getByRole('button',{name:'Redo',exact:true}).click()
 const downloadPromise=page.waitForEvent('download'); await toolbar.getByRole('button',{name:'Save',exact:true}).click()
 const download=await downloadPromise; await download.saveAs('output/qa/session-test.json')
 const session=JSON.parse(readFileSync('output/qa/session-test.json','utf8')); assert.ok(session.drawings['25'])
 const clearDownload=page.waitForEvent('download');await toolbar.getByRole('button',{name:'Save & clear',exact:true}).click();await clearDownload
 assert.equal(await toolbar.getByRole('button',{name:'Undo',exact:true}).isEnabled(),false)
 await toolbar.locator('input[type=file]').setInputFiles('output/qa/session-test.json')
 await page.getByRole('status').filter({hasText:'Session restored'}).waitFor()
 assert.equal(await toolbar.getByRole('button',{name:'Save & clear',exact:true}).isEnabled(),true)
 await page.screenshot({path:'output/qa/annotation-tools.png'})
 for (let step=0;step<5;step++) await toolbar.getByRole('button',{name:'Next step',exact:true}).click()
 await page.waitForFunction(()=>location.pathname==='/26')
 await toolbar.getByRole('button',{name:'Previous step',exact:true}).click()
 await page.waitForFunction(()=>location.pathname==='/25')
 const backDownload=page.waitForEvent('download');await toolbar.getByRole('button',{name:'Save',exact:true}).click()
 await (await backDownload).saveAs('output/qa/session-return-test.json')
 const returned=JSON.parse(readFileSync('output/qa/session-return-test.json','utf8'))
 assert.equal(returned.drawings['25'],session.drawings['25'],'Drawing changed after clicks / slide return')
 // Clear the synthetic drawing after preserving the test artifact.
 const finalSave=page.waitForEvent('download'); await toolbar.getByRole('button',{name:'Save & clear',exact:true}).click(); await finalSave
 console.log('Annotation integration: pen, Undo/Redo, save, clear and restore passed.')
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[])
} finally {
 await page.screenshot({path:'output/qa/last-ui-state.png'})
 writeFileSync('output/qa/browser-report.json',JSON.stringify({result,errors,failed},null,2))
 await browser.close()
}
