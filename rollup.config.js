import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import alias from "@rollup/plugin-alias";
import filesize from "rollup-plugin-filesize";
import sass from 'rollup-plugin-sass';

const env = process.env.NODE_ENV;
const pkg = require("./package.json");

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
    'prop-types',
    '@gisatcz/ptr-atoms',
    'classnames',
    '@gisatcz/ptr-utils',
    '@gisatcz/ptr-core',
    'leaflet',
    'leaflet/dist/leaflet.css',
    'react-leaflet',
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
    sass({
      output: true,
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