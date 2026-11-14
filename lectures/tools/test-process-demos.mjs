import test from 'node:test'
import assert from 'node:assert/strict'
import { density, score, cdf, quantile, simulation, steps, T, cleanVariance, means } from '../lecture10/lib/process-demos.mjs'
const near=(a,b,tol=1e-5)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`)
test('Mixture score and PF quantile flow satisfy the forward continuity equation',()=>{
 for(const t of [.1,.7,1.9])for(const u of [.01,.2,.5,.8,.99]){const x=quantile(u,t),h=1e-4;near(cdf(x,t),u);near((Math.log(density(x+h,t))-Math.log(density(x-h,t)))/(2*h),score(x,t));near((quantile(u,t+h)-quantile(u,t-h))/(2*h),-score(x,t),2e-4)}
})
test('Exact forward and reverse samplers recover mixture moments and CDFs',()=>{
 for(const reverse of [false,true]){const s=simulation(reverse,42);for(const j of [0,30,steps]){const t=reverse?T*(1-j/steps):T*j/steps,xs=s.sde[j],mean=xs.reduce((a,b)=>a+b,0)/xs.length,v=xs.reduce((a,b)=>a+b*b,0)/xs.length;near(mean,0,.35);near(v,means[0]**2+cleanVariance+2*t,.9);for(const x of [-2,0,2])near(xs.filter(v=>v<=x).length/xs.length,cdf(x,t),.075)}
 assert.deepEqual(s,simulation(reverse,42));assert.deepEqual(s.pf,simulation(reverse,43).pf);assert.notDeepEqual(s.sde,simulation(reverse,43).sde)}
})
