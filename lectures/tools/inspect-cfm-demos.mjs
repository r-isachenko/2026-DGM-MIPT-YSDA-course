import { chromium } from 'playwright-chromium'
import { resolve } from 'node:path'
import { mkdirSync,writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { lecturePaths, readSlides } from './course.mjs'

const slides = readSlides(lecturePaths(11))
const denoiserSlide = slides.find(slide => slide.id === 'one-denoiser-prediction-one-euler-step').slide
const transportSlide = slides.find(slide => slide.id === 'nonunique-transport-paths').slide
const posteriorSlide = slides.find(slide => slide.id === 'conditional-vector-field').slide
const constructionSlide = slides.find(slide => slide.id === 'from-marginal-to-conditional-paths').slide
const endpointSlide = slides.find(slide => slide.id === 'one-sided-conditioning').slide
const base=process.env.SLIDEV_QA_URL||'http://localhost:3041',out=resolve('output/qa/lecture11/cfm-demos');mkdirSync(out,{recursive:true})
const browser=await chromium.launch({executablePath:process.env.SLIDEV_BROWSER_PATH||'/Applications/Yandex.app/Contents/MacOS/Yandex',headless:true})
const context=await browser.newContext({viewport:{width:1280,height:720}}),page=await context.newPage(),errors=[],external=[],states=[]
page.on('pageerror',e=>errors.push(String(e)))
await context.route('**/*',r=>{const u=new URL(r.request().url());if(['http:','https:'].includes(u.protocol)&&u.origin!==new URL(base).origin){external.push(u.href);return r.abort()}return r.continue()})
async function go(n,click=0,extra=''){await page.goto(`${base}/${n}?clicks=${click}${extra}`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready)}
async function snap(name){await page.mouse.move(1270,10);await page.screenshot({path:resolve(out,`${name}.png`)});const geometry=await page.locator('.slidev-layout:visible').evaluate(l=>{const source=l.querySelector('.source').getBoundingClientRect();return [...l.children].filter(e=>!e.classList.contains('source')).map(e=>({tag:e.tagName,bottom:e.getBoundingClientRect().bottom,source:source.top})).filter(e=>e.bottom>source.top-8)});states.push({name,geometry});assert.equal(await page.locator('.katex-error:visible').count(),0)}
try{
 await go(denoiserSlide)
 const denoiser = page.locator(`[data-slidev-no="${denoiserSlide}"] [data-demo="denoiser-step"]:visible`)
 const step = denoiser.getByRole('button', { name: 'Step', exact: true })
 const reset = denoiser.getByRole('button', { name: 'Reset', exact: true })
 const ratio = denoiser.getByRole('slider', { name: 'Noise ratio' })
 for (const preset of ['Between modes', 'Near left', 'Near right']) {
   await denoiser.getByRole('button', { name: preset, exact: true }).click()
   for (const fraction of ['0', '0.5', '0.9']) {
     await ratio.fill(fraction)
     assert.equal(await denoiser.getAttribute('data-ratio'), fraction)
     assert.equal(await denoiser.evaluate(el => /NaN|Infinity/.test(el.innerHTML)), false)
     await snap(`denoiser-${preset.replaceAll(' ', '-')}-${fraction}`)
   }
 }
 await reset.click()
 await ratio.focus()
 const denoiserUrl = page.url()
 await page.keyboard.press('ArrowLeft')
 assert.equal(page.url(), denoiserUrl)
 assert.equal(await denoiser.getAttribute('data-ratio'), '0.45')
 await reset.click()
 for (let i = 0; i < 5; i++) await step.click()
 await snap('denoiser-five-steps')
 const savedState = await denoiser.evaluate(el => ({ ...el.dataset }))
 await page.locator('.slidev-layout:visible h1').click()
 await page.keyboard.press('ArrowRight')
 await page.waitForURL(url => url.pathname === `/${denoiserSlide + 1}`)
 await page.keyboard.press('ArrowLeft')
 await page.waitForURL(url => url.pathname === `/${denoiserSlide}`)
 assert.deepEqual(await denoiser.evaluate(el => ({ ...el.dataset })), savedState)
 await ratio.fill('0')
 await step.click()
 assert.equal(await denoiser.getAttribute('data-sigma'), '0')
 assert.ok(await step.isDisabled())
 await snap('denoiser-terminal')
 await reset.click()
 for (let i = 0; i < 12; i++) await step.click()
 assert.ok(await step.isDisabled())
 await snap('denoiser-limit')
 await go(transportSlide)
 const transport = page.locator('.slidev-layout:visible [data-demo="transport-paths"]')
 assert.equal(await transport.locator('svg').count(), 3)
 for (const time of ['0', '0.25', '0.5', '0.75', '1']) {
   await transport.getByRole('button', { name: time, exact: true }).click()
   assert.equal(await transport.getAttribute('data-t'), time)
   assert.equal(await transport.evaluate(el => /NaN|Infinity/.test(el.innerHTML)), false)
   await snap(`transport-${time}`)
 }
 await transport.getByRole('slider').focus()
 const transportUrl = page.url()
 await page.keyboard.press('ArrowLeft')
 assert.equal(page.url(), transportUrl)
 assert.equal(await transport.getAttribute('data-t'), '0.99')
 await transport.getByRole('slider').fill('0.37')
 await page.locator('.slidev-layout:visible h1').click()
 await page.keyboard.press('ArrowRight')
 await page.waitForURL(url => url.pathname === `/${transportSlide + 1}`)
 await page.keyboard.press('ArrowLeft')
 await page.waitForURL(url => url.pathname === `/${transportSlide}`)
 assert.equal(await transport.getAttribute('data-t'), '0.37')
 await transport.getByRole('button', { name: 'Reset', exact: true }).click()
 assert.equal(await transport.getAttribute('data-t'), '0.5')

 for(const [n,max] of [[posteriorSlide,2],[constructionSlide,3],[endpointSlide,3]]){for(let c=0;c<=max;c++){await go(n,c);await snap(`${n}-${c}`)}}
 await go(posteriorSlide,1);const hidden=()=>page.locator('[data-demo="posterior-velocity"]').evaluate(e=>e.classList.contains('slidev-vclick-hidden'));assert.equal(await hidden(),true);await page.keyboard.press('ArrowRight');assert.equal(await hidden(),false);await page.keyboard.press('ArrowLeft');assert.equal(await hidden(),true);
 await go(posteriorSlide,2);let d=page.locator('[data-demo="posterior-velocity"]:visible');
 for(const [label,x] of [['Near cloud 1',-1.4],['Near cloud 2',1.4],['Reset',0]]){await d.getByRole('button',{name:label,exact:true}).click();const w=1/(1+Math.exp(2*x/.81)),v=(await d.getAttribute('data-marginal')).split(',').map(Number);assert.ok(Math.abs(Number(await d.getAttribute('data-weight'))-w)<1e-12);assert.ok(Math.abs(v[0]-(1.6*w-.8))<1e-12);assert.equal(v[1],.75);await snap(`posterior-${x}`)}
 const handle=d.locator('[data-handle]');await handle.focus();const posteriorUrl=page.url();await page.keyboard.press('ArrowLeft');assert.equal(page.url(),posteriorUrl);assert.equal(await d.getAttribute('data-point'),'-0.1,0');await page.keyboard.press('Home');assert.equal(await d.getAttribute('data-weight'),'0.5');
 const box=await handle.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+60,box.y+box.height/2-10,{steps:8});await page.mouse.up();assert.ok(Number(await d.getAttribute('data-weight'))<.5);await snap('posterior-drag');await d.getByRole('button',{name:'Reset',exact:true}).click();
 const before=await d.getAttribute('data-weight');await page.locator('.slidev-layout:visible h1').click();await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowLeft');assert.equal(await d.getAttribute('data-weight'),before);
 await go(endpointSlide,3);d=page.locator('[data-demo="endpoint-path"]:visible');for(const t of ['0','0.5','0.95','1']){await d.getByRole('slider').fill(t);await snap(`endpoint-${t}`);assert.equal(await d.locator('[data-cone]').count(),3);for(const cone of await d.locator('[data-cone]').all()){assert.equal(+(await cone.getAttribute('data-sigma')),1-Number(t));assert.equal(+(await cone.getAttribute('data-mean')),Number(t)*Number(await cone.getAttribute('data-endpoint'))||0);}assert.equal(await d.evaluate(e=>/NaN|Infinity/.test(e.innerHTML)),false)}
 await d.getByRole('slider').focus();const url=page.url();await page.keyboard.press('ArrowLeft');assert.equal(page.url(),url);assert.equal(await d.getAttribute('data-t'),'0.99');await d.getByRole('button',{name:'Reset',exact:true}).click();assert.equal(await d.getAttribute('data-t'),'0.5');
 // Browser return keeps the endpoint control; reveal navigation remains reversible.
 await page.locator('.slidev-layout:visible h1').click();await page.keyboard.press('ArrowRight');await page.keyboard.press('ArrowLeft');assert.equal(await d.getAttribute('data-t'),'0.5');
 await go(constructionSlide,2);assert.equal(await page.locator('[data-marginal-construction]:visible').count(),1);await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('[data-marginal-construction]:visible').count(),0);await page.keyboard.press('ArrowRight');assert.equal(await page.locator('[data-marginal-construction]:visible').count(),1);
 for(const [n,c] of [[denoiserSlide,0],[transportSlide,0],[posteriorSlide,2],[endpointSlide,3]]){
  await go(n,c,'&tools');const demo=page.locator('[data-demo]:visible')
  if (n === denoiserSlide) await demo.getByRole('button', { name: 'Step', exact: true }).click()
  if (n === transportSlide) await demo.getByRole('slider').fill('0.25')
  const pen=page.getByRole('navigation',{name:'Lecture annotation tools'}).getByRole('button',{name:'Pen',exact:true});
  if(await pen.getAttribute('aria-pressed')!=='true')await pen.click();
  const button=await demo.getByRole('button',{name:'Reset',exact:true}).boundingBox(),cdp=await context.newCDPSession(page);
  for(const type of ['mousePressed','mouseReleased'])await cdp.send('Input.dispatchMouseEvent',{type,x:button.x+button.width/2,y:button.y+button.height/2,button:'left',buttons:type==='mousePressed'?1:0,clickCount:1,pointerType:'pen'});
  await cdp.detach();
  if (n === denoiserSlide) assert.equal(await demo.getAttribute('data-n'), '0')
  if (n === transportSlide) assert.equal(await demo.getAttribute('data-t'), '0.5')
  await snap(`pen-${n}`);await pen.click();
 }
 for(const [n,c] of [[denoiserSlide,0],[transportSlide,0],[posteriorSlide,2],[constructionSlide,3],[endpointSlide,3]]){await go(n,c,'&print');await snap(`print-${n}`);assert.equal(await page.locator('[data-demo]:visible .demo-controls').count(),0)}
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.deepEqual(states.filter(s=>s.geometry.length),[],'Content overlaps footer');console.log(`${states.length} states passed`)
}finally{writeFileSync(resolve(out,'report.json'),JSON.stringify({states,errors,external},null,2));await browser.close()}
