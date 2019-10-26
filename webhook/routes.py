from flask import request

from webhook import app


@app.route("/webhook", methods=["POST"])
def verify_webhook():
    pass
