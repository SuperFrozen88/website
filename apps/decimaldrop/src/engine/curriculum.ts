import { socialStudiesSkills } from './social-studies';
import { multiplicationSkills } from './multiplication';
import { scienceSkills } from './units';
import type { UnitId } from './units';
import type { Skill } from './types';
// Editable provisional scope. These are app labels, NOT official Go Math! lesson titles.
export const curriculum = { title:'Add & subtract decimals', reference:'Go Math! Grade 5 • Chapter 3 (edition unconfirmed)', verified:false, standard:'5.NBT.B.7', diagnosticSessions:3 };
const definitions = [
 ['Place value','digit','Digit values','Use a place-value chart to compare tenths, hundredths, and thousandths.'],
 ['Place value','equivalent','Equivalent decimals','Add trailing zeros and explain why the value stays the same.'],
 ['Place value','alignment','Decimal alignment','Line up decimal points so each column has the same place value.'],
 ['Estimation','round','Round to estimate','Round each number first, then calculate the estimate.'],
 ['Estimation','reasonable','Reasonable answers','Use nearby whole numbers to rule out unreasonable answers.'],
 ['Estimation','check','Check with estimation','Estimate before calculating and compare the two results.'],
 ['Addition','add-basic','Matching decimal places','Add tenths and hundredths with decimal points aligned.'],
 ['Addition','add-length','Different decimal lengths','Write equivalent decimals with matching lengths before adding.'],
 ['Addition','add-thousand','Addition through thousandths','Use three decimal places and check each column.'],
 ['Addition','add-regroup','Addition with regrouping','Trade ten hundredths for one tenth when a column totals ten or more.'],
 ['Addition','add-multi','Three or more addends','Group friendly pairs, then add the remaining amount.'],
 ['Addition','add-whole','Whole numbers + decimals','Write the whole number with a decimal point and zeros.'],
 ['Subtraction','sub-basic','Matching decimal places','Subtract each aligned column and check by adding back.'],
 ['Subtraction','sub-length','Different decimal lengths','Append zeros before subtracting aligned columns.'],
 ['Subtraction','sub-regroup','Subtraction with regrouping','Trade from the column to the left before subtracting.'],
 ['Subtraction','sub-zeros','Borrowing across zeros','Practice 10 − 3.875 and trace each regrouping across the zeros.'],
 ['Subtraction','sub-whole','Decimals from whole numbers','Rewrite a whole number as an equivalent decimal, then regroup.'],
 ['Subtraction','sub-thousand','Subtraction through thousandths','Work column by column and use addition to verify the difference.'],
 ['Mental math','compatible','Compatible numbers','Look for decimal pairs that make a whole number.'],
 ['Mental math','break','Break numbers apart','Split a decimal into its whole and fractional parts.'],
 ['Mental math','compensate','Compensation','Change a number to a friendly number, then undo that change.'],
 ['Word problems','money','Money & making change','Subtract the total cost from the amount paid.'],
 ['Word problems','measure','Measurements & distances','Identify whether distances are combined or compared.'],
 ['Word problems','multistep','Multi-step problems','Write one equation for each step and label the intermediate result.'],
 ['Word problems','operation','Choose an operation','Decide whether the story asks for a total or a difference.'],
 ['Word problems','relevant','Relevant information','Cross out facts that do not affect the quantity asked for.'],
 ['Reasoning','error','Find & correct errors','Check place-value alignment, then calculate the correct result.'],
 ['Reasoning','missing','Missing-number equations','Use the inverse operation to find and check the missing number.'],
 ['Reasoning','strategy','Explain a strategy','Explain how regrouping or compensation preserves the value.'],
] as const;
export const skills:Skill[] = definitions.map(([group,id,name,nextStep])=>({group,id,name,nextStep}));
export const groups = [...new Set(skills.map(s=>s.group))];
export const assessmentConfig = { minimumEvidence:3, proficientSuccessRate:0.8, proficientSessions:2, masteredEvidence:6, masteredSuccessRate:0.9, masteredSessions:3, masteredDifficulty:4, staleDays:14, diagnosticSessions:curriculum.diagnosticSessions };
export const modes = { quick:{name:'Quick Practice',label:'Scout run',count:6,time:'~5 min'},standard:{name:'Standard Quiz',label:'Training mission',count:12,time:'10–15 min'},test:{name:'Practice Test',label:'Full island run',count:20,time:'20–25 min'} };

export const allSkills=[...skills,...scienceSkills,...multiplicationSkills,...socialStudiesSkills];
export const skillsFor=(unit:UnitId='decimals')=>unit==='exploration'?socialStudiesSkills:unit==='decimals'?skills:unit==='multiplication'?multiplicationSkills:scienceSkills.filter(s=>s.unit===unit);
export const groupsFor=(unit:UnitId='decimals')=>[...new Set(skillsFor(unit).map(s=>s.group))];
