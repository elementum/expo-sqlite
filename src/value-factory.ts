export function getValue(value: any) {
    if (value === null || value === undefined) {
        return 'NULL'
    }

    if (typeof value === 'string') {
        return `'${value}'`
    }

    return value.toString()
}
