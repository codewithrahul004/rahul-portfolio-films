// Speech boundaries and noise floor per clip: RMS in 50 ms windows.
const fs=require('fs');
function readWav(file){const b=fs.readFileSync(file);let p=12,fmt,data;while(p<b.length){const id=b.toString('ascii',p,p+4),sz=b.readUInt32LE(p+4);if(id==='fmt ')fmt={ch:b.readUInt16LE(p+10),sr:b.readUInt32LE(p+12),bits:b.readUInt16LE(p+22)};if(id==='data'){data=b.subarray(p+8,p+8+sz);break;}p+=8+sz+(sz&1);}const n=data.length/2/fmt.ch;const x=new Float64Array(n);for(let i=0;i<n;i++){let s=0;for(let c=0;c<fmt.ch;c++)s+=data.readInt16LE((i*fmt.ch+c)*2)/32768;x[i]=s/fmt.ch;}return{sr:fmt.sr,x};}
for(const f of process.argv.slice(2)){const{sr,x}=readWav(f);const w=Math.round(sr*0.05);const r=[];for(let s=0;s+w<=x.length;s+=w){let q=0;for(let i=s;i<s+w;i++)q+=x[i]*x[i];r.push(20*Math.log10(Math.sqrt(q/w)+1e-9));}
const sorted=[...r].sort((a,b)=>a-b);const floor=sorted[Math.floor(sorted.length*0.1)];const peak=sorted[sorted.length-1];const thr=Math.max(floor+12,peak-30);
let first=r.findIndex(v=>v>thr),last=r.length-1;while(last>0&&r[last]<=thr)last--;
// longest internal pause
let gap=0,gs=0,cur=0;for(let i=first;i<=last;i++){if(r[i]<=thr){cur++;if(cur>gap){gap=cur;gs=i-cur+1;}}else cur=0;}
console.log(`${f.split('/').pop().padEnd(10)} total ${(x.length/sr).toFixed(2)}s  speech ${(first*0.05).toFixed(2)}s -> ${((last+1)*0.05).toFixed(2)}s  (${(((last+1)-first)*0.05).toFixed(2)}s)  floor ${floor.toFixed(1)} dB  peak ${peak.toFixed(1)} dB  longest pause ${(gap*0.05).toFixed(2)}s at ${(gs*0.05).toFixed(2)}s`);}
