import "dotenv/config";

import { join } from "path";

import express from "express";
import cors from "cors";
import http from "http";
import axios from "axios";
import { DateTime } from "luxon";

const app = express();
const server = http.createServer(app);

const TEAM_KEY = process.env.TEAM_KEY || "frc8724";

app.use(
  cors({ origin: ["http://localhost:4000", "https://mayhemrobotics.org"] })
);

app.get("/", (req, res) => {
  res.redirect("https://mayhemrobotics.org");
});

app.get("/currentEvent", async (req, res) => {
  const now = DateTime.now();

  try {
    const { data: events } = await axios(
      `https://www.thebluealliance.com/api/v3/team/${TEAM_KEY}/events/${now.year}`,
      {
        headers: { "X-TBA-Auth-Key": process.env.TBA_API_KEY! },
      }
    );

    const event = events.find((e: any) => {
      const start = DateTime.fromSQL(e.start_date).startOf("day");
      const end = DateTime.fromSQL(e.end_date).endOf("day");

      return now > start && now < end;
    });

    if (!event) throw null;

    res.json(event);
  } catch (e) {
    res.status(404).end();
  }
});

app.get("/event/:event/matches", async (req, res) => {
  try {
    const { data: matches } = await axios(
      `https://www.thebluealliance.com/api/v3/team/${TEAM_KEY}/event/${req.params.event}/matches/simple`,
      {
        headers: { "X-TBA-Auth-Key": process.env.TBA_API_KEY! },
      }
    );

    res.json(matches);
  } catch (e) {
    res.status(404).end();
  }
});

app.get("/event/:event/rankings", async (req, res) => {
  try {
    const {
      data: { rankings },
    } = await axios(
      `https://www.thebluealliance.com/api/v3/event/${req.params.event}/rankings`,
      {
        headers: { "X-TBA-Auth-Key": process.env.TBA_API_KEY! },
      }
    );

    res.json(rankings);
  } catch (e) {
    res.status(404).end();
  }
});

app.get("/avatar/:team", async (req, res) => {
  try {
    const { data } = await axios(
      `https://www.thebluealliance.com/api/v3/team/frc${
        req.params.team
      }/media/${new Date().getFullYear()}`,
      {
        headers: { "X-TBA-Auth-Key": process.env.TBA_API_KEY! },
      }
    );

    const avatar = data.find((m: { type: string }) => m.type === "avatar");

    if (!avatar) {
      throw null;
    }

    res
      .contentType("image/png")
      .send(Buffer.from(avatar.details.base64Image, "base64"));
  } catch (e) {
    res.contentType("image/png").sendFile(join(__dirname, "../first.png"));
  }
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Started on port ${port}!`);
});
