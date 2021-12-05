import Client from "twilio";

const fromNumber = "+14153357061";
const sid = "ACf638d628a2f7ee19d215d89620b12d8f";
const token = "55f388466d0f06a29dacd92a1059e1a3";

const call = async () => {
  try {
    const client = Client(sid, token);
    const result = await client.calls.create({
      twiml: "<Response><Say>Ahoy, World!</Say></Response>",
      to: "+19714709613",
      from: fromNumber,
    });

    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

const sendMessage = async () => {
  try {
    const client = Client(sid, token);
    const result = await client.messages.create({
      body: "Hello world!",
      to: "+19714709613",
      from: fromNumber,
    });
    console.log(result);
    const result2 = await client.messages.create({
      body: "Hello world!",
      to: "+15418081669",
      from: fromNumber,
    });
    console.log("result2:", result2);
  } catch (error) {
    console.error(error);
  }
};

const sendMessage2 = async () => {
  try {
    const client = Client(sid, token);
    const result = await client.messages.create({
      body: "Hello world!",
      to: "+19714709613",
      from: fromNumber,
    });
    console.log(result);
    const client2 = Client(sid, token);
    const result2 = await client2.messages.create({
      body: "Hello world!",
      to: "+15418081669",
      from: fromNumber,
    });
    console.log("result2:", result2);
  } catch (error) {
    console.error(error);
  }
};

sendMessage2();
// sendMessage();
// sendMessage();
// sendMessage();
