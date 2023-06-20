import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import filesize from 'rollup-plugin-filesize';
import postcss from 'rollup-plugin-postcss';
import pkg from './package.json' assert {type: 'json'};

const env = process.env.NODE_ENV;

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
	'lodash/partition',
	'lodash/compact',
	'lodash/maxBy',
	'lodash/minBy',
	'lodash/findIndex',
	'lodash/uniq',
	'lodash/cloneDeep',
	'lodash/omit',
];

export default {
	input: 'src/index.js',
	external: [
		'react/jsx-runtime',
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
		'@gisatcz/deckgl-geolib',
		'moize',
		'leaflet',
		'leaflet/dist/leaflet.css',
		'proj4',
		'proj4leaflet',
		'react-leaflet',
		'@react-leaflet/core',
		'react-loadable',
		'react-resize-detector',
		'webworldwind-esa',
		'react-is',
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
		'@luma.gl/constants',
		'@luma.gl/core',
		'@loaders.gl/core',
		'@mapbox/sphericalmercator',
		'georaster',
		'georaster-layer-for-leaflet',
		/@babel\/runtime/,
		...lodashExternal,
	],
	output: {
		file: {
			es: 'dist/index.es.js',
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
			extract: true,
		}),
		filesize(),
		// Copy all imported images into build folder
		// It is not ideal, images should be in some subfolder and with hashed names
		// images(), // Problem with compile
		image(),
	],
};
