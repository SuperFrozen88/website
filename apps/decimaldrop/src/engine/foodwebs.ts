import type { Skill } from './types';
import type { Unit } from './units';
const definitions=[
 ['why','Energy from food','Why organisms eat','Name what food energy lets a body do: grow, repair, stay warm, and move.'],
 ['sun','Energy from food','Energy starts with the Sun','Trace all food energy back to sunlight that producers capture.'],
 ['chain','Food chains','Food chain order','Put organisms in order from producer to top consumer.'],
 ['arrows','Food chains','Reading energy arrows','Read arrows as pointing from the food to the eater, one way only.'],
 ['web','Food webs','Chains connect into webs','Explain how organisms that eat more than one thing link chains into a web.'],
 ['producer','Producers','What producers do','Explain why producers get energy straight from the Sun and why life depends on them.'],
 ['recipe','Producers','Producer inputs & outputs','Match carbon dioxide, water, and sunlight with the sugar and oxygen they make.'],
 ['consumer','Consumers','What consumers do','Explain why consumers must eat other organisms and what they may eat.'],
 ['diet','Consumers','Herbivores, carnivores & omnivores','Sort consumers by whether they eat plants, animals, or both.'],
 ['decomposer','Decomposers','Decomposers recycle nutrients','Explain how fungi and bacteria break down dead organisms and return matter to the soil.'],
 ['detritivore','Decomposers','Detritivores & decomposers together','Explain how earthworms break dead material into pieces that bacteria and mold finish.'],
 ['investigate','Investigations','Decomposition Race','Use the worms vs. no-worms data to support a claim with evidence and reasoning.'],
] as const;
export const foodWebSkills:Skill[]=definitions.map(([id,group,name,nextStep])=>({unit:'foodwebs',id:`web-${id}`,group,name,nextStep}));
export const foodWebsUnit:Unit={id:'foodwebs',subject:'Science',title:'Food Chains and Food Webs',zone:'Food Web Woods',subtitle:'Follow the energy. Link the chains. Recycle the matter.',standard:'5-LS2-1 · 5-PS3-1',source:'Scope checked against 10 family-provided lesson pages (November 12, 2026): reading pages on food energy, food chains, food webs, producers, consumers and decomposers, plus the graphic organizer, class food web, Decomposition Race lab, CER, comparison diagram and roundtable. Original practice questions; exact classroom quiz coverage unconfirmed.',verified:true,rarity:'EPIC',accent:'#f2a65a',sources:[
 {title:'Supplied lesson pages and coverage notes',url:'https://github.com/SuperFrozen88/website/tree/master/apps/decimaldrop/docs/reference/food-webs-2026-11-12'},
 {title:'NGSS: Grade 5 matter and energy in organisms and ecosystems',url:'https://www.nextgenscience.org/topic-arrangement/5matter-and-energy-organisms-and-ecosystems'},
],intel:[
 {title:'Why you eat',text:'Food gives your body the energy it needs to grow, repair itself, keep a steady body temperature, and move. Bacon and eggs, a hamburger, and jambalaya taste different, but all of them supply food energy.'},
 {title:'It all starts with the Sun',text:'All the food energy that passes between organisms comes from the Sun. Plants use sunlight to make their own food, and the energy passes to other organisms when they eat the plants. A hawk that never eats plants still depends on the Sun.'},
 {title:'Food chains',text:'A food chain shows food energy moving from one organism to another, in one direct path. Grass → grasshopper → mouse → snake → hawk. Other examples: oak tree → squirrel → eagle, grass → cow → humans, algae → minnows → bass. Mushrooms break down what is left behind.'},
 {title:'Read the arrows',text:'Arrows show how energy is passed. They point from the food to the eater: “grass → grasshopper” means the grass is eaten by the grasshopper. Energy flows like a one-way street, so it never flows back from the hawk to the grass.'},
 {title:'Food webs',text:'Organisms eat more than one thing, so they belong to many food chains. When chains overlap and connect, they form a food web. A web can be big or small. Chains and webs both show producers, consumers, and energy moving.'},
 {title:'Producers',text:'Producers get their energy directly from the Sun and make their own food. All food webs begin with plants. Lettuce, grass, oak trees, cattails, dandelions, and algae are producers. Without producers, other organisms would not survive.'},
 {title:'How producers make food',text:'Producers combine carbon dioxide from the air with water, using sunlight’s energy, to make sugar and oxygen. This is a chemical process. Carbon dioxide and water go in; sugar and oxygen come out.'},
 {title:'Consumers',text:'Consumers cannot use the Sun’s energy to make food, so they eat plants or other animals. A deer eats producers. A bald eagle eats other consumers. People are consumers too.'},
 {title:'Herbivore, carnivore, omnivore',text:'Herbivores eat only plants (deer, bee). Carnivores eat only animals (wolf, eagle, owl, snake, frog). Omnivores eat both plants and animals (bear, mouse, turtle, and most people). What an animal eats decides its group, not where it lives.'},
 {title:'Decomposers',text:'Decomposers are a special group of consumers that eat only dead organisms. Mushrooms, other fungi such as mold, and bacteria are decomposers. They break dead things down and return matter and nutrients to the soil, where plants use them to grow.'},
 {title:'Detritivores team up',text:'Detritivores such as earthworms eat dead material and break it into smaller pieces. That lets bacteria decompose the pieces more quickly. Nutrients cycle: soil → plant → animal → back to the soil after decomposition. Matter is moved or changed, not destroyed.'},
 {title:'Decomposition Race',text:'Driving question: what factors affect decomposition? Two containers got the same soil, damp paper strips, and half an apple; only one got earthworms. After 2–3 weeks of daily observations, the apple with worms was falling apart while the other was dark and mushy. Claim: earthworms and bacteria helped break down the apple. Factors include what eats the material, time, soil, and oxygen.'},
]};
