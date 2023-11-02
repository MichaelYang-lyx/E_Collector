import { Duplex } from 'readable-stream';
import { StreamData } from './utils';
declare type Log = (data: unknown, out: boolean) => void;
export interface PostMessageEvent {
    data?: StreamData;
    origin: string;
    source: typeof window;
}
/**
 * Abstract base class for postMessage streams.
 */
export declare abstract class BasePostMessageStream extends Duplex {
    private _init;
    private _haveSyn;
    private _log;
    constructor();
    /**
     * Must be called at end of child constructor to initiate
     * communication with other end.
     */
    protected _handshake(): void;
    protected _onData(data: StreamData): void;
    /**
     * Child classes must implement this function.
     */
    protected abstract _postMessage(_data?: unknown): void;
    _read(): void;
    _write(data: StreamData, _encoding: string | null, cb: () => void): void;
    _setLogger(log: Log): void;
}
export {};
