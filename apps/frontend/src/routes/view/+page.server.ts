import { NotionManager } from '$lib/server/NotionManager'

type ReservationDataResponse = {}

export const load : ReservationDataResponse = async ( ) => {
    try {

        return {
            bookings: NotionManager.instance.getReservations()
        }
    } catch (error) {
        console.error('Error loading reservations: ', error)
    }

}
