const { get } = require('./http');
const { getLinks } = require('./dom');
const SiteModel = require('./site-model');

const arguments = process.argv;
if (!arguments[2])  {
  console.error('Exiting. No URL was given!\nUsage: node index.js http://www.yoursitename.com/subdir');
  process.exit(1);
}
const siteUrl = arguments[2];

const site = new SiteModel(siteUrl);

async function start() {
  const page = site.links[site.url];
  await iteration(page);
}

async function iteration(Page) {
  try {

    console.log('url', Page.url)
    const html = await get(Page.url);
    site.getPages(getLinks(html))
      .forEach(page => iteration(page)); // Iterate through these links

    Page.crawled = true;

    const incomplete = Object.keys(site.links)
      .filter(key => site.links[key].crawled !== true);

    if (incomplete.length === 0) {
      site.printReport();
      if (site.errors[404].length === 0 && site.errors[500].length === 0) {
        process.exit(0);
      }
    } else {
      console.log('Pages left: ', incomplete.length);
    }

  } catch (err) {
    Page.error = true;
    Page.response = err;
    Page.crawled = true;
    if (err && err.status && err.status === 404) {
      site.errors[404].push(Page);
    } else {
      site.errors[500].push(Page);
    }
  }
}

// Start the service
start();