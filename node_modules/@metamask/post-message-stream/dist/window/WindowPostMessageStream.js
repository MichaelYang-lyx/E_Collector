"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowPostMessageStream = void 0;
const utils_1 = require("@metamask/utils");
const BasePostMessageStream_1 = require("../BasePostMessageStream");
const utils_2 = require("../utils");
/* istanbul ignore next */
const getSource = (_a = Object.getOwnPropertyDescriptor(MessageEvent.prototype, 'source')) === null || _a === void 0 ? void 0 : _a.get;
(0, utils_1.assert)(getSource, 'MessageEvent.prototype.source getter is not defined.');
/* istanbul ignore next */
const getOrigin = (_b = Object.getOwnPropertyDescriptor(MessageEvent.prototype, 'origin')) === null || _b === void 0 ? void 0 : _b.get;
(0, utils_1.assert)(getOrigin, 'MessageEvent.prototype.origin getter is not defined.');
/**
 * A {@link Window.postMessage} stream.
 */
class WindowPostMessageStream extends BasePostMessageStream_1.BasePostMessageStream {
    /**
     * Creates a stream for communicating with other streams across the same or
     * different `window` objects.
     *
     * @param args - Options bag.
     * @param args.name - The name of the stream. Used to differentiate between
     * multiple streams sharing the same window object.
     * @param args.target - The name of the stream to exchange messages with.
     * @param args.targetOrigin - The origin of the target. Defaults to
     * `location.origin`, '*' is permitted.
     * @param args.targetWindow - The window object of the target stream. Defaults
     * to `window`.
     */
    constructor({ name, target, targetOrigin = location.origin, targetWindow = window, }) {
        super();
        if (typeof window === 'undefined' ||
            typeof window.postMessage !== 'function') {
            throw new Error('window.postMessage is not a function. This class should only be instantiated in a Window.');
        }
        this._name = name;
        this._target = target;
        this._targetOrigin = targetOrigin;
        this._targetWindow = targetWindow;
        this._onMessage = this._onMessage.bind(this);
        window.addEventListener('message', this._onMessage, false);
        this._handshake();
    }
    _postMessage(data) {
        this._targetWindow.postMessage({
            target: this._target,
            data,
        }, this._targetOrigin);
    }
    _onMessage(event) {
        const message = event.data;
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        if ((this._targetOrigin !== '*' &&
            getOrigin.call(event) !== this._targetOrigin) ||
            getSource.call(event) !== this._targetWindow ||
            !(0, utils_2.isValidStreamMessage)(message) ||
            message.target !== this._name) {
            return;
        }
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
        this._onData(message.data);
    }
    _destroy() {
        window.removeEventListener('message', this._onMessage, false);
    }
}
exports.WindowPostMessageStream = WindowPostMessageStream;
//# sourceMappingURL=WindowPostMessageStream.js.map