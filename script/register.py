import csv
import requests
import json

with open('mcmc.csv', mode='r', encoding='utf-8-sig') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    line_count = 0
    for row in csv_reader:
        if line_count == 0:
            # print(f'Column names are {", ".join(row)}')
            line_count += 1
        # print(f'\tworks in the {row["Email Address"]}')
        account = {
            'ProductRegNo': row["ProductRegNo"],
            'SLPID': row["SLPID"],
            'TAC': row["TAC"],
            'regType': row["RegType"],
            'IMEI': row["IMEI"]
        }
        line_count += 1
        #print(json.dumps(account))
        requests.post('http://127.0.0.1:8000/v1/ProductRegistration/', data=account)
    print(f'Processed {line_count} lines.')