import { AppConfig }from '@config'
import { deepMerge, formatDateToString } from '@mamieleo/utils'

type RequestMethod =
    'GET'

export type NotionReservation = {
    Name: string;
    'Date réservation': string;
    'Date entrée': string;
    'Date de sortie': string;
    'Nombre de nuit': number;
    'Tarif CFA': number;
}

namespace NotionApiError {
    export class UnexpectedError extends Error {
        constructor() {
            super('Unexpected error')
        }
    }
}

type RequestParameters = {method: RequestMethod, path: string, body?: Record<string, unknown> }

type QueryFilter = {[K in string]: unknown} & {property: string}

const RESERVATION_MAPPER = {
    entryDate: "Date d'entrée"
}

const DATE_MAPPER = {
    onOrAfter: 'on_or_after'
}

export class NotionApi {
    static #instance: NotionApi | undefined

    private config = AppConfig.Notion
    static get instance() {

        if (!NotionApi.#instance) {
            NotionApi.#instance = new NotionApi()
        }
        return NotionApi.#instance;
    }

    private constructor() {}

    get headers() {
        const headers = new Headers()

        const data =  [
            ['Authorization', `Bearer ${this.config.key}`],
            ['Notion-Version', '2022-06-28'], 
            ['Content-Type', 'application/json']
        ]
        data.forEach(([name, value]) => {
            headers.append(name, value)
        });
        return headers
    }

    private async makeRequest<T>({method, path, body}:RequestParameters): Promise<T> {

        const options = {
            method,
            headers: this.headers,
            body: JSON.stringify(body)
        } satisfies RequestInit

        const response = await fetch(`${this.config.url}${path}`, options)

        if (!response.ok) {
            throw new NotionApiError.UnexpectedError()
        }
        const data = await response.json()
        return data
    }

    private formatBodyFilters(filters: QueryFilter[], condition: 'AND' | 'OR') {

        const propertyPositions: Record<string, number> = {}
        const formattedFilters = filters.reduce((filters: QueryFilter[], item: QueryFilter) => {

            if (!propertyPositions[item.property]) {
                filters.push(item)
                propertyPositions[item.property] = filters.length-1
            } else {
                filters[propertyPositions[item.property]] = deepMerge(filters[propertyPositions[item.property]], item)
            }

            return filters
        }, [])

        if (formattedFilters.length) {
            return formattedFilters.length === 1 ?  filters[0] : {
                [condition]: filters
            }
        }
    }

     async queryReservations(filter?: {entry:  {min?: Date; max?: Date}}) {
        const options: RequestParameters = {
            method: 'GET',
            path: `/databases/${this.config.databases.reservations}/query`,
            body: {}
        }

        const filters: QueryFilter[]= []

        if(filter?.entry.min) {
            filters.push({
                property: RESERVATION_MAPPER.entryDate,
                date : {
                    [DATE_MAPPER.onOrAfter]: formatDateToString(filter.entry.min)
                }
            })
        }

        if (filters.length && options.body) {
            options.body.filters = this.formatBodyFilters(filters, 'AND')
        }

        return this.makeRequest<NotionReservation[]>(options)
    }
}
