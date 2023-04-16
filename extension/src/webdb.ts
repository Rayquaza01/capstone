import Dexie from "dexie";
import { Client } from "./Client";

export enum EntryTypes {
    FOLDER = "folder",
    NOTE = "note"
}

export interface DBEntry {
    /** Unique number identifying this folder */
    id?: number
    /** Unique name identifying this folder. Displayed to user */
    name: string
    /** ID for parent to this folder. 0 if folder is top level */
    parent: number
    /** Color for this folder's icon */
    color: string

    type: EntryTypes

    modified?: Date
}

export interface UpdateEntry {
    id?: number

    name?: string
    parent?: number
    color?: string

    modified?: Date
}

export interface TextEntry {
    id?: number
    text: string

    modified?: Date
}

export class NTDatabase extends Dexie {
    notes!: Dexie.Table<DBEntry, number>;
    noteData!: Dexie.Table<TextEntry, number>;

    client = new Client();

    constructor() {
        super("NTDatabase");

        this.version(1).stores({
            notes: "++id, name, parent, type",
            noteData: "id"
        });
    }

    createEntry(entry: DBEntry) {
        if (!entry.modified) {
            entry.modified = new Date();
        }

        this.notes.put(entry)
            .then(id => {
                this.createText(id);
                this.client.createEntry([{...entry, id}]);
            });

    }

    createText(id: number) {
        const newText = { id, text: "", modified: new Date() };
        console.log("New text is ", newText);

        this.noteData.put(newText);
    }

    updateText(entry: TextEntry) {
        if (entry.id === undefined || entry.id < 0) {
            return;
        }

        if (!entry.modified) {
            entry.modified = new Date();
        }

        this.noteData.update(entry.id, entry);
    }

    updateEntry(entry: UpdateEntry) {
        if (entry.id === undefined || entry.id < 0) return;

        if (!entry.modified) {
            entry.modified = new Date();
        }

        this.notes.update(entry.id, entry);

        this.client.updateEntry(entry);
    }

    deleteEntry(id: number) {
        this.notes.delete(id);
        this.noteData.delete(id);

        this.client.deleteEntry([id]);
    }

    /**
     * Deletes a notebook and all children/grandchildren
     * @param id The id to delete
     */
    deleteFolder(id?: number) {
        if (id && id > -1) {
            this.notes.where({ parent: id }).each(obj => {
                if (obj.type === EntryTypes.FOLDER)
                    this.deleteFolder(obj.id);
            });
            this.deleteEntry(id);
        }
    }

    async syncDown() {
        // const lastSync = new Date(localStorage.getItem("metadataLastSync") ?? 0);
        // const query = await this.client.getEntryByModified(lastSync.toString());

        const idmodified = (await this.notes.toArray()).map(item => {
            return { id: item.id, modified: item.modified };
        });
    }
}

export const Database = new NTDatabase();

// Database.notes.bulkPut([
//     { id: 0, parent: -1, name: "hi", text: "hello", color: "#ff0000", type: EntryTypes.NOTE},
//     { id: 1, parent: -1, name: "yo", text: "world", color: "#ff0000", type: EntryTypes.NOTE},
//     { id: 2, parent: -1, name: "folder test", color: "#ff0000", type: EntryTypes.FOLDER},
//     { id: 3, parent: 2, name: "folder entry", text: "ok", color: "#ff0000", type: EntryTypes.NOTE},
//     { id: 4, parent: 2, name: "subfolder", color: "#ff0000", type: EntryTypes.FOLDER},
//     { id: 5, parent: 4, name: "subfolder entry", text: "ok", color: "#ff0000", type: EntryTypes.NOTE},
// ]);
