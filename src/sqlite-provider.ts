import { DatabaseProvider } from '@elementum/db'
import { CreateAction } from './actions/create-action.js'
import { DeleteAction } from './actions/delete-action.js'
import { SelectAction } from './actions/select-action.js'
import { UpdateAction } from './actions/update-action.js'
import { Client } from './client.js'
import { QueryModel } from './query-model.js'

export class ExpoSqliteProvider extends DatabaseProvider {
    constructor(public client: Client) {
        super()
    }

    delete(id: string, index: string) {
        return new DeleteAction(this.client, index, id)
    }

    update<T extends { id: number }>(doc: T, index: string) {
        return new UpdateAction(this.client, index, doc)
    }

    create<T>(doc: T, index: string) {
        return new CreateAction(this.client, index, doc)
    }

    select<T>(model: Partial<QueryModel>, index: string) {
        return new SelectAction<T>(this.client, index, model)
    }
}
