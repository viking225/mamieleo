import { beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { NotionManager } from "../NotionManager";
import { NotionApi, type NotionReservation } from "../NotionApi";

vi.mock('../NotionApi.ts', () => ({
    NotionApi: {
        instance: {
            queryReservations: vi.fn()
        }
    }
}))

describe('Notion Manager', () => {

    describe('When getting instance', () => {
        test('Then it returns an instance of notionManager', () => {
            const instance = NotionManager.instance

            expect(instance).instanceOf(NotionManager)
        })
    })

    describe('Given getReservation', () => {
        let instance: NotionManager;

        beforeAll(() => {
            instance =  NotionManager.instance
        })

        describe('And no data returned by api', () => {
            describe('When called', () => {
                test('Then it returns empty array', async () => {
                    const result = await instance.getReservations()
                    expect(Array.isArray(result)).toBeTruthy()
                    expect(result.length).toBe(0)
                })
            })
        })

        describe('And data returned by api', () => {
            const getReservationApiMock = vi.mocked(NotionApi.instance.queryReservations)

            const apiResult = [{
                Name: 'Chambre 4',
                'Date réservation': '2024-10-01',
                'Date entrée': '2024-10-02',
                'Date de sortie': '2024-10-04',
                'Nombre de nuit': 33,
                'Tarif CFA': 1000000,
            }, {
                Name: 'Chambre 3',
                'Date réservation': '2025-02-01',
                'Date entrée': '2025-03-03',
                'Date de sortie': '2025-03-10',
                'Nombre de nuit': 7,
                'Tarif CFA': 50000,
            }] satisfies NotionReservation[]

            beforeEach(() => {
                getReservationApiMock.mockResolvedValueOnce(apiResult)
            })

            describe('When called', () => {
                test('Then it calls getReservations from notion api', async () => {
                    await instance.getReservations()
                    expect(getReservationApiMock).toHaveBeenCalled()
                })

                test('Then it returns formatted reservation data', async() => {
                    const result = await instance.getReservations()

                    expect(result.length).toBe(apiResult.length)
                    expect(result[0]).toEqual({
                        name: 'Chambre 4',
                        reservationDate: '2024-10-01',
                        dateIn: '2024-10-02',
                        dateOut: '2024-10-04',
                        numberOfNights: 33,
                        amount: 1000000,
                    })
                })
            })
        })
    })
})
