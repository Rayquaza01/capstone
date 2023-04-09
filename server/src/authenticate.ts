import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

import { createUser, getUserByUsername, UserAccount } from "./DB";

import { MysqlError } from "mysql";

const JWT_SECRET = "my-secret-key";
const BCRYPT_HASH_ROUNDS = 10;

export async function createNewUser(username: string, password: string): Promise<UserAccount | MysqlError> {
    const hash = await bcrypt.hash(password, BCRYPT_HASH_ROUNDS);
    const newUser = await createUser(username, hash);

    if (!newUser.error) {
        return newUser.results[0] as UserAccount;
    }

    return newUser.error;
}

export async function login(username: string, password: string): Promise<string | null> {
    const user = await getUserByUsername(username);

    if (!user.error) {
        const results = user.results[0] as UserAccount;

        if (await bcrypt.compare(password, results.password)) {
            return jwt.sign({ id: results.id }, JWT_SECRET, {expiresIn: "60d"});
        }

        return null;
    }

    return null;
}

export function authenticate(token: string): JwtPayload | false {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
        return false;
    }
}
