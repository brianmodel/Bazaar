import json
import requests

from app.settings import SETTINGS


def handle_message(sender_psid, received_message):
    response = {}
    if "text" in received_message:
        response = {"text": received_message["text"]}
    call_send_api(sender_psid, response)


def call_send_api(sender_psid, response):
    request_body = {"recipient": {"id": sender_psid}, "message": response}
    uri = "https://graph.facebook.com/v4.0/me/messages?access_token={}".format(
        SETTINGS["PAGE_ACCESS_TOKEN"]
    )
    response = requests.post(uri, json=request_body)
