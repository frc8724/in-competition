import "dotenv/config";

import express from "express";
import cors from "cors";
import http from "http";
import axios from "axios";

const app = express();
const server = http.createServer(app);

const EVENT_KEY = "2022macma";
const TEAM_KEY = "frc8724";

app.use(
  cors({ origin: ["http://localhost:4000", "https://mayhemrobotics.org"] })
);

app.get("/", (req, res) => {
  res.redirect("https://mayhemrobotics.org");
});

app.get("/event", async (req, res) => {
  try {
    const { data: event } = await axios(
      `https://www.thebluealliance.com/api/v3/event/${EVENT_KEY}`,
      {
        headers: { "X-TBA-Auth-Key": process.env.TBA_API_KEY! },
      }
    );

    res.json(event);
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

app.get("/matches", async (req, res) => {
  try {
    const { data: matches } = await axios(
      `https://www.thebluealliance.com/api/v3/team/${TEAM_KEY}/event/${EVENT_KEY}/matches`,
      {
        headers: { "X-TBA-Auth-Key": process.env.TBA_API_KEY! },
      }
    );

    res.json(matches);
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

app.get("/rankings", async (req, res) => {
  try {
    const {
      data: { rankings },
    } = await axios(
      `https://www.thebluealliance.com/api/v3/event/${EVENT_KEY}/rankings`,
      {
        headers: { "X-TBA-Auth-Key": process.env.TBA_API_KEY! },
      }
    );

    res.json(rankings);
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Started on port ${port}!`);
});
