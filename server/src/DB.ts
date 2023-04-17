import mysql from "mysql";
import { Entry, UpdateEntry, ListParentBody, ListModifiedBody } from "./APITypes";

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

async function getConnection(): Promise<mysql.PoolConnection> {
    return new Promise(resolve => {
        pool.getConnection((err, connection) => {
            resolve(connection);
        })
    })
}

async function queryWithConnection(options: mysql.QueryOptions | string, connection: mysql.PoolConnection): Promise<QueryResponse> {
    return new Promise(resolve => {
        connection.query(options, (error, results, fields) => {
            const response = {error, results, fields}
            resolve(response);
        })
    })
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
        return [user_id, i.id, i.parent, i.name, i.color, i.type, new Date(i.modified)];
    });

    const insertText = entries.filter(i => i.type === "note").map(i => [i.id, ""]);

    const textStatement = mysql.format("INSERT INTO data (id, text) VALUES ?", [insertText]);
    query(textStatement);

    const statement = mysql.format("INSERT INTO metadata (user_id, id, parent, name, color, type, modified) VALUES ?;", [insertValues]);
    console.log(statement);
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

    if (typeof entry.parent === "number" && entry.parent > -2) {
        update.parent = entry.parent;
    }

    const statement = mysql.format("UPDATE metadata SET ? WHERE user_id = ? AND id = ?;", [update, user_id, entry.id]);
    console.log(statement);
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

export async function getParentEntry(user_id: number, opts: ListParentBody) {
    const limit = opts.limit;

    let statement = "";
    if (opts.offset !== undefined) {
        statement = mysql.format("SELECT * FROM metadata WHERE user_id = ? AND id > ? AND parent = ? LIMIT ?;", [user_id, opts.offset, opts.parent, limit]);
    } else {
        statement = mysql.format("SELECT * FROM metadata WHERE user_id = ? AND parent = ? LIMIT ?;", [user_id, opts.parent, limit]);
    }

    return query(statement);
}

export async function getModifiedEntry(user_id: number, opts: ListModifiedBody) {
    const limit = opts.limit;

    const modifiedSince = new Date(opts.modifiedSince);

    let statement = "";
    if (opts.offset !== undefined) {
        statement = mysql.format("SELECT * FROM metadata WHERE user_id = ? AND id > ? AND modified > ? LIMIT ?;", [user_id, opts.offset, modifiedSince, limit]);
    } else {
        statement = mysql.format("SELECT * FROM metadata WHERE user_id = ? AND modified > ? LIMIT ?;", [user_id, modifiedSince, limit]);
    }

    return query(statement);
}

export async function getEntryById(user_id: number, id: number) {
    const statement = mysql.format("SELECT * FROM metadata WHERE user_id = ? AND id = ?;", [user_id, id]);
    return query(statement);
}

export async function getTextEntry(user_id: number, id: number) {
    const statement = mysql.format("SELECT * FROM data WHERE user_id = ? AND id = ?;", [user_id, id]);
    return query(statement);
}

export interface ResolveInfo {
    toUpload: number[]
    toDownload: number[]
    toDelete: number[]
}

export async function resolveSync(user_id: number, entries: { id: number, modified: string}[]): Promise<ResolveInfo> {
    const resolve: ResolveInfo = {
        toUpload: [],
        toDownload: [],
        toDelete: []
    };

    const conn = await getConnection();

    // create temporary tables
    await Promise.all([
        queryWithConnection("CREATE TEMPORARY TABLE clientdata (id INT, modified TIMESTAMP);", conn),
        queryWithConnection("CREATE TEMPORARY TABLE serverdata (id INT, modified TIMESTAMP);", conn)
    ]);

    const loadClientDataStatement = mysql.format("INSERT INTO clientdata (id, modified) VALUES ?;", [entries.map(i => [i.id, new Date(i.modified)])]);
    // console.log("Client Data Statement", loadClientDataStatement);
    const loadServerDataStatement = mysql.format("INSERT INTO serverdata (id, modified) (SELECT id, modified FROM metadata WHERE user_id = ?);", [user_id]);
    // console.log("Server Data Statement", loadServerDataStatement);

    const [clientData, serverData] = await Promise.all([
        queryWithConnection(loadClientDataStatement, conn),
        queryWithConnection(loadServerDataStatement, conn)
    ])

    // console.log("Client Data", clientData.error, clientData.results);
    // console.log("Server Data", serverData.error, serverData.results);

    const [clientIsNewer, serverIsNewer, clientIsMissing, serverIsMissing] = await Promise.all([
        queryWithConnection("SELECT id FROM clientdata WHERE modified > (SELECT modified FROM serverdata WHERE id = clientdata.id);", conn),
        queryWithConnection("SELECT id FROM clientdata WHERE modified < (SELECT modified FROM serverdata WHERE id = clientdata.id);", conn),
        queryWithConnection("SELECT id FROM serverdata WHERE id NOT IN (SELECT id FROM clientdata);", conn),
        queryWithConnection("SELECT id FROM clientdata WHERE id NOT IN (SELECT id FROM serverdata);", conn)
    ])

    const [cd, sd] = await Promise.all([
        queryWithConnection("SELECT * FROM clientdata;", conn),
        queryWithConnection("SELECT * FROM serverdata;", conn)
    ]);
    console.log(cd.results, sd.results);

    // console.log("Client Newer", clientIsNewer.error);
    // console.log("Server Newer", serverIsNewer.error);
    // console.log("Client Missing", clientIsMissing.error);
    // console.log("Server Missing", serverIsMissing.error);

    resolve.toUpload = clientIsNewer.results.map(item => item.id);
    resolve.toDownload = [...clientIsMissing.results.map(item => item.id), ...serverIsNewer.results.map(item => item.id)];
    resolve.toDelete = serverIsMissing.results.map(item => item.id);

    // console.log(resolve);

    await Promise.all([
        queryWithConnection("DROP TABLE clientdata;", conn),
        queryWithConnection("DROP TABLE serverdata;", conn)
    ]);

    conn.release();
    return resolve as ResolveInfo;
}

// USER ACCOUNTS

export interface UserAccount {
    id: number
    username: string
    password: string
}

export async function createUser(username: string, password: string) {
    const statement = mysql.format("INSERT INTO users SET ?;", [{username, password}]);
    return query(statement);
}

export async function getUserByUsername(username: string) {
    const statement = mysql.format("SELECT * FROM user WHERE username = ?;", [username]);
    return query(statement);
}

export async function getUser(user_id: number) {
    const statement = mysql.format("SELECT * FROM user WHERE id = ?;", [user_id]);
    return query(statement);
}
