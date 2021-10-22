import csv
import requests
import json

with open('SLPID.csv', mode='r', encoding='utf-8-sig') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    line_count = 0
    for row in csv_reader:
        if line_count == 0:
            # print(f'Column names are {", ".join(row)}')
            line_count += 1
        # print(f'\tworks in the {row["Email Address"]}')


        # account = {
        #  #  database: file(xlsx/csv)
        #     'SLPID': row["SLPID"],
        #     # 'FileNo': row["FileNo"],
        #     'TAC': row["TAC"],
        #     'ProductRegistrationNo': row["ProdRegNo"],
        #     'RegType': row["RegType"],
        #     'SerialNo': row["SerialNo"],
        #     # 'IMEI': row["IMEI"],
        #     'CA_owner': "SIRIM",
        #     # 'SLPID': row["SLPID"],
        # }
        SLPID = {
                # #      #  database: json
                        'SLP_ID': row["SLPID"],
                        'ExpiryDate': row["ExpiryDate"],
                        'SLPID_owner': row["SLPID_owner"],
                        'principal_certificate': row["principal_certificate"],
                        'ApproveDate': row["ApproveDate"],
                        'CA_owner': "SIRIM",
                    }
        line_count += 1
        #print(json.dumps(account))
        requestsUpload = requests.post('http://127.0.0.1:8000/v1/SLP/', data=SLPID)
        if (requestsUpload.status_code == 201):
            print(line_count-1, "Success")
        else:
            print(line_count-1, requestsUpload.status_code)
        
        # print(account)
    print(f'Processed {line_count -1} lines.')