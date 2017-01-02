import csv
import re
from pprint import pprint

address = csv.DictReader(open("address_df_all.csv"))
csvdata = csv.DictReader(open("591data_org_utf.csv"))
# iconv -f big5 -t utf8 src_filename -o output_filename



findid = {}
newdata = []
for i in address:
    findid[ i['id'] ] = len(newdata) 

    dic = {}
    dic['URL'] = 'https://rent.591.com.tw/rent-detail-'+str(i['id'])+'.html' 
    dic['address'] = i['address_final']
    dic['lng'] = i['lng']
    dic['lat'] = i['lat']
    newdata.append(dic)

for i in csvdata:
    dic = {}
    dic['region_name'] = i['region_name']
    a = dic['section_name'] = i['section_name'].replace("區","")

    dic['price'] = i['price'].replace(',','')
    dic['layout'] = i['layout'] 
    dic['area'] = i['area'] 
    dic['title'] = i['fulladdress']

    if findid.get(i['id']):
        newdata[ findid[ i['id'] ] ] .update(dic)
    else:
        print(dic)


fieldnames = ['title','layout','URL','address', 'section_name', 'region_name','lng','lat',"price",'area']
writer = csv.DictWriter(open("591_Taipei_ok.csv","w"), fieldnames=fieldnames)
writer.writeheader()
for i in newdata:
    if i.get('title'):
        writer.writerow(i)

