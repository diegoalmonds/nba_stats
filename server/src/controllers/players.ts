import type { Request, Response } from "express";
import axios from 'axios';
import fs from 'fs';
import path from 'path';

interface Player {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
}

interface GameLog {
    player_id: number,
    opponent_team_id: number | null,
    season: string,
    season_type: string | null,
    location: number | null,
    last_n_games: number | null
}


const playersPath = path.resolve("data/players.json");
const players: Player[] = JSON.parse(fs.readFileSync(playersPath, "utf8"));

export function getPlayerById(request: Request<{id: string}>, response: Response) {
    const { id } = request.params;

    const player = players.find(p => p.id === parseInt(id));

    if (!player) {
        return response.status(404).json({ error: "Player not found" });
    }

    response.json(player);
}

export async function getPlayerTeam(request: Request<{id: string}>, response: Response) {
    const { id } = request.params;

    const url = new URL("https://stats.nba.com/stats/commonplayerinfo");
    url.searchParams.append("PlayerID", String(id ?? ""));

    try {
        const res = await axios.get(
            url.toString(), {
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "Accept-Language": "en-US,en;q=0.9",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
                    "Referer": "https://www.nba.com/",
                    "Origin": "https://www.nba.com",
                    "Connection": "keep-alive",
                }
            }
        )

        const resultSet = res.data.resultSets[0]
        const teamInfo = resultSet.rowSet.map((row: any[]) =>
            Object.fromEntries(resultSet.headers.map((header: string, i: number) => [header.toLowerCase(), row[i]]))
        );

        response.json(teamInfo);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Failed to fetch player team" });
    }
}

export function getPlayerByName(request: Request<{name: string}>, response: Response) {
    const { name } = request.params;

    const player = players.find(p => p.full_name === name);

    if (!player) {
        return response.status(404).json({ error: "Player not found" });
    }

    response.json(player);
}

export async function getBasicGameLog(request: Request<GameLog>, response: Response) {
    const { id, season, season_type } = request.query;
    
    try {
        const res = await axios.get(
            `https://stats.nba.com/stats/playergamelog?DateFrom=&DateTo=&LeagueID=&PlayerID=${id}&Season=${season}&SeasonType=${season_type}`,
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
        response.json(res.data)
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Failed to fetch basic game log" });
    }
}

export async function getGameLog(request: Request, response: Response) {
    const { id, opponent_team_id, season, season_type, location, last_n_games } = request.query;
    
    try {
        const url = new URL("https://stats.nba.com/stats/playergamelogs");

        url.searchParams.append("PlayerID", String(id ?? ""));
        url.searchParams.append("Season", String(season ?? ""));
        url.searchParams.append("SeasonType", String(season_type ?? ""));
        url.searchParams.append("Location", String(location ?? ""));
        url.searchParams.append("OpposingTeamID", String(opponent_team_id ?? ""));

        ["DateFrom","DateTo","GameSegment","LeagueID","MeasureType","Month","Outcome","PORound","PerMode","Period","SeasonSegment","ShotClockRange","TeamID","VsConference","VsDivision"]
            .forEach(p => url.searchParams.append(p, ""));

        const res = await axios.get(url.toString(), {
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "en-US,en;q=0.9",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
                "Referer": "https://www.nba.com/",
                "Origin": "https://www.nba.com",
                "Connection": "keep-alive",
            }
        });

        const resultSet = res.data.resultSets[0]
        const gameLog = resultSet.rowSet.map((row: any[]) =>
            Object.fromEntries(resultSet.headers.map((header: string, i: number) => [header.toLowerCase(), row[i]]))
        );

        response.json(gameLog)
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Failed to fetch basic game log" });
    }
}

export async function getPlayerNextGame(request: Request, response: Response) {
    const { id, season, season_type } = request.query;
    try {
        const url = new URL("https://stats.nba.com/stats/playernextngames");

        if (id) url.searchParams.append("PlayerID", id as string);
        if (season) url.searchParams.append("Season", season as string);
        if (season_type) url.searchParams.append("SeasonType", season_type as string);
        // if (next_n_games) url.searchParams.append("NumberOfGames", next_n_games as string);
        url.searchParams.append("NumberOfGames", "1");
        url.searchParams.append("LeagueID", "00");

        const res = await axios.get(url.toString(), {
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "en-US,en;q=0.9",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
                "Referer": "https://www.nba.com/",
                "Origin": "https://www.nba.com",
                "Connection": "keep-alive",
            }
        })

        const resultSet = res.data.resultSets[0]
        const nextGame = resultSet.rowSet.map((row: any[]) =>
            Object.fromEntries(resultSet.headers.map((header: string, i: number) => [header.toLowerCase(), row[i]]))
        );

        response.json(nextGame)
    } catch (error) {
        console.error(error)
        response.status(500).json({ message: "Failed to fetch next games" })
    }
}