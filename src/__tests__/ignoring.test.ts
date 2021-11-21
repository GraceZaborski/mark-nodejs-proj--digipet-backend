import supertest from "supertest";
import { Digipet, setDigipet } from "../digipet/model";
import app from "../server";

/**
 * This file has integration tests for feeding a digipet.
 *
 * It is intended to test two behaviours:
 *  1. feeding a digipet leads to increasing nutrition
 *  2. feeding a digipet leads to decreasing discipline
 */

describe("When a user ignore a digipet repeatedly, its nutrition, discipline and happiness decreses by 10 each time until floor at 0", () => {
    beforeAll(() => {
        // setup: give an initial digipet
        const startingDigipet: Digipet = {
            happiness: 30,
            nutrition: 75,
            discipline: 60,
        };
        setDigipet(startingDigipet);
    });

    test("GET /digipet informs them that they have a digipet with expected stats", async () => {
        const response = await supertest(app).get("/digipet");
        expect(response.body.message).toMatch(/your digipet/i);
        expect(response.body.digipet).toHaveProperty("nutrition", 75);
    });

    test("1st GET /digipet/feed informs them about the feed and shows increased nutrition for digipet", async () => {
        const response = await supertest(app).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("nutrition", 65);
    });

    test("2nd GET /digipet/feed shows continued stats change", async () => {
        const response = await supertest(app).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("nutrition", 55);
    });

    test("3rd GET /digipet/feed shows nutrition hitting a ceiling of 100", async () => {
        const response = await supertest(app).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("nutrition", 45);
    });

    test("4th GET /digipet/feed shows no further increase in nutrition", async () => {
        const response = await supertest(app).get("/digipet/ignore");
        expect(response.body.digipet).toHaveProperty("nutrition", 35);
        expect(response.body.digipet).toHaveProperty("happiness", 0);
    });
});
