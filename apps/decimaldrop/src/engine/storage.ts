import { units, unitOfSkill } from './units';
import type { Progress, Session } from './types';
import { emptyProgress } from './session';
import { generateQuestion } from './questions';
import { allSkills as skills, modes } from './curriculum';
import { validAnswer } from './decimal';
export const STORAGE_KEY='decimal-drop-progress-v1';
interface Store {getItem(key:string):string|null;setItem(key:string,value:string):void;}
function finite(n:unknown):n is number{return typeof n==='number'&&Number.isFinite(n)&&n>=0;}
function validateSession(s:Session,active:boolean):boolean {
 if(s?.unit!==undefined&&!units.some(u=>u.id===s.unit))return false;
 if(!s||typeof s.id!=='string'||!['quick','standard','test'].includes(s.mode)||typeof s.diagnostic!=='boolean'||!finite(s.startedAt)||!Array.isArray(s.target)||s.target.some(id=>!skills.some(k=>k.id===id))||!Array.isArray(s.questions)||!Array.isArray(s.responses)||s.questions.length>20||s.responses.length>s.questions.length||s.responses.length>modes[s.mode].count)return false;
 if(s.draft&&((s.draft.firstHinted!==undefined&&typeof s.draft.firstHinted!=='boolean')||(s.draft.revealed!==undefined&&typeof s.draft.revealed!=='boolean')))return false;
 if(!s.draft||typeof s.draft.answer!=='string'||typeof s.draft.work!=='string'||typeof s.draft.hinted!=='boolean'||!finite(s.draft.elapsed)||!Array.isArray(s.draft.answers)||s.draft.answers.some(a=>typeof a!=='string'))return false;
 if(active&&(s.responses.length>=modes[s.mode].count||s.questions.length<=s.responses.length))return false;
 if(!active&&(!finite(s.endedAt)||typeof s.early!=='boolean'))return false;
 for(const q of s.questions){if(unitOfSkill(q.skill)!==(s.unit||'decimals'))return false;const parts=q.id?.split(':');if(parts?.length!==2)return false;let expected;try{expected=generateQuestion(parts[0],Number(parts[1]));}catch{return false;}if(JSON.stringify(q)!==JSON.stringify(expected))return false;}
 if(new Set(s.questions.map(q=>q.id)).size!==s.questions.length)return false;
 return s.responses.every((r,i)=>{
 const q=s.questions[i];return r&&JSON.stringify(r.question)===JSON.stringify(q)&&Array.isArray(r.answers)&&r.answers.length>0&&r.answers.every(a=>typeof a==='string')&&typeof r.hinted==='boolean'&&typeof r.independent==='boolean'&&(r.hinted||r.independent)&&finite(r.seconds)&&finite(r.at)&&typeof r.work==='string'&&typeof r.error==='string'&&r.firstCorrect===validAnswer(r.answers[0],q)&&r.correct===validAnswer(r.answers.at(-1)!,q);
 });
}
export function importProgress(raw:string):Progress {
 if(raw.length>10000000)throw new Error('Progress file is too large (10 MB maximum).');
 let p:Progress;try{p=JSON.parse(raw);}catch{throw new Error('This file is not valid JSON. Your current progress is unchanged.');}
 if(p?.selectedUnit!==undefined&&!units.some(u=>u.id===p.selectedUnit))throw new Error('Unknown selected unit.');
 if(!p||p.version!==1||!Array.isArray(p.sessions)||p.sessions.length>2000||!finite(p.xp)||typeof p.sound!=='boolean'||!p.sessions.every(s=>validateSession(s,false))||(p.active!==null&&!validateSession(p.active,true)))throw new Error('This progress file is incomplete or incompatible. Your current progress is unchanged.');
 if(p.paused!==undefined&&(!Array.isArray(p.paused)||p.paused.length>units.length-1||!p.paused.every(s=>validateSession(s,true))))throw new Error('Invalid paused missions.');
 const unfinished=[...(p.active?[p.active]:[]),...(p.paused||[])];
 if(new Set(unfinished.map(s=>s.unit||'decimals')).size!==unfinished.length)throw new Error('Duplicate unfinished unit missions.');
 if(new Set([...p.sessions,...(p.active?[p.active]:[]),...(p.paused||[])].map(s=>s.id)).size!==p.sessions.length+(p.active?1:0)+(p.paused?.length||0))throw new Error('Duplicate session IDs.');
 return p;
}
export function saveProgress(p:Progress,storage:Store=localStorage):string|null {
 try{const previous=storage.getItem(STORAGE_KEY);if(previous){try{importProgress(previous);storage.setItem(`${STORAGE_KEY}-backup`,previous);}catch{/* preserve the valid backup */}}storage.setItem(STORAGE_KEY,JSON.stringify(p));return null;}catch{return 'Browser storage is unavailable or full. Keep this tab open and export your progress to save it.';}
}
export function loadProgress(storage:Store=localStorage):{progress:Progress;warning:string|null}{
 let raw:string|null;
 try{raw=storage.getItem(STORAGE_KEY);}catch{return {progress:emptyProgress(),warning:'Browser storage could not be accessed. Export progress before closing the tab.'};}
 if(!raw)return {progress:emptyProgress(),warning:null};
 try{return {progress:importProgress(raw),warning:null};}catch{/* try the prior valid snapshot */}
 try{const backup=storage.getItem(`${STORAGE_KEY}-backup`);if(backup)return {progress:importProgress(backup),warning:'Recovered your last saved backup after a damaged save. The most recent action may need to be repeated.'};}catch{/* backup is missing, damaged, or inaccessible */}
 try{storage.setItem(`${STORAGE_KEY}-damaged`,raw);return {progress:emptyProgress(),warning:'Saved progress could not be read. A copy was kept in the browser recovery slot; import an exported backup to recover.'};}catch{return {progress:emptyProgress(),warning:'Saved progress is damaged and recovery storage is unavailable. Keep this tab open and recover an exported backup.'};}
}
