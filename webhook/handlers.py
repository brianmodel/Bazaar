import json
import requests

from webhook.settings import SETTINGS


def handle_message(sender_psid, received_message):
    response = {}
    print(received_message)
    if "text" in received_message:
        response = {"text": received_message["text"]}
    call_send_api(sender_psid, response)


def handle_postback(sender_psid, received_postback):
    pass


def call_send_api(sender_psid, response):
    request_body = {"recipient": {"id": sender_psid}, "message": response}
    uri = "https://graph.facebook.com/v2.6/me/messages"
    params = {"access_token": SETTINGS["PAGE_ACCESS_TOKEN"]}
    response = requests.post(uri, data=request_body, params=params)
    print(response)
