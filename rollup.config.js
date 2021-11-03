import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
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
	'lodash/flatten',
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
	'lodash/uniq',
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
		'proj4',
		'proj4leaflet',
		'react-leaflet',
		'@react-leaflet/core',
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
		'@deck.gl/core',
		'@deck.gl/react',
		'@deck.gl/geo-layers',
		'@deck.gl/layers',
		'georaster',
		'georaster-layer-for-leaflet',
		/@babel\/runtime/,
		...lodashExternal,
	],
	output: {
		file: {
			es: pkg.module,
			cjs: pkg.main,
		}[env],
		format: env,
		globals: {
			proj4: 'proj4',
			// 'lodash/random': '_.random'
		},
		exports: 'named' /** Disable warning for default imports */,
		sourcemap: true,
	},
	plugins: [
		babel({
			plugins: ['lodash'],
			babelHelpers: 'runtime',
		}),
		commonjs({
			include: 'node_modules/**',
		}),
		postcss({
			extract: path.resolve(Paths.DIST + '/style.css'),
		}),
		filesize(),
		// Copy all imported images into build folder
		// It is not ideal, images should be in some subfolder and with hashed names
		// images(), // Problem with compile
		image(),
	],
};
