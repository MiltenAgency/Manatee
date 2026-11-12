import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

/** @type {import('next').NextConfig} */
const config = {
  experimental: { cpus: 2 },
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
};
export default config;
