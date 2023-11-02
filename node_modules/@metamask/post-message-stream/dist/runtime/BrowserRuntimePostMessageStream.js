"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BrowserRuntimePostMessageStream_name, _BrowserRuntimePostMessageStream_target;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserRuntimePostMessageStream = void 0;
const BasePostMessageStream_1 = require("../BasePostMessageStream");
const utils_1 = require("../utils");
/**
 * A {@link browser.runtime} stream.
 */
class BrowserRuntimePostMessageStream extends BasePostMessageStream_1.BasePostMessageStream {
    /**
     * Creates a stream for communicating with other streams across the extension
     * runtime.
     *
     * @param args - Options bag.
     * @param args.name - The name of the stream. Used to differentiate between
     * multiple streams sharing the same runtime.
     * @param args.target - The name of the stream to exchange messages with.
     */
    constructor({ name, target }) {
        super();
        _BrowserRuntimePostMessageStream_name.set(this, void 0);
        _BrowserRuntimePostMessageStream_target.set(this, void 0);
        __classPrivateFieldSet(this, _BrowserRuntimePostMessageStream_name, name, "f");
        __classPrivateFieldSet(this, _BrowserRuntimePostMessageStream_target, target, "f");
        this._onMessage = this._onMessage.bind(this);
        this._getRuntime().onMessage.addListener(this._onMessage);
        this._handshake();
    }
    _postMessage(data) {
        // This returns a Promise, which resolves if the receiver responds to the
        // message. Rather than responding to specific messages, we send new
        // messages in response to incoming messages, so we don't care about the
        // Promise.
        this._getRuntime().sendMessage({
            target: __classPrivateFieldGet(this, _BrowserRuntimePostMessageStream_target, "f"),
            data,
        });
    }
    _onMessage(message) {
        if (!(0, utils_1.isValidStreamMessage)(message) || message.target !== __classPrivateFieldGet(this, _BrowserRuntimePostMessageStream_name, "f")) {
            return;
        }
        this._onData(message.data);
    }
    _getRuntime() {
        var _a, _b;
        if ('chrome' in globalThis &&
            typeof ((_a = chrome === null || chrome === void 0 ? void 0 : chrome.runtime) === null || _a === void 0 ? void 0 : _a.sendMessage) === 'function') {
            return chrome.runtime;
        }
        if ('browser' in globalThis &&
            typeof ((_b = browser === null || browser === void 0 ? void 0 : browser.runtime) === null || _b === void 0 ? void 0 : _b.sendMessage) === 'function') {
            return browser.runtime;
        }
        throw new Error('browser.runtime.sendMessage is not a function. This class should only be instantiated in a web extension.');
    }
    _destroy() {
        this._getRuntime().onMessage.removeListener(this._onMessage);
    }
}
exports.BrowserRuntimePostMessageStream = BrowserRuntimePostMessageStream;
_BrowserRuntimePostMessageStream_name = new WeakMap(), _BrowserRuntimePostMessageStream_target = new WeakMap();
//# sourceMappingURL=BrowserRuntimePostMessageStream.js.map