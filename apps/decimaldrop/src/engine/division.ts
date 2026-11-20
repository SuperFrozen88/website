import { multiplyExact, divideExact, addExact, normalizeExact, decimalPlaces } from './decimal';
import type { Question, Skill } from './types';
// Scope: family-supplied Go Math! Grade 5 Chapter 5 Review/Test (Divide Decimals), pp. 243–247.
// App labels are not official lesson titles. Questions are original, not copied test items.
const definitions=[
 ['powers','Place value','Divide by powers of 10','Each division by 10 makes every digit worth one tenth as much. 10⁰ = 1.','1, 2'],
 ['patterns','Place value','Patterns & changing divisors','Write the expression, then compare how a share changes when the divisor changes.','3'],
 ['model-whole','Models','Model decimal ÷ whole number','Share ones first, regroup leftovers as tenths or hundredths, then share again.','4'],
 ['estimate','Estimation','Estimate with compatible numbers','Change the numbers to nearby numbers that divide easily, then check the size.','5, 6, 7'],
 ['whole','Fluency','Divide decimals by whole numbers','Place the decimal point in the quotient above the dividend’s decimal point.','8, 10, 18'],
 ['model-decimal','Models','Model decimal ÷ decimal','Ask how many groups of the divisor fit in the dividend.','13'],
 ['decimal','Fluency','Divide by a decimal','Multiply both numbers by the same power of 10 so the divisor is a whole number.','11, 14, 15, 16'],
 ['zeros','Fluency','Write zeros in the dividend','Add zeros after the last dividend digit when you need more places to keep dividing.','17, 18'],
 ['money','Stories','Money: unit price & how many','Total ÷ number of items gives the price of one; total ÷ price gives how many.','7, 12, 14'],
 ['groups','Stories','Pack prices','When a price is for a pack, find the price of one item before buying a different number.','9A'],
 ['backward','Stories','Work backward in multistep problems','Undo the steps in reverse: subtract known costs, then divide by the number of items.','9B, 12B'],
 ['check','Reasoning','Place the decimal & check','Estimate to place the decimal point; multiply the quotient by the divisor to check.','3C, 11, 14'],
] as const;
export const divisionSkills:Skill[]=definitions.map(([id,group,name,nextStep])=>({unit:'division',id:`div-${id}`,group,name,nextStep}));
export const divisionTestMap=Object.fromEntries(definitions.map(([id,,,,items])=>[`div-${id}`,items]));
const S=(n:number,p:number)=>{const s=String(n).padStart(p+1,'0');return normalizeExact(p?s.slice(0,-p)+'.'+s.slice(-p):s)!;};
const $=(raw:string)=>{const [w,f='']=normalizeExact(raw)!.split('.');return `$${w}.${(f+'00').slice(0,2)}`;};
const sup=(n:number)=>'⁰¹²³'[n];
const times=multiplyExact, plus=(a:string,b:string)=>addExact(a,b), minus=(a:string,b:string)=>addExact(a,b,-1);
const needsZero=(a:string,b:string)=>{const shift=decimalPlaces(b);if(decimalPlaces(a)<shift)return true;const scaled=times(a,String(10**shift));return decimalPlaces(divideExact(scaled,times(b,String(10**shift)))!)>decimalPlaces(scaled);};
export function divisionQuestion(skill:string,seed:number):Question {
 if(!divisionSkills.some(s=>s.id===skill)||!Number.isSafeInteger(seed)||seed<0||seed>1000000)throw new Error('Invalid division parameters');
 const v=seed%4,k=Math.floor(seed/4)%997;
 let compat:[string,string]|null=null;
 let a='',b='',answer='',text='',hint='',solution='',choices:string[]|undefined,exact:string|null=null;
 let difficulty:Question['difficulty']=2;
 let format=['calculate','model','story','reasoning'][v];
 const choose=(correct:string,others:string[])=>{answer=correct;const list=[correct,...others];const shift=seed%4;choices=[...list.slice(shift),...list.slice(0,shift)];};
 const quotient=()=>divideExact(a,b)!;
 const split=(q:string,divisor:string)=>{b=divisor;a=times(q,divisor);};
 switch(skill){
 case 'div-powers': {
  a=S(125+(k*37+v*13)%880,1);
  const power=v===0||v===3?1:v===1?2:k%2?0:3;b=String(10**power);
  text=v===0?`Divide: ${a} ÷ 10.`:v===1?`Write the value: ${a} ÷ 10².`:v===2?`A supply map is being scaled. What is ${a} ÷ 10${sup(power)}?`:`A storm trail is ${a} km long. Your squad has hiked one-tenth of the trail. How many km has the squad hiked?`;
  format=['calculate','exponent','exponent','story'][v];difficulty=v===0?1:2;
  hint='Each time you divide by 10, every digit moves one place to the right into a smaller place value, so the decimal point seems to move one place left. 10⁰ is 1.';
  solution=power===0?`10⁰ = 1, and dividing by 1 keeps the value: ${a} ÷ 1 = ${quotient()}.`:`${v===3?'One-tenth of an amount means dividing by 10. ':''}10${sup(power)} = ${b}. Dividing by ${b} makes each digit worth 1/${b} as much. Every digit moves ${power} place${power>1?'s':''} to the right, so the decimal point seems to move ${power} place${power>1?'s':''} left: ${a} ÷ ${b} = ${quotient()}.`;
  break;}
 case 'div-patterns': {
  a=String(135+(k*25+v*11)%760);b=v===2?'10':v===3?'1000':'100';
  const per100=divideExact(a,'100')!,per10=divideExact(a,'10')!;
  format=['story','expression','compare','pattern'][v];difficulty=v===2?3:2;
  if(v===0)text=`A squad hauls ${a} kg of supplies packed evenly into 100 identical crates. What is the mass of one crate in kg?`;
  else if(v===1){text=`${a} kg of supplies fills 100 identical crates. Which expression finds the mass of ONE crate?`;choose(`${a} ÷ 100`,[`100 ÷ ${a}`,`${a} × 100`,`${a} − 100`]);}
  else if(v===2){text=`The same ${a} kg of supplies is packed into only 10 identical crates instead of 100. How does the mass of each crate change?`;choose(`Each crate holds 10 times as much: ${per10} kg instead of ${per100} kg`,[`Each crate holds one-tenth as much: ${divideExact(a,'1000')} kg instead of ${per100} kg`,`Each crate holds the same mass: ${per100} kg`,`Each crate holds 100 times as much: ${a} kg instead of ${per100} kg`]);}
  else text=`Complete the pattern. ${a} ÷ 10⁰ = ${a}, ${a} ÷ 10¹ = ${per10}, ${a} ÷ 10² = ${per100}. What is ${a} ÷ 10³?`;
  hint='Equal shares of a total use division: total ÷ number of groups. Fewer groups means each share is larger.';
  solution=v===3?`Each time the power of 10 goes up by one, the divisor is 10 times larger and every digit moves one more place to the right: ${a} ÷ 10³ = ${a} ÷ 1000 = ${quotient()}.`:v===2?`With 100 crates, ${a} ÷ 100 = ${per100} kg each. With 10 crates, ${a} ÷ 10 = ${per10} kg each. Dividing by a divisor 10 times smaller makes each share 10 times as large. ${answer}.`:`One crate is the total shared by the number of crates: ${a} ÷ ${b} = ${quotient()}.${v===1?` ${answer}.`:''}`;
  break;}
 case 'div-model-whole': {
  const divisor=String(2+seed%5);
  split(v===2?S(111+(k*7+v*3)%88,2):S(11+(k*3+v)%17,1),divisor);
  format=['base-ten','tenths','hundredths','story'][v];difficulty=v===0?1:2;
  if(v===0)text=`Use base-ten blocks to model ${a} and share them equally among ${b} groups. How much is in each group?`;
  else if(v===1){answer=times(quotient(),'10');text=`A model shows ${a} as ${times(a,'10')} tenths. Share the tenths equally among ${b} groups. How many tenths are in each group?`;}
  else if(v===2)text=`Use ones, tenths, and hundredths blocks to model ${a} ÷ ${b}. What decimal is in each group?`;
  else text=`A ${a}-meter zip-line cable is cut into ${b} equal pieces. Draw a model. How long is each piece in meters?`;
  hint='Share the ones first. Regroup any leftover one as 10 tenths (and leftover tenths as 10 hundredths), then keep sharing.';
  solution=v===1?`${times(a,'10')} tenths ÷ ${b} = ${answer} tenths in each group, which is ${quotient()}.`:`Share the blocks equally: ${a} ÷ ${b} = ${quotient()}. Check: ${quotient()} × ${b} = ${a}.`;
  break;}
 case 'div-estimate': {
  format=['compatible','reasonable','money','decimal-divisor'][v];difficulty=v%2?3:2;
  hint='Compatible numbers are close to the real numbers and divide easily, such as 30 ÷ 3 or 600 ÷ 40.';
  if(v===0){const dd=3+seed%7,m=6+k%7,D=dd*m;a=S(D*10-(1+k%3),1);b=String(dd);exact=String(m);compat=[String(D),String(dd)];
   text=`A ${a}-foot rope will be cut into ${dd} equal jump ropes. Which division uses compatible numbers to estimate the length of each rope?`;
   choose(`${D} ÷ ${dd} = ${m} feet`,[`${D} ÷ ${dd} = ${m*10} feet`,`${D} ÷ ${dd} = ${S(m,1)} feet`,`${D} × ${dd} = ${D*dd} feet`]);
   solution=`${a} is close to ${D}, and ${D} divides evenly by ${dd}. ${D} ÷ ${dd} = ${m}, so each rope is about ${m} feet. ${answer}.`;}
  else if(v===1){const dd=[20,30,40,50][k%4],m=[12,15,16,18,21,24][(k+seed)%6],D=dd*m;a=S(D*10+13+(k%7)*10,1);b=String(dd+1);exact=String(m);compat=[String(D),String(dd)];
   text=`A Battle Bus prop drove ${a} miles. It travels about ${b} miles on each gallon of fuel. Which is a reasonable estimate of the number of gallons it used?`;
   choose(`About ${m} gallons`,[`About ${S(m,1)} gallons`,`About ${m*10} gallons`,`About ${m*100} gallons`]);
   solution=`Use compatible numbers: ${a} is close to ${D} and ${b} is close to ${dd}. ${D} ÷ ${dd} = ${m}. ${answer}.`;}
  else if(v===2){const [D,dd]=([[10,20],[12,30],[16,40],[18,30],[15,50],[24,40]] as const)[k%6];const E=divideExact(String(D),String(dd))!;a=S(D*100-(23+(k%5)*9),2);b=String(dd-2);exact=E;compat=[String(D),String(dd)];
   text=`A box of ${b} golf-ball props costs ${$(a)}. About how much does each one cost?`;
   choose(`About ${$(E)}`,[`About ${$(times(E,'10'))}`,`About ${$(divideExact(E,'10')!)}`,`About ${$(times(E,'100'))}`]);
   solution=`Use compatible numbers: ${$(a)} is close to $${D} and ${b} is close to ${dd}. $${D} ÷ ${dd} = ${$(E)}. ${answer}.`;}
  else {const [D,dd]=([[8,'0.4'],[6,'0.3'],[12,'0.6'],[9,'0.3'],[16,'0.8'],[15,'0.5']] as const)[k%6];const E=divideExact(String(D),dd)!;a=S(D*10-1-k%2,1);b=dd;exact=E;compat=[String(D),dd];
   text=`Estimate ${a} ÷ ${b} using compatible numbers.`;
   choose(`${D} ÷ ${b} = ${E}`,[`${D} ÷ ${b} = ${divideExact(E,'10')}`,`${D} ÷ ${b} = ${times(E,'10')}`,`${D} ÷ ${b} = ${divideExact(E,'100')}`]);
   solution=`${a} is close to ${D}. How many groups of ${b} are in ${D}? ${D} ÷ ${b} = ${E} because ${E} × ${b} = ${D}. ${answer}.`;}
  break;}
 case 'div-whole': {
  difficulty=v===3?3:2;format=['calculate','story','story','two-digit-divisor'][v];
  if(v===0){split(S(104+(k*23)%800,2),String(3+seed%7));text=`Divide: ${a} ÷ ${b}.`;}
  else if(v===1){split(S(32+(k*9)%90,1),String(4+seed%5));text=`A ${a}-foot tree-trunk prop is cut into ${b} equal logs. How long is each log in feet?`;}
  else if(v===2){split(S(56+(k*13)%90,2),String(6+seed%6));text=`A package of ${b} identical map booklets weighs ${a} pounds. How much does each booklet weigh in pounds?`;}
  else {split(S(132+(k*17)%300,2),String(12+seed%9));text=`${a} liters of shield potion is poured equally into ${b} bottles. How many liters go in each bottle?`;}
  hint='Divide as with whole numbers. Place the decimal point in the quotient directly above the decimal point in the dividend.';
  solution=`${a} ÷ ${b} = ${quotient()}. Place the quotient’s decimal point above the dividend’s. Check: ${quotient()} × ${b} = ${a}.`;
  break;}
 case 'div-model-decimal': {
  format=['tenths-grid','hundredths-grid','meaning','two-grids'][v];difficulty=v===0?1:2;
  const q=v===2?String(2+k%5):v===3?String(3+(k*2)%7):String(v===1?3+k%6:2+k%7);
  split(q,v===1?S(5*(1+k%5),2):v===3?S(3+k%6,1):S(2+(v===2?k:seed)%7,1));
  if(v===0)text=`On a decimal grid, ${a} is shaded. You circle groups of ${b}. How many groups do you circle?`;
  else if(v===1)text=`On a hundredths grid, ${a} is shaded. How many groups of ${b} can you circle?`;
  else if(v===2){text=`What does ${a} ÷ ${b} = ${q} mean on a decimal model?`;choose(`There are ${q} groups of ${b} in ${a}`,[`There are ${b} groups of ${q} in ${a}`,`${a} is ${q} tenths less than ${b}`,`Each of ${q} groups holds ${a}`]);}
  else text=`Shade ${a} on decimal grids, then circle groups of ${b}. What is ${a} ÷ ${b}?`;
  hint='Dividing by a decimal asks: how many groups of the divisor fit in the dividend?';
  solution=`Circle groups of ${b} until all of ${a} is used: ${q} groups. So ${a} ÷ ${b} = ${q}. Check: ${q} × ${b} = ${a}.${choices?` ${answer}.`:''}`;
  break;}
 case 'div-decimal': {
  difficulty=v===1?2:3;format=['calculate','how-many','rate','money'][v];
  if(v===0){split(S(21+(k*7)%40,1),S(12+k%17,1));text=`Divide: ${a} ÷ ${b}.`;}
  else if(v===1){split(String(8+k%9),S(3+(k+seed)%7,1));text=`A ${a}-pound bag of trail mix is split into snack packs of ${b} pound each. How many packs can be made?`;}
  else if(v===2){split(S(15+(k*3)%30,1),S(18+k%15,1));text=`A player jogs ${a} miles at an average speed of ${b} miles per hour. How many hours does the jog take?`;}
  else {split(String(3+k%6),S(49+(k*7)%50,2));text=`Cheese wedges cost ${$(b)} per pound. A squad pays ${$(a)}. How many pounds of cheese did they buy?`;}
  const shift=10**decimalPlaces(b);
  hint='Multiply the divisor and the dividend by the same power of 10 so the divisor is a whole number. Then divide.';
  solution=`Multiply both by ${shift}: ${a} ÷ ${b} = ${times(a,String(shift))} ÷ ${times(b,String(shift))} = ${quotient()}. Check: ${quotient()} × ${b} = ${a}.`;
  break;}
 case 'div-zeros': {
  format=['calculate','yes-no','story','rewrite'][v];difficulty=v===3?2:3;
  const hundredths=(j:number)=>{const d=(['0.05','0.25','0.04','0.02'] as const)[j%4];split(String([2,2,5,5][j%4]*(3+(j*3)%9)),d);};
  if(v===0||v===3)hundredths(k+v);
  else if(v===1){if(k%3===0)hundredths(k+1);else if(k%3===1)split(S(11+(k*7)%60,1),S(2+k%8,1));else split(S(104+(k*29)%400,2),String([4,5,8,15][k%4]));}
  else {const divisor=[4,8,12,5,15,25][k%6];let t=7+(k*3)%40;if(divisor%2&&t%5===0)t++;split(S(divisor%2===0?5*(2*t+1):2*t,2),String(divisor));}
  const shift=10**decimalPlaces(b),A=times(a,String(shift)),B=times(b,String(shift)),zero=needsZero(a,b);
  if(v===0)text=`Divide. You will need to write at least one zero in the dividend: ${a} ÷ ${b}.`;
  else if(v===1){text=`To find ${a} ÷ ${b}, must you write a zero in the dividend?`;choose(zero?'Yes, a zero must be written in the dividend':'No, no zero is needed in the dividend',[zero?'No, no zero is needed in the dividend':'Yes, a zero must be written in the dividend','Only when the divisor is a whole number','Only when the quotient is a whole number']);}
  else if(v===2)text=`A cook makes ${a} quarts of soup and shares it equally among ${b} containers. How many quarts go in each container?`;
  else {answer=A;text=`Make the divisor a whole number: ${a} ÷ ${b} = ___ ÷ ${B}. What is the new dividend?`;}
  hint='Write zeros after the last digit of the dividend. They do not change its value, but they give you more places to keep dividing.';
  const why=decimalPlaces(a)<decimalPlaces(b)?`${a} has fewer decimal places than ${b}, so a zero is written to move its decimal point ${decimalPlaces(b)} places`:zero?`the division would end with a remainder, so a zero is written after the last digit of ${A} to keep dividing`:`${A} ÷ ${B} ends without a remainder using the digits already there`;
  solution=`${shift>1?`Multiply both by ${shift}: ${a} ÷ ${b} = ${A} ÷ ${B}. `:''}${zero?'A zero is needed':'No zero is needed'} because ${why}. ${a} ÷ ${b} = ${quotient()}.${choices?` ${answer}.`:''}`;
  break;}
 case 'div-money': {
  difficulty=v<2?2:3;format=['unit-price','how-many','combination','per-pound'][v];
  if(v===0){split(S(31+(k*11)%60,2),String(12+k%13));text=`A box of ${b} trading-card packs costs ${$(a)}. What does each pack cost in dollars?`;solution=`Price of one = total ÷ number of packs: ${$(a)} ÷ ${b} = ${$(quotient())}. Check: ${$(quotient())} × ${b} = ${$(a)}.`;}
  else if(v===1){split(String(3+k%6),S(55+(k*9)%40,2));text=`Poster boards cost ${$(b)} each. A squad spends ${$(a)} on poster boards. How many do they buy?`;solution=`Number bought = total ÷ price of one: ${$(a)} ÷ ${$(b)} = ${quotient()}. Check: ${quotient()} × ${$(b)} = ${$(a)}.`;}
  else if(v===2){
   const [p1,p2]=([[95,99],[85,79],[115,95],[65,105],[125,89]] as const)[k%5];
   const solutions=(total:number)=>{const found:[number,number][]=[];for(let x=1;x<=12;x++)for(let y=1;y<=12;y++)if(x*p1+y*p2===total)found.push([x,y]);return found;};
   let x=1+k%4,y=2+(k*3)%5;while(x===y||solutions(x*p1+y*p2).length!==1){y++;if(y>9){y=1;x++;}}
   const total=x*p1+y*p2;a=S(total-x*p1,2);b=S(p2,2);
   const name=(i:number,j:number)=>`${i} paintbrush${i===1?'':'es'} and ${j} jar${j===1?'':'s'} of paint`;
   const others=[[y,x],[x+1,Math.max(1,y-1)],[Math.max(1,x-1),y+1],[x+2,y],[x,y+2]].filter(([i,j])=>!(i===x&&j===y)).map(([i,j])=>name(i,j)).filter((s,i,all)=>all.indexOf(s)===i).slice(0,3);
   text=`Paintbrushes cost ${$(S(p1,2))} each and jars of paint cost ${$(b)} each. A player spends ${$(S(total,2))} and buys at least one of each. How many of each did they buy?`;
   choose(name(x,y),others);
   solution=`Try numbers of paintbrushes. With ${x}: ${$(S(total,2))} − ${x} × ${$(S(p1,2))} = ${$(a)}, and ${$(a)} ÷ ${$(b)} = ${y} jars exactly. Check: ${x} × ${$(S(p1,2))} + ${y} × ${$(b)} = ${$(S(total,2))}. ${answer}.`;}
  else {const price=S(10*(5+k%12),2);split(price,S(15+(k*7)%40,1));const lbs=b;text=`${lbs} pounds of apples cost ${$(a)}. What is the price per pound in dollars?`;solution=`Price per pound = total cost ÷ pounds: ${$(a)} ÷ ${lbs} = ${$(quotient())}. Multiply both by 10: ${times(a,'10')} ÷ ${times(lbs,'10')} = ${quotient()}.`;}
  hint='Total ÷ number of items gives the price of one item. Total ÷ price of one item gives how many items.';
  break;}
 case 'div-groups': {
  difficulty=v===0?1:v===1?2:3;format=['unit-price','buy-some','error-correction','mixed-order'][v];
  hint='A pack price is for the whole pack. Divide the pack price by the pack size to get the price of one, then multiply by how many you buy.';
  if(v===0){const s=[4,6,8,10,12][k%5],u=35+(k*7)%60;split(S(u,2),String(s));text=`A pack of ${s} glow sticks costs ${$(a)}. What is the price of one glow stick in dollars?`;solution=`${$(a)} ÷ ${s} = ${$(quotient())} for one glow stick.`;}
  else if(v===1){const s=[4,6,10][k%3],u=45+(k*11)%50,n=s+2+k%3;a=S(u*s,2);b=String(s);answer=S(u*n,2);text=`A pack of ${s} stickers costs ${$(a)}. Single stickers sell at the same price per sticker. How much do ${n} stickers cost in dollars?`;solution=`One sticker: ${$(a)} ÷ ${s} = ${$(S(u,2))}. Then ${n} × ${$(S(u,2))} = ${$(answer)}.`;}
  else if(v===2){const u=45+(k*13)%80,n=[6,12,3,9][k%4],P=u*6;a=S(P,2);b='6';const correct=S(u*n,2);
   text=`Rose bundles cost ${$(a)} for a half dozen (6 roses). A player says ${n} roses cost ${$(a)} × ${n} = ${$(S(P*n,2))}. What do ${n} roses actually cost?`;
   choose($(correct),[$(S(P*n,2)),$(S(u,2)),$(S(P+u*n,2))]);
   solution=`The ${$(a)} price is for 6 roses, not one. One rose: ${$(a)} ÷ 6 = ${$(S(u,2))}. ${n} roses: ${n} × ${$(S(u,2))} = ${$(correct)}. ${answer}.`;}
  else {const us=[55+(k*7)%40,40+(k*11)%35,65+(k*5)%45],ns=[[6,3,9],[3,6,12],[12,3,6],[9,6,3]][k%4];const names=['lilies','daisies','tulips'];
   a=S(us[0]*6,2);b='6';const parts=us.map((u,i)=>S(u*ns[i],2));answer=parts.reduce(plus);
   text=`A florist sells bundles of 6 flowers: lilies ${$(S(us[0]*6,2))}, daisies ${$(S(us[1]*6,2))}, and tulips ${$(S(us[2]*6,2))} per bundle. A squad buys ${ns[0]} lilies, ${ns[1]} daisies, and ${ns[2]} tulips. What is the total cost in dollars?`;
   solution=`Find one flower’s price first: ${us.map((u,i)=>`${names[i]} ${$(S(u*6,2))} ÷ 6 = ${$(S(u,2))}`).join('; ')}. Then ${ns.map((n,i)=>`${n} × ${$(S(us[i],2))} = ${$(parts[i])}`).join('; ')}. Total: ${$(answer)}.`;}
  break;}
 case 'div-backward': {
  difficulty=v<2?3:2;format=['multistep','strategy','fee','coupon'][v];
  const x=135+(k*23+v*41)%300,n=3+(k+v)%4;b=String(n);
  hint='Work backward: take away the amounts you already know, then divide what is left by the number of equal items.';
  if(v<2){const m=2,p=249+(k*31)%300,t=50+(k*17)%150,total=n*x+m*p+t;a=S(n*x,2);
   text=`A player buys ${n} packs of glass beads and ${m} vases that cost ${$(S(p,2))} each. Sales tax is ${$(S(t,2))}. The total is ${$(S(total,2))}.${v===0?' What does one pack of beads cost in dollars?':' Which strategy finds the cost of one pack of beads?'}`;
   if(v===1)choose(`Subtract the tax and the cost of both vases from ${$(S(total,2))}, then divide by ${n}`,[`Divide ${$(S(total,2))} by ${n+m}`,`Subtract only the tax, then divide by ${n}`,`Add the tax to ${$(S(total,2))}, then divide by ${n}`]);
   solution=`Vases: ${m} × ${$(S(p,2))} = ${$(S(m*p,2))}. ${$(S(total,2))} − ${$(S(t,2))} − ${$(S(m*p,2))} = ${$(a)} for the beads. ${$(a)} ÷ ${n} = ${$(S(x,2))} per pack.${v===1?` ${answer}.`:''}`;}
  else if(v===2){const fee=150+(k*19)%300;a=S(n*x,2);text=`A squad pays ${$(S(n*x+fee,2))} for ${n} event tickets, including one ${$(S(fee,2))} booking fee. What does one ticket cost in dollars?`;solution=`Remove the fee first: ${$(S(n*x+fee,2))} − ${$(S(fee,2))} = ${$(a)}. Then ${$(a)} ÷ ${n} = ${$(S(x,2))} per ticket.`;}
  else {const c=200+(k*25)%500;a=S(n*x,2);text=`${n} friends split a restaurant bill evenly. The bill was ${$(S(n*x+c,2))}, and they used a ${$(S(c,2))} coupon first. How much does each friend pay in dollars?`;solution=`Use the coupon first: ${$(S(n*x+c,2))} − ${$(S(c,2))} = ${$(a)}. Then ${$(a)} ÷ ${n} = ${$(S(x,2))} each.`;}
  break;}
 case 'div-check': {
  format=['error-correction','check','place-decimal','explain'][v];difficulty=v%2?2:3;
  if(v===0){split(S(21+(k*7)%40,1),S(12+k%17,1));const wrong=times(quotient(),'10');text=`A squadmate says ${a} ÷ ${b} = ${wrong}. Use an estimate to fix the decimal point. What is the correct quotient?`;const near=Math.round(Number(quotient()));solution=`Estimate: ${a} is about ${Math.round(Number(a))} and ${b} is about ${Math.round(Number(b))}, so the quotient is ${near?`close to ${near}`:'less than 1'}, not ${wrong}. ${a} ÷ ${b} = ${quotient()}. Check: ${quotient()} × ${b} = ${a}.`;}
  else if(v===1){split(S(41+(k*13)%90,2),String(3+k%9));const q=quotient();text=`Which calculation checks that ${a} ÷ ${b} = ${q}?`;choose(`${q} × ${b} = ${a}`,[`${q} + ${b} = ${plus(q,b)}`,`${a} × ${b} = ${times(a,b)}`,`${a} − ${q} = ${minus(a,q)}`]);solution=`Multiplication undoes division: ${q} × ${b} = ${a}, so the quotient is correct. ${answer}.`;}
  else if(v===2){let n=11+(k*7)%80;if(n%10===0)n++;split(S(n,1),S(12+k%30,1));const q=quotient();text=`The digits of the quotient ${a} ÷ ${b} are ${q.replace('.','')}. Use an estimate to place the decimal point. What is the quotient?`;choose(q,[divideExact(q,'10')!,times(q,'10'),divideExact(q,'100')!]);solution=`${a} ÷ ${b} is about ${Math.round(Number(a))} ÷ ${Math.round(Number(b))}, so the quotient is close to ${Math.round(Number(a)/Number(b))}. Only ${q} has that size. Check: ${q} × ${b} = ${a}. ${answer}.`;}
  else {split(S(13+(k*7)%60,1),S(3+k%9,1));const shift=10**decimalPlaces(b);text=`To find ${a} ÷ ${b}, a player multiplies both numbers by ${shift}. Why does this work?`;choose('Multiplying both numbers by the same power of 10 keeps the quotient the same and makes the divisor a whole number',[`It makes the quotient ${shift} times greater, so the answer must be divided by ${shift} at the end`,'Only the divisor matters, so the dividend can stay the same','It rounds both numbers, so the answer is only an estimate']);solution=`${a} ÷ ${b} and ${times(a,String(shift))} ÷ ${times(b,String(shift))} have the same quotient, ${quotient()}, because both numbers were scaled by ${shift}. ${answer}.`;}
  hint='Estimate with whole numbers to decide where the decimal point goes. Multiply the quotient by the divisor to check.';
  break;}
 }
 if(exact===null)exact=quotient();
 if(!answer)answer=exact;
 const q:Question={id:`${skill}:${seed}`,skill,difficulty,kind:choices?'choice':'numeric',family:`${skill}-${v}`,format,text,answer,equivalents:[],choices,solution,hint,misconceptions:{},estimatedSeconds:difficulty>=3?110:70,source:'Family-supplied Go Math! Grade 5 Chapter 5 Review/Test (Divide Decimals), pp. 243–247; 5.NBT.B.7. Original practice questions.',proof:{op:'divide',values:[],result:0,operands:compat||[a,b],exact}};
 if(!hint||!text||!solution||!a||!b||normalizeExact(answer)===null&&!choices||choices&&(new Set(choices).size!==4||!choices.includes(answer)))throw new Error(`Invalid division question ${q.id}`);
 return q;
}
// 16 seeds × 12 skills: 192 distinct prompts; four task families per skill.
export const divisionBank=divisionSkills.flatMap(s=>Array.from({length:16},(_,i)=>divisionQuestion(s.id,i)));
import type { Unit } from './units';
export const divisionUnit:Unit={id:'division',subject:'Math',title:'Dividing Decimals',zone:'Quotient Quarry',subtitle:'Split every supply drop. Place every decimal.',standard:'5.NBT.B.7',source:'Based on the family-supplied Go Math! Grade 5 Chapter 5 Review/Test (Divide Decimals), pages 243–247. App skill labels are not official lesson titles; questions are original.',verified:true,rarity:'EPIC',accent:'#7ad7ff',intel:[
 {title:'Dividing by powers of 10',text:'Each division by 10 makes every digit worth one tenth as much. 35.5 ÷ 10 = 3.55 and 35.5 ÷ 10² = 0.355. 10⁰ = 1, so 35.5 ÷ 10⁰ = 35.5. One-tenth of 13.7 miles is 13.7 ÷ 10 = 1.37 miles.'},
 {title:'Fewer groups, bigger shares',text:'235 pounds shared by 100 fish is 235 ÷ 100 = 2.35 pounds each. With only 10 fish, 235 ÷ 10 = 23.5 pounds: dividing by a number 10 times smaller makes each share 10 times as large. Say both numbers and why.'},
 {title:'Model decimal ÷ whole number',text:'For 5.5 ÷ 5, put 1 whole in each of 5 groups, then share the 5 tenths: 1.1 each. If a whole is left over, regroup it as 10 tenths and keep sharing.'},
 {title:'Compatible numbers',text:'29.8 ÷ 3 is close to 30 ÷ 3 = 10. 617.3 miles at 41 miles per gallon is close to 600 ÷ 40 = 15 gallons. $9.54 for 18 items is close to $10 ÷ 20 = $0.50 each. Estimates check the size of an answer.'},
 {title:'Decimal ÷ whole number',text:'Divide like whole numbers and put the quotient’s decimal point right above the dividend’s. 6.72 ÷ 8 = 0.84. Check: 0.84 × 8 = 6.72.'},
 {title:'Model decimal ÷ decimal',text:'1.4 ÷ 0.7 asks: how many groups of 0.7 are in 1.4? Shade 1.4 on grids, circle groups of 7 tenths: 2 groups.'},
 {title:'Make the divisor whole',text:'Multiply both numbers by the same power of 10. 9.52 ÷ 2.8 = 95.2 ÷ 28 = 3.4. $3.95 ÷ $0.79 = 395 ÷ 79 = 5. The quotient does not change.'},
 {title:'Write zeros in the dividend',text:'1.4 ÷ 0.05 = 140 ÷ 5: write a zero so the decimal can move 2 places. 22.8 ÷ 15: after 1.5, a remainder is left, so write 22.80 and keep dividing to get 1.52. 2.52 ÷ 0.6 = 25.2 ÷ 6 = 4.2 needs no zero.'},
 {title:'Pack prices: find one first',text:'If 6 flowers cost $4.80, one costs $4.80 ÷ 6 = $0.80. Six flowers cost $4.80, not $4.80 × 6. For 4 flowers: 4 × $0.80 = $3.20. Read whether a price is for one item or a pack.'},
 {title:'Work backward',text:'Total $28.50 includes $1.34 tax and two $3.59 vases. Subtract what you know: $28.50 − $1.34 − $7.18 leaves the beads’ cost. Then divide by the number of bead packs.'},
 {title:'Which combination?',text:'$4.87 on brushes ($0.95) and paint ($0.99): try 1 brush, 2 brushes, … and check whether what is left divides evenly by $0.99. 2 × $0.95 + 3 × $0.99 = $4.87.'},
 {title:'Place the decimal and check',text:'For 7.8 ÷ 0.6, estimate 8 ÷ 0.5 = 16, so 13 is sensible and 1.3 is not. Always check: quotient × divisor = dividend.'},
]};
