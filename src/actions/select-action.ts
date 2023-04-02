import { ExpoSqliteClient } from '../client.js'
import { QueryModel } from '../query-model.js'
import { SqliteAction } from './sqlite-action.js'

export class SelectAction<T> extends SqliteAction<T[]> {
    constructor(client: ExpoSqliteClient, private index: string, private model: Partial<QueryModel>) {
        super(client)
    }

    async invoke() {
        const select = this.getSelectColumns(this.model.columns)
        const where = this.getWhereStatement(this.model.where ?? [])
        const order = this.getOrderStatement(this.model.orderBy)
        const offset = typeof this.model.skip === 'number' ? ` OFFSET ${this.model.skip}` : ''
        const limit = typeof this.model.take === 'number' ? ` LIMIT ${this.model.take}` : ''
        const sql = `SELECT ${select} FROM ${this.index}${where.statement}${order}${offset}${limit}`

        const rows = await this.read(sql, where.params)
        return rows.map((r) => this.model.selector(r) as T)
    }
}
