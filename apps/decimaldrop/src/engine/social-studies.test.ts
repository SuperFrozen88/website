import { describe,it,expect } from 'vitest';
import preSocialStudiesSave from './fixtures/pre-social-studies-save.json';
import { socialStudiesBank,socialStudiesSkills,socialStudiesQuestion,explorationUnit } from './social-studies';
import { generateQuestion,validateQuestion } from './questions';
import { units,unitOfSkill } from './units';
import { skillsFor } from './curriculum';
import { validAnswer } from './decimal';
import { emptyProgress,startSession,submitDraft,advance,switchUnit,achievements } from './session';
import { assess,readiness } from './assessment';
import { importProgress,loadProgress,saveProgress,STORAGE_KEY } from './storage';
import type { Progress } from './types';
const respond=(p:Progress)=>{const s=p.active!,q=s.questions[s.responses.length];return advance(submitDraft(p,q.answer,25,'Evidence checked'),25);};
const complete=(p:Progress)=>{while(p.active)p=respond(p);return p;};
describe('TCI Lesson 4 original practice',()=>{
 it('provides 80 distinct prompts with balanced choices, sources, hints and multiple formats per skill',()=>{
 expect(socialStudiesBank).toHaveLength(80);expect(new Set(socialStudiesBank.map(q=>q.text)).size).toBe(80);expect(new Set(socialStudiesBank.map(q=>q.id)).size).toBe(80);
 for(const skill of socialStudiesSkills){const pool=socialStudiesBank.filter(q=>q.skill===skill.id);expect(pool).toHaveLength(8);expect(new Set(pool.map(q=>q.family)).size).toBeGreaterThanOrEqual(3);expect(pool.some(q=>q.difficulty===3)).toBe(true);
 for(const q of pool){expect(unitOfSkill(q.skill)).toBe('exploration');expect(q.kind).toBe('choice');expect(new Set(q.choices).size).toBe(4);expect(validAnswer(q.answer,q)).toBe(true);expect(q.choices!.filter(c=>c===q.answer)).toHaveLength(1);expect(q.hint.length).toBeGreaterThan(20);expect(q.solution.length).toBeGreaterThan(40);expect(q.source).toContain('NPS:');expect(generateQuestion(q.skill,Number(q.id.split(':')[1]))).toEqual(q);expect(validateQuestion(q)).toBe(true);}
 }
 const positions=socialStudiesBank.map(q=>q.choices!.indexOf(q.answer));for(let i=0;i<4;i++)expect(positions.filter(p=>p===i).length).toBeGreaterThan(10);
 expect(()=>socialStudiesQuestion('ss-ocean',8)).toThrow();expect(()=>socialStudiesQuestion('ss-ocean',NaN)).toThrow();expect(()=>socialStudiesQuestion('ss-fake',0)).toThrow();const tampered=structuredClone(socialStudiesBank[0]);tampered.answer='fake';expect(validateQuestion(tampered)).toBe(false);
 });
 it('checks key facts and distinctions, not just choice membership',()=>{
 const find=(skill:string,index:number)=>socialStudiesQuestion('ss-'+skill,index).answer;
 expect(find('overview',0)).toBe('The Americas');expect(find('overview',3)).toBe('Asia');expect(find('ocean',0)).toBe('An astrolabe');expect(find('ocean',6)).toContain('north or south');expect(find('directions',1)).toBe('A magnetic compass');expect(find('directions',2)).toBe('East');expect(find('maps',3)).toContain('left');expect(find('lands',4)).toContain('not proof');expect(find('beliefs',3)).toBe('Christian religious materials were carried on that ship');expect(find('wealth',4)).toContain('crops and trade');expect(find('foods',1)).toBe('Americas → Europe');expect(find('crops',0)).toContain('sell');expect(find('crops',7)).toContain('main purpose is sale');expect(find('artifacts',3)).toContain('more context');
 expect(explorationUnit.verified).toBe(false);expect(explorationUnit.source).toContain('quiz coverage unconfirmed');expect(explorationUnit.sources![0].url).toContain('teachtci.com');expect(explorationUnit.intel.some(c=>c.text.includes('Indigenous'))).toBe(true);
 });
});
describe('fifth-unit assessment and persistence',()=>{
 it('samples all ten skills in discovery, avoids repeats over three quizzes, and keeps evidence independent',()=>{let p=emptyProgress();for(let i=0;i<3;i++){p=complete(startSession(p,'standard',[],'exploration'));expect(p.sessions[i].diagnostic).toBe(true);expect(new Set(p.sessions[i].questions.map(q=>q.skill)).size).toBe(10);}expect(new Set(p.sessions.flatMap(s=>s.questions.map(q=>q.id))).size).toBe(36);expect(readiness(assess(p,Date.now(),'exploration')).label).toBe('Ready');expect(startSession(p,'standard',[],'exploration').active!.diagnostic).toBe(false);for(const u of units.filter(u=>u.id!=='exploration')){expect(assess(p,Date.now(),u.id).every(e=>e.total===0)).toBe(true);expect(startSession(p,'standard',[],u.id).active!.diagnostic).toBe(true);}expect(importProgress(JSON.stringify(p))).toEqual(p);});
 it('uses twenty fixed questions with two per skill in test mode',()=>{let p=startSession(emptyProgress(),'test',[],'exploration');expect(p.active!.questions).toHaveLength(20);for(const s of socialStudiesSkills)expect(p.active!.questions.filter(q=>q.skill===s.id)).toHaveLength(2);p=complete(p);expect(importProgress(JSON.stringify(p))).toEqual(p);});
 it('does not grant readiness from one answer and records a hinted response as supported',()=>{let p=startSession(emptyProgress(),'standard',[],'exploration');p.active!.draft.hinted=true;p=respond(p);const e=assess(p,Date.now(),'exploration');expect(e[0].independent).toBe(0);expect(e[0].status).toBe('Not Assessed');expect(readiness(e).label).toBe('Needs Work');expect(p.active!.responses[0].hinted).toBe(true);});
 it('all ten skills can attain Mastered and unlock the shared badge through sustained varied practice',()=>{let p=emptyProgress();for(const s of socialStudiesSkills)for(let i=0;i<3;i++)p=complete(startSession(p,'quick',[s.id],'exploration'));expect(assess(p,Date.now(),'exploration').every(e=>e.status==='Mastered')).toBe(true);expect(achievements(p).find(a=>a.id==='master')!.unlocked).toBe(true);});
 it('avoids repeating each skill pool until unseen questions have been used',()=>{let p=emptyProgress();for(let i=0;i<2;i++)p=complete(startSession(p,'quick',['ss-artifacts'],'exploration'));const ids=p.sessions.flatMap(s=>s.questions.map(q=>q.id));expect(new Set(ids.slice(0,8)).size).toBe(8);for(const s of p.sessions)expect(new Set(s.questions.map(q=>q.id)).size).toBe(6);});
 it('round trips five unfinished missions, responses, drafts and XP through storage and refresh',()=>{let p=emptyProgress();const expected=new Map();for(const u of units){p=switchUnit(p,u.id);p=startSession(p,'standard',[],u.id);p=respond(p);p.active!.draft.answer='saved draft';p.active!.draft.work=u.id;expected.set(u.id,p.active);}p.xp=1250;expect(p.paused).toHaveLength(4);const store=new Map<string,string>();const storage={getItem:(k:string)=>store.get(k)||null,setItem:(k:string,v:string)=>{store.set(k,v);}};expect(saveProgress(p,storage)).toBeNull();expect(store.has(STORAGE_KEY)).toBe(true);p=loadProgress(storage).progress;expect(p.xp).toBe(1250);for(const u of units){p=switchUnit(p,u.id);expect(p.active).toEqual(expected.get(u.id));}expect(importProgress(JSON.stringify(p))).toEqual(p);});
 it('rejects cross-unit history, corrupted answers, and duplicate unfinished missions',()=>{let p=startSession(emptyProgress(),'quick',[],'exploration');p.active!.unit='matter';expect(()=>importProgress(JSON.stringify(p))).toThrow();p=startSession(emptyProgress(),'quick',[],'exploration');p.active!.questions[0].answer='fake';expect(()=>importProgress(JSON.stringify(p))).toThrow();p=startSession(emptyProgress(),'quick',[],'exploration');p.paused=[structuredClone(p.active!)];expect(()=>importProgress(JSON.stringify(p))).toThrow();expect(skillsFor('exploration')).toHaveLength(10);});
});

it('loads a frozen save produced by pre-Social-Studies commit 5862871 without changing any history',()=>{
 const p=importProgress(JSON.stringify(preSocialStudiesSave));expect(p).toEqual(preSocialStudiesSave);expect(p.xp).toBe(1725);expect(p.sessions).toHaveLength(1);expect(p.paused).toHaveLength(3);expect(assess(p,Date.now(),'exploration').every(e=>e.total===0)).toBe(true);
 const next=switchUnit(p,'exploration');expect(next.active).toBeNull();expect(next.paused).toHaveLength(4);expect(importProgress(JSON.stringify(startSession(next,'quick',[],'exploration'))).paused).toHaveLength(4);
});
