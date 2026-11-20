import { it,expect } from 'vitest';
import { divisionBank,divisionSkills,divisionQuestion,divisionUnit,divisionTestMap } from './division';
import { divideExact,multiplyExact,addExact,validAnswer } from './decimal';
import { generateQuestion,validateQuestion } from './questions';
import { emptyProgress,startSession,submitDraft,advance } from './session';
import { assess,readiness } from './assessment';
import { importProgress } from './storage';
import { unitOfSkill } from './units';
import type { Progress } from './types';
const finish=(p:Progress)=>{while(p.active){const q=p.active.questions[p.active.responses.length];p=advance(submitDraft(p,q.answer,30,''),30);}return p;};

it('divides exactly and reports non-terminating quotients',()=>{
 expect(divideExact('9.52','2.8')).toBe('3.4');expect(divideExact('1.4','0.05')).toBe('28');expect(divideExact('22.8','15')).toBe('1.52');expect(divideExact('35.5','100')).toBe('0.355');expect(divideExact('1','3')).toBeNull();expect(divideExact('1','0')).toBeNull();
 expect(addExact('28.50','1.34',-1)).toBe('27.16');expect(addExact('0.1','0.2')).toBe('0.3');
});

it('provides 192 unique, validated questions whose quotients check by multiplication',()=>{
 expect(divisionSkills).toHaveLength(12);expect(divisionBank).toHaveLength(192);expect(new Set(divisionBank.map(q=>q.text)).size).toBe(192);
 for(const s of divisionSkills){
  expect(unitOfSkill(s.id)).toBe('division');expect(divisionTestMap[s.id]).toBeTruthy();
  const pool=divisionBank.filter(q=>q.skill===s.id);expect(new Set(pool.map(q=>q.family)).size).toBe(4);
  for(let seed=0;seed<1000;seed++){
   const q=divisionQuestion(s.id,seed);
   expect(validateQuestion(q)).toBe(true);expect(validAnswer(q.answer,q)).toBe(true);expect(q.solution).toContain(q.answer);expect(q.hint.length).toBeGreaterThan(20);
   const [a,b]=q.proof.operands!;expect(multiplyExact(q.proof.exact!,b)).toBe(multiplyExact(a,'1'));
   if(q.choices)expect(new Set(q.choices).size).toBe(4);
  }
 }
 const q=structuredClone(divisionBank[0]);q.answer='999';expect(validateQuestion(q)).toBe(false);
});

it('accepts equivalent typed forms such as trailing zeros and dollar signs',()=>{
 const q=generateQuestion('div-money',0);expect(q.answer).toBe('0.31');for(const typed of ['0.31','.31','0.310','$0.31'])expect(validAnswer(typed,q)).toBe(true);expect(validAnswer('0.3',q)).toBe(false);
});

it('matches answers worked independently from the question text',()=>{
 const fixtures:[string,number,string][]=[
  ['powers',0,'1.25'],['powers',1,'0.138'],['patterns',0,'1.35'],['model-whole',1,'12'],['whole',3,'1.32'],['model-decimal',1,'3'],
  ['decimal',2,'1.5'],['decimal',3,'3'],['zeros',2,'0.75'],['money',0,'0.31'],['groups',1,'2.7'],['groups',3,'10.35'],['check',0,'2.1'],
 ];
 for(const [id,seed,expected] of fixtures)expect(generateQuestion('div-'+id,seed).answer,`${id}:${seed}`).toBe(expected);
 expect(generateQuestion('div-estimate',2).answer).toBe('About $0.50');
 expect(generateQuestion('div-groups',2).answer).toBe('$2.70');
});

it('decides when a zero must be written in the dividend like the textbook examples',()=>{
 for(let seed=1;seed<400;seed+=4){
  const q=divisionQuestion('div-zeros',seed);const [a,b]=q.proof.operands!;
  const shift=10**((b.split('.')[1]||'').length),A=multiplyExact(a,String(shift)),B=multiplyExact(b,String(shift));
  const zero=(a.split('.')[1]||'').length<(b.split('.')[1]||'').length||(divideExact(A,B)!.split('.')[1]||'').length>(A.split('.')[1]||'').length;
  expect(q.answer.startsWith(zero?'Yes':'No'),q.text).toBe(true);
 }
 expect(new Set(Array.from({length:100},(_,i)=>divisionQuestion('div-zeros',1+i*4).answer.split(',')[0])).size).toBe(2);
});

it('every combination question has exactly one answer with at least one of each item',()=>{
 for(let seed=2;seed<2000;seed+=4){
  const q=divisionQuestion('div-money',seed);const prices=[...q.text.matchAll(/\$(\d+\.\d\d)/g)].map(m=>m[1]);const [p1,p2,total]=prices;
  const found:string[]=[];for(let x=1;x<=12;x++)for(let y=1;y<=12;y++)if(addExact(multiplyExact(p1,String(x)),multiplyExact(p2,String(y)))===multiplyExact(total,'1'))found.push(`${x}:${y}`);
  expect(found,q.text).toHaveLength(1);expect(q.answer.startsWith(found[0].split(':')[0]+' paintbrush')).toBe(true);
 }
});

it('covers all twelve skills in each diagnostic quiz, keeps evidence separate, and round-trips saves',()=>{
 let p=emptyProgress();
 for(let i=0;i<3;i++){p=finish(startSession(p,'standard',[],'division'));expect(new Set(p.sessions[i].questions.map(q=>q.skill)).size).toBe(12);}
 expect(new Set(p.sessions.flatMap(s=>s.questions).map(q=>q.id)).size).toBe(36);
 expect(readiness(assess(p,Date.now(),'division')).label).toBe('Ready');
 expect(assess(p,Date.now(),'multiplication').every(e=>!e.total)).toBe(true);
 expect(startSession(p,'standard',[],'multiplication').active!.diagnostic).toBe(true);
 expect(importProgress(JSON.stringify(p))).toEqual(p);
 const test=startSession(emptyProgress(),'test',[],'division').active!;expect(test.questions).toHaveLength(20);expect(new Set(test.questions.map(q=>q.skill)).size).toBe(12);
});

it('every division skill can reach Mastered only with sustained varied evidence',()=>{
 let p=emptyProgress();for(const s of divisionSkills)for(let i=0;i<3;i++)p=finish(startSession(p,'quick',[s.id],'division'));
 expect(assess(p,Date.now(),'division').map(e=>e.status)).toEqual(divisionSkills.map(()=>'Mastered'));
 let one=startSession(emptyProgress(),'standard',[],'division');one=advance(submitDraft(one,one.active!.questions[0].answer,20,''),20,true);
 expect(assess(one,Date.now(),'division')[0].status).toBe('Not Assessed');
});

it('describes the supplied scope and study cards',()=>{
 expect(divisionUnit.verified).toBe(true);expect(divisionUnit.intel).toHaveLength(12);expect(divisionUnit.source).toContain('Chapter 5');
});
