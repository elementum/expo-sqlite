import { BaseEntity } from '../base-entity.js'
import { Client } from '../client.js'
import { SqliteAction } from './sqlite-action.js'

export class UpdateAction<T extends BaseEntity> extends SqliteAction {
    constructor(client: Client, private index: string, private doc: T) {
        super(client)
    }

    async invoke() {
        const params: any[] = []
        const setter = Object.entries(this.doc)
            .map((e) => {
                params.push(e[1])
                return `${e[0]} = ?`
            })
            .filter((e) => e !== 'id')
            .join(', ')

        const sql = `UPDATE ${this.index} SET ${setter} where id = ${this.doc.id}`
        await this.write(sql, params)
    }
}
