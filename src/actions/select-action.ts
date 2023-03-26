import { Client } from '../client.js'
import { QueryModel } from '../query-model.js'
import { SqliteAction } from './sqlite-action.js'

export class SelectAction<T> extends SqliteAction<T[]> {
    constructor(client: Client, private index: string, private model: Partial<QueryModel>) {
        super(client)
    }

    async invoke() {
        const select = this.getSelectColumns()
        const where = this.getWhereStatement()
        const order = this.getOrderStatement()
        const offset = typeof this.model.skip === 'number' ? ` OFFSET ${this.model.skip}` : ''
        const limit = typeof this.model.take === 'number' ? ` LIMIT ${this.model.skip}` : ''
        const sql = `SELECT ${select} FROM ${this.index}${where.statement}${order}${offset}${limit}`

        const rows = await this.read(sql, where.params)
        return rows.map((r) => this.model.selector(r) as T)
    }

    private getOrderStatement() {
        let statement = ''
        if (this.model.orderBy && this.model.orderBy.length) {
            statement += ' ORDER BY'

            const orderStatements = []
            for (const order of this.model.orderBy) {
                orderStatements.push(`${order.column} ${order.direction}`)
            }

            statement += ` ${orderStatements.join(', ')}`
        }

        return statement
    }

    private getSelectColumns() {
        return this.model.columns ? this.model.columns.join(', ') : '*'
    }

    private getWhereStatement() {
        let statement = ''
        const params = []
        if (this.model.where && this.model.where.length) {
            statement += 'WHERE '

            const whereStatements: string[] = []
            for (const where of this.model.where) {
                switch (where.operation) {
                    case 'greater':
                        whereStatements.push(`${where.column as string} > ?`)
                        break
                    case 'greater_or_equal':
                        whereStatements.push(`${where.column as string} >= ?`)
                        break
                    case 'less':
                        whereStatements.push(`${where.column as string} < ?`)
                        break
                    case 'less_or_equal':
                        whereStatements.push(`${where.column as string} <= ?`)
                        break
                    case 'not_equal':
                        whereStatements.push(`${where.column as string} IS NOT ?`)
                        break

                    case 'equal':
                    default:
                        whereStatements.push(`${where.column as string} IS ?`)
                }
                params.push(where.value)
            }

            statement += whereStatements.join(' AND ')
        }

        statement += ' '

        return { statement, params }
    }
}
