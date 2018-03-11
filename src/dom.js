const cheerio = require('cheerio') ;

function parseHtml(htmlString){
  return cheerio.load(htmlString);
}

function getLinks(html) {
  const linkElements = parseHtml(html)('a');
  const links = [];
  if (linkElements.each) {
    linkElements.each((i, element) => {
      const link = element.attribs.href;
      if (link) {
        links.push(element.attribs.href)
      }
    });
  }
  return links;
}

module.exports = {
  parseHtml,
  getLinks
};