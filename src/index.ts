require("dotenv").config();
import * as fastify from "fastify";
import {schedule} from "node-cron";
import {IncomingMessage, Server, ServerResponse} from "node:http";
import winedb, {getAllWines, storeData} from "./winedb.js";
import {getCellarTrackerWinesCSV} from "./winecellar.js";
import {
  GetLedsForRowAndColumn,
  TurnOnLEDs,
  TurnOnLEDsWithColor,
} from "./wled.js";

if (!process.env.CT_USERNAME || !process.env.CT_PASSWORD)
  throw Error("Env vars CT_USERNAME or CT_PASSWORD not set");

if (!process.env.WLED_IP_ADDRESS)
  throw Error("Env var WLED_IP_ADDRESS not set");

let lastDataUpdate = new Date(0);
let lastDataUpdateSuccess = false;
let lastDataUpdateResult: any = "";

const httpServer: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify.fastify({
  logger: true,
});

httpServer.get("/", (request, reply) => {
  reply.send({lastDataUpdate, lastDataUpdateSuccess, lastDataUpdateResult});
});

httpServer.get("/display", async (request, reply) => {
  reply.send(await getAllWines());
});

httpServer.get("/display/mature", async (request, reply) => {
  const yearNow = new Date().getFullYear();
  const matchingBottles = (await getAllWines()).filter(
    b => b.BeginConsume <= yearNow
  );
  reply.send(matchingBottles);
});

httpServer.listen({port: 3000}, (err, address) => {
  if (err) throw err;
  winedb("ctdata.json");
  console.log(`Server is now listening on ${address}`);
  schedule("*/10 * * * * *", async () => {
    updateWineDatabase()
      .then(result => {
        lastDataUpdate = new Date();
        lastDataUpdateSuccess = true;
        lastDataUpdateResult = result;
        let leds: number[] = [];
        for (let i = 0; i < 10; i++) {
          leds = leds.concat(
            GetLedsForRowAndColumn(
              0,
              i,
              Math.round(Math.random()) === 1 ? [0, 100, 0] : [100, 0, 0]
            )
          );
        }
        console.log(leds);
        TurnOnLEDs(leds).catch(e => console.log("Unable to set LEDs: " + e));
      })
      .catch(reason => {
        lastDataUpdate = new Date();
        lastDataUpdateSuccess = false;
        lastDataUpdateResult = reason;
      });

    console.log("running a task every 10 minutes");
  });
});

const updateWineDatabase = async () => {
  const wineData = await getCellarTrackerWinesCSV();
  if (wineData && wineData.length > 0)
    storeData({bottles: wineData}, "./ctdata.json");
};
