const { URL } = require('url');

class SiteModel {

  constructor(url) {
    this.url = this.getUrl(url);
    this.links = { [url]: SiteModel.createPageModel({ url }) };
    this.site = SiteModel.createSiteModel({ url });
    this.errors = {
      404: [],
      500: []
    };
  }

  getPages(links) {
    return links
      .filter(link => !!link && this.isInternal(link))
      .map(link => (new URL(this.getUrl(link)).href))
      .filter((url) => (
        !this.links[url] && !this.isCrawled(url)))
      .map((url) => {
        const page = SiteModel.createPageModel({ url });
        this.links[page.url] = page; // Storing instance of page in the link list.
        return page;
      });
  }

  isCrawled(link) {
    return this.links[link] && this.links[link].crawled === true;
  }

  isInternal(url) {
    const hostname = this.site.link.host.replace('www.', '');
    const path = this.site.link.pathname || '/';
    const reg = new RegExp(`(^${path}(.*))|(^http(s)?:\/\/(www\.)?${hostname}${path}\/(.*))`);
    return !!url.match(reg);
  }

  getUrl(url) {
    if (url && url.match(/^\//)) {
      return `${this.site.link.protocol}//${this.site.link.hostname}${url}`;
    }
    return url;
  }

  printReport() {
    console.log('Statstics');

    if (this.errors[404].length) {
      this.errors[404].forEach(page => {
        console.log(`404: ${page.url} - Discovered on: ${page.parentPage.url || 'unknown'}`);
      });
    }

    if (this.errors[500].length) {
      console.log('Error')
      this.errors[500].forEach(page => {
        console.log(`Other error: ${page.url} - Discovered on: ${page.parentPage.url || 'unknown'}`);
      });
    }

    console.log(`Crawled ${Object.keys(this.links).length} pages`);
    console.log(`404 errors: ${this.errors[404].length}`);
    console.log(`Other errors: ${this.errors[500].length}`);
  }


  static createSiteModel(options = {}) {
    return {
      link: new URL(options.url),
      ...options
    };
  }

  // page must include URL! { url: 'http://domain/path/etc' }
  static createPageModel(page) {
    return {
      error: false,
      crawled: false,
      ...page
    };
  }

}

module.exports = SiteModel;