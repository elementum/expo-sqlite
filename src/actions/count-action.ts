import { SqliteAction } from './sqlite-action.js'
import { ExpoSqliteClient } from '../client.js'
import { QueryModel } from '../query-model.js'

export class CountAction extends SqliteAction {
    constructor(client: ExpoSqliteClient, public table: string, private query: Partial<QueryModel>) {
        super(client)
    }

    async invoke() {
        const whereStatement = this.getWhereStatement(this.query.where)
        const sql = `SELECT COUNT(*) FROM ${this.table} ${whereStatement.statement}`
        const results = await this.read(sql, whereStatement.params)
        const result = results[0]
        return Object.values(result)[0] as number
    }
}
