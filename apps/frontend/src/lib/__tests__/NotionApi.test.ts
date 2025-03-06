import { beforeEach, describe, expect, test, vi } from "vitest";
import { NotionApi } from "../NotionApi";
import { AppConfig } from "../../../config/config";

describe('Notion API', () => {

    describe('When instantiate', () => {
        test('Then it returns a notion api instance', () => {

            expect(NotionApi.instance).toBeInstanceOf(NotionApi)
        })
    })

    describe('Given getReservations', () => {

        describe('When calling without parameters', () => {
            test('Then it calls  notion api w/ required parameters', async () => {
                const fetchSpyOn = vi.spyOn(globalThis, 'fetch')
                await NotionApi.instance.queryReservations()

                const pathUrl = `${AppConfig.Notion.url}/databases/${AppConfig.Notion.databases.reservations}/query`
                const firstCall = fetchSpyOn.mock.calls[0];

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

                const parameter = fetchSpyOn.mock.calls[0];

                expect(parameter).toEqual(expect.objectContaining({
                    body: {
                        filter: {
                            property: "Date d'entrée",
                            date: {
                                'on_or_after': '2025-10-01'
                            }
                        }
                    }
                }))
            })
        })
    })
})
