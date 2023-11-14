import { Plugin } from 'vite';

export interface UploadSourceMapOptions {
  url: string;
}

export default function uploadSourceMapPlugin(options: UploadSourceMapOptions): Plugin {
  console.log(options);
  return {
    name: 'upload-sourcemap-plugin',
    generateBundle(_, bundle) {
      if (process.env.NODE_ENV !== 'production') return;
      const sourcemapPath = (bundle['index.js'] as any).map?.file;
      if (!sourcemapPath) return;
      console.log('Source map path:', sourcemapPath);
    },
  };
}
