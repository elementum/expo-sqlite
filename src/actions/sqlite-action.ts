/* eslint-disable no-underscore-dangle */
import { DatabaseAction } from '@elementum/db'
import { ExpoSqliteClient } from '../client.js'
import { OrderBy, WhereModel } from '../query-model.js'

export abstract class SqliteAction<T = any> extends DatabaseAction<T> {
    constructor(public client: ExpoSqliteClient) {
        super()
    }

    read = (sql: string, ...params: any[]): Promise<T> => this.client.read(sql, params)

    write = (sql: string, ...params: any[]) => this.client.write(sql, params)

    protected getWhereStatement(wheres: WhereModel[]) {
        let statement = ''
        const params = []
        if (wheres && wheres.length) {
            statement += 'WHERE '

            const whereStatements: string[] = []
            for (const where of wheres) {
                switch (where.operation) {
                    case 'greater_than':
                        whereStatements.push(`${where.column as string} > ?`)
                        break
                    case 'greater_or_equal_than':
                        whereStatements.push(`${where.column as string} >= ?`)
                        break
                    case 'less_than':
                        whereStatements.push(`${where.column as string} < ?`)
                        break
                    case 'less_or_equal_than':
                        whereStatements.push(`${where.column as string} <= ?`)
                        break
                    case 'not_equal_to':
                        whereStatements.push(`${where.column as string} IS NOT ?`)
                        break

                    case 'equal_to':
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

    protected getSelectColumns(columns: string[]) {
        return columns ? columns.join(', ') : '*'
    }

    protected getOrderStatement(orderbys: OrderBy[]) {
        let statement = ''
        if (orderbys && orderbys.length) {
            statement += ' ORDER BY'

            const orderStatements = []
            for (const order of orderbys) {
                orderStatements.push(`${order.column} ${order.direction}`)
            }

            statement += ` ${orderStatements.join(', ')}`
        }

        return statement
    }
}

export type WriteResult = {
    insertId: number
    rowsAffected: number
}
