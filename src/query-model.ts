export class QueryModel {
    skip: number

    take: number

    selector: (obj: any) => any = (obj) => obj

    columns: string[] = undefined

    where: WhereModel[] = []

    orderBy: OrderBy[]
}

export type OrderBy = {
    column: string
    direction: 'ASC' | 'DESC'
}

export type WhereModel<T = any> = {
    column: keyof T
    value: any
    operation?: WhereOperation
}

export type WhereOperation = 'equal' | 'not_equal' | 'greater' | 'greater_or_equal' | 'less' | 'less_or_equal'
