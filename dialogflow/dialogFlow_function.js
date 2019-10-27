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
  alligator: 900,
  walrus: 1000,
  raccoon: 1200
};
const animalsToFood = {
  cat: "Catty Cabbage",
  dog: "Doggy Daikons",
  fish: "Fishy Flaxseeds",
  bird: "Birdy Broad Beans",
  elephant: "Elephanty Endives",
  ostrich: "Ostrichy Oats",
  hippo: "Hippo Honeydew",
  tiger: "Tigery Turnips",
  alligator: "Alligator Aubergine",
  walrus: "Walrus Watercress",
  raccoon: "Raccoon Rhubarb"
};
const recommendations = {
  cat: ["Doggy Daikons", "Birdy Broad Beans"],
  dog: ["Catty Cabbage", "Fishy Flaxseeds"],
  fish: ["Birdy Broad Beans", "Doggy Daikons"],
  bird: ["Ostrichy Oats", "Raccoon Rhubarb"],
  elephant: ["Hippo Honeydew", "Walrus Watercress"],
  ostrich: ["Birdy Broad Beans", "Fishy Flaxseeds"],
  hippo: ["Elephanty Endives", "Alligator Aubergine"],
  tiger: ["Alligator Aubergine", "Raccoon Rhubarb"],
  alligator: ["Hippo Honeydew", "Walrus Watercress"],
  walrus: ["Fishy Flaxseeds", "Alligator Aubergine"],
  raccoon: ["Catty Cabbage", "Doggy Daikons"]
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
        const parameters = queryResult.outputContexts[0].parameters;
        const animal = parameters.pet_food;
        const price = Math.max(parameters.amount.amount, prices[animal]);

        const user =
          request.body.originalDetectIntentRequest.payload.data.sender.id;

        sendClosingPrice(user, animal, price);
        response.send(
          buildChatResponse(
            "Fantastic! Please come pick up the item at Adrian's Artisanal Animal Aliments (aka Barry's Best Buys) tomorrow at 5 pm."
          )
        );
        break;
      }
      case "bartering.Bartering-no": {
        const parameters = queryResult.outputContexts[0].parameters;
        const animal = parameters.pet_food;
        const [recommendation1, recommendation2] = recommendations[animal];
        const food = animalsToFood[animal];

        const message = `Alright, well thank you for considering us.
Based on our conversation and your interest in ${food}, you might also like ${recommendation1} and ${recommendation2}!
Have a good day :)`;
        response.send(buildChatResponse(message));
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

function sendClosingPrice(id, animal, price) {
  const payload = {
    animal,
    price,
    id
  };

  fetch(`${baseUrl}${conversationsEndpoint}confirm`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

function buildChatResponse(message) {
  return JSON.stringify({ fulfillmentText: message });
}
