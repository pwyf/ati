from collections import OrderedDict
import csv
import json
from os.path import dirname, exists, join, realpath
from os import makedirs


shortnames = {
    'UNDP': 'undp', 'U.S., MCC': 'usmcc', 'UNICEF': 'unicef', 'UK, DFID': 'ukdfid', 'Global Fund': 'global-fund', 'World Bank, IDA': 'world-bank-ida', 'IADB': 'iadb', 'AsDB': 'asdb', 'Sweden, MFA-Sida': 'sweden', 'AfDB': 'afdb', 'GAVI': 'gavi', 'Canada, DFATD': 'canada', 'EC, NEAR': 'ecnear', 'EC, ECHO': 'ececho', 'EC, DEVCO': 'ecdevco', 'Netherlands, MFA': 'netherlands', 'Denmark, MFA': 'denmark', 'Germany, BMZ-GIZ': 'germanygiz', 'U.S., USAID': 'ususaid', 'Germany, BMZ-KFW': 'germanykfw', 'U.S., Treasury': 'ustreasury', 'U.S., PEPFAR': 'uspepfar', 'U.S., State': 'usstate', 'EIB': 'eib', 'Australia, DFAT': 'australia', 'EBRD': 'ebrd', 'Belgium, DGCD': 'belgium', 'U.S., Defense': 'usdod', 'Spain, MAEC-AECID': 'spain', 'Gates Foundation': 'gates', 'Switzerland, SDC': 'switzerland', 'France, AFD': 'franceafd', 'Japan, JICA': 'japanjica', 'Norway, MFA': 'norway', 'Finland, MFA': 'finland', 'France, MAEDI': 'ministry-of-foreign-affairs', 'UN OCHA': 'unocha', 'Ireland, IrishAid': 'ireland', 'IMF': 'imf', 'World Bank, IFC': 'world-bankifc', 'Korea, KOICA': 'korea', 'Italy, MAE': 'italy', 'Japan, MOFA': 'japanmfa', 'France, MINEFI': 'franceminefi', 'China, MOFCOM': 'china', 'UAE, MICAD': 'uae',
}

fullnames = {'UNDP': 'United Nations Development Programme (UNDP)', 'U.S., MCC': 'U.S. – Millennium Challenge Corporation (MCC)', 'UNICEF': 'United Nations Children’s Fund (UNICEF)', 'UK, DFID': 'UK – Department for International Development (DFID)', 'Global Fund': 'The Global Fund to Fight AIDS, Tuberculosis and Malaria', 'World Bank, IDA': 'World Bank – International Development Association', 'IADB': 'Inter-American Development Bank', 'AsDB': 'Asian Development Bank', 'Sweden, MFA-Sida': 'Sweden', 'AfDB': 'African Development Bank', 'GAVI': 'GAVI', 'Canada, DFATD': 'Canada – Department of Foreign Affairs, Trade and Development', 'EC, NEAR': 'DG European Neighbourhood Policy and Enlargement Negotiations', 'EC, ECHO': 'DG Humanitarian Aid and Civil Protection', 'EC, DEVCO': 'DG Development and Cooperation – EuropeAid', 'Netherlands, MFA': 'Netherlands – Ministry of Foreign Affairs', 'Denmark, MFA': 'Denmark – Ministry of Foreign Affairs', 'Germany, BMZ-GIZ': 'Germany – Ministry for Economic Cooperation and Development (BMZ) – GIZ', 'U.S., USAID': 'U.S. – United States Agency for International Development (USAID)', 'Germany, BMZ-KFW': 'Germany – Ministry for Economic Cooperation and Development (BMZ) – KfW', 'U.S., Treasury': 'U.S. – Department of the Treasury', 'U.S., PEPFAR': 'U.S. – President’s Emergency Plan for AIDS Relief', 'U.S., State': 'U.S. – Department of State', 'EIB': 'European Investment Bank', 'Australia, DFAT': 'Australia – Department of Foreign Affairs and Trade', 'EBRD': 'European Bank for Reconstruction and Development', 'Belgium, DGCD': 'Belgium – Belgian Development Agency', 'U.S., Defense': 'U.S. – Department of Defense', 'Spain, MAEC-AECID': 'Spain – Ministry of Foreign Affairs and Cooperation', 'Gates Foundation': 'The Bill and Melinda Gates Foundation', 'Switzerland, SDC': 'Switzerland – Swiss Agency for Development and Cooperation', 'France, AFD': 'France – French Development Agency', 'Japan, JICA': 'Japan – Japan International Cooperation Agency', 'Norway, MFA': 'Norway – Ministry of Foreign Affairs', 'Finland, MFA': 'Finland – Ministry of Foreign Affairs', 'France, MAEDI': 'France – Ministry of Foreign Affairs', 'UN OCHA': 'United Nations Office for the Coordination of Humanitarian Affairs (UN OCHA)', 'Ireland, IrishAid': 'Ireland – Ministry of Foreign Affairs', 'IMF': 'International Monetary Fund (IMF)', 'World Bank, IFC': 'World Bank – International Finance Corporation', 'Korea, KOICA': 'Korea – Korean International Cooperation Agency', 'Italy, MAE': 'Italy – Ministry of Foreign Affairs and International Cooperation', 'Japan, MOFA': 'Japan – Ministry of Foreign Affairs', 'France, MINEFI': 'France – Ministry of Economy and Finance', 'China, MOFCOM': 'China – Ministry of Commerce', 'UAE, MICAD': 'United Arab Emirates (UAE)'}

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
    'score': 0.,
    'by_component': OrderedDict(),
} for x in results}

page_info = [{
    'name': x['organisation_name'],
    'slug': shortnames[x['organisation_name']],
} for x in results]

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
if not exists(donors_path):
    makedirs(donors_path)

for page in page_info:
    filepath = join(donors_path, page['slug'] + '.md')
    if exists(filepath):
        # read in the file; strip out the frontmatter
        with open(filepath) as f:
            content = f.read()
        content = content.split('\n---\n', 1)[1]
        # strip the contents from the template
        current_tmpl = donor_tmpl.split('\n---\n', 1)[0] + '\n---\n'
        txt = current_tmpl.format(full_name=fullnames[page['name']], **page)
        txt += content
    else:
        txt = donor_tmpl.format(full_name=fullnames[page['name']], **page)
    with open(filepath, 'w') as f:
        f.write(txt)
