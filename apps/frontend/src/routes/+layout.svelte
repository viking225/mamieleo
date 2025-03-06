<script lang="ts">
	import type { Snippet } from "svelte";
	import '@assets/app.css';

	let { children }: { children: Snippet } = $props();
</script>

<div class="container mx-auto max-w-2xl min-h-screen">
	{@render children()}
</div>
