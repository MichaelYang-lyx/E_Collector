import type { JsonRpcMiddleware } from 'json-rpc-engine';
import type { ConsoleLike } from '../utils';
/**
 * Create JSON-RPC middleware that logs warnings for deprecated RPC methods.
 *
 * @param log - The logging API to use.
 * @returns The JSON-RPC middleware.
 */
export declare function createRpcWarningMiddleware(log: ConsoleLike): JsonRpcMiddleware<unknown, unknown>;
