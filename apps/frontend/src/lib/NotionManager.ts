import { AppConfig }from '@config'



type Reservation = {
    dateIn: Date,
    dateOut: Date
}

type ReservationFilterQuery = {
    client?: string,
    dateIn?: {
        min?: Date;
        max?: Date
    }
}

export class NotionManager {
    static #instance: NotionManager | undefined
    private config = AppConfig.Notion

    private constructor() {

    }

    static get instance() {

        if (!NotionManager.#instance) {
            NotionManager.#instance = new NotionManager()
        }
        return NotionManager.#instance;
    }



    async getReservations(filters: ReservationFilterQuery = {}): Promise<Reservation[]> {



        return []
    }
}
