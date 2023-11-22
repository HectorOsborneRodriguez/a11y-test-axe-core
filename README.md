# a11y-test-axe-core

a11y-test-axe-core is an accessibility Node.Js command for automated accessibility testing of websites and other HTML-based user interfaces.

## Getting started
First download the package
`git clone https://github.com/HectorOsborneRodriguez/a11y-test-axe-core`

Now install all the packages 
`npm install`

Run your  tests `npm run test`


## Output
Running test scripts will  generate 1 x screenshot images and 1x `.json` file for eacth test inside the `dist` folder



## Using Jest  
`npm run jest`


## Using Commander (command line with prompts) [Work in Progress]
Alternatevily you can also run the command line with options
`node index.js`

## To get help on the command use
`node index.js --help`

## Example of a command line
`node  index.js -u http://www.canadiantire.ca  -o dist/result.json`

### Example usage with components
`node index.js -u "http://www.accenture.ca" -c "footer" -o accenture.json`

### Usage
Options:  
`  -u, --url <value>`                 Page URL to be scanned  
`  -c, --comp, --component  <value>`  Component CSS selector to be analized. Example: ".nl-filters", "header", "footer"  
`  -o, --output <value>`              Output file name  
`  -V, --version`                     output the version number  
`  -h, --help`                        display help for command  



## Documentation
- [Jest Timeout Error](https://bobbyhadz.com/blog/jest-exceeded-timeout-of-5000-ms-for-test)
- [Jest for React](https://aaron-kt-berry.medium.com/a11y-testing-with-axe-core-eb074744e073)