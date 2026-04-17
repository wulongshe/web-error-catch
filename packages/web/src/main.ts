import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import App from './App.vue';
import router from './router/index.js';
import { i18n } from './i18n/index.js';
import './style.css';

// 按需注册 ECharts 模块
use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent]);

const app = createApp(App);

app.use(ElementPlus);
app.use(router);
app.use(i18n);
app.component('VChart', VChart);

app.mount('#app');
