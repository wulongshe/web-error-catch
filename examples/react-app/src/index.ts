import { register } from '@wec/sdk';
import { setupCounter } from './trigger';

register({
  url: 'http://localhost:6000/report/error',
});

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div class="card">
      <button id="trigger" type="button"></button>
    </div>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#trigger')!);
