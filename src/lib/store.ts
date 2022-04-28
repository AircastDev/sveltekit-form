import { invalidate } from '$app/navigation';
import { page } from '$app/stores';
import { derived, get, writable, type Readable } from 'svelte/store';
import { z } from 'zod';

export const FormOptions = z.object({
	url: z.string().default(() => get(page).url.toString())
});
export type FormOptions = z.input<typeof FormOptions>;

export type Transition = { state: TransitionState };
export type TransitionState = 'idle' | 'submitting' | 'loading';
export type FormStoreData = {
	transition: Transition;
};

export interface FormStore extends Readable<FormStoreData> {
	/**
	 * Handle form submission without a page reload.
	 *
	 * ```svelte
	 * <form on:submit={form.handleSubmit} ... />
	 * ```
	 */
	handleSubmit: (evt: SubmitEvent) => void;
}

export function createForm(formOptions: FormOptions = {}): FormStore {
	const options = FormOptions.parse(formOptions);
	const transition = writable<Transition>({ state: 'idle' });
	const { subscribe } = derived([transition], ([transition]) => ({ transition } as FormStoreData));

	return {
		subscribe,
		handleSubmit: (evt: SubmitEvent) => {
			evt.preventDefault();

			const formElement = evt.currentTarget as HTMLFormElement;
			const formData = new FormData(formElement);

			let method = formElement.method;
			let action = formElement.action;
			let encType = formElement.enctype;
			if (evt.submitter) {
				const buttonEl = evt.submitter as HTMLButtonElement;
				if (buttonEl.name) {
					formData.set(buttonEl.name, buttonEl.value);
				}
				if (buttonEl.formMethod) {
					method = buttonEl.formMethod;
				}
				if (buttonEl.formAction) {
					action = buttonEl.formAction;
				}
				if (buttonEl.formEnctype) {
					encType = buttonEl.formEnctype;
				}
			}

			method ||= 'get';
			action ||= options.url;
			encType ||= 'application/x-www-form-urlencoded';

			let body: BodyInit;
			switch (encType) {
				case 'application/x-www-form-urlencoded':
					body = new URLSearchParams(formData as any);
					break;
				case 'multipart/form-data':
					body = formData;
					break;
				default:
					throw new Error(`Unsupported form encType: ${encType}`);
			}

			transition.set({ state: 'submitting' });
			fetch(action, {
				method,
				credentials: 'same-origin',
				body
			})
				.then((res) => {
					// TODO: handle (and follow?) redirects
					if (!res.ok) {
						// TODO: how to show error page?
						const message = res.text().catch(() => '');
						throw new Error(`${res.status} response: ${message}`);
					}

					transition.set({ state: 'loading' });
					return invalidate(options.url);
				})
				.finally(() => {
					transition.set({ state: 'idle' });
				});
		}
	};
}
