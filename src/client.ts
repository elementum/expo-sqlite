/* eslint-disable no-underscore-dangle */
import * as SQLite from 'expo-sqlite'

export class ExpoSqliteClient {
    constructor(private sqlite: SQLite.WebSQLDatabase) {}

    read = <T = any>(sql: string, params: any[]): Promise<T> => {
        console.log(sql)
        console.log(params)

        return new Promise((res, rej) => {
            this.sqlite.readTransaction((t) => {
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
    }

    write = <T = SQLite.SQLResultSet>(sql: string, params: any[]): Promise<T> => {
        console.log(sql)
        console.log(params)

        return new Promise((res, rej) => {
            this.sqlite.transaction((t) => {
                t.executeSql(
                    sql,
                    params,
                    (tx, data) => res(data as T),
                    (tx, error) => {
                        rej(error.message)
                        return true
                    }
                )
            })
        })
    }

    closeAsync() {
        return this.sqlite.closeAsync()
    }
}
