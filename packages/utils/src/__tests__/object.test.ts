
import {describe, expect, test} from 'vitest'
import { deepMerge, mapObject } from '../object'


describe('Object utils', () => {
    describe('Given deepMerge function', () => {
        describe('When giving empty objects', () => {
            test('Then it returns emppty objects', () => {
                const result = deepMerge({}, {})
                expect(result).toStrictEqual({})
            })

        })

        describe('When keys of second object are not present in first object', () => {
            test('Then properties of first object are not ovverriden', () => {
                let first = {a: 30}
                const second = {b: 40, c: { d: 50}}

                const result = deepMerge(first, second)

                expect(result.a).toBe(30)
            })

            test('Then properties of second object are present in result', () => {
                const result = deepMerge({a: 3}, {b: 40, c: {d: 50}})
                expect(result.b).toBe(40)
                expect(result.c.d).toBe(50)
            })
        })

        describe('When first and second object have the same properties', () => (
            test('Then properties are merged in result', () => {
                const result = deepMerge({
                    shelf: {
                        1: 'rouille',
                        2: 'fouine'
                    },
                    library: 'BNF'
                }, {
                    library: 'POMPIDOU',
                    shelf: {
                        5: 'rimbeau',
                        2: 'la'
                    }
                })

                expect(result.library).toBe('POMPIDOU')
                expect(result.shelf[2]).toBe('la')
                expect(result.shelf[5]).toBe('rimbeau')
                expect(result.shelf[1]).toBe('rouille')
            })
        ))

        describe("When first element property is not object and second's is", () => {
            test('Then property object from second element is present in result', () => {
                const result = deepMerge({events: 'MVA'}, {events: {2024: 'VMA'}})

                expect(typeof result.events).toBe('object')
                expect(result.events[2024]).toBe('VMA')
            })
        })

        describe('When some properties in objects are arrays', () => {
            describe('And same keys in objects are array', () => {
                test('Then data from arrays are merged', () => {
                    const result = deepMerge({events: ['VMA', 'SUNDAYS']}, {events: ['COP2022']})
                    expect(Array.isArray(result.events)).toBeTruthy()
                    expect(result.events).toEqual(['VMA', 'SUNDAYS', 'COP2022'])
                })
            })
        })
    })

    describe('Given mapObject function', () => {
        describe('And empty mapper', () => {
            const mapper = {}
            describe('When called with empty object', () => {
                test('Then it returns empty object', () => {
                    expect(mapObject({}, mapper)).toStrictEqual({})
                })
            })

            describe('When called with object with data', () => {
                test('Then it returns empty object', () => {
                    const result = mapObject({a: 1, b: 2}, mapper as any)
                    expect(result).toStrictEqual({})
                })
            })
        })

        describe('And valid mapper', () => {
            const mapper = {
                'name': 'firstName',
                'age': 'yearsOld',
            } as const

            describe('When called with empty object', () => {
                test('Then it returns empty object', () => {
                    expect(mapObject({}, mapper)).toStrictEqual({})
                })
            })

            describe('When called with object without data in mapper', () => {
                test('Then it returns empty object', () => {
                    expect(mapObject({
                        'jaja': 10
                    }, mapper as any)).toStrictEqual({})
                })
            })

            describe('When called with object with data in mapper', () => {
                test('Then it returns object with mapped data', () => {
                    const result = mapObject({
                        'name': 'Jean',
                        'age': 30,
                    }, mapper)

                    expect(result).toStrictEqual({
                        firstName: 'Jean',
                        yearsOld: 30
                    })
                })
            })
        })
    })
})
