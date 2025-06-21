import { env } from '$env/dynamic/private'

export const AppConfig = {
    Notion: {
        key: `${env.NOTION_API_KEY}`,
        url: 'https://api.notion.com/v1',
        databases: {
            reservations: '1770491d14a880f6940efd50931b4889',
            client: ''
        }
    }
}
