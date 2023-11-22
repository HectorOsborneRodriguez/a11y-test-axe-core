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
    .option('-p, --path <value>', 'Path to a .md /.txt file with a list of URLs file to be analized')
    .option('-c, --comp, --component  <value>', 'Component CSS selector to be analized. Example: ".nl-filters", "header", "footer"')
    .option('-o, --output <value>', 'Output file name')
    .name('a11y-test')
    .description('a11y-test is an accessibility Node.Js command for automated accessibility testing of websites and other HTML-based user interfaces.')
    .version('0.0.1');

program.parse(process.argv);
const options = program.opts();

const path = options.path ? options.path : null;
console.log(`URLs listed in ${path} will be analized `);

if (path) {
    fs.readFile(path, 'utf8', function (err, data) {
        if (err) throw err;
        const urls = data.split('\n');
        urls.forEach((url, index) => {
            let newURL = url.replace(/^https?:\/\//, '');
            let output = newURL.split(':').length > 1 ? `${newURL.split(':')[1]}.json` : `output.${index}.json`;
            a11yTest(url, `dist/${output}`)
        });
    });


} else {
    const url = options.url ? options.url : 'http://www.canadiantire.ca';
    console.log(`Inspecting ${url}`);

    let comp = options.comp ? options.comp : 'body';
    console.log(`HTML/Component selector: "${comp}"`);

    const output = options.output ? options.output : 'dist/results.json';
    console.log(`Writing results in: ${output}`);
}


const a11yTest = (url, output) => {
    // SPECIFIC TEST FROM HERE
    console.log(`Inspecting ${url}`);
    const screenshot = `${output}.png`
    try {
        (async () => {
            const browser = await puppeteer.launch({ headless: 'new' })
            const page = await browser.newPage()
            await page.setViewport({ width: 1280, height: 800 })
            await page.goto(url);
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
}
