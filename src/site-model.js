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
      .filter((link) => (link && !this.links[this.getUrl(link)] && this.isInternal(link) && !this.isCrawled(link)))
      .map((link) => {
        const page = SiteModel.createPageModel({ url: this.getUrl(link) });
        this.links[page.url] = page; // Storing instance of page in the link list.
        return page;
      });
  }

  isCrawled(link) {
    return this.links[this.getUrl(link)] && this.links[this.getUrl(link)].crawled === true;
  }

  isInternal(url) {
    const hostname = this.getUrl(url);
    const reg = new RegExp(`(^\/)|(^http(s)?:\/\/(www\.)?${hostname})`);
    return url.match(reg);
  }

  getUrl(url) {
    if (url && url.match(/^\//)) {
      return `${this.site.link.protocol}//${this.site.link.hostname}${url}`;
    }
    return url;
  }

  printReport() {
    console.log('Statstics');

    if (this.errors[404]) {
      this.errors[404].forEach(page => {
        console.log(`404: ${page.url}`);
      });
    }

    console.log(`Crawled ${Object.keys(this.links).length} pages`);
    console.log(`404 errors: ${this.errors[404].length}`);
    console.log(`Other errors: ${this.errors[500].length}`);

    // if (this.errors[500].length) {
    //   this.errors[500].forEach(err => {
    //     debugger;
    //   });
    // }
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