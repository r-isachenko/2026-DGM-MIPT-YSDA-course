import test from 'node:test'
import assert from 'node:assert/strict'
import {
  origins, ddimConfig, sharedNoisePath, posterior, conditionalPaths,
  predictor, ddimStep, ddimTrace, samplePath,
} from '../lecture8/lib/ddim-demo.mjs'

const near = (a,b,tol=1e-11) => assert.ok(Math.abs(a-b)<tol, `${a} != ${b}`)
const normal = (x,mean,variance) => Math.exp(-((x-mean)**2)/(2*variance))/Math.sqrt(2*Math.PI*variance)

test('Toy posterior agrees with Gaussian Bayes conditioning and symmetry', () => {
  for (const u of [.1,.35,.5,.8,1]) for (const x of [-1.2,-.35,0,.35,1.2]) {
    const likelihoods = origins.map(clean=>normal(x,Math.sqrt(1-u)*clean,u))
    const total = likelihoods[0]+likelihoods[1]
    const p = posterior(x,u)
    near(p.weights[0],likelihoods[0]/total)
    near(p.weights[1],likelihoods[1]/total)
    near(p.weights[0]+p.weights[1],1)
    near(p.clean,p.weights[1]-p.weights[0])
    near(p.weights[0],posterior(-x,u).weights[1])
  }
  near(posterior(0,.5).weights[0],.5)
  near(posterior(100,1).clean,0)
})

test('Different clean histories meet at the same observation but fix different forward futures', () => {
  for (const x of [-.8,0,.35,.8]) {
    const paths = conditionalPaths(x,ddimConfig.initialU)
    for (const p of paths) {
      near(sharedNoisePath(p.clean,p.noise,ddimConfig.initialU),x)
      near(sharedNoisePath(p.clean,p.noise,0),p.clean)
      near(sharedNoisePath(p.clean,p.noise,1),p.noise)
    }
    const future = paths.map(p=>sharedNoisePath(p.clean,p.noise,ddimConfig.futureU))
    assert.ok(Math.abs(future[0]-future[1])>.5)
    // Without the history this conditional law has positive variance; revealing
    // either clean origin makes the future a point mass on the selected guide.
    const mean = paths.reduce((sum,p,i)=>sum+p.weight*future[i],0)
    const variance = paths.reduce((sum,p,i)=>sum+p.weight*(future[i]-mean)**2,0)
    assert.ok(variance>0)
  }
})

test('Population predictions reconstruct the current state and average rather than select histories', () => {
  for (const u of [.01,.1,.5,.8,1]) for (const x of [-1.5,-.35,0,.35,1.5]) {
    const p = predictor(x,u)
    near(sharedNoisePath(p.clean,p.noise,u),x)
    const conditional = conditionalPaths(x,u)
    near(p.noise,conditional.reduce((sum,v)=>sum+v.weight*v.noise,0))
    assert.ok(p.clean>=-1 && p.clean<=1)
  }
  assert.deepEqual(predictor(0,.5),{clean:0,noise:0})
  const p=predictor(ddimConfig.initialX,ddimConfig.initialU)
  assert.ok(p.clean>0 && p.clean<1)
})

test('DDIM uses the frozen pair for one step, then recomputes it from the new state', () => {
  const trace=ddimTrace(), initial=trace.steps[0].prediction
  const first=trace.states[1], second=trace.states[2]
  near(first.x,sharedNoisePath(initial.clean,initial.noise,first.u))
  assert.deepEqual(trace.steps[1].prediction,predictor(first.x,first.u))
  assert.ok(Math.abs(trace.steps[1].prediction.clean-initial.clean)>.1)
  const wronglyFrozen=sharedNoisePath(initial.clean,initial.noise,second.u)
  assert.ok(Math.abs(second.x-wronglyFrozen)>.05)
  for (const step of trace.steps) {
    near(sharedNoisePath(step.prediction.clean,step.prediction.noise,step.from.u),step.from.x)
    near(sharedNoisePath(step.prediction.clean,step.prediction.noise,step.to.u),step.to.x)
  }
  near(trace.states.at(-1).x,trace.steps.at(-1).prediction.clean)
})

test('The single-step walkthrough separates choosing a point, moving, and predicting again', () => {
  const {initialX:x,initialU:u}=ddimConfig, nextU=.1
  const cached=predictor(x,u)
  const transition=ddimStep(x,u,nextU)
  const preview=sharedNoisePath(cached.clean,cached.noise,nextU)
  near(preview,transition.to.x)
  near(preview,.4462879872163397)
  assert.deepEqual(transition.from,{x,u})
  assert.deepEqual(transition.prediction,cached)
  // Moving along the cached guide needs neither a new model call nor fresh
  // noise. Predicting again gives a new guide through the same reached point.
  const refreshed=predictor(preview,nextU)
  near(sharedNoisePath(cached.clean,cached.noise,nextU),preview)
  near(sharedNoisePath(refreshed.clean,refreshed.noise,nextU),preview)
  assert.ok(Math.abs(refreshed.clean-cached.clean)>.5)
  assert.ok(Math.abs(refreshed.noise-cached.noise)>1)
  const lowerU=.04
  assert.ok(Math.abs(sharedNoisePath(cached.clean,cached.noise,lowerU)-sharedNoisePath(refreshed.clean,refreshed.noise,lowerU))>.2)
  const actualStep=ddimStep(preview,nextU,lowerU)
  near(actualStep.to.x,sharedNoisePath(refreshed.clean,refreshed.noise,lowerU))
  assert.deepEqual(ddimStep(x,u,nextU),transition,'The transition must be deterministic')
})

test('Sampling depends on the observed state, not on a selected true history, and is reproducible', () => {
  const {initialX:x,initialU:u}=ddimConfig
  const results=conditionalPaths(x,u).map(p=>ddimStep(sharedNoisePath(p.clean,p.noise,u),u,.35))
  near(results[0].to.x,results[1].to.x)
  near(results[0].prediction.clean,results[1].prediction.clean)
  assert.deepEqual(ddimTrace(),ddimTrace())
  // This exact symmetric posterior mean is not either true origin.
  assert.ok(ddimTrace(0).states.every(state=>state.x===0))
})

test('Shared-noise and local predicted guides stay within their supported plot domains', () => {
  const {bounds,initialU}=ddimConfig
  for (let i=0;i<=32;i++) {
    const x=ddimConfig.initialBounds[0]+i*(ddimConfig.initialBounds[1]-ddimConfig.initialBounds[0])/32
    const trace=ddimTrace(x)
    const pairs=[...conditionalPaths(x,initialU).map(p=>({...p,maxU:1})),...trace.states.map(s=>({...predictor(s.x,s.u),maxU:s.u}))]
    for(const pair of pairs) for(const point of samplePath(pair.clean,pair.noise,0,pair.maxU)) {
      assert.ok(Number.isFinite(point.x))
      assert.ok(point.x>=bounds.xmin && point.x<=bounds.xmax)
      assert.ok(point.u>=bounds.umin && point.u<=bounds.umax)
    }
    assert.ok(trace.states.every(state=>Number.isFinite(state.x)))
  }
  assert.deepEqual(predictor(.73,0),{clean:.73,noise:0})
  assert.deepEqual(samplePath(2,-3,0,1,2),[{u:0,x:2},{u:1,x:-3}])
})

test('Invalid levels and backwards-in-noise sampling requests fail before producing NaN', () => {
  assert.throws(()=>posterior(0,0),RangeError)
  assert.throws(()=>predictor(0,-.1),RangeError)
  assert.throws(()=>sharedNoisePath(1,0,1.1),RangeError)
  assert.throws(()=>ddimStep(0,.5,.5),RangeError)
  assert.throws(()=>ddimStep(0,0,0),RangeError)
  assert.throws(()=>ddimTrace(.35,[.5,.7]),RangeError)
  assert.throws(()=>samplePath(0,1,0,1,1),RangeError)
})
