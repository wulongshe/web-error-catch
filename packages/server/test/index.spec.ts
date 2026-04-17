import { test } from 'node:test';
import assert from 'node:assert/strict';
import { __set_consumer_map__, parseStack } from '#src/controller/parser.ts';

test('parseStack', async () => {
  const stack = `Error: custom error
    at http://localhost:8000/main.55c6cbcf6af2f8437336.js:1:690
    at HTMLButtonElement.<anonymous> (http://localhost:8000/main.55c6cbcf6af2f8437336.js:1:716)`;

  await __set_consumer_map__(
    'main.55c6cbcf6af2f8437336.js.map',
    '{"version":3,"file":"main.55c6cbcf6af2f8437336.js","mappings":"mBAAO,IAAsBA,GCAqF,SAAWC,GAAG,IAAIC,KAAKC,EAAEC,IAAIC,GCEtI,CACLD,IAAK,sCDH2IE,OAAOC,iBAAiB,SAAQC,IAAIC,QAAQC,IAAI,QAAQF,GAA5M,SAAWP,EAAEE,GAAGQ,UAAUC,WAAWX,EAAEY,KAAKC,UAAUX,GAAG,CAAsJY,CAAEV,EAAE,CAACH,KAAKC,EAAEa,MAAMR,EAAES,MAAMD,OAAM,IAAG,GAAIV,OAAOC,iBAAiB,sBAAqBC,IAAIC,QAAQC,IAAI,qBAAqBF,EAAC,IAAG,EAAG,CCE/U,GAGAU,SAASC,cAAc,QAAQC,UAAY,iHFLdpB,EEYhBkB,SAASC,cAAc,aFXxBC,UAAY,uBACpBpB,EAAQO,iBAAiB,SAE7B,YAGA,WAEI,MADAc,YAAW,IAAMC,QAAQC,OAAO,2BAC1B,IAAIC,MAAM,eACpB,CALIC,EACJ,G","sources":["webpack://react-app/./src/trigger.ts","webpack://react-app/../../packages/sdk/dist/index.js","webpack://react-app/./src/index.ts"],"sourcesContent":["export function setupCounter(element) {\\n    element.innerHTML = `trigger custom error`;\\n    element.addEventListener(\'click\', func1);\\n}\\nfunction func1() {\\n    func2();\\n}\\nfunction func2() {\\n    setTimeout(() => Promise.reject(\'custom promise reject\'));\\n    throw new Error(\'custom error\');\\n}\\n","function t(e,r){navigator.sendBeacon(e,JSON.stringify(r))}function a(e){return new TextEncoder().encode(e).buffer}function c(e){let{meta:r,url:o}=e;window.addEventListener(\\"error\\",n=>{console.log(\\"error\\",n),t(o,{meta:r,stack:n.error.stack})},!0),window.addEventListener(\\"unhandledrejection\\",n=>{console.log(\\"unhandledrejection\\",n)},!0)}export{a as convertStringToArrayBuffer,c as register};\\n","import { register } from \'@dt-wec/sdk\';\\nimport { setupCounter } from \'./trigger\';\\nregister({\\n    url: \'http://localhost:8000/report\',\\n});\\ndocument.querySelector(\'#app\').innerHTML = `\\n  <div>\\n    <div class=\\"card\\">\\n      <button id=\\"trigger\\" type=\\"button\\"></button>\\n    </div>\\n  </div>\\n`;\\nsetupCounter(document.querySelector(\'#trigger\'));\\n"],"names":["element","e","meta","r","url","o","window","addEventListener","n","console","log","navigator","sendBeacon","JSON","stringify","t","stack","error","document","querySelector","innerHTML","setTimeout","Promise","reject","Error","func2"],"sourceRoot":""}',
    200,
  );

  const stacks = await parseStack(stack);

  assert.strictEqual(stacks, `Error: custom error
  at webpack://react-app/src/trigger.ts:10:10
  at func2 (webpack://react-app/src/trigger.ts:6:4)`);

  // wait for consumer destroy
  await new Promise((resolve) => setTimeout(resolve, 200));
  assert.strictEqual(await parseStack(stack), ``);
});
