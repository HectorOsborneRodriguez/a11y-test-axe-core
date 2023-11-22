const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');
const fs = require('fs');
// const argv = require('minimist')(process.argv.slice(2));

// CREATE OUTPUT DIR IF NOT EXISTS:
const outputDir = './dist';

// Check if the directory exists
if (!fs.existsSync(outputDir)) {
// synchronously create a directory
  fs.mkdirSync(outputDir)
}

const { program } = require('commander');
program
    .option('-u, --url <value>', 'Page URL to be scanned')
    .option('-c, --comp, --component  <value>', 'Component CSS selector to be analized. Example: ".nl-filters", "header", "footer"')
    .option('-o, --output <value>', 'Output file name')
    .name('a11y-test')
    .description('a11y-test is an accessibility Node.Js command for automated accessibility testing of websites and other HTML-based user interfaces.')
    .version('0.0.1');

program.parse(process.argv);
const options = program.opts();


const url = options.url ? options.url : 'http://www.canadiantire.ca';
console.log(`Inspecting ${url}`);

let comp = options.comp ? options.comp : 'body'; 
console.log(`HTML/Component selector: "${comp}"`);

const output = options.output ? options.output : 'dist/results.json';
console.log(`Writing results in: ${output}`);


// SPECIFIC TEST FROM HERE
// Testing Store Locator Button
// Selector: .nl-primary-navigation .nl-store-locator--section-button'
const screenshot = `dist/a11y-${comp}.png`
try {
    (async () => {
        const browser = await puppeteer.launch({ headless: 'new' })
        const page = await browser.newPage()
        await page.setViewport({ width: 1280, height: 800 })
        await page.goto(url);
        await page.waitForSelector('.nl-primary-navigation-bar .nl-store-locator--section-button')
        await page.screenshot({ path: screenshot })

        // Execute Axe
        const results = await new AxePuppeteer(page)
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze()

        // Write Report in a File
        fs.writeFile(output, JSON.stringify(results, null, 2), (error) => {
            if (error) {
                console.log('An error has ocurred', error);
                return;
            }
        })

        console.log(`Found ${results.violations.length} violations`)
        await page.close();
        await browser.close();

        console.log('See screenshot: ' + screenshot)
    })()
} catch (err) {
    console.error(err)
}