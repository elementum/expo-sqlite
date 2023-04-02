import { QueryModel } from '@elementum/expo-sqlite'
import { ExpoSqliteClient } from '../client.js'
import { SqliteAction } from './sqlite-action.js'

export class BatchUpdateAction<T = any> extends SqliteAction<T> {
    constructor(client: ExpoSqliteClient, private query: Partial<QueryModel>, private table: string) {
        super(client)
    }

    private setters: Record<string, any> = {}

    set<TKey extends keyof T>(key: TKey, value: T[TKey]) {
        this.setters[key as string] = value
        return this
    }

    async invoke() {
        let params = []
        let sql = `UPDATE ${this.table} SET `
        sql += Object.entries(this.setters)
            .map((e) => {
                params.push(e[1])
                return `${e[0]} = ?`
            })
            .join(', ')

        const whereStatement = this.getWhereStatement(this.query.where)
        if (whereStatement) {
            sql += whereStatement.statement
            params = [...params, ...whereStatement.params]
        }

        await this.client.write(sql, params)
        return null
    }
}
