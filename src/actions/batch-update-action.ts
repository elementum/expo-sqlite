import { QueryModel } from '@elementum/expo-sqlite'
import { Client } from '../client.js'
import { SqliteAction } from './sqlite-action.js'
import { getValue } from '../value-factory.js'

export class BatchUpdateAction<T = any> extends SqliteAction<T> {
    constructor(client: Client, private query: Partial<QueryModel>, private table: string) {
        super(client)
    }

    private setters: Record<string, any> = {}

    set<TKey extends keyof T>(key: TKey, value: T[TKey]) {
        this.setters[key as string] = value
        return this
    }

    async invoke() {
        let sql = `UPDATE ${this.table} SET `
        sql += Object.entries(this.setters)
            .map((e) => `${e[0]} = ${getValue(e[1])}`)
            .join(', ')

        if (this.query.where) {
            sql += ` WHERE ${this.query.where.join(' AND ')}`
        }

        await this.client.write(sql)
        return null
    }
}
