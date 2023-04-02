import { ExpoSqliteClient } from '../client.js'
import { QueryModel } from '../query-model.js'
import { SqliteAction } from './sqlite-action.js'

import translator from '../sql-translator.js'

export class SelectAction<T> extends SqliteAction<T[]> {
    constructor(client: ExpoSqliteClient, private table: string, private model: Partial<QueryModel>) {
        super(client)
    }

    async invoke() {
        const { sql, params } = translator.translate(this.table, this.model)

        const rows = await this.read(sql, params)
        return rows.map((r) => this.model.selector(r) as T)
    }
}
