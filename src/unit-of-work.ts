import { CreateAction } from './actions/create-action.js'
import { UpdateAction } from './actions/update-action.js'
import { BatchUpdateAction } from './actions/batch-update-action.js'
import generateSqlForInsertGroup, { GroupInsertModel } from './sql-generators/insert-group.js'
import { BaseEntity } from './base-entity.js'
import { SqliteAction } from './actions/sqlite-action.js'

// eslint-disable-next-line import/prefer-default-export
export class UnitOfWork {
    private creaters: CreateAction[] = []

    private updaters: SqliteAction<any>[] = []

    add(model: CreateAction) {
        this.creaters.push(model)
    }

    async save() {
        try {
            await this.insert()
            await this.performUpdate()
        } finally {
            this.creaters = []
            this.updaters = []
        }
    }

    async performUpdate() {
        for (const updater of this.updaters) {
            await updater.invoke()
        }
    }

    private async insert() {
        const insertGroups = this.groupInserters()
        for (const group of insertGroups) {
            const sql = generateSqlForInsertGroup(group)

            await group.client.write(sql, [])
        }
    }

    update<T extends BaseEntity>(updater: BatchUpdateAction<T> | UpdateAction<T>) {
        this.updaters.push(updater)
    }

    groupInserters() {
        const groups = this.creaters.reduce((acc, item) => {
            if (!acc[item.table]) {
                acc[item.table] = { table: item.table, entities: [], client: item.client }
            }

            acc[item.table].entities.push(item.doc)
            return acc
        }, {} as Record<string, GroupInsertModel>)

        return Object.values(groups)
    }

    dispose() {
        return this.save()
    }
}
