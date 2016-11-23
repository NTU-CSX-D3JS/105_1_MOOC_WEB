import csv
import re
a = csv.DictReader(open("518_Taipei.csv"))
l = []
for b in a:
  # lng lat 
  if b['Map'].find(',')==-1:
      continue
  mapstr = b['Map'].split(',')
  lng = mapstr[0]
  lat = mapstr[1]

  # url
  url = b['URL']

  # money 
  moneystr = b['薪資待遇：']
  if moneystr.find("月薪") == -1:
      continue
  
  money =  re.findall(r"[0-9,]+",moneystr)[0].replace(',','')

  l.append( {
      "lng" : lng,
      "lat" : lat,
      "url" : url,
      "money": money
  } )

fieldnames = ['url','lng', 'lat','money']
writer = csv.DictWriter(open("map_Taipei.csv","w"), fieldnames=fieldnames)
writer.writeheader()
writer.writerows(l)

