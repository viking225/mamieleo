import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { NotionApi } from "../NotionApi";
import { AppConfig } from "../../../config/config";
import { formatDateToString, typedMock } from "@mamieleo/utils";

vi.mock('@mamieleo/utils', async (importOriginal) => {
    const utils = await importOriginal() as {}
    return     {
        ...utils,
        deepMerge: vi.fn(),
        formatDateToString: vi.fn(() => '2025-10-01')
    }
})

describe('Notion API', () => {

    beforeEach(() => {
        vi.resetAllMocks()
        vi.useFakeTimers()
        global.fetch = vi.fn(() => typedMock<ReturnType<typeof fetch>>(Promise.resolve({
            ok: 200,
            json: vi.fn()
        })))

    })

    describe('When instantiate', () => {
        test('Then it returns a notion api instance', () => {

            expect(NotionApi.instance).toBeInstanceOf(NotionApi)
        })
    })

    describe('Given getReservations', () => {

        describe('When calling without parameters', () => {
            test('Then it calls  notion api w/ required parameters', async () => {
                console.log('before spy')
                const fetchSpyOn = vi.spyOn(global, 'fetch')

                console.log('before instance call')
                await NotionApi.instance.queryReservations()

                console.log('after call')

                const pathUrl = `${AppConfig.Notion.url}/databases/${AppConfig.Notion.databases.reservations}/query`
                const firstCall = fetchSpyOn.mock.calls[0];

                console.log('Before expect ')
                expect(fetchSpyOn).toHaveBeenCalled()
                expect(firstCall[0]).toEqual(pathUrl)
                expect(firstCall[1]).toEqual(expect.objectContaining({
                    method: 'GET'
                }))
                expect(Array.isArray).toBeTruthy()
            })
        })

        describe('When filtering data', () => {
            test('Then it calls api with filter parameter', async () => {

                const fetchSpyOn = vi.spyOn(globalThis, 'fetch')

                await NotionApi.instance.queryReservations({
                    entry: {
                        min: new Date('2025-10-01')
                    }
                })

                const [url, options] = fetchSpyOn.mock.calls[0];

                expect(typeof options).toBe('object')
                expect(typeof options?.body).toBe('string')

                const body = options?.body as string

                expect(JSON.parse(body)).toEqual({
                    filters: {
                        property: "Date d'entrée",
                        date: {
                            'on_or_after': '2025-10-01'
                        }
                    }
                })
            })
        })
    })
})
