/* eslint-disable no-underscore-dangle */
import { DatabaseAction } from '@elementum/db'
import { ExpoSqliteClient } from '../client.js'

export abstract class SqliteAction<T = any> extends DatabaseAction<T> {
    constructor(public client: ExpoSqliteClient) {
        super()
    }

    read = (sql: string, params: any[]): Promise<T> => this.client.read(sql, params)

    write = (sql: string, params: any[]) => this.client.write(sql, params)
}

export type WriteResult = {
    insertId: number
    rowsAffected: number
}
