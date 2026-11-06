import { test,expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
const key='decimal-drop-progress-v1';
test('study outline, deep reading and self-checks preserve evidence and a parked mission',async({page:p})=>{
 const errors:string[]=[];p.on('pageerror',e=>errors.push(e.message));await p.emulateMedia({reducedMotion:'reduce'});await p.setViewportSize({width:390,height:844});await p.goto('./');
 await p.getByRole('button',{name:'Science',exact:true}).click();await p.getByRole('button',{name:/Canopy Camp/i}).click();
 await p.getByRole('button',{name:'Launch mission',exact:true}).click();await p.getByRole('button',{name:'Scratchpad',exact:true}).click();await p.getByLabel('Your workspace',{exact:false}).fill('Keep my plant mission');await p.getByRole('button',{name:'Save & take a break'}).click();
 const saved=await p.evaluate(k=>localStorage.getItem(k),key);
 await p.getByRole('link',{name:'Open the Canopy Camp study & review guide ↓'}).click();
 const outline=p.getByRole('navigation',{name:'Study topic outline'});await expect(outline.locator('a')).toHaveCount(12);
 await expect(p.getByRole('complementary',{name:'Suggested review'})).toContainText('Build evidence');
 await outline.getByRole('link',{name:'Where new plant matter comes from',exact:true}).focus();await p.keyboard.press('Enter');
 const matter=p.locator('#study-new-matter');await expect(matter).toHaveAttribute('open','');await expect(matter.getByText('Fix the growth model',{exact:true})).toBeVisible();
 await expect(matter.getByText('No. It still receives matter',{exact:false})).toBeHidden();await matter.getByText('Compare your explanation',{exact:true}).click();await expect(matter.getByText('No. It still receives matter',{exact:false})).toBeVisible();
 await outline.getByRole('link',{name:'Seeds, seedlings & growing conditions',exact:true}).click();await expect(p.locator('#study-seed-growth')).toHaveAttribute('open','');await expect(matter).toHaveAttribute('open','');
 for(const width of [320,390,1280]){await p.setViewportSize({width,height:900});expect(await p.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);}
 await p.screenshot({path:'.qa/plants-review-desktop.png',fullPage:true});await p.setViewportSize({width:390,height:844});await p.screenshot({path:'.qa/plants-review-mobile.png',fullPage:true});
 expect(await p.evaluate(k=>localStorage.getItem(k),key)).toBe(saved);await p.reload();await p.getByRole('button',{name:'Resume saved mission',exact:true}).click();await expect(p.getByLabel('Your workspace',{exact:false})).toHaveValue('Keep my plant mission');expect(errors).toEqual([]);
});
test('reading suggestions adapt to sustained quiz evidence while keeping every topic available',async({page:p})=>{
 const progress=JSON.parse(readFileSync(new URL('../src/engine/fixtures/plant-photo-evidence.json',import.meta.url),'utf8'));
 // Keep the strong-evidence scenario fresh when this test runs in future weeks.
 for(const session of progress.sessions)for(const response of session.responses)response.at=Date.now();
 await p.goto('./');await p.locator('input[type=file]').setInputFiles({name:'plant-evidence.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(progress))});await expect(p.getByText('Progress imported successfully.')).toBeVisible();
 const suggestions=p.getByRole('complementary',{name:'Suggested review'});await expect(suggestions.getByRole('button',{name:'Photosynthesis: making food →',exact:true})).toHaveCount(0);
 await p.getByRole('navigation',{name:'Study topic outline'}).getByRole('link',{name:'Photosynthesis: making food',exact:true}).click();await expect(p.locator('#study-photosynthesis .review-status')).toHaveText('Keep fresh');
 expect(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)!),key)).toEqual(progress);
});
