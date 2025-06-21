export enum RequestMethod {
	GET = 'GET',
	POST = 'POST'
}

export type NotionQueryResponse = {
	object: 'list';
	results: NotionQueryResult[];
};

type NotionQueryResult = PageObjectType | { object: 'database_object' };

type PageObjectType = {
	object: 'page';
	id: string;
	created_time: string;
	archived: boolean;
	properties: { [K in string]: PageProperty }[];
};

type PageProperty = { id: string } & (
	| NumberProperty
	| PhoneNumberProperty
	| DateProperty
	| RollupProperty
	| CheckboxProperty
	| SelectProperty
	| FormulaProperty
);

export type NumberProperty = {
	type: 'number';
	number: {
		format: string;
	};
};

type PhoneNumberProperty = {
	type: 'phone_number';
	phone_number: string;
};

export type DateProperty = {
	type: 'date';
	date: {
		start?: string;
		end?: string;
	};
};

type RollupProperty = {
	type: 'rollup';
	rollup: {
		type: 'rollup';
	};
};

type CheckboxProperty = {
	type: 'checkbox';
	checkbox: boolean;
};

type SelectProperty = {
	type: 'select';
	select: {
		id: string;
		name: string;
		color: string;
	};
};

export type FormulaProperty = {
	type: 'formula';
	formula: {
		type: 'string' | 'number' | 'boolean' | 'date';
		string?: string;
		number?: number;
		boolean?: boolean;
		date?: string;
	};
};


export type NotionReservationProperties = {
	id: string
	'Date réservation': DateProperty;
	'Date entrée': DateProperty;
	'Date de sortie': DateProperty;
	'Nombre de nuit': NumberProperty;
	'Tarif CFA': FormulaProperty;
};

export namespace NotionApiError {
	export class UnexpectedError extends Error {
		constructor() {
			super('Unexpected error');
		}
	}
}

export type RequestParameters = {
	method: RequestMethod;
	path: string;
	body?: Record<string, unknown>;
};

export type QueryFilter = { [K in string]: unknown } & { property: string };
