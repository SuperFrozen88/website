import { it,expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import original from './fixtures/original-plants-bank.json';
import items from './plants-bank.json';
import { scienceQuestion } from './science';
import { plantReview,reviewSignal,suggestedReview } from './plant-review';
import { plantSkills } from './plants';
import { assess,readiness } from './assessment';
import { emptyProgress,startSession,advance,submitDraft } from './session';
import { importProgress } from './storage';
it('keeps every original plant definition unchanged and imports original questions, history and drafts',()=>{
 expect(items.slice(0,80)).toEqual(original);
 let p=startSession(emptyProgress(),'standard',[],'plants');
 p.active!.questions=p.active!.questions.map((q,i)=>scienceQuestion(q.skill,i%8));
 p=advance(submitDraft(p,p.active!.questions[0].answer,30,'old plant work'),30);
 p.active!.draft.work='parked original plant mission';
 const saved=JSON.stringify(p);expect(importProgress(saved)).toEqual(p);
 expect(readiness(assess(p,Date.now(),'plants')).label).toBe('Needs Work');
});
it('covers every plant skill, new educational sources, vocabulary and explanation tasks',()=>{
 expect(new Set(plantReview.map(t=>t.id)).size).toBe(plantReview.length);
 for(const skill of plantSkills)expect(plantReview.some(t=>t.skills.includes(skill.id))).toBe(true);
 const files=items.flatMap(q=>'sourceFiles' in q?q.sourceFiles:[]);
 for(const filename of ['IMG_0490.HEIC','IMG_0492.HEIC','IMG_0493.HEIC','IMG_0494.heic','IMG_0495.HEIC','IMG_0496.HEIC','IMG_0497.heic','IMG_5867.jpeg','IMG_5869.jpeg','IMG_5870.jpeg','IMG_5871.jpeg','IMG_5873.jpeg','IMG_5874.jpeg','IMG_5878.jpeg'])expect(files).toContain(filename);
 for(const t of plantReview){expect(t.overview.length).toBeGreaterThan(60);expect(t.sections.length).toBeGreaterThanOrEqual(2);expect(t.check.length).toBeGreaterThan(30);expect(t.answer.length).toBeGreaterThan(50);}
 expect(items.slice(80).some(q=>q.format==='claim-evidence')).toBe(true);
 expect(items.slice(80).some(q=>q.text.includes('weight'))).toBe(true);
});
it('suggests gaps without diagnosing one wrong answer and adapts to sustained need, stale and strong evidence',()=>{
 let p=startSession(emptyProgress(),'quick',['plant-photo'],'plants');
 const baseline=JSON.stringify(p),topic=plantReview.find(t=>t.id==='photosynthesis')!;
 expect(suggestedReview(assess(p,Date.now(),'plants'))).toHaveLength(3);
 const q=p.active!.questions[0];p=advance(submitDraft(p,q.choices!.find(a=>a!==q.answer)!,30,''),30);
 let e=assess(p,Date.now(),'plants');expect(reviewSignal(topic,e).label).toBe('Build evidence');
 const row=e.find(x=>x.skill.id==='plant-photo')!;row.status='Needs Practice';row.independent=4;
 expect(suggestedReview(e)[0].topic.id).toBe('photosynthesis');
 row.status='Mastered';row.stale=true;expect(reviewSignal(topic,e).label).toBe('Refresh this area');
 row.stale=false;expect(reviewSignal(topic,e).label).toBe('Keep fresh');
 const restored=JSON.parse(baseline);e=assess(restored,Date.now(),'plants');suggestedReview(e);expect(JSON.stringify(restored)).toBe(baseline);
});
it('archives the additional17 images byte-for-byte',()=>{const dir=new URL('../../docs/reference/plants-2026-11-05/additional/',import.meta.url);const m=JSON.parse(readFileSync(new URL('manifest.json',dir),'utf8'));expect(m.count).toBe(17);for(const f of m.files){const bytes=readFileSync(new URL(f.filename,dir));expect(bytes.length).toBe(f.bytes);expect(createHash('sha256').update(bytes).digest('hex')).toBe(f.sha256);}});
