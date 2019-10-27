import requests
import json

url = "https://gateway-staging.ncrcloud.com/order/orders"
headers = {
    "nep-correlation-id": "12345",
    "nep-organization": "hack-bazaar",
    "nep-enterprise-unit": "c08a3e2841f94543935c3c0db0f0723b",
    "nep-application-key": "8a0189a96ddb1163016e066cb10c0036",
    "Content-Type": "application/json",
    "Authorization": "Basic YWNjdDpyb290QGhhY2tfYmF6YWFyOkc2QHp7W3EwJlo=",
    "User-Agent": "PostmanRuntime/7.19.0",
    "Accept": "*/*",
    "Cache-Control": "no-cache",
    "Postman-Token": "9fceb862-a2d5-43cb-8cc4-8e1d85ec8153,244945fe-13a7-4f11-b8e1-72c9a9d28031",
    "Host": "gateway-staging.ncrcloud.com",
    "Accept-Encoding": "gzip, deflate",
    "Content-Length": "592",
    "Cookie": "9e59b60fc083da305b706811d8f0d8f4=500eeee38cf8bfe546bf6c1991db68b4",
    "Connection": "keep-alive",
    "cache-control": "no-cache",
}


def get_generic_payload():
    return {
        "fulfillment": {
            "pickupDate": "2019-10-27T21:03:46.514Z",
            "pickupLocation": "Barry's House",
            "fulfillmentTime": "2019-10-27T21:03:46.514Z",
        },
        "orderLines": [
            {"productId": {"type": "n/a"}, "quantity": {"value": 0.0}, "unitPrice": 0.0}
        ],
        "payments": [{"amount": 0.0}],
        "customer": {
            "id": "n/a",
            "name": "n/a",
            "firstName": "n/a",
            "lastName": "n/a",
            "phone": "n/a",
        },
        "status": "OrderPlaced",
    }


def generate_payload(**kwargs):
    # print(properties)
    payload = get_generic_payload()
    update_dict(payload["fulfillment"], kwargs)
    for properties in payload["orderLines"]:
        update_dict(properties, kwargs)

    update_dict(payload["orderLines"][0]["productId"], kwargs)
    update_dict(payload["orderLines"][0]["quantity"], kwargs)
    update_dict(payload["payments"][0], kwargs)
    update_dict(payload["customer"], kwargs)
    update_dict(payload, kwargs)
    return json.dumps(payload)


def update_dict(properties, new_properties):
    for key in properties.keys():
        if key in new_properties and type(properties[key]) == type(new_properties[key]):
            properties[key] = new_properties[key]


def create_order(**kwargs):
    # print(generate_payload(kwargs))
    response = requests.request(
        "POST", url, data=generate_payload(**kwargs), headers=headers
    )
    return response.content


# create_order(name="test", value="sfsadf")


def get_order(id):
    newheaders = {
        "nep-correlation-id": "12345",
        "nep-application-key": "8a0189a96ddb1163016e066cb10c0036",
        "nep-organization": "hack-bazaar",
        "Content-Type": "application/json",
        "Authorization": "Basic YWNjdDpyb290QGhhY2tfYmF6YWFyOkc2QHp7W3EwJlo=",
        "User-Agent": "PostmanRuntime/7.19.0",
        "Accept": "*/*",
        "Cache-Control": "no-cache",
        "Postman-Token": "2e2b69c9-1c8e-47be-b909-3b4bbdba0677,0b247a16-2103-4d4c-8b6c-a17ce933bf86",
        "Host": "gateway-staging.ncrcloud.com",
        "Accept-Encoding": "gzip, deflate",
        "Cookie": "9e59b60fc083da305b706811d8f0d8f4=500eeee38cf8bfe546bf6c1991db68b4",
        "Connection": "keep-alive",
        "cache-control": "no-cache",
    }

    newurl = url + "/" + str(id)
    response = requests.request("GET", newurl, headers=newheaders)
    return response.json()


# get_order(13108171952785862744)


def get_all_orders():

    url = "https://gateway-staging.ncrcloud.com/order/orders/find"

    payload = '{\n  "pickupLocationId": "Barry\'s House",\n  "sort":{\n\t"column":"CreatedDate",\n\t"direction":"Desc"\n  },\n  "status":"OrderPlaced"\n}'

    querystring = {"pageNumber": "0", "pageSize": "100"}

    headers = {
        "nep-correlation-id": "123",
        "nep-application-key": "8a0189a96ddb1163016e066cb10c0036",
        "nep-organization": "hack-bazaar",
        "Content-Type": "application/json",
        "Authorization": "Basic YWNjdDpyb290QGhhY2tfYmF6YWFyOkc2QHp7W3EwJlo=",
        "User-Agent": "PostmanRuntime/7.19.0",
        "Accept": "*/*",
        "Cache-Control": "no-cache",
        "Postman-Token": "f5993701-49c5-4fc2-a02c-54b676438a95,582c1a68-f775-498f-ba72-1d629a1a9d80",
        "Host": "gateway-staging.ncrcloud.com",
        "Accept-Encoding": "gzip, deflate",
        "Content-Length": "128",
        "Connection": "keep-alive",
        "cache-control": "no-cache",
    }

    response = requests.request(
        "POST", url, data=payload, headers=headers, params=querystring
    )

    return response.json()


get_all_orders()

