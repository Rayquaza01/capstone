export class Client {
    server: string;
    auth: string;

    constructor() {
        this.server = "http://localhost:3000";
        this.auth = "";
    }

    private async request(endpoint: string, body: string) {
        const req = await fetch(this.server + endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.auth
            },
            body
        });

        return req.json();
    }

    createEntry(entry: Entry[]) {
        this.request("/api/create", JSON.stringify({ entry }))
            .then(console.log);
    }

    updateEntry(entry: UpdateEntry) {
        this.request("/api/update", JSON.stringify({ entry }))
            .then(console.log);
    }

    deleteEntry(id: number[]) {
        this.request("/api/delete", JSON.stringify({ id }))
            .then(console.log);
    }
}
