# Aid Transparency Index

Static site build for the Aid Transparency Index.

### Content that can be modified:

 * [2018 ATI site content](pages)

### Development stuff (don’t mess with this!):

 * [Site layouts (templates)](_layouts)
 * [Site includes (partials)](_includes)
 * [Raw data (exported from the tracker)](_data)
 * [Preprocessing scripts](gen)

## Requirements

 * Python 2 or 3
 * Ruby

## Installation

1. Clone the repo:

   ```shell
   git clone https://github.com/pwyf/aid-transparency-index.git
   cd aid-transparency-index
   ```

2. Install ruby dependencies, including Jekyll:

   ```shell
   gem install bundler
   bundle
   ```

3. Update `_data/source-results.csv` with actual results (exported from the aid transparency tracker)

4. Run the following:

   ```shell
   $ # generate templates and `results.json`
   $ python gen/data-gen.py
   $
   $ # Build static site & start webserver
   $ bundle exec jekyll serve
   ```
