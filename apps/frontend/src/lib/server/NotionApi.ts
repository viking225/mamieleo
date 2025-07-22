import { AppConfig } from '@config';
import { deepMerge } from '@mamieleo/utils/object';
import { formatDateToString } from '@mamieleo/utils/date';
import {
	type RequestParameters,
	type NotionQueryResponse,
	type QueryFilter,
	RequestMethod,
	NotionApiError,
	type NotionReservationProperties
} from './types/Notion';

const RESERVATION_MAPPER = {
	entryDate: "Date d'entrée"
};

const DATE_MAPPER = {
	onOrAfter: 'on_or_after'
};

export class NotionApi {
	static #instance: NotionApi | undefined;

	private config = AppConfig.Notion;
	static get instance() {
		if (!NotionApi.#instance) {
			NotionApi.#instance = new NotionApi();
		}
		return NotionApi.#instance;
	}

	private constructor() {}

	get headers() {
		return new Headers([
			['Authorization', `Bearer ${this.config.key}`],
			['Notion-Version', '2022-06-28'],
			['Content-Type', 'application/json']
		]);
	}

	private async makeRequest<T>({ method, path, body }: RequestParameters): Promise<T> {
		const options: RequestInit = {
			method,
			headers: this.headers
		} satisfies RequestInit;

		if (method !== 'GET') {
			options.body = JSON.stringify(body);
		}

		const response = await fetch(`${this.config.url}${path}`, options);

		if (!response.ok) {
			console.error('Error: ', {
				status: response.status,
				body: await response.text()
			});
			throw new NotionApiError.UnexpectedError();
		}
		const data = await response.json();
		return data;
	}

	private formatBodyFilters(filters: QueryFilter[], condition: 'AND' | 'OR') {
		const propertyPositions: Record<string, number> = {};
		const formattedFilters = filters.reduce((filters: QueryFilter[], item: QueryFilter) => {
			if (!propertyPositions[item.property]) {
				filters.push(item);
				propertyPositions[item.property] = filters.length - 1;
			} else {
				filters[propertyPositions[item.property]] = deepMerge(
					filters[propertyPositions[item.property]],
					item
				);
			}

			return filters;
		}, []);

		if (formattedFilters.length) {
			return formattedFilters.length === 1
				? filters[0]
				: {
						[condition]: filters
					};
		}
	}

	async queryReservations(filter?: { entry: { min?: Date; max?: Date } }) {
		const options: RequestParameters = {
			method: RequestMethod.POST,
			path: `/databases/${this.config.databases.reservations}/query`,
			body: {}
		};

		const filters: QueryFilter[] = [];

		if (filter?.entry.min) {
			filters.push({
				property: RESERVATION_MAPPER.entryDate,
				date: {
					[DATE_MAPPER.onOrAfter]: formatDateToString(filter.entry.min)
				}
			});
		}

		if (filters.length && options.body) {
			options.body.filters = this.formatBodyFilters(filters, 'AND');
		}

		const response = await this.makeRequest<NotionQueryResponse>(options);
		return response.results
			.filter(result => result.object === 'page')
			.map(
				({ properties, id }) => ({ ...properties, id }) as unknown as NotionReservationProperties
			);
	}
}
