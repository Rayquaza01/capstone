import { List } from "material-ui";
import { DBEntry, UpdateEntry } from "./webdb";

interface ListResponse {
    error: null
    total: number
    offset: number
    entry: DBEntry[];
}

interface EntryNeedsUpdateResponse {
    error: null,
    entry: DBEntry | false
}

export class Client {
    server: string;
    auth: string;
    limit: number;

    constructor() {
        this.server = "http://localhost:3000";
        this.auth = "";

        this.limit = 50;

        console.log("Client init");
    }

    private async request(endpoint: string, body: string) {
        console.log("Requesting ", endpoint, body);
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

    createEntry(entry: DBEntry[]) {
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

    getEntryNeedsUpdate(id: number, modified: string): Promise<EntryNeedsUpdateResponse> {
        return this.request("/api/getNeedUpdate", JSON.stringify({
            id,
            modified
        }));
    };

    getEntryByModified(modifiedSince: string, offset?: number): Promise<ListResponse> {
        return this.request("api/list", JSON.stringify({
            modifiedSince,
            limit: this.limit,
            offset: offset ?? 0
        })) as Promise<ListResponse>;
    }

    getEntryByParent(parent: number) {
        return;
    }

    getEntryByID(id: number) {
        return;
    }

    getTextByModified(modifiedSince: string) {
        return;
    }

    getTextByID(id: number) {
        return;
    }

    updateText(id: number, text: string) {
        return;
    }
}
