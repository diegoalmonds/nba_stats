import type { Request, Response } from "express";
import axios from 'axios';

export async function getPlayers(request: Request, response: Response) {
    try {
        const res = await axios.get(
            "https://stats.nba.com/stats/commonallplayers?IsOnlyCurrentSeason=0&LeagueID=00&Season=2025-26",
            {
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "Accept-Language": "en-US,en;q=0.9",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
                    "Referer": "https://www.nba.com/",
                    "Origin": "https://www.nba.com",
                    "Connection": "keep-alive",
                },
            }
        );
        response.json(res.data);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Failed to fetch players" });
    }
}

export async function getPlayer(request: Request, response: Response) {
    response.send({});
}
