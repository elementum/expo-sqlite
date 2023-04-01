import { SqliteAction } from './sqlite-action.js'
import { Client } from '../client.js'
import { QueryModel } from '../query-model.js'

export class CountAction extends SqliteAction {
    constructor(client: Client, public table: string, private query: Partial<QueryModel>) {
        super(client)
    }

    async invoke() {
        const sql = `SELECT COUNT(*) FROM ${this.table} ${this.getWhereStatement(this.query.where)}`
        const results = await this.read(sql)
        const result = results[0]
        return Object.values(result)[0] as number
    }
}
