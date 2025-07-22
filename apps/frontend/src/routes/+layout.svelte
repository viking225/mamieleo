<script lang="ts">
	import type { Snippet } from 'svelte';
	import '@assets/app.css';

	let { children }: { children: Snippet } = $props();
</script>

<div class="container mx-auto min-h-screen max-w-2xl">
	{@render children()}
</div>
