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

with open(join(rootpath, '_data', '2018', 'source-results.csv')) as f:
    r = csv.DictReader(f)
    results = [x for x in r]

results = sorted(results, key=lambda x: (x['id'], x['indicator_order']))

orgs = {slugify(x['organisation_name']): {
    'score': 0.,
    'name': x['organisation_name'],
    'components': OrderedDict(),
} for x in results}

page_info = [{
    'name': x['organisation_name'],
    'slug': slugify(x['organisation_name']),
} for x in results]

for x in results:
    org = slugify(x['organisation_name'])
    sc = float(x['total_points'])
    weight = float(x['indicator_weight'])
    weighted_sc = float(x['indicator_total_weighted_points'])
    fmt = x['publication_format']
    status = x['survey_publication_status']
    cat = x['indicator_subcategory_name']
    ind = x['indicator_name']

    if x['survey_ordinal_value'] == '0.0':
        # if there's an ordinal value of 0.0, there shouldn't be a format
        fmt = 'not-applicable'
    if status == 'not published':
        # if status is not published, there shouldn't be a format
        fmt = 'not-applicable'

    orgs[org]['score'] += weighted_sc
    orgs[org]['performance_group'] = performance_group(orgs[org]['score'])

    if cat not in orgs[org]['components']:
        orgs[org]['components'][cat] = {
            'score': 0.,
            'weight': 0.,
            'indicators': OrderedDict()
        }
    orgs[org]['components'][cat]['score'] += sc
    orgs[org]['components'][cat]['weight'] += weight

    if ind.startswith('Project procurement'):
        ind = 'Project procurement'

    if ind not in orgs[org]['components'][cat]['indicators']:
        orgs[org]['components'][cat]['indicators'][ind] = {
            'score': 0.,
            'weight': 0.,
        }
    orgs[org]['components'][cat]['indicators'][ind]['score'] += sc
    orgs[org]['components'][cat]['indicators'][ind]['weight'] += weight

    # NB this is incorrect for project procurement!
    # it will always show the format and status for contracts
    orgs[org]['components'][cat]['indicators'][ind]['format'] = fmt
    orgs[org]['components'][cat]['indicators'][ind]['status'] = status

orgs = OrderedDict(
    sorted(orgs.items(), key=lambda x: x[1]['score'], reverse=True))

for idx, org in enumerate(orgs.values()):
    org['rank'] = idx + 1

with open(join(rootpath, '_data', '2018', 'results.json'), 'w') as f:
    json.dump(orgs, f, indent=4)

with open(join(rootpath, 'gen', '2018', 'agency-template.md')) as f:
    agency_tmpl = f.read()

output_path = join(rootpath, '2018')
agencies_path = join(output_path, 'agencies')
shutil.rmtree(agencies_path, ignore_errors=True)
makedirs(agencies_path)

for page in page_info:
    slug = page['slug']
    txt = agency_tmpl.format(**page)
    with open(join(agencies_path, slug + '.md'), 'w') as f:
        f.write(txt)
