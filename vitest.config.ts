import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true, 
    env: {
      DATABASE_URL: 'file:./test.db',
    }
  },
});
