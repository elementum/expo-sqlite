import { ExpoSqliteClient } from '../client.js'

export type GroupInsertModel = {
    table: string
    entities: any
    client: ExpoSqliteClient
}

function getValue(value: any): string {
    if (typeof value === 'string') return `'${value}'`
    if (typeof value === 'undefined') return 'NULL'

    return value.toString()
}

export default (group: GroupInsertModel) => {
    const columns: Set<string> = new Set()

    for (let i = 0; i < group.entities.length; i++) {
        const entity = group.entities[i]
        const keys = Object.keys(entity)

        for (const key of keys) {
            if (!columns.has(key)) {
                columns.add(key)
            }
        }
    }

    const columnArray = [...columns]

    const valueGroups = group.entities.map((e) => `(${columnArray.map((c) => getValue(e[c])).join(', ')})`)
    return `INSERT INTO ${group.table} (${columnArray.join(', ')}) values ${valueGroups.join(', ')}`
}
