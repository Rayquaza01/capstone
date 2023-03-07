import Dexie from "dexie";

export enum EntryTypes {
    FOLDER = "folder",
    NOTE = "note"
}

export interface Notebook {
    /** Unique number identifying this folder */
    id?: number
    /** Unique name identifying this folder. Displayed to user */
    name: string
    /** ID for parent to this folder. 0 if folder is top level */
    parent: number
    /** Color for this folder's icon */
    color: string

    type: EntryTypes.FOLDER
}

export interface Note {
    /** Unique number identifying this note */
    id?: number
    /** Unique name identifying this note. Displayed to user */
    name: string
    /** ID for parent to this folder */
    parent: number
    /** Text content for note */
    text: string
    /** Color for this note's icon */
    color: string

    type: EntryTypes.NOTE
}

export class NTDatabase extends Dexie {
    notes!: Dexie.Table<Note | Notebook, number>;

    constructor() {
        super("NTDatabase");

        this.version(1).stores({
            notes: "++id, name, parent, type"
        });
    }

    // async getTree() {
    //     const tree = this.notes.where({ type: EntryTypes.FOLDER })
    // }
}

export const Database = new NTDatabase();

Database.notes.bulkPut([
    { id: 0, parent: -1, name: "hi", text: "hello", color: "#ff0000", type: EntryTypes.NOTE},
    { id: 1, parent: -1, name: "yo", text: "world", color: "#ff0000", type: EntryTypes.NOTE},
    { id: 2, parent: -1, name: "folder test", color: "#ff0000", type: EntryTypes.FOLDER},
    { id: 3, parent: 2, name: "folder entry", text: "ok", color: "#ff0000", type: EntryTypes.NOTE},
    { id: 4, parent: 2, name: "subfolder", color: "#ff0000", type: EntryTypes.FOLDER},
    { id: 5, parent: 4, name: "subfolder entry", text: "ok", color: "#ff0000", type: EntryTypes.NOTE},
]);
