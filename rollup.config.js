// import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import autoPreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import svelte from 'rollup-plugin-svelte-hot';
import hmr from 'rollup-plugin-hot'

const production = !process.env.ROLLUP_WATCH;
const hot = !production;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			preprocess: autoPreprocess(),
			// compilerOptions: {
			// 	// enable run-time checks when not in production
			// 	dev: !production
			// },
			hot: hot && {
        // Prevent preserving local component state
        noPreserveState: false,

        // If this string appears anywhere in your component's code, then local
        // state won't be preserved, even when noPreserveState is false
        noPreserveStateKey: '@!hmr',

        // Prevent doing a full reload on next HMR update after fatal error
        noReload: true,

        // Try to recover after runtime errors in component init
        optimistic: true,

        // --- Advanced ---

        // By default, when the hot option is enabled, the `css` option of this
        // plugin (same option as official plugin) will be changed to `false`,
        // because extracting CSS doesn't work with HMR currently. You can use
        // this option to disable this behaviour if it cause problems with your
        // setup.
        noDisableCss: true,

        // When you change only the <style> part of a component, then only the
        // CSS will be reinjected. Existing component instances won't be
        // recreated. Set `false` to force recreation.
        injectCss: true,

        // Delay to mitigate FOUC (flash of unstyled content) when a component
        // is updated, before the new version with the new CSS is loaded.
        cssEjectDelay: 100,

        // Prevent adding an HMR accept handler to components with
        // accessors option to true, or to components with named exports
        // (from <script context="module">). This have the effect of
        // recreating the consumer of those components, instead of the
        // component themselves, on HMR updates. This might be needed to
        // reflect changes to accessors / named exports in the parents,
        // depending on how you use them.
        acceptAccessors: false,
        acceptNamedExports: false,

        // Set true to enable support for Nollup (note: when not specified, this
        // is automatically detected based on the NOLLUP env variable)
        nollup: false,
			},
      // `dev: true` is required with HMR
      dev: hot,

      // Separate CSS file is not supported during HMR (neither with Nollup
      // nor rollup-plugin-hot), so we just disable it when `hot` is true.
      ...(!hot && {
        css: css => {
          css.write('public/bundle.css')
        },
      }),
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({ sourceMap: !production }),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),

    hmr({
      public: 'public',
      inMemory: true,

      // Default host for the HMR server is localhost, change this option if
      // you want to serve over the network
      // host: '0.0.0.0',
      // You can also change the default HMR server port, if you fancy
      // port: '12345'

      // This is needed, otherwise Terser (in npm run build) chokes
      // on import.meta. With this option, the plugin will replace
      // import.meta.hot in your code with module.hot, and will do
      // nothing else.
      compatModuleHot: !hot,
    }),

	],
	watch: {
		clearScreen: false
	}
};
