import type { Skill } from './types';
import type { Unit } from './units';
const definitions=[
 ['photo','Photosynthesis','Making food with light','Trace light energy into chemical energy stored in sugar.'],
 ['matter','Photosynthesis','Matter inputs & outputs','Distinguish carbon dioxide and water inputs from sugar and oxygen outputs.'],
 ['parts','Plant structures','Roots, stems & leaves','Follow water through roots and stems and gases through leaf openings.'],
 ['roles','Energy flow','Producers & consumers','Explain why plants are producers and how consumers obtain food energy.'],
 ['energy','Energy flow','Stored energy & plant uses','Connect plant food with growth, repair, reproduction, and energy passed to eaters.'],
 ['hydro','Growing methods','Hydroponics & mineral nutrients','Explain how nutrient-rich water supports growth without soil.'],
 ['aqua','Growing methods','Aquaponics & cycling water','Trace fish waste nutrients and recirculating water in a plant-and-fish system.'],
 ['air','Growing methods','Epiphytes & support','Distinguish support from obtaining food and nutrients in tree-growing plants.'],
 ['clean','Plants & environment','Phytoremediation','Use evidence to explain plant-based cleanup without assuming universal success.'],
 ['investigate','Investigations','Bottle-and-wick investigation','Explain the wick, growing medium, nutrient directions, and fair comparisons.'],
] as const;
export const plantSkills:Skill[]=definitions.map(([id,group,name,nextStep])=>({unit:'plants',id:`plant-${id}`,group,name,nextStep}));
export const plantsUnit:Unit={id:'plants',subject:'Science',title:'Matter and Energy in Plants',zone:'Canopy Camp',subtitle:'Follow sunlight. Trace matter. Grow your science intel.',standard:'5-LS1-1 · 5-PS3-1',source:'Scope checked against five family-provided lesson photos (November 5, 2026), including the hydroponics activity. Original practice questions; exact classroom quiz coverage unconfirmed.',verified:true,rarity:'LEGENDARY',accent:'#79df9a',sources:[
 {title:'Supplied lesson photos and coverage notes',url:'https://github.com/SuperFrozen88/website/tree/master/apps/decimaldrop/docs/reference/plants-2026-11-05'},
 {title:'NGSS: Grade 5 matter and energy in organisms',url:'https://www.nextgenscience.org/topic-arrangement/5matter-and-energy-organisms-and-ecosystems'},
 {title:'University of Minnesota: small-scale hydroponics',url:'https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/small-scale-hydroponics'},
 {title:'Cornell: hydroponics and aquaponics',url:'https://smallfarms.cornell.edu/resources/guide-to-urban-farming/hydroponics-and-aquaponics/'},
 {title:'EPA: plant-based cleanup and its limits',url:'https://www.epa.gov/sites/default/files/2015-04/documents/phytoremprimer.pdf'},
],intel:[
 {title:'Photosynthesis: energy changes form',text:'Green plants use light energy to make sugar from carbon dioxide and water. Light energy becomes chemical energy stored in that food. Sunlight supplies energy; it is not a material ingredient or mineral nutrient.'},
 {title:'Track the matter',text:'Carbon dioxide comes from air; water is absorbed by roots. Photosynthesis produces sugar and releases oxygen. Much of a plant’s new matter comes from air and water, rather than from eating soil. Mineral nutrients are needed in smaller amounts.'},
 {title:'Roots → stems → leaves',text:'Roots absorb water and dissolved mineral nutrients. Stems transport water. Leaves absorb light and take in carbon dioxide through openings; oxygen can leave through those openings. Each structure contributes a different job.'},
 {title:'Producer and consumer',text:'A green plant is a producer because it makes its own food. Consumers obtain food by eating other organisms or their products. A plant-eating consumer receives chemical energy stored in plant food; that energy originally came from sunlight.'},
 {title:'Why plants need food',text:'Plants use the chemical energy in food for growth, repair, and reproduction. Energy stored in fruits, vegetables, and seeds can pass to animals that eat them. Plants do not make sugar only for humans.'},
 {title:'Hydroponics: no soil, still nutrients',text:'Hydroponics grows plants without soil, using water that supplies dissolved mineral nutrients. Rocks, sand, or another medium may support roots without providing their nutrients. Plants still need light, air, water, and suitable conditions; plain water alone does not supply every long-term need.'},
 {title:'Gardening in limited space',text:'Hydroponic systems can use patios, rooftops, indoor spaces, or larger farms. The important feature is growing without soil with a nutrient supply, not being tiny or indoors. Horticulture is the study and practice of growing plants.'},
 {title:'Aquaponics: fish and plants',text:'Aquaponics combines raising aquatic animals with hydroponic plant growing. Fish waste can supply plant nutrients through processes in the system, and water circulates between parts. Plants still make sugar using light; fish waste does not replace sunlight. The diagram is a model of a managed system, not a claim that any fish bowl is complete.'},
 {title:'Epiphytes: a place to grow',text:'Epiphytes grow on other plants for support and obtain water and nutrients from rain, air-borne material, and debris. Green epiphytes make their own food using light. Some orchids, bromeliads, and mosses grow this way; that does not mean every member of those groups is an epiphyte or that all tree-growing plants steal food.'},
 {title:'Phytoremediation: plants helping cleanup',text:'Phytoremediation uses plants to help remove, store, or sometimes transform pollutants. The lesson uses sunflowers as an example. Effectiveness depends on the plant, pollutant, and conditions; roots do not instantly make every contaminated place harmless. Evidence of less pollution is needed to evaluate a treatment.'},
 {title:'Bottle lab: follow the water',text:'In the supplied activity, strips of cloth form a wick connecting water below with the growing medium above. The medium supports the seeds and roots. Nutrients are added according to the fertilizer label; seed depth follows the seed packet. Ask an adult to help prepare a cut bottle. Use the complete classroom directions when building a system; these cards explain how its parts work.'},
 {title:'Squad science: compare fairly',text:'Change one planned condition, such as nutrient supply, while keeping plant type, light, water access, containers, and observation period comparable. Record observations and repeat trials. A single drooping plant does not identify one certain cause. Protect air, water, and soil, and support a claim with relevant evidence.'},
]};
