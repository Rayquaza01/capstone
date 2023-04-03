export interface Entry {
    id: number
    parent: number
    name: string
    color: string
    type: string
    modified: string | Date
}

export interface TextEntry {
    id: number,
    text: string
}

export interface UpdateEntry {
    id: number
    name?: string
    color?: string
    modified: string | Date
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
    entry: Entry | Entry[]
}

export interface UpdateBody {
    auth: string
    entry: UpdateEntry
}

export interface DeleteBody {
    auth: string
    id: number | number[]
}

export interface ListBody {
    auth: string
    parent?: number
    offset?: number
    limit?: number
    modifiedSince?: Date
    type: "metadata" | "text" | "all"
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
