import { defineConfig } from 'astro/config';

import partytown from '@astrojs/partytown';

export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  integrations: [partytown()],
  output: 'static',
});
