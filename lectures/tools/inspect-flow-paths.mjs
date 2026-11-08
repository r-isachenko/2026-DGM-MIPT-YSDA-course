import {chromium} from 'playwright-chromium'
import {resolve} from 'node:path'
import {mkdirSync,writeFileSync} from 'node:fs'
import assert from 'node:assert/strict'
import { lecturePaths, readSlides } from './course.mjs'

const slides = readSlides(lecturePaths(11))
const conditionalSlide = slides.find(slide => slide.id === 'one-sided-conditioning-conditional-vector-field').slide
const marginalSlide = slides.find(slide => slide.id === 'one-sided-conditioning-cfm-objective').slide
const out=resolve('output/qa/lecture11/flow-paths');mkdirSync(out,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.SLIDEV_BROWSER_PATH||'/Applications/Yandex.app/Contents/MacOS/Yandex',headless:true})
const context=await browser.newContext({viewport:{width:1280,height:720}}),page=await context.newPage(),errors=[],external=[],states=[]
page.on('pageerror',e=>errors.push(String(e)))
await context.route('**/*',r=>{const u=new URL(r.request().url());if(['http:','https:'].includes(u.protocol)&&u.origin!=='http://localhost:3041'){external.push(u.href);return r.abort()}return r.continue()})
const demo=()=>page.locator('.slidev-layout:visible [data-demo="flow-paths"]')
async function go(n,c,extra=''){await page.goto(`http://localhost:3041/${n}?clicks=${c}${extra}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready)}
async function snap(name){await page.mouse.move(1270,10);await page.screenshot({path:resolve(out,name+'.png')});const overlap=await page.locator('.slidev-layout:visible').evaluate(e=>{const foot=e.querySelector('.source').getBoundingClientRect().top;return [...e.children].filter(c=>!c.classList.contains('source')).map(c=>({tag:c.tagName,bottom:c.getBoundingClientRect().bottom,foot})).filter(c=>c.bottom>foot-8)});states.push({name,overlap});assert.equal(await page.locator('.katex-error').count(),0)}
try{
 for(const [n,max] of [[conditionalSlide,4],[marginalSlide,3]]){
  for(let c=0;c<=max;c++){await go(n,c);assert.equal(await demo().evaluate(e=>e.classList.contains('slidev-vclick-hidden')),c<max);await snap(`${n}-${c}`)}
  await page.locator('.slidev-layout:visible h1').click();await page.keyboard.press('ArrowLeft');assert.equal(await demo().evaluate(e=>e.classList.contains('slidev-vclick-hidden')),true);await page.keyboard.press('ArrowRight');assert.equal(await demo().evaluate(e=>e.classList.contains('slidev-vclick-hidden')),false)
  const velocity=await demo().getAttribute('data-velocity')
  for(const t of ['0','0.25','0.5','0.75','1']){await demo().getByRole('slider').fill(t);assert.equal(await demo().getAttribute('data-t'),t);assert.equal(await demo().getAttribute('data-velocity'),velocity);await snap(`${n}-t-${t}`)}
  await demo().getByRole('slider').focus();const url=page.url();await page.keyboard.press('ArrowLeft');assert.equal(page.url(),url);assert.equal(await demo().getAttribute('data-t'),'0.99');await demo().getByRole('button',{name:'Reset',exact:true}).click()
  if (n === conditionalSlide) {
    const before = await demo().getAttribute('data-pair')
    await demo().getByRole('button', { name: 'Another pair' }).click()
    assert.notEqual(await demo().getAttribute('data-pair'), before)
    assert.notEqual(await demo().getAttribute('data-velocity'), velocity)
    await snap('conditional-another-pair')

    await demo().getByRole('slider').fill('0.37')
    await page.locator('.slidev-layout:visible h1').click()
    await page.keyboard.press('ArrowRight')
    await page.waitForURL(url => url.pathname === `/${marginalSlide}`)
    await page.keyboard.press('ArrowLeft')
    await page.waitForURL(url => url.pathname === `/${conditionalSlide}`)
    const restored = page.locator(`[data-slidev-no="${conditionalSlide}"] [data-demo="flow-paths"]:visible`)
    assert.equal(await restored.getAttribute('data-t'), '0.37')
  }
 }
 for(const [n,c] of [[conditionalSlide,4],[marginalSlide,3]]){
  await go(n,c,'&tools');await demo().getByRole('slider').fill('0.2');const pen=page.getByRole('navigation',{name:'Lecture annotation tools'}).getByRole('button',{name:'Pen',exact:true});if(await pen.getAttribute('aria-pressed')!=='true')await pen.click()
  const box=await demo().getByRole('button',{name:'Reset',exact:true}).boundingBox(),cdp=await context.newCDPSession(page)
  for(const type of ['mousePressed','mouseReleased'])await cdp.send('Input.dispatchMouseEvent',{type,x:box.x+box.width/2,y:box.y+box.height/2,button:'left',buttons:type==='mousePressed'?1:0,clickCount:1,pointerType:'pen'})
  await cdp.detach();assert.equal(await demo().getAttribute('data-t'),'0.5');await pen.click()
  await go(n,c,'&print');await snap(`${n}-print`);assert.equal(await demo().locator('.demo-controls').count(),0)
 }
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.deepEqual(states.filter(s=>s.overlap.length),[],'Content overlaps sources');console.log(`${states.length} states passed`)
}finally{writeFileSync(resolve(out,'report.json'),JSON.stringify({states,errors,external},null,2));await browser.close()}
