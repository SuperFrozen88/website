import { test,expect,type Page } from '@playwright/test';
const key='decimal-drop-progress-v1';
async function equip(p:Page){await p.getByRole('button',{name:'Science',exact:true}).click();await p.getByRole('button',{name:/Habitat Hollow/i}).click();}
async function current(p:Page){return p.evaluate(k=>{const s=JSON.parse(localStorage.getItem(k)!).active;return s.questions[s.responses.length];},key);}
test('ecosystems mobile intel, a full diagnostic with feedback, and skill evidence',async({page:p})=>{
 const errors:string[]=[];p.on('pageerror',e=>errors.push(e.message));
 await p.setViewportSize({width:390,height:844});await p.goto('./');await equip(p);
 await expect(p.getByRole('heading',{name:'Ecosystems',exact:true})).toBeVisible();
 await p.locator('.intel-grid summary').filter({hasText:'Claim, evidence, reasoning'}).click();
 await expect(p.getByText('only 3 of 12 in round 3',{exact:false})).toBeVisible();
 expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
 await p.getByRole('button',{name:'Launch mission',exact:true}).click();const skills=new Set<string>();
 for(let i=0;i<12;i++){const q=await current(p);expect(q.skill).toMatch(/^eco-/);skills.add(q.skill);const chosen=i===1?q.choices.find((a:string)=>a!==q.answer):q.answer;
  await p.getByRole('radio',{name:chosen,exact:true}).check();await expect(p.getByText(q.solution,{exact:true})).toBeVisible();
  expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);if(i===2)await p.screenshot({path:'.qa/ecosystems-mobile-question.png',fullPage:true});
  await p.getByRole('button',{name:i===11?'Finish mission':'Next challenge',exact:true}).click();}
 expect(skills.size).toBe(12);
 await p.getByRole('button',{name:'View skill evidence',exact:true}).click();
 await expect(p.getByText('ECOSYSTEMS · READINESS',{exact:true})).toBeVisible();
 await p.screenshot({path:'.qa/ecosystems-mobile-evidence.png',fullPage:true});
 expect(errors).toEqual([]);
});
test('ecosystems practice test hides hints and correctness until debrief',async({page:p})=>{
 await p.goto('./');await equip(p);await p.getByRole('button',{name:/Full island run Practice Test/}).click();await p.getByRole('button',{name:'Launch mission',exact:true}).click();
 await expect(p.getByRole('button',{name:'Get a hint',exact:true})).toHaveCount(0);
 for(let i=0;i<20;i++){const q=await current(p);await p.getByRole('radio',{name:q.answer,exact:true}).check();await expect(p.locator('.answer-right')).toHaveCount(0);await p.getByRole('button',{name:'Save answer & continue',exact:true}).click();}
 await expect(p.getByRole('heading',{name:'Victory Royale!',exact:true})).toBeVisible();
});
