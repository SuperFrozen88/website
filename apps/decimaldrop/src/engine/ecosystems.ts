import type { Skill } from './types';
import type { Unit } from './units';
const definitions=[
 ['vocab','Ecosystem basics','Ecosystem & environment','Use “ecosystem” for a whole area and its interactions; use “environment” for everything around one organism.'],
 ['living','Ecosystem basics','Living & nonliving parts','Sort parts by whether they grow, use energy, and reproduce.'],
 ['needs','Needs','What organisms need','Name food, water, air, shelter, and space, and explain what happens when one is missing.'],
 ['interactions','Interactions','Interactions','Describe one thing’s action and its effect on a different thing, living or nonliving.'],
 ['interdependence','Interactions','Interdependence','Explain how two organisms’ well-being is linked and what happens if one disappears.'],
 ['roles','Food webs','Producers, consumers & decomposers','Classify organisms by how they get energy and explain why decomposers matter.'],
 ['population','Populations','Population size & survival','Explain that limited resources and competition mean fewer survivors as a population grows.'],
 ['data','Populations','Reading population data','Find totals (survived + did not survive), compare rounds, and describe the pattern with numbers.'],
 ['change','Populations','Changes in ecosystems','Trace how one change spreads through food and resources to other organisms.'],
 ['habitat','Design','Designing a habitat (Zoo Tour)','Start from the animal’s needs and natural environment, then check every need is met.'],
 ['cer','Scientific explanations','Claim, evidence & reasoning','Evidence is data from the activity; reasoning is the science idea that explains why.'],
 ['claim','Scientific explanations','Supporting a claim with evidence','Choose examples that pair a living thing with a nonliving thing.'],
] as const;
export const ecosystemSkills:Skill[]=definitions.map(([id,group,name,nextStep])=>({unit:'ecosystems',id:`eco-${id}`,group,name,nextStep}));
export const ecosystemsUnit:Unit={id:'ecosystems',subject:'Science',title:'Ecosystems',zone:'Habitat Hollow',subtitle:'Meet every need. Track every interaction. Explain the survivors.',standard:'5-LS2-1',source:'Scope checked against 8 family-provided Ecosystems lesson pages (November 19, 2026): picture vocabulary, the Zoo Tour rubric, What Do I Need? data and claim–evidence–reasoning, and a Claim and Evidence organizer. One blurred vocabulary photo could not be read. Questions are original; exact quiz coverage is unconfirmed.',verified:true,rarity:'EPIC',accent:'#9fd36b',sources:[
 {title:'NGSS 5-LS2-1: Model the movement of matter among plants, animals, decomposers, and the environment',url:'https://www.nextgenscience.org/pe/5-ls2-1-ecosystems-interactions-energy-and-dynamics'},
],intel:[
 {title:'Ecosystem',text:'All living and nonliving things in an area and all their interactions. A coral reef (fish, turtles, coral, salt water, rocks, sunlight) is an ecosystem. Ecosystems can be as small as a puddle or as big as a forest.'},
 {title:'Environment',text:'The space, conditions, and all the living and nonliving things around one organism. A squirrel’s environment includes trees, other squirrels, sidewalks, temperature, and rain.'},
 {title:'Living and nonliving',text:'Living things grow, use energy, and reproduce: plants, animals, fungi, bacteria. Nonliving parts include water, air, sunlight, rocks, soil minerals, and temperature. Both are needed for an ecosystem.'},
 {title:'Needs',text:'Requirements for the well-being of an organism. Animals need food, water, air, shelter, and space. Plants need sunlight, water, air, space, and soil nutrients. If one need is missing, the organism must move or it may not survive.'},
 {title:'Interactions',text:'Actions by one thing that affect a different thing, like a bowling ball knocking down pins. Living–living: a spider catches a fly. Living–nonliving: roots take in water; a beaver dams a stream. Nonliving–nonliving: waves wear away rock.'},
 {title:'Interdependence',text:'When the well-being of two or more things is linked. Birds ride on a deer and eat its insects; bees get nectar and flowers get pollinated. If bees disappeared, fewer seeds would form.'},
 {title:'Food webs and decomposers',text:'A food web is an interconnected set of food chains. Producers capture the Sun’s energy, consumers eat other organisms, and decomposers such as mushrooms break down dead remains without internal digestion, returning nutrients to the soil.'},
 {title:'Population size and survival',text:'A population is all organisms of one kind in an area. When the population grows but food, water, and shelter stay the same, each animal’s share shrinks. Animals compete, and fewer survive.'},
 {title:'What Do I Need? data',text:'Round 1: 6 survived, 0 did not (6 animals). Round 2: 4 survived, 5 did not (9). Round 3: 3 survived, 9 did not (12). Total = survived + did not survive. As the population grew, survivors fell from 6 to 4 to 3.'},
 {title:'Claim, evidence, reasoning',text:'Claim: when a population grows and resources stay the same, fewer survive. Evidence (data from the activity): all 6 survived in round 1, but only 3 of 12 in round 3. Reasoning (the science idea): resources are limited, so more animals competing means some cannot get enough.'},
 {title:'Supporting a claim',text:'For “living and nonliving things interact,” pick examples that pair both: plants use sunlight and water; fish get oxygen from water; worms loosen soil; a bird nests in a tree. A hawk eating a mouse is living–living.'},
 {title:'Zoo Tour: design a habitat',text:'Research the animal’s needs and natural environment first. A polar bear needs cold water, space, and a den; a tortoise needs warmth, shade, and plants; penguins need water and dry land. The rubric scores Solution, Design, Presentation (3 minutes), and Teamwork.'},
]};
