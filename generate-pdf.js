const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    console.log('🚀 Iniciando generación de PDF...');
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Obtener la ruta absoluta del archivo HTML
    const htmlPath = path.join(__dirname, 'index.html');
    const fileUrl = `file://${htmlPath}`;
    
    console.log('📄 Cargando HTML desde:', fileUrl);
    
    await page.goto(fileUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Esperar a que se carguen las fuentes y estilos
    await page.evaluateHandle(() => document.fonts.ready);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('📊 Generando PDF...');
    
    // Generar PDF con opciones optimizadas
    const pdfPath = path.join(__dirname, 'connect-trucks-proposal.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      preferCSSPageSize: false,
      displayHeaderFooter: false
    });
    
    await browser.close();
    
    console.log('✅ PDF generado exitosamente!');
    console.log('📁 Ubicación:', pdfPath);
    
  } catch (error) {
    console.error('❌ Error al generar PDF:', error);
    process.exit(1);
  }
})();
