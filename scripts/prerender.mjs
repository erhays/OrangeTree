// scripts/prerender.mjs
// Runs after `vite build` via the `postbuild` npm script.
// Renders the home page to a string and injects it into dist/index.html
// so crawlers and social bots receive real HTML content.

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router/server';
import App from '../client/App.jsx';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath = join(__dirname, '..', 'dist', 'index.html');

const html = renderToString(
    React.createElement(StaticRouter, { location: '/' },
        React.createElement(App)
    )
);

let template = readFileSync(distPath, 'utf-8');
template = template.replace('<!--ssr-outlet-->', html);
writeFileSync(distPath, template);

console.log('✓ Prerender complete: dist/index.html');
