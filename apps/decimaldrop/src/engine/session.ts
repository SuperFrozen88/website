import { units, type UnitId } from './units';
import { socialStudiesBank } from './social-studies';
import { scienceBank } from './science';
import { skills, allSkills, skillsFor, modes, assessmentConfig } from './curriculum';
import { assess, allResponses } from './assessment';
import { generateQuestion,remixBank } from './questions';
import { validAnswer, parseDecimal, decimal, normalizeExact } from './decimal';
import type { Progress, Session, Mode, Question, Response } from './types';
export const emptyProgress=():Progress=>({version:1,sessions:[],active:null,xp:0,sound:false});
const emptyDraft=()=>({answer:'',work:'',hinted:false,answers:[] as string[],elapsed:0});
// Coverage rotation makes the first 12 questions span all seven groups.
const baseline=['digit','round','add-basic','sub-basic','add-regroup','sub-regroup','sub-zeros','compatible','money','error','add-length','missing','equivalent','check','add-thousand','sub-length','add-multi','sub-whole','sub-thousand','break','measure','multistep','alignment','strategy','reasonable','add-whole','compensate','operation','relevant'];
export function selectQuestion(p:Progress,s:Session):Question {
 const unit=s.unit||'decimals', unitSkills=skillsFor(unit);
 const history=allResponses(p), evidence=assess(p,Date.now(),unit);
 const rotation=unit==='decimals'?baseline:unitSkills.map(s=>s.id);
 const used=new Set([...history.map(r=>r.response.question.id),...s.questions.map(q=>q.id)]);
 const counts=new Map(unitSkills.map(skill=>[skill.id,s.questions.filter(q=>q.skill===skill.id).length]));
 const totalCounts=new Map(unitSkills.map(skill=>[skill.id,history.filter(r=>r.response.question.skill===skill.id).length+s.questions.filter(q=>q.skill===skill.id&&!s.responses.some(r=>r.question.id===q.id)).length]));
 const candidates=unitSkills.filter(skill=>(!s.target.length||s.target.includes(skill.id)) && (s.mode==='quick'||(counts.get(skill.id)||0)<2));
 const index=s.questions.length;
 const rank=(id:string)=>{const e=evidence.find(e=>e.skill.id===id)!; const count=counts.get(id)||0;
 if(s.diagnostic||s.mode==='test')return (s.mode==='test'?count:(totalCounts.get(id)||0))*100+rotation.indexOf(id);
 // Every third question checks coverage; weak skills never occupy >2 slots.
 if(index%3===0)return (totalCounts.get(id)||0)*100+rotation.indexOf(id);
 return count*30 + (e.status==='Needs Practice'?0:e.status==='Developing'?8:e.status==='Not Assessed'?10:e.stale?12:20)+rotation.indexOf(id)/100;
 };
 candidates.sort((a,b)=>rank(a.id)-rank(b.id));
 const skill=candidates[0]||unitSkills[0];
 if(unit!=='decimals'&&unit!=='multiplication'){
 const pool=[...scienceBank,...socialStudiesBank].filter(q=>q.skill===skill.id&&!s.questions.some(existing=>existing.id===q.id));
 const families=s.questions.filter(q=>q.skill===skill.id).slice(-2).map(q=>q.family);
 const formatCount=(q:Question)=>history.filter(r=>r.response.question.skill===skill.id&&r.response.question.family===q.family).length;
 const lastSeen=(q:Question)=>history.reduce((last,r,i)=>r.response.question.id===q.id?i:last,-1);
 pool.sort((a,b)=>Number(used.has(a.id))-Number(used.has(b.id)) || formatCount(a)-formatCount(b) || Number(families.includes(a.family))-Number(families.includes(b.family)) || lastSeen(a)-lastSeen(b));
 if(!pool.length)throw new Error('No distinct unit questions remain in this mission');
 return generateQuestion(pool[0].skill,Number(pool[0].id.split(':')[1]));
 }
 const remixes=remixBank.filter(q=>q.skill===skill.id&&!used.has(q.id));
 if(index%2===1&&remixes.length)return generateQuestion(remixes[0].id.split(':')[0],Number(remixes[0].id.split(':')[1]));
 const recentFamilies=s.questions.filter(q=>q.skill===skill.id).slice(-2).map(q=>q.family);
 let seed=0;
 while(used.has(`${skill.id}:${seed}`)||recentFamilies.includes(`${skill.id}-${seed%4}`)){seed++;if(seed>1000000)throw new Error('Question pool safety limit reached');}
 const prior=history.filter(r=>r.response.question.skill===skill.id&&r.response.independent).slice(-3);
 if(prior.length>=2){
 const base=generateQuestion(skill.id,seed).difficulty;
 const lower=prior.slice(-2).every(r=>!r.response.firstCorrect);
 const higher=prior.length===3&&prior.every(r=>r.response.firstCorrect);
 const desired=lower?Math.max(1,prior.at(-1)!.response.question.difficulty-1):higher?Math.min(5,prior.at(-1)!.response.question.difficulty+1):base;
 const options=Array.from({length:24},(_,i)=>seed+i).filter(n=>!used.has(`${skill.id}:${n}`)&&!recentFamilies.includes(`${skill.id}-${n%4}`)).map(n=>generateQuestion(skill.id,n));
 options.sort((a,b)=>Math.abs(a.difficulty-desired)-Math.abs(b.difficulty-desired));
 return options[0]||generateQuestion(skill.id,seed);
 }
 return generateQuestion(skill.id,seed);
}
export function startSession(p:Progress,mode:Mode,target:string[]=[],unit:UnitId='decimals'):Progress {
 const diagnostic=mode==='standard'&&p.sessions.filter(s=>s.mode==='standard'&&!s.early&&(s.unit||'decimals')===unit).length<assessmentConfig.diagnosticSessions;
 const s:Session={unit,id:crypto.randomUUID(),mode,diagnostic,target:mode==='quick'?target.filter(id=>skillsFor(unit).some(s=>s.id===id)).slice(0,2):[],questions:[],responses:[],startedAt:Date.now(),draft:emptyDraft()};
 // Quick practice defaults to two areas with the least independent evidence.
 if(mode==='quick'&&!s.target.length)s.target=assess(p,Date.now(),unit).sort((a,b)=>a.independent-b.independent).slice(0,2).map(e=>e.skill.id);
 s.questions.push(selectQuestion(p,s));
 if(mode==='test')while(s.questions.length<modes.test.count)s.questions.push(selectQuestion(p,s));
 return {...p,selectedUnit:unit,active:s};
}
export function makeResponse(s:Session,seconds:number):Response {
 const q=s.questions[s.responses.length],answers=s.draft.answers;
 const firstCorrect=!!answers.length&&validAnswer(answers[0],q),correct=!!answers.length&&validAnswer(answers.at(-1)!,q);
 let error='Unclassified';
 // A numeric answer can have many causes. Keep these as candidate patterns only.
 if(!firstCorrect&&answers.length){const n=parseDecimal(answers[0]);const pattern=n===null?undefined:q.misconceptions[decimal(n)];if(pattern&&pattern!=='Unclassified')error=`Possible ${pattern.toLowerCase()}`;
 if(q.kind==='choice'&&q.skill==='operation')error='Incorrect operation selection';
 if(q.kind==='choice'&&q.skill==='alignment')error='Place-value reasoning';
 if(q.proof.op==='history')error='Review the historical evidence';
 if(q.proof.op==='science')error=q.misconceptions[answers[0]]||'Review the evidence';}
 return {question:q,answers:[...answers],correct,firstCorrect,independent:!(s.draft.firstHinted??s.draft.hinted),hinted:s.draft.hinted,seconds:Math.max(0,Math.round(seconds)),at:Date.now(),error:firstCorrect?'None':error,work:s.draft.work};
}
export function advance(p:Progress,seconds:number,early=false):Progress {
 if(!p.active)return p;
 const s:Session={...p.active,questions:[...p.active.questions],responses:[...p.active.responses],draft:{...p.active.draft}};
 const shouldRecord=s.draft.answers.length>0;
 if(shouldRecord)s.responses.push(makeResponse(s,seconds));
 s.draft=emptyDraft();
 const completed=s.responses.length>=modes[s.mode].count;
 if(early||completed){s.endedAt=Date.now();s.early=!completed;const gained=s.responses.reduce((n,r)=>n+10+(r.firstCorrect&&r.independent?10:0)+(r.answers.length>1&&r.correct?5:0),0)+(completed?50:0);return {...p,active:null,sessions:[...p.sessions,s],xp:p.xp+gained};}
 if(s.mode!=='test')s.questions.push(selectQuestion({...p,active:s},s));
 return {...p,active:s};
}
export function submitDraft(p:Progress,answer:string,elapsed:number,work:string):Progress {
 if(!p.active)return p;
 const s=p.active,q=s.questions[s.responses.length];
 if(!answer.trim()||q.kind==='numeric'&&(q.proof.op==='multiply'?normalizeExact(answer)===null:parseDecimal(answer)===null))throw new Error('Enter a number, such as 4.50.');
 return {...p,active:{...s,draft:{...s.draft,answer,work,elapsed,firstHinted:s.draft.firstHinted??s.draft.hinted,answers:[...s.draft.answers,answer]}}};
}
export function achievements(p:Progress){const responses=allResponses(p).map(r=>r.response);return [
 {id:'drop',name:'First drop',detail:'Complete a full mission',unlocked:p.sessions.some(s=>!s.early)},
 {id:'explorer',name:'Island explorer',detail:'Try all seven skill zones',unlocked:new Set(responses.map(r=>allSkills.find(s=>s.id===r.question.skill)?.group)).size>=7},
 {id:'comeback',name:'Comeback kid',detail:'Correct a challenge after a retry',unlocked:responses.some(r=>!r.firstCorrect&&r.correct)},
 {id:'return',name:'Back for more',detail:'Complete three missions',unlocked:p.sessions.filter(s=>!s.early).length>=3},
 {id:'master',name:'Skill specialist',detail:'Master your first subskill',unlocked:units.map(u=>u.id).flatMap(u=>assess(p,Date.now(),u)).some(e=>e.status==='Mastered')},
 ];}

export function switchUnit(p:Progress,unit:UnitId):Progress {
 const previous=p.active;
 const parked=[...(p.paused||[])];
 const restored=parked.find(s=>(s.unit||'decimals')===unit)||null;
 const remaining=parked.filter(s=>(s.unit||'decimals')!==unit);
 if(previous&&(previous.unit||'decimals')!==unit)remaining.push(previous);
 return {...p,selectedUnit:unit,active:previous&&(previous.unit||'decimals')===unit?previous:restored,paused:remaining};
}
