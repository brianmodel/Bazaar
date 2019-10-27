import json
from flask import request, abort
import os
import requests

from app import app
from app.handlers import handle_message
from app.settings import SETTINGS
from app.ncr.order_api_tools import create_order, get_all_orders, get_order
from tinydb import TinyDB, Query


@app.route("/")
def hello():
    return "Hello World"


@app.route("/orders")
def get_orders():
    orders = get_all_orders()
    response = []
    for order in orders["orders"]:
        order_id = order["id"]
        date_created = order["dateCreated"]
        customer = order["customer"]["name"]

        full_order = get_order(order_id)
        amount_paid = full_order["payments"][0]["amount"]
        item = full_order["orderLines"][0]["productId"]["type"]
        order_entry = {
            "id": order_id,
            "dateCreated": date_created,
            "customerName": customer,
            "amountPaid": float(amount_paid),
            "item": item,
        }
        response.append(order_entry)
    return json.dumps(response)


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
    animals = {
        "cat": (100, "Catty Cabbage"),
        "dog": (200, "Doggy Daikons"),
        "fish": (300, "Fishy Flaxseeds"),
        "bird": (400, "Birdy Broad Beans"),
        "elephant": (500, "Elephanty Endives"),
        "ostrich": (600, "Ostrichy Oats"),
        "hippo": (700, "Hippo Honeydew"),
        "tiger": (800, "Tigery Turnips"),
        "alligator": (900, "Alligator Aubergine"),
        "walrus": (1000, "Walrus Watercress"),
        "raccoon": (1200, "Raccoon Rhubarb"),
    }

    body = request.get_json()
    final_price = body["price"]
    animal = body["animal"]
    customer_id = body['id']
    actual_price, full_name = animals[animal]

    resp = requests.get('https://graph.facebook.com/v4.0/{}?access_token={}'.format(customer_id, SETTINGS['PAGE_ACCESS_TOKEN']))
    resp = resp.json()

    name = resp.get('first_name', "") + ' ' + resp.get('last_name', "")
    create_order(
        type=full_name,
        name= name,
        phone="1234567890",
        unitPrice=actual_price,
        amount=final_price,
    )

    return "Order confirmed"


@app.route("/ranges")
def get_ranges():
    db = TinyDB(os.getcwd() + "/app/db.json")
    return json.dumps(db.all())


@app.route("/conversation/barter/", methods=["POST"])
def barter():
    animals = {
        "cat": (100, "Catty Cabbage"),
        "dog": (200, "Doggy Daikons"),
        "fish": (300, "Fishy Flaxseeds"),
        "bird": (400, "Birdy Broad Beans"),
        "elephant": (500, "Elephanty Endives"),
        "ostrich": (600, "Ostrichy Oats"),
        "hippo": (700, "Hippo Honeydew"),
        "tiger": (800, "Tigery Turnips"),
        "alligator": (900, "Alligator Aubergine"),
        "walrus": (1000, "Walrus Watercress"),
        "raccoon": (5000, "Raccoon Rhubarb"),
    }
    body = request.get_json()

    text = body["message"]
    try:
        price = int(body["price"])
    except Exception:
        price = 300
    animal = body["animal"]
    person_id = body["id"]

    actual_price, full_name = animals[animal]

    db = TinyDB(os.getcwd() + "/app/db.json")
    Animal = Query()
    result = db.search(Animal.label == full_name)
    if len(result) > 0:
        result = result[0]
        price_range = result["y"]
        min_price, max_price = price_range[0], price_range[1]
        if price < min_price:
            min_price = price
        if price > max_price:
            max_price = price
        db.update({"y": [min_price, max_price]}, Animal.label == full_name)
    else:
        db.insert({"label": full_name, "y": [price, price]})

    with open(os.getcwd() + "/app/analysis/transcript.json", "r") as f:
        transcript = json.loads(f.read())
    if animal not in transcript:
        transcript[animal] = []
    transcript[animal].append(text)

    with open(os.getcwd() + "/app/analysis/transcript.json", "w") as f:
        json.dump(transcript, f)

    response = {}
    if price >= animals[animal][0]:
        response["valid"] = "true"
    else:
        response["valid"] = "false"
        response["price"] = animals[animal]
    return json.dumps(response)


# @app.route('/recommended')
# def get_recommendation():
#     {
#         "Catty Cabbage": ["Doggy Daikons", "Birdy Broad Beans"],
#         "Doggy Daikons": ["Catty Cabbage", "Fishy Flaxseeds"],
#         "Fishy Flaxseeds": ["Birdy Broad Beans", "Doggy Daikons"],
#         "Birdy Broad Beans": ["Ostrichy Oats", "Raccoon Rhubarb"],
#         "Elephanty Endives": ["Hippo Honeydew", "Walrus Watercress"],
#         "Ostrichy Oats": ["Birdy Broad Beans", "Fishy Flaxseeds"],
#         "Hippo Honeydew": ["Elephanty Endives", "Alligator Aubergine"],
#         "Tigery Turnips": ["Alligator Aubergine", "Raccoon Rhubarb"],
#         "Alligator Aubergine": [],
#         "Walrus Watercress": [],
#         "Raccoon Rhubarb": []
#     }


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

