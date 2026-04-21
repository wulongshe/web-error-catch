import { register } from '@dt-wec/sdk';
import { setupCounter } from './trigger';

register({
  project: 'tourmind_cn/admintools',
  url: 'http://127.0.0.1:8000/report',
});

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div class="card">
      <button id="trigger" type="button"></button>
    </div>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#trigger')!);
