/* eslint-disable no-underscore-dangle */
import { DatabaseAction } from '@elementum/db'
import { Client } from '../client.js'

export abstract class SqliteAction<T = void> extends DatabaseAction<T> {
    constructor(public client: Client) {
        super()
    }

    read = (sql: string, ...params: any[]): Promise<T> => this.client.read(sql, params)

    write = (sql: string, ...params: any[]) => this.client.write(sql, params)
}

export type WriteResult = {
    insertId: number
    rowsAffected: number
}
