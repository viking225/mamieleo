<script lang="ts">
	let {
		data,
		onUpdate,
	}: {
		data: Record<string, any>;
		onUpdate: (data: Record<string, any>) => void;
	} = $props();

	// Form state
	let name: string = $state(data.name || "");
	let description: string = $state(data.description || "");

	// Update parent when values change
	$effect(() => {
		onUpdate({ name, description });
	});
</script>

<div class="w-full max-w-lg">
	<h2 class="text-3xl font-bold mb-8 text-center">Basic Information</h2>

	<div class="flex flex-col gap-6">
		<div class="flex flex-col gap-2">
			<label for="name" class="text-xl">Name</label>
			<input id="name" type="text" bind:value={name} class="w-full p-4 text-xl rounded-lg border bg-background" placeholder="Enter name" />
		</div>

		<div class="flex flex-col gap-2">
			<label for="description" class="text-xl">Description</label>
			<textarea id="description" bind:value={description} class="w-full p-4 text-xl rounded-lg border bg-background min-h-[150px]" placeholder="Enter description" />
		</div>
	</div>
</div>
