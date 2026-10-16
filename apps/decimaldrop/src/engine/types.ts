import type { UnitId } from './units';
export type Mode = 'quick'|'standard'|'test';
export type Status = 'Not Assessed'|'Needs Practice'|'Developing'|'Proficient'|'Mastered';
export interface Skill { unit?:UnitId; id:string; group:string; name:string; nextStep:string; }
export interface Question { id:string; skill:string; difficulty:1|2|3|4|5; kind:'numeric'|'choice'; family:string; text:string; expression?:string; answer:string; equivalents:string[]; choices?:string[]; solution:string; hint:string; misconceptions:Record<string,string>; estimatedSeconds:number; format?:string; source?:string; proof:{op:'add'|'sub'|'identity'|'round'|'science'; values:number[]; result:number}; }
export interface Response { question:Question; answers:string[]; correct:boolean; firstCorrect:boolean; independent:boolean; hinted:boolean; seconds:number; at:number; error:string; work:string; }
export interface Session { unit?:UnitId; id:string; mode:Mode; diagnostic:boolean; target:string[]; questions:Question[]; responses:Response[]; startedAt:number; endedAt?:number; early?:boolean; draft:{answer:string; work:string; hinted:boolean; answers:string[]; elapsed:number; revealed?:boolean; firstHinted?:boolean}; }
export interface Progress { selectedUnit?:UnitId; paused?:Session[]; version:1; sessions:Session[]; active:Session|null; xp:number; sound:boolean; }
export interface Evidence { skill:Skill; status:Status; total:number; independent:number; successes:number; accuracy:number|null; recent:number|null; highest:number; sessions:number; stale:boolean; errors:[string,number][]; avgSeconds:number; }
