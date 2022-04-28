<script lang="ts">
	import { createForm } from './store';

	export let action: string | undefined = undefined;
	export let method = 'get';

	const form = createForm();
</script>

<form {method} {action} {...$$props} on:submit={form.handleSubmit}>
	<slot form={$form} />
</form>
