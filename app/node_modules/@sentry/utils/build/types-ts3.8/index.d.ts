import { LRUMap as LRUMap_imported, SentryError as SentryError_imported, SyncPromise as SyncPromise_imported, _asyncNullishCoalesce as _asyncNullishCoalesce_imported, _asyncOptionalChain as _asyncOptionalChain_imported, _asyncOptionalChainDelete as _asyncOptionalChainDelete_imported, _nullishCoalesce as _nullishCoalesce_imported, _optionalChain as _optionalChain_imported, _optionalChainDelete as _optionalChainDelete_imported, addConsoleInstrumentationHandler as addConsoleInstrumentationHandler_imported, addContextToFrame as addContextToFrame_imported, addExceptionMechanism as addExceptionMechanism_imported, addExceptionTypeValue as addExceptionTypeValue_imported, addFetchEndInstrumentationHandler as addFetchEndInstrumentationHandler_imported, addFetchInstrumentationHandler as addFetchInstrumentationHandler_imported, addGlobalErrorInstrumentationHandler as addGlobalErrorInstrumentationHandler_imported, addGlobalUnhandledRejectionInstrumentationHandler as addGlobalUnhandledRejectionInstrumentationHandler_imported, addHandler as addHandler_imported, addItemToEnvelope as addItemToEnvelope_imported, addNonEnumerableProperty as addNonEnumerableProperty_imported, addNormalizedRequestDataToEvent as addNormalizedRequestDataToEvent_imported, addRequestDataToEvent as addRequestDataToEvent_imported, applyAggregateErrorsToEvent as applyAggregateErrorsToEvent_imported, arrayify as arrayify_imported, baggageHeaderToDynamicSamplingContext as baggageHeaderToDynamicSamplingContext_imported, basename as basename_imported, callFrameToStackFrame as callFrameToStackFrame_imported, checkOrSetAlreadyCaught as checkOrSetAlreadyCaught_imported, consoleSandbox as consoleSandbox_imported, convertToPlainObject as convertToPlainObject_imported, createAttachmentEnvelopeItem as createAttachmentEnvelopeItem_imported, createClientReportEnvelope as createClientReportEnvelope_imported, createEnvelope as createEnvelope_imported, createEventEnvelopeHeaders as createEventEnvelopeHeaders_imported, createSpanEnvelopeItem as createSpanEnvelopeItem_imported, createStackParser as createStackParser_imported, dateTimestampInSeconds as dateTimestampInSeconds_imported, dirname as dirname_imported, disabledUntil as disabledUntil_imported, dropUndefinedKeys as dropUndefinedKeys_imported, dsnFromString as dsnFromString_imported, dsnToString as dsnToString_imported, dynamicRequire as dynamicRequire_imported, dynamicSamplingContextToSentryBaggageHeader as dynamicSamplingContextToSentryBaggageHeader_imported, envelopeContainsItemType as envelopeContainsItemType_imported, envelopeItemTypeToDataCategory as envelopeItemTypeToDataCategory_imported, escapeStringForRegex as escapeStringForRegex_imported, eventFromMessage as eventFromMessage_imported, eventFromUnknownInput as eventFromUnknownInput_imported, exceptionFromError as exceptionFromError_imported, extractExceptionKeysForMessage as extractExceptionKeysForMessage_imported, extractPathForTransaction as extractPathForTransaction_imported, extractRequestData as extractRequestData_imported, extractTraceparentData as extractTraceparentData_imported, filenameIsInApp as filenameIsInApp_imported, fill as fill_imported, flatten as flatten_imported, forEachEnvelopeItem as forEachEnvelopeItem_imported, generatePropagationContext as generatePropagationContext_imported, generateSentryTraceHeader as generateSentryTraceHeader_imported, getBreadcrumbLogLevelFromHttpStatusCode as getBreadcrumbLogLevelFromHttpStatusCode_imported, getComponentName as getComponentName_imported, getDebugImagesForResources as getDebugImagesForResources_imported, getDomElement as getDomElement_imported, getEventDescription as getEventDescription_imported, getFilenameToDebugIdMap as getFilenameToDebugIdMap_imported, getFramesFromEvent as getFramesFromEvent_imported, getFunctionName as getFunctionName_imported, getGlobalSingleton as getGlobalSingleton_imported, getLocationHref as getLocationHref_imported, getNumberOfUrlSegments as getNumberOfUrlSegments_imported, getOriginalFunction as getOriginalFunction_imported, getSDKSource as getSDKSource_imported, getSanitizedUrlString as getSanitizedUrlString_imported, getSdkMetadataForEnvelopeHeader as getSdkMetadataForEnvelopeHeader_imported, htmlTreeAsString as htmlTreeAsString_imported, isAbsolute as isAbsolute_imported, isBrowser as isBrowser_imported, isBrowserBundle as isBrowserBundle_imported, isDOMError as isDOMError_imported, isDOMException as isDOMException_imported, isElement as isElement_imported, isError as isError_imported, isErrorEvent as isErrorEvent_imported, isEvent as isEvent_imported, isInstanceOf as isInstanceOf_imported, isMatchingPattern as isMatchingPattern_imported, isNativeFunction as isNativeFunction_imported, isNodeEnv as isNodeEnv_imported, isParameterizedString as isParameterizedString_imported, isPlainObject as isPlainObject_imported, isPrimitive as isPrimitive_imported, isRateLimited as isRateLimited_imported, isRegExp as isRegExp_imported, isString as isString_imported, isSyntheticEvent as isSyntheticEvent_imported, isThenable as isThenable_imported, isVueViewModel as isVueViewModel_imported, join as join_imported, loadModule as loadModule_imported, makeDsn as makeDsn_imported, makeFifoCache as makeFifoCache_imported, makePromiseBuffer as makePromiseBuffer_imported, markFunctionWrapped as markFunctionWrapped_imported, maybeInstrument as maybeInstrument_imported, memoBuilder as memoBuilder_imported, node as node_imported, nodeStackLineParser as nodeStackLineParser_imported, normalize as normalize_imported, normalizePath as normalizePath_imported, normalizeToSize as normalizeToSize_imported, normalizeUrlToBase as normalizeUrlToBase_imported, objectify as objectify_imported, parseBaggageHeader as parseBaggageHeader_imported, parseEnvelope as parseEnvelope_imported, parseRetryAfterHeader as parseRetryAfterHeader_imported, parseSemver as parseSemver_imported, parseStackFrames as parseStackFrames_imported, parseUrl as parseUrl_imported, propagationContextFromHeaders as propagationContextFromHeaders_imported, rejectedSyncPromise as rejectedSyncPromise_imported, relative as relative_imported, resetInstrumentationHandlers as resetInstrumentationHandlers_imported, resolve as resolve_imported, resolvedSyncPromise as resolvedSyncPromise_imported, safeJoin as safeJoin_imported, serializeEnvelope as serializeEnvelope_imported, severityLevelFromString as severityLevelFromString_imported, snipLine as snipLine_imported, stackParserFromStackParserOptions as stackParserFromStackParserOptions_imported, stringMatchesSomePattern as stringMatchesSomePattern_imported, stripSentryFramesAndReverse as stripSentryFramesAndReverse_imported, stripUrlQueryAndFragment as stripUrlQueryAndFragment_imported, supportsDOMError as supportsDOMError_imported, supportsDOMException as supportsDOMException_imported, supportsErrorEvent as supportsErrorEvent_imported, supportsFetch as supportsFetch_imported, supportsHistory as supportsHistory_imported, supportsNativeFetch as supportsNativeFetch_imported, supportsReferrerPolicy as supportsReferrerPolicy_imported, supportsReportingObserver as supportsReportingObserver_imported, triggerHandlers as triggerHandlers_imported, truncate as truncate_imported, updateRateLimits as updateRateLimits_imported, urlEncode as urlEncode_imported, uuid4 as uuid4_imported, vercelWaitUntil as vercelWaitUntil_imported, watchdogTimer as watchdogTimer_imported, winterCGHeadersToDict as winterCGHeadersToDict_imported, winterCGRequestToRequestData as winterCGRequestToRequestData_imported } from '@sentry/core';
/** @deprecated Import from `@sentry/core` instead. */
export declare const applyAggregateErrorsToEvent: typeof applyAggregateErrorsToEvent_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const getBreadcrumbLogLevelFromHttpStatusCode: typeof getBreadcrumbLogLevelFromHttpStatusCode_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const dsnFromString: typeof dsnFromString_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const dsnToString: typeof dsnToString_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const makeDsn: typeof makeDsn_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const SentryError: typeof SentryError_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const GLOBAL_OBJ: InternalGlobal_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const getGlobalSingleton: typeof getGlobalSingleton_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const addConsoleInstrumentationHandler: typeof addConsoleInstrumentationHandler_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const addFetchEndInstrumentationHandler: typeof addFetchEndInstrumentationHandler_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const addFetchInstrumentationHandler: typeof addFetchInstrumentationHandler_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const addGlobalErrorInstrumentationHandler: typeof addGlobalErrorInstrumentationHandler_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const addGlobalUnhandledRejectionInstrumentationHandler: typeof addGlobalUnhandledRejectionInstrumentationHandler_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const addHandler: typeof addHandler_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const maybeInstrument: typeof maybeInstrument_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const resetInstrumentationHandlers: typeof resetInstrumentationHandlers_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const triggerHandlers: typeof triggerHandlers_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isDOMError: typeof isDOMError_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isDOMException: typeof isDOMException_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isElement: typeof isElement_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isError: typeof isError_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isErrorEvent: typeof isErrorEvent_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isEvent: typeof isEvent_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isInstanceOf: typeof isInstanceOf_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isParameterizedString: typeof isParameterizedString_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isPlainObject: typeof isPlainObject_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isPrimitive: typeof isPrimitive_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isRegExp: typeof isRegExp_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isString: typeof isString_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isSyntheticEvent: typeof isSyntheticEvent_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isThenable: typeof isThenable_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isVueViewModel: typeof isVueViewModel_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isBrowser: typeof isBrowser_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const CONSOLE_LEVELS: readonly import("@sentry/core").ConsoleLevel[];
/** @deprecated Import from `@sentry/core` instead. */
export declare const consoleSandbox: typeof consoleSandbox_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const logger: import("@sentry/core/build/types/utils-hoist/logger").Logger;
/** @deprecated Import from `@sentry/core` instead. */
export declare const originalConsoleMethods: {
    debug?: ((...args: unknown[]) => void) | undefined;
    info?: ((...args: unknown[]) => void) | undefined;
    warn?: ((...args: unknown[]) => void) | undefined;
    error?: ((...args: unknown[]) => void) | undefined;
    log?: ((...args: unknown[]) => void) | undefined;
    assert?: ((...args: unknown[]) => void) | undefined;
    trace?: ((...args: unknown[]) => void) | undefined;
};
/** @deprecated Import from `@sentry/core` instead. */
export declare const addContextToFrame: typeof addContextToFrame_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const addExceptionMechanism: typeof addExceptionMechanism_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const addExceptionTypeValue: typeof addExceptionTypeValue_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const checkOrSetAlreadyCaught: typeof checkOrSetAlreadyCaught_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const getEventDescription: typeof getEventDescription_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const parseSemver: typeof parseSemver_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const uuid4: typeof uuid4_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const normalize: typeof normalize_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const normalizeToSize: typeof normalizeToSize_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const addNonEnumerableProperty: typeof addNonEnumerableProperty_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const convertToPlainObject: typeof convertToPlainObject_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const dropUndefinedKeys: typeof dropUndefinedKeys_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const extractExceptionKeysForMessage: typeof extractExceptionKeysForMessage_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const fill: typeof fill_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const getOriginalFunction: typeof getOriginalFunction_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const markFunctionWrapped: typeof markFunctionWrapped_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const objectify: typeof objectify_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const makePromiseBuffer: typeof makePromiseBuffer_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const addNormalizedRequestDataToEvent: typeof addNormalizedRequestDataToEvent_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const winterCGHeadersToDict: typeof winterCGHeadersToDict_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const winterCGRequestToRequestData: typeof winterCGRequestToRequestData_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const severityLevelFromString: typeof severityLevelFromString_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const validSeverityLevels: string[];
/** @deprecated Import from `@sentry/core` instead. */
export declare const UNKNOWN_FUNCTION = "?";
/** @deprecated Import from `@sentry/core` instead. */
export declare const createStackParser: typeof createStackParser_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const getFramesFromEvent: typeof getFramesFromEvent_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const getFunctionName: typeof getFunctionName_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const stackParserFromStackParserOptions: typeof stackParserFromStackParserOptions_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const stripSentryFramesAndReverse: typeof stripSentryFramesAndReverse_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const filenameIsInApp: typeof filenameIsInApp_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const node: typeof node_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const nodeStackLineParser: typeof nodeStackLineParser_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isMatchingPattern: typeof isMatchingPattern_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const safeJoin: typeof safeJoin_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const snipLine: typeof snipLine_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const stringMatchesSomePattern: typeof stringMatchesSomePattern_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const truncate: typeof truncate_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const SyncPromise: typeof SyncPromise_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const rejectedSyncPromise: typeof rejectedSyncPromise_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const resolvedSyncPromise: typeof resolvedSyncPromise_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const dateTimestampInSeconds: typeof dateTimestampInSeconds_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const timestampInSeconds: () => number;
/** @deprecated Import from `@sentry/core` instead. */
export declare const TRACEPARENT_REGEXP: RegExp;
/** @deprecated Import from `@sentry/core` instead. */
export declare const extractTraceparentData: typeof extractTraceparentData_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const generateSentryTraceHeader: typeof generateSentryTraceHeader_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const propagationContextFromHeaders: typeof propagationContextFromHeaders_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const getSDKSource: typeof getSDKSource_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isBrowserBundle: typeof isBrowserBundle_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const MAX_BAGGAGE_STRING_LENGTH = 8192;
/** @deprecated Import from `@sentry/core` instead. */
export declare const SENTRY_BAGGAGE_KEY_PREFIX = "sentry-";
/** @deprecated Import from `@sentry/core` instead. */
export declare const SENTRY_BAGGAGE_KEY_PREFIX_REGEX: RegExp;
/** @deprecated Import from `@sentry/core` instead. */
export declare const baggageHeaderToDynamicSamplingContext: typeof baggageHeaderToDynamicSamplingContext_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const dynamicSamplingContextToSentryBaggageHeader: typeof dynamicSamplingContextToSentryBaggageHeader_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const parseBaggageHeader: typeof parseBaggageHeader_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const addItemToEnvelope: typeof addItemToEnvelope_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const createAttachmentEnvelopeItem: typeof createAttachmentEnvelopeItem_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const createEnvelope: typeof createEnvelope_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const createEventEnvelopeHeaders: typeof createEventEnvelopeHeaders_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const createSpanEnvelopeItem: typeof createSpanEnvelopeItem_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const envelopeContainsItemType: typeof envelopeContainsItemType_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const envelopeItemTypeToDataCategory: typeof envelopeItemTypeToDataCategory_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const forEachEnvelopeItem: typeof forEachEnvelopeItem_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const getSdkMetadataForEnvelopeHeader: typeof getSdkMetadataForEnvelopeHeader_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const parseEnvelope: typeof parseEnvelope_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const serializeEnvelope: typeof serializeEnvelope_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const createClientReportEnvelope: typeof createClientReportEnvelope_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const DEFAULT_RETRY_AFTER: number;
/** @deprecated Import from `@sentry/core` instead. */
export declare const disabledUntil: typeof disabledUntil_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isRateLimited: typeof isRateLimited_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const parseRetryAfterHeader: typeof parseRetryAfterHeader_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const updateRateLimits: typeof updateRateLimits_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const eventFromMessage: typeof eventFromMessage_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const eventFromUnknownInput: typeof eventFromUnknownInput_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const exceptionFromError: typeof exceptionFromError_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const parseStackFrames: typeof parseStackFrames_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const callFrameToStackFrame: typeof callFrameToStackFrame_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const watchdogTimer: typeof watchdogTimer_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const LRUMap: typeof LRUMap_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const generatePropagationContext: typeof generatePropagationContext_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const vercelWaitUntil: typeof vercelWaitUntil_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const SDK_VERSION: string;
/** @deprecated Import from `@sentry/core` instead. */
export declare const getDebugImagesForResources: typeof getDebugImagesForResources_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const getFilenameToDebugIdMap: typeof getFilenameToDebugIdMap_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const escapeStringForRegex: typeof escapeStringForRegex_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const basename: typeof basename_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const dirname: typeof dirname_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isAbsolute: typeof isAbsolute_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const join: typeof join_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const normalizePath: typeof normalizePath_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const relative: typeof relative_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const resolve: typeof resolve_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const getComponentName: typeof getComponentName_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const getDomElement: typeof getDomElement_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const getLocationHref: typeof getLocationHref_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const htmlTreeAsString: typeof htmlTreeAsString_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isNativeFunction: typeof isNativeFunction_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const supportsDOMError: typeof supportsDOMError_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const supportsDOMException: typeof supportsDOMException_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const supportsErrorEvent: typeof supportsErrorEvent_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const supportsFetch: typeof supportsFetch_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const supportsNativeFetch: typeof supportsNativeFetch_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const supportsReferrerPolicy: typeof supportsReferrerPolicy_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const supportsReportingObserver: typeof supportsReportingObserver_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const _browserPerformanceTimeOriginMode: string;
/** @deprecated Import from `@sentry/core` instead. */
export declare const browserPerformanceTimeOrigin: number | undefined;
/** @deprecated Import from `@sentry/core` instead. */
export declare const supportsHistory: typeof supportsHistory_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const dynamicRequire: typeof dynamicRequire_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const isNodeEnv: typeof isNodeEnv_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const loadModule: typeof loadModule_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const flatten: typeof flatten_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const memoBuilder: typeof memoBuilder_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const arrayify: typeof arrayify_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const normalizeUrlToBase: typeof normalizeUrlToBase_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const urlEncode: typeof urlEncode_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const extractPathForTransaction: typeof extractPathForTransaction_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const DEFAULT_USER_INCLUDES: string[];
/** @deprecated Import from `@sentry/core` instead. */
export declare const extractRequestData: typeof extractRequestData_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const addRequestDataToEvent: typeof addRequestDataToEvent_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const _asyncNullishCoalesce: typeof _asyncNullishCoalesce_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const _asyncOptionalChain: typeof _asyncOptionalChain_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const _asyncOptionalChainDelete: typeof _asyncOptionalChainDelete_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const _nullishCoalesce: typeof _nullishCoalesce_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const _optionalChain: typeof _optionalChain_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const _optionalChainDelete: typeof _optionalChainDelete_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const BAGGAGE_HEADER_NAME = "baggage";
/** @deprecated Import from `@sentry/core` instead. */
export declare const getNumberOfUrlSegments: typeof getNumberOfUrlSegments_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const getSanitizedUrlString: typeof getSanitizedUrlString_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const parseUrl: typeof parseUrl_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const stripUrlQueryAndFragment: typeof stripUrlQueryAndFragment_imported;
/** @deprecated Import from `@sentry/core` instead. */
export declare const makeFifoCache: typeof makeFifoCache_imported;
import { AddRequestDataToEventOptions as AddRequestDataToEventOptions_imported, InternalGlobal as InternalGlobal_imported, PromiseBuffer as PromiseBuffer_imported, RateLimits as RateLimits_imported, SdkSource as SdkSource_imported, TransactionNamingScheme as TransactionNamingScheme_imported } from '@sentry/core';
/** @deprecated Import from `@sentry/core` instead. */
export type InternalGlobal = InternalGlobal_imported;
/** @deprecated Import from `@sentry/core` instead. */
export type SdkSource = SdkSource_imported;
/** @deprecated Import from `@sentry/core` instead. */
export type RateLimits = RateLimits_imported;
/** @deprecated Import from `@sentry/core` instead. */
export type AddRequestDataToEventOptions = AddRequestDataToEventOptions_imported;
/** @deprecated Import from `@sentry/core` instead. */
export type PromiseBuffer<T> = PromiseBuffer_imported<T>;
/** @deprecated Import from `@sentry/core` instead. */
export type TransactionNamingScheme = TransactionNamingScheme_imported;
//# sourceMappingURL=index.d.ts.map
