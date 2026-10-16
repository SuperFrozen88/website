import type { UnitId } from './units';
import { scienceBank } from './science';
import { skillsFor, assessmentConfig as config } from './curriculum';
import { questionBank, remixBank } from './questions';
import type { Progress, Evidence, Response } from './types';
export function allResponses(p:Progress):{response:Response;session:string}[] {
 return [...p.sessions,...(p.active?[p.active]:[]),...(p.paused||[])].flatMap(s=>s.responses.map(response=>({response,session:s.id})));
}
export function assess(p:Progress,now=Date.now(),unit:UnitId='decimals'):Evidence[] {
 const history=allResponses(p);
 return skillsFor(unit).map(skill=>{
 const rows=history.filter(r=>r.response.question.skill===skill.id);
 const independent=rows.filter(r=>r.response.independent);
 const successes=independent.filter(r=>r.response.firstCorrect);
 const rate=independent.length?successes.length/independent.length:null;
 const recent=independent.slice(-6), recentRate=recent.length?recent.filter(r=>r.response.firstCorrect).length/recent.length:null;
 const sessions=new Set(successes.map(r=>r.session)).size;
 const highest=Math.max(0,...successes.map(r=>r.response.question.difficulty));
 const families=new Set(successes.map(r=>r.response.question.family)).size;
 let status:Evidence['status']='Not Assessed';
 if(rows.length>=config.minimumEvidence){
 status='Developing';
 if(independent.length>=3 && rate!==null && rate<0.5 && recentRate!==null && recentRate<0.5) status='Needs Practice';
 if(independent.length>=config.minimumEvidence && (rate??0)>=config.proficientSuccessRate && (recentRate??0)>=0.8 && sessions>=config.proficientSessions && families>=2)status='Proficient';
 const available=[...questionBank,...remixBank,...scienceBank].filter(q=>q.skill===skill.id);
 const availableDifficulty=Math.max(...available.map(q=>q.difficulty));
 const requiredFamilies=Math.min(3,new Set(available.map(q=>q.family)).size);
 if(status==='Proficient' && independent.length>=config.masteredEvidence && (rate??0)>=config.masteredSuccessRate && (recentRate??0)>=0.9 && sessions>=config.masteredSessions && highest>=Math.min(config.masteredDifficulty,availableDifficulty) && families>=requiredFamilies)status='Mastered';
 }
 const errorMap=new Map<string,number>();
 rows.filter(r=>!r.response.firstCorrect).forEach(r=>errorMap.set(r.response.error,(errorMap.get(r.response.error)||0)+1));
 return {skill,status,total:rows.length,independent:independent.length,successes:successes.length,accuracy:rate,recent:recentRate,highest,sessions,stale:rows.length>0&&now-rows.at(-1)!.response.at>config.staleDays*86400000,errors:[...errorMap.entries()].sort((a,b)=>b[1]-a[1]),avgSeconds:rows.length?Math.round(rows.reduce((n,r)=>n+r.response.seconds,0)/rows.length):0};
 });
}
export function readiness(evidence:Evidence[]) {
 const assessed=evidence.filter(e=>e.independent>=config.minimumEvidence);
 const proficient=evidence.filter(e=>['Proficient','Mastered'].includes(e.status));
 const total=evidence.reduce((n,e)=>n+e.total,0);
 let label='Not Yet Assessed';
 if(total>0)label='Needs Work';
 if(assessed.length>=Math.ceil(evidence.length*0.8)&&proficient.length>=Math.ceil(evidence.length*0.7)) label='Nearly Ready';
 if(assessed.length===evidence.length&&proficient.length===evidence.length&&!evidence.some(e=>e.stale))label='Ready';
 return {label,covered:assessed.length,total:evidence.length,confidence:assessed.length===evidence.length?'Strong coverage':assessed.length>=evidence.length/2?'Building evidence':'Early evidence',proficient:proficient.length,groups:[...new Set(evidence.map(e=>e.skill.group))].map(group=>({group,covered:evidence.filter(e=>e.skill.group===group&&e.total>0).length,total:evidence.filter(e=>e.skill.group===group).length}))};
}
export function recommendation(e:Evidence):string {
 if(!e.total)return `Start with a short check of ${e.skill.name.toLowerCase()}. There is no evidence yet.`;
 if(e.stale)return `Revisit ${e.skill.name.toLowerCase()}: the last response was more than 14 days ago. ${e.skill.nextStep}`;
 const count=`${e.successes} of ${e.independent} independent responses correct`;
 return `${count}. ${e.independent<3?'Collect more independent evidence before drawing a conclusion. ':''}${e.skill.nextStep}`;
}
