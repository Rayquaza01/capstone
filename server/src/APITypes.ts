function isColor(color: string): boolean {
    return (/#[a-fA-F0-9]{6}/).test(color);
}

export interface Entry {
    id: number
    parent: number
    name: string
    color: string
    type: string
    modified: string | Date
}

export function isEntry(e?: Record<string, any>): e is Entry {
    if (!e) return false;

    return typeof e.id === "number" &&
        typeof e.parent === "number" &&
        (typeof e.name === "string" && e.name.length > 0) &&
        (typeof e.color === "string" && isColor(e.color)) &&
        typeof e.modified === "string";
}

export interface TextEntry {
    id: number,
    text: string
}

export function isTextEntry(e?: Record<string, any>): e is TextEntry {
    if (!e) return false;

    return typeof e.id === "number" &&
        typeof e.text === "string";
}

export interface UpdateEntry {
    id: number
    name?: string
    color?: string
    modified: string | Date
}

export function isUpdateEntry(e?: Record<string, any>): e is UpdateEntry {
    if (!e) return false;

    if ("name" in e) {
        if (!(typeof e.name === "string")) return false;
    }

    if ("color" in e) {
        if (!(typeof e.color === "string" && isColor(e.color))) return false;
    }

    return typeof e.id === "string" &&
        typeof e.modified === "string";
}

export interface CreateAccountBody {
    user: string
    password: string
}

export interface AuthenticateBody {
    user: string
    password: string
}

export interface CreateBody {
    auth: string
    entry: Entry[]
}

export function isCreateBody(e?: Record<string, any>): e is CreateBody {
    if (!e) return false;

    return typeof e.auth === "string" &&
        (Array.isArray(e.entry) && e.entry.every(isEntry));
}

export interface UpdateBody {
    auth: string
    entry: UpdateEntry
}

export function isUpdateBody(e?: Record<string, any>): e is UpdateBody {
    if (!e) return false;

    return typeof e.auth === "string" &&
        isUpdateEntry(e.entry);
}

export interface DeleteBody {
    auth: string
    id: number[]
}

export function isDeleteBody(e: Record<string, any>): e is DeleteBody {
    return typeof e.auth === "string" &&
        (Array.isArray(e.id) && e.id.every(i => typeof i === "number"));
}

export interface ListBody {
    auth: string
    parent?: number
    offset?: number
    limit?: number
    modifiedSince?: Date
}

export interface ListParentBody {
    auth: string
    parent: number
    offset?: number
    limit?: number
}

export interface ListModifiedBody {
    auth: string
    modifiedSince: number
    offset?: number
    limit?: number
}

export interface ListTextModifiedBody {
    auth: string
    modifiedSince: number
    offset?: number
    limit?: number
}

export interface GetTextBody {
    auth: string
    id: number
}

export interface SetTextBody {
    auth: string
    id: number
    text: string
}
