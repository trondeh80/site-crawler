const { get } = require('./http');
const { getLinks, parseHtml } = require('./dom');
const SiteModel = require('./site-model');

const siteUrl = 'http://localhost'; // Change for your domain

const site = new SiteModel(siteUrl);

function start() {
  const page = site.links[site.url];
  iteration(page)
    .catch(err => console.log('iteration error', err));
}

async function iteration(Page) {
  try {
    const html = await get(Page.url);
    const links = getLinks(parseHtml(html));

    site.getPages(links).forEach(page => iteration(page)); // Iterate through these links

    Page.crawled = true;

    const incomplete = Object.keys(site.links).filter(key => site.links[key].crawled !== true);
    if (incomplete.length === 0) {
      site.printReport();
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