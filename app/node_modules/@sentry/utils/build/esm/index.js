import {
  _asyncNullishCoalesce,
  _asyncOptionalChain,
  _asyncOptionalChainDelete,
  _nullishCoalesce,
  _optionalChain,
  _optionalChainDelete,
} from '@sentry/core';

import { applyAggregateErrorsToEvent as applyAggregateErrorsToEvent$1, getBreadcrumbLogLevelFromHttpStatusCode as getBreadcrumbLogLevelFromHttpStatusCode$1, dsnFromString as dsnFromString$1, dsnToString as dsnToString$1, makeDsn as makeDsn$1, SentryError as SentryError$1, GLOBAL_OBJ as GLOBAL_OBJ$1, getGlobalSingleton as getGlobalSingleton$1, addConsoleInstrumentationHandler as addConsoleInstrumentationHandler$1, addFetchEndInstrumentationHandler as addFetchEndInstrumentationHandler$1, addFetchInstrumentationHandler as addFetchInstrumentationHandler$1, addGlobalErrorInstrumentationHandler as addGlobalErrorInstrumentationHandler$1, addGlobalUnhandledRejectionInstrumentationHandler as addGlobalUnhandledRejectionInstrumentationHandler$1, addHandler as addHandler$1, maybeInstrument as maybeInstrument$1, resetInstrumentationHandlers as resetInstrumentationHandlers$1, triggerHandlers as triggerHandlers$1, isDOMError as isDOMError$1, isDOMException as isDOMException$1, isElement as isElement$1, isError as isError$1, isErrorEvent as isErrorEvent$1, isEvent as isEvent$1, isInstanceOf as isInstanceOf$1, isParameterizedString as isParameterizedString$1, isPlainObject as isPlainObject$1, isPrimitive as isPrimitive$1, isRegExp as isRegExp$1, isString as isString$1, isSyntheticEvent as isSyntheticEvent$1, isThenable as isThenable$1, isVueViewModel as isVueViewModel$1, isBrowser as isBrowser$1, CONSOLE_LEVELS as CONSOLE_LEVELS$1, consoleSandbox as consoleSandbox$1, logger as logger$1, originalConsoleMethods as originalConsoleMethods$1, addContextToFrame as addContextToFrame$1, addExceptionMechanism as addExceptionMechanism$1, addExceptionTypeValue as addExceptionTypeValue$1, checkOrSetAlreadyCaught as checkOrSetAlreadyCaught$1, getEventDescription as getEventDescription$1, parseSemver as parseSemver$1, uuid4 as uuid4$1, normalize as normalize$1, normalizeToSize as normalizeToSize$1, addNonEnumerableProperty as addNonEnumerableProperty$1, convertToPlainObject as convertToPlainObject$1, dropUndefinedKeys as dropUndefinedKeys$1, extractExceptionKeysForMessage as extractExceptionKeysForMessage$1, fill as fill$1, getOriginalFunction as getOriginalFunction$1, markFunctionWrapped as markFunctionWrapped$1, objectify as objectify$1, makePromiseBuffer as makePromiseBuffer$1, addNormalizedRequestDataToEvent as addNormalizedRequestDataToEvent$1, winterCGHeadersToDict as winterCGHeadersToDict$1, winterCGRequestToRequestData as winterCGRequestToRequestData$1, severityLevelFromString as severityLevelFromString$1, validSeverityLevels as validSeverityLevels$1, UNKNOWN_FUNCTION as UNKNOWN_FUNCTION$1, createStackParser as createStackParser$1, getFramesFromEvent as getFramesFromEvent$1, getFunctionName as getFunctionName$1, stackParserFromStackParserOptions as stackParserFromStackParserOptions$1, stripSentryFramesAndReverse as stripSentryFramesAndReverse$1, filenameIsInApp as filenameIsInApp$1, node as node$1, nodeStackLineParser as nodeStackLineParser$1, isMatchingPattern as isMatchingPattern$1, safeJoin as safeJoin$1, snipLine as snipLine$1, stringMatchesSomePattern as stringMatchesSomePattern$1, truncate as truncate$1, SyncPromise as SyncPromise$1, rejectedSyncPromise as rejectedSyncPromise$1, resolvedSyncPromise as resolvedSyncPromise$1, dateTimestampInSeconds as dateTimestampInSeconds$1, timestampInSeconds as timestampInSeconds$1, TRACEPARENT_REGEXP as TRACEPARENT_REGEXP$1, extractTraceparentData as extractTraceparentData$1, generateSentryTraceHeader as generateSentryTraceHeader$1, propagationContextFromHeaders as propagationContextFromHeaders$1, getSDKSource as getSDKSource$1, isBrowserBundle as isBrowserBundle$1, MAX_BAGGAGE_STRING_LENGTH as MAX_BAGGAGE_STRING_LENGTH$1, SENTRY_BAGGAGE_KEY_PREFIX as SENTRY_BAGGAGE_KEY_PREFIX$1, SENTRY_BAGGAGE_KEY_PREFIX_REGEX as SENTRY_BAGGAGE_KEY_PREFIX_REGEX$1, baggageHeaderToDynamicSamplingContext as baggageHeaderToDynamicSamplingContext$1, dynamicSamplingContextToSentryBaggageHeader as dynamicSamplingContextToSentryBaggageHeader$1, parseBaggageHeader as parseBaggageHeader$1, addItemToEnvelope as addItemToEnvelope$1, createAttachmentEnvelopeItem as createAttachmentEnvelopeItem$1, createEnvelope as createEnvelope$1, createEventEnvelopeHeaders as createEventEnvelopeHeaders$1, createSpanEnvelopeItem as createSpanEnvelopeItem$1, envelopeContainsItemType as envelopeContainsItemType$1, envelopeItemTypeToDataCategory as envelopeItemTypeToDataCategory$1, forEachEnvelopeItem as forEachEnvelopeItem$1, getSdkMetadataForEnvelopeHeader as getSdkMetadataForEnvelopeHeader$1, parseEnvelope as parseEnvelope$1, serializeEnvelope as serializeEnvelope$1, createClientReportEnvelope as createClientReportEnvelope$1, DEFAULT_RETRY_AFTER as DEFAULT_RETRY_AFTER$1, disabledUntil as disabledUntil$1, isRateLimited as isRateLimited$1, parseRetryAfterHeader as parseRetryAfterHeader$1, updateRateLimits as updateRateLimits$1, eventFromMessage as eventFromMessage$1, eventFromUnknownInput as eventFromUnknownInput$1, exceptionFromError as exceptionFromError$1, parseStackFrames as parseStackFrames$1, callFrameToStackFrame as callFrameToStackFrame$1, watchdogTimer as watchdogTimer$1, LRUMap as LRUMap$1, generatePropagationContext as generatePropagationContext$1, vercelWaitUntil as vercelWaitUntil$1, SDK_VERSION as SDK_VERSION$1, getDebugImagesForResources as getDebugImagesForResources$1, getFilenameToDebugIdMap as getFilenameToDebugIdMap$1, escapeStringForRegex as escapeStringForRegex$1, basename as basename$1, dirname as dirname$1, isAbsolute as isAbsolute$1, join as join$1, normalizePath as normalizePath$1, relative as relative$1, resolve as resolve$1, getComponentName as getComponentName$1, getDomElement as getDomElement$1, getLocationHref as getLocationHref$1, htmlTreeAsString as htmlTreeAsString$1, isNativeFunction as isNativeFunction$1, supportsDOMError as supportsDOMError$1, supportsDOMException as supportsDOMException$1, supportsErrorEvent as supportsErrorEvent$1, supportsFetch as supportsFetch$1, supportsNativeFetch as supportsNativeFetch$1, supportsReferrerPolicy as supportsReferrerPolicy$1, supportsReportingObserver as supportsReportingObserver$1, _browserPerformanceTimeOriginMode as _browserPerformanceTimeOriginMode$1, browserPerformanceTimeOrigin as browserPerformanceTimeOrigin$1, supportsHistory as supportsHistory$1, dynamicRequire as dynamicRequire$1, isNodeEnv as isNodeEnv$1, loadModule as loadModule$1, flatten as flatten$1, memoBuilder as memoBuilder$1, arrayify as arrayify$1, normalizeUrlToBase as normalizeUrlToBase$1, urlEncode as urlEncode$1, extractPathForTransaction as extractPathForTransaction$1, DEFAULT_USER_INCLUDES as DEFAULT_USER_INCLUDES$1, extractRequestData as extractRequestData$1, addRequestDataToEvent as addRequestDataToEvent$1, _asyncNullishCoalesce as _asyncNullishCoalesce$1, _asyncOptionalChain as _asyncOptionalChain$1, _asyncOptionalChainDelete as _asyncOptionalChainDelete$1, _nullishCoalesce as _nullishCoalesce$1, _optionalChain as _optionalChain$1, _optionalChainDelete as _optionalChainDelete$1, BAGGAGE_HEADER_NAME as BAGGAGE_HEADER_NAME$1, getNumberOfUrlSegments as getNumberOfUrlSegments$1, getSanitizedUrlString as getSanitizedUrlString$1, parseUrl as parseUrl$1, stripUrlQueryAndFragment as stripUrlQueryAndFragment$1, makeFifoCache as makeFifoCache$1 } from '@sentry/core';

/* eslint-disable max-lines */

/** @deprecated Import from `@sentry/core` instead. */
const applyAggregateErrorsToEvent = applyAggregateErrorsToEvent$1;

/** @deprecated Import from `@sentry/core` instead. */
const getBreadcrumbLogLevelFromHttpStatusCode = getBreadcrumbLogLevelFromHttpStatusCode$1;

/** @deprecated Import from `@sentry/core` instead. */
const dsnFromString = dsnFromString$1;

/** @deprecated Import from `@sentry/core` instead. */
const dsnToString = dsnToString$1;

/** @deprecated Import from `@sentry/core` instead. */
const makeDsn = makeDsn$1;

/** @deprecated Import from `@sentry/core` instead. */
const SentryError = SentryError$1;

/** @deprecated Import from `@sentry/core` instead. */
const GLOBAL_OBJ = GLOBAL_OBJ$1;

/** @deprecated Import from `@sentry/core` instead. */
const getGlobalSingleton = getGlobalSingleton$1;

/** @deprecated Import from `@sentry/core` instead. */
const addConsoleInstrumentationHandler = addConsoleInstrumentationHandler$1;

/** @deprecated Import from `@sentry/core` instead. */
const addFetchEndInstrumentationHandler = addFetchEndInstrumentationHandler$1;

/** @deprecated Import from `@sentry/core` instead. */
const addFetchInstrumentationHandler = addFetchInstrumentationHandler$1;

/** @deprecated Import from `@sentry/core` instead. */
const addGlobalErrorInstrumentationHandler = addGlobalErrorInstrumentationHandler$1;

/** @deprecated Import from `@sentry/core` instead. */
const addGlobalUnhandledRejectionInstrumentationHandler =
  addGlobalUnhandledRejectionInstrumentationHandler$1;

/** @deprecated Import from `@sentry/core` instead. */
const addHandler = addHandler$1;

/** @deprecated Import from `@sentry/core` instead. */
const maybeInstrument = maybeInstrument$1;

/** @deprecated Import from `@sentry/core` instead. */
const resetInstrumentationHandlers = resetInstrumentationHandlers$1;

/** @deprecated Import from `@sentry/core` instead. */
const triggerHandlers = triggerHandlers$1;

/** @deprecated Import from `@sentry/core` instead. */
const isDOMError = isDOMError$1;

/** @deprecated Import from `@sentry/core` instead. */
const isDOMException = isDOMException$1;

/** @deprecated Import from `@sentry/core` instead. */
const isElement = isElement$1;

/** @deprecated Import from `@sentry/core` instead. */
const isError = isError$1;

/** @deprecated Import from `@sentry/core` instead. */
const isErrorEvent = isErrorEvent$1;

/** @deprecated Import from `@sentry/core` instead. */
const isEvent = isEvent$1;

/** @deprecated Import from `@sentry/core` instead. */
const isInstanceOf = isInstanceOf$1;

/** @deprecated Import from `@sentry/core` instead. */
const isParameterizedString = isParameterizedString$1;

/** @deprecated Import from `@sentry/core` instead. */
const isPlainObject = isPlainObject$1;

/** @deprecated Import from `@sentry/core` instead. */
const isPrimitive = isPrimitive$1;

/** @deprecated Import from `@sentry/core` instead. */
const isRegExp = isRegExp$1;

/** @deprecated Import from `@sentry/core` instead. */
const isString = isString$1;

/** @deprecated Import from `@sentry/core` instead. */
const isSyntheticEvent = isSyntheticEvent$1;

/** @deprecated Import from `@sentry/core` instead. */
const isThenable = isThenable$1;

/** @deprecated Import from `@sentry/core` instead. */
const isVueViewModel = isVueViewModel$1;

/** @deprecated Import from `@sentry/core` instead. */
const isBrowser = isBrowser$1;

/** @deprecated Import from `@sentry/core` instead. */
const CONSOLE_LEVELS = CONSOLE_LEVELS$1;

/** @deprecated Import from `@sentry/core` instead. */
const consoleSandbox = consoleSandbox$1;

/** @deprecated Import from `@sentry/core` instead. */
const logger = logger$1;

/** @deprecated Import from `@sentry/core` instead. */
const originalConsoleMethods = originalConsoleMethods$1;

/** @deprecated Import from `@sentry/core` instead. */
const addContextToFrame = addContextToFrame$1;

/** @deprecated Import from `@sentry/core` instead. */
const addExceptionMechanism = addExceptionMechanism$1;

/** @deprecated Import from `@sentry/core` instead. */
const addExceptionTypeValue = addExceptionTypeValue$1;

/** @deprecated Import from `@sentry/core` instead. */
const checkOrSetAlreadyCaught = checkOrSetAlreadyCaught$1;

/** @deprecated Import from `@sentry/core` instead. */
const getEventDescription = getEventDescription$1;

/** @deprecated Import from `@sentry/core` instead. */
const parseSemver = parseSemver$1;

/** @deprecated Import from `@sentry/core` instead. */
const uuid4 = uuid4$1;

/** @deprecated Import from `@sentry/core` instead. */
const normalize = normalize$1;

/** @deprecated Import from `@sentry/core` instead. */
const normalizeToSize = normalizeToSize$1;

/** @deprecated Import from `@sentry/core` instead. */
const addNonEnumerableProperty = addNonEnumerableProperty$1;

/** @deprecated Import from `@sentry/core` instead. */
const convertToPlainObject = convertToPlainObject$1;

/** @deprecated Import from `@sentry/core` instead. */
const dropUndefinedKeys = dropUndefinedKeys$1;

/** @deprecated Import from `@sentry/core` instead. */
const extractExceptionKeysForMessage = extractExceptionKeysForMessage$1;

/** @deprecated Import from `@sentry/core` instead. */
const fill = fill$1;

/** @deprecated Import from `@sentry/core` instead. */
const getOriginalFunction = getOriginalFunction$1;

/** @deprecated Import from `@sentry/core` instead. */
const markFunctionWrapped = markFunctionWrapped$1;

/** @deprecated Import from `@sentry/core` instead. */
const objectify = objectify$1;

/** @deprecated Import from `@sentry/core` instead. */
const makePromiseBuffer = makePromiseBuffer$1;

/** @deprecated Import from `@sentry/core` instead. */
const addNormalizedRequestDataToEvent = addNormalizedRequestDataToEvent$1;

/** @deprecated Import from `@sentry/core` instead. */
const winterCGHeadersToDict = winterCGHeadersToDict$1;

/** @deprecated Import from `@sentry/core` instead. */
const winterCGRequestToRequestData = winterCGRequestToRequestData$1;

/** @deprecated Import from `@sentry/core` instead. */
const severityLevelFromString = severityLevelFromString$1;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const validSeverityLevels = validSeverityLevels$1;

/** @deprecated Import from `@sentry/core` instead. */
const UNKNOWN_FUNCTION = UNKNOWN_FUNCTION$1;

/** @deprecated Import from `@sentry/core` instead. */
const createStackParser = createStackParser$1;

/** @deprecated Import from `@sentry/core` instead. */
const getFramesFromEvent = getFramesFromEvent$1;

/** @deprecated Import from `@sentry/core` instead. */
const getFunctionName = getFunctionName$1;

/** @deprecated Import from `@sentry/core` instead. */
const stackParserFromStackParserOptions = stackParserFromStackParserOptions$1;

/** @deprecated Import from `@sentry/core` instead. */
const stripSentryFramesAndReverse = stripSentryFramesAndReverse$1;

/** @deprecated Import from `@sentry/core` instead. */
const filenameIsInApp = filenameIsInApp$1;

/** @deprecated Import from `@sentry/core` instead. */
const node = node$1;

/** @deprecated Import from `@sentry/core` instead. */
const nodeStackLineParser = nodeStackLineParser$1;

/** @deprecated Import from `@sentry/core` instead. */
const isMatchingPattern = isMatchingPattern$1;

/** @deprecated Import from `@sentry/core` instead. */
const safeJoin = safeJoin$1;

/** @deprecated Import from `@sentry/core` instead. */
const snipLine = snipLine$1;

/** @deprecated Import from `@sentry/core` instead. */
const stringMatchesSomePattern = stringMatchesSomePattern$1;

/** @deprecated Import from `@sentry/core` instead. */
const truncate = truncate$1;

/** @deprecated Import from `@sentry/core` instead. */
const SyncPromise = SyncPromise$1;

/** @deprecated Import from `@sentry/core` instead. */
const rejectedSyncPromise = rejectedSyncPromise$1;

/** @deprecated Import from `@sentry/core` instead. */
const resolvedSyncPromise = resolvedSyncPromise$1;

/** @deprecated Import from `@sentry/core` instead. */
const dateTimestampInSeconds = dateTimestampInSeconds$1;

/** @deprecated Import from `@sentry/core` instead. */
const timestampInSeconds = timestampInSeconds$1;

/** @deprecated Import from `@sentry/core` instead. */
const TRACEPARENT_REGEXP = TRACEPARENT_REGEXP$1;

/** @deprecated Import from `@sentry/core` instead. */
const extractTraceparentData = extractTraceparentData$1;

/** @deprecated Import from `@sentry/core` instead. */
const generateSentryTraceHeader = generateSentryTraceHeader$1;

/** @deprecated Import from `@sentry/core` instead. */
const propagationContextFromHeaders = propagationContextFromHeaders$1;

/** @deprecated Import from `@sentry/core` instead. */
const getSDKSource = getSDKSource$1;

/** @deprecated Import from `@sentry/core` instead. */
const isBrowserBundle = isBrowserBundle$1;

/** @deprecated Import from `@sentry/core` instead. */
const MAX_BAGGAGE_STRING_LENGTH = MAX_BAGGAGE_STRING_LENGTH$1;

/** @deprecated Import from `@sentry/core` instead. */
const SENTRY_BAGGAGE_KEY_PREFIX = SENTRY_BAGGAGE_KEY_PREFIX$1;

/** @deprecated Import from `@sentry/core` instead. */
const SENTRY_BAGGAGE_KEY_PREFIX_REGEX = SENTRY_BAGGAGE_KEY_PREFIX_REGEX$1;

/** @deprecated Import from `@sentry/core` instead. */
const baggageHeaderToDynamicSamplingContext = baggageHeaderToDynamicSamplingContext$1;

/** @deprecated Import from `@sentry/core` instead. */
const dynamicSamplingContextToSentryBaggageHeader = dynamicSamplingContextToSentryBaggageHeader$1;

/** @deprecated Import from `@sentry/core` instead. */
const parseBaggageHeader = parseBaggageHeader$1;

/** @deprecated Import from `@sentry/core` instead. */
const addItemToEnvelope = addItemToEnvelope$1;

/** @deprecated Import from `@sentry/core` instead. */
const createAttachmentEnvelopeItem = createAttachmentEnvelopeItem$1;

/** @deprecated Import from `@sentry/core` instead. */
const createEnvelope = createEnvelope$1;

/** @deprecated Import from `@sentry/core` instead. */
const createEventEnvelopeHeaders = createEventEnvelopeHeaders$1;

/** @deprecated Import from `@sentry/core` instead. */
const createSpanEnvelopeItem = createSpanEnvelopeItem$1;

/** @deprecated Import from `@sentry/core` instead. */
const envelopeContainsItemType = envelopeContainsItemType$1;

/** @deprecated Import from `@sentry/core` instead. */
const envelopeItemTypeToDataCategory = envelopeItemTypeToDataCategory$1;

/** @deprecated Import from `@sentry/core` instead. */
const forEachEnvelopeItem = forEachEnvelopeItem$1;

/** @deprecated Import from `@sentry/core` instead. */
const getSdkMetadataForEnvelopeHeader = getSdkMetadataForEnvelopeHeader$1;

/** @deprecated Import from `@sentry/core` instead. */
const parseEnvelope = parseEnvelope$1;

/** @deprecated Import from `@sentry/core` instead. */
const serializeEnvelope = serializeEnvelope$1;

/** @deprecated Import from `@sentry/core` instead. */
const createClientReportEnvelope = createClientReportEnvelope$1;

/** @deprecated Import from `@sentry/core` instead. */
const DEFAULT_RETRY_AFTER = DEFAULT_RETRY_AFTER$1;

/** @deprecated Import from `@sentry/core` instead. */
const disabledUntil = disabledUntil$1;

/** @deprecated Import from `@sentry/core` instead. */
const isRateLimited = isRateLimited$1;

/** @deprecated Import from `@sentry/core` instead. */
const parseRetryAfterHeader = parseRetryAfterHeader$1;

/** @deprecated Import from `@sentry/core` instead. */
const updateRateLimits = updateRateLimits$1;

/** @deprecated Import from `@sentry/core` instead. */
const eventFromMessage = eventFromMessage$1;

/** @deprecated Import from `@sentry/core` instead. */
const eventFromUnknownInput = eventFromUnknownInput$1;

/** @deprecated Import from `@sentry/core` instead. */
const exceptionFromError = exceptionFromError$1;

/** @deprecated Import from `@sentry/core` instead. */
const parseStackFrames = parseStackFrames$1;

/** @deprecated Import from `@sentry/core` instead. */
const callFrameToStackFrame = callFrameToStackFrame$1;

/** @deprecated Import from `@sentry/core` instead. */
const watchdogTimer = watchdogTimer$1;

/** @deprecated Import from `@sentry/core` instead. */
const LRUMap = LRUMap$1;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const generatePropagationContext = generatePropagationContext$1;

/** @deprecated Import from `@sentry/core` instead. */
const vercelWaitUntil = vercelWaitUntil$1;

/** @deprecated Import from `@sentry/core` instead. */
const SDK_VERSION = SDK_VERSION$1;

/** @deprecated Import from `@sentry/core` instead. */
const getDebugImagesForResources = getDebugImagesForResources$1;

/** @deprecated Import from `@sentry/core` instead. */
const getFilenameToDebugIdMap = getFilenameToDebugIdMap$1;

/** @deprecated Import from `@sentry/core` instead. */
const escapeStringForRegex = escapeStringForRegex$1;

/** @deprecated Import from `@sentry/core` instead. */
const basename = basename$1;

/** @deprecated Import from `@sentry/core` instead. */
const dirname = dirname$1;

/** @deprecated Import from `@sentry/core` instead. */
const isAbsolute = isAbsolute$1;

/** @deprecated Import from `@sentry/core` instead. */
const join = join$1;

/** @deprecated Import from `@sentry/core` instead. */
const normalizePath = normalizePath$1;

/** @deprecated Import from `@sentry/core` instead. */
const relative = relative$1;

/** @deprecated Import from `@sentry/core` instead. */
const resolve = resolve$1;

/** @deprecated Import from `@sentry/core` instead. */
const getComponentName = getComponentName$1;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const getDomElement = getDomElement$1;

/** @deprecated Import from `@sentry/core` instead. */
const getLocationHref = getLocationHref$1;

/** @deprecated Import from `@sentry/core` instead. */
const htmlTreeAsString = htmlTreeAsString$1;

/** @deprecated Import from `@sentry/core` instead. */
const isNativeFunction = isNativeFunction$1;

/** @deprecated Import from `@sentry/core` instead. */
const supportsDOMError = supportsDOMError$1;

/** @deprecated Import from `@sentry/core` instead. */
const supportsDOMException = supportsDOMException$1;

/** @deprecated Import from `@sentry/core` instead. */
const supportsErrorEvent = supportsErrorEvent$1;

/** @deprecated Import from `@sentry/core` instead. */
const supportsFetch = supportsFetch$1;

/** @deprecated Import from `@sentry/core` instead. */
const supportsNativeFetch = supportsNativeFetch$1;

/** @deprecated Import from `@sentry/core` instead. */
const supportsReferrerPolicy = supportsReferrerPolicy$1;

/** @deprecated Import from `@sentry/core` instead. */
const supportsReportingObserver = supportsReportingObserver$1;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const _browserPerformanceTimeOriginMode = _browserPerformanceTimeOriginMode$1;

/** @deprecated Import from `@sentry/core` instead. */
const browserPerformanceTimeOrigin = browserPerformanceTimeOrigin$1;

/** @deprecated Import from `@sentry/core` instead. */
const supportsHistory = supportsHistory$1;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const dynamicRequire = dynamicRequire$1;

/** @deprecated Import from `@sentry/core` instead. */
const isNodeEnv = isNodeEnv$1;

/** @deprecated Import from `@sentry/core` instead. */
const loadModule = loadModule$1;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const flatten = flatten$1;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const memoBuilder = memoBuilder$1;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const arrayify = arrayify$1;

/** @deprecated Import from `@sentry/core` instead. */
const normalizeUrlToBase = normalizeUrlToBase$1;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const urlEncode = urlEncode$1;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const extractPathForTransaction = extractPathForTransaction$1;

/** @deprecated Import from `@sentry/core` instead. */
const DEFAULT_USER_INCLUDES = DEFAULT_USER_INCLUDES$1;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const extractRequestData = extractRequestData$1;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const addRequestDataToEvent = addRequestDataToEvent$1;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const BAGGAGE_HEADER_NAME = BAGGAGE_HEADER_NAME$1;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const getNumberOfUrlSegments = getNumberOfUrlSegments$1;

/** @deprecated Import from `@sentry/core` instead. */
const getSanitizedUrlString = getSanitizedUrlString$1;

/** @deprecated Import from `@sentry/core` instead. */
const parseUrl = parseUrl$1;

/** @deprecated Import from `@sentry/core` instead. */
const stripUrlQueryAndFragment = stripUrlQueryAndFragment$1;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const makeFifoCache = makeFifoCache$1;

/** @deprecated Import from `@sentry/core` instead. */

export { BAGGAGE_HEADER_NAME, CONSOLE_LEVELS, DEFAULT_RETRY_AFTER, DEFAULT_USER_INCLUDES, GLOBAL_OBJ, LRUMap, MAX_BAGGAGE_STRING_LENGTH, SDK_VERSION, SENTRY_BAGGAGE_KEY_PREFIX, SENTRY_BAGGAGE_KEY_PREFIX_REGEX, SentryError, SyncPromise, TRACEPARENT_REGEXP, UNKNOWN_FUNCTION, _asyncNullishCoalesce, _asyncOptionalChain, _asyncOptionalChainDelete, _browserPerformanceTimeOriginMode, _nullishCoalesce, _optionalChain, _optionalChainDelete, addConsoleInstrumentationHandler, addContextToFrame, addExceptionMechanism, addExceptionTypeValue, addFetchEndInstrumentationHandler, addFetchInstrumentationHandler, addGlobalErrorInstrumentationHandler, addGlobalUnhandledRejectionInstrumentationHandler, addHandler, addItemToEnvelope, addNonEnumerableProperty, addNormalizedRequestDataToEvent, addRequestDataToEvent, applyAggregateErrorsToEvent, arrayify, baggageHeaderToDynamicSamplingContext, basename, browserPerformanceTimeOrigin, callFrameToStackFrame, checkOrSetAlreadyCaught, consoleSandbox, convertToPlainObject, createAttachmentEnvelopeItem, createClientReportEnvelope, createEnvelope, createEventEnvelopeHeaders, createSpanEnvelopeItem, createStackParser, dateTimestampInSeconds, dirname, disabledUntil, dropUndefinedKeys, dsnFromString, dsnToString, dynamicRequire, dynamicSamplingContextToSentryBaggageHeader, envelopeContainsItemType, envelopeItemTypeToDataCategory, escapeStringForRegex, eventFromMessage, eventFromUnknownInput, exceptionFromError, extractExceptionKeysForMessage, extractPathForTransaction, extractRequestData, extractTraceparentData, filenameIsInApp, fill, flatten, forEachEnvelopeItem, generatePropagationContext, generateSentryTraceHeader, getBreadcrumbLogLevelFromHttpStatusCode, getComponentName, getDebugImagesForResources, getDomElement, getEventDescription, getFilenameToDebugIdMap, getFramesFromEvent, getFunctionName, getGlobalSingleton, getLocationHref, getNumberOfUrlSegments, getOriginalFunction, getSDKSource, getSanitizedUrlString, getSdkMetadataForEnvelopeHeader, htmlTreeAsString, isAbsolute, isBrowser, isBrowserBundle, isDOMError, isDOMException, isElement, isError, isErrorEvent, isEvent, isInstanceOf, isMatchingPattern, isNativeFunction, isNodeEnv, isParameterizedString, isPlainObject, isPrimitive, isRateLimited, isRegExp, isString, isSyntheticEvent, isThenable, isVueViewModel, join, loadModule, logger, makeDsn, makeFifoCache, makePromiseBuffer, markFunctionWrapped, maybeInstrument, memoBuilder, node, nodeStackLineParser, normalize, normalizePath, normalizeToSize, normalizeUrlToBase, objectify, originalConsoleMethods, parseBaggageHeader, parseEnvelope, parseRetryAfterHeader, parseSemver, parseStackFrames, parseUrl, propagationContextFromHeaders, rejectedSyncPromise, relative, resetInstrumentationHandlers, resolve, resolvedSyncPromise, safeJoin, serializeEnvelope, severityLevelFromString, snipLine, stackParserFromStackParserOptions, stringMatchesSomePattern, stripSentryFramesAndReverse, stripUrlQueryAndFragment, supportsDOMError, supportsDOMException, supportsErrorEvent, supportsFetch, supportsHistory, supportsNativeFetch, supportsReferrerPolicy, supportsReportingObserver, timestampInSeconds, triggerHandlers, truncate, updateRateLimits, urlEncode, uuid4, validSeverityLevels, vercelWaitUntil, watchdogTimer, winterCGHeadersToDict, winterCGRequestToRequestData };
//# sourceMappingURL=index.js.map
