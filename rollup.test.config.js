import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import multi from '@rollup/plugin-multi-entry';

const env = process.env.NODE_ENV;

const lodashExternal = [
	'lodash/isEmpty',
	'lodash/pickBy',
	'lodash/mapValues',
	'lodash/forEach',
	'lodash/isEqual',
	'lodash/isArray',
	'lodash/sortBy',
	'lodash/includes',
	'lodash/forIn',
	'lodash/find',
	'lodash/each',
	'lodash/indexOf',
	'lodash/orderBy',
	'lodash/compact',
	'lodash/maxBy',
	'lodash/minBy'
];

export default {
	input: 'tests/**/*-test.js',
	external: [
		'react',
		'prop-types',
		'@gisatcz/ptr-atoms',
		'classnames',
		'chroma-js',
		'@gisatcz/ptr-utils',
		'@gisatcz/ptr-core',
		'@gisatcz/cross-package-react-context',
		'leaflet',
		'leaflet/dist/leaflet.css',
		'proj4leaflet',
		'react-leaflet',
		'react-resize-detector',
		'react',
		'webworldwind-esa',
		'js-quadtree',
		'@turf/turf',
		'uri-templates',
		...lodashExternal
	],
	output: {
		file: 'build/bundle-tests.js',
		format: env,
		globals: {
			// 'lodash/random': '_.random'
		},
		exports: 'named' /** Disable warning for default imports */,
		sourcemap: true,
	},
	plugins: [
		multi(),
		babel({
			plugins: ['lodash'],
		}),
		commonjs({
			include: 'node_modules/**',
		}),
	],
};
