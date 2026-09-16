import assert from 'node:assert/strict'
import { test } from 'node:test'
import { normal, posterior, logEvidence, gaussianKL, elboTerms, elboPresets } from '../lecture3/lib/variational.mjs'

test('ELBO agrees with independent quadrature of the normalized joint model', () => {
  for (const {mean,sigma} of [...elboPresets,{mean:-1,sigma:.45},{mean:2,sigma:1.4}]) {
    let evidence=0, posteriorMass=0, bound=0, gap=0
    const h=.002
    for(let z=-14+h/2;z<14;z+=h) {
      const joint=normal(z)*normal(2,z), q=normal(z,mean,sigma), p=normal(z,posterior.mean,posterior.sigma)
      evidence+=joint*h;posteriorMass+=p*h
      if(q>1e-200){bound+=q*(Math.log(joint)-Math.log(q))*h;gap+=q*(Math.log(q)-Math.log(p))*h}
    }
    const analytic=elboTerms(mean,sigma)
    assert.ok(Math.abs(Math.log(evidence)-logEvidence)<1e-10)
    assert.ok(Math.abs(posteriorMass-1)<1e-10)
    assert.ok(Math.abs(bound-analytic.elbo)<1e-9)
    assert.ok(Math.abs(gap-analytic.gap)<1e-9)
    assert.ok(Math.abs(analytic.elbo+analytic.gap-logEvidence)<1e-12)
  }
})
test('the exact posterior is the tight optimum over the controls', () => {
  const gaps=elboPresets.map(p=>elboTerms(p.mean,p.sigma).gap)
  assert.ok(gaps[0]>gaps[1]&&gaps[1]>gaps[2]);assert.ok(Math.abs(gaps[2])<1e-15)
  for(let m=-1;m<=2;m+=.1) for(let s=.45;s<=1.4;s+=.025) {
    assert.ok(gaussianKL(m,s)>=-1e-12)
    assert.ok(elboTerms(m,s).elbo<=logEvidence+1e-12)
  }
  assert.throws(()=>gaussianKL(0,0),RangeError)
})
