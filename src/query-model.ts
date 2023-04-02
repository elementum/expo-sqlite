export class QueryModel {
    skip: number

    take: number

    selector: (obj: any) => any = (obj) => obj

    columns: string[] = []

    where: WhereModel[] = []

    orderBy: OrderBy[] = []
}

export type OrderBy = {
    column: string
    direction: 'ASC' | 'DESC'
}

export type WhereModel<T = any, K extends keyof T = any> = {
    column: K
    value: T[K]
    operation?: WhereOperation
}

export type WhereOperation =
    | 'equal_to'
    | 'not_equal_to'
    | 'greater_than'
    | 'greater_or_equal_than'
    | 'less_than'
    | 'less_or_equal_than'
