import mysql from "mysql";
import { Entry, UpdateEntry } from "./APITypes";

const pool = mysql.createPool({
    connectionLimit: 10,
    user: "notetaker",
    password: "password",
    host: "localhost",
    database: "notetaker"
});

interface QueryResponse {
    error: mysql.MysqlError | null,
    results?: any,
    fields?: mysql.FieldInfo[]
}

function query(options: mysql.QueryOptions | string): Promise<QueryResponse> {
    return new Promise(resolve => {
        pool.query(options, (error, results, fields) => {
            const response = { error, results, fields };
            resolve(response);
        });
    });
}

export function createEntry(user_id: number, entries: Entry[]): Promise<QueryResponse> {
    const insertValues = entries.map(i => {
        return [user_id, i.id, i.parent, i.name, i.color, i.type, i.modified];
    });

    const statement = mysql.format("INSERT INTO metadata (user_id, id, parent, name, color, type, modified) VALUES ?;", insertValues);
    return query(statement);
}


export function updateEntry(user_id: number, entry: UpdateEntry): Promise<QueryResponse> {
    const update: Partial<UpdateEntry> = { modified: new Date(entry.modified) };
    if (entry.color) {
        update.color = entry.color;
    }

    if (entry.name) {
        update.name = entry.name;
    }

    const statement = mysql.format("UPDATE metadata SET ? WHERE user_id = ? AND id = ?;", [update, user_id, entry.id]);
    return query(statement);
}

export async function deleteEntry(user_id: number, ids: number[]): Promise<QueryResponse[]> {
    let notes: number[] = [];

    const typeStatement = mysql.format("SELECT id FROM metadata WHERE user_id = ? AND id IN (?) AND type = ?;", [user_id, ids, "note"]);
    const types = await query(typeStatement);

    if (!types.error) {
        const results = types.results as {id: number}[];
        notes = results.map(item => item.id);
    }

    const ret: Promise<QueryResponse>[] = [];

    const deleteMetadataStatement = mysql.format("DELETE FROM metadata WHERE user_id = ? AND id IN (?);", [user_id, ids]);
    ret.push(query(deleteMetadataStatement));

    if (notes.length > 0) {
        const deleteNoteStatement = mysql.format("DELETE FROM data WHERE user_id = ? AND id IN (?);", [user_id, notes]);
        ret.push(query(deleteNoteStatement));
    }

    return Promise.all(ret);
}

export async function
