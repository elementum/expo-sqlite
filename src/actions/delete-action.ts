import { ExpoSqliteClient } from '../client.js'
import { SqliteAction } from './sqlite-action.js'

export class DeleteAction extends SqliteAction {
    constructor(client: ExpoSqliteClient, private index: string, private id: string) {
        super(client)
    }

    async invoke() {
        const sql = `DELETE FROM ${this.index} where ID = ?`
        await this.write(sql, this.id)
    }
}
