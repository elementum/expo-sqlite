import { QueryModel } from '@elementum/expo-sqlite'
import { Client } from './client.js'

export class BatchUpdater<T = any> {
    constructor(private client: Client, private query: QueryModel, private table: string) {}

    private setters: Record<string, string> = {}

    set<TKey extends keyof T>(key: TKey, value: string) {
        this.setters[key as string] = value
        return this
    }

    async execute() {
        let sql = `UPDATE ${this.table} SET `
        sql += Object.entries(this.setters)
            .map((e) => `${e[0]} = ${e[1]}`)
            .join(', ')

        if (this.query.where) {
            sql += ` WHERE ${this.query.where.join(' AND ')}`
        }

        await this.client.write(sql)
    }
}
