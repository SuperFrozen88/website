import { multiplyExact, normalizeExact } from './decimal';
import type { Question, Skill } from './types';
const definitions=[
 ['whole','Fluency','Decimal × whole number','Interpret equal groups and regroup tenths or hundredths.'],
 ['decimal','Fluency','Decimal × decimal','Multiply whole-number digits, then use the factors’ place values.'],
 ['place','Place value','Locate the decimal point','Explain the scale of an equivalent whole-number product.'],
 ['model','Models','Models & partial products','Connect area, equal groups, and decomposing factors to multiplication.'],
 ['estimate','Estimation','Estimate & check','Use the stated rounding rule before multiplying.'],
 ['powers','Place value','Powers-of-ten patterns','Track each digit’s value when multiplying by 10, 100, 0.1, or 0.01.'],
 ['zeros','Fluency','Regrouping & zeros','Keep placeholder zeros and regroup without losing value.'],
 ['compare','Reasoning','Products smaller than factors','Compare a positive multiplier with 1.'],
 ['money','Stories','Money & equal groups','Multiply price per item by number of items.'],
 ['measure','Stories','Measurement & multi-step missions','Name the units and solve each step in order.'],
 ['missing','Reasoning','Missing factors','Find a factor and check it by multiplication.'],
 ['error','Reasoning','Correct & explain','Use place value and estimation to evaluate a claim.'],
] as const;
export const multiplicationSkills:Skill[]=definitions.map(([id,group,name,nextStep])=>({unit:'multiplication',id:`mul-${id}`,group,name,nextStep}));
const scaled=(n:number,p:number)=>{const s=String(n).padStart(p+1,'0');return normalizeExact(p?s.slice(0,-p)+'.'+s.slice(-p):s)!;};
export function multiplicationQuestion(skill:string,seed:number):Question {
 if(!multiplicationSkills.some(s=>s.id===skill)||!Number.isSafeInteger(seed)||seed<0||seed>1000000)throw new Error('Invalid multiplication parameters');
 const v=seed%4,k=Math.floor(seed/4),n=12+k*7+v*3;
 let a=scaled(n,1),b=String(2+seed%7),answer='',text='',hint='',solution='',choices:string[]|undefined;
 let difficulty:Question['difficulty']=v<2?2:3;
 let format=['calculate','missing-factor','error-correction','story'][v];
 const product=()=>multiplyExact(a,b);
 const bridge=()=>{const places=(a.split('.')[1]?.length||0)+(b.split('.')[1]?.length||0);return `${a} × ${b} = ${product()}. Multiply ${a.replace('.','')} × ${b.replace('.','')} = ${BigInt(a.replace('.',''))*BigInt(b.replace('.',''))}; the factors have ${places} decimal places in all. Divide that whole-number product by ${10**places} and keep all places.`;};
 const choose=(correct:string,others:string[])=>{answer=correct;const list=[correct,...others];const shift=seed%4;choices=[...list.slice(shift),...list.slice(0,shift)];};
 switch(skill){
 case 'mul-whole':
 if(v===1){text=`___ × ${b} = ${product()}. Find the missing factor.`;answer=a;}
 else if(v===2)text=`A squadmate claims ${a} × ${b} = ${multiplyExact(product(),'10')}. Correct the product.`;
 else if(v===3)text=`Each supply crate holds ${a} kg of material. What is the mass of ${b} crates in kg?`;
 else text=`Calculate ${a} × ${b}.`;
 hint='Think of equal groups. Multiply the digits and preserve the value of each decimal place.';break;
 case 'mul-decimal':
 format=['calculate','area','error-correction','story'][v];
 difficulty=v<2?2:3;
 a=scaled(n+13,v<2?1:2);b=scaled(3+seed%13,v===3?2:1);
 text=v===0?`Calculate ${a} × ${b}.`:v===1?`Find the area in square meters of a rectangular banner ${a} m by ${b} m.`:v===2?`A player placed the decimal one place too far right in ${a} × ${b}, getting ${multiplyExact(product(),'10')}. Find the correct product.`:`A supply drone travels ${a} km per minute for ${b} minutes. How far does it travel in km?`;
 hint='Tenths times tenths give hundredths. Count places in both factors, then check the size.';break;
 case 'mul-place':
 b=scaled(2+seed%8,v%2+1);format=['calculate','explain','calculate','calculate'][v];
 text=`For ${a} × ${b}, the whole-number calculation is ${a.replace('.','')} × ${b.replace('.','')}. `;
 if(v===1){choose(`Divide the whole-number product by ${10**((a.split('.')[1]?.length||0)+(b.split('.')[1]?.length||0))}`,['Keep the whole-number product unchanged','Always divide by 10','Align decimal points and add']);text+='Which rule restores the factors’ place values?';}
 else text+='What is the decimal product?';
 hint='Each factor has been scaled up. Undo both scale changes in the product.';break;
 case 'mul-model':
 difficulty=v===3?2:3;
 b=scaled(2+seed%7,1);format=['area-model','equal-groups','partial-products','explain'][v];
 if(v===0){a=scaled(2+seed%7,1);text=`On a 10 × 10 grid, shade ${Number(a)*10} columns for ${a} and ${Number(b)*10} rows for ${b}. What fraction of the whole grid overlaps? Write a decimal.`;}
 else if(v===1){b=String(2+seed%5);text=`A model has ${b} equal groups of ${n} tenths. What is the total as a decimal?`;}
 else if(v===2){b=String(3+seed%4);text=`Split ${a} into ${Math.floor(n/10)} + ${scaled(n%10,1)}. Multiply each part by ${b}, then add. What is ${a} × ${b}?`;}
 else {choose('Multiply each part by the other factor, then add the partial products',['Multiply only the whole-number part','Add the two factors first','Multiply the parts, then ignore their place values']);text=`To model ${a} × ${b}, split ${a} into its whole and decimal parts. Which method preserves the product?`;}
 hint='A model must account for every equal group or every part of the area.';break;
 case 'mul-estimate': {
 a=scaled(24+k*10+v,1);b=scaled(16+seed%7,1);const x=Math.floor((24+k*10+v+5)/10),y=Math.floor((16+seed%7+5)/10);answer=String(x*y);format=['estimate','reasonableness','compare','error-check'][v];
 text=`${v===1?'Before loading a supply drop, estimate':v===2?'To choose the right size container, estimate':v===3?'Check the size of a claimed answer by estimating':'Estimate'} ${a} × ${b} by rounding EACH factor to the nearest whole number. What is that estimate?`;
 solution=`${a} rounds to ${x}; ${b} rounds to ${y}. ${x} × ${y} = ${answer}. The exact product is ${product()}; an estimate is a size check, not an exact answer.`;
 if(v===1){text=`A squadmate claims ${a} × ${b} = ${multiplyExact(product(),'10')}. Round each factor to the nearest whole number. Which judgment is sound?`;choose(`The claim is too large; the rounded-factor estimate is ${x*y}`,['The claim is exact because multiplication always enlarges','The claim is reasonable because decimals have no size','The claim is too small because both factors exceed 1']);solution+=` ${answer}.`;}
 else if(v===2){text=`Use nearest-whole-factor estimates to compare ${a} × ${b} and ${a} × 4. Which estimated product is greater?`;choose('The second product',['The first product','Both estimates are equal','Both estimates are zero']);solution+=` The second estimate is ${x} × 4 = ${x*4}. ${answer}.`;}
 else if(v===3){text=`A player rounds ${a} × ${b} by adding the rounded factors, ${x} + ${y} = ${x+y}. Correct the method: what is the rounded-factor PRODUCT estimate?`;}
 hint='Round each factor first. Multiplication of the rounded factors checks the size of a product.';break;}
 case 'mul-powers':difficulty=v<2?1:2;b=['10','100','0.1','0.01'][v];text=`A loot counter scales ${a} by ${b}. What is ${a} × ${b}?`;hint='Multiplication changes digit values. Multiplying by 0.1 takes one tenth; multiplying by 10 makes ten times as much.';break;
 case 'mul-zeros':a=scaled(105+k*100+v*10,2);b=v<2?String(6+v):scaled(2+seed%7,v===3?2:1);text=`${['Calculate while keeping the placeholder zero','Regroup carefully to calculate','Keep every small place value to calculate','A shield prop needs an exact scale factor. Calculate'][v]}: ${a} × ${b}.`;hint='Keep zeros until you have located the decimal. A small product may need zeros just after the decimal point.';break;
 case 'mul-compare':difficulty=1;b=['0.5','1','1.5','0.01'][v];format=['compare','identity','explain','compare'][v];text=`Without finding the exact product, compare ${a} × ${b} with ${a}. Which statement is sound?`;choose(v===1?'Equal: multiplying by 1 keeps the value':v===2?'Greater: the positive multiplier is greater than 1':'Smaller: the positive multiplier is between 0 and 1',v===1?['Greater: all multiplication makes numbers bigger','Smaller: all decimals make numbers smaller','Zero: multiplying by 1 removes the amount']:v===2?['Smaller: every decimal multiplier shrinks','Equal: multiplication never changes a value','Zero: any decimal factor makes zero']:['Greater: multiplication always makes numbers bigger','Equal: the multiplier can be ignored','Zero: every factor below 1 makes zero']);hint='For a positive starting amount, compare the multiplier with 1.';break;
 case 'mul-money':a=scaled(125+k*40+v*15,2);b=String(2+seed%7);text=v===0?`Each loot-llama sticker costs $${a}. What do ${b} stickers cost in dollars?`:v===1?`A squad orders ${b} badge packs at $${a} each. Find the total cost in dollars.`:v===2?`A player adds ${a} + ${b} for ${b} map cards at $${a} each. Correct the method: what is the total cost in dollars?`:`A supply list needs ${b} notebooks at $${a} each. A helmet prop costs $18 but is not ordered. What is the notebook cost in dollars?`;hint='Price per item × number of items gives total cost. Ignore prices for items not ordered.';break;
 case 'mul-measure':b=v%2?scaled(3+seed%6,1):String(2+seed%5);format=['equal-groups','area','multi-step','multi-step'][v];
 if(v===0)text=`A build uses ${b} cables, each ${a} m long. How many meters of cable are used?`;
 else if(v===1)text=`A rectangular landing mat is ${a} m long and ${b} m wide. What is its area in square meters?`;
 else {const copies=String(v===2?2:3);answer=multiplyExact(product(),copies);text=`Each training course has ${b} sections of ${a} km each. The squad completes ${copies} courses. What is the total distance in km?`;solution=`One course: ${a} × ${b} = ${product()} km. Then ${product()} × ${copies} = ${answer} km. Keep each intermediate result exact.`;}
 hint='Write the quantity for one group first. Then multiply by the number of groups. Area uses square units.';break;
 case 'mul-missing':b=scaled(2+seed%8,v===3?2:1);answer=a;text=v%2?`A rectangle has width ${b} m and area ${product()} square meters. What is its length in meters?`:`Find the missing factor: ___ × ${b} = ${product()}.`;hint='Try a factor and multiply to check. Think about how many groups fit the product.';break;
 case 'mul-error':difficulty=v%2?2:3;b=scaled(3+seed%7,v%2+1);format=['error-correction','explain','error-correction','reasoning'][v];
 if(v%2){text=`Which reasoning correctly explains ${a} × ${b}?`;choose('Multiply as whole numbers, then undo the scaling of BOTH factors',['Line up decimal points as for addition','Always give the answer two decimal places','Ignore zeros and use only one factor’s decimal places']);}
 else text=`A squadmate says ${a} × ${b} = ${multiplyExact(product(),'100')}. Correct the decimal placement. What is the actual product?`;
 hint='Check the scale of both factors, and use an estimate to challenge an oversized answer.';break;
 }
 if(!answer)answer=product();
 if(!solution)solution=bridge()+(answer!==product()&&!choices?` The missing factor is ${answer}; substituting it checks the equation.`:'')+(choices?` ${answer}.`:'');
 const q:Question={id:`${skill}:${seed}`,skill,difficulty,kind:choices?'choice':'numeric',family:`${skill}-${v}`,format,text,answer,equivalents:choices?[]:[answer.includes('.')?answer+'0':answer+'.0'],choices,solution,hint,misconceptions:{},estimatedSeconds:difficulty>=3?100:60,source:'Provisional family-approved scope; 5.NBT.B.7. Chapter 4 contents unverified.',proof:{op:'multiply',values:[],result:0,operands:[a,b],exact:product()}};
 if(!hint||!text||!solution||normalizeExact(product())===null||choices&&(new Set(choices).size!==4||!choices.includes(answer)))throw new Error(`Invalid multiplication question ${q.id}`);
 return q;
}
// 16 seeds × 12 subskills: 192 distinct prompts; four task families per skill.
export const multiplicationBank=multiplicationSkills.flatMap(s=>Array.from({length:16},(_,i)=>multiplicationQuestion(s.id,i)));
