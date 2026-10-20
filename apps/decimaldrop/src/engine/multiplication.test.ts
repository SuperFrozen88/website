import { it,expect } from 'vitest';
import { multiplicationBank,multiplicationSkills,multiplicationQuestion } from './multiplication';
import { multiplyExact,validAnswer,parseDecimal } from './decimal';
import { generateQuestion,validateQuestion } from './questions';
import { emptyProgress,startSession,submitDraft,advance,switchUnit } from './session';
import { assess,readiness } from './assessment';
import { importProgress } from './storage';
import { units } from './units';
import type { Progress } from './types';
const finish=(p:Progress)=>{while(p.active){const q=p.active.questions[p.active.responses.length];p=advance(submitDraft(p,q.answer,30,''),30);}return p;};
it('multiplies exactly beyond thousandths while preserving historical input rules',()=>{
 expect(multiplyExact('0.125','0.125')).toBe('0.015625');expect(multiplyExact('0.001','0.001')).toBe('0.000001');expect(multiplyExact('1.20','0.35')).toBe('0.42');expect(multiplyExact('-2.5','0.04')).toBe('-0.1');
 const q=generateQuestion('mul-decimal',3);expect(validAnswer(q.answer+'000',q)).toBe(true);expect(validAnswer(q.answer+'1',q)).toBe(false);expect(validAnswer('1e2',q)).toBe(false);expect(parseDecimal('0.0001')).toBeNull();expect(validAnswer('4.50000',generateQuestion('equivalent',0))).toBe(false);
 const tiny=generateQuestion('mul-zeros',3);expect(()=>submitDraft({...emptyProgress(),active:{...startSession(emptyProgress(),'quick',['mul-zeros'],'multiplication').active!,questions:[tiny]}},tiny.answer,1,'')).not.toThrow();
});
it('provides 192 unique, validated questions with reproducible exact proofs and meaningful metadata',()=>{
 expect(multiplicationBank).toHaveLength(192);expect(new Set(multiplicationBank.map(q=>q.text)).size).toBe(192);
 for(const s of multiplicationSkills){const pool=multiplicationBank.filter(q=>q.skill===s.id);expect(new Set(pool.map(q=>q.family)).size).toBe(4);expect(pool.every(q=>q.difficulty>=1&&q.difficulty<=3)).toBe(true);
 for(let seed=0;seed<1000;seed++){const q=multiplicationQuestion(s.id,seed);expect(validateQuestion(q)).toBe(true);expect(validAnswer(q.answer,q)).toBe(true);expect(q.proof.exact).toBe(multiplyExact(q.proof.operands![0],q.proof.operands![1]));expect(q.solution).toContain(q.answer);expect(q.hint.length).toBeGreaterThan(20);if(q.choices)expect(new Set(q.choices).size).toBe(4);}
 }
 const q=structuredClone(multiplicationBank[0]);q.answer='999';expect(validateQuestion(q)).toBe(false);
});
it('covers all multiplication skills in each discovery quiz with no repeats across three quizzes',()=>{let p=emptyProgress();for(let i=0;i<3;i++){p=finish(startSession(p,'standard',[],'multiplication'));expect(new Set(p.sessions[i].questions.map(q=>q.skill)).size).toBe(12);}const qs=p.sessions.flatMap(s=>s.questions);expect(new Set(qs.map(q=>q.id)).size).toBe(36);expect(startSession(p,'standard',[],'multiplication').active!.diagnostic).toBe(false);expect(startSession(p,'standard',[],'decimals').active!.diagnostic).toBe(true);expect(readiness(assess(p,Date.now(),'multiplication')).label).toBe('Ready');expect(assess(p).every(e=>!e.total)).toBe(true);expect(importProgress(JSON.stringify(p))).toEqual(p);});
it('every new skill can attain Mastered with sustained independent varied evidence',()=>{let p=emptyProgress();for(const s of multiplicationSkills)for(let i=0;i<3;i++)p=finish(startSession(p,'quick',[s.id],'multiplication'));expect(assess(p,Date.now(),'multiplication').map(e=>e.status)).toEqual(multiplicationSkills.map(()=>'Mastered'));});
it('one answer cannot establish proficiency or readiness',()=>{let p=startSession(emptyProgress(),'standard',[],'multiplication');p=advance(submitDraft(p,p.active!.questions[0].answer,20,''),20,true);expect(assess(p,Date.now(),'multiplication')[0].status).toBe('Not Assessed');expect(readiness(assess(p,Date.now(),'multiplication')).label).toBe('Needs Work');});
it('round trips all four unfinished missions and legacy saves without changing XP or drafts',()=>{let p=emptyProgress();const ids=new Map();for(const u of units){p=switchUnit(p,u.id);p=startSession(p,'standard',[],u.id);p.active!.draft.answer='0.1200';p.active!.draft.work=u.id;ids.set(u.id,p.active!.id);}expect(p.paused).toHaveLength(3);p=importProgress(JSON.stringify(p));for(const u of units){p=switchUnit(p,u.id);expect(p.active!.id).toBe(ids.get(u.id));expect(p.active!.draft.work).toBe(u.id);}let old=startSession(emptyProgress(),'standard');delete old.active!.unit;delete old.selectedUnit;old.xp=875;expect(importProgress(JSON.stringify(old))).toEqual(old);});

it('checks representative task answers against independent fixtures',()=>{
 const fixtures:[string,number,string][]=[['whole',0,'2.4'],['whole',1,'1.5'],['decimal',3,'0.0204'],['model',0,'0.04'],['model',1,'4.5'],['model',2,'9'],['estimate',0,'4'],['estimate',3,'6'],['zeros',3,'0.0675'],['measure',2,'14.4'],['missing',0,'1.2']];
 for(const [id,seed,expected] of fixtures)expect(generateQuestion('mul-'+id,seed).answer,`${id}:${seed}`).toBe(expected);
 for(const q of multiplicationBank.filter(q=>q.kind==='numeric'&&!['mul-estimate','mul-missing'].includes(q.skill)&&!(q.skill==='mul-whole'&&Number(q.id.split(':')[1])%4===1))){
 const [a,b]=q.proof.operands!;const read=(s:string)=>{const [w,f='']=s.split('.');return {n:BigInt(w+f),d:10n**BigInt(f.length)};};
 const x=read(a),y=read(b),z=read(q.answer);const v=Number(q.id.split(':')[1])%4;const copies=q.skill==='mul-measure'&&v>=2?BigInt(v===2?2:3):1n;
 expect(z.n*x.d*y.d).toBe(x.n*y.n*z.d*copies);
 }
});
