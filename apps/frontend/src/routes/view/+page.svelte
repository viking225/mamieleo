<script lang="ts">
	import Table from '../../components/Table.svelte';
	import type { ViewProps } from './$types';

	const { data }: ViewProps = $props();

	function checkValue(value: any) {
		console.log('value: ', value);
	}

	const columns = [
		{ id: 'id', label: 'ID' },
		{ id: 'dateIn', label: "Date d'entrée" },
		{ id: 'dateOut', label: 'Date de sortie' },
		{ id: 'numberOfNights', label: 'Nombre de nuit' },
		{ id: 'amount', label: 'Montant' }
	] as const;
</script>

<div class="container">
	{#await data.bookings}
		<p>Fetching data</p>
	{:then value}
		<div class="title-container">
			<h1>Reservations</h1>
		</div>
		<div class="bookings">
			<Table :items={value} />
			{checkValue(value)}
		</div>
	{:catch error}
		<p>Data was not fetched {error.message}</p>
	{/await}
</div>

<style>
</style>
