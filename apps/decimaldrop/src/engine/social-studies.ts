import items from './exploration-bank.json';
import { lessonFourIntel } from './lesson-four-intel';
import type { Question, Skill } from './types';
import type { Unit } from './units';
export const explorationSources=[
 {title:'Supplied TCI lesson screenshots (33 originals)',url:'https://github.com/SuperFrozen88/website/tree/master/apps/decimaldrop/docs/reference/tci-lesson-4-2026-10-21'},
 {title:'TCI: published lesson topic outline (pp. 1–2)',url:'https://cdnproduction.teachtci.com/review/Social%20Studies/EL/G5_TCI_AP_OR%20Correlations.pdf'},
 {title:'NPS: navigation tools',url:'https://www.nps.gov/articles/navigatingtheatlanticworld.htm'},
 {title:'NPS: trade and exploration',url:'https://www.nps.gov/jame/learn/historyculture/prelude-to-jamestown.htm'},
 {title:'NPS: Spanish missions and religion',url:'https://www.nps.gov/articles/significance-of-missions.htm'},
 {title:'NPS: American foods',url:'https://www.nps.gov/articles/latinothemefood.htm'},
 {title:'NPS: tobacco as a cash crop',url:'https://www.nps.gov/jame/learn/historyculture/a-short-history-of-jamestown.htm'},
 {title:'NPS: archaeology and artifacts',url:'https://www.nps.gov/subjects/archeology/about-archeology.htm'},
];
export const explorationUnit:Unit={id:'exploration',subject:'Social Studies',title:'How and Why Europeans Came to the New World',zone:'Compass Cove',subtitle:'TCI Lesson 4 · Nine sections + supplied extension readings.',standard:'TCI · Lesson 4',source:'Checked against the family’s 33 TCI screenshots: introduction, Sections 1–9, summary, Read & Do, and Explore. Lesson scope confirmed from supplied materials; exact quiz coverage unconfirmed. Original practice questions.',verified:true,rarity:'EPIC',accent:'#e8bd74',sources:explorationSources,intel:lessonFourIntel};
const definitions=[
 ['overview','Big picture','Age of Exploration & vocabulary','Connect the Americas, Europe, and the search for Asian trade routes.'],
 ['ocean','Navigation','Ocean crossing & astrolabe','Distinguish latitude from direction; connect sky observations to navigation.'],
 ['directions','Navigation','Directions & compass','Use cardinal directions and explain what a magnetic compass can tell you.'],
 ['maps','Navigation','Maps & voyage records','Use map clues and explain why new observations could improve maps.'],
 ['lands','Motives','Claimed lands & nation-states','Connect flags and rulers with power, and include Indigenous perspectives.'],
 ['beliefs','Motives','Religious beliefs','Recognize spreading Christianity as a motive and avoid overclaiming from an object.'],
 ['wealth','Motives','Wealth & trade','Distinguish trade profits and precious metals from navigation tools.'],
 ['foods','Products & exchange','New foods','Trace American crops to Europe and recognize Indigenous agricultural knowledge.'],
 ['crops','Products & exchange','Cash crops & tobacco','Explain sale for profit, demand, and the human costs behind exports.'],
 ['artifacts','Historical evidence','Underwater archaeology & evidence','Use sonar, grids, recovery steps, and context to interpret a wreck.'],
 ['europe','Read & Do','Changes in Europe spur exploration','Connect Granada, Columbus’s support, the Reformation, and the Armada with overseas rivalry.'],
 ['exchange','Explore','The Columbian Exchange','Trace two-way transfers, forced movement, effects, and evidence-based arguments.'],
] as const;
export const socialStudiesSkills:Skill[]=definitions.map(([id,group,name,nextStep])=>({unit:'exploration',id:`ss-${id}`,group,name,nextStep}));
export const socialStudiesItems=items;
export const socialStudiesPool=(skill:string)=>items.filter(q=>q.skill===skill);
export function socialStudiesQuestion(skill:string,index:number):Question {
 const item=socialStudiesPool(skill)[index];
 if(!Number.isInteger(index)||index<0||!item||item.answers.length!==4||new Set(item.answers).size!==4)throw new Error('Unknown or invalid social studies question');
 let state=Array.from(skill).reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,index+137);
 const choices=[...item.answers];
 for(let i=choices.length-1;i>0;i--){state=(Math.imul(state,1664525)+1013904223)>>>0;const j=state%(i+1);[choices[i],choices[j]]=[choices[j],choices[i]];}
 return {id:`${skill}:${index}`,skill,difficulty:item.difficulty as Question['difficulty'],kind:'choice',family:item.format,text:item.text,answer:item.answers[0],equivalents:[],choices,solution:item.solution,hint:item.hint,misconceptions:{},estimatedSeconds:item.difficulty>=3?80:50,format:item.format,source:item.source,proof:{op:'history',values:[],result:0}};
}
export const socialStudiesBank=socialStudiesSkills.flatMap(s=>socialStudiesPool(s.id).map((_,i)=>socialStudiesQuestion(s.id,i)));
