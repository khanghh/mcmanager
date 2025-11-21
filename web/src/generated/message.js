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
 * @property {number} SUBSCRIBE=2 SUBSCRIBE value
 * @property {number} UNSUBSCRIBE=3 UNSUBSCRIBE value
 * @property {number} CMD_ATTACH=100 CMD_ATTACH value
 * @property {number} CMD_INPUT=101 CMD_INPUT value
 * @property {number} CMD_OUTPUT=102 CMD_OUTPUT value
 * @property {number} CMD_RESIZE=104 CMD_RESIZE value
 * @property {number} CMD_STATUS=105 CMD_STATUS value
 */
export const MessageType = $root.MessageType = (() => {
    const valuesById = {}, values = Object.create(valuesById);
    values[valuesById[0] = "UNKNOWN"] = 0;
    values[valuesById[1] = "ERROR"] = 1;
    values[valuesById[2] = "SUBSCRIBE"] = 2;
    values[valuesById[3] = "UNSUBSCRIBE"] = 3;
    values[valuesById[100] = "CMD_ATTACH"] = 100;
    values[valuesById[101] = "CMD_INPUT"] = 101;
    values[valuesById[102] = "CMD_OUTPUT"] = 102;
    values[valuesById[104] = "CMD_RESIZE"] = 104;
    values[valuesById[105] = "CMD_STATUS"] = 105;
    return values;
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

export const CmdInput = $root.CmdInput = (() => {

    /**
     * Properties of a CmdInput.
     * @exports ICmdInput
     * @interface ICmdInput
     * @property {string|null} [id] CmdInput id
     * @property {Uint8Array|null} [data] CmdInput data
     */

    /**
     * Constructs a new CmdInput.
     * @exports CmdInput
     * @classdesc Represents a CmdInput.
     * @implements ICmdInput
     * @constructor
     * @param {ICmdInput=} [properties] Properties to set
     */
    function CmdInput(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CmdInput id.
     * @member {string} id
     * @memberof CmdInput
     * @instance
     */
    CmdInput.prototype.id = "";

    /**
     * CmdInput data.
     * @member {Uint8Array} data
     * @memberof CmdInput
     * @instance
     */
    CmdInput.prototype.data = $util.newBuffer([]);

    /**
     * Creates a new CmdInput instance using the specified properties.
     * @function create
     * @memberof CmdInput
     * @static
     * @param {ICmdInput=} [properties] Properties to set
     * @returns {CmdInput} CmdInput instance
     */
    CmdInput.create = function create(properties) {
        return new CmdInput(properties);
    };

    /**
     * Encodes the specified CmdInput message. Does not implicitly {@link CmdInput.verify|verify} messages.
     * @function encode
     * @memberof CmdInput
     * @static
     * @param {ICmdInput} message CmdInput message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdInput.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        if (message.data != null && Object.hasOwnProperty.call(message, "data"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.data);
        return writer;
    };

    /**
     * Encodes the specified CmdInput message, length delimited. Does not implicitly {@link CmdInput.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CmdInput
     * @static
     * @param {ICmdInput} message CmdInput message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdInput.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CmdInput message from the specified reader or buffer.
     * @function decode
     * @memberof CmdInput
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CmdInput} CmdInput
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdInput.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CmdInput();
        while (reader.pos < end) {
            let tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.id = reader.string();
                    break;
                }
            case 2: {
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
     * Decodes a CmdInput message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CmdInput
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CmdInput} CmdInput
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdInput.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CmdInput message.
     * @function verify
     * @memberof CmdInput
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CmdInput.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.data != null && message.hasOwnProperty("data"))
            if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                return "data: buffer expected";
        return null;
    };

    /**
     * Creates a CmdInput message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CmdInput
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CmdInput} CmdInput
     */
    CmdInput.fromObject = function fromObject(object) {
        if (object instanceof $root.CmdInput)
            return object;
        let message = new $root.CmdInput();
        if (object.id != null)
            message.id = String(object.id);
        if (object.data != null)
            if (typeof object.data === "string")
                $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
            else if (object.data.length >= 0)
                message.data = object.data;
        return message;
    };

    /**
     * Creates a plain object from a CmdInput message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CmdInput
     * @static
     * @param {CmdInput} message CmdInput
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CmdInput.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.id = "";
            if (options.bytes === String)
                object.data = "";
            else {
                object.data = [];
                if (options.bytes !== Array)
                    object.data = $util.newBuffer(object.data);
            }
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.data != null && message.hasOwnProperty("data"))
            object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
        return object;
    };

    /**
     * Converts this CmdInput to JSON.
     * @function toJSON
     * @memberof CmdInput
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CmdInput.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for CmdInput
     * @function getTypeUrl
     * @memberof CmdInput
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    CmdInput.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/CmdInput";
    };

    return CmdInput;
})();

export const CmdOutput = $root.CmdOutput = (() => {

    /**
     * Properties of a CmdOutput.
     * @exports ICmdOutput
     * @interface ICmdOutput
     * @property {string|null} [id] CmdOutput id
     * @property {Uint8Array|null} [data] CmdOutput data
     */

    /**
     * Constructs a new CmdOutput.
     * @exports CmdOutput
     * @classdesc Represents a CmdOutput.
     * @implements ICmdOutput
     * @constructor
     * @param {ICmdOutput=} [properties] Properties to set
     */
    function CmdOutput(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CmdOutput id.
     * @member {string} id
     * @memberof CmdOutput
     * @instance
     */
    CmdOutput.prototype.id = "";

    /**
     * CmdOutput data.
     * @member {Uint8Array} data
     * @memberof CmdOutput
     * @instance
     */
    CmdOutput.prototype.data = $util.newBuffer([]);

    /**
     * Creates a new CmdOutput instance using the specified properties.
     * @function create
     * @memberof CmdOutput
     * @static
     * @param {ICmdOutput=} [properties] Properties to set
     * @returns {CmdOutput} CmdOutput instance
     */
    CmdOutput.create = function create(properties) {
        return new CmdOutput(properties);
    };

    /**
     * Encodes the specified CmdOutput message. Does not implicitly {@link CmdOutput.verify|verify} messages.
     * @function encode
     * @memberof CmdOutput
     * @static
     * @param {ICmdOutput} message CmdOutput message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdOutput.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        if (message.data != null && Object.hasOwnProperty.call(message, "data"))
            writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.data);
        return writer;
    };

    /**
     * Encodes the specified CmdOutput message, length delimited. Does not implicitly {@link CmdOutput.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CmdOutput
     * @static
     * @param {ICmdOutput} message CmdOutput message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdOutput.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CmdOutput message from the specified reader or buffer.
     * @function decode
     * @memberof CmdOutput
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CmdOutput} CmdOutput
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdOutput.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CmdOutput();
        while (reader.pos < end) {
            let tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.id = reader.string();
                    break;
                }
            case 2: {
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
     * Decodes a CmdOutput message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CmdOutput
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CmdOutput} CmdOutput
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdOutput.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CmdOutput message.
     * @function verify
     * @memberof CmdOutput
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CmdOutput.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.data != null && message.hasOwnProperty("data"))
            if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                return "data: buffer expected";
        return null;
    };

    /**
     * Creates a CmdOutput message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CmdOutput
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CmdOutput} CmdOutput
     */
    CmdOutput.fromObject = function fromObject(object) {
        if (object instanceof $root.CmdOutput)
            return object;
        let message = new $root.CmdOutput();
        if (object.id != null)
            message.id = String(object.id);
        if (object.data != null)
            if (typeof object.data === "string")
                $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
            else if (object.data.length >= 0)
                message.data = object.data;
        return message;
    };

    /**
     * Creates a plain object from a CmdOutput message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CmdOutput
     * @static
     * @param {CmdOutput} message CmdOutput
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CmdOutput.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.id = "";
            if (options.bytes === String)
                object.data = "";
            else {
                object.data = [];
                if (options.bytes !== Array)
                    object.data = $util.newBuffer(object.data);
            }
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.data != null && message.hasOwnProperty("data"))
            object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
        return object;
    };

    /**
     * Converts this CmdOutput to JSON.
     * @function toJSON
     * @memberof CmdOutput
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CmdOutput.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for CmdOutput
     * @function getTypeUrl
     * @memberof CmdOutput
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    CmdOutput.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/CmdOutput";
    };

    return CmdOutput;
})();

export const CmdResize = $root.CmdResize = (() => {

    /**
     * Properties of a CmdResize.
     * @exports ICmdResize
     * @interface ICmdResize
     * @property {string|null} [id] CmdResize id
     * @property {number|null} [cols] CmdResize cols
     * @property {number|null} [rows] CmdResize rows
     */

    /**
     * Constructs a new CmdResize.
     * @exports CmdResize
     * @classdesc Represents a CmdResize.
     * @implements ICmdResize
     * @constructor
     * @param {ICmdResize=} [properties] Properties to set
     */
    function CmdResize(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CmdResize id.
     * @member {string} id
     * @memberof CmdResize
     * @instance
     */
    CmdResize.prototype.id = "";

    /**
     * CmdResize cols.
     * @member {number} cols
     * @memberof CmdResize
     * @instance
     */
    CmdResize.prototype.cols = 0;

    /**
     * CmdResize rows.
     * @member {number} rows
     * @memberof CmdResize
     * @instance
     */
    CmdResize.prototype.rows = 0;

    /**
     * Creates a new CmdResize instance using the specified properties.
     * @function create
     * @memberof CmdResize
     * @static
     * @param {ICmdResize=} [properties] Properties to set
     * @returns {CmdResize} CmdResize instance
     */
    CmdResize.create = function create(properties) {
        return new CmdResize(properties);
    };

    /**
     * Encodes the specified CmdResize message. Does not implicitly {@link CmdResize.verify|verify} messages.
     * @function encode
     * @memberof CmdResize
     * @static
     * @param {ICmdResize} message CmdResize message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdResize.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        if (message.cols != null && Object.hasOwnProperty.call(message, "cols"))
            writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.cols);
        if (message.rows != null && Object.hasOwnProperty.call(message, "rows"))
            writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.rows);
        return writer;
    };

    /**
     * Encodes the specified CmdResize message, length delimited. Does not implicitly {@link CmdResize.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CmdResize
     * @static
     * @param {ICmdResize} message CmdResize message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdResize.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CmdResize message from the specified reader or buffer.
     * @function decode
     * @memberof CmdResize
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CmdResize} CmdResize
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdResize.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CmdResize();
        while (reader.pos < end) {
            let tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.id = reader.string();
                    break;
                }
            case 2: {
                    message.cols = reader.uint32();
                    break;
                }
            case 3: {
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
     * Decodes a CmdResize message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CmdResize
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CmdResize} CmdResize
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdResize.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CmdResize message.
     * @function verify
     * @memberof CmdResize
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CmdResize.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.cols != null && message.hasOwnProperty("cols"))
            if (!$util.isInteger(message.cols))
                return "cols: integer expected";
        if (message.rows != null && message.hasOwnProperty("rows"))
            if (!$util.isInteger(message.rows))
                return "rows: integer expected";
        return null;
    };

    /**
     * Creates a CmdResize message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CmdResize
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CmdResize} CmdResize
     */
    CmdResize.fromObject = function fromObject(object) {
        if (object instanceof $root.CmdResize)
            return object;
        let message = new $root.CmdResize();
        if (object.id != null)
            message.id = String(object.id);
        if (object.cols != null)
            message.cols = object.cols >>> 0;
        if (object.rows != null)
            message.rows = object.rows >>> 0;
        return message;
    };

    /**
     * Creates a plain object from a CmdResize message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CmdResize
     * @static
     * @param {CmdResize} message CmdResize
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CmdResize.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.id = "";
            object.cols = 0;
            object.rows = 0;
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.cols != null && message.hasOwnProperty("cols"))
            object.cols = message.cols;
        if (message.rows != null && message.hasOwnProperty("rows"))
            object.rows = message.rows;
        return object;
    };

    /**
     * Converts this CmdResize to JSON.
     * @function toJSON
     * @memberof CmdResize
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CmdResize.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for CmdResize
     * @function getTypeUrl
     * @memberof CmdResize
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    CmdResize.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/CmdResize";
    };

    return CmdResize;
})();

export const CmdStatus = $root.CmdStatus = (() => {

    /**
     * Properties of a CmdStatus.
     * @exports ICmdStatus
     * @interface ICmdStatus
     * @property {string|null} [id] CmdStatus id
     * @property {string|null} [status] CmdStatus status
     */

    /**
     * Constructs a new CmdStatus.
     * @exports CmdStatus
     * @classdesc Represents a CmdStatus.
     * @implements ICmdStatus
     * @constructor
     * @param {ICmdStatus=} [properties] Properties to set
     */
    function CmdStatus(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CmdStatus id.
     * @member {string} id
     * @memberof CmdStatus
     * @instance
     */
    CmdStatus.prototype.id = "";

    /**
     * CmdStatus status.
     * @member {string} status
     * @memberof CmdStatus
     * @instance
     */
    CmdStatus.prototype.status = "";

    /**
     * Creates a new CmdStatus instance using the specified properties.
     * @function create
     * @memberof CmdStatus
     * @static
     * @param {ICmdStatus=} [properties] Properties to set
     * @returns {CmdStatus} CmdStatus instance
     */
    CmdStatus.create = function create(properties) {
        return new CmdStatus(properties);
    };

    /**
     * Encodes the specified CmdStatus message. Does not implicitly {@link CmdStatus.verify|verify} messages.
     * @function encode
     * @memberof CmdStatus
     * @static
     * @param {ICmdStatus} message CmdStatus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdStatus.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && Object.hasOwnProperty.call(message, "id"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        if (message.status != null && Object.hasOwnProperty.call(message, "status"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.status);
        return writer;
    };

    /**
     * Encodes the specified CmdStatus message, length delimited. Does not implicitly {@link CmdStatus.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CmdStatus
     * @static
     * @param {ICmdStatus} message CmdStatus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CmdStatus.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CmdStatus message from the specified reader or buffer.
     * @function decode
     * @memberof CmdStatus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CmdStatus} CmdStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdStatus.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CmdStatus();
        while (reader.pos < end) {
            let tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.id = reader.string();
                    break;
                }
            case 2: {
                    message.status = reader.string();
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
     * Decodes a CmdStatus message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CmdStatus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CmdStatus} CmdStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CmdStatus.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CmdStatus message.
     * @function verify
     * @memberof CmdStatus
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CmdStatus.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.status != null && message.hasOwnProperty("status"))
            if (!$util.isString(message.status))
                return "status: string expected";
        return null;
    };

    /**
     * Creates a CmdStatus message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CmdStatus
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CmdStatus} CmdStatus
     */
    CmdStatus.fromObject = function fromObject(object) {
        if (object instanceof $root.CmdStatus)
            return object;
        let message = new $root.CmdStatus();
        if (object.id != null)
            message.id = String(object.id);
        if (object.status != null)
            message.status = String(object.status);
        return message;
    };

    /**
     * Creates a plain object from a CmdStatus message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CmdStatus
     * @static
     * @param {CmdStatus} message CmdStatus
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CmdStatus.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.id = "";
            object.status = "";
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.status != null && message.hasOwnProperty("status"))
            object.status = message.status;
        return object;
    };

    /**
     * Converts this CmdStatus to JSON.
     * @function toJSON
     * @memberof CmdStatus
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CmdStatus.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for CmdStatus
     * @function getTypeUrl
     * @memberof CmdStatus
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    CmdStatus.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/CmdStatus";
    };

    return CmdStatus;
})();

export const Subscribe = $root.Subscribe = (() => {

    /**
     * Properties of a Subscribe.
     * @exports ISubscribe
     * @interface ISubscribe
     * @property {string|null} [topic] Subscribe topic
     */

    /**
     * Constructs a new Subscribe.
     * @exports Subscribe
     * @classdesc Represents a Subscribe.
     * @implements ISubscribe
     * @constructor
     * @param {ISubscribe=} [properties] Properties to set
     */
    function Subscribe(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Subscribe topic.
     * @member {string} topic
     * @memberof Subscribe
     * @instance
     */
    Subscribe.prototype.topic = "";

    /**
     * Creates a new Subscribe instance using the specified properties.
     * @function create
     * @memberof Subscribe
     * @static
     * @param {ISubscribe=} [properties] Properties to set
     * @returns {Subscribe} Subscribe instance
     */
    Subscribe.create = function create(properties) {
        return new Subscribe(properties);
    };

    /**
     * Encodes the specified Subscribe message. Does not implicitly {@link Subscribe.verify|verify} messages.
     * @function encode
     * @memberof Subscribe
     * @static
     * @param {ISubscribe} message Subscribe message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Subscribe.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.topic != null && Object.hasOwnProperty.call(message, "topic"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.topic);
        return writer;
    };

    /**
     * Encodes the specified Subscribe message, length delimited. Does not implicitly {@link Subscribe.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Subscribe
     * @static
     * @param {ISubscribe} message Subscribe message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Subscribe.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Subscribe message from the specified reader or buffer.
     * @function decode
     * @memberof Subscribe
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Subscribe} Subscribe
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Subscribe.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Subscribe();
        while (reader.pos < end) {
            let tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.topic = reader.string();
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
     * Decodes a Subscribe message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Subscribe
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Subscribe} Subscribe
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Subscribe.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Subscribe message.
     * @function verify
     * @memberof Subscribe
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Subscribe.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.topic != null && message.hasOwnProperty("topic"))
            if (!$util.isString(message.topic))
                return "topic: string expected";
        return null;
    };

    /**
     * Creates a Subscribe message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Subscribe
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Subscribe} Subscribe
     */
    Subscribe.fromObject = function fromObject(object) {
        if (object instanceof $root.Subscribe)
            return object;
        let message = new $root.Subscribe();
        if (object.topic != null)
            message.topic = String(object.topic);
        return message;
    };

    /**
     * Creates a plain object from a Subscribe message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Subscribe
     * @static
     * @param {Subscribe} message Subscribe
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Subscribe.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.topic = "";
        if (message.topic != null && message.hasOwnProperty("topic"))
            object.topic = message.topic;
        return object;
    };

    /**
     * Converts this Subscribe to JSON.
     * @function toJSON
     * @memberof Subscribe
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Subscribe.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Subscribe
     * @function getTypeUrl
     * @memberof Subscribe
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Subscribe.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Subscribe";
    };

    return Subscribe;
})();

export const Unsubscribe = $root.Unsubscribe = (() => {

    /**
     * Properties of an Unsubscribe.
     * @exports IUnsubscribe
     * @interface IUnsubscribe
     * @property {string|null} [topic] Unsubscribe topic
     */

    /**
     * Constructs a new Unsubscribe.
     * @exports Unsubscribe
     * @classdesc Represents an Unsubscribe.
     * @implements IUnsubscribe
     * @constructor
     * @param {IUnsubscribe=} [properties] Properties to set
     */
    function Unsubscribe(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Unsubscribe topic.
     * @member {string} topic
     * @memberof Unsubscribe
     * @instance
     */
    Unsubscribe.prototype.topic = "";

    /**
     * Creates a new Unsubscribe instance using the specified properties.
     * @function create
     * @memberof Unsubscribe
     * @static
     * @param {IUnsubscribe=} [properties] Properties to set
     * @returns {Unsubscribe} Unsubscribe instance
     */
    Unsubscribe.create = function create(properties) {
        return new Unsubscribe(properties);
    };

    /**
     * Encodes the specified Unsubscribe message. Does not implicitly {@link Unsubscribe.verify|verify} messages.
     * @function encode
     * @memberof Unsubscribe
     * @static
     * @param {IUnsubscribe} message Unsubscribe message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Unsubscribe.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.topic != null && Object.hasOwnProperty.call(message, "topic"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.topic);
        return writer;
    };

    /**
     * Encodes the specified Unsubscribe message, length delimited. Does not implicitly {@link Unsubscribe.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Unsubscribe
     * @static
     * @param {IUnsubscribe} message Unsubscribe message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Unsubscribe.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an Unsubscribe message from the specified reader or buffer.
     * @function decode
     * @memberof Unsubscribe
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Unsubscribe} Unsubscribe
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Unsubscribe.decode = function decode(reader, length, error) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.Unsubscribe();
        while (reader.pos < end) {
            let tag = reader.uint32();
            if (tag === error)
                break;
            switch (tag >>> 3) {
            case 1: {
                    message.topic = reader.string();
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
     * Decodes an Unsubscribe message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Unsubscribe
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Unsubscribe} Unsubscribe
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Unsubscribe.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an Unsubscribe message.
     * @function verify
     * @memberof Unsubscribe
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Unsubscribe.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.topic != null && message.hasOwnProperty("topic"))
            if (!$util.isString(message.topic))
                return "topic: string expected";
        return null;
    };

    /**
     * Creates an Unsubscribe message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Unsubscribe
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Unsubscribe} Unsubscribe
     */
    Unsubscribe.fromObject = function fromObject(object) {
        if (object instanceof $root.Unsubscribe)
            return object;
        let message = new $root.Unsubscribe();
        if (object.topic != null)
            message.topic = String(object.topic);
        return message;
    };

    /**
     * Creates a plain object from an Unsubscribe message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Unsubscribe
     * @static
     * @param {Unsubscribe} message Unsubscribe
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Unsubscribe.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.topic = "";
        if (message.topic != null && message.hasOwnProperty("topic"))
            object.topic = message.topic;
        return object;
    };

    /**
     * Converts this Unsubscribe to JSON.
     * @function toJSON
     * @memberof Unsubscribe
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Unsubscribe.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Unsubscribe
     * @function getTypeUrl
     * @memberof Unsubscribe
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Unsubscribe.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/Unsubscribe";
    };

    return Unsubscribe;
})();

export const Message = $root.Message = (() => {

    /**
     * Properties of a Message.
     * @exports IMessage
     * @interface IMessage
     * @property {MessageType|null} [type] Message type
     * @property {IErrorInfo|null} [error] Message error
     * @property {ISubscribe|null} [subscribe] Message subscribe
     * @property {IUnsubscribe|null} [unsubscribe] Message unsubscribe
     * @property {ICmdInput|null} [cmdInput] Message cmdInput
     * @property {ICmdOutput|null} [cmdOutput] Message cmdOutput
     * @property {ICmdResize|null} [cmdResize] Message cmdResize
     * @property {ICmdStatus|null} [cmdStatus] Message cmdStatus
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
     * Message subscribe.
     * @member {ISubscribe|null|undefined} subscribe
     * @memberof Message
     * @instance
     */
    Message.prototype.subscribe = null;

    /**
     * Message unsubscribe.
     * @member {IUnsubscribe|null|undefined} unsubscribe
     * @memberof Message
     * @instance
     */
    Message.prototype.unsubscribe = null;

    /**
     * Message cmdInput.
     * @member {ICmdInput|null|undefined} cmdInput
     * @memberof Message
     * @instance
     */
    Message.prototype.cmdInput = null;

    /**
     * Message cmdOutput.
     * @member {ICmdOutput|null|undefined} cmdOutput
     * @memberof Message
     * @instance
     */
    Message.prototype.cmdOutput = null;

    /**
     * Message cmdResize.
     * @member {ICmdResize|null|undefined} cmdResize
     * @memberof Message
     * @instance
     */
    Message.prototype.cmdResize = null;

    /**
     * Message cmdStatus.
     * @member {ICmdStatus|null|undefined} cmdStatus
     * @memberof Message
     * @instance
     */
    Message.prototype.cmdStatus = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * Message payload.
     * @member {"error"|"subscribe"|"unsubscribe"|"cmdInput"|"cmdOutput"|"cmdResize"|"cmdStatus"|undefined} payload
     * @memberof Message
     * @instance
     */
    Object.defineProperty(Message.prototype, "payload", {
        get: $util.oneOfGetter($oneOfFields = ["error", "subscribe", "unsubscribe", "cmdInput", "cmdOutput", "cmdResize", "cmdStatus"]),
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
        if (message.subscribe != null && Object.hasOwnProperty.call(message, "subscribe"))
            $root.Subscribe.encode(message.subscribe, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
        if (message.unsubscribe != null && Object.hasOwnProperty.call(message, "unsubscribe"))
            $root.Unsubscribe.encode(message.unsubscribe, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
        if (message.cmdInput != null && Object.hasOwnProperty.call(message, "cmdInput"))
            $root.CmdInput.encode(message.cmdInput, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
        if (message.cmdOutput != null && Object.hasOwnProperty.call(message, "cmdOutput"))
            $root.CmdOutput.encode(message.cmdOutput, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
        if (message.cmdResize != null && Object.hasOwnProperty.call(message, "cmdResize"))
            $root.CmdResize.encode(message.cmdResize, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
        if (message.cmdStatus != null && Object.hasOwnProperty.call(message, "cmdStatus"))
            $root.CmdStatus.encode(message.cmdStatus, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
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
                    message.subscribe = $root.Subscribe.decode(reader, reader.uint32());
                    break;
                }
            case 4: {
                    message.unsubscribe = $root.Unsubscribe.decode(reader, reader.uint32());
                    break;
                }
            case 5: {
                    message.cmdInput = $root.CmdInput.decode(reader, reader.uint32());
                    break;
                }
            case 6: {
                    message.cmdOutput = $root.CmdOutput.decode(reader, reader.uint32());
                    break;
                }
            case 7: {
                    message.cmdResize = $root.CmdResize.decode(reader, reader.uint32());
                    break;
                }
            case 8: {
                    message.cmdStatus = $root.CmdStatus.decode(reader, reader.uint32());
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
            case 2:
            case 3:
            case 100:
            case 101:
            case 102:
            case 104:
            case 105:
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
        if (message.subscribe != null && message.hasOwnProperty("subscribe")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                let error = $root.Subscribe.verify(message.subscribe);
                if (error)
                    return "subscribe." + error;
            }
        }
        if (message.unsubscribe != null && message.hasOwnProperty("unsubscribe")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                let error = $root.Unsubscribe.verify(message.unsubscribe);
                if (error)
                    return "unsubscribe." + error;
            }
        }
        if (message.cmdInput != null && message.hasOwnProperty("cmdInput")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                let error = $root.CmdInput.verify(message.cmdInput);
                if (error)
                    return "cmdInput." + error;
            }
        }
        if (message.cmdOutput != null && message.hasOwnProperty("cmdOutput")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                let error = $root.CmdOutput.verify(message.cmdOutput);
                if (error)
                    return "cmdOutput." + error;
            }
        }
        if (message.cmdResize != null && message.hasOwnProperty("cmdResize")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                let error = $root.CmdResize.verify(message.cmdResize);
                if (error)
                    return "cmdResize." + error;
            }
        }
        if (message.cmdStatus != null && message.hasOwnProperty("cmdStatus")) {
            if (properties.payload === 1)
                return "payload: multiple values";
            properties.payload = 1;
            {
                let error = $root.CmdStatus.verify(message.cmdStatus);
                if (error)
                    return "cmdStatus." + error;
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
        case "SUBSCRIBE":
        case 2:
            message.type = 2;
            break;
        case "UNSUBSCRIBE":
        case 3:
            message.type = 3;
            break;
        case "CMD_ATTACH":
        case 100:
            message.type = 100;
            break;
        case "CMD_INPUT":
        case 101:
            message.type = 101;
            break;
        case "CMD_OUTPUT":
        case 102:
            message.type = 102;
            break;
        case "CMD_RESIZE":
        case 104:
            message.type = 104;
            break;
        case "CMD_STATUS":
        case 105:
            message.type = 105;
            break;
        }
        if (object.error != null) {
            if (typeof object.error !== "object")
                throw TypeError(".Message.error: object expected");
            message.error = $root.ErrorInfo.fromObject(object.error);
        }
        if (object.subscribe != null) {
            if (typeof object.subscribe !== "object")
                throw TypeError(".Message.subscribe: object expected");
            message.subscribe = $root.Subscribe.fromObject(object.subscribe);
        }
        if (object.unsubscribe != null) {
            if (typeof object.unsubscribe !== "object")
                throw TypeError(".Message.unsubscribe: object expected");
            message.unsubscribe = $root.Unsubscribe.fromObject(object.unsubscribe);
        }
        if (object.cmdInput != null) {
            if (typeof object.cmdInput !== "object")
                throw TypeError(".Message.cmdInput: object expected");
            message.cmdInput = $root.CmdInput.fromObject(object.cmdInput);
        }
        if (object.cmdOutput != null) {
            if (typeof object.cmdOutput !== "object")
                throw TypeError(".Message.cmdOutput: object expected");
            message.cmdOutput = $root.CmdOutput.fromObject(object.cmdOutput);
        }
        if (object.cmdResize != null) {
            if (typeof object.cmdResize !== "object")
                throw TypeError(".Message.cmdResize: object expected");
            message.cmdResize = $root.CmdResize.fromObject(object.cmdResize);
        }
        if (object.cmdStatus != null) {
            if (typeof object.cmdStatus !== "object")
                throw TypeError(".Message.cmdStatus: object expected");
            message.cmdStatus = $root.CmdStatus.fromObject(object.cmdStatus);
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
        if (message.subscribe != null && message.hasOwnProperty("subscribe")) {
            object.subscribe = $root.Subscribe.toObject(message.subscribe, options);
            if (options.oneofs)
                object.payload = "subscribe";
        }
        if (message.unsubscribe != null && message.hasOwnProperty("unsubscribe")) {
            object.unsubscribe = $root.Unsubscribe.toObject(message.unsubscribe, options);
            if (options.oneofs)
                object.payload = "unsubscribe";
        }
        if (message.cmdInput != null && message.hasOwnProperty("cmdInput")) {
            object.cmdInput = $root.CmdInput.toObject(message.cmdInput, options);
            if (options.oneofs)
                object.payload = "cmdInput";
        }
        if (message.cmdOutput != null && message.hasOwnProperty("cmdOutput")) {
            object.cmdOutput = $root.CmdOutput.toObject(message.cmdOutput, options);
            if (options.oneofs)
                object.payload = "cmdOutput";
        }
        if (message.cmdResize != null && message.hasOwnProperty("cmdResize")) {
            object.cmdResize = $root.CmdResize.toObject(message.cmdResize, options);
            if (options.oneofs)
                object.payload = "cmdResize";
        }
        if (message.cmdStatus != null && message.hasOwnProperty("cmdStatus")) {
            object.cmdStatus = $root.CmdStatus.toObject(message.cmdStatus, options);
            if (options.oneofs)
                object.payload = "cmdStatus";
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

export { $root as default };
