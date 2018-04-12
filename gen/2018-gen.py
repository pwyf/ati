from io import StringIO
from collections import OrderedDict
import csv
import json
from os.path import dirname, join, realpath
from os import makedirs
import shutil

import requests


cats = [
    'Organisational planning and commitments',
    'Finance and budgets',
    'Project attributes',
    'Joining-up development data',
    'Performance',
]

def tidy_format(fmt):
    lookup = {
        'not-applicable': 'Not applicable',
        'iati': 'IATI',
        'machine-readable': 'Machine readable',
        'document': 'Document',
        'website': 'Website',
        'pdf': 'PDF',
    }
    return lookup.get(fmt, '')

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

with open(join(rootpath, '_data', '2018', 'source-results.csv')) as f:
    r = csv.DictReader(f)
    results = [x for x in r]

results = sorted(results, key=lambda x: (x['organisation_code'], x['indicator_order']))

orgs = {slugify(x['organisation_name']): {
    'score': 0.,
    'name': x['organisation_name'],
    'components': OrderedDict(),
} for x in results}

for x in results:
    org = slugify(x['organisation_name'])
    sc = float(x['total_points'])
    weight = float(x['indicator_weight'])
    weighted_sc = float(x['indicator_total_weighted_points'])
    fmt = x['publication_format']
    status = x['survey_publication_status'].title()
    cat = x['indicator_subcategory_name']
    ind = x['indicator_name']

    if x['survey_ordinal_value'] == '0.0':
        # if there's an ordinal value of 0.0, there shouldn't be a format
        fmt = ''
    if status == 'Not Published':
        # if status is not published, there shouldn't be a format
        fmt = ''
    if fmt == '':
        # if there's no format, status should be not published
        status = 'Not Published'

    fmt = tidy_format(fmt)

    orgs[org]['score'] += weighted_sc
    orgs[org]['performance_group'] = performance_group(orgs[org]['score'])

    if cat not in orgs[org]['components']:
        orgs[org]['components'][cat] = {
            'weighted_score': 0.,
            'total_weight': 0.,
            'indicators': OrderedDict()
        }
    orgs[org]['components'][cat]['weighted_score'] += weighted_sc
    orgs[org]['components'][cat]['total_weight'] += weight

    if ind not in orgs[org]['components'][cat]['indicators']:
        orgs[org]['components'][cat]['indicators'][ind] = {
            'score': sc,
            'weight': weight,
        }
    orgs[org]['components'][cat]['indicators'][ind]['format'] = fmt
    orgs[org]['components'][cat]['indicators'][ind]['status'] = status

for org in orgs.values():
    i = org['components']['Joining-up development data']['indicators']
    ppt = i['Project procurement - Tenders']
    ppc = i['Project procurement - Contracts']
    del org['components']['Joining-up development data']['indicators']['Project procurement - Tenders']
    del org['components']['Joining-up development data']['indicators']['Project procurement - Contracts']
    pp_weight = ppt['weight'] + ppc['weight']
    pp_sc = (ppt['score'] * ppt['weight'] + ppc['score'] * ppc['weight']) / pp_weight
    # NB this is incorrect!
    # it will always show the format and status for contracts
    pp = {
        'score': pp_sc,
        'weight': pp_weight,
        'format': ppc['format'],
        'status': ppc['status'],
    }
    org['components']['Joining-up development data']['indicators']['Project procurement'] = pp

orgs = OrderedDict(
    sorted(orgs.items(), key=lambda x: x[1]['score'], reverse=True))

for idx, org in enumerate(orgs.values()):
    org['rank'] = idx + 1

with open(join(rootpath, '_data', '2018', 'results.json'), 'w') as f:
    json.dump(orgs, f, indent=4)

spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1LJR7yznASN0VJ4qhnkWFSltDFobN8X4N0mQBiNDOThg/gviz/tq?tqx=out:csv&sheet={}'

req = requests.get(spreadsheet_url.format('Donor%20profiles'))
f = StringIO(req.text)
r = csv.reader(f)
next(r)
profile_data = [{
        'slug': slugify(x[0]),
        'short_name': x[0],
        'name': x[1],
        'overview': x[2] if x[2] else 'Overview goes here.',
        'analysis': x[3] if x[3] else 'Analysis goes here.',
        'recommendations': x[4] if x[4] else 'Recommendations go here.',
    } for x in r]

with open(join(rootpath, 'gen', '2018', 'agency-template.md')) as f:
    agency_tmpl = f.read()

agencies_path = join(rootpath, '2018', 'agencies')
shutil.rmtree(agencies_path, ignore_errors=True)
makedirs(agencies_path)

for profile in profile_data:
    txt = agency_tmpl.format(**profile)
    with open(join(agencies_path, profile['slug'] + '.md'), 'w') as f:
        _ = f.write(txt)
