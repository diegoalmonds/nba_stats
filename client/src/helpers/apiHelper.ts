import axios from 'axios';

const BASE_URL = "http://localhost:3000/api"

export default class apiHelper {
    private url: string;

    constructor(baseUrl = BASE_URL) {
        this.url = baseUrl;
    }

    async getPlayerById(id: string) {
        const res = await axios.get(`${this.url}/players/${id}`);
        return res.data;
    }

    async getPlayerByName(name: string) {
        const res = await axios.get(`${this.url}/players/${name}`);
        return res;
    }

    async getPlayerTeam(id: string) {
        const res = await axios.get(`${this.url}/players/team/${id}`);
        return res.data;
    }

    async getPlayerGameLog(params: object) {
        const res = await axios.get(`${this.url}/players/gamelog`, { params });
        return res.data;
    }

    async getPlayerNextGame(params: object) {
        const res = await axios.get(`${this.url}/players/nextgames`, { params });
        return res.data;
    }
}


