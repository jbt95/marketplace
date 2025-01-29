import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
		exclude: ['src/**/infrastructure'],
		globals: true,
		coverage: {
			reporter: ['lcov', 'text']
		},
		outputFile: 'coverage/report.xml'
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	}
});
