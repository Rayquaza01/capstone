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
        return this.request("/api/create", JSON.stringify({ entry }))
    }

    createTextEntry(entry: TextEntry[]) {
        return this.request("/api/createText", JSON.stringify({ entry }));
    }

    updateEntry(entry: UpdateEntry) {
        return this.request("/api/update", JSON.stringify({ entry }))
    }

    updateTextEntry(entry: TextEntry) {
        return this.request("/api/updateText", JSON.stringify({ entry }));
    }

    deleteEntry(id: number[]) {
        return this.request("/api/delete", JSON.stringify({ id }))
    }

    deleteTextEntry(id: number[]) {
        return this.request("/api/deleteText", JSON.stringify({ id }));
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
