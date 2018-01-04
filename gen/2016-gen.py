from collections import OrderedDict
import csv
import json
from os.path import dirname, join, realpath
from os import makedirs
import shutil


shortnames = {
    'UNDP': 'undp', 'U.S., MCC': 'usmcc', 'UNICEF': 'unicef', 'UK, DFID': 'ukdfid', 'Global Fund': 'global-fund', 'World Bank, IDA': 'world-bank-ida', 'IADB': 'iadb', 'AsDB': 'asdb', 'Sweden, MFA-Sida': 'sweden', 'AfDB': 'afdb', 'GAVI': 'gavi', 'Canada, DFATD': 'canada', 'EC, NEAR': 'ecnear', 'EC, ECHO': 'ececho', 'EC, DEVCO': 'ecdevco', 'Netherlands, MFA': 'netherlands', 'Denmark, MFA': 'denmark', 'Germany, BMZ-GIZ': 'germanygiz', 'U.S., USAID': 'ususaid', 'Germany, BMZ-KFW': 'germanykfw', 'U.S., Treasury': 'ustreasury', 'U.S., PEPFAR': 'uspepfar', 'U.S., State': 'usstate', 'EIB': 'eib', 'Australia, DFAT': 'australia', 'EBRD': 'ebrd', 'Belgium, DGCD': 'belgium', 'U.S., Defense': 'usdod', 'Spain, MAEC-AECID': 'spain', 'Gates Foundation': 'gates', 'Switzerland, SDC': 'switzerland', 'France, AFD': 'franceafd', 'Japan, JICA': 'japanjica', 'Norway, MFA': 'norway', 'Finland, MFA': 'finland', 'France, MAEDI': 'ministry-of-foreign-affairs', 'UN OCHA': 'unocha', 'Ireland, IrishAid': 'ireland', 'IMF': 'imf', 'World Bank, IFC': 'world-bankifc', 'Korea, KOICA': 'korea', 'Italy, MAE': 'italy', 'Japan, MOFA': 'japanmfa', 'France, MINEFI': 'franceminefi', 'China, MOFCOM': 'china', 'UAE, MICAD': 'uae',
}


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


rootpath = join(dirname(realpath(__file__)), '..')

with open(join(rootpath, '_data', '2016', 'source-results.csv')) as f:
    r = csv.DictReader(f)
    results = [x for x in r]

orgs = {shortnames[x['organisation_name']]: {
    'org_code': x['organisation_code'],
    'name': x['organisation_name'],
    'score': 0.,
    'by_component': OrderedDict(),
} for x in results}

for x in results:
    org = orgs[shortnames.get(x['organisation_name'])]
    sc = float(x['indicator_total_weighted_points'])
    org['score'] += sc
    cat = x['indicator_category_subcategory'].replace('-', '_').lower()
    if cat == 'commitment_':
        cat = 'commitment'
    if cat not in org['by_component']:
        org['by_component'][cat] = 0.
    org['by_component'][cat] += float(x['total_points'])

orgs = OrderedDict(
    sorted(orgs.items(), key=lambda x: x[1]['score'], reverse=True))

for idx, org in enumerate(orgs.values()):
    org['rank'] = idx + 1
    org['performance_group'] = performance_group(org['score'])

with open(join(rootpath, '_data', '2016', 'results.json'), 'w') as f:
    json.dump(orgs, f)

with open(join(rootpath, 'gen', '2016', 'donor-template.md')) as f:
    donor_tmpl = f.read()

output_path = join(rootpath, '2016')
donors_path = join(output_path, 'donor')
shutil.rmtree(donors_path, ignore_errors=True)
makedirs(donors_path)

for slug, org in orgs.items():
    txt = donor_tmpl.format(slug=slug, **org)
    with open(join(donors_path, slug + '.md'), 'w') as f:
        f.write(txt)
