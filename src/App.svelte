<script lang="ts">
	import { setContext } from 'svelte';
	import App from './components/App/App.svelte';
	import Stores, { STORE_CONTEXT } from './stores';

	setContext(STORE_CONTEXT, Stores);
</script>

<App />
