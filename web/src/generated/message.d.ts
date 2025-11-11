import * as $protobuf from "protobufjs";
import Long = require("long");
/** MessageType enum. */
export enum MessageType {
    UNKNOWN = 0,
    ERROR = 1,
    PTY_INPUT = 101,
    PTY_OUTPUT = 102,
    PTY_RESIZE = 103,
    SERVER_START = 104,
    SERVER_STOP = 105,
    SERVER_KILL = 106,
    SERVER_STATUS = 107
}

/** ServerState enum. */
export enum ServerState {
    STOPPED = 0,
    RUNNING = 1,
    STOPPING = 2
}

/** Represents a Message. */
export class Message implements IMessage {

    /**
     * Constructs a new Message.
     * @param [properties] Properties to set
     */
    constructor(properties?: IMessage);

    /** Message type. */
    public type: MessageType;

    /** Message error. */
    public error?: (IErrorInfo|null);

    /** Message ptyBuffer. */
    public ptyBuffer?: (IPtyBuffer|null);

    /** Message ptyResize. */
    public ptyResize?: (IPtyResize|null);

    /** Message serverStatus. */
    public serverStatus?: (IServerStatus|null);

    /** Message payload. */
    public payload?: ("error"|"ptyBuffer"|"ptyResize"|"serverStatus");

    /**
     * Creates a new Message instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Message instance
     */
    public static create(properties?: IMessage): Message;

    /**
     * Encodes the specified Message message. Does not implicitly {@link Message.verify|verify} messages.
     * @param message Message message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Message message, length delimited. Does not implicitly {@link Message.verify|verify} messages.
     * @param message Message message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Message message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Message
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Message;

    /**
     * Decodes a Message message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Message
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Message;

    /**
     * Verifies a Message message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Message message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Message
     */
    public static fromObject(object: { [k: string]: any }): Message;

    /**
     * Creates a plain object from a Message message. Also converts values to other types if specified.
     * @param message Message
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Message, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Message to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Message
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Represents a PtyBuffer. */
export class PtyBuffer implements IPtyBuffer {

    /**
     * Constructs a new PtyBuffer.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPtyBuffer);

    /** PtyBuffer data. */
    public data: Uint8Array;

    /**
     * Creates a new PtyBuffer instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PtyBuffer instance
     */
    public static create(properties?: IPtyBuffer): PtyBuffer;

    /**
     * Encodes the specified PtyBuffer message. Does not implicitly {@link PtyBuffer.verify|verify} messages.
     * @param message PtyBuffer message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPtyBuffer, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PtyBuffer message, length delimited. Does not implicitly {@link PtyBuffer.verify|verify} messages.
     * @param message PtyBuffer message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPtyBuffer, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PtyBuffer message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PtyBuffer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PtyBuffer;

    /**
     * Decodes a PtyBuffer message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PtyBuffer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PtyBuffer;

    /**
     * Verifies a PtyBuffer message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PtyBuffer message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PtyBuffer
     */
    public static fromObject(object: { [k: string]: any }): PtyBuffer;

    /**
     * Creates a plain object from a PtyBuffer message. Also converts values to other types if specified.
     * @param message PtyBuffer
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PtyBuffer, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PtyBuffer to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for PtyBuffer
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Represents a PtyResize. */
export class PtyResize implements IPtyResize {

    /**
     * Constructs a new PtyResize.
     * @param [properties] Properties to set
     */
    constructor(properties?: IPtyResize);

    /** PtyResize cols. */
    public cols: number;

    /** PtyResize rows. */
    public rows: number;

    /**
     * Creates a new PtyResize instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PtyResize instance
     */
    public static create(properties?: IPtyResize): PtyResize;

    /**
     * Encodes the specified PtyResize message. Does not implicitly {@link PtyResize.verify|verify} messages.
     * @param message PtyResize message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IPtyResize, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified PtyResize message, length delimited. Does not implicitly {@link PtyResize.verify|verify} messages.
     * @param message PtyResize message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IPtyResize, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a PtyResize message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PtyResize
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): PtyResize;

    /**
     * Decodes a PtyResize message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PtyResize
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): PtyResize;

    /**
     * Verifies a PtyResize message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a PtyResize message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PtyResize
     */
    public static fromObject(object: { [k: string]: any }): PtyResize;

    /**
     * Creates a plain object from a PtyResize message. Also converts values to other types if specified.
     * @param message PtyResize
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: PtyResize, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this PtyResize to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for PtyResize
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Represents a ServerStatus. */
export class ServerStatus implements IServerStatus {

    /**
     * Constructs a new ServerStatus.
     * @param [properties] Properties to set
     */
    constructor(properties?: IServerStatus);

    /** ServerStatus state. */
    public state: ServerState;

    /** ServerStatus pid. */
    public pid: number;

    /** ServerStatus uptime. */
    public uptime: (number|Long);

    /** ServerStatus players. */
    public players: (number|Long);

    /** ServerStatus version. */
    public version: string;

    /**
     * Creates a new ServerStatus instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ServerStatus instance
     */
    public static create(properties?: IServerStatus): ServerStatus;

    /**
     * Encodes the specified ServerStatus message. Does not implicitly {@link ServerStatus.verify|verify} messages.
     * @param message ServerStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IServerStatus, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ServerStatus message, length delimited. Does not implicitly {@link ServerStatus.verify|verify} messages.
     * @param message ServerStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IServerStatus, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ServerStatus message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ServerStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ServerStatus;

    /**
     * Decodes a ServerStatus message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ServerStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ServerStatus;

    /**
     * Verifies a ServerStatus message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ServerStatus message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ServerStatus
     */
    public static fromObject(object: { [k: string]: any }): ServerStatus;

    /**
     * Creates a plain object from a ServerStatus message. Also converts values to other types if specified.
     * @param message ServerStatus
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ServerStatus, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ServerStatus to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ServerStatus
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Represents an ErrorInfo. */
export class ErrorInfo implements IErrorInfo {

    /**
     * Constructs a new ErrorInfo.
     * @param [properties] Properties to set
     */
    constructor(properties?: IErrorInfo);

    /** ErrorInfo code. */
    public code: string;

    /** ErrorInfo message. */
    public message: string;

    /**
     * Creates a new ErrorInfo instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ErrorInfo instance
     */
    public static create(properties?: IErrorInfo): ErrorInfo;

    /**
     * Encodes the specified ErrorInfo message. Does not implicitly {@link ErrorInfo.verify|verify} messages.
     * @param message ErrorInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IErrorInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ErrorInfo message, length delimited. Does not implicitly {@link ErrorInfo.verify|verify} messages.
     * @param message ErrorInfo message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IErrorInfo, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an ErrorInfo message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ErrorInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ErrorInfo;

    /**
     * Decodes an ErrorInfo message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ErrorInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ErrorInfo;

    /**
     * Verifies an ErrorInfo message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an ErrorInfo message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ErrorInfo
     */
    public static fromObject(object: { [k: string]: any }): ErrorInfo;

    /**
     * Creates a plain object from an ErrorInfo message. Also converts values to other types if specified.
     * @param message ErrorInfo
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ErrorInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ErrorInfo to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ErrorInfo
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}
