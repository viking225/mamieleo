export type TableNumberValue = {
	type: 'number';
	value: number | undefined;
};

export type TableStringValue = {
	type: 'string';
	value: string | undefined;
};

export type TableBooleanValue = {
	type: 'boolean';
	value: boolean | undefined;
};

export type TableDateValue = {
	type: 'date';
	value: Date | undefined;
};

export type TableData = TableNumberValue | TableStringValue | TableBooleanValue | TableDateValue;
