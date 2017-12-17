from collections import OrderedDict
import csv
import json
from os.path import join


def slugify(name):
    return name.replace(' ', '-').replace(',', '').replace('.', '').lower()


# this mapping is totally arbitrary, and just for
# demonstration purposes
mapping = {
    'organisation-planning': 'Organisational planning and commitments',
    'organisation-financial': 'Finance and budgets',
    'activity-basic': 'Project attributes',
    'activity-classifications': 'Joining-up development data',
    'activity-related-documents': 'Finance and budgets',
    'activity-financial': 'Finance and budgets',
    'activity-performance': 'Performance',
    'commitment-': 'Organisational planning and commitments',
}

with open(join('..', '_data', 'source-results.csv')) as f:
    r = csv.DictReader(f)
    results = [x for x in r]

orgs = {slugify(x['organisation_name']): {
    'name': x['organisation_name'].replace('U.S.,', 'US,'),
    'slug': slugify(x['organisation_name']),
    'score': 0.,
    'by_component': OrderedDict(),
} for x in results}

for x in results:
    org = slugify(x['organisation_name'])
    sc = float(x['indicator_total_weighted_points'])
    orgs[org]['score'] += sc
    cat = mapping.get(x['indicator_category_subcategory'].lower())
    if cat not in orgs[org]['by_component']:
        orgs[org]['by_component'][cat] = 0.
    orgs[org]['by_component'][cat] += sc

orgs = OrderedDict(
    sorted(orgs.items(), key=lambda x: x[1]['score'], reverse=True))

with open(join('..', '_data', 'results.json'), 'w') as f:
    json.dump(orgs, f)

with open('agency-template.md') as f:
    agency_tmpl = f.read()

with open('curve-template.md') as f:
    curve_tmpl = f.read()

for idx, org in enumerate(orgs.values()):
    txt = agency_tmpl.format(slug=org['slug'])
    with open(join('..', 'agencies', org['slug'] + '.md'), 'w') as f:
        f.write(txt)
    txt = curve_tmpl.format(slug=org['slug'], rank=(idx+1), score=org['score'])
    with open(join('..', 'curves', org['slug'] + '.svg'), 'w') as f:
        f.write(txt)
