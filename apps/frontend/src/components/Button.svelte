<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'default',
		icon,
		children,
		onclick
	}: {
		variant?: 'default' | 'outline';
		icon?: any;
		children: Snippet;
		onclick?: () => void;
	} = $props();

	// Button styles based on variant
	const variants = {
		default: 'bg-primary text-primary-foreground hover:bg-primary/90',
		outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
	};
</script>

<button
	{onclick}
	class={[
		// Base styles
		'flex w-full items-center justify-center gap-2 rounded-lg p-6 text-xl font-medium transition-colors',
		// Variant styles
		variants[variant]
	]}
>
	{#if icon}
		<svelte:component this={icon} class="size-6" />
	{/if}
	{@render children()}
</button>
