// Internal arithmetic uses integer thousandths. No binary floating-point calculations.
export function parseDecimal(raw:string):number|null {
 const value=raw.trim().replace(/^\$/,'');
 if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value) || value.length>40) return null;
 const negative=value.startsWith('-'); const unsigned=value.replace(/^[+-]/,'');
 const [whole='0',fraction='']=unsigned.split('.');
 if(fraction.slice(3).replace(/0/g,'')!=='') return null;
 const n=Number(whole||0)*1000+Number((fraction+'000').slice(0,3));
 return Number.isSafeInteger(n)? (negative?-n:n):null;
}
export function decimal(n:number,places?:number):string {
 if(!Number.isSafeInteger(n)) throw new Error('Expected safe integer thousandths');
 const abs=Math.abs(n); const fraction=String(abs%1000).padStart(3,'0');
 const out=`${n<0?'-':''}${Math.floor(abs/1000)}.${fraction}`;
 return places===undefined?out.replace(/\.?0+$/,''):out.slice(0,out.indexOf('.')+1+places).replace(/\.$/,'');
}
export function equivalent(a:string,b:string):boolean {const x=parseDecimal(a),y=parseDecimal(b);return x!==null&&y!==null&&x===y;}
export function validAnswer(raw:string,q:{kind:string;answer:string;equivalents:string[]}):boolean {return q.kind==='numeric'? [q.answer,...q.equivalents].some(a=>equivalent(raw,a)):[q.answer,...q.equivalents].includes(raw.trim());}
export function roundWhole(n:number):number { return Math.floor((n+500)/1000)*1000; }
