"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRpcWarningMiddleware = void 0;
const messages_1 = __importDefault(require("../messages"));
/**
 * Create JSON-RPC middleware that logs warnings for deprecated RPC methods.
 *
 * @param log - The logging API to use.
 * @returns The JSON-RPC middleware.
 */
function createRpcWarningMiddleware(log) {
    const sentWarnings = {
        ethDecryptDeprecation: false,
        ethGetEncryptionPublicKeyDeprecation: false,
    };
    return (req, _res, next) => {
        if (sentWarnings.ethDecryptDeprecation === false &&
            req.method === 'eth_decrypt') {
            log.warn(messages_1.default.warnings.rpc.ethDecryptDeprecation);
            sentWarnings.ethDecryptDeprecation = true;
        }
        else if (sentWarnings.ethGetEncryptionPublicKeyDeprecation === false &&
            req.method === 'eth_getEncryptionPublicKey') {
            log.warn(messages_1.default.warnings.rpc.ethGetEncryptionPublicKeyDeprecation);
            sentWarnings.ethGetEncryptionPublicKeyDeprecation = true;
        }
        next();
    };
}
exports.createRpcWarningMiddleware = createRpcWarningMiddleware;
//# sourceMappingURL=createRpcWarningMiddleware.js.map