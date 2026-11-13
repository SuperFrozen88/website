import { it,expect } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import prior from './fixtures/pre-foodwebs-questions.json';
import priorSave from './fixtures/pre-plants-save.json';
import { foodWebSkills,foodWebsUnit } from './foodwebs';
import { scienceBank,scienceQuestion } from './science';
import { generateQuestion,validateQuestion } from './questions';
import { emptyProgress,startSession,advance,submitDraft,switchUnit } from './session';
import { assess,readiness } from './assessment';
import { importProgress } from './storage';
import { units,unitOfSkill } from './units';
import type { Progress } from './types';
const respond=(p:Progress)=>{const q=p.active!.questions[p.active!.responses.length];return advance(submitDraft(p,q.answer,30,'Food web evidence'),30);};
const complete=(p:Progress)=>{while(p.active)p=respond(p);return p;};
const bank=scienceBank.filter(q=>q.skill.startsWith('web-'));
it('provides 143 distinct validated food web questions across 12 skills',()=>{
 expect(bank).toHaveLength(143);expect(new Set(bank.map(q=>q.text)).size).toBe(143);expect(foodWebSkills).toHaveLength(12);
 for(const s of foodWebSkills){const pool=bank.filter(q=>q.skill===s.id);expect(pool.length,s.id).toBeGreaterThanOrEqual(10);expect(new Set(pool.map(q=>q.family)).size).toBeGreaterThanOrEqual(3);expect(pool.some(q=>q.difficulty===3)).toBe(true);
  for(const q of pool){expect(validateQuestion(q)).toBe(true);expect(unitOfSkill(q.skill)).toBe('foodwebs');expect(new Set(q.choices).size).toBe(4);expect(q.choices!.filter(a=>a===q.answer)).toHaveLength(1);expect(q.hint.length).toBeGreaterThan(20);expect(q.solution.length).toBeGreaterThan(40);expect(q.source).toContain('Family-provided Food Chains');}}
 expect(foodWebsUnit.intel).toHaveLength(12);expect(foodWebsUnit.verified).toBe(true);
});
it('checks key food web facts against explicit answers',()=>{
 const find=(t:string)=>bank.find(q=>q.text.includes(t))!.answer;
 expect(find('first come from')).toBe('The Sun');
 expect(find('from the lesson is in the correct order')).toBe('Grass → grasshopper → mouse → snake → hawk');
 expect(find('between grass and a grasshopper')).toBe('From the grass to the grasshopper');
 expect(find('make which two things')).toBe('Oxygen and sugar');
 expect(find('eats only plants')).toBe('Herbivore');
 expect(find('What do decomposers eat')).toBe('Dead organisms');
 expect(find('one-way street')).toContain('not back');
 expect(find('one planned difference')).toContain('earthworms');
 expect(find('What are the bacteria called')).toBe('Decomposers');
 expect(()=>scienceQuestion('web-why',10)).toThrow();
});
it('leaves all 484 earlier science and social studies question definitions unchanged',()=>{
 expect(prior.questionHashes).toHaveLength(484);
 for(const r of prior.questionHashes){const [s,n]=r.id.split(':');expect(createHash('sha256').update(JSON.stringify(generateQuestion(s,Number(n)))).digest('hex'),r.id).toBe(r.sha256);}
});
it('covers all twelve skills in each of three diagnostics without repeats and keeps evidence separate',()=>{
 let p=emptyProgress();
 for(let i=0;i<3;i++){p=complete(startSession(p,'standard',[],'foodwebs'));expect(p.sessions[i].diagnostic).toBe(true);expect(new Set(p.sessions[i].questions.map(q=>q.skill)).size).toBe(12);}
 expect(new Set(p.sessions.flatMap(s=>s.questions.map(q=>q.id))).size).toBe(36);
 expect(readiness(assess(p,Date.now(),'foodwebs')).label).toBe('Ready');
 for(const u of units.filter(u=>u.id!=='foodwebs'))expect(assess(p,Date.now(),u.id).every(e=>e.total===0)).toBe(true);
 expect(importProgress(JSON.stringify(p))).toEqual(p);
});
it('builds a 20-question practice test with no skill more than twice',()=>{
 const p=startSession(emptyProgress(),'test',[],'foodwebs');const qs=p.active!.questions;
 expect(qs).toHaveLength(20);expect(new Set(qs.map(q=>q.id)).size).toBe(20);
 for(const s of foodWebSkills){const n=qs.filter(q=>q.skill===s.id).length;expect(n).toBeGreaterThanOrEqual(1);expect(n).toBeLessThanOrEqual(2);}
 expect(importProgress(JSON.stringify(complete(p))).sessions[0].responses).toHaveLength(20);
});
it('lets every food web skill reach Mastered with sustained independent work',()=>{
 let p=emptyProgress();for(const s of foodWebSkills)for(let i=0;i<3;i++)p=complete(startSession(p,'quick',[s.id],'foodwebs'));
 expect(assess(p,Date.now(),'foodwebs').every(e=>e.status==='Mastered')).toBe(true);
});
it('parks an older save’s missions and restores them alongside a new food web mission',()=>{
 let p=importProgress(JSON.stringify(priorSave.progress));const old=[p.active!,...p.paused!];
 p=switchUnit(p,'foodwebs');p=startSession(p,'standard',[],'foodwebs');p.active!.draft.work='food web draft';
 p=importProgress(JSON.stringify(p));
 for(const s of old){p=switchUnit(p,s.unit!);expect(p.active).toEqual(s);}
 p=switchUnit(p,'foodwebs');expect(p.active!.draft.work).toBe('food web draft');expect(p.xp).toBe(priorSave.progress.xp);
});
it('archives all 10 lesson pages without changing their bytes',()=>{
 const dir=new URL('../../docs/reference/food-webs-2026-11-12/',import.meta.url);
 const m=JSON.parse(readFileSync(new URL('manifest.json',dir),'utf8')) as {count:number;files:{filename:string;bytes:number;sha256:string}[]};
 expect(m.count).toBe(10);
 for(const f of m.files){const b=readFileSync(new URL('pages/'+f.filename,dir));expect(b.length).toBe(f.bytes);expect(createHash('sha256').update(b).digest('hex')).toBe(f.sha256);}
 for(const q of JSON.parse(readFileSync(new URL('./foodwebs-bank.json',import.meta.url),'utf8')) as {photoNumbers:number[]}[])for(const n of q.photoNumbers)expect(n>=1&&n<=10).toBe(true);
});
