import type { Skill } from './types';
export type UnitId = 'decimals' | 'mixtures' | 'matter' | 'multiplication';
export interface Unit { id:UnitId; subject:'Math'|'Science'; title:string; zone:string; subtitle:string; standard:string; source:string; verified:boolean; rarity:string; accent:string; intel:{title:string;text:string}[]; }
export const units:Unit[] = [
 {id:'multiplication',subject:'Math',title:'Multiplying Decimals',zone:'Product Peaks',subtitle:'Scale your supply drops. Explain every product.',standard:'5.NBT.B.7',source:'Provisional Go Math! Grade 5 Chapter 4 scope; edition and chapter contents unverified. App labels are not official lesson titles.',verified:false,rarity:'LEGENDARY',accent:'#ffcc66',intel:[
 {title:'Whole-number bridge',text:'2.4 × 3 means 24 tenths × 3 = 72 tenths = 7.2. Multiply the units, then name their value.'},
 {title:'Locate the decimal',text:'1.2 × 0.35: 12 × 35 = 420. Tenths × hundredths are thousandths, so 420 thousandths = 0.420 = 0.42. Keep every place; do not round.'},
 {title:'Area model',text:'A rectangle 0.4 m by 0.3 m covers 12 hundredths of a square meter: 4 tenths × 3 tenths = 0.12. On a 10 × 10 grid, 12 of 100 small squares overlap.'},
 {title:'Break a factor apart',text:'3.6 × 4 = (3 × 4) + (0.6 × 4) = 12 + 2.4 = 14.4. Regroup 24 tenths as 2 wholes and 4 tenths.'},
 {title:'Estimate your drop',text:'4.8 × 2.1 is near 5 × 2 = 10. The exact answer 10.08 is reasonable; 100.8 is too large.'},
 {title:'Scaling and zeros',text:'Multiplying by 10 makes each digit worth ten times as much. Multiplying by 0.1 makes it worth one tenth as much. 0.04 × 0.2 = 0.008; placeholder zeros matter.'},
 {title:'Smaller products',text:'For a positive amount, multiplying by a number between 0 and 1 takes part of it. 8 × 0.5 = 4. Multiplying by 1 keeps it unchanged; by more than 1 enlarges it.'},
 {title:'Story and missing-factor checks',text:'Three kits at $2.45 each cost 3 × 2.45 = $7.35. For ___ × 0.4 = 1.2, try 3 and check 3 × 0.4 = 1.2. Label units and check each step.'},
 ]},
 {id:'decimals',subject:'Math',title:'Adding & Subtracting Decimals',zone:'Tilted Totals',subtitle:'Build, regroup, and outthink the decimal storm.',standard:'5.NBT.B.7',source:'Provisional Go Math! Grade 5 Chapter 3 scope; edition unconfirmed.',verified:false,rarity:'RARE',accent:'#b5f65a',intel:[{title:'Line up the decimal points',text:'Whole numbers sit with whole numbers, tenths with tenths. Add trailing zeros to make columns easier to see.'},{title:'Digit vs. value',text:'In 2.200, the 2 just after the decimal has a value of 0.2. The 2 before the decimal has a value of 2.'},{title:'Check your loot',text:'Estimate before you calculate. Use addition to check a subtraction answer.'}]},
 {id:'mixtures',subject:'Science',title:'Mixtures & Chemical Reactions',zone:'Reaction Royale',subtitle:'Collect the evidence. Spot the change. Secure the science.',standard:'5-PS1-4',source:'Based on the family-provided Grade 5 Science Review: Mixtures & Chemical Reactions.',verified:true,rarity:'MYTHIC',accent:'#bd9aff',intel:[
 {title:'Mixture',text:'Two or more substances combined that keep their original properties. Mixing does not automatically mean a new substance formed.'},
 {title:'Solution',text:'A mixture with a dissolved substance spread evenly throughout a liquid. Dissolved salt is still present, even when you cannot see it.'},
 {title:'Chemical reaction / chemical change',text:'New substances form with different properties from the original substances. Look at evidence before and after mixing.'},
 {title:'Gas formation',text:'Baking soda and vinegar making bubbles, or a bag inflating after substances are mixed, can be evidence of gas forming. Boiling bubbles can be water changing state.'},
 {title:'Temperature change',text:'Two substances getting warmer or cooler when mixed may support a reaction. A freezer cooling water is a physical change, not proof of a reaction.'},
 {title:'A new solid',text:'Two liquids forming a new yellow solid, or lemon juice and milk making solid chunks, can support a chemical change. Water freezing is different: it is still water.'},
 {title:'Smell and color',text:'A new smell when scentless substances are mixed, or copper turning green after exposure to air, may support a reaction. Mixing colored liquids alone is not proof.'},
 {title:'Physical changes',text:'Melting, freezing, boiling, evaporating, and dissolving can leave the substance unchanged. Salt returning after salt water evaporates is a physical-change example.'},
 {title:'Build a strong explanation',text:'Name the observation, then explain why it matters: “A new solid formed when two liquids were mixed. That supports a chemical change because a new substance may have formed.”'},
 ]},
 {id:'matter',subject:'Science',title:'Properties of Matter',zone:'Loot Lab',subtitle:'Inspect mystery loot. Choose materials. Test your claims.',standard:'5-PS1-3',source:'Adapted from James’s existing TVA Properties of Matter question bank; selected and reviewed for this app.',verified:true,rarity:'EPIC',accent:'#6dd9ff',intel:[
 {title:'Matter and properties',text:'Matter has mass and takes up space. Properties such as texture, magnetism, solubility, and conductivity help describe and identify a material.'},
 {title:'Tools and units',text:'Use a balance for mass (g), a graduated cylinder for liquid volume (mL), a ruler for length (cm), and a thermometer for temperature (°C).'},
 {title:'Magnetism',text:'Iron and ordinary carbon steel are attracted to magnets. Many metals, including aluminum and copper, are not. Color alone cannot identify magnetism.'},
 {title:'Electrical and thermal conductivity',text:'Electrical conductors let electric current pass easily. Thermal conductors transfer heat easily. Insulators slow these transfers. Compare materials using a fair test.'},
 {title:'Solubility',text:'Soluble means a substance dissolves in the liquid being tested. Sand does not dissolve in water. Dissolved salt can be recovered by evaporating the water.'},
 {title:'Mass, weight, and states',text:'Mass is the amount of matter; weight is the pull of gravity. Solids keep their shape and volume. Liquids keep volume and take the container’s shape. Gases fill the available space.'},
 {title:'Investigate fairly',text:'Change only the property you are testing. Keep other conditions the same, repeat trials, and use observations or measurements to support a conclusion.'},
 ]},
];
export const unitById=(id:UnitId)=>units.find(u=>u.id===id)!;
const scienceDefinitions:[UnitId,string,string,string,string][]=[
 ['mixtures','mix-mixture','Mixtures','What is a mixture?','Explain why combined materials can keep their original properties.'],
 ['mixtures','mix-solution','Solutions','Dissolving & solutions','Compare salt water with sand and water; dissolved salt remains present.'],
 ['mixtures','mix-reaction','Chemical changes','New substances','Decide whether evidence supports a new substance with different properties.'],
 ['mixtures','mix-gas','Reaction evidence','Gas formation','Compare gas formed by mixing with bubbles from boiling or trapped air.'],
 ['mixtures','mix-temperature','Reaction evidence','Temperature evidence','Identify a temperature change caused by mixing, and distinguish outside heating or cooling.'],
 ['mixtures','mix-solid','Reaction evidence','New solid vs. freezing','Compare a new solid from two liquids with liquid water simply freezing.'],
 ['mixtures','mix-smell','Reaction evidence','New smell','Use the reported appearance of a new smell as evidence; identify what changed.'],
 ['mixtures','mix-color','Reaction evidence','Color evidence','Compare copper changing after exposure to air with simple color mixing.'],
 ['mixtures','mix-physical','Physical changes','Same substance, new form','Review dissolving, melting, freezing, boiling, and evaporation as physical changes.'],
 ['mixtures','mix-reasoning','Scientific reasoning','Explain with evidence','State the observation and connect it to whether a new substance may have formed.'],
 ['matter','matter-vocab','Matter basics','Vocabulary & definitions','Distinguish mass, volume, temperature, properties, and observation.'],
 ['matter','matter-magnet','Material properties','Magnetism','Use a magnet to test iron and carbon steel; not all metals are magnetic.'],
 ['matter','matter-electric','Material properties','Electrical conductivity','Explain why current flows through a conductor in a working test circuit.'],
 ['matter','matter-heat','Material properties','Thermal conductivity','Compare how quickly heat transfers through metals and insulating materials.'],
 ['matter','matter-soluble','Material properties','Solubility','Choose water-solubility tests and separation methods for familiar materials.'],
 ['matter','matter-measure','Measurement','Tools, units & data','Match the property with its tool and units, and interpret simple measurements.'],
 ['matter','matter-mass','Measurement','Mass vs. weight','Separate amount of matter from gravity’s pull and track matter in closed examples.'],
 ['matter','matter-observe','Observation','Observable properties','Describe texture, hardness, transparency, flexibility, and other properties.'],
 ['matter','matter-state','States of matter','States & changes of state','Describe solid, liquid, and gas using shape, volume, and physical changes.'],
 ['matter','matter-investigate','Scientific reasoning','Fair tests & material choices','Choose a material from property evidence and keep comparison tests fair.'],
];
export const scienceSkills:Skill[]=scienceDefinitions.map(([unit,id,group,name,nextStep])=>({unit,id,group,name,nextStep}));
export const unitOfSkill=(id:string):UnitId=>id.startsWith('mul-')?'multiplication':id.startsWith('mix-')?'mixtures':id.startsWith('matter-')?'matter':'decimals';
