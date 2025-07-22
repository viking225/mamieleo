<script lang="ts">
	let {
		data,
		onUpdate
	}: {
		data: Record<string, any>;
		onUpdate: (data: Record<string, any>) => void;
	} = $props();

	// Form state
	let date: string = $state(data.date || '');
	let notes: string = $state(data.notes || '');

	// Update parent when values change
	$effect(() => {
		onUpdate({ date, notes });
	});
</script>

<div class="w-full max-w-lg">
	<h2 class="mb-8 text-center text-3xl font-bold">Final Details</h2>

	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-2">
			<label for="date" class="text-xl">Date</label>
			<input
				id="date"
				type="date"
				bind:value={date}
				class="bg-background w-full rounded-lg border p-4 text-xl"
			/>
		</div>

		<div class="flex flex-col gap-2">
			<label for="notes" class="text-xl">Additional Notes</label>
			<textarea
				id="notes"
				bind:value={notes}
				class="bg-background min-h-[150px] w-full rounded-lg border p-4 text-xl"
				placeholder="Enter any additional notes"
			/>
		</div>
	</div>
</div>
