import { RelayClient, Task } from "@signalwire/node";
import { projectId, token } from "./common";

const test = async () => {
  try {
    const client = new RelayClient({ project: projectId, token });
    await client.connect();

    client.on("signalwire.ready", async (client: any) => {
      // const dialResult = await client.calling.dial({
      //   type: "phone",
      //   from: "+18666681830",
      //   to: "+19714709613",
      //   timeout: 30,
      // });
      // await dialResult.call.playTTS({ text: "TEST TEST TEST" });
      // console.log("dialResult:", dialResult);
      const result = await client.messaging.send({
        context: "office",
        from: "+12818684826",
        to: "+19714709613",
        body: "Hello world",
      });
      console.log(result);
    });
  } catch (error) {
    console.error(error);
    console.error("ERROR");
  }
};

const test2 = async () => {
  try {
    const client = new RelayClient({ project: projectId, token });
    await client.connect();

    client.on("signalwire.ready", async (client: any) => {
      const result2 = await client.messaging.send({
        context: "office",
        from: "+12818684826",
        to: "+15418081669",
        body: "Hello world",
      });
      console.log("result2:", result2);
      console.log("ASD");
    });
  } catch (error) {
    console.error(error);
    console.error("ERROR");
  }
};

async function main() {
  const yourTask = new Task(projectId, token);
  const context = "office";
  const data = {
    uuid: "unique id",
    data: "data for your job",
  };
  try {
    await yourTask.deliver(context, data);
  } catch (error) {
    console.log("Error creating task!", error);
  }
}

// main().catch(console.error);
test();
// test2();
