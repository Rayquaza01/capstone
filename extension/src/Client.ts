import { List } from "material-ui";
import { DBEntry, TextEntry, UpdateEntry } from "./webdb";

export interface ResolveSyncResponse {
    toUpload: number[]
    toDownload: number[]
    toDelete: number[]
}

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

    createTextEntry(entry: TextEntry[]) {
        this.request("/api/createText", JSON.stringify({ entry }));
    }

    updateEntry(entry: UpdateEntry) {
        this.request("/api/update", JSON.stringify({ entry }))
            .then(console.log);
    }

    updateTextEntry(entry: TextEntry) {
        this.request("/api/updateText", JSON.stringify({ entry }));
    }

    deleteEntry(id: number[]) {
        this.request("/api/delete", JSON.stringify({ id }))
            .then(console.log);
    }

    deleteTextEntry(id: number[]) {
        this.request("/api/deleteText", JSON.stringify({ id }));
    }

    getTextEntriesByIDs(ids: number[]) {
        return this.request("/api/listTextByIDs", JSON.stringify({ ids }));
    }

    getEntriesByIDs(ids: number[]) {
        return this.request("/api/listByIDs", JSON.stringify({ ids }));
    }

    resolveSync(entries: {id: number, modified: string}[], mode: string): Promise<ResolveSyncResponse> {
        return this.request("/api/resolveSync", JSON.stringify({ entries, mode }));
    }
}
