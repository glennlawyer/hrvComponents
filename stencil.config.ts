import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'hrvcomponents',
  outputTargets: [
    {
      type: 'dist'
      esmLoaderPath: 'loader'
    },
    { type: 'docs-readme' },
    // { type: 'docs' },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  plugins: [
    sass(),
  ],
  testing: {
    testPathIgnorePatterns: ["template*"]
  },
  copy: [
    { src: 'pages' }
  ]
};
