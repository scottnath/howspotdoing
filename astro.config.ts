import { defineConfig } from 'astro/config';

import partytown from '@astrojs/partytown';

export default defineConfig({
  integrations: [partytown()],
  output: 'static',
});
