from collections import OrderedDict
import csv
import json
from os.path import dirname, join, realpath
from os import makedirs
import shutil


def performance_group(score):
    if score >= 80:
        return 'Very good'
    elif score >= 60:
        return 'Good'
    elif score >= 40:
        return 'Fair'
    elif score >= 20:
        return 'Poor'
    return 'Very poor'


def slugify(name):
    return name.replace(' ', '-').replace(',', '').replace('.', '').lower()


rootpath = join(dirname(realpath(__file__)), '..')

with open(join(rootpath, '_data', 'demo', 'source-results.csv')) as f:
    r = csv.DictReader(f)
    results = [x for x in r]

orgs = {slugify(x['organisation_name']): {
    'score': 0.,
    'by_component': OrderedDict(),
} for x in results}

page_info = [{
    'name': x['organisation_name'],
    'slug': slugify(x['organisation_name']),
} for x in results]

for x in results:
    org = slugify(x['organisation_name'])
    sc = float(x['indicator_total_weighted_points'])
    orgs[org]['score'] += sc
    orgs[org]['performance_group'] = performance_group(orgs[org]['score'])
    cat = x['indicator_subcategory_name']
    if cat not in orgs[org]['by_component']:
        orgs[org]['by_component'][cat] = 0.
    orgs[org]['by_component'][cat] += sc

orgs = OrderedDict(
    sorted(orgs.items(), key=lambda x: x[1]['score'], reverse=True))

for idx, org in enumerate(orgs.values()):
    org['rank'] = idx + 1

with open(join(rootpath, '_data', 'demo', 'results.json'), 'w') as f:
    json.dump(orgs, f, indent=4)

with open(join(rootpath, 'gen', 'demo', 'agency-template.md')) as f:
    agency_tmpl = f.read()

with open(join(rootpath, 'gen', 'demo', 'curve-template.md')) as f:
    curve_tmpl = f.read()

output_path = join(rootpath, 'demo')
agencies_path = join(output_path, 'agencies')
shutil.rmtree(agencies_path, ignore_errors=True)
makedirs(agencies_path)

curves_path = join(output_path, 'curves')
shutil.rmtree(curves_path, ignore_errors=True)
makedirs(curves_path)

for page in page_info:
    slug = page['slug']
    txt = agency_tmpl.format(**page)
    with open(join(agencies_path, slug + '.md'), 'w') as f:
        f.write(txt)
    org = orgs[slug]
    curve_args = page.copy()
    curve_args.update(org)
    txt = curve_tmpl.format(**curve_args)
    with open(join(curves_path, slug + '.md'), 'w') as f:
        f.write(txt)
