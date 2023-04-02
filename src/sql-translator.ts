import { OrderBy, QueryModel, WhereModel } from './query-model.js'

class Translator {
    translate(table: string, query: Partial<QueryModel>) {
        const select = this.translateSelect(query.columns)
        const where = this.translateWhere(query.where ?? [])

        const order = this.translateOrder(query.orderBy)
        const offset = typeof query.skip === 'number' ? ` OFFSET ${query.skip}` : ''
        const limit = typeof query.take === 'number' ? ` LIMIT ${query.take}` : ''

        const sql = `SELECT ${select} FROM ${table}${where.statement}${order}${offset}${limit}`

        return { sql, params: where.params }
    }

    translateSelect(columns: string[]) {
        return columns && columns.length ? columns.join(', ') : '*'
    }

    translateWhere(wheres: WhereModel[]) {
        let statement = ''
        const params = []
        if (wheres && wheres.length) {
            statement += ' WHERE '

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

    translateOrder(orderbys: OrderBy[]) {
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

export default new Translator()
