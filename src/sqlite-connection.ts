import { DatabaseConnection } from '@elementum/db'
import { MaybePromise } from '@elementum/toolkit'
import * as SQLite from 'expo-sqlite'
import { ExpoSqliteClient } from './client.js'
import { ExpoSqliteProvider } from './sqlite-provider.js'

type Options = {
    database: string
}

export class SqliteConnection extends DatabaseConnection<ExpoSqliteProvider> {
    client: ExpoSqliteClient

    constructor(private options: Options) {
        super()
    }

    async connect() {
        this.client = new ExpoSqliteClient(SQLite.openDatabase(this.options.database))
        return new ExpoSqliteProvider(this.client)
    }

    disconnect(): MaybePromise<void> {
        return this.client.closeAsync()
    }
}
