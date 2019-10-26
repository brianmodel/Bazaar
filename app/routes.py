import json
from flask import request, abort

from app import app
from app.handlers import handle_message


@app.route("/")
def hello():
    return "Hello World"


@app.route("/conversation/webhook", methods=["POST"])
def handle_conversation():
    body = request.get_json()
    print(body)
    return "Recieved"


@app.route("/webhook", methods=["POST"])
def webhook():
    body = request.get_json()
    if body["object"] == "page":
        for entry in body["entry"]:
            webhook_event = entry["messaging"][0]
            sender_psid = webhook_event["sender"]["id"]

            if "message" in webhook_event:
                handle_message(sender_psid, webhook_event["message"])

        return "EVENT_RECIEVED"
    else:
        abort(404)


@app.route("/webhook", methods=["GET"])
def verify_webhook():
    VERIFY_TOKEN = "token"
    mode = request.args.get("hub.mode", None)
    token = request.args.get("hub.verify_token", None)
    challenge = request.args.get("hub.challenge", None)

    if mode and token:
        if mode == "subscribe" and token == VERIFY_TOKEN:
            print("WEBHOOK_VERIFIED")
            return challenge
        else:
            abort(403)

