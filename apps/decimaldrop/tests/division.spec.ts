import { test,expect,type Page } from '@playwright/test';
const key='decimal-drop-progress-v1';
async function current(p:Page){return p.evaluate(key=>{const s=JSON.parse(localStorage.getItem(key)!).active;return s.questions[s.responses.length];},key);}
async function equip(p:Page){await p.getByRole('button',{name:'Math',exact:true}).click();await p.getByRole('button',{name:/Quotient Quarry/i}).click();}
async function answer(p:Page,q:any,testMode=false){if(q.kind==='numeric')await p.getByLabel('Your answer',{exact:true}).fill(q.answer);else await p.getByRole('radio',{name:q.answer,exact:true}).check();await p.getByRole('button',{name:testMode?'Save answer & continue':'Check answer',exact:true}).click();}
test('division mobile diagnostic covers every skill with feedback and parent targeting',async({page:p})=>{
 await p.setViewportSize({width:390,height:844});await p.goto('./');await equip(p);
 await p.locator('.intel-grid summary').filter({hasText:'Pack prices: find one first'}).click();await expect(p.getByText('not $4.80 × 6',{exact:false})).toBeVisible();
 await p.screenshot({path:'.qa/division-mobile-lobby.png',fullPage:true});expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
 await p.getByRole('button',{name:'Launch mission',exact:true}).click();const skills=new Set<string>();
 for(let i=0;i<12;i++){const q=await current(p);expect(q.skill).toMatch(/^div-/);skills.add(q.skill);if(!i)await p.getByRole('button',{name:'Get a hint',exact:true}).click();await answer(p,q);await expect(p.getByText(q.solution,{exact:true})).toBeVisible();expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);if(i===1)await p.screenshot({path:'.qa/division-mobile-question.png',fullPage:true});await p.getByRole('button',{name:i===11?'Finish mission':'Next challenge',exact:true}).click();}
 expect(skills.size).toBe(12);
 await p.getByRole('button',{name:'View skill evidence',exact:true}).click();await expect(p.getByText('Pack prices',{exact:false}).first()).toBeVisible();await p.screenshot({path:'.qa/division-parent.png',fullPage:true});
 await p.getByRole('button',{name:/Practice/}).first().click();expect((await current(p)).skill).toMatch(/^div-/);
});
test('typed money answers with a dollar sign and trailing zero are accepted',async({page:p})=>{
 await p.goto('./');await equip(p);await p.getByRole('button',{name:'Launch mission',exact:true}).click();
 for(let i=0;i<12;i++){const q=await current(p);if(q.kind==='numeric'&&q.answer.includes('.')){await p.getByLabel('Your answer',{exact:true}).fill('$'+q.answer+'0');await p.getByRole('button',{name:'Check answer',exact:true}).click();await expect(p.locator('.feedback.correct')).toBeVisible();return;}await answer(p,q);await p.getByRole('button',{name:'Next challenge',exact:true}).click();}
 throw new Error('No decimal numeric question appeared');
});
test('division practice test hides feedback until the debrief',async({page:p})=>{await p.goto('./');await equip(p);await p.getByRole('button',{name:/Full island run Practice Test/}).click();await p.getByRole('button',{name:'Launch mission',exact:true}).click();await expect(p.getByRole('button',{name:'Get a hint',exact:true})).toHaveCount(0);for(let i=0;i<20;i++){const q=await current(p);await expect(p.getByText(q.solution,{exact:true})).toHaveCount(0);await answer(p,q,true);await expect(p.locator('.answer-right')).toHaveCount(0);}await expect(p.getByRole('heading',{name:'Victory Royale!',exact:true})).toBeVisible();});
