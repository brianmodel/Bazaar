import json
from flask import request, abort
import os

from app import app
from app.handlers import handle_message
from tinydb import TinyDB, Query


@app.route("/")
def hello():
    return "Hello World"


@app.route("/analysis")
def analysis():
    with open(os.getcwd() + "/app/analysis/scores.json", "r") as f:
        scores = json.load(f)
    return json.dumps(scores)


@app.route("/analysis/update")
def update_analysis():
    import app.analysis.transcript_analysis as ta

    ta.update_analyisis()
    return "Success"


@app.route("/conversation/confirm", methods=["POST"])
def confirm_order():
    body = request.get_json()
    final_price = body["price"]
    animal = body["animal"]
    return "Success"

@app.route('/ranges')
def get_ranges():
    db = TinyDB(os.getcwd() + "/app/db.json")
    return json.dumps(db.all())


@app.route("/conversation/barter/", methods=["POST"])
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
        "raccoon": 5000,
    }
    body = request.get_json()

    text = body["message"]
    try:
        price = int(body["price"])
    except Exception:
        price = 300
    animal = body["animal"]
    person_id = body["id"]

    db = TinyDB(os.getcwd() + "/app/db.json")
    Animal = Query()
    result = db.search(Animal.name == animal)
    if len(result) > 0:
        result = result[0]
        price_range = result["range"]
        min_price, max_price = price_range["min"], price_range["max"]
        if price < min_price:
            min_price = price
        if price > max_price:
            max_price = price
        db.update({"range": {"min": min_price, "max": max_price}}, Animal.name == animal)
    else:
        db.insert({"name": animal, "range": {"min": price, "max": price}})
    print(db.all())

    with open(os.getcwd() + "/app/analysis/transcript.json", "r") as f:
        transcript = json.loads(f.read())
    if animal not in transcript:
        transcript[animal] = []
    transcript[animal].append(text)

    with open(os.getcwd() + "/app/analysis/transcript.json", "w") as f:
        json.dump(transcript, f)

    response = {}
    if price >= animals[animal]:
        response["valid"] = "true"
    else:
        response["valid"] = "false"
        response["price"] = animals[animal]
    return json.dumps(response)


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
        "raccoon": 5000,
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

