import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { NotionManager } from '../server/NotionManager';
import { NotionApi } from '../server/NotionApi';
import type { NotionReservationProperties } from '../server/types/Notion';

vi.mock('../server/NotionApi', () => ({
	NotionApi: {
		instance: {
			queryReservations: vi.fn()
		}
	}
}));

const foundReservations = [
	{
		id: 'Chambre 4',
		'Date réservation': {
			type: 'date',
			date: {
				start: '2024-10-01'
			}
		},
		'Date entrée': {
			type: 'date',
			date: {
				start: '2024-10-02'
			}
		},
		'Date de sortie': {
			type: 'date',
			date: {
				start: '2024-10-04'
			}
		},
		'Nombre de nuit': {
			type: 'number',
			number: {
				format: '2'
			}
		},
		'Tarif CFA': {
			type: 'formula',
			formula: {
				type: 'string',
				string: '1000000'
			}
		}
	},
	{
		id: '123',
		'Date réservation': {
			type: 'date',
			date: {
				start: '2025-02-01'
			}
		},
		'Date entrée': {
			type: 'date',
			date: {
				start: '2025-03-03'
			}
		},
		'Date de sortie': {
			type: 'date',
			date: {
				start: '2025-03-10'
			}
		},
		'Nombre de nuit': {
			type: 'number',
			number: {
				format: '3'
			}
		},
		'Tarif CFA': {
			type: 'formula',
			formula: {
				type: 'string',
				string: '1000000'
			}
		}
	}
] satisfies NotionReservationProperties[];

describe('Notion Manager', () => {
	describe('When getting instance', () => {
		test('Then it returns an instance of notionManager', () => {
			const instance = NotionManager.instance;

			expect(instance).instanceOf(NotionManager);
		});
	});

	describe('Given getReservation', () => {
		let instance: NotionManager;

		beforeAll(() => {
			instance = NotionManager.instance;
		});

		describe('And no data returned by api', () => {
			describe('When called', () => {
				test('Then it returns empty array', async () => {
					const result = await instance.getReservations();
					expect(Array.isArray(result)).toBeTruthy();
					expect(result.length).toBe(0);
				});
			});
		});

		describe('And data returned by api', () => {
			const getReservationApiMock = vi.mocked(NotionApi.instance.queryReservations);

			beforeEach(() => {
				getReservationApiMock.mockResolvedValueOnce(foundReservations);
			});

			describe('When called', () => {
				test('Then it calls getReservations from notion api', async () => {
					await instance.getReservations();
					expect(getReservationApiMock).toHaveBeenCalled();
				});

				test('Then it returns formatted reservation data', async () => {
					const result = await instance.getReservations();

					expect(result.length).toBe(foundReservations.length);
					expect(result[0]).toEqual({
						reservationDate: {
							type: 'date',
							value: new Date('2024-10-01')
						},
						dateIn: {
							type: 'date',
							value: new Date('2024-10-02')
						},
						dateOut: {
							type: 'date',
							value: new Date('2024-10-04')
						},
						numberOfNights: {
							type: 'number',
							value: 2
						},
						amount: {
							type: 'string',
							value: '1000000'
						}
					});
				});
			});
		});
	});
});
