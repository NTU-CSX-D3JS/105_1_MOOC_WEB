import json
from pprint import pprint 

data = json.loads(open("MapLine.json").read())
newdata = {}
newdata['type'] = data['type']
newdata['features'] = []

for i in data['features']:
    if i['properties']['countyname'] == "臺北市":
        newdata['features'].append(i)

open("MapLines.json","w").write(json.dumps(newdata))

#pprint(a)
