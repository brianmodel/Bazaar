import json
from flask import request, abort

from webhook import app


@app.route("/webhook", methods=["POST"])
def webhook():
    body = request.get_json()
    if body["object"] == "page":
        for entry in body["entry"]:
            webhook_event = entry["messaging"][0]
            print(webhook_event)
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

