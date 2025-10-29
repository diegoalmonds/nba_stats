import axios from 'axios';

const BASE_URL = "http://localhost:3000/api"

export default class apiHelper {
    private url: string;

    constructor(baseUrl = BASE_URL) {
        this.url = baseUrl;
    }

    async getPlayers() {
        const res = await axios.get(`${this.url}/players`);
        return res.data;
    }
}


