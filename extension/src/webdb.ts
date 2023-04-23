import Dexie from "dexie";
import { Client } from "./Client";

export enum EntryTypes {
    FOLDER = "folder",
    NOTE = "note"
}

enum SyncActions {
    CREATE,
    DELETE
}

interface SyncToDoEntry {
    id: number,
    action: SyncActions
}

export interface DBEntry {
    /** Unique number identifying this folder */
    id: number
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
    id: number
    contents: string

    modified?: Date
}

export class NTDatabase extends Dexie {
    notes!: Dexie.Table<DBEntry, number>;
    noteData!: Dexie.Table<TextEntry, number>;
    syncToDo!: Dexie.Table<SyncToDoEntry, number>;

    online: boolean = true;

    client = new Client();

    constructor() {
        super("NTDatabase");

        this.version(1).stores({
            notes: "++id, name, parent, type",
            noteData: "id",
            syncToDo: "id, action"
        });
    }

    // METADATA

    createEntry(entry: DBEntry) {
        if (!entry.modified) {
            entry.modified = new Date();
        }

        this.notes.put(entry)
            .then(id => {
                this.createText(id);

                if (this.online) {
                    this.client.createEntry([{...entry, id}]);
                } else {
                    this.syncToDo.put({id, action: SyncActions.CREATE});
                }
            });
    }

    updateEntry(entry: UpdateEntry) {
        if (entry.id === undefined || entry.id < 0) return;

        if (!entry.modified) {
            entry.modified = new Date();
        }

        this.notes.update(entry.id, entry);

        if (this.online) {
            this.client.updateEntry(entry);
        }
    }

    deleteEntry(id: number) {
        this.notes.delete(id);
        this.noteData.delete(id);

        if (this.online) {
            this.client.deleteEntry([id]);
            this.client.deleteTextEntry([id]);
        } else {
            this.syncToDo.put({id, action: SyncActions.DELETE});
        }
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

    // TEXT

    createText(id: number) {
        const newText = { id, contents: "", modified: new Date() };

        this.noteData.put(newText);

        if (this.online) {
            this.client.createTextEntry([newText]);
        }
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

    sync() {
        this.uploadToDo();

        this.resolveSync();
        this.resolveSyncText();
    }

    async uploadToDo() {
        // get ids for entries to upload
        const toUpload = (await this.syncToDo.where({ action: SyncActions.CREATE }).toArray()).map(item => item.id);
        // get the actual entries themselves
        const toUploadEntries = await this.notes.bulkGet(toUpload) as DBEntry[];
        // get the text entries that also need to be created
        const toUploadTextEntries = await this.noteData.bulkGet(
                toUploadEntries
                    .filter(item => item.type === EntryTypes.NOTE)
                    .map(item => item.id as number)
        ) as TextEntry[];
        if (toUploadEntries.length > 0) {
            this.client.createEntry(toUploadEntries);
        }
        if (toUploadTextEntries.length > 0) {
            this.client.createTextEntry(toUploadTextEntries);
        }

        const toDelete = (await this.syncToDo.where({ action: SyncActions.DELETE }).toArray()).map(item => item.id);
        if (toDelete.length > 0) {
            this.client.deleteEntry(toDelete);
            this.client.deleteTextEntry(toDelete);
        }
    }

    async resolveSyncText() {
        const notes = await this.noteData.toArray();
        const entries = notes.map(item => {
            return {id: item.id as number, modified: (item.modified as Date).toString()}
        });

        const resolve = await this.client.resolveSync(entries, "data");

        // delete notes that were deleted on server
        this.noteData.bulkDelete(resolve.toDelete);

        if (resolve.toDownload.length > 0) {
            this.client.getTextEntriesByIDs(resolve.toDownload)
                .then(toDownload => this.noteData.bulkPut(toDownload.entries));
        }

        if (resolve.toUpload.length > 0) {
            this.noteData.bulkGet(resolve.toUpload)
                .then(toUpload => toUpload.forEach(item => this.client.updateTextEntry(item as TextEntry)));
        }
    }

    async resolveSync() {
        const notes = await this.notes.toArray();
        const entries = notes.map(item => {
            return {id: item.id as number, modified: (item.modified as Date).toString()}
        });

        const resolve = await this.client.resolveSync(entries, "metadata");

        // delete notes that were deleted on server
        this.notes.bulkDelete(resolve.toDelete);

        if (resolve.toDownload.length > 0) {
            this.client.getEntriesByIDs(resolve.toDownload)
                .then(toDownload => this.notes.bulkPut(toDownload.entries));
        }

        if (resolve.toUpload.length > 0) {
            this.notes.bulkGet(resolve.toUpload)
                .then(toUpload => toUpload.forEach(item => this.client.updateEntry(item as DBEntry)));
        }
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
