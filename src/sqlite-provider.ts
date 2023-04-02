import { DatabaseProvider } from '@elementum/db'
import { CreateAction } from './actions/create-action.js'
import { DeleteAction } from './actions/delete-action.js'
import { SelectAction } from './actions/select-action.js'
import { UpdateAction } from './actions/update-action.js'
import { ExpoSqliteClient } from './client.js'
import { QueryModel } from './query-model.js'
import { BaseEntity } from './base-entity.js'
import { CountAction } from './actions/count-action.js'
import { BatchUpdateAction } from './actions/batch-update-action.js'

export class ExpoSqliteProvider extends DatabaseProvider {
    constructor(public client: ExpoSqliteClient) {
        super()
    }

    delete(id: string, table: string) {
        return new DeleteAction(this.client, table, id)
    }

    update<T extends BaseEntity>(doc: T, table: string) {
        return new UpdateAction(this.client, table, doc)
    }

    create<T>(doc: T, table: string) {
        return new CreateAction(this.client, table, doc)
    }

    select<T>(query: Partial<QueryModel>, table: string) {
        return new SelectAction<T>(this.client, table, query)
    }

    count(query: Partial<QueryModel>, table: string) {
        return new CountAction(this.client, table, query)
    }

    batchUpdate<T>(query: Partial<QueryModel>, table: string) {
        return new BatchUpdateAction<T>(this.client, query, table)
    }
}
