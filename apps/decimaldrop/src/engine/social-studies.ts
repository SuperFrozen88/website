import items from './exploration-bank.json';
import type { Question, Skill } from './types';
import type { Unit } from './units';
export const explorationSources=[
 {title:'TCI: published lesson topic outline (pp. 1–2)',url:'https://cdnproduction.teachtci.com/review/Social%20Studies/EL/G5_TCI_AP_OR%20Correlations.pdf'},
 {title:'NPS: navigation tools',url:'https://www.nps.gov/articles/navigatingtheatlanticworld.htm'},
 {title:'NPS: trade and exploration',url:'https://www.nps.gov/jame/learn/historyculture/prelude-to-jamestown.htm'},
 {title:'NPS: Spanish missions and religion',url:'https://www.nps.gov/articles/significance-of-missions.htm'},
 {title:'NPS: American foods',url:'https://www.nps.gov/articles/latinothemefood.htm'},
 {title:'NPS: tobacco as a cash crop',url:'https://www.nps.gov/jame/learn/historyculture/a-short-history-of-jamestown.htm'},
 {title:'NPS: archaeology and artifacts',url:'https://www.nps.gov/subjects/archeology/about-archeology.htm'},
];
export const explorationUnit:Unit={id:'exploration',subject:'Social Studies',title:'How and Why Europeans Came to the New World',zone:'Compass Cove',subtitle:'TCI Lesson 4 · Tools, motives, and exchanges.',standard:'TCI · Lesson 4',source:'Based on TCI’s published topic outline (newer title: “How and Why Europeans Came to the Americas”). Classroom title and 9-section count confirmed by the family’s year-plan photo; individual section contents and quiz coverage unconfirmed. Original practice questions.',verified:false,rarity:'EPIC',accent:'#e8bd74',sources:explorationSources,intel:[
 {title:'Start here: the big question',text:'What did Europeans take to the Americas, why did they travel, and what went back to Europe? Sort your intel into tools, motives, and products. “New World” was a European name for the Americas, where Indigenous peoples already lived.'},
 {title:'Age of Exploration & trade',text:'In the late 1400s and 1500s, European voyages expanded. Many rulers and merchants wanted sea routes to Asian goods such as spices and silk. Columbus sailed west for Spain in 1492 seeking Asia; he reached the Americas instead.'},
 {title:'Ocean crossing: astrolabe',text:'Far from shore, sailors could not rely on familiar landmarks. An astrolabe measured the angle of the sun or stars to help estimate latitude: position north or south of the equator. It needed a visible sky; it was not a compass or a modern GPS.'},
 {title:'Directions: compass',text:'A magnetic compass indicates north and helps a navigator keep a direction, even under clouds. It does not show an exact location. Compass, sky observations, and maps answered different navigation questions.'},
 {title:'Maps & records',text:'Maps show land, water, and routes; early maps could be incomplete or mistaken. Sailors’ observations and voyage records helped improve them. A ship’s log records a voyage. Use the compass rose to interpret directions on a map.'},
 {title:'Claimed lands: flags & power',text:'Explorers raised flags for European rulers. A nation-state is a country with its own government and territory. Rulers competed for land, resources, and power. A European claim did not mean the land was empty or that Indigenous nations agreed to give it up.'},
 {title:'Religious beliefs: Bible & missionaries',text:'Spreading Christianity was one motive for European expansion. Catholic rulers supported priests and missions seeking converts. A Bible can be evidence of religious activity; it does not show what everyone aboard believed. Identify the motive without endorsing forced conversion.'},
 {title:'Wealth: trade, gold & silver',text:'Merchants wanted profitable trade; rulers also sought gold, silver, and resources. Tools explain HOW voyages were made; wealth, religion, and power help explain WHY. European gains could involve conquest and forced labor that harmed Indigenous peoples.'},
 {title:'New foods: Americas → Europe',text:'Indigenous peoples grew crops such as corn (maize), potatoes, beans, squash, tomatoes, and cacao before European arrival. These foods later spread to Europe and beyond. “New” meant unfamiliar to Europeans, not newly invented or unknown to everyone.'},
 {title:'Cash crops: tobacco',text:'A cash crop is grown mainly to sell, rather than just to feed the grower’s family. Tobacco from the Americas became a profitable export to Europe. Profit does not mean a product is healthy or its labor system fair; colonial production involved exploitation and enslaved labor.'},
 {title:'Artifact detective',text:'An archaeologist studies objects and sites to learn about past people. An artifact is an object made or used by people. Compass → navigation; flag → a land claim; Bible → religion; gold → wealth; corn or tobacco cargo → products. Context matters: one object cannot prove every motive.'},
 ]};
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
 ['artifacts','Historical evidence','Artifact classification & evidence','Classify tools, motives, and products using objects and their context.'],
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
