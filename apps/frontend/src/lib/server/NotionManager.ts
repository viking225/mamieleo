import { AppConfig } from '@config';
import { NotionApi } from './NotionApi';
import type {
	NotionReservationProperties,
	DateProperty,
	NumberProperty,
	CheckboxProperty,
	SelectProperty,
	FormulaProperty
} from './types/Notion';
import { mapObject } from '@mamieleo/utils/object';
import type { MappedResult, Mapper } from '@mamieleo/utils/type';
import type {
	TableData,
	TableDateValue,
	TableNumberValue,
	TableBooleanValue,
	TableStringValue
} from '@app-types/Table';

type ReservationFilterQuery = {
	client?: string;
	dateIn?: {
		min?: Date;
		max?: Date;
	};
};

const NotionDataMapper = {
	'Date réservation': 'reservationDate',
	'Date entrée': 'dateIn',
	'Date de sortie': 'dateOut',
	'Nombre de nuit': 'numberOfNights',
	'Tarif CFA': 'amount'
} as const satisfies Mapper<NotionReservationProperties>;

type ReservationData = MappedResult<NotionReservationProperties, typeof NotionDataMapper>;

function transformDate(value: DateProperty): TableDateValue {
	return {
		type: 'date',
		value: value.date.start ? new Date(value.date.start) : undefined
	};
}

function transformNumber(value: NumberProperty): TableNumberValue {
	return {
		type: 'number',
		value: Number(value.number.format)
	};
}

function transformBoolean(value: CheckboxProperty): TableBooleanValue {
	return {
		type: 'boolean',
		value: value.checkbox
	};
}

function transformSelect(value: SelectProperty): TableStringValue {
	return {
		type: 'string',
		value: value.select.name
	};
}

function transformFormula(value: FormulaProperty): TableStringValue {
	return {
		type: 'string',
		value: (() => {
			switch (value.formula.type) {
				case 'string':
					return value.formula.string;
				case 'number':
					return value.formula.number;
				case 'boolean':
					return value.formula.boolean;
				case 'date':
					return value.formula.date;
			}
		})()
	};
}

function transformReservation(reservation: ReservationData): TableData {
	return Object.entries(reservation).reduce((acc, [path, value]) => {
		switch (value.type) {
			case 'date':
				return { ...acc, [path]: transformDate(value) };
			case 'number':
				return { ...acc, [path]: transformNumber(value) };
			case 'formula':
				return { ...acc, [path]: transformFormula(value) };
		}
	}, {} as TableData);
}

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

	async getReservations(filters: ReservationFilterQuery = {}): Promise<TableData[]> {
		const rawBookings = await this.API.queryReservations();

		if (!rawBookings || rawBookings.length === 0) {
			return [];
		}

		return rawBookings.map(result => transformReservation(mapObject(result, NotionDataMapper)));
	}
}
