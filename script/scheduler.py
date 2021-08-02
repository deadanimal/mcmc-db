import requests
import json

token_url="https://staging-gw-codelab.sirim.my/security/connect/token"
url = "https://staging-gw-codelab.sirim.my/eip-admin/sirim-ecomm/v1/GetNewCertifiedProduct"

client_id='60ee4a9379aa3166c8632f93'
client_secret='5nZ85UMp5GpOswN5BEyxnCdoWX7hyX9QVuKsyIdqtd4='
scope='eip-admin.sirim-ecomm.all'

payload = json.dumps({
  "Authentication": {
    "UserName": "MCMC2021",
    "Password": "833c38dbdf88e210a41755f69165f54c",
    "Token": "1A8E29BF-00BE-47DD-AE39-31782A0F17C7"
  }
}) 

data = {'grant_type': 'client_credentials'}
access_token_response = requests.post(token_url, data=data, verify=False, allow_redirects=False, auth=(client_id, client_secret))

# print (access_token_response.headers)
# print (access_token_response.text)

tokens = json.loads(access_token_response.text)

# print ("access token: " + tokens['access_token'])

headers={'Authorization': 'Bearer ' + tokens['access_token']}

payload = json.dumps({
  "Authentication": {
    "UserName": "MCMC2021",
    "Password": "833c38dbdf88e210a41755f69165f54c",
    "Token": "1A8E29BF-00BE-47DD-AE39-31782A0F17C7"
  }
})

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

