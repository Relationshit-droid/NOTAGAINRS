import { RN_GLOBAL_OBJ } from '../utils/worldwide';
import { utf8ToBytes } from '../vendor';
/** Convert a Content-Length header to number/undefined. */
export function parseContentLengthHeader(header) {
    if (!header) {
        return undefined;
    }
    const size = parseInt(header, 10);
    return isNaN(size) ? undefined : size;
}
/** Get the size of a body. */
export function getBodySize(body) {
    if (!body) {
        return undefined;
    }
    try {
        if (typeof body === 'string') {
            return _encode(body).length;
        }
        if (body instanceof URLSearchParams) {
            return _encode(body.toString()).length;
        }
        if (body instanceof FormData) {
            const formDataStr = _serializeFormData(body);
            return _encode(formDataStr).length;
        }
        if (body instanceof Blob) {
            return body.size;
        }
        if (body instanceof ArrayBuffer) {
            return body.byteLength;
        }
        // Currently unhandled types: ArrayBufferView, ReadableStream
    }
    catch (_a) {
        // just return undefined
    }
    return undefined;
}
function _encode(input) {
    if (RN_GLOBAL_OBJ.TextEncoder) {
        return new RN_GLOBAL_OBJ.TextEncoder().encode(input);
    }
    return utf8ToBytes(input);
}
function _serializeFormData(formData) {
    // This is a bit simplified, but gives us a decent estimate
    // This converts e.g. { name: 'Anne Smith', age: 13 } to 'name=Anne+Smith&age=13'
    // @ts-expect-error passing FormData to URLSearchParams won't correctly serialize `File` entries, which is fine for this use-case. See https://github.com/microsoft/TypeScript/issues/30584
    return new URLSearchParams(formData).toString();
}
//# sourceMappingURL=networkUtils.js.map