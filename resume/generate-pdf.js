const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDF(inputHtmlPath, outputPdfPath) {
  if (!inputHtmlPath || !outputPdfPath) {
    console.error('Usage: node generate-pdf.js <input-html-path> <output-pdf-path>');
    process.exit(1);
  }

  // Resolve paths relative to current working directory
  const resolvedHtmlPath = path.resolve(process.cwd(), inputHtmlPath);
  const resolvedPdfPath = path.resolve(process.cwd(), outputPdfPath);

  console.log(`Generating PDF from ${resolvedHtmlPath}`);
  console.log(`Output will be saved to ${resolvedPdfPath}`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Load the HTML file
    await page.goto(`file://${resolvedHtmlPath}`);

    // Inject CSS to handle no-break class and adjust line heights
    await page.addStyleTag({
      content: `
        .no-break {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .text-preset-2,
        .text-preset-2-bold,
        .text-preset-3,
        .text-preset-3-bold,
        .markdown > p,
        .markdown > strong,
        .markdown li,
        .markdown li p {
          line-height: 1.15 !important;
        }

        /* Tighter line height for lists specifically */
        ul .text-preset-2,
        ul .text-preset-2-bold,
        ul .text-preset-3,
        ul .text-preset-3-bold,
        .markdown ul,
        .markdown ul li {
          line-height: 1 !important;
        }
      `
    });

    // Wait for network to be idle (fonts loaded) and a brief delay
    await page.waitForNetworkIdle();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate PDF
    await page.pdf({
      path: resolvedPdfPath,
      format: 'Letter',
      printBackground: true,
      scale: 0.9,
      margin: {
        top: '0.5in',
        right: '0.25in',
        bottom: '0.5in',
        left: '0.25in'
      }
    });

    console.log('PDF generated successfully!');
  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Get command line arguments
const [inputHtmlPath, outputPdfPath] = process.argv.slice(2);
generatePDF(inputHtmlPath, outputPdfPath).catch(console.error);
