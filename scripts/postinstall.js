var path = require('path');
var prepend = require('prepend-file');
var findUp = require('find-up');
var replace = require('replace-in-file');

// path of local instance of Leaflet
var localLeafletPath = ['node_modules', 'leaflet', 'dist', 'leaflet-src.js'];
// path of Leaflet if ptr-maps is installed as a module
var linkedPtrMapsLeafletPath = [
	'..',
	'..',
	'leaflet',
	'dist',
	'leaflet-src.js',
];
// path of local instance of WebWorldWind
var localWebWorldWindPath = [
	'node_modules',
	'webworldwind-esa',
	'build',
	'dist',
	'worldwind.min.js',
];
// path of WebWorldWind if ptr-maps is installed as a module
var linkedPtrMapsWebWorldWindPath = [
	'..',
	'..',
	'webworldwind-esa',
	'build',
	'dist',
	'worldwind.min.js',
];

var filesToFix = [
	localLeafletPath,
	linkedPtrMapsLeafletPath,
	localWebWorldWindPath,
	linkedPtrMapsWebWorldWindPath,
];

//mock window, document & navigator global objects
var FIXED_CODE = `// < HACK >
    var fakeWindow = {
    navigator: {
        userAgent: '',
      },
      location: {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        protocol: '',
        search: '',
      },
      history: {
        replaceState: () => {},
        pushState: () => {},
        go: () => {},
        back: () => {},
      },
      CustomEvent: () => {
        return this;
      },
      addEventListener: () => {},
      removeEventListener: () => {},
      getComputedStyle: () => {
        return {
          getPropertyValue: () => {
            return '';
          },
        };
      },
      Image: () => {},
      Date: () => {},
      screen: {},
      setTimeout: () => {},
      clearTimeout: () => {},
      matchMedia: () => {
        return {};
      },
      requestAnimationFrame(callback) {
        if (typeof setTimeout === 'undefined') {
          callback();
          return null;
        }
        return setTimeout(callback, 0);
      },
      cancelAnimationFrame(id) {
        if (typeof setTimeout === 'undefined') {
          return;
        }
        clearTimeout(id);
      }
    };

    var fakeNavigator = {
        platform: '',
        userAgent: ''
    };
    var fakeDocument = {
        body: {},
        addEventListener: () => {},
        removeEventListener: () => {},
        activeElement: {
          blur: () => {},
          nodeName: '',
        },
        querySelector: () => {
          return null;
        },
        querySelectorAll: () => {
          return [];
        },
        getElementById: () => {
          return null;
        },
        createEvent: () => {
          return {
            initEvent: () => {},
          };
        },
        createElement: () => {
          return {
            children: [],
            childNodes: [],
            style: {},
            setAttribute: () => {},
            getElementsByTagName: () => {
              return [];
            },
          };
        },
        createElementNS: () => {
          return {};
        },
        importNode: () => {
          return null;
        },
        location: {
          hash: '',
          host: '',
          hostname: '',
          href: '',
          origin: '',
          pathname: '',
          protocol: '',
          search: '',
        },
        documentElement: {style: {}},
        getElementsByTagName: () => {return []}
      };

      if(typeof window === 'undefined') {
          var window = fakeWindow;
          var document = fakeDocument;
          var navigator = fakeNavigator;
      }
// </ HACK >
`;

function modifyFiles(filePath) {
	findUp('.', {type: 'directory'}).then(nodeModules => {
		var completeFilePath = path.resolve.apply(
			path,
			[nodeModules].concat(filePath)
		);

		//prevent endeless adding modified code to files
		var replace_options = {
			files: completeFilePath,
			from: /\/\/ < HACK >[\s\S]*?\/\/ <\/ HACK >[\s]*/g,
			to: '',
		};

		try {
			replace.sync(replace_options);
			console.log('Modified files:', replace_options.files.join(', '));
			prepend(completeFilePath, FIXED_CODE, console.log);
		} catch (error) {
			console.error('Error occurred:', error);
		}
	});
}

filesToFix.forEach(modifyFiles);
