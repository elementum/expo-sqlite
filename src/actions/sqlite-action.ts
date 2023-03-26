/* eslint-disable no-underscore-dangle */
import { DatabaseAction } from '@elementum/db'
import { SQLResultSet } from 'expo-sqlite'
import { Client } from '../client.js'

export abstract class SqliteAction<T = void> extends DatabaseAction<T> {
    constructor(protected client: Client) {
        super()
    }

    read = (sql: string, ...params: any[]): Promise<T> =>
        new Promise((res, rej) => {
            this.client.readTransaction((t) => {
                t.executeSql(
                    sql,
                    params,
                    (tx, data) => res(data.rows._array as T),
                    (tx, error) => {
                        rej(error.message)
                        return true
                    }
                )
            })
        })

    write = (sql: string, ...params: any[]): Promise<SQLResultSet> =>
        new Promise((res, rej) => {
            this.client.transaction((t) => {
                t.executeSql(
                    sql,
                    params,
                    (tx, data) => res(data),
                    (tx, error) => {
                        rej(error.message)
                        return true
                    }
                )
            })
        })
}

export type WriteResult = {
    insertId: number
    rowsAffected: number
}
