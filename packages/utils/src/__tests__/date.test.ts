import { beforeAll, test, describe, expect, vi  } from "vitest";
import { formatDateToString } from "../date";

describe('Date Utils', () => {
    beforeAll(()  => {
        vi.useFakeTimers()
    })
    describe('formatDate utils', () => {
        describe('Given a date object ', () => {
            const date = new Date('2023-10-01')
            
            test('Then it returns a string with value 2023-10-01', () => {
                expect(formatDateToString(date)).toBe('2023-10-01')
            })
        })
    })
})
