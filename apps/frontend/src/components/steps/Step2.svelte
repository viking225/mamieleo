<script lang="ts">
	let {
		data,
		onUpdate,
	}: {
		data: Record<string, any>;
		onUpdate: (data: Record<string, any>) => void;
	} = $props();

	// Form state
	let category: string = $state(data.category || "");
	let priority: string = $state(data.priority || "medium");

	// Update parent when values change
	$effect(() => {
		onUpdate({ category, priority });
	});

	const priorities = [
		{ value: "low", label: "Low Priority" },
		{ value: "medium", label: "Medium Priority" },
		{ value: "high", label: "High Priority" },
	];
</script>

<div class="w-full max-w-lg">
	<h2 class="text-3xl font-bold mb-8 text-center">Additional Details</h2>

	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-2">
			<label for="category" class="text-xl">Category</label>
			<input id="category" type="text" bind:value={category} class="w-full p-4 text-xl rounded-lg border bg-background" placeholder="Enter category" />
		</div>

		<div class="flex flex-col gap-2">
			<label class="text-xl">Priority</label>
			<div class="flex flex-col gap-4">
				{#each priorities as { value, label }}
					<label class="flex items-center gap-3 text-xl cursor-pointer">
						<input type="radio" name="priority" {value} bind:group={priority} class="size-6" />
						{label}
					</label>
				{/each}
			</div>
		</div>
	</div>
</div>
