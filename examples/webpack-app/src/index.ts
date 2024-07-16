import { register } from '@dt-wec/sdk';
import { setupCounter } from './trigger';

register({
  url: 'http://localhost:8080/report',
});

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div class="card">
      <button id="trigger" type="button"></button>
    </div>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#trigger')!);
