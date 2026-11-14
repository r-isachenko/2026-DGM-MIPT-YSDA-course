import test from 'node:test'
import assert from 'node:assert/strict'
import { denoiser, denoiserStep } from '../lecture11/lib/denoiser.mjs'
import { transport } from '../lecture11/lib/transport.mjs'
import {conditionalVelocities,averageVelocity,cloudDensity,cloudSigma,posteriorWeight,particles,endpoint,interpolate,density} from '../lecture11/lib/cfm-demos.mjs'
const close=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<tol,`${a} != ${b}`)
test('posterior mean minimizes the conditional squared error',()=>{
 for(const w of [0,.1,.5,.9,1]){
  const mean=averageVelocity(w)
  const loss=v=>[w,1-w].reduce((sum,p,i)=>sum+p*conditionalVelocities[i].reduce((s,c,k)=>s+(c-v[k])**2,0),0)
  for(const delta of [[.2,0],[0,-.3],[-1,2]]){
   const candidate=mean.map((m,i)=>m+delta[i])
   close(loss(candidate)-loss(mean),delta.reduce((s,x)=>s+x*x,0))
  }
 }
})
test('fixed-noise trajectories have constant endpoint velocity and Gaussian moments',()=>{
 for(const x0 of particles){close(interpolate(x0,0),x0);close(interpolate(x0,1),endpoint);for(const t of [.1,.5,.9])close((interpolate(x0,t+1e-4)-interpolate(x0,t-1e-4))/2e-4,endpoint-x0)}
 for(const t of [0,.5,.9]){let mass=0,mean=0,second=0;const dx=.0005;for(let x=-9;x<9;x+=dx){const m=density(x,t)*dx;mass+=m;mean+=m*x;second+=m*x*x}close(mass,1,1e-6);close(mean,t*endpoint,1e-6);close(second-mean*mean,(1-t)**2,1e-6)}
})


test('three cones share the same variance and reach their own endpoint',()=>{
 for(const a of [-2,0,2])for(const t of [0,.5,.95,1]){
  close(interpolate(0,t,a),t*a)
  close(interpolate(2,t,a)-interpolate(-2,t,a),4*(1-t))
  if(t===1)close(interpolate(-1.96,t,a),a)
 }
})

test('a point-mass endpoint has no ordinary Gaussian density',()=>{
 assert.throws(()=>density(endpoint,1),RangeError)
})


test('posterior weights come from Bayes and favor the nearer cloud',()=>{
 close(posteriorWeight([0,0]),.5)
 for(const x of [-2.3,-1.4,0,.8,2.3])for(const y of [-.6,0,.6]){
  const w=posteriorWeight([x,y]);close(w,1/(1+Math.exp(2*x/cloudSigma**2)))
  close(posteriorWeight([-x,y]),1-w)
  assert.ok(w>0&&w<1)
 }
})
test('translating clouds and their posterior velocity satisfy continuity',()=>{
 const h=1e-5
 const mixture=(x,t)=>.5*(cloudDensity(x,0,t)+cloudDensity(x,1,t))
 const flux=(x,t,k)=>.5*conditionalVelocities.reduce((sum,v,i)=>sum+cloudDensity(x,i,t)*v[k],0)
 for(const x of [[-1.4,0],[0,0],[.8,.4]]){
  const dt=(mixture(x,.5+h)-mixture(x,.5-h))/(2*h)
  const div=[0,1].reduce((s,k)=>{const a=[...x],b=[...x];a[k]+=h;b[k]-=h;return s+(flux(a,.5,k)-flux(b,.5,k))/(2*h)},0)
  close(dt+div,0)
  averageVelocity(posteriorWeight(x)).forEach((v,k)=>close(v*mixture(x,.5),flux(x,.5,k)))
 }
})

test('straight training paths have the fixed endpoint-difference velocity',async()=>{
 const {trainingPairs,conditionalPosition}=await import('../lecture11/lib/path-comparison.mjs')
 trainingPairs.forEach((p,i)=>{
  close(conditionalPosition(i,0),p.x0);close(conditionalPosition(i,1),p.x1)
  for(const t of [.1,.5,.9])close((conditionalPosition(i,t+1e-5)-conditionalPosition(i,t-1e-5))/2e-5,p.x1-p.x0)
 })
})
test('integrated marginal ODE preserves quantiles and particle order',async()=>{
 const {pathCDF,odePaths,integrationSteps,trainingPairs}=await import('../lecture11/lib/path-comparison.mjs')
 for(let k=0;k<=integrationSteps;k+=8){
  const t=k/integrationSteps
  odePaths.forEach((p,i)=>{
   close(pathCDF(p[k],t),(i+.5)/odePaths.length,2e-6)
   if(i)assert.ok(p[k]>odePaths[i-1][k])
  })
 }
 const final=odePaths.map(p=>p.at(-1)),target=trainingPairs.map(p=>p.x1).sort((a,b)=>a-b)
 final.forEach((x,i)=>close(x,target[i],2e-6))
 assert.ok(odePaths.some(p=>Math.abs(p[integrationSteps/2]-(p[0]+p.at(-1))/2)>.2),'sampling trajectories should visibly curve')
})

test('Transport flows share endpoints, stay invertible, and have distinct intermediate paths',()=>{
 for(const z of [[0,0],[1,2],[-2,1]])for(const mode of ['Detour','Rotation'])for(const t of [0,1])transport(z,t,mode).forEach((v,i)=>close(v,transport(z,t)[i]));
 for(const t of [0,.2,.5,.8,1])for(const mode of ['Direct','Detour','Rotation']){const origin=transport([0,0],t,mode),a=transport([1,0],t,mode).map((v,i)=>v-origin[i]),b=transport([0,1],t,mode).map((v,i)=>v-origin[i]);close(a[0]*b[1]-a[1]*b[0],(1-.45*t)*(1-.2*t))}
 assert.notDeepEqual(transport([1,0],.5),transport([1,0],.5,'Rotation'));assert.notDeepEqual(transport([0,0],.5),transport([0,0],.5,'Detour'))
})

test('Denoiser Euler step is interpolation and terminates safely at zero noise',()=>{
 for(const x of [[0,2.4],[-3,1.5],[3,2]])for(const sigma of [.01,.5,2.5])for(const r of [0,.25,.9,1]){const d=denoiser(x,sigma),actual=denoiserStep(x,sigma,r*sigma);actual.forEach((a,i)=>close(a,x[i]+(r*sigma-sigma)*(x[i]-d[i])/sigma));if(r===0)assert.deepEqual(actual,d)}
 assert.deepEqual(denoiserStep([1,2],0,0),[1,2])
})
