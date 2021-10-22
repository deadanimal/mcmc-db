import requests
import json

# Auth = {"Authentication":{"Username":"MCMC2021",
# 	"Password":"833c38dbdf88e210a41755f69165f54c",
# 	"Token":"1A8E29BF-00BE-47DD-AE39-31782A0F17C7"}
#     }

# Get Certified Product 

try:
    # response = requests.post("https://ecommptest.sirim.my/RESTAPI/api/GetNewCertifiedProduct", json=Auth )
    response = requests.post("http://ecommdev.esource.my/restapi/api/GetNewCertifiedProduct")
    print(response.status_code)
    # print(response.content)
    data_from_json = json.loads(response.content)
    cert_line_count = 0
    for row in data_from_json['TACList']:
        if cert_line_count==0:
            cert_line_count +=1
        certification = {
        # #      #  database: json
                'FileNo': row["FileNo"],
                'TAC': row["TAC"],
                'TypeOfProduct': row["TypeOfProduct"],
                'Model': row["Model"],
                'Brand': row["Brand"],
                'MarketingName': row["MarketingName"],
                'ApproveDate': row["ApproveDate"],
                'ExpiryDate': row["ExpiryDate"],
                'ProductCategory': row["ProductCategory"],
                'CertholderName': row["CertHolderName"],
                'ROCROB': row["ROCROB"],
            }
        cert_line_count += 1
        # print(json.dumps(certification))
        # requests.post('http://192.168.11.136/v1/productCertification/', data=certification)
        # print(row)
    print(f'Processed {cert_line_count -1} lines of Cert data.')
    
    

except:
    print("ada error with cert product code")

# Get SLP ID

try:
    # response2 = requests.post("https://ecommptest.sirim.my/RESTAPI/api/GetSLP", json=Auth)
    response2 = requests.post("http://ecommdev.esource.my/restapi/api/GetSLP")
    print(response2.status_code)
    SLP = json.loads(response2.content)
    SLP_line_count = 0
    for row in SLP['SLPList']:
        if SLP_line_count==0:
            SLP_line_count +=1
        SLPID = {
        # #      #  database: json
                'SLP_ID': row["SLPID"],
                'ExpiryDate': row["ExpiryDate"],
                'SLPID_owner': row["Owner"],
                'principal_certificate': row["Principal"],
            }
        SLP_line_count += 1
        # print(json.dumps(certification))
        # requests.post('http://192.168.11.136/v1/SLP/', data=SLPID)
        # print(row)
    print(f'Processed {SLP_line_count -1} lines of SLP data.')
    
except:
    print("ada error with SLP code")


# Get IMEI and Serial Number

# try:
    # AuthProduct = {"Authentication":{"Username":"MCMC2021",
    #     "Password":"833c38dbdf88e210a41755f69165f54c",
    #     "Token":"1A8E29BF-00BE-47DD-AE39-31782A0F17C7"},
    #     "TAC":"RDDO/12A/0220/S(20-0410)"
    #     }
    
TAC = {"TAC": "RGIC/06A/0620/S(20-2463)"}

    # response3 = requests.post("https://ecommptest.sirim.my/RESTAPI/api/GetProductRegistration", json=AuthProduct)
response3 = requests.post("http://ecommdev.esource.my/restapi/api/GetProductRegistration", json=TAC)
print(response3.status_code)
    # print(response3.content)
product = json.loads(response3.content)

line_count = 0
for row in product['ProductReg']:
    for row2 in row['IMEIList']:
        if line_count==0:
            line_count +=1   
        Product = {
                #  database: json
                'SLPID': row["SLP_ID"],
                'ProductRegistrationNo': row["ProductRegNo"],
                'RegType': row["RegType"],
                # 'SerialNo': row2["SerialNo"],
                'IMEI': row2['IMEINo'],
            }
        line_count += 1
            # print(json.dumps(certification))
        # requests.post('http://192.168.11.136/v1/ProductRegistration/', data=Product)
        print(Product)
print(f'Processed {line_count -1} lines of product data (IMEI).')

    # Sending email function through services
    # obj = {
    #     "template_code": "1",
    #     "context": "",
    #     }

    # sendMail=requests.post('http://192.168.11.136/v1/emailTemplate/send_email/', json=obj)
    # print(sendMail.response.code)

# except:
#     print("ada error di code")
    # Sending email function through angular services
    # obj = {
    #     "template_code": "2",
    #     "context": "",
    #     }

    # sendMail=requests.post('http://192.168.11.136/v1/emailTemplate/send_email/', json=obj)
    # print(sendMail.response.code)
    

TAC2 = {"TAC": "RCCT/75E/1020/S(20-4063)"}
response4 = requests.post("http://ecommdev.esource.my/restapi/api/GetProductRegistration", json=TAC2)
print(response4.status_code)
product2 = json.loads(response4.content)

line_count = 0
for row in product2['ProductReg']:
    for row2 in row['SerialNoList']:
        if line_count==0:
            line_count +=1   
        Product2 = {
                #  database: json
                'SLPID': row["SLP_ID"],
                'ProductRegistrationNo': row["ProductRegNo"],
                'RegType': row["RegType"],
                'SerialNo': row2["SerialNo"],
                # 'IMEI': row2['IMEINo'],
            }
        line_count += 1
            # print(json.dumps(certification))
        # requests.post('http://192.168.11.136/v1/ProductRegistration/', data=Product)
        print(Product2)
print(f'Processed {line_count -1} lines of product data (Serial).')

# Sending email function through services
obj = {
    "template_code": "1",
    "context": "",
    }

sendMail=requests.post('http://127.0.0.1:8000/v1/emailTemplate/send_email/', json=obj)
print(sendMail.response.code)

input("Press enter to exit ;)")