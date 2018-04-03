# Aid Transparency Index

Static site build for the Aid Transparency Index.

### Content that can be modified:

 * [2018 ATI site content](2018)

### Development stuff (don’t mess with this!):

 * [Site layouts (templates)](_layouts)
 * [Site includes (partials)](_includes)
 * [Raw data (exported from the tracker)](_data)
 * [Preprocessing scripts](gen)

## Requirements

 * Jekyll

## Setup

1. Update `_data/2018/source-results.csv` with actual results (exported from the aid transparency tracker)

2. Run the following:

   ```shell
   # generate templates and `results.json`
   $ python gen/2018-gen.py

   # Generate static site / start webserver
   $ jekyll s
   ```
