from collections import OrderedDict
import csv
import json
from os.path import join


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

orgs = {x['organisation_name']: {
    'name': x['organisation_name'].replace('U.S.,', 'US,'),
    'score': 0.,
    'by_component': OrderedDict(),
} for x in results}

for x in results:
    org = x['organisation_name']
    sc = float(x['indicator_total_weighted_points'])
    orgs[org]['score'] += sc
    cat = mapping.get(x['indicator_category_subcategory'].lower())
    if cat not in orgs[org]['by_component']:
        orgs[org]['by_component'][cat] = 0.
    orgs[org]['by_component'][cat] += sc

orgs = sorted(orgs.values(), key=lambda x: x['score'], reverse=True)

with open(join('..', '_data', 'results.json'), 'w') as f:
    json.dump(orgs, f)
