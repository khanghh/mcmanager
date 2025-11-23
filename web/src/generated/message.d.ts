import * as $protobuf from "protobufjs";
import Long = require("long");
/** MessageType enum. */
export enum MessageType {
    UNKOWN = 0,
    ERROR = 1,
    CMD_OUTPUT = 257,
    CMD_STATUS = 258,
    SUBSCRIBE = 32769,
    UNSUBSCRIBE = 32770,
    CMD_INPUT = 33025,
    CMD_RESIZE = 33026,
    CMD_CONNECT = 33027
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

/** Represents a CmdInput. */
export class CmdInput implements ICmdInput {

    /**
     * Constructs a new CmdInput.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICmdInput);

    /** CmdInput id. */
    public id: string;

    /** CmdInput data. */
    public data: Uint8Array;

    /**
     * Creates a new CmdInput instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CmdInput instance
     */
    public static create(properties?: ICmdInput): CmdInput;

    /**
     * Encodes the specified CmdInput message. Does not implicitly {@link CmdInput.verify|verify} messages.
     * @param message CmdInput message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICmdInput, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CmdInput message, length delimited. Does not implicitly {@link CmdInput.verify|verify} messages.
     * @param message CmdInput message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICmdInput, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CmdInput message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CmdInput
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CmdInput;

    /**
     * Decodes a CmdInput message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CmdInput
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CmdInput;

    /**
     * Verifies a CmdInput message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CmdInput message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CmdInput
     */
    public static fromObject(object: { [k: string]: any }): CmdInput;

    /**
     * Creates a plain object from a CmdInput message. Also converts values to other types if specified.
     * @param message CmdInput
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CmdInput, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CmdInput to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CmdInput
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Represents a CmdOutput. */
export class CmdOutput implements ICmdOutput {

    /**
     * Constructs a new CmdOutput.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICmdOutput);

    /** CmdOutput id. */
    public id: string;

    /** CmdOutput data. */
    public data: Uint8Array;

    /**
     * Creates a new CmdOutput instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CmdOutput instance
     */
    public static create(properties?: ICmdOutput): CmdOutput;

    /**
     * Encodes the specified CmdOutput message. Does not implicitly {@link CmdOutput.verify|verify} messages.
     * @param message CmdOutput message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICmdOutput, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CmdOutput message, length delimited. Does not implicitly {@link CmdOutput.verify|verify} messages.
     * @param message CmdOutput message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICmdOutput, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CmdOutput message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CmdOutput
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CmdOutput;

    /**
     * Decodes a CmdOutput message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CmdOutput
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CmdOutput;

    /**
     * Verifies a CmdOutput message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CmdOutput message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CmdOutput
     */
    public static fromObject(object: { [k: string]: any }): CmdOutput;

    /**
     * Creates a plain object from a CmdOutput message. Also converts values to other types if specified.
     * @param message CmdOutput
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CmdOutput, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CmdOutput to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CmdOutput
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Represents a CmdResize. */
export class CmdResize implements ICmdResize {

    /**
     * Constructs a new CmdResize.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICmdResize);

    /** CmdResize id. */
    public id: string;

    /** CmdResize cols. */
    public cols: number;

    /** CmdResize rows. */
    public rows: number;

    /**
     * Creates a new CmdResize instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CmdResize instance
     */
    public static create(properties?: ICmdResize): CmdResize;

    /**
     * Encodes the specified CmdResize message. Does not implicitly {@link CmdResize.verify|verify} messages.
     * @param message CmdResize message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICmdResize, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CmdResize message, length delimited. Does not implicitly {@link CmdResize.verify|verify} messages.
     * @param message CmdResize message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICmdResize, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CmdResize message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CmdResize
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CmdResize;

    /**
     * Decodes a CmdResize message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CmdResize
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CmdResize;

    /**
     * Verifies a CmdResize message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CmdResize message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CmdResize
     */
    public static fromObject(object: { [k: string]: any }): CmdResize;

    /**
     * Creates a plain object from a CmdResize message. Also converts values to other types if specified.
     * @param message CmdResize
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CmdResize, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CmdResize to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CmdResize
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Represents a CmdStatus. */
export class CmdStatus implements ICmdStatus {

    /**
     * Constructs a new CmdStatus.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICmdStatus);

    /** CmdStatus id. */
    public id: string;

    /** CmdStatus status. */
    public status: string;

    /**
     * Creates a new CmdStatus instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CmdStatus instance
     */
    public static create(properties?: ICmdStatus): CmdStatus;

    /**
     * Encodes the specified CmdStatus message. Does not implicitly {@link CmdStatus.verify|verify} messages.
     * @param message CmdStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICmdStatus, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CmdStatus message, length delimited. Does not implicitly {@link CmdStatus.verify|verify} messages.
     * @param message CmdStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICmdStatus, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CmdStatus message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CmdStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CmdStatus;

    /**
     * Decodes a CmdStatus message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CmdStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CmdStatus;

    /**
     * Verifies a CmdStatus message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CmdStatus message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CmdStatus
     */
    public static fromObject(object: { [k: string]: any }): CmdStatus;

    /**
     * Creates a plain object from a CmdStatus message. Also converts values to other types if specified.
     * @param message CmdStatus
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CmdStatus, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CmdStatus to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CmdStatus
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Represents a CmdConnect. */
export class CmdConnect implements ICmdConnect {

    /**
     * Constructs a new CmdConnect.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICmdConnect);

    /** CmdConnect id. */
    public id: string;

    /**
     * Creates a new CmdConnect instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CmdConnect instance
     */
    public static create(properties?: ICmdConnect): CmdConnect;

    /**
     * Encodes the specified CmdConnect message. Does not implicitly {@link CmdConnect.verify|verify} messages.
     * @param message CmdConnect message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICmdConnect, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CmdConnect message, length delimited. Does not implicitly {@link CmdConnect.verify|verify} messages.
     * @param message CmdConnect message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICmdConnect, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CmdConnect message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CmdConnect
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CmdConnect;

    /**
     * Decodes a CmdConnect message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CmdConnect
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CmdConnect;

    /**
     * Verifies a CmdConnect message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CmdConnect message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CmdConnect
     */
    public static fromObject(object: { [k: string]: any }): CmdConnect;

    /**
     * Creates a plain object from a CmdConnect message. Also converts values to other types if specified.
     * @param message CmdConnect
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CmdConnect, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CmdConnect to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for CmdConnect
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Represents a Subscribe. */
export class Subscribe implements ISubscribe {

    /**
     * Constructs a new Subscribe.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISubscribe);

    /** Subscribe topic. */
    public topic: string;

    /**
     * Creates a new Subscribe instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Subscribe instance
     */
    public static create(properties?: ISubscribe): Subscribe;

    /**
     * Encodes the specified Subscribe message. Does not implicitly {@link Subscribe.verify|verify} messages.
     * @param message Subscribe message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISubscribe, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Subscribe message, length delimited. Does not implicitly {@link Subscribe.verify|verify} messages.
     * @param message Subscribe message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISubscribe, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a Subscribe message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Subscribe
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Subscribe;

    /**
     * Decodes a Subscribe message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Subscribe
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Subscribe;

    /**
     * Verifies a Subscribe message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a Subscribe message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Subscribe
     */
    public static fromObject(object: { [k: string]: any }): Subscribe;

    /**
     * Creates a plain object from a Subscribe message. Also converts values to other types if specified.
     * @param message Subscribe
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Subscribe, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Subscribe to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Subscribe
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
}

/** Represents an Unsubscribe. */
export class Unsubscribe implements IUnsubscribe {

    /**
     * Constructs a new Unsubscribe.
     * @param [properties] Properties to set
     */
    constructor(properties?: IUnsubscribe);

    /** Unsubscribe topic. */
    public topic: string;

    /**
     * Creates a new Unsubscribe instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Unsubscribe instance
     */
    public static create(properties?: IUnsubscribe): Unsubscribe;

    /**
     * Encodes the specified Unsubscribe message. Does not implicitly {@link Unsubscribe.verify|verify} messages.
     * @param message Unsubscribe message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IUnsubscribe, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified Unsubscribe message, length delimited. Does not implicitly {@link Unsubscribe.verify|verify} messages.
     * @param message Unsubscribe message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IUnsubscribe, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an Unsubscribe message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Unsubscribe
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Unsubscribe;

    /**
     * Decodes an Unsubscribe message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Unsubscribe
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Unsubscribe;

    /**
     * Verifies an Unsubscribe message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an Unsubscribe message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Unsubscribe
     */
    public static fromObject(object: { [k: string]: any }): Unsubscribe;

    /**
     * Creates a plain object from an Unsubscribe message. Also converts values to other types if specified.
     * @param message Unsubscribe
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: Unsubscribe, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this Unsubscribe to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Unsubscribe
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
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

    /** Message subscribe. */
    public subscribe?: (ISubscribe|null);

    /** Message unsubscribe. */
    public unsubscribe?: (IUnsubscribe|null);

    /** Message cmdInput. */
    public cmdInput?: (ICmdInput|null);

    /** Message cmdOutput. */
    public cmdOutput?: (ICmdOutput|null);

    /** Message cmdResize. */
    public cmdResize?: (ICmdResize|null);

    /** Message cmdStatus. */
    public cmdStatus?: (ICmdStatus|null);

    /** Message cmdConnect. */
    public cmdConnect?: (ICmdConnect|null);

    /** Message payload. */
    public payload?: ("error"|"subscribe"|"unsubscribe"|"cmdInput"|"cmdOutput"|"cmdResize"|"cmdStatus"|"cmdConnect");

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
