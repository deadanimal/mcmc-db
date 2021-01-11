import csv
import requests
import json

with open('IMEINoforPrototype.csv', mode='r', encoding='utf-8-sig') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    line_count = 0
    for row in csv_reader:
        if line_count == 0:
            # print(f'Column names are {", ".join(row)}')
            line_count += 1
        # print(f'\tworks in the {row["Email Address"]}')


        account = {
            'fileNo': row["FILENO"],
            'productCategory': row["PRODUCT CATEGORY"],
            'TAC': row["TAC"],
            'modelId': row["MODEL ID"],
            'modelDescription': row["MODEL DESCRIPTION"],
            'consigneeName': row["CONSIGNEE NAME"],
            'submissionDate': row["SUBMISSION DATE"],
            'approveDate': row["APPROVE DATE"],
            'expiryDate': row["EXPIRY DATE"],
            'category': row["CATEGORY"],
            'imeiNo': row["IMEI No"],
            'SLPID': row["SLP ID"],
        }
        line_count += 1
        #print(json.dumps(account))
        requests.post('http://127.0.0.1:8000/v1/ProductRegistration/', data=account)
    print(f'Processed {line_count} lines.')