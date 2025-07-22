<script lang="ts">
	import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from 'lucide-svelte';
	import Button from './Button.svelte';
	import Step1 from './steps/Step1.svelte';
	import Step2 from './steps/Step2.svelte';
	import Step3 from './steps/Step3.svelte';

	// Props
	let { onClose }: { onClose: () => void } = $props();

	// Form state
	let currentStep: number = $state(1);
	let formData = $state({
		step1: {},
		step2: {},
		step3: {}
	});

	// Derived values
	const totalSteps = 3;
	const progress: number = $derived((currentStep / totalSteps) * 100);

	// Navigation functions
	function nextStep() {
		if (currentStep < totalSteps) {
			currentStep++;
		}
	}

	function previousStep() {
		if (currentStep > 1) {
			currentStep--;
		}
	}

	function updateFormData(step: string, data: any) {
		formData[step as keyof typeof formData] = data;
	}

	function handleSubmit() {
		// Handle form submission
		console.log('Form submitted:', formData);
		onClose();
	}
</script>

<div class="flex min-h-screen w-full flex-col p-4">
	<!-- Progress bar -->
	<div class="bg-muted mb-8 h-4 w-full rounded-full">
		<div
			class="bg-primary h-4 rounded-full transition-all duration-300"
			style="width: {progress}%"
		/>
	</div>

	<!-- Step indicator -->
	<div class="mb-8 text-center">
		<p class="text-2xl font-medium">
			Step {currentStep} of {totalSteps}
		</p>
	</div>

	<!-- Form steps -->
	<div class="flex flex-1 flex-col items-center justify-center">
		{#if currentStep === 1}
			<Step1 data={formData.step1} onUpdate={data => updateFormData('step1', data)} />
		{:else if currentStep === 2}
			<Step2 data={formData.step2} onUpdate={data => updateFormData('step2', data)} />
		{:else}
			<Step3 data={formData.step3} onUpdate={data => updateFormData('step3', data)} />
		{/if}
	</div>

	<!-- Navigation buttons -->
	<div class="mt-8 flex gap-4">
		{#if currentStep > 1}
			<Button variant="outline" onclick={previousStep} icon={ArrowLeftIcon}>Previous</Button>
		{:else}
			<Button variant="outline" onclick={onClose} icon={ArrowLeftIcon}>Cancel</Button>
		{/if}

		{#if currentStep < totalSteps}
			<Button onclick={nextStep} icon={ArrowRightIcon}>Next</Button>
		{:else}
			<Button onclick={handleSubmit} icon={CheckIcon}>Submit</Button>
		{/if}
	</div>
</div>
