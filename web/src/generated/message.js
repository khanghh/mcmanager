/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

/**
 * MessageType enum.
 * @exports MessageType
 * @enum {number}
 * @property {number} UNKNOWN=0 UNKNOWN value
 * @property {number} ERROR=1 ERROR value
 * @property {number} PTY_INPUT=101 PTY_INPUT value
 * @property {number} PTY_OUTPUT=102 PTY_OUTPUT value
 * @property {number} PTY_RESIZE=103 PTY_RESIZE value
 * @property {number} SERVER_START=104 SERVER_START value
 * @property {number} SERVER_STOP=105 SERVER_STOP value
 * @property {number} SERVER_KILL=106 SERVER_KILL value
 * @property {number} SERVER_STATUS=107 SERVER_STATUS value
 */
export const MessageType = $root.MessageType = (() => {
    const valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "UNKNOWN"] = 0;
    values[valuesById[1] = "ERROR"] = 1;
    values[valuesById[101] = "PTY_INPUT"] = 101;
    values[valuesById[102] = "PTY_OUTPUT"] = 102;
    values[valuesById[103] = "PTY_RESIZE"] = 103;
    values[valuesById[104] = "SERVER_START"] = 104;
    values[valuesById[105] = "SERVER_STOP"] = 105;
    values[valuesById[106] = "SERVER_KILL"] = 106;
    values[valuesById[107] = "SERVER_STATUS"] = 107;
    return values;
})();

/**
 * ServerState enum.
 * @exports ServerState
 * @enum {number}
 * @property {number} STOPPED=0 STOPPED value
 * @property {number} RUNNING=1 RUNNING value
 * @property {number} STOPPING=2 STOPPING value
 */
export const ServerState = $root.ServerState = (() => {
    const valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "STOPPED"] = 0;
    values[valuesById[1] = "RUNNING"] = 1;
    values[valuesById[2] = "STOPPING"] = 2;
    return values;
})();

export const Message = $root.Message = (() => {

    /**
     * Properties of a Message.
     * @exports IMessage
     * @interface IMessage
     * @property {MessageType|null} [type] Message type
     * @property {IErrorInfo|null} [error] Message error
     * @property {IPtyBuffer|null} [ptyBuffer] Message ptyBuffer
     * @property {IPtyResize|null} [ptyResize] Message ptyResize
     * @property {IServerStatus|null} [serverStatus] Message serverStatus
     */

    /**
     * Constructs a new Message.
     * @exports Message
     * @classdesc Represents a Message.
     * @implements IMessage
     * @constructor
     * @param {IMessage=} [properties] Properties to set
     */
    function Message(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Message type.
     * @member {MessageType} type
     * @memberof Message
     * @instance
     */
    Message.prototype.type = 0;

    /**
     * Message error.
     * @member {IErrorInfo|null|undefined} error
     * @memberof Message
     * @instance
     */
    Message.prototype.error = null;

    /**
     * Message ptyBuffer.
     * @member {IPtyBuffer|null|undefined} ptyBuffer
     * @memberof Message
     * @instance
     */
    Message.prototype.ptyBuffer = null;

    /**
     * Message ptyResize.
     * @member {IPtyResize|null|undefined} ptyResize
     * @memberof Message
     * @instance
     */
    Message.prototype.ptyResize = null;

    /**
     * Message serverStatus.
     * @member {IServerStatus|null|undefined} serverStatus
     * @memberof Message
     * @instance
     */
    Message.prototype.serverStatus = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * Message payload.
     * @member {"error"|"ptyBuffer"|"ptyResize"|"serverStatus"|undefined} payload
     * @memberof Message
     * @instance
     */
    Object.defineProperty(Message.prototype, "payload", {
        get: $util.oneOfGetter($oneOfFields = ["error", "ptyBuffer", "ptyResize", "serverStatus"]),
        set: $util.oneOfSetter($oneOfFields)
    });

    /**
     * Creates a new Message instance using the specified properties.
     * @function create
     * @memberof Message
     * @static
     * @param {IMessage=} [properties] Properties to set
     * @returns {Message} Message instance
     */
    Message.create = function create(properties) {
        return new Message(properties);
    };

    /**
     * Encodes the specified Message message. Does not implicitly {@link Message.verify|verify} messages.
     * @function encode
     * @memberof Message
     * @static
     * @param {IMessage} message Message message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Message.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.type != null && Object.hasOwnProperty.call(message, "type"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.type);
        if (message.error != null && Object.hasOwnProperty.call(message, "error"))
            $root.ErrorInfo.encode(message.error, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.ptyBuffer != null && Object.hasOwnProperty.call(message, "ptyBuffer"))
            $root.PtyBuffer.encode(message.ptyBuffer, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.ptyResize != null && Object.hasOwnProperty.call(message, "ptyResize"))
            $root.PtyResize.encode(message.ptyResize, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.serverStatus != null && Object.hasOwnProperty.call(message, "serverStatus"))
            $root.ServerStatus.encode(message.serverStatus, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified Message message, length delimited. Does not implicitly {@link Message.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Message
     * @static
     * @param {IMessage} message Message message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Message.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Message message from the specified reader or buffer.
     * @function decode
     * @memberof Message
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Message} Message
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Message.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Message();
        while (reader.pos < end) {
            let tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.type = reader.int32();
                    break;
                }
            case 2: {
                    message.error = $root.ErrorInfo.decode(reader, reader.uint32());
                    break;
                }
            case 3: {
                    message.ptyBuffer = $root.PtyBuffer.decode(reader, reader.uint32());
                    break;
                }
            case 4: {
                    message.ptyResize = $root.PtyResize.decode(reader, reader.uint32());
                    break;
                }
            case 5: {
                    message.serverStatus = $root.ServerStatus.decode(reader, reader.uint32());
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a Message message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Message
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Message} Message
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Message.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Message message.
     * @function verify
     * @memberof Message
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Message.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        let properties = {};
        if (message.type != null && message.hasOwnProperty("type"))
            switch (message.type) {
            default:
                return "type: enum value expected";
            case 0:
            case 1:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 106:
            case 107:
                break;
            }
        if (message.error != null && message.hasOwnProperty("error")) {
            properties.payload = 1;
            {
                let error = $root.ErrorInfo.verify(message.error);
                if (error)
                    return "error." + error;
            }
        }
        if (message.ptyBuffer != null && message.hasOwnProperty("ptyBuffer")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                let error = $root.PtyBuffer.verify(message.ptyBuffer);
                if (error)
                    return "ptyBuffer." + error;
            }
        }
        if (message.ptyResize != null && message.hasOwnProperty("ptyResize")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                let error = $root.PtyResize.verify(message.ptyResize);
                if (error)
                    return "ptyResize." + error;
            }
        }
        if (message.serverStatus != null && message.hasOwnProperty("serverStatus")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                let error = $root.ServerStatus.verify(message.serverStatus);
                if (error)
                    return "serverStatus." + error;
            }
        }
        return null;
    };

    /**
     * Creates a Message message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Message
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Message} Message
     */
    Message.fromObject = function fromObject(object) {
        if (object instanceof $root.Message)
            return object;
        let message = new $root.Message();
        switch (object.type) {
        default:
            if (typeof object.type === "number") {
                message.type = object.type;
                break;
            }
            break;
        case "UNKNOWN":
        case 0:
            message.type = 0;
            break;
        case "ERROR":
        case 1:
            message.type = 1;
            break;
        case "PTY_INPUT":
        case 101:
            message.type = 101;
            break;
        case "PTY_OUTPUT":
        case 102:
            message.type = 102;
            break;
        case "PTY_RESIZE":
        case 103:
            message.type = 103;
            break;
        case "SERVER_START":
        case 104:
            message.type = 104;
            break;
        case "SERVER_STOP":
        case 105:
            message.type = 105;
            break;
        case "SERVER_KILL":
        case 106:
            message.type = 106;
            break;
        case "SERVER_STATUS":
        case 107:
            message.type = 107;
            break;
        }
        if (object.error != null) {
            if (typeof object.error !== "object")
                throw TypeError(".Message.error: object expected");
            message.error = $root.ErrorInfo.fromObject(object.error);
        }
        if (object.ptyBuffer != null) {
            if (typeof object.ptyBuffer !== "object")
                throw TypeError(".Message.ptyBuffer: object expected");
            message.ptyBuffer = $root.PtyBuffer.fromObject(object.ptyBuffer);
        }
        if (object.ptyResize != null) {
            if (typeof object.ptyResize !== "object")
                throw TypeError(".Message.ptyResize: object expected");
            message.ptyResize = $root.PtyResize.fromObject(object.ptyResize);
        }
        if (object.serverStatus != null) {
            if (typeof object.serverStatus !== "object")
                throw TypeError(".Message.serverStatus: object expected");
            message.serverStatus = $root.ServerStatus.fromObject(object.serverStatus);
        }
        return message;
    };

    /**
     * Creates a plain object from a Message message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Message
     * @static
     * @param {Message} message Message
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Message.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.type = options.enums === String ? "UNKNOWN" : 0;
        if (message.type != null && message.hasOwnProperty("type"))
            object.type = options.enums === String ? $root.MessageType[message.type] === undefined ? message.type : $root.MessageType[message.type] : message.type;
        if (message.error != null && message.hasOwnProperty("error")) {
            object.error = $root.ErrorInfo.toObject(message.error, options);
            if (options.oneofs)
                object.payload = "error";
        }
        if (message.ptyBuffer != null && message.hasOwnProperty("ptyBuffer")) {
            object.ptyBuffer = $root.PtyBuffer.toObject(message.ptyBuffer, options);
            if (options.oneofs)
                object.payload = "ptyBuffer";
        }
        if (message.ptyResize != null && message.hasOwnProperty("ptyResize")) {
            object.ptyResize = $root.PtyResize.toObject(message.ptyResize, options);
            if (options.oneofs)
                object.payload = "ptyResize";
        }
        if (message.serverStatus != null && message.hasOwnProperty("serverStatus")) {
            object.serverStatus = $root.ServerStatus.toObject(message.serverStatus, options);
            if (options.oneofs)
                object.payload = "serverStatus";
        }
        return object;
    };

    /**
     * Converts this Message to JSON.
     * @function toJSON
     * @memberof Message
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Message.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Message
     * @function getTypeUrl
     * @memberof Message
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Message.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Message";
    };

    return Message;
})();

export const PtyBuffer = $root.PtyBuffer = (() => {

    /**
     * Properties of a PtyBuffer.
     * @exports IPtyBuffer
     * @interface IPtyBuffer
     * @property {Uint8Array|null} [data] PtyBuffer data
     */

    /**
     * Constructs a new PtyBuffer.
     * @exports PtyBuffer
     * @classdesc Represents a PtyBuffer.
     * @implements IPtyBuffer
     * @constructor
     * @param {IPtyBuffer=} [properties] Properties to set
     */
    function PtyBuffer(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PtyBuffer data.
     * @member {Uint8Array} data
     * @memberof PtyBuffer
     * @instance
     */
    PtyBuffer.prototype.data = $util.newBuffer([]);

    /**
     * Creates a new PtyBuffer instance using the specified properties.
     * @function create
     * @memberof PtyBuffer
     * @static
     * @param {IPtyBuffer=} [properties] Properties to set
     * @returns {PtyBuffer} PtyBuffer instance
     */
    PtyBuffer.create = function create(properties) {
        return new PtyBuffer(properties);
    };

    /**
     * Encodes the specified PtyBuffer message. Does not implicitly {@link PtyBuffer.verify|verify} messages.
     * @function encode
     * @memberof PtyBuffer
     * @static
     * @param {IPtyBuffer} message PtyBuffer message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PtyBuffer.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.data != null && Object.hasOwnProperty.call(message, "data"))
            writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.data);
        return writer;
    };

    /**
     * Encodes the specified PtyBuffer message, length delimited. Does not implicitly {@link PtyBuffer.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PtyBuffer
     * @static
     * @param {IPtyBuffer} message PtyBuffer message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PtyBuffer.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PtyBuffer message from the specified reader or buffer.
     * @function decode
     * @memberof PtyBuffer
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PtyBuffer} PtyBuffer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PtyBuffer.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.PtyBuffer();
        while (reader.pos < end) {
            let tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.data = reader.bytes();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PtyBuffer message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PtyBuffer
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PtyBuffer} PtyBuffer
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PtyBuffer.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PtyBuffer message.
     * @function verify
     * @memberof PtyBuffer
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PtyBuffer.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.data != null && message.hasOwnProperty("data"))
            if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                return "data: buffer expected";
        return null;
    };

    /**
     * Creates a PtyBuffer message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PtyBuffer
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PtyBuffer} PtyBuffer
     */
    PtyBuffer.fromObject = function fromObject(object) {
        if (object instanceof $root.PtyBuffer)
            return object;
        let message = new $root.PtyBuffer();
        if (object.data != null)
            if (typeof object.data === "string")
                $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
            else if (object.data.length >= 0)
                message.data = object.data;
        return message;
    };

    /**
     * Creates a plain object from a PtyBuffer message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PtyBuffer
     * @static
     * @param {PtyBuffer} message PtyBuffer
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PtyBuffer.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            if (options.bytes === String)
                object.data = "";
            else {
                object.data = [];
                if (options.bytes !== Array)
                    object.data = $util.newBuffer(object.data);
            }
        if (message.data != null && message.hasOwnProperty("data"))
            object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
        return object;
    };

    /**
     * Converts this PtyBuffer to JSON.
     * @function toJSON
     * @memberof PtyBuffer
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PtyBuffer.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for PtyBuffer
     * @function getTypeUrl
     * @memberof PtyBuffer
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    PtyBuffer.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/PtyBuffer";
    };

    return PtyBuffer;
})();

export const PtyResize = $root.PtyResize = (() => {

    /**
     * Properties of a PtyResize.
     * @exports IPtyResize
     * @interface IPtyResize
     * @property {number|null} [cols] PtyResize cols
     * @property {number|null} [rows] PtyResize rows
     */

    /**
     * Constructs a new PtyResize.
     * @exports PtyResize
     * @classdesc Represents a PtyResize.
     * @implements IPtyResize
     * @constructor
     * @param {IPtyResize=} [properties] Properties to set
     */
    function PtyResize(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * PtyResize cols.
     * @member {number} cols
     * @memberof PtyResize
     * @instance
     */
    PtyResize.prototype.cols = 0;

    /**
     * PtyResize rows.
     * @member {number} rows
     * @memberof PtyResize
     * @instance
     */
    PtyResize.prototype.rows = 0;

    /**
     * Creates a new PtyResize instance using the specified properties.
     * @function create
     * @memberof PtyResize
     * @static
     * @param {IPtyResize=} [properties] Properties to set
     * @returns {PtyResize} PtyResize instance
     */
    PtyResize.create = function create(properties) {
        return new PtyResize(properties);
    };

    /**
     * Encodes the specified PtyResize message. Does not implicitly {@link PtyResize.verify|verify} messages.
     * @function encode
     * @memberof PtyResize
     * @static
     * @param {IPtyResize} message PtyResize message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PtyResize.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.cols != null && Object.hasOwnProperty.call(message, "cols"))
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.cols);
        if (message.rows != null && Object.hasOwnProperty.call(message, "rows"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.rows);
        return writer;
    };

    /**
     * Encodes the specified PtyResize message, length delimited. Does not implicitly {@link PtyResize.verify|verify} messages.
     * @function encodeDelimited
     * @memberof PtyResize
     * @static
     * @param {IPtyResize} message PtyResize message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PtyResize.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PtyResize message from the specified reader or buffer.
     * @function decode
     * @memberof PtyResize
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {PtyResize} PtyResize
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PtyResize.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.PtyResize();
        while (reader.pos < end) {
            let tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.cols = reader.uint32();
                    break;
                }
            case 2: {
                    message.rows = reader.uint32();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a PtyResize message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof PtyResize
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {PtyResize} PtyResize
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PtyResize.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PtyResize message.
     * @function verify
     * @memberof PtyResize
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PtyResize.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.cols != null && message.hasOwnProperty("cols"))
            if (!$util.isInteger(message.cols))
                return "cols: integer expected";
        if (message.rows != null && message.hasOwnProperty("rows"))
            if (!$util.isInteger(message.rows))
                return "rows: integer expected";
        return null;
    };

    /**
     * Creates a PtyResize message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof PtyResize
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {PtyResize} PtyResize
     */
    PtyResize.fromObject = function fromObject(object) {
        if (object instanceof $root.PtyResize)
            return object;
        let message = new $root.PtyResize();
        if (object.cols != null)
            message.cols = object.cols >>> 0;
        if (object.rows != null)
            message.rows = object.rows >>> 0;
        return message;
    };

    /**
     * Creates a plain object from a PtyResize message. Also converts values to other types if specified.
     * @function toObject
     * @memberof PtyResize
     * @static
     * @param {PtyResize} message PtyResize
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PtyResize.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.cols = 0;
            object.rows = 0;
        }
        if (message.cols != null && message.hasOwnProperty("cols"))
            object.cols = message.cols;
        if (message.rows != null && message.hasOwnProperty("rows"))
            object.rows = message.rows;
        return object;
    };

    /**
     * Converts this PtyResize to JSON.
     * @function toJSON
     * @memberof PtyResize
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PtyResize.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for PtyResize
     * @function getTypeUrl
     * @memberof PtyResize
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    PtyResize.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/PtyResize";
    };

    return PtyResize;
})();

export const ServerStatus = $root.ServerStatus = (() => {

    /**
     * Properties of a ServerStatus.
     * @exports IServerStatus
     * @interface IServerStatus
     * @property {ServerState|null} [state] ServerStatus state
     * @property {number|null} [pid] ServerStatus pid
     * @property {number|Long|null} [uptime] ServerStatus uptime
     * @property {number|Long|null} [players] ServerStatus players
     * @property {string|null} [version] ServerStatus version
     */

    /**
     * Constructs a new ServerStatus.
     * @exports ServerStatus
     * @classdesc Represents a ServerStatus.
     * @implements IServerStatus
     * @constructor
     * @param {IServerStatus=} [properties] Properties to set
     */
    function ServerStatus(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ServerStatus state.
     * @member {ServerState} state
     * @memberof ServerStatus
     * @instance
     */
    ServerStatus.prototype.state = 0;

    /**
     * ServerStatus pid.
     * @member {number} pid
     * @memberof ServerStatus
     * @instance
     */
    ServerStatus.prototype.pid = 0;

    /**
     * ServerStatus uptime.
     * @member {number|Long} uptime
     * @memberof ServerStatus
     * @instance
     */
    ServerStatus.prototype.uptime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * ServerStatus players.
     * @member {number|Long} players
     * @memberof ServerStatus
     * @instance
     */
    ServerStatus.prototype.players = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * ServerStatus version.
     * @member {string} version
     * @memberof ServerStatus
     * @instance
     */
    ServerStatus.prototype.version = "";

    /**
     * Creates a new ServerStatus instance using the specified properties.
     * @function create
     * @memberof ServerStatus
     * @static
     * @param {IServerStatus=} [properties] Properties to set
     * @returns {ServerStatus} ServerStatus instance
     */
    ServerStatus.create = function create(properties) {
        return new ServerStatus(properties);
    };

    /**
     * Encodes the specified ServerStatus message. Does not implicitly {@link ServerStatus.verify|verify} messages.
     * @function encode
     * @memberof ServerStatus
     * @static
     * @param {IServerStatus} message ServerStatus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ServerStatus.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.state != null && Object.hasOwnProperty.call(message, "state"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.state);
        if (message.pid != null && Object.hasOwnProperty.call(message, "pid"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.pid);
        if (message.uptime != null && Object.hasOwnProperty.call(message, "uptime"))
            writer.uint32(/* id 3, wireType 0 =*/24).int64(message.uptime);
        if (message.players != null && Object.hasOwnProperty.call(message, "players"))
            writer.uint32(/* id 4, wireType 0 =*/32).int64(message.players);
        if (message.version != null && Object.hasOwnProperty.call(message, "version"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.version);
        return writer;
    };

    /**
     * Encodes the specified ServerStatus message, length delimited. Does not implicitly {@link ServerStatus.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ServerStatus
     * @static
     * @param {IServerStatus} message ServerStatus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ServerStatus.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ServerStatus message from the specified reader or buffer.
     * @function decode
     * @memberof ServerStatus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ServerStatus} ServerStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ServerStatus.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ServerStatus();
        while (reader.pos < end) {
            let tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.state = reader.int32();
                    break;
                }
            case 2: {
                    message.pid = reader.int32();
                    break;
                }
            case 3: {
                    message.uptime = reader.int64();
                    break;
                }
            case 4: {
                    message.players = reader.int64();
                    break;
                }
            case 5: {
                    message.version = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ServerStatus message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ServerStatus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ServerStatus} ServerStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ServerStatus.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ServerStatus message.
     * @function verify
     * @memberof ServerStatus
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ServerStatus.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.state != null && message.hasOwnProperty("state"))
            switch (message.state) {
            default:
                return "state: enum value expected";
            case 0:
            case 1:
            case 2:
                break;
            }
        if (message.pid != null && message.hasOwnProperty("pid"))
            if (!$util.isInteger(message.pid))
                return "pid: integer expected";
        if (message.uptime != null && message.hasOwnProperty("uptime"))
            if (!$util.isInteger(message.uptime) && !(message.uptime && $util.isInteger(message.uptime.low) && $util.isInteger(message.uptime.high)))
                return "uptime: integer|Long expected";
        if (message.players != null && message.hasOwnProperty("players"))
            if (!$util.isInteger(message.players) && !(message.players && $util.isInteger(message.players.low) && $util.isInteger(message.players.high)))
                return "players: integer|Long expected";
        if (message.version != null && message.hasOwnProperty("version"))
            if (!$util.isString(message.version))
                return "version: string expected";
        return null;
    };

    /**
     * Creates a ServerStatus message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ServerStatus
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ServerStatus} ServerStatus
     */
    ServerStatus.fromObject = function fromObject(object) {
        if (object instanceof $root.ServerStatus)
            return object;
        let message = new $root.ServerStatus();
        switch (object.state) {
        default:
            if (typeof object.state === "number") {
                message.state = object.state;
                break;
            }
            break;
        case "STOPPED":
        case 0:
            message.state = 0;
            break;
        case "RUNNING":
        case 1:
            message.state = 1;
            break;
        case "STOPPING":
        case 2:
            message.state = 2;
            break;
        }
        if (object.pid != null)
            message.pid = object.pid | 0;
        if (object.uptime != null)
            if ($util.Long)
                (message.uptime = $util.Long.fromValue(object.uptime)).unsigned = false;
            else if (typeof object.uptime === "string")
                message.uptime = parseInt(object.uptime, 10);
            else if (typeof object.uptime === "number")
                message.uptime = object.uptime;
            else if (typeof object.uptime === "object")
                message.uptime = new $util.LongBits(object.uptime.low >>> 0, object.uptime.high >>> 0).toNumber();
        if (object.players != null)
            if ($util.Long)
                (message.players = $util.Long.fromValue(object.players)).unsigned = false;
            else if (typeof object.players === "string")
                message.players = parseInt(object.players, 10);
            else if (typeof object.players === "number")
                message.players = object.players;
            else if (typeof object.players === "object")
                message.players = new $util.LongBits(object.players.low >>> 0, object.players.high >>> 0).toNumber();
        if (object.version != null)
            message.version = String(object.version);
        return message;
    };

    /**
     * Creates a plain object from a ServerStatus message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ServerStatus
     * @static
     * @param {ServerStatus} message ServerStatus
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ServerStatus.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.state = options.enums === String ? "STOPPED" : 0;
            object.pid = 0;
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.uptime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.uptime = options.longs === String ? "0" : 0;
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object.players = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.players = options.longs === String ? "0" : 0;
            object.version = "";
        }
        if (message.state != null && message.hasOwnProperty("state"))
            object.state = options.enums === String ? $root.ServerState[message.state] === undefined ? message.state : $root.ServerState[message.state] : message.state;
        if (message.pid != null && message.hasOwnProperty("pid"))
            object.pid = message.pid;
        if (message.uptime != null && message.hasOwnProperty("uptime"))
            if (typeof message.uptime === "number")
                object.uptime = options.longs === String ? String(message.uptime) : message.uptime;
            else
                object.uptime = options.longs === String ? $util.Long.prototype.toString.call(message.uptime) : options.longs === Number ? new $util.LongBits(message.uptime.low >>> 0, message.uptime.high >>> 0).toNumber() : message.uptime;
        if (message.players != null && message.hasOwnProperty("players"))
            if (typeof message.players === "number")
                object.players = options.longs === String ? String(message.players) : message.players;
            else
                object.players = options.longs === String ? $util.Long.prototype.toString.call(message.players) : options.longs === Number ? new $util.LongBits(message.players.low >>> 0, message.players.high >>> 0).toNumber() : message.players;
        if (message.version != null && message.hasOwnProperty("version"))
            object.version = message.version;
        return object;
    };

    /**
     * Converts this ServerStatus to JSON.
     * @function toJSON
     * @memberof ServerStatus
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ServerStatus.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ServerStatus
     * @function getTypeUrl
     * @memberof ServerStatus
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    ServerStatus.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/ServerStatus";
    };

    return ServerStatus;
})();

export const ErrorInfo = $root.ErrorInfo = (() => {

    /**
     * Properties of an ErrorInfo.
     * @exports IErrorInfo
     * @interface IErrorInfo
     * @property {string|null} [code] ErrorInfo code
     * @property {string|null} [message] ErrorInfo message
     */

    /**
     * Constructs a new ErrorInfo.
     * @exports ErrorInfo
     * @classdesc Represents an ErrorInfo.
     * @implements IErrorInfo
     * @constructor
     * @param {IErrorInfo=} [properties] Properties to set
     */
    function ErrorInfo(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ErrorInfo code.
     * @member {string} code
     * @memberof ErrorInfo
     * @instance
     */
    ErrorInfo.prototype.code = "";

    /**
     * ErrorInfo message.
     * @member {string} message
     * @memberof ErrorInfo
     * @instance
     */
    ErrorInfo.prototype.message = "";

    /**
     * Creates a new ErrorInfo instance using the specified properties.
     * @function create
     * @memberof ErrorInfo
     * @static
     * @param {IErrorInfo=} [properties] Properties to set
     * @returns {ErrorInfo} ErrorInfo instance
     */
    ErrorInfo.create = function create(properties) {
        return new ErrorInfo(properties);
    };

    /**
     * Encodes the specified ErrorInfo message. Does not implicitly {@link ErrorInfo.verify|verify} messages.
     * @function encode
     * @memberof ErrorInfo
     * @static
     * @param {IErrorInfo} message ErrorInfo message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ErrorInfo.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.code != null && Object.hasOwnProperty.call(message, "code"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.code);
        if (message.message != null && Object.hasOwnProperty.call(message, "message"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.message);
        return writer;
    };

    /**
     * Encodes the specified ErrorInfo message, length delimited. Does not implicitly {@link ErrorInfo.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ErrorInfo
     * @static
     * @param {IErrorInfo} message ErrorInfo message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ErrorInfo.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an ErrorInfo message from the specified reader or buffer.
     * @function decode
     * @memberof ErrorInfo
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ErrorInfo} ErrorInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ErrorInfo.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ErrorInfo();
        while (reader.pos < end) {
            let tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.code = reader.string();
                    break;
                }
            case 2: {
                    message.message = reader.string();
                    break;
                }
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an ErrorInfo message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ErrorInfo
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ErrorInfo} ErrorInfo
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ErrorInfo.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an ErrorInfo message.
     * @function verify
     * @memberof ErrorInfo
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ErrorInfo.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.code != null && message.hasOwnProperty("code"))
            if (!$util.isString(message.code))
                return "code: string expected";
        if (message.message != null && message.hasOwnProperty("message"))
            if (!$util.isString(message.message))
                return "message: string expected";
        return null;
    };

    /**
     * Creates an ErrorInfo message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ErrorInfo
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ErrorInfo} ErrorInfo
     */
    ErrorInfo.fromObject = function fromObject(object) {
        if (object instanceof $root.ErrorInfo)
            return object;
        let message = new $root.ErrorInfo();
        if (object.code != null)
            message.code = String(object.code);
        if (object.message != null)
            message.message = String(object.message);
        return message;
    };

    /**
     * Creates a plain object from an ErrorInfo message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ErrorInfo
     * @static
     * @param {ErrorInfo} message ErrorInfo
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ErrorInfo.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.code = "";
            object.message = "";
        }
        if (message.code != null && message.hasOwnProperty("code"))
            object.code = message.code;
        if (message.message != null && message.hasOwnProperty("message"))
            object.message = message.message;
        return object;
    };

    /**
     * Converts this ErrorInfo to JSON.
     * @function toJSON
     * @memberof ErrorInfo
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ErrorInfo.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ErrorInfo
     * @function getTypeUrl
     * @memberof ErrorInfo
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    ErrorInfo.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/ErrorInfo";
    };

    return ErrorInfo;
})();

export { $root as default };