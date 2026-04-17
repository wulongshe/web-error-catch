import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  declaration: true,
  failOnWarn: false,
  entries: [
    'src/module',
    'src/module.nuxt2',
    {
      builder: 'mkdist',
      input: './src/runtime/',
      outDir: './dist/runtime',
    },
  ],
  rollup: {
    emitCJS: true,
    cjsBridge: true,
  },
  externals: [
    '@nuxt/kit',
    '@nuxt/schema',
    'nuxt',
    'nitropack',
    'vue',
    '@dt-wec/sdk',
    '@dt-wec/plugin-vite',
    '@dt-wec/plugin-webpack',
    '#app',
    '#imports',
  ],
});
