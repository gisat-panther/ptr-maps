import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import path from 'path';
import postcss from 'rollup-plugin-postcss';

const env = process.env.NODE_ENV;
const pkg = require('./package.json');

const CWD = process.cwd();
const Paths = {
	SRC: `${CWD}/src`,
	DIST: `${CWD}/dist`,
	NODE_MODULES: `${CWD}/node_modules`,
};
Object.assign(Paths, {
	INPUT: Paths.SRC + '/index.js',
	OUTPUT: Paths.DIST + '/index.js',
});

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
	'lodash/minBy',
	'lodash/findIndex',
];

export default {
	input: 'src/index.js',
	external: [
		'react',
		'react-dom/server',
		'prop-types',
		'@gisatcz/ptr-atoms',
		'@gisatcz/ptr-tile-grid',
		'classnames',
		'chroma-js',
		'fast-deep-equal',
		'@gisatcz/ptr-utils',
		'@gisatcz/ptr-core',
		'@gisatcz/cross-package-react-context',
		'memoize-one',
		'leaflet',
		'leaflet/dist/leaflet.css',
		'proj4leaflet',
		'react-leaflet',
		'react-loadable',
		'react-resize-detector',
		'react',
		'shallow-equal',
		'webworldwind-esa',
		'js-quadtree',
		'@turf/boolean-point-in-polygon',
		'@turf/center-of-mass',
		'@turf/centroid',
		'@turf/flip',
		'@turf/helpers',
		'@turf/nearest-point',
		'uri-templates',
		...lodashExternal,
	],
	output: {
		file: {
			es: pkg.module,
			cjs: pkg.main,
		}[env],
		format: env,
		globals: {
			// 'lodash/random': '_.random'
		},
		exports: 'named' /** Disable warning for default imports */,
		sourcemap: true,
	},
	plugins: [
		babel({
			plugins: ['lodash'],
		}),
		commonjs({
			include: 'node_modules/**',
		}),
		postcss({
			extract: path.resolve(Paths.DIST + '/style.css'),
		}),
		filesize(),
	],
};
