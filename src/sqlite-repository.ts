/* eslint-disable max-classes-per-file */
import { DatabaseAction, IQueryable, IRepository } from '@elementum/db'
import { PartialDeep } from '@elementum/toolkit/types'
import { fieldAccessor } from './field-accessor.js'
import { QueryModel, WhereOperation } from './query-model.js'
import { ExpoSqliteProvider } from './sqlite-provider.js'

export abstract class SqliteQueryable<T> implements IQueryable<T> {
    constructor(
        protected provider: ExpoSqliteProvider,
        protected table: string,
        protected query?: Partial<QueryModel>
    ) {
        this.query = this.query || {}
    }

    toList(): Promise<Pick<T, keyof T>[]> {
        const action = this.provider.select<T>(this.query, this.table)
        return action.invoke()
    }

    async firstOrDefault(): Promise<Pick<T, keyof T>> {
        this.query.take = 1

        const action = this.provider.select<T>(this.query, this.table)
        const rows = await action.invoke()
        return rows[0]
    }
}

class SealedRepository<T> extends SqliteQueryable<T> {}

export abstract class SqliteRepository<T, TRepository> extends SqliteQueryable<T> implements IRepository<T> {
    delete(id: string): DatabaseAction {
        throw new Error('Method not implemented.')
    }

    update(doc: Partial<T> & { id: number }): DatabaseAction {
        return this.provider.update(doc, this.table)
    }

    create(doc: PartialDeep<T>): DatabaseAction {
        return this.provider.create(doc, this.table)
    }

    protected abstract newRepo(model: Partial<QueryModel>): TRepository

    where<K extends keyof T>(column: K, operation: WhereOperation, value: T[K]): TRepository {
        return this.newRepo({ ...this.query, where: [...this.query.where, { column, value, operation }] })
    }

    skip(value: number): TRepository {
        return this.newRepo({ ...this.query, skip: value })
    }

    take(value: number): TRepository {
        return this.newRepo({ ...this.query, take: value })
    }

    orderBy<TColumn>(selector: (t: T) => TColumn, direction: 'ASC' | 'DESC') {
        const accessor = fieldAccessor()
        selector(accessor as any)

        const fields = accessor.getFields()
        if (fields.length !== 1) {
            throw Error(`Order by requires exactly one column. Column you referenced: ${fields.join(', ')}`)
        }

        const query: Partial<QueryModel> = { ...this.query, orderBy: [{ column: fields[0], direction }] }
        return this.newRepo(query)
    }

    thenBy<TColumn>(selector: (t: T) => TColumn, direction: 'ASC' | 'DESC') {
        const accessor = fieldAccessor()
        selector(accessor as any)

        const fields = accessor.getFields()
        if (fields.length !== 1) {
            throw Error(`Then by requires exactly one column. Column you referenced: ${fields.join(', ')}`)
        }

        const query: Partial<QueryModel> = {
            ...this.query,
            orderBy: [...(this.query.orderBy || []), { column: fields[0], direction }],
        }
        return this.newRepo(query)
    }

    async toDictionary<TKey extends string | number | symbol, TValue>(key: (t: T) => TKey, value: (t: T) => TValue) {
        return this.toList().then((r) =>
            r.reduce((acc, item) => {
                acc[key(item)] = value(item)
                return acc
            }, {} as Record<TKey, TValue>)
        )
    }

    async reduce<TValue>(reducer: (acc: TValue, item: T) => void, acc: TValue) {
        await this.toList().then((r) => r.forEach((item) => reducer(acc, item)))
        return acc
    }

    select<TNew>(selector: (doc: T) => TNew) {
        const fields: string[] = ['id']
        const proxy = new Proxy(
            {},
            {
                get: (target, key: string) => {
                    fields.push(key)
                },
            }
        )

        selector(proxy as T)

        return new SealedRepository<TNew>(this.provider, this.table, {
            ...this.query,
            columns: fields as string[],
            selector,
        })
    }
}
