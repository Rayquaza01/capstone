import Dexie from "dexie";

export interface Notebook {
    /** Unique number identifying this folder */
    id?: number
    /** Unique name identifying this folder. Displayed to user */
    name: string
    /** ID for parent to this folder. 0 if folder is top level */
    parent: number
    /** Color for this folder's icon */
    color: string
}

export interface Note {
    /** Unique number identifying this note */
    id?: number
    /** Unique name identifying this note. Displayed to user */
    name: string
    /** ID for parent to this folder */
    parent: number
    /** Text content for note */
    text: string;
}

export class NTDatabase extends Dexie {
    notebooks!: Dexie.Table<Notebook, number>;
    notes!: Dexie.Table<Note, number>;

    constructor() {
        super("NTDatabase");

        this.version(1).stores({
            notebooks: "++id, &name, parent",
            notes: "++id, &name, parent"
        });
    }
}

export const Database = new NTDatabase();

Database.notes.bulkPut([
    { id: 0, parent: 0, name: "hi", text: "hello" },
    { id: 1, parent: 0, name: "yo", text: "world" }
]);
