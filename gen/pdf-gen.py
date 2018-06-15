import json
from os.path import dirname, join, realpath
from os import system


rootpath = join(dirname(realpath(__file__)), '..')
with open(join(rootpath, '_data', '2018', 'results.json')) as f:
    j = json.load(f)

for publisher in j.keys():
    url = 'http://localhost:4000/2018/{}/index.html'.format(publisher)
    pdf_path = join(rootpath, '2018', 'static', 'pdfs', '{pub}.pdf'.format(
        pub=publisher))
    rasterize_path = join(rootpath, 'gen', 'rasterize.js')
    cmd = 'phantomjs {rasterize_path} {url} {pdf_path} A4'.format(
        rasterize_path=rasterize_path, url=url, pdf_path=pdf_path)
    system(cmd)
