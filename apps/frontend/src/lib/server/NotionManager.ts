import { AppConfig } from '@config';
import { NotionApi } from './NotionApi';
import type { NotionReservationProperties, DateProperty } from './types/Notion';
import { mapObject, type Mapper } from '@mamieleo/utils';

type ReservationFilterQuery = {
	client?: string;
	dateIn?: {
		min?: Date;
		max?: Date;
	};
};

const NotionDataMapper: Mapper<NotionReservationProperties> = {
	'Date réservation': 'reservationDate',
	'Date entrée': 'dateIn',
	'Date de sortie': 'dateOut',
	'Nombre de nuit': 'numberOfNights',
	'Tarif CFA': 'amount'
} as const;

export class NotionManager {
	static #instance: NotionManager | undefined;
	private API: NotionApi;

	private constructor() {
		this.API = NotionApi.instance;
	}

	static get instance() {
		if (!NotionManager.#instance) {
			NotionManager.#instance = new NotionManager();
		}
		return NotionManager.#instance;
	}

	async getReservations(filters: ReservationFilterQuery = {}) {
		const rawBookings = await this.API.queryReservations();

		console.log('rawBookings: ', rawBookings);

		if (!rawBookings || rawBookings.length === 0) {
			return [];
		}

		return rawBookings.map((result) => {
			return mapObject(result, NotionDataMapper)
		});
	}
}
