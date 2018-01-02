# 2016 ATI site collections

This folder contains the homepage sliders and site posts for the 2016 ATI. To add new ones, simply follow the convention of existing sliders and posts. Filenames don’t matter, but frontmatter does.

---

### Development note:

Sliders and posts are a single collection, called '2016' (see `_config.yml`). It’s done this way so that all collections live inside the same folder (`_2016`). One unfortunate side effect is that a page is created for each slider, which isn’t desired behaviour. In jekyll 3.7.0, this problem is solved via [the `collections_dir` variable](https://jekyllrb.com/docs/collections/), but at time of writing, [github is using 3.6.2](https://pages.github.com/versions/).
