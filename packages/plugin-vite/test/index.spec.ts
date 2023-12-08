import { test, expect } from 'vitest';
import { convertSourceMaps } from '../src/utils';

test('convertSourceMaps', async () => {
  const assets: any = {
    'assets/index-2adaf709.js': {
      exports: [],
      isDynamicEntry: false,
      isEntry: true,
      isImplicitEntry: false,
      name: 'index',
      type: 'chunk',
      dynamicImports: [],
      fileName: 'assets/index-2adaf709.js',
      implicitlyLoadedBefore: [],
      importedBindings: {},
      imports: [],
      code:
        '(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll(\'link[rel="modulepreload"]\'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();const c="/assets/typescript-f6ead1af.svg",a="/vite.svg";function l(e){e.innerHTML="trigger custom error",e.addEventListener("click",()=>{throw new Error("custom error")})}function d(e,t){navigator.sendBeacon?u(e,t):typeof fetch<"u"?g(e,t):typeof XMLHttpRequest<"u"?p(e,t):f(e,t)}function u(e,t){navigator.sendBeacon(e,JSON.stringify(t))}function f(e,t){new Image().src=`${e}?${new URLSearchParams(t)}`}function p(e,t){let n=new XMLHttpRequest;n.open("GET",`${e}?${new URLSearchParams(t)}`),n.send()}function g(e,t){fetch(`${e}?${new URLSearchParams(t)}`)}function h({meta:e,url:t}){window.addEventListener("error",n=>{d(t,{meta:e,stack:n.error.stack})},!0)}function m({meta:e,url:t}){window.addEventListener("unhandledrejection",n=>{console.log("unhandledrejection",n)},!0)}function y(e){h(e),m(e)}y({url:"http://localhost:8000/report/error"});document.querySelector("#app").innerHTML=`\n' +
        '  <div>\n' +
        '    <a href="https://vitejs.dev" target="_blank">\n' +
        '      <img src="${a}" class="logo" alt="Vite logo" />\n' +
        '    </a>\n' +
        '    <a href="https://www.typescriptlang.org/" target="_blank">\n' +
        '      <img src="${c}" class="logo vanilla" alt="TypeScript logo" />\n' +
        '    </a>\n' +
        '    <h1>Vite + TypeScript</h1>\n' +
        '    <div class="card">\n' +
        '      <button id="trigger" type="button"></button>\n' +
        '    </div>\n' +
        '    <p class="read-the-docs">\n' +
        '      Click on the Vite and TypeScript logos to learn more\n' +
        '    </p>\n' +
        '  </div>\n' +
        '`;l(document.querySelector("#trigger"));\n' +
        '//# sourceMappingURL=index-2adaf709.js.map\n',
      preliminaryFileName: 'assets/index-!~{001}~.js',
      sourcemapFileName: 'assets/index-2adaf709.js.map',
    },
    'assets/index-2adaf709.js.map': {
      fileName: 'assets/index-2adaf709.js.map',
      name: undefined,
      needsCodeReference: false,
      source:
        '{"version":3,"file":"index-2adaf709.js","sources":["../../src/typescript.svg","../../../../../../../../vite.svg","../../src/trigger.ts","../../../../packages/sdk/dist/index.js","../../src/main.ts"],"sourcesContent":["export default \\"__VITE_ASSET__aef69d3e__\\"","export default \\"__VITE_PUBLIC_ASSET__d6945b69__\\"","export function setupCounter(element: HTMLButtonElement) {\\n  element.innerHTML = `trigger custom error`;\\n  element.addEventListener(\'click\', () => {\\n    throw new Error(\'custom error\');\\n  });\\n}\\n","function r(e,n){navigator.sendBeacon?s(e,n):typeof fetch!=\\"undefined\\"?d(e,n):typeof XMLHttpRequest!=\\"undefined\\"?a(e,n):c(e,n)}function s(e,n){navigator.sendBeacon(e,JSON.stringify(n))}function c(e,n){new Image().src=`${e}?${new URLSearchParams(n)}`}function a(e,n){let t=new XMLHttpRequest;t.open(\\"GET\\",`${e}?${new URLSearchParams(n)}`),t.send()}function d(e,n){fetch(`${e}?${new URLSearchParams(n)}`)}function o({meta:e,url:n}){window.addEventListener(\\"error\\",t=>{r(n,{meta:e,stack:t.error.stack})},!0)}function i({meta:e,url:n}){window.addEventListener(\\"unhandledrejection\\",t=>{console.log(\\"unhandledrejection\\",t)},!0)}function g(e){o(e),i(e)}export{g as register};\\n","import \'./style.css\'\\nimport typescriptLogo from \'./typescript.svg\'\\nimport viteLogo from \'/vite.svg\'\\nimport { setupCounter } from \'./trigger.ts\'\\nimport { register } from \'@dt-wec/sdk\';\\n\\nregister({\\n  url: \'http://localhost:8000/report/error\',\\n});\\n\\ndocument.querySelector<HTMLDivElement>(\'#app\')!.innerHTML = `\\n  <div>\\n    <a href=\\"https://vitejs.dev\\" target=\\"_blank\\">\\n      <img src=\\"${viteLogo}\\" class=\\"logo\\" alt=\\"Vite logo\\" />\\n    </a>\\n    <a href=\\"https://www.typescriptlang.org/\\" target=\\"_blank\\">\\n      <img src=\\"${typescriptLogo}\\" class=\\"logo vanilla\\" alt=\\"TypeScript logo\\" />\\n    </a>\\n    <h1>Vite + TypeScript</h1>\\n    <div class=\\"card\\">\\n      <button id=\\"trigger\\" type=\\"button\\"></button>\\n    </div>\\n    <p class=\\"read-the-docs\\">\\n      Click on the Vite and TypeScript logos to learn more\\n    </p>\\n  </div>\\n`\\n\\nsetupCounter(document.querySelector<HTMLButtonElement>(\'#trigger\')!)\\n"],"names":["typescriptLogo","viteLogo","setupCounter","element","r","n","s","d","a","c","t","o","i","g","register"],"mappings":"ssBAAA,MAAeA,EAAA,kCCAAC,EAAA,YCAR,SAASC,EAAaC,EAA4B,CACvDA,EAAQ,UAAY,uBACZA,EAAA,iBAAiB,QAAS,IAAM,CAChC,MAAA,IAAI,MAAM,cAAc,CAAA,CAC/B,CACH,CCLA,SAASC,EAAE,EAAEC,EAAE,CAAC,UAAU,WAAWC,EAAE,EAAED,CAAC,EAAE,OAAO,MAAO,IAAYE,EAAE,EAAEF,CAAC,EAAE,OAAO,eAAgB,IAAYG,EAAE,EAAEH,CAAC,EAAEI,EAAE,EAAEJ,CAAC,CAAC,CAAC,SAASC,EAAE,EAAED,EAAE,CAAC,UAAU,WAAW,EAAE,KAAK,UAAUA,CAAC,CAAC,CAAC,CAAC,SAASI,EAAE,EAAEJ,EAAE,CAAC,IAAI,MAAK,EAAG,IAAI,GAAG,CAAC,IAAI,IAAI,gBAAgBA,CAAC,CAAC,EAAE,CAAC,SAASG,EAAE,EAAEH,EAAE,CAAC,IAAIK,EAAE,IAAI,eAAeA,EAAE,KAAK,MAAM,GAAG,CAAC,IAAI,IAAI,gBAAgBL,CAAC,CAAC,EAAE,EAAEK,EAAE,KAAM,CAAA,CAAC,SAASH,EAAE,EAAEF,EAAE,CAAC,MAAM,GAAG,CAAC,IAAI,IAAI,gBAAgBA,CAAC,CAAC,EAAE,CAAC,CAAC,SAASM,EAAE,CAAC,KAAK,EAAE,IAAIN,CAAC,EAAE,CAAC,OAAO,iBAAiB,QAAQK,GAAG,CAACN,EAAEC,EAAE,CAAC,KAAK,EAAE,MAAMK,EAAE,MAAM,KAAK,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,SAASE,EAAE,CAAC,KAAK,EAAE,IAAIP,CAAC,EAAE,CAAC,OAAO,iBAAiB,qBAAqBK,GAAG,CAAC,QAAQ,IAAI,qBAAqBA,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,SAASG,EAAE,EAAE,CAACF,EAAE,CAAC,EAAEC,EAAE,CAAC,CAAC,CCMpoBE,EAAS,CACP,IAAK,oCACP,CAAC,EAED,SAAS,cAA8B,MAAM,EAAG,UAAY;AAAA;AAAA;AAAA,kBAG1Cb,CAAQ;AAAA;AAAA;AAAA,kBAGRD,CAAc;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA,EAYhCE,EAAa,SAAS,cAAiC,UAAU,CAAE"}',
      type: 'asset',
    },
  };

  const sourceMaps = convertSourceMaps(assets);

  expect(sourceMaps).toEqual([
    [
      'index-2adaf709.js.map',
      '{"version":3,"file":"index-2adaf709.js","sources":["../../src/typescript.svg","../../../../../../../../vite.svg","../../src/trigger.ts","../../../../packages/sdk/dist/index.js","../../src/main.ts"],"names":["typescriptLogo","viteLogo","setupCounter","element","r","n","s","d","a","c","t","o","i","g","register"],"mappings":"ssBAAA,MAAeA,EAAA,kCCAAC,EAAA,YCAR,SAASC,EAAaC,EAA4B,CACvDA,EAAQ,UAAY,uBACZA,EAAA,iBAAiB,QAAS,IAAM,CAChC,MAAA,IAAI,MAAM,cAAc,CAAA,CAC/B,CACH,CCLA,SAASC,EAAE,EAAEC,EAAE,CAAC,UAAU,WAAWC,EAAE,EAAED,CAAC,EAAE,OAAO,MAAO,IAAYE,EAAE,EAAEF,CAAC,EAAE,OAAO,eAAgB,IAAYG,EAAE,EAAEH,CAAC,EAAEI,EAAE,EAAEJ,CAAC,CAAC,CAAC,SAASC,EAAE,EAAED,EAAE,CAAC,UAAU,WAAW,EAAE,KAAK,UAAUA,CAAC,CAAC,CAAC,CAAC,SAASI,EAAE,EAAEJ,EAAE,CAAC,IAAI,MAAK,EAAG,IAAI,GAAG,CAAC,IAAI,IAAI,gBAAgBA,CAAC,CAAC,EAAE,CAAC,SAASG,EAAE,EAAEH,EAAE,CAAC,IAAIK,EAAE,IAAI,eAAeA,EAAE,KAAK,MAAM,GAAG,CAAC,IAAI,IAAI,gBAAgBL,CAAC,CAAC,EAAE,EAAEK,EAAE,KAAM,CAAA,CAAC,SAASH,EAAE,EAAEF,EAAE,CAAC,MAAM,GAAG,CAAC,IAAI,IAAI,gBAAgBA,CAAC,CAAC,EAAE,CAAC,CAAC,SAASM,EAAE,CAAC,KAAK,EAAE,IAAIN,CAAC,EAAE,CAAC,OAAO,iBAAiB,QAAQK,GAAG,CAACN,EAAEC,EAAE,CAAC,KAAK,EAAE,MAAMK,EAAE,MAAM,KAAK,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,SAASE,EAAE,CAAC,KAAK,EAAE,IAAIP,CAAC,EAAE,CAAC,OAAO,iBAAiB,qBAAqBK,GAAG,CAAC,QAAQ,IAAI,qBAAqBA,CAAC,CAAC,EAAE,EAAE,CAAC,CAAC,SAASG,EAAE,EAAE,CAACF,EAAE,CAAC,EAAEC,EAAE,CAAC,CAAC,CCMpoBE,EAAS,CACP,IAAK,oCACP,CAAC,EAED,SAAS,cAA8B,MAAM,EAAG,UAAY;AAAA;AAAA;AAAA,kBAG1Cb,CAAQ;AAAA;AAAA;AAAA,kBAGRD,CAAc;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA;AAAA,EAYhCE,EAAa,SAAS,cAAiC,UAAU,CAAE"}',
    ],
  ]);

  expect(assets).toEqual({
    'assets/index-2adaf709.js': {
      exports: [],
      isDynamicEntry: false,
      isEntry: true,
      isImplicitEntry: false,
      name: 'index',
      type: 'chunk',
      dynamicImports: [],
      fileName: 'assets/index-2adaf709.js',
      implicitlyLoadedBefore: [],
      importedBindings: {},
      imports: [],
      code:
        '(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll(\'link[rel="modulepreload"]\'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=n(r);fetch(r.href,o)}})();const c="/assets/typescript-f6ead1af.svg",a="/vite.svg";function l(e){e.innerHTML="trigger custom error",e.addEventListener("click",()=>{throw new Error("custom error")})}function d(e,t){navigator.sendBeacon?u(e,t):typeof fetch<"u"?g(e,t):typeof XMLHttpRequest<"u"?p(e,t):f(e,t)}function u(e,t){navigator.sendBeacon(e,JSON.stringify(t))}function f(e,t){new Image().src=`${e}?${new URLSearchParams(t)}`}function p(e,t){let n=new XMLHttpRequest;n.open("GET",`${e}?${new URLSearchParams(t)}`),n.send()}function g(e,t){fetch(`${e}?${new URLSearchParams(t)}`)}function h({meta:e,url:t}){window.addEventListener("error",n=>{d(t,{meta:e,stack:n.error.stack})},!0)}function m({meta:e,url:t}){window.addEventListener("unhandledrejection",n=>{console.log("unhandledrejection",n)},!0)}function y(e){h(e),m(e)}y({url:"http://localhost:8000/report/error"});document.querySelector("#app").innerHTML=`\n' +
        '  <div>\n' +
        '    <a href="https://vitejs.dev" target="_blank">\n' +
        '      <img src="${a}" class="logo" alt="Vite logo" />\n' +
        '    </a>\n' +
        '    <a href="https://www.typescriptlang.org/" target="_blank">\n' +
        '      <img src="${c}" class="logo vanilla" alt="TypeScript logo" />\n' +
        '    </a>\n' +
        '    <h1>Vite + TypeScript</h1>\n' +
        '    <div class="card">\n' +
        '      <button id="trigger" type="button"></button>\n' +
        '    </div>\n' +
        '    <p class="read-the-docs">\n' +
        '      Click on the Vite and TypeScript logos to learn more\n' +
        '    </p>\n' +
        '  </div>\n' +
        '`;l(document.querySelector("#trigger"));\n' +
        '//# sourceMappingURL=index-2adaf709.js.map\n',
      preliminaryFileName: 'assets/index-!~{001}~.js',
      sourcemapFileName: 'assets/index-2adaf709.js.map',
    },
  });
});
