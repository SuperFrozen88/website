import { decimal as d, roundWhole, validAnswer } from './decimal';
import { skills } from './curriculum';
import type { Question } from './types';
export function generateQuestion(skill:string,seed:number):Question {
 if(!skills.some(s=>s.id===skill)||!Number.isSafeInteger(seed)||seed<0) throw new Error('Invalid question parameters');
 const v=seed%4, k=Math.floor(seed/4), base=2000+k*1000;
 let a=base+240,b=1320,c=460,op:'add'|'sub'|'identity'|'round'='add',values:number[]=[];
 let text='',expression='',answer='',solution='',hint='Line up the decimal points. Add trailing zeros when needed.',kind:'numeric'|'choice'='numeric',choices:string[]|undefined;
 let result=0,difficulty:1|2|3|4|5=2;
 let misconception='Unclassified';
 const add=(x:number,y:number)=>{a=x;b=y;result=x+y;op='add';values=[x,y];expression=`${d(x)} + ${d(y)}`;};
 const sub=(x:number,y:number)=>{a=x;b=y;result=x-y;op='sub';values=[x,y];expression=`${d(x)} − ${d(y)}`;};
 const choice=(correct:string,others:string[])=>{kind='choice';answer=correct;choices=[correct,...others];const rotate=seed%choices.length;choices=[...choices.slice(rotate),...choices.slice(0,rotate)];};
 switch(skill){
 case 'digit': {const places=['tenths','hundredths','thousandths'];const idx=seed%3;const digit=2+seed%7;const n=base+digit*[100,10,1][idx];result=digit*[100,10,1][idx];op='identity';values=[result];text=`In ${d(n,3)}, what is the value of the digit ${digit} in the ${places[idx]} place?`;solution=`The ${places[idx]} place is ${idx+1} place${idx?'s':''} to the right of the decimal point. ${digit} ${places[idx]} = ${d(result)}.`;hint='Name each place as you move right from the decimal point.';misconception='Place-value misunderstanding';break;}
 case 'equivalent': result=base+500+v*100;op='identity';values=[result];text=`Fill in the equivalent decimal: ${d(result)} = ___ (write three decimal places).`;solution=`${d(result)} = ${d(result,3)}. Trailing zeros do not change the value.`;hint='Zeros at the end of the decimal part do not change its value.';difficulty=1;break;
 case 'alignment': {add(base+200+v*100,470);text=`Why should ${d(a)} be written as ${d(a,2)} when adding ${d(b)}?`;choice('To line up equal place values',['To make the first number larger','To move the decimal point to the right','To turn tenths into whole numbers']);solution=`${d(a)} and ${d(a,2)} are equal. Aligning decimal points puts tenths under tenths and hundredths under hundredths.`;hint='Think about what each column represents.';misconception='Decimal misalignment';break;}
 case 'round': add(base+380+v*110,2640+v*100);op='round';values=[a,b];result=roundWhole(a)+roundWhole(b);text=`Round EACH number to the nearest whole number, then estimate the sum.`;solution=`${d(a)} rounds to ${d(roundWhole(a))} and ${d(b)} rounds to ${d(roundWhole(b))}. Estimate: ${d(roundWhole(a))} + ${d(roundWhole(b))} = ${d(result)}.`;hint='Look at the tenths digit to round each number first.';misconception='Rounding error';break;
 case 'reasonable': sub(base+8450+v*100,3620);text=`A route is ${d(a)} km long. You travel ${d(b)} km. Which is a reasonable whole-number estimate of the distance left?`;result=roundWhole(a)-roundWhole(b);op='round';values=[a,-b];choice(d(result),[d(result+10000),d(result+20000),d(result+30000)]);solution=`Round the distances: ${d(roundWhole(a))} − ${d(roundWhole(b))} = ${d(result)} km (about). The distance left should be less than the full route.`;hint='Round both distances, then subtract.';misconception='Rounding error';break;
 case 'check': add(base+480+v*100,3260);text=`Estimate ${d(a)} + ${d(b)} by rounding EACH number to a whole number. What should the sum be close to?`;result=roundWhole(a)+roundWhole(b);op='round';values=[a,b];solution=`Round first: ${d(roundWhole(a))} + ${d(roundWhole(b))} = ${d(result)}. An exact answer far from ${d(result)} needs another look.`;expression='';hint='An estimate is a check, not the exact answer.';misconception='Rounding error';break;
 case 'add-basic': add(base+(v%2===0?100:110)+v*100,v%2===0?200:220+v*10);difficulty=v%2===0?1:2;break;
 case 'add-length': add(base+200+v*100,1340+v*10);misconception='Decimal misalignment';break;
 case 'add-thousand': add(base+147+v*101,1226+v*12);difficulty=3;break;
 case 'add-regroup': add(base+780+v*10,1670+v*10);difficulty=3;misconception='Incorrect regrouping';break;
 case 'add-multi': a=base+250+v*100;b=750-v*100;c=1360+v*10;result=a+b+c;values=[a,b,c];expression=`${d(a)} + ${d(b)} + ${d(c)}`;difficulty=3;solution=`Pair compatible numbers: ${d(a)} + ${d(b)} = ${d(a+b)}. Then ${d(a+b)} + ${d(c)} = ${d(result)}.`;break;
 case 'add-whole': add(base,2750+v*110);break;
 case 'sub-basic': sub(base+(v%2===0?800:870)+v*10,v%2===0?300+v*10:340+v*10);difficulty=v%2===0?1:2;break;
 case 'sub-length': sub(base+600+v*100,1240+v*10);misconception='Decimal misalignment';break;
 case 'sub-regroup': sub(base+320+v*10,1780+v*10);difficulty=3;misconception='Incorrect regrouping';break;
 case 'sub-zeros': sub(10000+k*1000+v*10000,v%2===0?3875+v*110:3870+v*110);difficulty=v%2===0?4:3;misconception='Difficulty borrowing across zeros';hint='Write the whole number with three zeros after the decimal. Regroup one whole into 10 tenths, then continue trading to the right.';solution=`Write ${d(a)} as ${d(a,3)}. Regroup across the zeros: trade 1 whole for 10 tenths, 1 tenth for 10 hundredths, and 1 hundredth for 10 thousandths. Subtract in aligned columns: ${d(a,3)} − ${d(b,3)} = ${d(result,3)}. Check: ${d(b)} + ${d(result)} = ${d(a)}.`;break;
 case 'sub-whole': sub(base+5000,2360+v*110);difficulty=3;misconception='Difficulty borrowing across zeros';break;
 case 'sub-thousand': sub(15003+k*1000+v*10000,6728+v*110);difficulty=4;misconception='Incorrect regrouping';break;
 case 'compatible': add(base+250+v*100,750-v*100);text='Find the friendly pair. Add mentally.';hint='The decimal parts together make one whole.';solution=`${d(a%1000)} + ${d(b)} = 1. Add that whole to ${d(a-a%1000)} to get ${d(result)}.`;break;
 case 'break': sub(base+870+v*10,1250);text='Break the second number into 1 and 0.25. What is the difference?';solution=`${d(a)} − 1 = ${d(a-1000)}. Then ${d(a-1000)} − 0.25 = ${d(result)}.`;hint='Subtract the whole part, then the decimal part.';break;
 case 'compensate': add(base+670+v*10,1990);text='Use compensation to add mentally.';solution=`Add 2 instead of 1.99: ${d(a)} + 2 = ${d(a+2000)}. That is 0.01 too much, so subtract 0.01: ${d(result)}.`;hint='1.99 is just 0.01 less than 2.';difficulty=3;break;
 case 'money': sub(10000+k*1000+v*10000,4370+v*110);text=`At the training-island shop, a notebook costs $${d(b,2)}. You pay $${d(a,2)}. How much change should you get?`;expression='';hint='Change is the amount paid minus the cost.';solution=`Subtract the cost from the amount paid: $${d(a,2)} − $${d(b,2)} = $${d(result,2)}.`;break;
 case 'measure': if(v%2===0){add(base+350,2480+v*100);text=`You glide ${d(a)} km to the lookout, then walk ${d(b)} km to camp. What is the total distance in km?`;}else{sub(base+6350,2480+v*100);text=`The trail is ${d(a)} km long. You have traveled ${d(b)} km. How many km remain?`;}expression='';difficulty=3;hint=v%2===0?'Combine the two distances.':'Subtract the distance already traveled.';break;
 case 'multistep': a=10000+k*1000+v*10000;b=2370+v*110;c=1850;result=a-b-c;values=[a,b+c];op='sub';text=`You have ${d(a)} m of cable. Use ${d(b)} m for a beacon and ${d(c)} m for a supply station. How many meters remain?`;solution=`First find the cable used: ${d(b)} + ${d(c)} = ${d(b+c)} m. Then subtract: ${d(a)} − ${d(b+c)} = ${d(result)} m.`;hint='Add the two lengths used, then subtract from the starting length.';difficulty=4;break;
 case 'operation': sub(base+840,1460+v*10);text=`A ramp is ${d(a)} m high and a platform is ${d(b)} m high. Which equation gives how much higher the ramp is?`;choice(`${d(a)} − ${d(b)} = ?`,[`${d(a)} + ${d(b)} = ?`,`${d(b)} − ${d(a)} = ?`,`${d(a)} + ${d(a)} = ?`]);solution=`“How much higher” asks for a difference. Subtract the smaller height from the larger: ${d(a)} − ${d(b)} = ${d(result)} m.`;hint='Are we combining heights or comparing them?';misconception='Incorrect operation selection';break;
 case 'relevant': add(base+750,1360+v*100);text=`Your squad has ${3+v} players. You collect ${d(a)} kg of metal and ${d(b)} kg of wood. What is the total mass in kg?`;expression='';solution=`The number of players does not affect the mass. Add the two masses: ${d(a)} + ${d(b)} = ${d(result)} kg.`;hint='Only use quantities measured in kilograms.';misconception='Word-problem comprehension';break;
 case 'error': {
 if(v===0){add(base+200,470);const wrong=(a/100+b/10)*10;text=`A player writes ${d(a)} + ${d(b)} = ${d(wrong)}. They lined up the last digits instead of decimal points. What is the correct sum?`;solution=`Line up the decimal points: ${d(a,2)} + ${d(b,2)} = ${d(result,2)}. Last-digit alignment incorrectly treats tenths as hundredths.`;misconception='Decimal misalignment';}
 else if(v===1){add(base+780,1670);text=`A player writes ${d(a)} + ${d(b)} = ${d(result-1000)}. They forgot the whole carried from the tenths column. What is the correct sum?`;solution=`Add aligned columns. 7 tenths + 6 tenths plus 1 carried tenth makes 14 tenths: write 4 tenths and carry 1 whole. ${d(a)} + ${d(b)} = ${d(result)}.`;misconception='Incorrect regrouping';}
 else if(v===2){sub(base+5000,2360);text=`A player says ${d(a)} − ${d(b)} cannot be solved because the whole number has no decimal digits. Find the difference.`;solution=`A whole number has equivalent decimal forms: ${d(a)} = ${d(a,2)}. Regroup across the zeros, then subtract: ${d(a,2)} − ${d(b,2)} = ${d(result,2)}.`;misconception='Difficulty borrowing across zeros';}
 else{sub(base+320,1780);text=`A player says you can swap only the hundredths digits when the top digit is too small in ${d(a)} − ${d(b)}. Correct their method by finding the actual difference.`;solution=`Keep both numbers unchanged. Regroup 1 tenth into 10 hundredths instead of swapping digits. Continue regrouping as needed: ${d(a,2)} − ${d(b,2)} = ${d(result,2)}.`;misconception='Incorrect regrouping';}
 expression='';hint='Equivalent decimals and regrouping preserve value. Swapping digits does not.';difficulty=3;break;
 }
 case 'missing': sub(base+875+v*10,1240);text=v%2===0?`Find the missing number. ___ + ${d(b)} = ${d(a)}`:`Find the missing number. ${d(a)} − ___ = ${d(b)}`;expression='';solution=`Use the inverse relationship: ${d(a)} − ${d(b)} = ${d(result)}. Check: ${d(result)} + ${d(b)} = ${d(a)}.`;hint='Addition and subtraction undo each other.';difficulty=3;break;
 case 'strategy': add(base+650+v*10,1990);text=`A player computes ${d(a)} + 1.99 by adding 2, then subtracting 0.01. Why does this work?`;choice('Adding 2 adds 0.01 too much; subtracting 0.01 corrects it',['Adding 2 adds 0.1 too much','You always subtract 0.01 after adding decimals','The decimal points can be ignored']);solution=`1.99 = 2 − 0.01, so ${d(a)} + 1.99 = ${d(a)} + 2 − 0.01 = ${d(result)}.`;hint='Compare 1.99 with 2.';difficulty=4;break;
 default: throw new Error('Unknown skill');
 }
 if(!text) text=['Calculate the result.','Complete this supply-drop calculation.','Find the total or difference.','Solve this training challenge.'][v];
 if(!answer) answer=d(result);
 if(!solution) solution=op==='sub'?`Line up decimal points: ${d(a,3)} − ${d(b,3)} = ${d(result,3)}. Add zeros without changing the numbers. Regroup if a top digit is smaller. Check by adding back: ${d(result)} + ${d(b)} = ${d(a)}.`:`Line up decimal points: ${d(a,3)} + ${d(b,3)} = ${d(result,3)}. Add each column from right to left, regrouping 10 of one place as 1 of the next place.`;
 // Several presentation families per skill, avoiding identical frames in a session.
 const q:Question={id:`${skill}:${seed}`,skill,difficulty,kind:choices?'choice':'numeric',family:`${skill}-${v}`,text,expression:expression||undefined,answer,equivalents:!choices?[d(result,3)]:[],choices,solution,hint,misconceptions:!choices?{[d(result+1000)]:misconception,[d(result+100)]:misconception}:{},estimatedSeconds:difficulty>=4?100:choices?45:60,proof:{op,values,result}};
 if(!validateQuestion(q)) throw new Error(`Invalid generated question ${q.id}`);
 return q;
}
export function validateQuestion(q:Question):boolean {
 const {op,values,result}=q.proof;
 const expected=op==='add'?values.reduce((a,b)=>a+b,0):op==='sub'?values[0]-values[1]:op==='round'?values.reduce((a,b)=>a+(b<0?-roundWhole(-b):roundWhole(b)),0):values[0];
 return expected===result && Number.isSafeInteger(result) && (q.kind==='choice'?!!q.choices?.includes(q.answer):validAnswer(d(result),q));
}
export const questionBank:Question[]=skills.flatMap(s=>Array.from({length:12},(_,i)=>generateQuestion(s.id,i)));
