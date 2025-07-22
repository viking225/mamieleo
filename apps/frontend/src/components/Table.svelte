<script lang="ts" generics="Properties extends Record<string, string>">
	type Column = {
		id: keyof Properties;
		label: string;
	};

	type Item = {
		[P in keyof Properties]: any;
	} & { id: string };

	type TableProps = {
		columns: Column[];
		items: Item[];
	};

	const { items, columns }: TableProps = $props();
</script>

<div>
	<div class="head">
		{#each columns as column}
			<div class="">{column.label}</div>
		{/each}
	</div>
	<div class="content">
		{#each items as item}
			{#each columns as column}
				<div class="">{item[column.id]}}</div>
			{/each}
		{/each}
	</div>
</div>
