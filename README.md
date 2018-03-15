### site-crawler

Crawls a site for 404 errors.
This script will also limit the crawl to a subsection of a site.
ie: vg.no/nyheter > would make the crawler only search pages with a url that starts with vg.no/nyheter

## Run
- npm install
- edit src/index.js and change siteUrl to match yours
- node src/index.js http://your.url.here/subdir

## Node
Requires modern NodeJS to run as it has no transpiling step.