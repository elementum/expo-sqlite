import { Client } from '../client.js'
import { SqliteAction } from './sqlite-action.js'

export class DeleteAction extends SqliteAction {
    constructor(client: Client, private index: string, private id: string) {
        super(client)
    }

    async invoke() {
        const sql = `DELETE FROM ${this.index} where ID = ?`
        await this.write(sql, this.id)
    }
}
