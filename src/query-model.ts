export class QueryModel {
    skip: number

    take: number

    selector: (obj: any) => any = (obj) => obj

    columns: string[] = undefined

    where: WhereModel[] = []

    orderBy: { column: string; direction: 'ASC' | 'DESC' }[]
}

export type WhereModel = { column: string; value: any }
