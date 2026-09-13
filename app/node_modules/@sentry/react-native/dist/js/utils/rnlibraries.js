/* eslint-disable @typescript-eslint/no-var-requires */
var _a;
import { Platform, TurboModuleRegistry } from 'react-native';
export const ReactNativeLibraries = {
    Devtools: {
        parseErrorStack: (errorStack) => {
            const parseErrorStack = require('react-native/Libraries/Core/Devtools/parseErrorStack');
            return parseErrorStack(errorStack);
        },
        symbolicateStackTrace: (stack, extraData) => {
            const symbolicateStackTrace = require('react-native/Libraries/Core/Devtools/symbolicateStackTrace');
            return symbolicateStackTrace(stack, extraData);
        },
        getDevServer: () => {
            const getDevServer = require('react-native/Libraries/Core/Devtools/getDevServer');
            return getDevServer();
        },
    },
    Promise: require('react-native/Libraries/Promise'),
    Utilities: {
        polyfillGlobal: (name, getValue) => {
            const { polyfillGlobal } = require('react-native/Libraries/Utilities/PolyfillFunctions');
            polyfillGlobal(name, getValue);
        },
    },
    ReactNativeVersion: {
        version: (_a = Platform.constants) === null || _a === void 0 ? void 0 : _a.reactNativeVersion,
    },
    TurboModuleRegistry,
    ReactNative: {
        requireNativeComponent: (viewName) => {
            const { requireNativeComponent } = require('react-native');
            return requireNativeComponent(viewName);
        },
    },
};
//# sourceMappingURL=rnlibraries.js.map