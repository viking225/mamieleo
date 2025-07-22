import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { NotionApi } from '../server/NotionApi';
import { AppConfig } from '../../../config/config';
import { typedMock } from '@mamieleo/utils/test';
import { formatDateToString } from '@mamieleo/utils/date';

vi.mock('@mamieleo/utils', () => ({
	deepMerge: vi.fn(),
	formatDateToString: vi.fn(() => '2025-10-01')
}));

describe('Notion API', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		vi.useFakeTimers();
		global.fetch = vi.fn(() =>
			typedMock<ReturnType<typeof fetch>>(
				Promise.resolve({
					ok: 200,
					json: vi.fn(() => ({
						results: []
					}))
				})
			)
		);
	});

	describe('When instantiate', () => {
		test('Then it returns a notion api instance', () => {
			expect(NotionApi.instance).toBeInstanceOf(NotionApi);
		});
	});

	describe('Given getReservations', () => {
		describe('When calling without parameters', () => {
			test('Then it calls  notion api w/ required parameters', async () => {
				const fetchSpyOn = vi.spyOn(global, 'fetch');

				await NotionApi.instance.queryReservations();

				const pathUrl = `${AppConfig.Notion.url}/databases/${AppConfig.Notion.databases.reservations}/query`;
				const fetchParams = fetchSpyOn.mock.calls[0];

				console.log('Before expect ');
				expect(fetchSpyOn).toHaveBeenCalled();
				expect(fetchParams[0]).toEqual(pathUrl);
				expect(fetchParams[1]).toEqual(
					expect.objectContaining({
						method: 'POST'
					})
				);
				expect(Array.isArray).toBeTruthy();
			});
		});

		describe('When filtering data', () => {
			test('Then it calls api with filter parameter', async () => {
				const fetchSpyOn = vi.spyOn(globalThis, 'fetch');

				await NotionApi.instance.queryReservations({
					entry: {
						min: new Date('2025-10-01')
					}
				});

				const [url, options] = fetchSpyOn.mock.calls[0];

				expect(typeof options).toBe('object');
				expect(typeof options?.body).toBe('string');

				const body = options?.body as string;

				expect(JSON.parse(body)).toEqual({
					filters: {
						property: "Date d'entrée",
						date: {
							on_or_after: '2025-10-01'
						}
					}
				});
			});
		});
	});
});
