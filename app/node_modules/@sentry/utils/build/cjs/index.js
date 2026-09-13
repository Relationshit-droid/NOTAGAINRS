var {
  _asyncNullishCoalesce,
  _asyncOptionalChain,
  _asyncOptionalChainDelete,
  _nullishCoalesce,
  _optionalChain,
  _optionalChainDelete
} = require('@sentry/core');

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@sentry/core');

/* eslint-disable max-lines */

/** @deprecated Import from `@sentry/core` instead. */
const applyAggregateErrorsToEvent = core.applyAggregateErrorsToEvent;

/** @deprecated Import from `@sentry/core` instead. */
const getBreadcrumbLogLevelFromHttpStatusCode = core.getBreadcrumbLogLevelFromHttpStatusCode;

/** @deprecated Import from `@sentry/core` instead. */
const dsnFromString = core.dsnFromString;

/** @deprecated Import from `@sentry/core` instead. */
const dsnToString = core.dsnToString;

/** @deprecated Import from `@sentry/core` instead. */
const makeDsn = core.makeDsn;

/** @deprecated Import from `@sentry/core` instead. */
const SentryError = core.SentryError;

/** @deprecated Import from `@sentry/core` instead. */
const GLOBAL_OBJ = core.GLOBAL_OBJ;

/** @deprecated Import from `@sentry/core` instead. */
const getGlobalSingleton = core.getGlobalSingleton;

/** @deprecated Import from `@sentry/core` instead. */
const addConsoleInstrumentationHandler = core.addConsoleInstrumentationHandler;

/** @deprecated Import from `@sentry/core` instead. */
const addFetchEndInstrumentationHandler = core.addFetchEndInstrumentationHandler;

/** @deprecated Import from `@sentry/core` instead. */
const addFetchInstrumentationHandler = core.addFetchInstrumentationHandler;

/** @deprecated Import from `@sentry/core` instead. */
const addGlobalErrorInstrumentationHandler = core.addGlobalErrorInstrumentationHandler;

/** @deprecated Import from `@sentry/core` instead. */
const addGlobalUnhandledRejectionInstrumentationHandler =
  core.addGlobalUnhandledRejectionInstrumentationHandler;

/** @deprecated Import from `@sentry/core` instead. */
const addHandler = core.addHandler;

/** @deprecated Import from `@sentry/core` instead. */
const maybeInstrument = core.maybeInstrument;

/** @deprecated Import from `@sentry/core` instead. */
const resetInstrumentationHandlers = core.resetInstrumentationHandlers;

/** @deprecated Import from `@sentry/core` instead. */
const triggerHandlers = core.triggerHandlers;

/** @deprecated Import from `@sentry/core` instead. */
const isDOMError = core.isDOMError;

/** @deprecated Import from `@sentry/core` instead. */
const isDOMException = core.isDOMException;

/** @deprecated Import from `@sentry/core` instead. */
const isElement = core.isElement;

/** @deprecated Import from `@sentry/core` instead. */
const isError = core.isError;

/** @deprecated Import from `@sentry/core` instead. */
const isErrorEvent = core.isErrorEvent;

/** @deprecated Import from `@sentry/core` instead. */
const isEvent = core.isEvent;

/** @deprecated Import from `@sentry/core` instead. */
const isInstanceOf = core.isInstanceOf;

/** @deprecated Import from `@sentry/core` instead. */
const isParameterizedString = core.isParameterizedString;

/** @deprecated Import from `@sentry/core` instead. */
const isPlainObject = core.isPlainObject;

/** @deprecated Import from `@sentry/core` instead. */
const isPrimitive = core.isPrimitive;

/** @deprecated Import from `@sentry/core` instead. */
const isRegExp = core.isRegExp;

/** @deprecated Import from `@sentry/core` instead. */
const isString = core.isString;

/** @deprecated Import from `@sentry/core` instead. */
const isSyntheticEvent = core.isSyntheticEvent;

/** @deprecated Import from `@sentry/core` instead. */
const isThenable = core.isThenable;

/** @deprecated Import from `@sentry/core` instead. */
const isVueViewModel = core.isVueViewModel;

/** @deprecated Import from `@sentry/core` instead. */
const isBrowser = core.isBrowser;

/** @deprecated Import from `@sentry/core` instead. */
const CONSOLE_LEVELS = core.CONSOLE_LEVELS;

/** @deprecated Import from `@sentry/core` instead. */
const consoleSandbox = core.consoleSandbox;

/** @deprecated Import from `@sentry/core` instead. */
const logger = core.logger;

/** @deprecated Import from `@sentry/core` instead. */
const originalConsoleMethods = core.originalConsoleMethods;

/** @deprecated Import from `@sentry/core` instead. */
const addContextToFrame = core.addContextToFrame;

/** @deprecated Import from `@sentry/core` instead. */
const addExceptionMechanism = core.addExceptionMechanism;

/** @deprecated Import from `@sentry/core` instead. */
const addExceptionTypeValue = core.addExceptionTypeValue;

/** @deprecated Import from `@sentry/core` instead. */
const checkOrSetAlreadyCaught = core.checkOrSetAlreadyCaught;

/** @deprecated Import from `@sentry/core` instead. */
const getEventDescription = core.getEventDescription;

/** @deprecated Import from `@sentry/core` instead. */
const parseSemver = core.parseSemver;

/** @deprecated Import from `@sentry/core` instead. */
const uuid4 = core.uuid4;

/** @deprecated Import from `@sentry/core` instead. */
const normalize = core.normalize;

/** @deprecated Import from `@sentry/core` instead. */
const normalizeToSize = core.normalizeToSize;

/** @deprecated Import from `@sentry/core` instead. */
const addNonEnumerableProperty = core.addNonEnumerableProperty;

/** @deprecated Import from `@sentry/core` instead. */
const convertToPlainObject = core.convertToPlainObject;

/** @deprecated Import from `@sentry/core` instead. */
const dropUndefinedKeys = core.dropUndefinedKeys;

/** @deprecated Import from `@sentry/core` instead. */
const extractExceptionKeysForMessage = core.extractExceptionKeysForMessage;

/** @deprecated Import from `@sentry/core` instead. */
const fill = core.fill;

/** @deprecated Import from `@sentry/core` instead. */
const getOriginalFunction = core.getOriginalFunction;

/** @deprecated Import from `@sentry/core` instead. */
const markFunctionWrapped = core.markFunctionWrapped;

/** @deprecated Import from `@sentry/core` instead. */
const objectify = core.objectify;

/** @deprecated Import from `@sentry/core` instead. */
const makePromiseBuffer = core.makePromiseBuffer;

/** @deprecated Import from `@sentry/core` instead. */
const addNormalizedRequestDataToEvent = core.addNormalizedRequestDataToEvent;

/** @deprecated Import from `@sentry/core` instead. */
const winterCGHeadersToDict = core.winterCGHeadersToDict;

/** @deprecated Import from `@sentry/core` instead. */
const winterCGRequestToRequestData = core.winterCGRequestToRequestData;

/** @deprecated Import from `@sentry/core` instead. */
const severityLevelFromString = core.severityLevelFromString;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const validSeverityLevels = core.validSeverityLevels;

/** @deprecated Import from `@sentry/core` instead. */
const UNKNOWN_FUNCTION = core.UNKNOWN_FUNCTION;

/** @deprecated Import from `@sentry/core` instead. */
const createStackParser = core.createStackParser;

/** @deprecated Import from `@sentry/core` instead. */
const getFramesFromEvent = core.getFramesFromEvent;

/** @deprecated Import from `@sentry/core` instead. */
const getFunctionName = core.getFunctionName;

/** @deprecated Import from `@sentry/core` instead. */
const stackParserFromStackParserOptions = core.stackParserFromStackParserOptions;

/** @deprecated Import from `@sentry/core` instead. */
const stripSentryFramesAndReverse = core.stripSentryFramesAndReverse;

/** @deprecated Import from `@sentry/core` instead. */
const filenameIsInApp = core.filenameIsInApp;

/** @deprecated Import from `@sentry/core` instead. */
const node = core.node;

/** @deprecated Import from `@sentry/core` instead. */
const nodeStackLineParser = core.nodeStackLineParser;

/** @deprecated Import from `@sentry/core` instead. */
const isMatchingPattern = core.isMatchingPattern;

/** @deprecated Import from `@sentry/core` instead. */
const safeJoin = core.safeJoin;

/** @deprecated Import from `@sentry/core` instead. */
const snipLine = core.snipLine;

/** @deprecated Import from `@sentry/core` instead. */
const stringMatchesSomePattern = core.stringMatchesSomePattern;

/** @deprecated Import from `@sentry/core` instead. */
const truncate = core.truncate;

/** @deprecated Import from `@sentry/core` instead. */
const SyncPromise = core.SyncPromise;

/** @deprecated Import from `@sentry/core` instead. */
const rejectedSyncPromise = core.rejectedSyncPromise;

/** @deprecated Import from `@sentry/core` instead. */
const resolvedSyncPromise = core.resolvedSyncPromise;

/** @deprecated Import from `@sentry/core` instead. */
const dateTimestampInSeconds = core.dateTimestampInSeconds;

/** @deprecated Import from `@sentry/core` instead. */
const timestampInSeconds = core.timestampInSeconds;

/** @deprecated Import from `@sentry/core` instead. */
const TRACEPARENT_REGEXP = core.TRACEPARENT_REGEXP;

/** @deprecated Import from `@sentry/core` instead. */
const extractTraceparentData = core.extractTraceparentData;

/** @deprecated Import from `@sentry/core` instead. */
const generateSentryTraceHeader = core.generateSentryTraceHeader;

/** @deprecated Import from `@sentry/core` instead. */
const propagationContextFromHeaders = core.propagationContextFromHeaders;

/** @deprecated Import from `@sentry/core` instead. */
const getSDKSource = core.getSDKSource;

/** @deprecated Import from `@sentry/core` instead. */
const isBrowserBundle = core.isBrowserBundle;

/** @deprecated Import from `@sentry/core` instead. */
const MAX_BAGGAGE_STRING_LENGTH = core.MAX_BAGGAGE_STRING_LENGTH;

/** @deprecated Import from `@sentry/core` instead. */
const SENTRY_BAGGAGE_KEY_PREFIX = core.SENTRY_BAGGAGE_KEY_PREFIX;

/** @deprecated Import from `@sentry/core` instead. */
const SENTRY_BAGGAGE_KEY_PREFIX_REGEX = core.SENTRY_BAGGAGE_KEY_PREFIX_REGEX;

/** @deprecated Import from `@sentry/core` instead. */
const baggageHeaderToDynamicSamplingContext = core.baggageHeaderToDynamicSamplingContext;

/** @deprecated Import from `@sentry/core` instead. */
const dynamicSamplingContextToSentryBaggageHeader = core.dynamicSamplingContextToSentryBaggageHeader;

/** @deprecated Import from `@sentry/core` instead. */
const parseBaggageHeader = core.parseBaggageHeader;

/** @deprecated Import from `@sentry/core` instead. */
const addItemToEnvelope = core.addItemToEnvelope;

/** @deprecated Import from `@sentry/core` instead. */
const createAttachmentEnvelopeItem = core.createAttachmentEnvelopeItem;

/** @deprecated Import from `@sentry/core` instead. */
const createEnvelope = core.createEnvelope;

/** @deprecated Import from `@sentry/core` instead. */
const createEventEnvelopeHeaders = core.createEventEnvelopeHeaders;

/** @deprecated Import from `@sentry/core` instead. */
const createSpanEnvelopeItem = core.createSpanEnvelopeItem;

/** @deprecated Import from `@sentry/core` instead. */
const envelopeContainsItemType = core.envelopeContainsItemType;

/** @deprecated Import from `@sentry/core` instead. */
const envelopeItemTypeToDataCategory = core.envelopeItemTypeToDataCategory;

/** @deprecated Import from `@sentry/core` instead. */
const forEachEnvelopeItem = core.forEachEnvelopeItem;

/** @deprecated Import from `@sentry/core` instead. */
const getSdkMetadataForEnvelopeHeader = core.getSdkMetadataForEnvelopeHeader;

/** @deprecated Import from `@sentry/core` instead. */
const parseEnvelope = core.parseEnvelope;

/** @deprecated Import from `@sentry/core` instead. */
const serializeEnvelope = core.serializeEnvelope;

/** @deprecated Import from `@sentry/core` instead. */
const createClientReportEnvelope = core.createClientReportEnvelope;

/** @deprecated Import from `@sentry/core` instead. */
const DEFAULT_RETRY_AFTER = core.DEFAULT_RETRY_AFTER;

/** @deprecated Import from `@sentry/core` instead. */
const disabledUntil = core.disabledUntil;

/** @deprecated Import from `@sentry/core` instead. */
const isRateLimited = core.isRateLimited;

/** @deprecated Import from `@sentry/core` instead. */
const parseRetryAfterHeader = core.parseRetryAfterHeader;

/** @deprecated Import from `@sentry/core` instead. */
const updateRateLimits = core.updateRateLimits;

/** @deprecated Import from `@sentry/core` instead. */
const eventFromMessage = core.eventFromMessage;

/** @deprecated Import from `@sentry/core` instead. */
const eventFromUnknownInput = core.eventFromUnknownInput;

/** @deprecated Import from `@sentry/core` instead. */
const exceptionFromError = core.exceptionFromError;

/** @deprecated Import from `@sentry/core` instead. */
const parseStackFrames = core.parseStackFrames;

/** @deprecated Import from `@sentry/core` instead. */
const callFrameToStackFrame = core.callFrameToStackFrame;

/** @deprecated Import from `@sentry/core` instead. */
const watchdogTimer = core.watchdogTimer;

/** @deprecated Import from `@sentry/core` instead. */
const LRUMap = core.LRUMap;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const generatePropagationContext = core.generatePropagationContext;

/** @deprecated Import from `@sentry/core` instead. */
const vercelWaitUntil = core.vercelWaitUntil;

/** @deprecated Import from `@sentry/core` instead. */
const SDK_VERSION = core.SDK_VERSION;

/** @deprecated Import from `@sentry/core` instead. */
const getDebugImagesForResources = core.getDebugImagesForResources;

/** @deprecated Import from `@sentry/core` instead. */
const getFilenameToDebugIdMap = core.getFilenameToDebugIdMap;

/** @deprecated Import from `@sentry/core` instead. */
const escapeStringForRegex = core.escapeStringForRegex;

/** @deprecated Import from `@sentry/core` instead. */
const basename = core.basename;

/** @deprecated Import from `@sentry/core` instead. */
const dirname = core.dirname;

/** @deprecated Import from `@sentry/core` instead. */
const isAbsolute = core.isAbsolute;

/** @deprecated Import from `@sentry/core` instead. */
const join = core.join;

/** @deprecated Import from `@sentry/core` instead. */
const normalizePath = core.normalizePath;

/** @deprecated Import from `@sentry/core` instead. */
const relative = core.relative;

/** @deprecated Import from `@sentry/core` instead. */
const resolve = core.resolve;

/** @deprecated Import from `@sentry/core` instead. */
const getComponentName = core.getComponentName;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const getDomElement = core.getDomElement;

/** @deprecated Import from `@sentry/core` instead. */
const getLocationHref = core.getLocationHref;

/** @deprecated Import from `@sentry/core` instead. */
const htmlTreeAsString = core.htmlTreeAsString;

/** @deprecated Import from `@sentry/core` instead. */
const isNativeFunction = core.isNativeFunction;

/** @deprecated Import from `@sentry/core` instead. */
const supportsDOMError = core.supportsDOMError;

/** @deprecated Import from `@sentry/core` instead. */
const supportsDOMException = core.supportsDOMException;

/** @deprecated Import from `@sentry/core` instead. */
const supportsErrorEvent = core.supportsErrorEvent;

/** @deprecated Import from `@sentry/core` instead. */
const supportsFetch = core.supportsFetch;

/** @deprecated Import from `@sentry/core` instead. */
const supportsNativeFetch = core.supportsNativeFetch;

/** @deprecated Import from `@sentry/core` instead. */
const supportsReferrerPolicy = core.supportsReferrerPolicy;

/** @deprecated Import from `@sentry/core` instead. */
const supportsReportingObserver = core.supportsReportingObserver;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const _browserPerformanceTimeOriginMode = core._browserPerformanceTimeOriginMode;

/** @deprecated Import from `@sentry/core` instead. */
const browserPerformanceTimeOrigin = core.browserPerformanceTimeOrigin;

/** @deprecated Import from `@sentry/core` instead. */
const supportsHistory = core.supportsHistory;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const dynamicRequire = core.dynamicRequire;

/** @deprecated Import from `@sentry/core` instead. */
const isNodeEnv = core.isNodeEnv;

/** @deprecated Import from `@sentry/core` instead. */
const loadModule = core.loadModule;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const flatten = core.flatten;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const memoBuilder = core.memoBuilder;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const arrayify = core.arrayify;

/** @deprecated Import from `@sentry/core` instead. */
const normalizeUrlToBase = core.normalizeUrlToBase;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const urlEncode = core.urlEncode;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const extractPathForTransaction = core.extractPathForTransaction;

/** @deprecated Import from `@sentry/core` instead. */
const DEFAULT_USER_INCLUDES = core.DEFAULT_USER_INCLUDES;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const extractRequestData = core.extractRequestData;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const addRequestDataToEvent = core.addRequestDataToEvent;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const BAGGAGE_HEADER_NAME = core.BAGGAGE_HEADER_NAME;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const getNumberOfUrlSegments = core.getNumberOfUrlSegments;

/** @deprecated Import from `@sentry/core` instead. */
const getSanitizedUrlString = core.getSanitizedUrlString;

/** @deprecated Import from `@sentry/core` instead. */
const parseUrl = core.parseUrl;

/** @deprecated Import from `@sentry/core` instead. */
const stripUrlQueryAndFragment = core.stripUrlQueryAndFragment;

/** @deprecated Import from `@sentry/core` instead. */
// eslint-disable-next-line deprecation/deprecation
const makeFifoCache = core.makeFifoCache;

/** @deprecated Import from `@sentry/core` instead. */

exports.BAGGAGE_HEADER_NAME = BAGGAGE_HEADER_NAME;
exports.CONSOLE_LEVELS = CONSOLE_LEVELS;
exports.DEFAULT_RETRY_AFTER = DEFAULT_RETRY_AFTER;
exports.DEFAULT_USER_INCLUDES = DEFAULT_USER_INCLUDES;
exports.GLOBAL_OBJ = GLOBAL_OBJ;
exports.LRUMap = LRUMap;
exports.MAX_BAGGAGE_STRING_LENGTH = MAX_BAGGAGE_STRING_LENGTH;
exports.SDK_VERSION = SDK_VERSION;
exports.SENTRY_BAGGAGE_KEY_PREFIX = SENTRY_BAGGAGE_KEY_PREFIX;
exports.SENTRY_BAGGAGE_KEY_PREFIX_REGEX = SENTRY_BAGGAGE_KEY_PREFIX_REGEX;
exports.SentryError = SentryError;
exports.SyncPromise = SyncPromise;
exports.TRACEPARENT_REGEXP = TRACEPARENT_REGEXP;
exports.UNKNOWN_FUNCTION = UNKNOWN_FUNCTION;
exports._asyncNullishCoalesce = _asyncNullishCoalesce;
exports._asyncOptionalChain = _asyncOptionalChain;
exports._asyncOptionalChainDelete = _asyncOptionalChainDelete;
exports._browserPerformanceTimeOriginMode = _browserPerformanceTimeOriginMode;
exports._nullishCoalesce = _nullishCoalesce;
exports._optionalChain = _optionalChain;
exports._optionalChainDelete = _optionalChainDelete;
exports.addConsoleInstrumentationHandler = addConsoleInstrumentationHandler;
exports.addContextToFrame = addContextToFrame;
exports.addExceptionMechanism = addExceptionMechanism;
exports.addExceptionTypeValue = addExceptionTypeValue;
exports.addFetchEndInstrumentationHandler = addFetchEndInstrumentationHandler;
exports.addFetchInstrumentationHandler = addFetchInstrumentationHandler;
exports.addGlobalErrorInstrumentationHandler = addGlobalErrorInstrumentationHandler;
exports.addGlobalUnhandledRejectionInstrumentationHandler = addGlobalUnhandledRejectionInstrumentationHandler;
exports.addHandler = addHandler;
exports.addItemToEnvelope = addItemToEnvelope;
exports.addNonEnumerableProperty = addNonEnumerableProperty;
exports.addNormalizedRequestDataToEvent = addNormalizedRequestDataToEvent;
exports.addRequestDataToEvent = addRequestDataToEvent;
exports.applyAggregateErrorsToEvent = applyAggregateErrorsToEvent;
exports.arrayify = arrayify;
exports.baggageHeaderToDynamicSamplingContext = baggageHeaderToDynamicSamplingContext;
exports.basename = basename;
exports.browserPerformanceTimeOrigin = browserPerformanceTimeOrigin;
exports.callFrameToStackFrame = callFrameToStackFrame;
exports.checkOrSetAlreadyCaught = checkOrSetAlreadyCaught;
exports.consoleSandbox = consoleSandbox;
exports.convertToPlainObject = convertToPlainObject;
exports.createAttachmentEnvelopeItem = createAttachmentEnvelopeItem;
exports.createClientReportEnvelope = createClientReportEnvelope;
exports.createEnvelope = createEnvelope;
exports.createEventEnvelopeHeaders = createEventEnvelopeHeaders;
exports.createSpanEnvelopeItem = createSpanEnvelopeItem;
exports.createStackParser = createStackParser;
exports.dateTimestampInSeconds = dateTimestampInSeconds;
exports.dirname = dirname;
exports.disabledUntil = disabledUntil;
exports.dropUndefinedKeys = dropUndefinedKeys;
exports.dsnFromString = dsnFromString;
exports.dsnToString = dsnToString;
exports.dynamicRequire = dynamicRequire;
exports.dynamicSamplingContextToSentryBaggageHeader = dynamicSamplingContextToSentryBaggageHeader;
exports.envelopeContainsItemType = envelopeContainsItemType;
exports.envelopeItemTypeToDataCategory = envelopeItemTypeToDataCategory;
exports.escapeStringForRegex = escapeStringForRegex;
exports.eventFromMessage = eventFromMessage;
exports.eventFromUnknownInput = eventFromUnknownInput;
exports.exceptionFromError = exceptionFromError;
exports.extractExceptionKeysForMessage = extractExceptionKeysForMessage;
exports.extractPathForTransaction = extractPathForTransaction;
exports.extractRequestData = extractRequestData;
exports.extractTraceparentData = extractTraceparentData;
exports.filenameIsInApp = filenameIsInApp;
exports.fill = fill;
exports.flatten = flatten;
exports.forEachEnvelopeItem = forEachEnvelopeItem;
exports.generatePropagationContext = generatePropagationContext;
exports.generateSentryTraceHeader = generateSentryTraceHeader;
exports.getBreadcrumbLogLevelFromHttpStatusCode = getBreadcrumbLogLevelFromHttpStatusCode;
exports.getComponentName = getComponentName;
exports.getDebugImagesForResources = getDebugImagesForResources;
exports.getDomElement = getDomElement;
exports.getEventDescription = getEventDescription;
exports.getFilenameToDebugIdMap = getFilenameToDebugIdMap;
exports.getFramesFromEvent = getFramesFromEvent;
exports.getFunctionName = getFunctionName;
exports.getGlobalSingleton = getGlobalSingleton;
exports.getLocationHref = getLocationHref;
exports.getNumberOfUrlSegments = getNumberOfUrlSegments;
exports.getOriginalFunction = getOriginalFunction;
exports.getSDKSource = getSDKSource;
exports.getSanitizedUrlString = getSanitizedUrlString;
exports.getSdkMetadataForEnvelopeHeader = getSdkMetadataForEnvelopeHeader;
exports.htmlTreeAsString = htmlTreeAsString;
exports.isAbsolute = isAbsolute;
exports.isBrowser = isBrowser;
exports.isBrowserBundle = isBrowserBundle;
exports.isDOMError = isDOMError;
exports.isDOMException = isDOMException;
exports.isElement = isElement;
exports.isError = isError;
exports.isErrorEvent = isErrorEvent;
exports.isEvent = isEvent;
exports.isInstanceOf = isInstanceOf;
exports.isMatchingPattern = isMatchingPattern;
exports.isNativeFunction = isNativeFunction;
exports.isNodeEnv = isNodeEnv;
exports.isParameterizedString = isParameterizedString;
exports.isPlainObject = isPlainObject;
exports.isPrimitive = isPrimitive;
exports.isRateLimited = isRateLimited;
exports.isRegExp = isRegExp;
exports.isString = isString;
exports.isSyntheticEvent = isSyntheticEvent;
exports.isThenable = isThenable;
exports.isVueViewModel = isVueViewModel;
exports.join = join;
exports.loadModule = loadModule;
exports.logger = logger;
exports.makeDsn = makeDsn;
exports.makeFifoCache = makeFifoCache;
exports.makePromiseBuffer = makePromiseBuffer;
exports.markFunctionWrapped = markFunctionWrapped;
exports.maybeInstrument = maybeInstrument;
exports.memoBuilder = memoBuilder;
exports.node = node;
exports.nodeStackLineParser = nodeStackLineParser;
exports.normalize = normalize;
exports.normalizePath = normalizePath;
exports.normalizeToSize = normalizeToSize;
exports.normalizeUrlToBase = normalizeUrlToBase;
exports.objectify = objectify;
exports.originalConsoleMethods = originalConsoleMethods;
exports.parseBaggageHeader = parseBaggageHeader;
exports.parseEnvelope = parseEnvelope;
exports.parseRetryAfterHeader = parseRetryAfterHeader;
exports.parseSemver = parseSemver;
exports.parseStackFrames = parseStackFrames;
exports.parseUrl = parseUrl;
exports.propagationContextFromHeaders = propagationContextFromHeaders;
exports.rejectedSyncPromise = rejectedSyncPromise;
exports.relative = relative;
exports.resetInstrumentationHandlers = resetInstrumentationHandlers;
exports.resolve = resolve;
exports.resolvedSyncPromise = resolvedSyncPromise;
exports.safeJoin = safeJoin;
exports.serializeEnvelope = serializeEnvelope;
exports.severityLevelFromString = severityLevelFromString;
exports.snipLine = snipLine;
exports.stackParserFromStackParserOptions = stackParserFromStackParserOptions;
exports.stringMatchesSomePattern = stringMatchesSomePattern;
exports.stripSentryFramesAndReverse = stripSentryFramesAndReverse;
exports.stripUrlQueryAndFragment = stripUrlQueryAndFragment;
exports.supportsDOMError = supportsDOMError;
exports.supportsDOMException = supportsDOMException;
exports.supportsErrorEvent = supportsErrorEvent;
exports.supportsFetch = supportsFetch;
exports.supportsHistory = supportsHistory;
exports.supportsNativeFetch = supportsNativeFetch;
exports.supportsReferrerPolicy = supportsReferrerPolicy;
exports.supportsReportingObserver = supportsReportingObserver;
exports.timestampInSeconds = timestampInSeconds;
exports.triggerHandlers = triggerHandlers;
exports.truncate = truncate;
exports.updateRateLimits = updateRateLimits;
exports.urlEncode = urlEncode;
exports.uuid4 = uuid4;
exports.validSeverityLevels = validSeverityLevels;
exports.vercelWaitUntil = vercelWaitUntil;
exports.watchdogTimer = watchdogTimer;
exports.winterCGHeadersToDict = winterCGHeadersToDict;
exports.winterCGRequestToRequestData = winterCGRequestToRequestData;
//# sourceMappingURL=index.js.map
