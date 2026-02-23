const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const express = require('express');

const PORT = 4567;
const APP_ROOT = path.join(__dirname, '..', 'build');
const ROUTES = [
    '/',
    '/en',
    '/legal',
    '/privacidad',
    '/accesibilidad',
    '/en/legal',
    '/en/privacy',
    '/en/accessibility'
];

async function prerender() {
    // Verificar si la carpeta build existe
    if (!fs.existsSync(APP_ROOT)) {
        console.error(`❌ Error: La carpeta build no existe en ${APP_ROOT}. Ejecuta 'npm run build' primero.`);
        process.exit(1);
    }

    const app = express();
    app.use(express.static(APP_ROOT));

    // Servir el index.html para todas las rutas durante el proceso de prerender
    // En Express 5, el wildcard '*' debe escribirse como '(.*)'
    app.get('(.*)', (req, res) => {
        res.sendFile(path.join(APP_ROOT, 'index.html'));
    });

    const server = app.listen(PORT, async () => {
        console.log(`🚀 Servidor temporal iniciado en puerto ${PORT}`);

        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        for (const route of ROUTES) {
            const url = `http://localhost:${PORT}${route}`;
            console.log(`🔍 Prerenderizando: ${route}...`);

            try {
                await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

                // Esperar a que React renderice el contenido (basado en tu main tag id="main-content")
                await page.waitForSelector('#main-content', { timeout: 10000 });

                // Dar un pequeño margen para animaciones si las hubiera
                await new Promise(r => setTimeout(r, 500));

                const html = await page.content();

                // Creamos la carpeta para la ruta (e.g., build/en/index.html)
                const outputDir = path.join(APP_ROOT, route === '/' ? '' : route);
                await fs.ensureDir(outputDir);

                await fs.writeFile(path.join(outputDir, 'index.html'), html);
                console.log(`✅ Completado: ${route}`);
            } catch (err) {
                console.error(`❌ Error en ruta ${route}:`, err.message);
            }
        }

        await browser.close();
        server.close();
        console.log('\n✨ Prerender completado. Tu carpeta /build ahora contiene HTML estático para SEO.');
        process.exit(0);
    });
}

prerender().catch(err => {
    console.error('❌ Error crítico en el proceso de prerender:', err);
    process.exit(1);
});
