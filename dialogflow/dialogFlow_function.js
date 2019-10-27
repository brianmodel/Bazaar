// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
"use strict";

const functions = require("firebase-functions");
const fetch = require("node-fetch");

const baseUrl = "https://hackgt.localtunnel.me/";
const conversationsEndpoint = "conversation/";

const prices = {
  cat: 100,
  dog: 200,
  fish: 300,
  bird: 400,
  elephant: 500,
  ostrich: 600,
  hippo: 700,
  tiger: 800,
  monkey: 900,
  walrus: 1000,
  raccoon: 5000
};

process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
  (request, response) => {
    console.log(
      "Dialogflow Request headers: " + JSON.stringify(request.headers)
    );
    console.log("Dialogflow Request body: " + JSON.stringify(request.body));

    response.setHeader("Content-Type", "application/json");

    const queryResult = request.body.queryResult;
    const action = queryResult.action;

    switch (action) {
      case "input.petFood": {
        const animal = queryResult.parameters.pet_food;
        const initialPrice = getInitialPrice(animal);
        const message = `That product is sold for ${initialPrice}\$ in our store.`;
        response.send(buildChatResponse(message));
        break;
      }
      case "input.barter": {
        const amount = queryResult.parameters.amount.amount;
        const animal = queryResult.outputContexts[0].parameters.pet_food;
        const user =
          request.body.originalDetectIntentRequest.payload.data.sender.id;
        const queryText = queryResult.queryText;

        const { valid, price } = getBarter(user, animal, amount, queryText);
        let message;
        if (valid) {
          message = `Hmmm... You drive a hard bargain for this highest quality artisanal ${animal} food. But we can work with this. You want to proceed with the deal for ${price}\$?`;
        } else {
          message = `Do you understand we sell the highest quality artisanal ${animal} food! We are a nonprofit that makes a loss with each sale. The lowest we can go is ${price}\$. Do you accept?`;
        }

        response.send(buildChatResponse(message));
        break;
      }
      case "bartering.Bartering-yes": {
        response.send(
          buildChatResponse(
            "Fantastic! Please come pick up the item at Adrian's Artisanal Animal Aliments tomorrow at 5 pm."
          )
        );
        break;
      }
      case "bartering.Bartering-no": {
        response.send(
          buildChatResponse("Alright, well thank you for considering us.")
        );
        break;
      }
      default:
        response.send(buildChatResponse("I'm sorry. I don't understand."));
    }
  }
);

function getInitialPrice(animal) {
  const initPrice = prices[animal] * 1.2;

  return initPrice;
}

function getBarter(id, animal, price, message) {
  const payload = {
    animal,
    price,
    message,
    id
  };

  fetch(`${baseUrl}${conversationsEndpoint}barter/`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (price >= prices[animal]) {
    return { valid: true, price };
  }
  return { valid: false, price: prices[animal] };
}

function buildChatResponse(message) {
  return JSON.stringify({ fulfillmentText: message });
}
