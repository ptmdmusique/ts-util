import { RelayConsumer } from "@signalwire/node";
import { projectId, token } from "./common";

const startConsumer = async () => {
  try {
    const consumer = new RelayConsumer({
      project: projectId,
      token,
      contexts: ["home", "office"],
      onIncomingCall: async (call: any) => {
        const { successful } = await call.answer();
        if (!successful) {
          console.error("Answer Error");
          return;
        }

        const collect = {
          type: "digits",
          digits_max: 3,
          text: "Welcome to SignalWire! Please, enter your 3 digits PIN",
        };
        const prompt = await call.promptTTS(collect);
        if (prompt.successful) {
          await call.playTTS({
            text: `You entered: ${prompt.result}. Thanks and good bye!`,
          });
        }
        await call.hangup();
      },
    });

    consumer.run();
  } catch (error) {
    console.error(error);
    console.error("ERROR");
  }
};

startConsumer();
