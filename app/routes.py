import json
from flask import request, abort
import os

from app import app
from app.handlers import handle_message
from app.firebase import add_transcript


@app.route("/")
def hello():
    return "Hello World"


@app.route("conversation/confirm")
def confirm_order():
    pass


@app.route("/conversation/barter", methods=["POST"])
def barter():
    animals = {
        "cat": 100,
        "dog": 200,
        "fish": 300,
        "bird": 400,
        "elephant": 500,
        "ostrich": 600,
        "hippo": 700,
        "tiger": 800,
        "monkey": 900,
        "walrus": 1000,
        "racoon": 5000,
    }
    body = requests.get_json()

    text = body["message"]
    price = body["price"]
    animal = body["animal"]
    person_id = body["id"]

    response = {}
    if price >= animals[animal]:
        response["valid"] = "true"
    else:
        response["valid"] = "false"
        response["price"] = animals[animal]
    return response


@app.route("/conversation/prices/<animal>")
def get_initial_price(animal):
    animals = {
        "cat": 100,
        "dog": 200,
        "fish": 300,
        "bird": 400,
        "elephant": 500,
        "ostrich": 600,
        "hippo": 700,
        "tiger": 800,
        "monkey": 900,
        "walrus": 1000,
        "racoon": 5000,
    }
    response = {"price": animals[animal.lower()] * 1.2}
    return json.dumps(response)


@app.route("/conversation/webhook", methods=["POST"])
def handle_conversation():
    body = request.get_json()
    headers = request.headers
    qs = request.args
    everything = {"payload": body, "headers": headers, "queryString": qs}
    return json.dumps(body)


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

