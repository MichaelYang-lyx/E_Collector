import { BasePostMessageStream } from '../BasePostMessageStream';
export interface BrowserRuntimePostMessageStreamArgs {
    name: string;
    target: string;
}
/**
 * A {@link browser.runtime} stream.
 */
export declare class BrowserRuntimePostMessageStream extends BasePostMessageStream {
    #private;
    /**
     * Creates a stream for communicating with other streams across the extension
     * runtime.
     *
     * @param args - Options bag.
     * @param args.name - The name of the stream. Used to differentiate between
     * multiple streams sharing the same runtime.
     * @param args.target - The name of the stream to exchange messages with.
     */
    constructor({ name, target }: BrowserRuntimePostMessageStreamArgs);
    protected _postMessage(data: unknown): void;
    private _onMessage;
    private _getRuntime;
    _destroy(): void;
}
