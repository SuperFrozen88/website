import matterItems from './matter-bank.json';
import { mixtureItems } from './mixtures-bank';
import type { ScienceItem } from './mixtures-bank';
import type { Question } from './types';
export const scienceItems:ScienceItem[]=[...mixtureItems,...matterItems];
export const sciencePool=(skill:string)=>scienceItems.filter(q=>q.skill===skill);
export function scienceQuestion(skill:string,index:number):Question {
 const item=sciencePool(skill)[index];
 if(!item||!Number.isInteger(index)||index<0)throw new Error('Unknown science question');
 let state=Array.from(skill).reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,index+71);
 const choices=[...item.answers];
 for(let i=choices.length-1;i>0;i--){state=(Math.imul(state,1664525)+1013904223)>>>0;const j=state%(i+1);[choices[i],choices[j]]=[choices[j],choices[i]];}
 return {id:`${skill}:${index}`,skill,difficulty:item.difficulty as Question['difficulty'],kind:'choice',family:item.format,text:item.text,answer:item.answers[0],equivalents:[],choices,solution:item.solution,hint:item.hint,misconceptions:Object.fromEntries(item.answers.slice(1).map(a=>[a,'Review the claim against the observed properties'])),estimatedSeconds:item.difficulty>=3?80:50,proof:{op:'science',values:[],result:0},format:item.format,source:skill.startsWith('mix-')?'Family-provided Grade 5 Mixtures & Chemical Reactions review sheet':'Adapted from James’s TVA Properties of Matter quiz'};
}
export const scienceBank=scienceItems.map((item,i)=>scienceQuestion(item.skill,scienceItems.slice(0,i).filter(q=>q.skill===item.skill).length));
