import { RelayConsumer } from "@signalwire/node";
import { projectId, token } from "./common";

const startConsumer = async () => {
  try {
    const consumer = new RelayConsumer({
      project: projectId,
      token,
      contexts: ["home", "office"],
      // ready: async (consumer: any) => {
      //   const dialResult = await consumer.client.calling.dial({
      //     type: "phone",
      //     from: "+18666681830",
      //     to: "+19714709613",
      //   });
      //   const { successful, call } = dialResult;
      //   if (!successful) {
      //     console.error("Dial error..");
      //     return;
      //   }

      //   const prompt = await call.promptTTS({
      //     type: "digits",
      //     digits_max: 3,
      //     text: "Welcome to SignalWire! Enter your 3 digits PIN",
      //   });

      //   if (prompt.successful) {
      //     console.log(`User digits: ${prompt.result}`);
      //   }
      // },
      onTask: (message: any) => {
        console.log("Inbound task", message);
        // Retrieve your custom properties from 'message'..
        const { uuid, data } = message;
        console.log("data:", data);
        console.log("uuid:", uuid);
      },
    });

    consumer.run();
  } catch (error) {
    console.error(error);
    console.error("ERROR");
  }
};

startConsumer();
