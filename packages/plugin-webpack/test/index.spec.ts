import { test, expect } from 'vitest';
import { convertSourceMaps } from '../src/utils';

test('convertSourceMaps', async () => {
  const assets = {
    'main.b5517e4f0908ffb38333.js': {
      _children: [
        {
          _valueIsBuffer: false,
          _value:
            '(()=>{"use strict";var r;document.querySelector("#app").innerHTML=\'\\n  <div>\\n    <div class="card">\\n      <button id="counter" type="button"></button>\\n    </div>\\n  </div>\\n\',(r=document.querySelector("#counter")).innerHTML="trigger error",r.addEventListener("click",(function(){throw new Error("trigger error")}))})();',
          _valueAsString:
            '(()=>{"use strict";var r;document.querySelector("#app").innerHTML=\'\\n  <div>\\n    <div class="card">\\n      <button id="counter" type="button"></button>\\n    </div>\\n  </div>\\n\',(r=document.querySelector("#counter")).innerHTML="trigger error",r.addEventListener("click",(function(){throw new Error("trigger error")}))})();',
        },
        {
          _valueIsBuffer: false,
          _value: '\n//# sourceMappingURL=main.b5517e4f0908ffb38333.js.map',
          _valueAsString: '\n//# sourceMappingURL=main.b5517e4f0908ffb38333.js.map',
        },
      ],
      _isOptimized: true,
    },
    'main.b5517e4f0908ffb38333.js.map': {
      _valueIsBuffer: false,
      _value:
        '{"version":3,"file":"main.b5517e4f0908ffb38333.js","mappings":"mBAAO,IAAsBA,ECC7BC,SAASC,cAAc,QAAQC,UAAY,iHDDdH,ECEhBC,SAASC,cAAc,aDDxBC,UAAY,gBACpBH,EAAQI,iBAAiB,SAAS,WAC9B,MAAM,IAAIC,MAAM,gBACpB,G","sources":["webpack://react-app/./src/counter.ts","webpack://react-app/./src/index.ts"],"sourcesContent":["export function setupCounter(element) {\\n    element.innerHTML = \\"trigger error\\";\\n    element.addEventListener(\'click\', function () {\\n        throw new Error(\'trigger error\');\\n    });\\n}\\n","import { setupCounter } from \'./counter\';\\ndocument.querySelector(\'#app\').innerHTML = \\"\\\\n  <div>\\\\n    <div class=\\\\\\"card\\\\\\">\\\\n      <button id=\\\\\\"counter\\\\\\" type=\\\\\\"button\\\\\\"></button>\\\\n    </div>\\\\n  </div>\\\\n\\";\\nsetupCounter(document.querySelector(\'#counter\'));\\n"],"names":["element","document","querySelector","innerHTML","addEventListener","Error"],"sourceRoot":""}',
      _valueAsString:
        '{"version":3,"file":"main.b5517e4f0908ffb38333.js","mappings":"mBAAO,IAAsBA,ECC7BC,SAASC,cAAc,QAAQC,UAAY,iHDDdH,ECEhBC,SAASC,cAAc,aDDxBC,UAAY,gBACpBH,EAAQI,iBAAiB,SAAS,WAC9B,MAAM,IAAIC,MAAM,gBACpB,G","sources":["webpack://react-app/./src/counter.ts","webpack://react-app/./src/index.ts"],"sourcesContent":["export function setupCounter(element) {\\n    element.innerHTML = \\"trigger error\\";\\n    element.addEventListener(\'click\', function () {\\n        throw new Error(\'trigger error\');\\n    });\\n}\\n","import { setupCounter } from \'./counter\';\\ndocument.querySelector(\'#app\').innerHTML = \\"\\\\n  <div>\\\\n    <div class=\\\\\\"card\\\\\\">\\\\n      <button id=\\\\\\"counter\\\\\\" type=\\\\\\"button\\\\\\"></button>\\\\n    </div>\\\\n  </div>\\\\n\\";\\nsetupCounter(document.querySelector(\'#counter\'));\\n"],"names":["element","document","querySelector","innerHTML","addEventListener","Error"],"sourceRoot":""}',
    },
    'index.html': {
      _valueIsBuffer: false,
      _value:
        '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>react app</title><script defer="defer" src="main.b5517e4f0908ffb38333.js"></script></head><body><div id="app"></div></body></html>',
      _valueAsString:
        '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>react app</title><script defer="defer" src="main.b5517e4f0908ffb38333.js"></script></head><body><div id="app"></div></body></html>',
    },
  } as any;

  const sourceMaps = convertSourceMaps(assets);

  expect(sourceMaps).toEqual({
    'main.b5517e4f0908ffb38333.js.map': `{"version":3,"file":"main.b5517e4f0908ffb38333.js","mappings":"mBAAO,IAAsBA,ECC7BC,SAASC,cAAc,QAAQC,UAAY,iHDDdH,ECEhBC,SAASC,cAAc,aDDxBC,UAAY,gBACpBH,EAAQI,iBAAiB,SAAS,WAC9B,MAAM,IAAIC,MAAM,gBACpB,G","sources":["webpack://react-app/./src/counter.ts","webpack://react-app/./src/index.ts"],"names":["element","document","querySelector","innerHTML","addEventListener","Error"],"sourceRoot":""}`,
  });

  expect(assets).toEqual({
    'main.b5517e4f0908ffb38333.js': {
      _children: [
        {
          _valueIsBuffer: false,
          _value:
            '(()=>{"use strict";var r;document.querySelector("#app").innerHTML=\'\\n  <div>\\n    <div class="card">\\n      <button id="counter" type="button"></button>\\n    </div>\\n  </div>\\n\',(r=document.querySelector("#counter")).innerHTML="trigger error",r.addEventListener("click",(function(){throw new Error("trigger error")}))})();',
          _valueAsString:
            '(()=>{"use strict";var r;document.querySelector("#app").innerHTML=\'\\n  <div>\\n    <div class="card">\\n      <button id="counter" type="button"></button>\\n    </div>\\n  </div>\\n\',(r=document.querySelector("#counter")).innerHTML="trigger error",r.addEventListener("click",(function(){throw new Error("trigger error")}))})();',
        },
        {
          _valueIsBuffer: false,
          _value: '\n//# sourceMappingURL=main.b5517e4f0908ffb38333.js.map',
          _valueAsString: '\n//# sourceMappingURL=main.b5517e4f0908ffb38333.js.map',
        },
      ],
      _isOptimized: true,
    },
    'index.html': {
      _valueIsBuffer: false,
      _value:
        '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>react app</title><script defer="defer" src="main.b5517e4f0908ffb38333.js"></script></head><body><div id="app"></div></body></html>',
      _valueAsString:
        '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>react app</title><script defer="defer" src="main.b5517e4f0908ffb38333.js"></script></head><body><div id="app"></div></body></html>',
    },
  });
});
