import json
from os.path import dirname, join, realpath
from os import system
import shutil


rootpath = join(dirname(realpath(__file__)), '..')
with open(join(rootpath, '_data', '2018', 'results.json')) as f:
    j = json.load(f)

tmp_output_path = join(rootpath, 'gen', 'out')
rasterize_path = join(rootpath, 'gen', 'rasterize.js')
for publisher in j.keys():
    print('{} (en)'.format(publisher))
    url = 'http://localhost:4000/2018/{}/index.html'.format(publisher)
    pdf_path = join(tmp_output_path, '{pub}.pdf'.format(
        pub=publisher))
    cmd = 'phantomjs {rasterize_path} {url} {pdf_path} A4'.format(
        rasterize_path=rasterize_path, url=url, pdf_path=pdf_path)
    system(cmd)

translated = {
    'fr': ['afdb', 'belgium-dgd', 'canada-global-affairs',
           'ec-devco', 'ec-echo', 'ec-near', 'france-afd'
           'france-meae'],
    'de': ['germany-bmz-giz', 'germany-bmz-kfw'],
}

for lang, publishers in translated.items():
    for publisher in publishers:
        print('{} ({})'.format(publisher, lang))
        url = 'http://localhost:4000/2018/{lang}/{pub}/index.html'.format(
            lang=lang, pub=publisher)
        pdf_path = join(tmp_output_path, '{pub}_{lang}.pdf'.format(
            pub=publisher, lang=lang))
        cmd = 'phantomjs {rasterize_path} {url} {pdf_path} A4'.format(
            rasterize_path=rasterize_path, url=url, pdf_path=pdf_path)
        system(cmd)

final_output_path = join(rootpath, '2018', 'static', 'pdfs')
shutil.rmtree(final_output_path)
shutil.move(pdf_path, final_output_path)
