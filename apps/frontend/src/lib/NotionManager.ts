import { AppConfig }from '@config'
import { NotionApi, type NotionReservation } from './NotionApi'
import { mapObject } from '@mamieleo/utils'



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

const DataMapper: Record<keyof NotionReservation, keyof Reservation> =  {
    Name: 'name',
    'Date réservation': 'reservationDate',
    'Date entrée': 'dateIn',
    'Date de sortie': 'dateOut',
    'Nombre de nuit': 'numberOfNights',
    'Tarif CFA': 'amount'
} as const

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
        const rawBookings =  await NotionApi.instance.queryReservations()

        if (!rawBookings || !Array.isArray(rawBookings)) {
            return []
        }

        return rawBookings.map((rawBooking) => {
            return mapObject(rawBooking, DataMapper)
        })
    }
}
