# Aid Transparency Index

Static site build for the Aid Transparency Index.

### Content that can be modified:

 * [2016 ATI site content](2016)
 * [2016 ATI site collections (posts etc)](_2016)
 * [Demo (2018) ATI site content](demo)

### Development stuff (don’t mess with this!):

 * [Site layouts (templates)](_layouts)
 * [Site includes (partials)](_includes)
 * [Raw data (exported from the tracker)](_data)
 * [Preprocessing scripts](gen)

## Requirements

 * Jekyll
 * Python 3.5+? Something like that. A relatively new version, anyway.

## Setup

1. Update `_data/demo/source-results.csv` with actual results (exported from the aid transparency tracker)

2. Run the following:

   ```shell
   # generate templates and `results.json`
   $ python gen/demo-gen.py

   # Generate static site / start webserver
   $ jekyll s
   ```
