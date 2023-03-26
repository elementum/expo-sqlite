import { Client } from '../client.js'
import { SqliteAction } from './sqlite-action.js'

export class CreateAction<T> extends SqliteAction {
    constructor(client: Client, private index: string, public doc: T) {
        super(client)
    }

    async invoke() {
        const columns = Object.keys(this.doc).join(', ')
        const values = Object.values(this.doc)

        const sql = `INSERT INTO ${this.index} (${columns}) values (${values})`
        const result = await this.write(sql, values)
        // eslint-disable-next-line @typescript-eslint/dot-notation
        this.doc['id'] = result.insertId
    }
}
