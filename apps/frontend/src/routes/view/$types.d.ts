import type { NotionReservation } from '$lib/server/NotionApi';

export interface ViewProps {
	data: {
		bookings: Promise<NotionReservation[]>;
	};
}
