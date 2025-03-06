import { AppConfig }from '@config'
import { deepMerge } from '@mamieleo/utils'

type RequestMethod =
    'GET'

type NotionReservation = {

}

namespace NotionApiError {

}

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

    private async makeRequest({method, path, body}:{method: RequestMethod, path: string, body: Record<string, unknown> }) {

        const options = {
            method,
            headers: this.headers,
            body: JSON.stringify(body)
        } satisfies RequestInit

        const response = await fetch(`${this.config.url}${path}`, options)

        if (response.ok) {
            return response.json()
        }
    }

     async queryReservations(filter?: {entry:  {min?: Date; max?: Date}}) {
        const body = {}
        const options = {
            method: 'GET',
            path: `/databases/${this.config.databases.reservations}/query`
        }

        const filters: ({[K in string]: unknown} & {property: string})[]= []

        if(filter?.entry.min) {
            filters.push({
                property: RESERVATION_MAPPER.entryDate,
                date : {
                    [DATE_MAPPER.onOrAfter]: filter?.entry.min
                }
            })
        }

        const propertyPositions: Record<string, number> = {}
        const formattedFilters = filters.reduce((filter, item) => {

            if (!propertyPositions[item.property]) {
                filters.push(item)
                propertyPositions[item.property] = filters.length-1
            } else {
                propertyPositions[item.property] = deepMerge()
            }

            return filter
        }, {})

        await this.makeRequest(options)
    }
}
