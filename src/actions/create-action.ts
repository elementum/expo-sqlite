import { ExpoSqliteClient } from '../client.js'
import { SqliteAction } from './sqlite-action.js'

export class CreateAction<T = any> extends SqliteAction {
    constructor(client: ExpoSqliteClient, public table: string, public doc: T) {
        super(client)
    }

    async invoke() {
        const columns = Object.keys(this.doc).join(', ')
        const values = Object.values(this.doc)

        const sql = `INSERT INTO ${this.table} (${columns}) values (${values})`
        const result = await this.write(sql, values)
        // eslint-disable-next-line @typescript-eslint/dot-notation
        this.doc['id'] = result.insertId
    }
}
