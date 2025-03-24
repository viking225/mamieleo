import { AppConfig }from '@config'
import { NotionApi, type NotionReservation } from './NotionApi'



type Reservation = {
    dateIn: Date
    dateOut: Date
    amount: number
    name: string
    reservationDate: Date
    numberOfNights: number
}

type ReservationFilterQuery = {
    client?: string,
    dateIn?: {
        min?: Date;
        max?: Date
    }
}

const DataMapper: Record<keyof NotionReservation, keyof Reservation> =  {}

export class NotionManager {
    static #instance: NotionManager | undefined
    private config = AppConfig.Notion
    private API: NotionApi

    private constructor() {
        this.API = NotionApi.instance
    }

    static get instance() {

        if (!NotionManager.#instance) {
            NotionManager.#instance = new NotionManager()
        }
        return NotionManager.#instance;
    }



    async getReservations(filters: ReservationFilterQuery = {}): Promise<Reservation[]> {

        console.log('data: ', NotionApi.instance)
        await NotionApi.instance.queryReservations()
        return []
    }
}
