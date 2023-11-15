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
      Object.entries(bundle).forEach(([fileName, chunk]) => {
        const sourcemapPath = (chunk as any)?.map?.file;
        if (!sourcemapPath) return;
        console.log(fileName, '=>', sourcemapPath);
      });
    },
  };
}
