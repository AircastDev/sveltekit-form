# SvelteKit Form

A Form component for SvelteKit that enhances the native form element,
preventing full page reloads on form submission if JavaScript is enabled.

## Features

- Works without JavaScript, its just a form!
- Prevents full page reloads on submission when JavaScript is enabled.
- Automatically refetches the page data after submission.
- Allows for optimisic UI updates.

## Installation

```sh
npm install sveltekit-form
```

## Example Usage

Simply replace any usage of `<form>` with `<Form>`

```svelte
<script lang="ts">
	import { Form } from 'sveltekit-form';
</script>

<Form method="post" let:form>
	<input name="username" />
	<input type="password" name="password" />
	<button disabled={form.transition.state !== 'idle'}> Login </button>
	<button formaction="/forgot-password"> Forgot Password </button>
</Form>
```

## Acknowledgements

- [Remix's Forms](https://remix.run/docs/en/v1/guides/data-writes#plain-html-forms)

## Authors

- [@jamesbirtles](https://www.github.com/jamesbirtles)

## Used By

This project is used in production at [Aircast](https://airca.st).

## License

[MIT](https://choosealicense.com/licenses/mit/)
