import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import alias from "@rollup/plugin-alias";
import filesize from "rollup-plugin-filesize";
import postcss from 'rollup-plugin-postcss';
import postcssUrl from './build/plugins/postcssUrl'

const env = process.env.NODE_ENV;
const pkg = require("./package.json");

const CWD = process.cwd()
const Paths = {
  SRC: `${CWD}/src`,
  DIST: `${CWD}/dist`,
  NODE_MODULES: `${CWD}/node_modules`
}
Object.assign(Paths, {
  INPUT: Paths.SRC + '/index.js',
  OUTPUT: Paths.DIST + '/index.js'
})

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
];

export default {
  input: "src/index.js",
  external: [
    'react',
	'react-dom/server',
    'prop-types',
    '@gisatcz/ptr-atoms',
    'classnames',
    'chroma-js',
    'fast-deep-equal',
    '@gisatcz/ptr-utils',
    '@gisatcz/ptr-core',
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
    '@turf/turf',
    'uri-templates',
    ...lodashExternal
  ],
  output: {
    file: {
      es: pkg.module,
      cjs: pkg.main
    }[env],
    format: env,
    globals: {
      // 'lodash/random': '_.random'
    },
    exports: 'named', /** Disable warning for default imports */
    sourcemap: true,
  },
  plugins: [
    babel({
      plugins: ["lodash"],
    }),
    commonjs({
        include: 'node_modules/**',
    }),
    postcss({
      // modules: true,
      extract: 'style.css',
      plugins: [
        ...postcssUrl({
          basePath: [Paths.SRC, Paths.NODE_MODULES],
          assetsPath: Paths.DIST + '/assets',
          dest: Paths.DIST
        })
      ]
    }),
    filesize(),

    // TODO figure out dev and prod version
    // alias({
    //   entries: [
    //     { find: '@gisatcz/ptr-state', replacement: 'C:/Users/pvlach/DATA/ptr-state' }
    //   ]
    // })
  ]
};