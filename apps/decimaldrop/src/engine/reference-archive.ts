// Test helper. Reference photos live in the private whitejs/website-references repo,
// not in this public repo. The text manifests stay here. When the private repo is checked
// out next to this one (or DECIMALDROP_REFERENCES points to its decimaldrop/ folder),
// every photo is also verified byte-for-byte.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
type Manifest={count:number;files:{filename:string;bytes:number;sha256:string}[]};
const publicDir=fileURLToPath(new URL('../../docs/reference/',import.meta.url));
export const privateReferences=process.env.DECIMALDROP_REFERENCES||fileURLToPath(new URL('../../../../../website-references/decimaldrop/',import.meta.url));
export function checkArchive(folder:string,subdir:string,count:number):{manifest:Manifest;bytesVerified:boolean} {
 const manifest=JSON.parse(readFileSync(join(publicDir,folder,'manifest.json'),'utf8')) as Manifest;
 if(manifest.count!==count||manifest.files.length!==count)throw new Error(`${folder}: expected ${count} manifest entries`);
 for(const f of manifest.files){if(!/^[0-9a-f]{64}$/.test(f.sha256)||!(f.bytes>0))throw new Error(`${folder}: bad manifest entry ${f.filename}`);if(existsSync(join(publicDir,folder,subdir,f.filename)))throw new Error(`${folder}: ${f.filename} must not be stored in the public repo`);}
 const root=join(privateReferences,folder);
 if(!existsSync(join(root,'manifest.json')))return {manifest,bytesVerified:false};
 for(const f of manifest.files){const b=readFileSync(join(root,subdir,f.filename));if(b.length!==f.bytes||createHash('sha256').update(b).digest('hex')!==f.sha256)throw new Error(`${folder}: ${f.filename} does not match its manifest`);}
 return {manifest,bytesVerified:true};
}
