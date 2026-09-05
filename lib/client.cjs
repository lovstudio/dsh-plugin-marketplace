window.__ModuleLoader__.load({
	id: "@lovstudio/dsh-plugin-marketplace",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_store = require("@deepseek-ai/dsh-client-store");
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region node_modules/.pnpm/@deepseek-ai+cosmokit@1.8.3/node_modules/@deepseek-ai/cosmokit/lib/index.js
		/** Return true when a value is `null` or `undefined`. */
		function isNullable(value) {
			return value === null || value === void 0;
		}
		/** Return true for non-array object values. */
		function isPlainObject$1(data) {
			return data && typeof data === "object" && !Array.isArray(data);
		}
		/** Filter object entries and return a new object. */
		function filterKeys(object, filter) {
			return Object.fromEntries(Object.entries(object).filter(([key, value]) => filter(key, value)));
		}
		/** Map object values while preserving the original key set. */
		function mapValues(object, transform) {
			return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transform(value, key)]));
		}
		/** Pick selected keys from an object, optionally including `undefined` values. */
		function pick$1(source, keys, forced) {
			if (!keys) return { ...source };
			const result = {};
			for (const key of keys) if (forced || source[key] !== void 0) result[key] = source[key];
			return result;
		}
		/** Test values using `instanceof` with a `toStringTag` fallback. */
		function is(type, value) {
			if (arguments.length === 1) return (value) => is(type, value);
			return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
		}
		function isArrayBufferLike(value) {
			return is("ArrayBuffer", value) || is("SharedArrayBuffer", value);
		}
		function isArrayBufferSource(value) {
			return isArrayBufferLike(value) || ArrayBuffer.isView(value);
		}
		/** Binary source detection and base64/hex conversion helpers. */
		var Binary;
		(function(Binary) {
			Binary.is = isArrayBufferLike;
			Binary.isSource = isArrayBufferSource;
			function fromSource(source) {
				if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
				else return source;
			}
			Binary.fromSource = fromSource;
			function toBase64(source) {
				source = fromSource(source);
				if (typeof Buffer !== "undefined") return Buffer.from(source).toString("base64");
				let binary = "";
				const bytes = new Uint8Array(source);
				for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
				return btoa(binary);
			}
			Binary.toBase64 = toBase64;
			function fromBase64(source) {
				if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "base64"));
				return Uint8Array.from(atob(source), (c) => c.charCodeAt(0));
			}
			Binary.fromBase64 = fromBase64;
			function toHex(source) {
				source = fromSource(source);
				if (typeof Buffer !== "undefined") return Buffer.from(source).toString("hex");
				return Array.from(new Uint8Array(source), (byte) => byte.toString(16).padStart(2, "0")).join("");
			}
			Binary.toHex = toHex;
			function fromHex(source) {
				if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "hex"));
				const hex = source.length % 2 === 0 ? source : source.slice(0, source.length - 1);
				const buffer = [];
				for (let i = 0; i < hex.length; i += 2) buffer.push(parseInt(`${hex[i]}${hex[i + 1]}`, 16));
				return Uint8Array.from(buffer).buffer;
			}
			Binary.fromHex = fromHex;
		})(Binary || (Binary = {}));
		Binary.fromBase64;
		Binary.toBase64;
		Binary.fromHex;
		Binary.toHex;
		/** Deep-clone common JavaScript values while preserving prototypes and cycles. */
		function clone$1(source, refs = /* @__PURE__ */ new Map()) {
			if (!source || typeof source !== "object") return source;
			if (is("Date", source)) return new Date(source.valueOf());
			if (is("RegExp", source)) return new RegExp(source.source, source.flags);
			if (isArrayBufferLike(source)) return source.slice(0);
			if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
			const cached = refs.get(source);
			if (cached) return cached;
			if (Array.isArray(source)) {
				const result = [];
				refs.set(source, result);
				source.forEach((value, index) => {
					result[index] = Reflect.apply(clone$1, null, [value, refs]);
				});
				return result;
			}
			const result = Object.create(Object.getPrototypeOf(source));
			refs.set(source, result);
			for (const key of Reflect.ownKeys(source)) {
				const descriptor = { ...Reflect.getOwnPropertyDescriptor(source, key) };
				if ("value" in descriptor) descriptor.value = Reflect.apply(clone$1, null, [descriptor.value, refs]);
				Reflect.defineProperty(result, key, descriptor);
			}
			return result;
		}
		/** Deeply compare arrays, dates, regexps, buffers, and plain object fields. */
		function deepEqual(a, b, strict) {
			if (a === b) return true;
			if (!strict && isNullable(a) && isNullable(b)) return true;
			if (typeof a !== typeof b) return false;
			if (typeof a !== "object") return false;
			if (!a || !b) return false;
			function check(test, then) {
				return test(a) ? test(b) ? then(a, b) : false : test(b) ? false : void 0;
			}
			return check(Array.isArray, (a, b) => a.length === b.length && a.every((item, index) => deepEqual(item, b[index]))) ?? check(is("Date"), (a, b) => a.valueOf() === b.valueOf()) ?? check(is("RegExp"), (a, b) => a.source === b.source && a.flags === b.flags) ?? check(isArrayBufferLike, (a, b) => {
				if (a.byteLength !== b.byteLength) return false;
				const viewA = new Uint8Array(a);
				const viewB = new Uint8Array(b);
				for (let i = 0; i < viewA.length; i++) if (viewA[i] !== viewB[i]) return false;
				return true;
			}) ?? Object.keys({
				...a,
				...b
			}).every((key) => deepEqual(a[key], b[key], strict));
		}
		/** Time constants plus parsing and formatting helpers. */
		var Time;
		(function(Time) {
			Time.millisecond = 1;
			Time.second = 1e3;
			Time.minute = Time.second * 60;
			Time.hour = Time.minute * 60;
			Time.day = Time.hour * 24;
			Time.week = Time.day * 7;
			let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
			function setTimezoneOffset(offset) {
				timezoneOffset = offset;
			}
			Time.setTimezoneOffset = setTimezoneOffset;
			function getTimezoneOffset() {
				return timezoneOffset;
			}
			Time.getTimezoneOffset = getTimezoneOffset;
			function getDateNumber(date = /* @__PURE__ */ new Date(), offset) {
				if (typeof date === "number") date = new Date(date);
				if (offset === void 0) offset = timezoneOffset;
				return Math.floor((date.valueOf() / Time.minute - offset) / 1440);
			}
			Time.getDateNumber = getDateNumber;
			function fromDateNumber(value, offset) {
				const date = new Date(value * Time.day);
				if (offset === void 0) offset = timezoneOffset;
				return new Date(+date + offset * Time.minute);
			}
			Time.fromDateNumber = fromDateNumber;
			const numeric = /\d+(?:\.\d+)?/.source;
			const timeRegExp = new RegExp(`^${[
				"w(?:eek(?:s)?)?",
				"d(?:ay(?:s)?)?",
				"h(?:our(?:s)?)?",
				"m(?:in(?:ute)?(?:s)?)?",
				"s(?:ec(?:ond)?(?:s)?)?"
			].map((unit) => `(${numeric}${unit})?`).join("")}$`);
			function parseTime(source) {
				const capture = timeRegExp.exec(source);
				if (!capture) return 0;
				return (parseFloat(capture[1]) * Time.week || 0) + (parseFloat(capture[2]) * Time.day || 0) + (parseFloat(capture[3]) * Time.hour || 0) + (parseFloat(capture[4]) * Time.minute || 0) + (parseFloat(capture[5]) * Time.second || 0);
			}
			Time.parseTime = parseTime;
			function parseDate(date) {
				const parsed = parseTime(date);
				if (parsed) date = Date.now() + parsed;
				else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date}`;
				else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date}`;
				return date ? new Date(date) : /* @__PURE__ */ new Date();
			}
			Time.parseDate = parseDate;
			function format(ms) {
				const abs = Math.abs(ms);
				if (abs >= Time.day - Time.hour / 2) return Math.round(ms / Time.day) + "d";
				else if (abs >= Time.hour - Time.minute / 2) return Math.round(ms / Time.hour) + "h";
				else if (abs >= Time.minute - Time.second / 2) return Math.round(ms / Time.minute) + "m";
				else if (abs >= Time.second) return Math.round(ms / Time.second) + "s";
				return ms + "ms";
			}
			Time.format = format;
			function toDigits(source, length = 2) {
				return source.toString().padStart(length, "0");
			}
			Time.toDigits = toDigits;
			function template(template, time = /* @__PURE__ */ new Date()) {
				return template.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
			}
			Time.template = template;
		})(Time || (Time = {}));
		//#endregion
		//#region node_modules/.pnpm/@deepseek-ai+schemastery@3.18.2/node_modules/@deepseek-ai/schemastery/lib/index.mjs
		const kSchema = Symbol.for("schemastery");
		const kValidationError = Symbol.for("ValidationError");
		globalThis.__schemastery_index__ ??= 0;
		globalThis.__schemastery_refs__ = void 0;
		var ValidationError = class extends TypeError {
			options;
			name = "ValidationError";
			constructor(message, options) {
				let prefix = "$";
				for (const segment of options.path || []) if (typeof segment === "string") prefix += "." + segment;
				else if (typeof segment === "number") prefix += "[" + segment + "]";
				else if (typeof segment === "symbol") prefix += `[Symbol(${segment.toString()})]`;
				if (prefix.startsWith(".")) prefix = prefix.slice(1);
				super((prefix === "$" ? "" : `${prefix} `) + message);
				this.options = options;
			}
			static is(error) {
				return !!error?.[kValidationError];
			}
		};
		Object.defineProperty(ValidationError.prototype, kValidationError, { value: true });
		const Schema = function(options) {
			const schema = function(data, options = {}) {
				return Schema.resolve(data, schema, options)[0];
			};
			if (options.refs) {
				const refs = mapValues(options.refs, (options) => new Schema(options));
				const getRef = (uid) => refs[uid];
				for (const key in refs) {
					const options = refs[key];
					options.sKey = getRef(options.sKey);
					options.inner = getRef(options.inner);
					options.list = options.list && options.list.map(getRef);
					options.dict = options.dict && mapValues(options.dict, getRef);
				}
				return refs[options.uid];
			}
			Object.assign(schema, options);
			if (typeof schema.callback === "string") try {
				schema.callback = new Function("return " + schema.callback)();
			} catch {}
			Object.defineProperty(schema, "uid", { value: globalThis.__schemastery_index__++ });
			Object.setPrototypeOf(schema, Schema.prototype);
			schema.meta ||= {};
			schema.toString = schema.toString.bind(schema);
			return schema;
		};
		Schema.prototype = Object.create(Function.prototype);
		Schema.prototype[kSchema] = true;
		Object.defineProperty(Schema.prototype, "~standard", { get() {
			return {
				version: 1,
				vendor: "schemastery",
				validate: (value) => {
					try {
						return { value: Schema.resolve(value, this, {})[0] };
					} catch (error) {
						if (ValidationError.is(error)) return { issues: [{
							message: error.message,
							path: error.options.path
						}] };
						throw error;
					}
				}
			};
		} });
		Schema.ValidationError = ValidationError;
		Schema.prototype.toJSON = function toJSON() {
			if (globalThis.__schemastery_refs__) {
				globalThis.__schemastery_refs__[this.uid] ??= JSON.parse(JSON.stringify({ ...this }));
				return this.uid;
			}
			globalThis.__schemastery_refs__ = { [this.uid]: { ...this } };
			globalThis.__schemastery_refs__[this.uid] = JSON.parse(JSON.stringify({ ...this }));
			const result = {
				uid: this.uid,
				refs: globalThis.__schemastery_refs__
			};
			globalThis.__schemastery_refs__ = void 0;
			return result;
		};
		Schema.prototype.set = function set(key, value) {
			this.dict[key] = value;
			return this;
		};
		Schema.prototype.push = function push(value) {
			this.list.push(value);
			return this;
		};
		function mergeDesc(original, messages) {
			const result = typeof original === "string" ? { "": original } : { ...original };
			for (const locale in messages) {
				const value = messages[locale];
				if (value?.$description || value?.$desc) result[locale] = value.$description || value.$desc;
				else if (typeof value === "string") result[locale] = value;
			}
			return result;
		}
		function getInner(value) {
			return value?.$value ?? value?.$inner;
		}
		function extractKeys(data) {
			return filterKeys(data ?? {}, (key) => !key.startsWith("$"));
		}
		Schema.prototype.i18n = function i18n(messages) {
			const schema = Schema(this);
			const desc = mergeDesc(schema.meta.description, messages);
			if (Object.keys(desc).length) schema.meta.description = desc;
			if (schema.dict) schema.dict = mapValues(schema.dict, (inner, key) => {
				return inner.i18n(mapValues(messages, (data) => getInner(data)?.[key] ?? data?.[key]));
			});
			if (schema.list) schema.list = schema.list.map((inner, index) => {
				return inner.i18n(mapValues(messages, (data = {}) => {
					if (Array.isArray(getInner(data))) return getInner(data)[index];
					if (Array.isArray(data)) return data[index];
					return extractKeys(data);
				}));
			});
			if (schema.inner) schema.inner = schema.inner.i18n(mapValues(messages, (data) => {
				if (getInner(data)) return getInner(data);
				return extractKeys(data);
			}));
			if (schema.sKey) schema.sKey = schema.sKey.i18n(mapValues(messages, (data) => data?.$key));
			return schema;
		};
		Schema.prototype.extra = function extra(key, value) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				[key]: value
			};
			return schema;
		};
		for (const key of [
			"required",
			"disabled",
			"collapse",
			"hidden",
			"loose"
		]) Object.assign(Schema.prototype, { [key](value = true) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				[key]: value
			};
			return schema;
		} });
		Schema.prototype.deprecated = function deprecated() {
			const schema = Schema(this);
			schema.meta.badges ||= [];
			schema.meta.badges.push({
				text: "deprecated",
				type: "danger"
			});
			return schema;
		};
		Schema.prototype.experimental = function experimental() {
			const schema = Schema(this);
			schema.meta.badges ||= [];
			schema.meta.badges.push({
				text: "experimental",
				type: "warning"
			});
			return schema;
		};
		Schema.prototype.pattern = function pattern(regexp) {
			const schema = Schema(this);
			const pattern = pick$1(regexp, ["source", "flags"]);
			schema.meta = {
				...schema.meta,
				pattern
			};
			return schema;
		};
		Schema.prototype.simplify = function simplify(value) {
			if (deepEqual(value, this.meta.default, this.type === "dict")) return null;
			if (isNullable(value)) return value;
			if (this.type === "object" || this.type === "dict") {
				const result = {};
				for (const key in value) {
					const item = (this.type === "object" ? this.dict[key] : this.inner)?.simplify(value[key]);
					if (this.type === "dict" || !isNullable(item)) result[key] = item;
				}
				if (deepEqual(result, this.meta.default, this.type === "dict")) return null;
				return result;
			} else if (this.type === "array" || this.type === "tuple") {
				const result = [];
				value.forEach((value, index) => {
					const schema = this.type === "array" ? this.inner : this.list[index];
					const item = schema ? schema.simplify(value) : value;
					result.push(item);
				});
				return result;
			} else if (this.type === "intersect") {
				const result = {};
				for (const item of this.list) Object.assign(result, item.simplify(value));
				return result;
			} else if (this.type === "union") for (const schema of this.list) try {
				Schema.resolve(value, schema, {});
				return schema.simplify(value);
			} catch {}
			return value;
		};
		Schema.prototype.toString = function toString(inline) {
			return formatters[this.type]?.(this, inline) ?? `Schema<${this.type}>`;
		};
		Schema.prototype.role = function role(role, extra) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				role,
				extra
			};
			return schema;
		};
		for (const key of [
			"default",
			"link",
			"comment",
			"description",
			"max",
			"min",
			"step"
		]) Object.assign(Schema.prototype, { [key](value) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				[key]: value
			};
			return schema;
		} });
		const resolvers = {};
		Schema.extend = function extend(type, resolve) {
			resolvers[type] = resolve;
		};
		Schema.resolve = function resolve(data, schema, options = {}, strict = false) {
			if (!schema) return [data];
			if (options.ignore?.(data, schema)) return [data];
			if (isNullable(data) && schema.type !== "lazy") {
				if (schema.meta.required) throw new ValidationError(`missing required value`, options);
				let current = schema;
				let fallback = schema.meta.default;
				while (current?.type === "intersect" && isNullable(fallback)) {
					current = current.list[0];
					fallback = current?.meta.default;
				}
				if (isNullable(fallback)) return [data];
				data = clone$1(fallback);
			}
			const callback = resolvers[schema.type];
			if (!callback) throw new ValidationError(`unsupported type "${schema.type}"`, options);
			try {
				return callback(data, schema, options, strict);
			} catch (error) {
				if (!schema.meta.loose) throw error;
				return [schema.meta.default];
			}
		};
		Schema.from = function from(source) {
			if (isNullable(source)) return Schema.any();
			else if ([
				"string",
				"number",
				"boolean"
			].includes(typeof source)) return Schema.const(source).required();
			else if (source[kSchema]) return source;
			else if (typeof source === "function") switch (source) {
				case String: return Schema.string().required();
				case Number: return Schema.number().required();
				case Boolean: return Schema.boolean().required();
				case Function: return Schema.function().required();
				default: return Schema.is(source).required();
			}
			else throw new TypeError(`cannot infer schema from ${source}`);
		};
		Schema.lazy = function lazy(builder) {
			const toJSON = () => {
				if (!schema.inner[kSchema]) {
					schema.inner = schema.builder();
					schema.inner.meta = {
						...schema.meta,
						...schema.inner.meta
					};
				}
				return schema.inner.toJSON();
			};
			const schema = new Schema({
				type: "lazy",
				builder,
				inner: { toJSON }
			});
			return schema;
		};
		Schema.natural = function natural() {
			return Schema.number().step(1).min(0);
		};
		Schema.percent = function percent() {
			return Schema.number().step(.01).min(0).max(1).role("slider");
		};
		Schema.date = function date() {
			return Schema.union([Schema.is(Date), Schema.transform(Schema.string().role("datetime"), (value, options) => {
				const date = new Date(value);
				if (isNaN(+date)) throw new ValidationError(`invalid date "${value}"`, options);
				return date;
			}, true)]);
		};
		Schema.regExp = function regExp(flag = "") {
			return Schema.union([Schema.is(RegExp), Schema.transform(Schema.string().role("regexp", { flag }), (value, options) => {
				try {
					return new RegExp(value, flag);
				} catch (e) {
					throw new ValidationError(e.message, options);
				}
			}, true)]);
		};
		Schema.arrayBuffer = function arrayBuffer(encoding) {
			return Schema.union([
				Schema.is(ArrayBuffer),
				Schema.is(SharedArrayBuffer),
				Schema.transform(Schema.any(), (value, options) => {
					if (Binary.isSource(value)) return Binary.fromSource(value);
					throw new ValidationError(`expected ArrayBufferSource but got ${value}`, options);
				}, true),
				...encoding ? [Schema.transform(Schema.string(), (value, options) => {
					try {
						return encoding === "base64" ? Binary.fromBase64(value) : Binary.fromHex(value);
					} catch (e) {
						throw new ValidationError(e.message, options);
					}
				}, true)] : []
			]);
		};
		Schema.extend("lazy", (data, schema, options, strict) => {
			if (!schema.inner[kSchema]) {
				schema.inner = schema.builder();
				schema.inner.meta = {
					...schema.meta,
					...schema.inner.meta
				};
			}
			return Schema.resolve(data, schema.inner, options, strict);
		});
		Schema.extend("any", (data) => {
			return [data];
		});
		Schema.extend("never", (data, _, options) => {
			throw new ValidationError(`expected nullable but got ${data}`, options);
		});
		Schema.extend("const", (data, { value }, options) => {
			if (deepEqual(data, value)) return [value];
			throw new ValidationError(`expected ${value} but got ${data}`, options);
		});
		function checkWithinRange(data, meta, description, options, skipMin = false) {
			const { max = Infinity, min = -Infinity } = meta;
			if (data > max) throw new ValidationError(`expected ${description} <= ${max} but got ${data}`, options);
			if (data < min && !skipMin) throw new ValidationError(`expected ${description} >= ${min} but got ${data}`, options);
		}
		Schema.extend("string", (data, { meta }, options) => {
			if (typeof data !== "string") throw new ValidationError(`expected string but got ${data}`, options);
			if (meta.pattern) {
				const regexp = new RegExp(meta.pattern.source, meta.pattern.flags);
				if (!regexp.test(data)) throw new ValidationError(`expect string to match regexp ${regexp}`, options);
			}
			checkWithinRange(data.length, meta, "string length", options);
			return [data];
		});
		function decimalShift(data, digits) {
			const str = data.toString();
			if (str.includes("e")) return data * Math.pow(10, digits);
			const index = str.indexOf(".");
			if (index === -1) return data * Math.pow(10, digits);
			const frac = str.slice(index + 1);
			const integer = str.slice(0, index);
			if (frac.length <= digits) return +(integer + frac.padEnd(digits, "0"));
			return +(integer + frac.slice(0, digits) + "." + frac.slice(digits));
		}
		function isMultipleOf(data, min, step) {
			step = Math.abs(step);
			if (!/^\d+\.\d+$/.test(step.toString())) return (data - min) % step === 0;
			const index = step.toString().indexOf(".");
			const digits = step.toString().slice(index + 1).length;
			return Math.abs(decimalShift(data, digits) - decimalShift(min, digits)) % decimalShift(step, digits) === 0;
		}
		Schema.extend("number", (data, { meta }, options) => {
			if (typeof data !== "number") throw new ValidationError(`expected number but got ${data}`, options);
			checkWithinRange(data, meta, "number", options);
			const { step } = meta;
			if (step && !isMultipleOf(data, meta.min ?? 0, step)) throw new ValidationError(`expected number multiple of ${step} but got ${data}`, options);
			return [data];
		});
		Schema.extend("boolean", (data, _, options) => {
			if (typeof data === "boolean") return [data];
			throw new ValidationError(`expected boolean but got ${data}`, options);
		});
		Schema.extend("bitset", (data, { bits, meta }, options) => {
			let value = 0, keys = [];
			if (typeof data === "number") {
				value = data;
				for (const key in bits) if (data & bits[key]) keys.push(key);
			} else if (Array.isArray(data)) {
				keys = data;
				for (const key of keys) {
					if (typeof key !== "string") throw new ValidationError(`expected string but got ${key}`, options);
					if (key in bits) value |= bits[key];
				}
			} else throw new ValidationError(`expected number or array but got ${data}`, options);
			if (value === meta.default) return [value];
			return [value, keys];
		});
		Schema.extend("function", (data, _, options) => {
			if (typeof data === "function") return [data];
			throw new ValidationError(`expected function but got ${data}`, options);
		});
		Schema.extend("is", (data, { constructor }, options) => {
			if (typeof constructor === "function") {
				if (data instanceof constructor) return [data];
				throw new ValidationError(`expected ${constructor.name} but got ${data}`, options);
			} else {
				if (isNullable(data)) throw new ValidationError(`expected ${constructor} but got ${data}`, options);
				let prototype = Object.getPrototypeOf(data);
				while (prototype) {
					if (prototype.constructor?.name === constructor) return [data];
					prototype = Object.getPrototypeOf(prototype);
				}
				throw new ValidationError(`expected ${constructor} but got ${data}`, options);
			}
		});
		function property(data, key, schema, options) {
			try {
				const [value, adapted] = Schema.resolve(data[key], schema, {
					...options,
					path: [...options.path || [], key]
				});
				if (adapted !== void 0) data[key] = adapted;
				return value;
			} catch (e) {
				if (!options?.autofix) throw e;
				delete data[key];
				return schema.meta.default;
			}
		}
		Schema.extend("array", (data, { inner, meta }, options) => {
			if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
			checkWithinRange(data.length, meta, "array length", options, !isNullable(inner.meta.default));
			return [data.map((_, index) => property(data, index, inner, options))];
		});
		Schema.extend("dict", (data, { inner, sKey }, options, strict) => {
			if (!isPlainObject$1(data)) throw new ValidationError(`expected object but got ${data}`, options);
			const result = {};
			for (const key in data) {
				let rKey;
				try {
					rKey = Schema.resolve(key, sKey, options)[0];
				} catch (error) {
					if (strict) continue;
					throw error;
				}
				result[rKey] = property(data, key, inner, options);
				data[rKey] = data[key];
				if (key !== rKey) delete data[key];
			}
			return [result];
		});
		Schema.extend("tuple", (data, { list }, options, strict) => {
			if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
			const result = list.map((inner, index) => property(data, index, inner, options));
			if (strict) return [result];
			result.push(...data.slice(list.length));
			return [result];
		});
		function merge$1(result, data) {
			for (const key in data) {
				if (key in result) continue;
				result[key] = data[key];
			}
		}
		Schema.extend("object", (data, { dict }, options, strict) => {
			if (!isPlainObject$1(data)) throw new ValidationError(`expected object but got ${data}`, options);
			const result = {};
			for (const key in dict) {
				const value = property(data, key, dict[key], options);
				if (!isNullable(value) || key in data) result[key] = value;
			}
			if (!strict) merge$1(result, data);
			return [result];
		});
		Schema.extend("union", (data, { list, toString }, options, strict) => {
			const messages = [];
			for (const inner of list) try {
				return Schema.resolve(data, inner, options, strict);
			} catch (error) {
				messages.push(error);
			}
			throw new ValidationError(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
		});
		Schema.extend("intersect", (data, { list, toString }, options, strict) => {
			if (!list.length) return [data];
			let result;
			for (const inner of list) {
				const value = Schema.resolve(data, inner, options, true)[0];
				if (isNullable(value)) continue;
				if (isNullable(result)) result = value;
				else if (typeof result !== typeof value) throw new ValidationError(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
				else if (typeof value === "object") merge$1(result ??= {}, value);
				else if (result !== value) throw new ValidationError(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
			}
			if (!strict && isPlainObject$1(data)) merge$1(result, data);
			return [result];
		});
		Schema.extend("transform", (data, { inner, callback, preserve }, options) => {
			const [result, adapted = data] = Schema.resolve(data, inner, options, true);
			if (preserve) return [callback(result)];
			else return [callback(result), callback(adapted)];
		});
		const formatters = {};
		function defineMethod(name, keys, format) {
			formatters[name] = format;
			Object.assign(Schema, { [name](...args) {
				const schema = new Schema({ type: name });
				keys.forEach((key, index) => {
					switch (key) {
						case "sKey":
							schema.sKey = args[index] ?? Schema.string();
							break;
						case "inner":
							schema.inner = Schema.from(args[index]);
							break;
						case "list":
							schema.list = args[index].map(Schema.from);
							break;
						case "dict":
							schema.dict = mapValues(args[index], Schema.from);
							break;
						case "bits":
							schema.bits = {};
							for (const key in args[index]) {
								if (typeof args[index][key] !== "number") continue;
								schema.bits[key] = args[index][key];
							}
							break;
						case "callback": {
							const callback = schema.callback = args[index];
							callback["toJSON"] ||= () => callback.toString();
							break;
						}
						case "constructor": {
							const constructor = schema.constructor = args[index];
							if (typeof constructor === "function") constructor["toJSON"] ||= () => constructor["name"];
							break;
						}
						default: schema[key] = args[index];
					}
				});
				if (name === "object" || name === "dict") schema.meta.default = {};
				else if (name === "array" || name === "tuple") schema.meta.default = [];
				else if (name === "bitset") schema.meta.default = 0;
				return schema;
			} });
		}
		defineMethod("is", ["constructor"], ({ constructor }) => {
			if (typeof constructor === "function") return constructor.name;
			else return constructor;
		});
		defineMethod("any", [], () => "any");
		defineMethod("never", [], () => "never");
		defineMethod("const", ["value"], ({ value }) => typeof value === "string" ? JSON.stringify(value) : value);
		defineMethod("string", [], () => "string");
		defineMethod("number", [], () => "number");
		defineMethod("boolean", [], () => "boolean");
		defineMethod("bitset", ["bits"], () => "bitset");
		defineMethod("function", [], () => "function");
		defineMethod("array", ["inner"], ({ inner }) => `${inner.toString(true)}[]`);
		defineMethod("dict", ["inner", "sKey"], ({ inner, sKey }) => `{ [key: ${sKey.toString()}]: ${inner.toString()} }`);
		defineMethod("tuple", ["list"], ({ list }) => `[${list.map((inner) => inner.toString()).join(", ")}]`);
		defineMethod("object", ["dict"], ({ dict }) => {
			if (Object.keys(dict).length === 0) return "{}";
			return `{ ${Object.entries(dict).map(([key, inner]) => {
				return `${key}${inner.meta.required ? "" : "?"}: ${inner.toString()}`;
			}).join(", ")} }`;
		});
		defineMethod("union", ["list"], ({ list }, inline) => {
			const result = list.map(({ toString: format }) => format()).join(" | ");
			return inline ? `(${result})` : result;
		});
		defineMethod("intersect", ["list"], ({ list }) => {
			return `${list.map((inner) => inner.toString(true)).join(" & ")}`;
		});
		defineMethod("transform", [
			"inner",
			"callback",
			"preserve"
		], ({ inner }, isInner) => inner.toString(isInner));
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/util.js
		function getEnumValues(entries) {
			const numericValues = Object.values(entries).filter((v) => typeof v === "number");
			return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
		}
		function joinValues(array, separator = "|") {
			return array.map((val) => stringifyPrimitive(val)).join(separator);
		}
		function jsonStringifyReplacer(_, value) {
			if (typeof value === "bigint") return value.toString();
			return value;
		}
		function cached(getter) {
			return { get value() {
				{
					const value = getter();
					Object.defineProperty(this, "value", { value });
					return value;
				}
			} };
		}
		function nullish(input) {
			return input === null || input === void 0;
		}
		function cleanRegex(source) {
			const start = source.startsWith("^") ? 1 : 0;
			const end = source.endsWith("$") ? source.length - 1 : source.length;
			return source.slice(start, end);
		}
		function floatSafeRemainder(val, step) {
			const ratio = val / step;
			const roundedRatio = Math.round(ratio);
			const tolerance = 4 * Number.EPSILON * Math.max(Math.abs(ratio), 1);
			if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
			return ratio - roundedRatio;
		}
		function assignProp(target, prop, value) {
			Object.defineProperty(target, prop, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}
		function mergeDefs(...defs) {
			const mergedDescriptors = {};
			for (const def of defs) {
				const descriptors = Object.getOwnPropertyDescriptors(def);
				Object.assign(mergedDescriptors, descriptors);
			}
			return Object.defineProperties({}, mergedDescriptors);
		}
		function esc(str) {
			return JSON.stringify(str);
		}
		function slugify(input) {
			return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
		}
		const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
		function isObject(data) {
			return typeof data === "object" && data !== null && !Array.isArray(data);
		}
		const allowsEval = /* @__PURE__*/ cached(() => {
			if (globalConfig.jitless) return false;
			if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
			try {
				new Function("");
				return true;
			} catch (_) {
				return false;
			}
		});
		function isPlainObject(o) {
			if (isObject(o) === false) return false;
			const ctor = o.constructor;
			if (ctor === void 0) return true;
			if (typeof ctor !== "function") return true;
			const prot = ctor.prototype;
			if (isObject(prot) === false) return false;
			if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
			return true;
		}
		function shallowClone(o) {
			if (isPlainObject(o)) return { ...o };
			if (Array.isArray(o)) return [...o];
			if (o instanceof Map) return new Map(o);
			if (o instanceof Set) return new Set(o);
			return o;
		}
		const propertyKeyTypes = /* @__PURE__*/ new Set([
			"string",
			"number",
			"symbol"
		]);
		function escapeRegex(str) {
			return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
		function clone(inst, def, params) {
			const cl = new inst._zod.constr(def ?? inst._zod.def);
			if (!def || params?.parent) cl._zod.parent = inst;
			return cl;
		}
		function normalizeParams(_params) {
			const params = _params;
			if (!params) return {};
			if (typeof params === "string") return { error: () => params };
			if (params?.message !== void 0) {
				if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
				params.error = params.message;
			}
			delete params.message;
			if (typeof params.error === "string") return {
				...params,
				error: () => params.error
			};
			return params;
		}
		function stringifyPrimitive(value) {
			if (typeof value === "bigint") return value.toString() + "n";
			if (typeof value === "string") return `"${value}"`;
			return `${value}`;
		}
		function optionalKeys(shape) {
			return Object.keys(shape).filter((k) => {
				return shape[k]._zod.optin !== void 0 && shape[k]._zod.optout === "optional";
			});
		}
		const NUMBER_FORMAT_RANGES = /*@__PURE__*/ (() => ({
			safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
			int32: [-2147483648, 2147483647],
			uint32: [0, 4294967295],
			float32: [-34028234663852886e22, 34028234663852886e22],
			float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
		}))();
		function pick(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = {};
					for (const key of Reflect.ownKeys(mask)) {
						if (!Object.prototype.hasOwnProperty.call(currDef.shape, key)) throw new Error(`Unrecognized key: "${String(key)}"`);
						if (!mask[key]) continue;
						assignProp(newShape, key, currDef.shape[key]);
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function omit(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = { ...schema._zod.def.shape };
					for (const key of Reflect.ownKeys(mask)) {
						if (!Object.prototype.hasOwnProperty.call(currDef.shape, key)) throw new Error(`Unrecognized key: "${String(key)}"`);
						if (!mask[key]) continue;
						delete newShape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function extend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) {
				const existingShape = schema._zod.def.shape;
				for (const key of Reflect.ownKeys(shape)) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
			}
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function safeExtend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function merge(a, b) {
			if (!b?._zod?.def) throw new Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
			if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
			return clone(a, mergeDefs(a._zod.def, {
				get shape() {
					const _shape = {
						...a._zod.def.shape,
						...b._zod.def.shape
					};
					assignProp(this, "shape", _shape);
					return _shape;
				},
				get catchall() {
					return b._zod.def.catchall;
				},
				checks: b._zod.def.checks ?? []
			}));
		}
		function partial(Class, schema, mask, name = "partial") {
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) throw new Error(`.${name}() cannot be used on object schemas containing refinements`);
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const oldShape = schema._zod.def.shape;
					const shape = { ...oldShape };
					if (mask) for (const key of Reflect.ownKeys(mask)) {
						if (!Object.prototype.hasOwnProperty.call(oldShape, key)) throw new Error(`Unrecognized key: "${String(key)}"`);
						if (!mask[key]) continue;
						shape[key] = Class ? new Class({
							type: "optional",
							innerType: oldShape[key]
						}) : oldShape[key];
					}
					else for (const key of Reflect.ownKeys(oldShape)) shape[key] = Class ? new Class({
						type: "optional",
						innerType: oldShape[key]
					}) : oldShape[key];
					assignProp(this, "shape", shape);
					return shape;
				},
				checks: []
			}));
		}
		function required(Class, schema, mask) {
			return clone(schema, mergeDefs(schema._zod.def, { get shape() {
				const oldShape = schema._zod.def.shape;
				const shape = { ...oldShape };
				if (mask) for (const key of Reflect.ownKeys(mask)) {
					if (!Object.prototype.hasOwnProperty.call(shape, key)) throw new Error(`Unrecognized key: "${String(key)}"`);
					if (!mask[key]) continue;
					shape[key] = new Class({
						type: "nonoptional",
						innerType: oldShape[key]
					});
				}
				else for (const key of Reflect.ownKeys(oldShape)) shape[key] = new Class({
					type: "nonoptional",
					innerType: oldShape[key]
				});
				assignProp(this, "shape", shape);
				return shape;
			} }));
		}
		function aborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
			return false;
		}
		function explicitlyAborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
			return false;
		}
		function prefixIssues(path, issues) {
			return issues.map((iss) => {
				var _a;
				(_a = iss).path ?? (_a.path = []);
				iss.path.unshift(path);
				return iss;
			});
		}
		function unwrapMessage(message) {
			return typeof message === "string" ? message : message?.message;
		}
		function attachSchema(issues, start, inst) {
			var _a;
			for (let i = start; i < issues.length; i++) (_a = issues[i]).schema ?? (_a.schema = inst);
		}
		function finalizeIssue(iss, ctx, config) {
			var _a;
			const traits = iss.inst?._zod?.traits;
			if (traits?.has("$ZodType")) {
				if (traits.has("$ZodCheck")) (_a = iss).schema ?? (_a.schema = iss.inst);
				else iss.schema = iss.inst;
			}
			const schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : void 0;
			const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(schemaError?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
			const { inst: _inst, schema: _schema, continue: _continue, input: _input, ...rest } = iss;
			rest.path ?? (rest.path = []);
			rest.message = message;
			if (ctx?.reportInput) rest.input = _input;
			return rest;
		}
		const highSurrogate = /[\uD800-\uDBFF]/;
		function codePointLength(str) {
			const units = str.length;
			if (!highSurrogate.test(str)) return units;
			let count = units;
			for (let i = 0; i < units - 1; i++) if ((str.charCodeAt(i) & 64512) === 55296 && (str.charCodeAt(i + 1) & 64512) === 56320) {
				count--;
				i++;
			}
			return count;
		}
		function getLengthableOrigin(input) {
			if (Array.isArray(input)) return "array";
			if (typeof input === "string") return "string";
			return "unknown";
		}
		function parsedType(data) {
			const t = typeof data;
			switch (t) {
				case "number": return Number.isNaN(data) ? "nan" : "number";
				case "object": {
					if (data === null) return "null";
					if (Array.isArray(data)) return "array";
					const obj = data;
					if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) return obj.constructor.name;
				}
			}
			return t;
		}
		function issue(...args) {
			const [iss, input, inst] = args;
			if (typeof iss === "string") return {
				message: iss,
				code: "custom",
				input,
				inst
			};
			return { ...iss };
		}
		/**
		* Installs a trait's members on its prototype. Each value builds that member for the instance on first read; the built value shadows the accessor as an own property, so a detached `const { parse } = schema` keeps working.
		*
		* Call this from a `proto` initializer, which runs once per prototype — never per instance.
		*/
		function members(proto, table) {
			for (const key in table) {
				const desc = Object.getOwnPropertyDescriptor(table, key);
				if (desc.get) Object.defineProperty(proto, key, {
					...desc,
					enumerable: false
				});
				else defineBound(proto, key, desc.value);
			}
		}
		/** Shadows a prototype member with an own value, so a getter that builds from the instance runs once. */
		function own(inst, key, value, enumerable = true) {
			Object.defineProperty(inst, key, {
				configurable: true,
				writable: true,
				enumerable,
				value
			});
			return value;
		}
		/** Like {@link own}, for a member that was never an own data property and has to stay out of `Object.keys`. */
		function hide(inst, key, value) {
			return own(inst, key, value, false);
		}
		function defineBound(proto, key, fn) {
			Object.defineProperty(proto, key, {
				configurable: true,
				get() {
					return this == null ? fn : own(this, key, fn.bind(this));
				},
				set(value) {
					own(this, key, value);
				}
			});
		}
		/** Returns the prototype to install on, or `undefined` if this group is already installed on it. */
		function claim(inst, sentinel) {
			const proto = Object.getPrototypeOf(inst);
			return sentinel in proto ? void 0 : proto;
		}
		let installing;
		let broke = false;
		const breaker = {
			configurable: true,
			get() {
				broke = true;
			}
		};
		/**
		* Installs a lazily-derived internal on the `_zod` prototype of `inst`'s
		* constructor, computed from the internals object itself and cached there on
		* first read. One accessor per constructor rather than one per instance.
		*/
		function defineLazyInternal(inst, key, compute) {
			const proto = Object.getPrototypeOf(inst._zod);
			if (key in proto && installing !== inst._zod) {
				installing = void 0;
				return;
			}
			installing = inst._zod;
			Object.defineProperty(proto, key, {
				configurable: true,
				get() {
					Object.defineProperty(this, key, breaker);
					const outer = broke;
					broke = false;
					try {
						const value = compute(this);
						if (broke) delete this[key];
						else Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							value
						});
						broke = broke || outer;
						return value;
					} catch (err) {
						delete this[key];
						broke = broke || outer;
						throw err;
					}
				},
				set(value) {
					Object.defineProperty(this, key, {
						configurable: true,
						writable: true,
						value
					});
				}
			});
		}
		/**
		* Installs `key` on `inst`'s prototype, computed by `make` on first read and cached there as an own
		* data property. One accessor per constructor rather than one per instance, because an own accessor
		* puts every instance after the first into v8 dictionary mode. The key doubles as the sentinel.
		*/
		function installLazyProp(inst, key, make, enumerable) {
			const proto = claim(inst, key);
			if (!proto) return;
			Object.defineProperty(proto, key, {
				configurable: true,
				get() {
					const desc = {
						configurable: true,
						writable: true,
						enumerable,
						value: void 0
					};
					Object.defineProperty(this, key, desc);
					desc.value = make(this);
					Object.defineProperty(this, key, desc);
					return desc.value;
				},
				set(value) {
					Object.defineProperty(this, key, {
						configurable: true,
						writable: true,
						enumerable,
						value
					});
				}
			});
		}
		/** Marks the thunk `_catch` synthesises for a constant catch value. `Function.length` cannot tell that thunk from a user callback — rest and defaulted parameters both report arity 0 — and a user callback reads `ctx.error`, whose issues only finalize correctly against the caller's per-parse error map. Provenance can say what arity cannot. A plain string key rather than `Symbol.for`, whose call at module scope no bundler can prove pure — the same shape that anchored `urlCanParse` into every build. */
		const CONSTANT_CATCH = "~constantCatch";
		/** Wraps a constant catch value in a thunk tagged with {@link CONSTANT_CATCH}. */
		function constantCatch(value) {
			const fn = () => value;
			fn[CONSTANT_CATCH] = true;
			return fn;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/core.js
		var _a$1;
		const _zodDesc$1 = {
			value: void 0,
			enumerable: false
		};
		let _E = "captureStackTrace" in Error ? Error : null;
		function newError(Definition) {
			const E = _E;
			if (E) {
				const saved = E.stackTraceLimit;
				if (typeof saved === "number") {
					try {
						E.stackTraceLimit = 0;
					} catch {
						_E = null;
						return new Definition();
					}
					try {
						return new Definition();
					} finally {
						E.stackTraceLimit = saved;
					}
				}
			}
			return new Definition();
		}
		function $constructor(name, initializer, proto, params) {
			const zodProto = {};
			function Internals(def) {
				this.def = def;
				this.constr = _;
				this.traits = /* @__PURE__ */ new Set();
			}
			Internals.prototype = zodProto;
			const protoMembers = proto;
			const initialized = protoMembers && /* @__PURE__ */ new WeakSet();
			function init(inst, def) {
				if (!inst._zod) {
					_zodDesc$1.value = new Internals(def);
					try {
						Object.defineProperty(inst, "_zod", _zodDesc$1);
					} finally {
						_zodDesc$1.value = void 0;
					}
				}
				if (inst._zod.traits.has(name)) return;
				inst._zod.traits.add(name);
				initializer(inst, def);
				if (initialized) {
					const own = Object.getPrototypeOf(inst);
					const ctorProto = inst._zod.constr.prototype;
					let up = own;
					while (up && up !== ctorProto) up = Object.getPrototypeOf(up);
					const target = up ?? own;
					if (!initialized.has(target)) {
						initialized.add(target);
						members(target, protoMembers);
					}
				}
				const proto = _.prototype;
				for (const k in proto) {
					if (!Object.prototype.hasOwnProperty.call(proto, k)) continue;
					if (!(k in inst)) inst[k] = proto[k].bind(inst);
				}
			}
			const Parent = params?.Parent ?? Object;
			class Definition extends Parent {}
			Object.defineProperty(Definition, "name", { value: name });
			function _(def) {
				const inst = params?.Parent ? newError(Definition) : this;
				init(inst, def);
				const deferred = inst._zod.deferred;
				if (deferred) {
					for (const fn of deferred) fn();
					inst._zod.deferred = void 0;
				}
				const pp = globalThis.__zod_globalConfig?.postProcessor;
				if (pp) pp(inst);
				return inst;
			}
			Object.defineProperty(_, "init", { value: init });
			Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
				if (params?.Parent && inst instanceof params.Parent) return true;
				return inst?._zod?.traits?.has(name);
			} });
			Object.defineProperty(_, "name", { value: name });
			return _;
		}
		var $ZodAsyncError = class extends Error {
			constructor() {
				super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
			}
		};
		var $ZodEncodeError = class extends Error {
			constructor(name) {
				super(`Encountered unidirectional transform during encode: ${name}`);
				this.name = "ZodEncodeError";
			}
		};
		(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
		const globalConfig = globalThis.__zod_globalConfig;
		function config(newConfig) {
			if (newConfig) Object.assign(globalConfig, newConfig);
			return globalConfig;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/errors.js
		function _getMessage() {
			const internals = this._zod;
			internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer, 2));
			return internals.message;
		}
		function _setMessage(value) {
			this._zod.message = value;
		}
		const _messageDesc = {
			get: _getMessage,
			set: _setMessage,
			enumerable: true,
			configurable: true
		};
		const _zodDesc = {
			value: void 0,
			enumerable: false
		};
		const _issuesDesc = {
			value: void 0,
			enumerable: false
		};
		const _installedToString = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
		const initializer$1 = (inst, def) => {
			inst.name = "$ZodError";
			_zodDesc.value = inst._zod;
			Object.defineProperty(inst, "_zod", _zodDesc);
			_issuesDesc.value = def;
			Object.defineProperty(inst, "issues", _issuesDesc);
			_zodDesc.value = void 0;
			_issuesDesc.value = void 0;
			Object.defineProperty(inst, "message", _messageDesc);
			const proto = Object.getPrototypeOf(inst);
			if (!_installedToString.has(proto)) {
				_installedToString.add(proto);
				Object.defineProperty(proto, "toString", {
					configurable: true,
					enumerable: false,
					get() {
						const value = () => this.message;
						Object.defineProperty(this, "toString", {
							value,
							configurable: true,
							writable: true
						});
						return value;
					},
					set(value) {
						Object.defineProperty(this, "toString", {
							value,
							configurable: true,
							writable: true
						});
					}
				});
			}
		};
		const $ZodError = $constructor("$ZodError", initializer$1);
		const $ZodRealError = $constructor("$ZodError", initializer$1, void 0, { Parent: Error });
		/** Get-or-create `obj[key]` as an own data property. A path segment naming an inherited member
		* ("toString", "constructor") would otherwise read through to the prototype, and assigning
		* "__proto__" would hit the setter instead of creating a key. */
		function node(obj, key, make) {
			if (!Object.prototype.hasOwnProperty.call(obj, key)) {
				if (key === "__proto__") Object.defineProperty(obj, key, {
					value: make(),
					writable: true,
					enumerable: true,
					configurable: true
				});
				else obj[key] = make();
			}
			return obj[key];
		}
		function flattenError(error, mapper = (issue) => issue.message) {
			const fieldErrors = {};
			const formErrors = [];
			for (const sub of error.issues) if (sub.path.length > 0) node(fieldErrors, sub.path[0], () => []).push(mapper(sub));
			else formErrors.push(mapper(sub));
			return {
				formErrors,
				fieldErrors
			};
		}
		function formatError(error, mapper = (issue) => issue.message) {
			const fieldErrors = { _errors: [] };
			const processError = (error, path = []) => {
				for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
				else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else {
					const fullpath = [...path, ...issue.path];
					if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
					else {
						let curr = fieldErrors;
						let i = 0;
						while (i < fullpath.length) {
							const el = fullpath[i];
							const terminal = i === fullpath.length - 1;
							if (el === "_errors") {
								if (terminal) curr._errors.push(mapper(issue));
								i++;
								continue;
							}
							if (!Object.prototype.hasOwnProperty.call(curr, el)) Object.defineProperty(curr, el, {
								value: { _errors: [] },
								enumerable: true,
								writable: true,
								configurable: true
							});
							const node = curr[el];
							if (terminal) node._errors.push(mapper(issue));
							curr = node;
							i++;
						}
					}
				}
			};
			processError(error);
			return fieldErrors;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/parse.js
		function finalizeParams(callee, params) {
			return {
				callee: params?.callee ?? callee,
				Err: params?.Err
			};
		}
		const _parse = (_Err) => {
			const fn = (schema, value, _ctx, _params) => {
				const ctx = _ctx ? {
					..._ctx,
					async: false
				} : { async: false };
				const result = schema._zod.run({
					value,
					issues: []
				}, ctx);
				if (result instanceof Promise) throw new $ZodAsyncError();
				if (result.issues.length) {
					const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
					captureStackTrace(e, _params?.callee ?? fn);
					throw e;
				}
				return result.value;
			};
			return fn;
		};
		const _parseAsync = (_Err) => {
			const fn = async (schema, value, _ctx, params) => {
				const ctx = _ctx ? {
					..._ctx,
					async: true
				} : { async: true };
				let result = schema._zod.run({
					value,
					issues: []
				}, ctx);
				if (result instanceof Promise) result = await result;
				if (result.issues.length) {
					const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
					captureStackTrace(e, params?.callee ?? fn);
					throw e;
				}
				return result.value;
			};
			return fn;
		};
		const _safeParse = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			return result.issues.length ? {
				success: false,
				error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
		const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			return result.issues.length ? {
				success: false,
				error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);
		const _encode = (_Err) => {
			const parse = _parse(_Err);
			const fn = (schema, value, _ctx, _params) => {
				const ctx = _ctx ? {
					..._ctx,
					direction: "backward"
				} : { direction: "backward" };
				return parse(schema, value, ctx, finalizeParams(fn, _params));
			};
			return fn;
		};
		const _decode = (_Err) => {
			const parse = _parse(_Err);
			const fn = (schema, value, _ctx, _params) => {
				return parse(schema, value, _ctx, finalizeParams(fn, _params));
			};
			return fn;
		};
		const _encodeAsync = (_Err) => {
			const parseAsync = _parseAsync(_Err);
			const fn = async (schema, value, _ctx, _params) => {
				const ctx = _ctx ? {
					..._ctx,
					direction: "backward"
				} : { direction: "backward" };
				return await parseAsync(schema, value, ctx, finalizeParams(fn, _params));
			};
			return fn;
		};
		const _decodeAsync = (_Err) => {
			const parseAsync = _parseAsync(_Err);
			const fn = async (schema, value, _ctx, _params) => {
				return await parseAsync(schema, value, _ctx, finalizeParams(fn, _params));
			};
			return fn;
		};
		const _safeEncode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParse(_Err)(schema, value, ctx);
		};
		const _safeDecode = (_Err) => (schema, value, _ctx) => {
			return _safeParse(_Err)(schema, value, _ctx);
		};
		const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParseAsync(_Err)(schema, value, ctx);
		};
		const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _safeParseAsync(_Err)(schema, value, _ctx);
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/regexes.js
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const cuid = /^[cC][0-9a-z]{6,}$/;
		const cuid2 = /^[0-9a-z]+$/;
		const ulid = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/;
		const xid = /^[0-9a-vA-V]{20}$/;
		const ksuid = /^[A-Za-z0-9]{27}$/;
		const nanoid = /^[a-zA-Z0-9_-]{21}$/;
		function nanoidOfLength(length) {
			return new RegExp(`^[a-zA-Z0-9_-]{${length}}$`);
		}
		/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
		const duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
		/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
		const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
		/** Returns a regex for validating an RFC 9562/4122 UUID.
		*
		* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
		const uuid = (version) => {
			if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
			return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
		};
		/** Practical email validation */
		const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
		const _emoji$1 = `^[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`;
		function emoji() {
			return new RegExp(_emoji$1, "u");
		}
		const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
		const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
		const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
		const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
		const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
		const base64url = /^[A-Za-z0-9_-]*$/;
		const httpProtocol = /^https?$/;
		const e164 = /^\+[1-9]\d{6,14}$/;
		const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
		/** Anchors a pattern source. The interpolation lives here rather than at the call site because
		* esbuild will not drop a `@__PURE__` call whose own argument interpolates a variable, but it
		* will drop `anchor(dateSource)`. Keeping it inline pinned `date` into every bundle. */
		function anchor(source) {
			return new RegExp(`^${source}$`);
		}
		const date = /*@__PURE__*/ anchor(dateSource);
		function timeSource(args) {
			const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
			return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : args.seconds ? `${hhmm}:[0-5]\\d(?:\\.\\d+)?` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
		}
		function time(args) {
			return new RegExp(`^${timeSource(args)}$`);
		}
		function datetime(args) {
			const opts = ["Z"];
			if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
			const qualified = `${timeSource({
				precision: args.precision,
				seconds: true
			})}(?:${opts.join("|")})`;
			const timeRegex = args.local ? `${qualified}|${timeSource({ precision: args.precision })}` : qualified;
			return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
		}
		const string$1 = (params) => {
			const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
			return new RegExp(`^${regex}$`);
		};
		const integer = /^-?\d+$/;
		const number$1 = /^-?\d+(?:\.\d+)?$/;
		const boolean$1 = /^(?:true|false)$/i;
		const _undefined$2 = /^undefined$/i;
		const lowercase = /^[^A-Z]*$/;
		const uppercase = /^[^a-z]*$/;
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/checks.js
		const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
			var _a;
			inst._zod ?? (inst._zod = {});
			inst._zod.def = def;
			(_a = inst._zod).onattach ?? (_a.onattach = []);
		});
		/** Default `when` for length-based checks: run only on non-nullish values with a `length`. */
		const _whenHasLength = (payload) => {
			const val = payload.value;
			return !nullish(val) && val.length !== void 0;
		};
		const numericOriginMap = {
			number: "number",
			bigint: "bigint",
			object: "date"
		};
		const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
				if (def.value < curr) {
					if (def.inclusive) bag.maximum = def.value;
					else bag.exclusiveMaximum = def.value;
				}
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
				payload.issues.push({
					origin: numericOriginMap[typeof payload.value] ?? origin,
					code: "too_big",
					maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
				if (def.value > curr) {
					if (def.inclusive) bag.minimum = def.value;
					else bag.exclusiveMinimum = def.value;
				}
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
				payload.issues.push({
					origin: numericOriginMap[typeof payload.value] ?? origin,
					code: "too_small",
					minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMultipleOf = /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				var _a;
				(_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
			});
			inst._zod.check = (payload) => {
				if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
				if (typeof payload.value === "bigint" ? def.value !== BigInt(0) && payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
				payload.issues.push({
					origin: typeof payload.value,
					code: "not_multiple_of",
					divisor: def.value,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
			$ZodCheck.init(inst, def);
			def.format = def.format || "float64";
			const isInt = def.format?.includes("int");
			const origin = isInt ? "int" : "number";
			const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				bag.minimum = minimum;
				bag.maximum = maximum;
				if (isInt) bag.pattern = integer;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (isInt) {
					if (!Number.isInteger(input)) {
						payload.issues.push({
							expected: origin,
							format: def.format,
							code: "invalid_type",
							continue: false,
							input,
							inst
						});
						return;
					}
					if (!Number.isSafeInteger(input)) {
						if (input > 0) payload.issues.push({
							input,
							code: "too_big",
							maximum: Number.MAX_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						else payload.issues.push({
							input,
							code: "too_small",
							minimum: Number.MIN_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						return;
					}
				}
				if (input < minimum) payload.issues.push({
					origin: "number",
					input,
					code: "too_small",
					minimum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
				if (input > maximum) payload.issues.push({
					origin: "number",
					input,
					code: "too_big",
					maximum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
				if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const units = input.length;
				if ((typeof input === "string" && units > def.maximum ? codePointLength(input) : units) <= def.maximum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: def.maximum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
				if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const units = input.length;
				if ((typeof input === "string" && units >= def.minimum && units < def.minimum * 2 ? codePointLength(input) : units) >= def.minimum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: def.minimum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.minimum = def.length;
				bag.maximum = def.length;
				bag.length = def.length;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const units = input.length;
				const length = typeof input === "string" && units >= def.length && units <= def.length * 2 ? codePointLength(input) : units;
				if (length === def.length) return;
				const origin = getLengthableOrigin(input);
				const tooBig = length > def.length;
				payload.issues.push({
					origin,
					...tooBig ? {
						code: "too_big",
						maximum: def.length
					} : {
						code: "too_small",
						minimum: def.length
					},
					inclusive: true,
					exact: true,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
			var _a, _b;
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				if (def.pattern) {
					bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
					bag.patterns.add(def.pattern);
				}
			});
			if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: def.format,
					input: payload.value,
					...def.pattern ? { pattern: def.pattern.toString() } : {},
					inst,
					continue: !def.abort
				});
			});
			else (_b = inst._zod).check ?? (_b.check = () => {});
		});
		const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "regex",
					input: payload.value,
					pattern: def.pattern.toString(),
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
			def.pattern ?? (def.pattern = lowercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
			def.pattern ?? (def.pattern = uppercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
			$ZodCheck.init(inst, def);
			const escapedRegex = escapeRegex(def.includes);
			const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position},}${escapedRegex}` : escapedRegex);
			def.pattern = pattern;
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.includes(def.includes, def.position)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "includes",
					includes: def.includes,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.startsWith(def.prefix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "starts_with",
					prefix: def.prefix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.endsWith(def.suffix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "ends_with",
					suffix: def.suffix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.check = (payload) => {
				payload.value = def.tx(payload.value);
			};
		});
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/doc.js
		var Doc = class {
			constructor(args = [], closed = {}) {
				this.content = [];
				this.indent = 0;
				this.args = args;
				this.closed = closed;
			}
			indented(fn) {
				this.indent += 1;
				fn(this);
				this.indent -= 1;
			}
			write(arg) {
				if (typeof arg === "function") {
					arg(this, { execution: "sync" });
					arg(this, { execution: "async" });
					return;
				}
				const lines = arg.split("\n").filter((x) => x);
				const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
				const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
				for (const line of dedented) this.content.push(line);
			}
			compile() {
				const F = Function;
				const content = this?.content ?? [``];
				return new F(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {\n${content.join("\n")}\n};`)(...Object.values(this.closed));
			}
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/versions.js
		const version = {
			major: 4,
			minor: 5,
			patch: 4
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/schemas.js
		const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
			var _a;
			inst ?? (inst = {});
			inst._zod.def = def;
			inst._zod.bag = inst._zod.bag || {};
			inst._zod.version = version;
			const defChecks = inst._zod.def.checks;
			const checks = inst._zod.traits.has("$ZodCheck") ? [inst, ...defChecks ?? []] : defChecks?.length ? [...defChecks] : [];
			for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
			if (checks.length === 0) {
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred?.push(() => {
					inst._zod.run = inst._zod.parse;
				});
			} else {
				const runChecks = (payload, checks, ctx) => {
					if (payload.memo) return payload;
					let isAborted = aborted(payload);
					let asyncResult;
					for (const ch of checks) {
						if (ch._zod.def.when) {
							if (explicitlyAborted(payload)) continue;
							if (!ch._zod.def.when(payload)) continue;
						} else if (isAborted) continue;
						const currLen = payload.issues.length;
						const _ = ch._zod.check(payload);
						if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
						if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
							await _;
							if (payload.issues.length === currLen) return;
							attachSchema(payload.issues, currLen, inst);
							if (!isAborted) isAborted = aborted(payload, currLen);
						});
						else {
							if (payload.issues.length === currLen) continue;
							attachSchema(payload.issues, currLen, inst);
							if (!isAborted) isAborted = aborted(payload, currLen);
						}
					}
					if (asyncResult) return asyncResult.then(() => {
						return payload;
					});
					return payload;
				};
				const handleCanaryResult = (canary, payload, ctx) => {
					if (aborted(canary)) {
						canary.aborted = true;
						return canary;
					}
					const checkResult = runChecks(payload, checks, ctx);
					if (checkResult instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
					}
					return inst._zod.parse(checkResult, ctx);
				};
				inst._zod.run = (payload, ctx) => {
					if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
					if (ctx.direction === "backward") {
						const canary = inst._zod.parse({
							value: payload.value,
							issues: []
						}, {
							...ctx,
							skipChecks: true
						});
						if (canary instanceof Promise) return canary.then((canary) => {
							return handleCanaryResult(canary, payload, ctx);
						});
						return handleCanaryResult(canary, payload, ctx);
					}
					const result = inst._zod.parse(payload, ctx);
					if (result instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return result.then((result) => runChecks(result, checks, ctx));
					}
					return runChecks(result, checks, ctx);
				};
			}
		}, {
			get "~standard"() {
				return hide(this, "~standard", standardProps(this));
			},
			set "~standard"(value) {
				own(this, "~standard", value);
			}
		});
		/** The Standard Schema surface for `inst`. Shared so wrappers can extend it without forcing it. */
		const toStandardResult = (r) => r.success ? { value: r.data } : { issues: r.error?.issues };
		function standardProps(inst) {
			return {
				validate: (value) => {
					try {
						return toStandardResult(safeParse$1(inst, value));
					} catch (_) {
						return safeParseAsync$1(inst, value).then(toStandardResult);
					}
				},
				vendor: "zod",
				version: 1
			};
		}
		const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
			inst._zod.parse = (payload, _) => {
				if (def.coerce) try {
					payload.value = String(payload.value);
				} catch (_) {}
				if (typeof payload.value === "string") return payload;
				payload.issues.push({
					expected: "string",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			$ZodString.init(inst, def);
		});
		const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
			def.pattern ?? (def.pattern = guid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
			if (def.version) {
				const v = {
					v1: 1,
					v2: 2,
					v3: 3,
					v4: 4,
					v5: 5,
					v6: 6,
					v7: 7,
					v8: 8
				}[def.version];
				if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
				def.pattern ?? (def.pattern = uuid(v));
			} else def.pattern ?? (def.pattern = uuid());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
			def.pattern ?? (def.pattern = email);
			$ZodStringFormat.init(inst, def);
		});
		/** Parses a URL for `$ZodURL`, applying the one guard the URL constructor cannot express. Returns the parsed URL, or a code naming the stage that rejected it — the runtime needs that distinction to pick an issue note, and compiled code only needs to know it is not a URL. */
		function parseURLObject(trimmed, def) {
			if (!def.normalize && def.protocol?.source === httpProtocol.source && !/^https?:\/\//i.test(trimmed)) return 1;
			try {
				return new URL(trimmed);
			} catch {
				return 2;
			}
		}
		const asciiTabOrNewline = /[\t\n\r]/g;
		/** The URL parser deletes every ASCII tab, LF and CR from its input before it parses, so `new URL("https://exa\nmple.com")` reports on `example.com`. Applying the same deletion to the returned value closes the half of that divergence which can move the host; the parser's other rewrite, stripping C0 controls at the edges, cannot. */
		function stripTabAndNewline(value) {
			return value.replace(asciiTabOrNewline, "");
		}
		function urlHostnameOk(url, hostname) {
			hostname.lastIndex = 0;
			return hostname.test(url.hostname);
		}
		function urlProtocolOk(url, protocol) {
			protocol.lastIndex = 0;
			return protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol);
		}
		const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				try {
					const trimmed = payload.value.trim();
					const url = parseURLObject(trimmed, def);
					if (url === 1) {
						payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid URL format",
							input: payload.value,
							inst,
							continue: !def.abort
						});
						return;
					}
					if (url === 2) {
						payload.issues.push({
							code: "invalid_format",
							format: "url",
							input: payload.value,
							inst,
							continue: !def.abort
						});
						return;
					}
					if (def.hostname && !urlHostnameOk(url, def.hostname)) payload.issues.push({
						code: "invalid_format",
						format: "url",
						note: "Invalid hostname",
						pattern: def.hostname.source,
						input: payload.value,
						inst,
						continue: !def.abort
					});
					if (def.protocol && !urlProtocolOk(url, def.protocol)) payload.issues.push({
						code: "invalid_format",
						format: "url",
						note: "Invalid protocol",
						pattern: def.protocol.source,
						input: payload.value,
						inst,
						continue: !def.abort
					});
					payload.value = def.normalize ? url.href : stripTabAndNewline(trimmed);
					return;
				} catch (_) {
					payload.issues.push({
						code: "invalid_format",
						format: "url",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
			def.pattern ?? (def.pattern = emoji());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
			if (def.length !== void 0 && (!Number.isInteger(def.length) || def.length < 1)) throw new Error(`Invalid nanoid length: ${def.length}`);
			def.pattern ?? (def.pattern = def.length === void 0 ? nanoid : nanoidOfLength(def.length));
			$ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
			def.pattern ?? (def.pattern = cuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
			def.pattern ?? (def.pattern = cuid2);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
			def.pattern ?? (def.pattern = ulid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
			def.pattern ?? (def.pattern = xid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
			def.pattern ?? (def.pattern = ksuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
			def.pattern ?? (def.pattern = datetime(def));
			$ZodStringFormat.init(inst, def);
			if (def.local || def.precision === -1) {
				inst._zod.bag.laxFormat = true;
				inst._zod.onattach.push((s) => {
					s._zod.bag.laxFormat = true;
				});
			}
		});
		const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
			def.pattern ?? (def.pattern = date);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
			def.pattern ?? (def.pattern = time(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
			def.pattern ?? (def.pattern = duration);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
			def.pattern ?? (def.pattern = ipv4);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv4`;
		});
		/** An IPv6 address is written with hex digits, colons and dots, and nothing else. The guard is what makes the check below an IPv6 check: `new URL("http://[...]")` parses an authority, not an address, so `@` and `\` re-delimit it and `"::@1\\"` validates against the host `0.0.0.1`. The URL parser also deletes ASCII tab, LF and CR rather than failing, which is how `"::1\n"` validated as `::1`. */
		const ipv6Alphabet = /^[0-9a-fA-F:.]+$/;
		function isValidIPv6(value) {
			if (!ipv6Alphabet.test(value)) return false;
			try {
				new URL(`http://[${value}]`);
				return true;
			} catch {
				return false;
			}
		}
		const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
			def.pattern ?? (def.pattern = ipv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv6`;
			inst._zod.check = (payload) => {
				if (!isValidIPv6(payload.value)) payload.issues.push({
					code: "invalid_format",
					format: "ipv6",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv4);
			$ZodStringFormat.init(inst, def);
		});
		function isValidCIDRv6(value) {
			const parts = value.split("/");
			if (parts.length !== 2) return false;
			const [address, prefix] = parts;
			if (!prefix) return false;
			const prefixNum = Number(prefix);
			if (`${prefixNum}` !== prefix) return false;
			if (prefixNum < 0 || prefixNum > 128) return false;
			return isValidIPv6(address);
		}
		const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				if (!isValidCIDRv6(payload.value)) payload.issues.push({
					code: "invalid_format",
					format: "cidrv6",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		function isValidBase64(data) {
			if (data === "") return true;
			if (/\s/.test(data)) return false;
			if (data.length % 4 !== 0) return false;
			try {
				atob(data);
				return true;
			} catch {
				return false;
			}
		}
		const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
			def.pattern ?? (def.pattern = base64);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64";
			inst._zod.check = (payload) => {
				if (isValidBase64(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		function isValidBase64URL(data) {
			if (!base64url.test(data)) return false;
			const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
			return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
		}
		const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
			def.pattern ?? (def.pattern = base64url);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64url";
			inst._zod.check = (payload) => {
				if (isValidBase64URL(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
			def.pattern ?? (def.pattern = e164);
			$ZodStringFormat.init(inst, def);
		});
		function isValidJWT(token, algorithm = null) {
			try {
				const tokensParts = token.split(".");
				if (tokensParts.length !== 3) return false;
				const [header] = tokensParts;
				if (!header) return false;
				const parsedHeader = JSON.parse(atob(header));
				if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
				if (!parsedHeader.alg) return false;
				if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
				return true;
			} catch {
				return false;
			}
		}
		const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				if (isValidJWT(payload.value, def.alg)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "jwt",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Number(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
				const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? String(input) : void 0 : void 0;
				payload.issues.push({
					expected: "number",
					code: "invalid_type",
					input,
					inst,
					...received ? { received } : {}
				});
				return payload;
			};
		});
		const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
			$ZodCheckNumberFormat.init(inst, def);
			$ZodNumber.init(inst, def);
		});
		const $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = boolean$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Boolean(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "boolean") return payload;
				payload.issues.push({
					expected: "boolean",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodUndefined = /*@__PURE__*/ $constructor("$ZodUndefined", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = _undefined$2;
			inst._zod.values = /* @__PURE__ */ new Set([void 0]);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (typeof input === "undefined") return payload;
				payload.issues.push({
					expected: "undefined",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload) => payload;
		});
		const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _ctx) => {
				payload.issues.push({
					expected: "never",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		function handleArrayResult(result, final, index) {
			if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
			final.value[index] = result.value;
		}
		const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
			$ZodType.init(inst, def);
			const memo = globalConfig.memoizer;
			memo?.attach(inst);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				if (!Array.isArray(input)) {
					payload.issues.push({
						expected: "array",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = memo ? memo.alloc(inst, payload, Array(input.length), ctx) : Array(input.length);
				const proms = [];
				for (let i = 0; i < input.length; i++) {
					const item = input[i];
					const result = def.element._zod.run({
						value: item,
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
					else handleArrayResult(result, payload, i);
				}
				if (proms.length) return Promise.all(proms).then(() => payload);
				return payload;
			};
		});
		function handlePropertyResult(result, final, key, input, optin, optout) {
			const isPresent = key in input;
			const isOptionalOut = optout === "optional";
			if (!isPresent && isOptionalOut && optin === "optional") return;
			if (result.issues.length) {
				if (optin !== void 0 && isOptionalOut && !isPresent) return;
				final.issues.push(...prefixIssues(key, result.issues));
			}
			if (!isPresent && optin === void 0) {
				if (!result.issues.length) final.issues.push({
					code: "invalid_type",
					expected: "nonoptional",
					input: void 0,
					path: [key]
				});
				return;
			}
			if (result.value === void 0) {
				if (isPresent) final.value[key] = void 0;
			} else final.value[key] = result.value;
		}
		const NO_SYMBOL_KEYS = [];
		function normalizeDef(def) {
			const keys = Object.keys(def.shape);
			const ownSymbols = Object.getOwnPropertySymbols(def.shape);
			const symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS;
			const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
			for (const k of allKeys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${String(k)}": expected a Zod schema`);
			const okeys = optionalKeys(def.shape);
			return {
				...def,
				allKeys,
				symbolKeys,
				keySet: new Set(keys),
				numKeys: keys.length,
				optionalKeys: new Set(okeys)
			};
		}
		function handleCatchall(proms, input, payload, ctx, def, inst) {
			const unrecognized = [];
			const keySet = def.keySet;
			const _catchall = def.catchall._zod;
			const t = _catchall.def.type;
			const optin = _catchall.optin;
			const optout = _catchall.optout;
			for (const key in input) {
				if (keySet.has(key)) continue;
				if (key === "__proto__") {
					if (t === "never") unrecognized.push(key);
					continue;
				}
				if (t === "never") {
					unrecognized.push(key);
					continue;
				}
				const r = _catchall.run({
					value: input[key],
					issues: []
				}, ctx);
				if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
				else handlePropertyResult(r, payload, key, input, optin, optout);
			}
			if (unrecognized.length) payload.issues.push({
				code: "unrecognized_keys",
				keys: unrecognized,
				input,
				inst,
				continue: true
			});
			if (!proms.length) return payload;
			return Promise.all(proms).then(() => {
				return payload;
			});
		}
		const propShapes = /* @__PURE__ */ new WeakMap();
		const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
			$ZodType.init(inst, def);
			if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
				const sh = def.shape;
				propShapes.set(def, sh);
				Object.defineProperty(def, "shape", { get: () => {
					const newSh = { ...sh };
					Object.defineProperty(def, "shape", { value: newSh });
					propShapes.set(def, newSh);
					return newSh;
				} });
			}
			const _normalized = cached(() => normalizeDef(def));
			defineLazyInternal(inst, "propValues", (zod) => {
				const shape = zod.def.shape;
				const propValues = {};
				for (const key in shape) {
					const field = shape[key]._zod;
					if (field.values) {
						if (!Object.prototype.hasOwnProperty.call(propValues, key)) assignProp(propValues, key, /* @__PURE__ */ new Set());
						for (const v of field.values) propValues[key].add(v);
						if (field.optin !== void 0) propValues[key].add(void 0);
					}
				}
				return propValues;
			});
			const isObject$1 = isObject;
			const catchall = def.catchall;
			let value;
			const memo = globalConfig.memoizer;
			memo?.attach(inst);
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$1(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
				const proms = [];
				const shape = value.shape;
				for (const key of value.allKeys) {
					if (key === "__proto__") continue;
					const el = shape[key];
					const optin = el._zod.optin;
					const optout = el._zod.optout;
					const r = el._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
					else handlePropertyResult(r, payload, key, input, optin, optout);
				}
				if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
				return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
			};
		});
		const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
			$ZodObject.init(inst, def);
			const superParse = inst._zod.parse;
			const _normalized = cached(() => normalizeDef(def));
			const memo = globalConfig.memoizer;
			const generateFastpass = (shape) => {
				const normalized = _normalized.value;
				const syms = normalized.symbolKeys;
				const doc = new Doc(["payload", "ctx"], {
					shape,
					inst,
					memo,
					syms
				});
				const parseStr = (k) => `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
				const prefixStr = (id, k) => `
          for (let i = 0; i < ${id}.issues.length; i++) {
            const iss = ${id}.issues[i];
            iss.path = iss.path ? [${k}, ...iss.path] : [${k}];
            payload.issues.push(iss);
          }`;
				doc.write(`const input = payload.value;`);
				const ids = Object.create(null);
				let counter = 0;
				for (const key of normalized.allKeys) ids[key] = `key_${counter++}`;
				doc.write(memo ? `const newResult = memo.alloc(inst, payload, {}, ctx);` : `const newResult = {};`);
				for (const key of normalized.allKeys) {
					if (key === "__proto__") continue;
					const id = ids[key];
					const k = typeof key === "symbol" ? `syms[${syms.indexOf(key)}]` : esc(key);
					const isPresent = `${k} in input`;
					const schema = shape[key];
					const optin = schema?._zod?.optin;
					const isOptionalIn = optin !== void 0;
					const isOptionalOut = schema?._zod?.optout === "optional";
					doc.write(`const ${id} = ${parseStr(k)};`);
					if (isOptionalIn && isOptionalOut) {
						const assign = optin === "optional" ? `${id}_present` : `${id}.value !== undefined || ${id}_present`;
						doc.write(`
        const ${id}_present = ${isPresent};
        if (!${id}.issues.length || ${id}_present) {
          if (${id}.issues.length) {${prefixStr(id, k)}
          }

          if (${assign}) {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
					} else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${isPresent};
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          newResult[${k}] = ${id}.value;
        }

      `);
					else doc.write(`
        if (${id}.issues.length) {${prefixStr(id, k)}
        }

        if (${id}.value === undefined) {
          if (${isPresent}) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }

      `);
				}
				doc.write(`payload.value = newResult;`);
				doc.write(`return payload;`);
				return doc.compile();
			};
			let fastpass;
			const isObject$2 = isObject;
			const jit = !globalConfig.jitless;
			const fastEnabled = jit && allowsEval.value;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$2(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
					if (!fastpass) fastpass = generateFastpass(def.shape);
					payload = fastpass(payload, ctx);
					if (!catchall) return payload;
					return handleCatchall([], input, payload, ctx, value, inst);
				}
				return superParse(payload, ctx);
			};
		});
		function handleUnionResults(results, final, inst, ctx) {
			for (const result of results) if (result.issues.length === 0) {
				final.value = result.value;
				return final;
			}
			const nonaborted = results.filter((r) => !aborted(r));
			if (nonaborted.length === 1) {
				final.value = nonaborted[0].value;
				return nonaborted[0];
			}
			final.issues.push({
				code: "invalid_union",
				input: final.value,
				inst,
				errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
			});
			return final;
		}
		const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "optin", (zod) => zod.def.options.some((o) => o._zod.optin === "defaulted") ? "defaulted" : zod.def.options.some((o) => o._zod.optin !== void 0) ? "optional" : void 0);
			defineLazyInternal(inst, "optout", (zod) => zod.def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
			defineLazyInternal(inst, "values", (zod) => {
				if (zod.def.options.every((o) => o._zod.values)) return new Set(zod.def.options.flatMap((option) => Array.from(option._zod.values)));
			});
			defineLazyInternal(inst, "pattern", (zod) => {
				if (zod.def.options.every((o) => o._zod.pattern)) {
					const patterns = zod.def.options.map((o) => o._zod.pattern);
					return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
				}
			});
			const first = def.options.length === 1 ? def.options[0]._zod.run : null;
			inst._zod.parse = (payload, ctx) => {
				if (first) return first(payload, ctx);
				let async = false;
				const results = [];
				for (const option of def.options) {
					const result = option._zod.run({
						value: payload.value,
						issues: []
					}, ctx);
					if (result instanceof Promise) {
						results.push(result);
						async = true;
					} else {
						if (result.issues.length === 0) return result;
						results.push(result);
					}
				}
				if (!async) return handleUnionResults(results, payload, inst, ctx);
				return Promise.all(results).then((results) => {
					return handleUnionResults(results, payload, inst, ctx);
				});
			};
		});
		const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				const left = def.left._zod.run({
					value: input,
					issues: []
				}, ctx);
				const right = def.right._zod.run({
					value: input,
					issues: []
				}, ctx);
				if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
					return handleIntersectionResults(payload, left, right);
				});
				return handleIntersectionResults(payload, left, right);
			};
		});
		function mergeValues(a, b) {
			if (a === b) return {
				valid: true,
				data: a
			};
			if (a instanceof Date && b instanceof Date && +a === +b) return {
				valid: true,
				data: a
			};
			if (isPlainObject(a) && isPlainObject(b)) {
				const bKeys = Object.keys(b);
				const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
				const newObj = {
					...a,
					...b
				};
				if (Object.prototype.hasOwnProperty.call(newObj, "__proto__")) delete newObj.__proto__;
				for (const key of sharedKeys) {
					if (key === "__proto__") continue;
					const sharedValue = mergeValues(a[key], b[key]);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
					};
					newObj[key] = sharedValue.data;
				}
				return {
					valid: true,
					data: newObj
				};
			}
			if (Array.isArray(a) && Array.isArray(b)) {
				if (a.length !== b.length) return {
					valid: false,
					mergeErrorPath: []
				};
				const newArray = [];
				for (let index = 0; index < a.length; index++) {
					const itemA = a[index];
					const itemB = b[index];
					const sharedValue = mergeValues(itemA, itemB);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
					};
					newArray.push(sharedValue.data);
				}
				return {
					valid: true,
					data: newArray
				};
			}
			return {
				valid: false,
				mergeErrorPath: []
			};
		}
		function handleIntersectionResults(result, left, right) {
			const unrecKeys = /* @__PURE__ */ new Map();
			let unrecIssue;
			const keyIssues = /* @__PURE__ */ new Map();
			const collect = (iss, side) => {
				let keys;
				if (iss.code === "unrecognized_keys" && !iss.path?.length) {
					unrecIssue ?? (unrecIssue = iss);
					keys = iss.keys;
				} else if (iss.code === "invalid_key" && iss.origin === "record" && iss.path?.length === 1) {
					const k = String(iss.path[0]);
					if (!keyIssues.has(k)) keyIssues.set(k, iss);
					keys = [k];
				} else return false;
				for (const k of keys) {
					if (!unrecKeys.has(k)) unrecKeys.set(k, {});
					unrecKeys.get(k)[side] = true;
				}
				return true;
			};
			for (const iss of left.issues) if (!collect(iss, "l")) result.issues.push(iss);
			for (const iss of right.issues) if (!collect(iss, "r")) result.issues.push(iss);
			const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
			if (bothKeys.length) {
				const aggregated = unrecIssue ? bothKeys.filter((k) => unrecIssue.keys.includes(k)) : [];
				if (aggregated.length) result.issues.push({
					...unrecIssue,
					keys: aggregated
				});
				for (const k of bothKeys) if (!aggregated.includes(k) && keyIssues.has(k)) result.issues.push(keyIssues.get(k));
			}
			const merged = mergeValues(left.value, right.value);
			if (!merged.valid) {
				if (aborted(result)) return result;
				throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
			}
			result.value = merged.data;
			return result;
		}
		const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
			$ZodType.init(inst, def);
			const values = getEnumValues(def.entries);
			const valuesSet = new Set(values);
			inst._zod.values = valuesSet;
			const patternValues = values.filter((k) => propertyKeyTypes.has(typeof k));
			inst._zod.pattern = new RegExp(patternValues.length ? `^(${patternValues.map((o) => escapeRegex(o.toString())).join("|")})$` : "^[^\\s\\S]$");
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (valuesSet.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			globalConfig.memoizer?.guard(inst);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				const _out = def.transform(payload.value, payload);
				if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
					payload.value = output;
					return payload;
				});
				if (_out instanceof Promise) throw new $ZodAsyncError();
				payload.value = _out;
				return payload;
			};
		});
		function handleOptionalResult(payload, result) {
			payload.value = result.issues.length ? void 0 : result.value;
			return payload;
		}
		const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
			inst._zod.optout = "optional";
			defineLazyInternal(inst, "values", (zod) => {
				const values = zod.def.innerType._zod.values;
				return values ? /* @__PURE__ */ new Set([...values, void 0]) : void 0;
			});
			defineLazyInternal(inst, "pattern", (zod) => {
				const pattern = zod.def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (payload.value === void 0) {
					if (def.innerType._zod.optin !== "defaulted") return payload;
					const result = def.innerType._zod.run({
						value: payload.value,
						issues: []
					}, ctx);
					if (result instanceof Promise) return result.then((result) => handleOptionalResult(payload, result));
					return handleOptionalResult(payload, result);
				}
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
			defineLazyInternal(inst, "pattern", (zod) => zod.def.innerType._zod.pattern);
			inst._zod.parse = (payload, ctx) => {
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin);
			defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
			defineLazyInternal(inst, "pattern", (zod) => {
				const pattern = zod.def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
			});
			defineLazyInternal(inst, "values", (zod) => {
				return zod.def.innerType._zod.values ? /* @__PURE__ */ new Set([...zod.def.innerType._zod.values, null]) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (payload.value === null) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "defaulted";
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) {
					payload.value = def.defaultValue;
					/**
					* $ZodDefault returns the default value immediately in forward direction.
					* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
					return payload;
				}
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
				return handleDefaultResult(result, def);
			};
		});
		function handleDefaultResult(payload, def) {
			if (payload.value === void 0) payload.value = def.defaultValue;
			return payload;
		}
		const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "defaulted";
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) payload.value = def.defaultValue;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "values", (zod) => {
				const v = zod.def.innerType._zod.values;
				return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
				return handleNonOptionalResult(result, inst);
			};
		});
		function handleNonOptionalResult(payload, inst) {
			if (!payload.issues.length && payload.value === void 0) payload.issues.push({
				code: "invalid_type",
				expected: "nonoptional",
				input: payload.value,
				inst
			});
			return payload;
		}
		function handleCatchResult(payload, result, def, ctx) {
			if (!result.issues.length) {
				payload.value = result.value;
				if (result.memo) payload.memo = true;
				return payload;
			}
			payload.value = def.catchValue({
				...result,
				value: payload.value,
				error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
				input: payload.value
			});
			return payload;
		}
		const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
			defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run({
					value: payload.value,
					issues: []
				}, ctx);
				if (result instanceof Promise) return result.then((result) => handleCatchResult(payload, result, def, ctx));
				return handleCatchResult(payload, result, def, ctx);
			};
		});
		const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "values", (zod) => zod.def.in._zod.values);
			defineLazyInternal(inst, "optin", (zod) => zod.def.in._zod.optin);
			defineLazyInternal(inst, "optout", (zod) => zod.def.out._zod.optout);
			defineLazyInternal(inst, "propValues", (zod) => zod.def.in._zod.propValues);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") {
					const right = def.out._zod.run(payload, ctx);
					if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
					return handlePipeResult(right, def.in, ctx);
				}
				const left = def.in._zod.run(payload, ctx);
				if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
				return handlePipeResult(left, def.out, ctx);
			};
		});
		function handlePipeResult(left, next, ctx) {
			if (left.issues.some((iss) => iss.code !== "unrecognized_keys")) {
				left.aborted = true;
				return left;
			}
			return next._zod.run({
				value: left.value,
				issues: left.issues
			}, ctx);
		}
		const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazyInternal(inst, "propValues", (zod) => zod.def.innerType._zod.propValues);
			defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
			defineLazyInternal(inst, "optin", (zod) => zod.def.innerType?._zod?.optin);
			defineLazyInternal(inst, "optout", (zod) => zod.def.innerType?._zod?.optout);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then(handleReadonlyResult);
				return handleReadonlyResult(result);
			};
		});
		function handleReadonlyResult(payload) {
			if (!payload.memo) payload.value = Object.freeze(payload.value);
			return payload;
		}
		const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
			$ZodCheck.init(inst, def);
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _) => {
				return payload;
			};
			inst._zod.check = (payload) => {
				const input = payload.value;
				const r = def.fn(input);
				if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
				handleRefineResult(r, payload, input, inst);
			};
		});
		function handleRefineResult(result, payload, input, inst) {
			if (!result) {
				const _iss = {
					code: "custom",
					input,
					inst,
					path: [...inst._zod.def.path ?? []],
					continue: !inst._zod.def.abort
				};
				if (inst._zod.def.params) _iss.params = inst._zod.def.params;
				payload.issues.push(issue(_iss));
			}
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/memoizer.js
		var $ZodCyclicError = class extends Error {
			constructor() {
				super(`Cannot parse a reference cycle that closes through a transform`);
				this.name = "ZodCyclicError";
			}
		};
		/** Keyed off the context object every schema in one parse call already shares. */
		const STATE = "~memo";
		const NO_ISSUES = [];
		function cloneIssues(issues) {
			return issues.map((iss) => iss.path ? {
				...iss,
				path: iss.path.slice()
			} : { ...iss });
		}
		const recursive = /*@__PURE__*/ new WeakMap();
		/** Whether this schema's subtree contains a cycle, so one parse can re-enter it. */
		function isRecursive(inst, stack) {
			const cached = recursive.get(inst);
			if (cached !== void 0) return cached;
			if (stack.has(inst)) return true;
			stack.add(inst);
			let result = false;
			const check = (child) => {
				if (!result && child?._zod && isRecursive(child, stack)) result = true;
			};
			const def = inst._zod.def;
			switch (def.type) {
				case "object":
					for (const key of Reflect.ownKeys(def.shape)) check(def.shape[key]);
					check(def.catchall);
					break;
				case "array":
					check(def.element);
					break;
				case "tuple":
					for (const el of def.items) check(el);
					check(def.rest);
					break;
				case "record":
				case "map":
					check(def.keyType);
					check(def.valueType);
					break;
				case "set":
					check(def.valueType);
					break;
				case "union":
					for (const el of def.options) check(el);
					break;
				case "intersection":
					check(def.left);
					check(def.right);
					break;
				case "optional":
				case "nullable":
				case "default":
				case "prefault":
				case "catch":
				case "readonly":
				case "nonoptional":
				case "promise":
				case "success":
					check(def.innerType);
					break;
				case "pipe":
					check(def.in);
					check(def.out);
					break;
				case "function":
					check(def.input);
					check(def.output);
					break;
				case "lazy":
					check(inst._zod.innerType);
					break;
				case "template_literal":
				case "string":
				case "number":
				case "int":
				case "boolean":
				case "bigint":
				case "symbol":
				case "undefined":
				case "null":
				case "void":
				case "never":
				case "any":
				case "unknown":
				case "date":
				case "nan":
				case "enum":
				case "literal":
				case "file":
				case "transform":
				case "custom": break;
				default: for (const key in def) {
					const desc = Object.getOwnPropertyDescriptor(def, key);
					if (!desc || desc.get) continue;
					const value = desc.value;
					if (!value || typeof value !== "object") continue;
					if (value._zod) check(value);
					else if (Array.isArray(value)) for (const el of value) check(el);
				}
			}
			stack.delete(inst);
			recursive.set(inst, result);
			return result;
		}
		function bucketFor(state, inst) {
			let bucket = state.buckets.get(inst);
			if (!bucket) {
				bucket = /* @__PURE__ */ new Map();
				state.buckets.set(inst, bucket);
			}
			return bucket;
		}
		let handoff;
		const open = [];
		const memo = {
			alloc(_inst, payload, empty) {
				const bucket = handoff;
				if (!bucket) return empty;
				handoff = void 0;
				const entry = {
					value: empty,
					issues: null
				};
				bucket.set(payload.value, entry);
				open.push(entry);
				return empty;
			},
			guard(inst) {
				var _a;
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred.push(() => {
					const base = inst._zod.parse;
					const wrapped = (payload, ctx) => {
						if (ctx.direction !== "backward" && isBackEdge(ctx, payload.value)) throw new $ZodCyclicError();
						return base(payload, ctx);
					};
					inst._zod.parse = wrapped;
					if (inst._zod.run === base) inst._zod.run = wrapped;
				});
			},
			attach(inst) {
				var _a;
				let isRecursiveInst;
				let lastCtx;
				let lastBucket;
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred.push(() => {
					const base = inst._zod.parse;
					const wrapped = (payload, ctx) => {
						if (isRecursiveInst === void 0) {
							isRecursiveInst = isRecursive(inst, /* @__PURE__ */ new Set());
							if (!isRecursiveInst) {
								inst._zod.parse = base;
								if (inst._zod.run === wrapped) inst._zod.run = base;
								return base(payload, ctx);
							}
						}
						const input = payload.value;
						if (input === null || typeof input !== "object") return base(payload, ctx);
						let state = ctx[STATE];
						if (!state) {
							state = {
								buckets: /* @__PURE__ */ new Map(),
								backEdges: void 0
							};
							ctx[STATE] = state;
						}
						let bucket;
						if (lastCtx === ctx) bucket = lastBucket;
						else {
							bucket = bucketFor(state, inst);
							lastCtx = ctx;
							lastBucket = bucket;
						}
						const hit = bucket.get(input);
						if (hit) {
							payload.value = hit.value;
							if (hit.issues) {
								if (hit.issues.length) payload.issues.push(...cloneIssues(hit.issues));
							} else {
								payload.memo = true;
								state.backEdges ?? (state.backEdges = /* @__PURE__ */ new Set());
								state.backEdges.add(hit.value);
							}
							return payload;
						}
						handoff = bucket;
						const depth = open.length;
						const result = base(payload, ctx);
						handoff = void 0;
						const entry = open.length > depth ? open.pop() : void 0;
						if (result instanceof Promise) return result.then((r) => {
							if (entry) entry.issues = r.issues.length ? cloneIssues(r.issues) : NO_ISSUES;
							return r;
						});
						if (entry) entry.issues = result.issues.length ? cloneIssues(result.issues) : NO_ISSUES;
						return result;
					};
					inst._zod.parse = wrapped;
					if (inst._zod.run === base) inst._zod.run = wrapped;
				});
			}
		};
		/** The memoizer that gives containers cycle support. `zod` installs it by default; `zod/mini` opts in with `config({ memoizer: memoizer() })`. */
		function memoizer() {
			return memo;
		}
		/** Whether this value is a node a back-edge resolved to before it finished. */
		function isBackEdge(ctx, value) {
			const backEdges = ctx[STATE]?.backEdges;
			return backEdges !== void 0 && value !== null && typeof value === "object" && backEdges.has(value);
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/locales/en.js
		const error = () => {
			const Sizable = {
				string: {
					unit: "characters",
					verb: "to have"
				},
				file: {
					unit: "bytes",
					verb: "to have"
				},
				array: {
					unit: "items",
					verb: "to have"
				},
				set: {
					unit: "items",
					verb: "to have"
				},
				map: {
					unit: "entries",
					verb: "to have"
				}
			};
			function getSizing(origin) {
				return Sizable[origin] ?? null;
			}
			const FormatDictionary = {
				regex: "input",
				email: "email address",
				url: "URL",
				emoji: "emoji",
				uuid: "UUID",
				uuidv4: "UUIDv4",
				uuidv6: "UUIDv6",
				nanoid: "nanoid",
				guid: "GUID",
				cuid: "cuid",
				cuid2: "cuid2",
				ulid: "ULID",
				xid: "XID",
				ksuid: "KSUID",
				datetime: "ISO datetime",
				date: "ISO date",
				time: "ISO time",
				duration: "ISO duration",
				ipv4: "IPv4 address",
				ipv6: "IPv6 address",
				mac: "MAC address",
				cidrv4: "IPv4 range",
				cidrv6: "IPv6 range",
				base64: "base64-encoded string",
				base64url: "base64url-encoded string",
				json_string: "JSON string",
				e164: "E.164 number",
				credit_card: "credit card number",
				jwt: "JWT",
				template_literal: "input"
			};
			const TypeDictionary = { nan: "NaN" };
			function getTypeName(type, input) {
				if (type === "number" && typeof input === "number" && !Number.isFinite(input)) return String(input);
				return TypeDictionary[type] ?? type;
			}
			return (issue) => {
				switch (issue.code) {
					case "invalid_type": return `Invalid input: expected ${getTypeName(issue.expected)}, received ${getTypeName(parsedType(issue.input), issue.input)}`;
					case "invalid_value":
						if (issue.values.length === 1) return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
						return `Invalid option: expected one of ${joinValues(issue.values, "|")}`;
					case "too_big": {
						const adj = issue.exact ? "exactly " : issue.inclusive ? "<=" : "<";
						const sizing = getSizing(issue.origin);
						if (sizing) return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
						return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
					}
					case "too_small": {
						const adj = issue.exact ? "exactly " : issue.inclusive ? ">=" : ">";
						const sizing = getSizing(issue.origin);
						if (sizing) return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
						return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
					}
					case "invalid_format": {
						const _issue = issue;
						if (_issue.format === "starts_with") return `Invalid string: must start with "${_issue.prefix}"`;
						if (_issue.format === "ends_with") return `Invalid string: must end with "${_issue.suffix}"`;
						if (_issue.format === "includes") return `Invalid string: must include "${_issue.includes}"`;
						if (_issue.format === "regex") return `Invalid string: must match pattern ${_issue.pattern}`;
						return `Invalid ${FormatDictionary[_issue.format] ?? issue.format}`;
					}
					case "not_multiple_of": return `Invalid number: must be a multiple of ${issue.divisor}`;
					case "unrecognized_keys": return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
					case "invalid_key": return `Invalid key in ${issue.origin}`;
					case "invalid_union":
						if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) return `Invalid discriminator value. Expected ${issue.options.map((o) => `'${o}'`).join(" | ")}`;
						if (issue.inclusive === false) return "Invalid input: more than one option matched";
						return "Invalid input";
					case "invalid_element": return `Invalid value in ${issue.origin}`;
					default: return `Invalid input`;
				}
			};
		};
		function en_default() {
			return { localeError: error() };
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/registries.js
		var _a;
		var $ZodRegistry = class {
			constructor() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
			}
			add(schema, ..._meta) {
				const meta = _meta[0];
				this._map.set(schema, meta);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
				return this;
			}
			clear() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
				return this;
			}
			remove(schema) {
				const meta = this._map.get(schema);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
				this._map.delete(schema);
				return this;
			}
			get(schema) {
				const p = schema._zod.parent;
				if (p) {
					const pm = { ...this.get(p) ?? {} };
					delete pm.id;
					const f = {
						...pm,
						...this._map.get(schema)
					};
					return Object.keys(f).length ? f : void 0;
				}
				return this._map.get(schema);
			}
			has(schema) {
				return this._map.has(schema);
			}
		};
		function registry() {
			return new $ZodRegistry();
		}
		(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
		const globalRegistry = globalThis.__zod_globalRegistry;
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/api.js
		// @__NO_SIDE_EFFECTS__
		function _string(Class, params) {
			return new Class({
				type: "string",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _email(Class, params) {
			return new Class({
				type: "string",
				format: "email",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _guid(Class, params) {
			return new Class({
				type: "string",
				format: "guid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuid(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv4(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v4",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv6(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v6",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv7(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v7",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _url(Class, params) {
			return new Class({
				type: "string",
				format: "url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _emoji(Class, params) {
			return new Class({
				type: "string",
				format: "emoji",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _nanoid(Class, params) {
			return new Class({
				type: "string",
				format: "nanoid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link _cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		// @__NO_SIDE_EFFECTS__
		function _cuid(Class, params) {
			return new Class({
				type: "string",
				format: "cuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cuid2(Class, params) {
			return new Class({
				type: "string",
				format: "cuid2",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ulid(Class, params) {
			return new Class({
				type: "string",
				format: "ulid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _xid(Class, params) {
			return new Class({
				type: "string",
				format: "xid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ksuid(Class, params) {
			return new Class({
				type: "string",
				format: "ksuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv4(Class, params) {
			return new Class({
				type: "string",
				format: "ipv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv6(Class, params) {
			return new Class({
				type: "string",
				format: "ipv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv4(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv6(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64(Class, params) {
			return new Class({
				type: "string",
				format: "base64",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64url(Class, params) {
			return new Class({
				type: "string",
				format: "base64url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _e164(Class, params) {
			return new Class({
				type: "string",
				format: "e164",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _jwt(Class, params) {
			return new Class({
				type: "string",
				format: "jwt",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDateTime(Class, params) {
			return new Class({
				type: "string",
				format: "datetime",
				check: "string_format",
				offset: false,
				local: false,
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDate(Class, params) {
			return new Class({
				type: "string",
				format: "date",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoTime(Class, params) {
			return new Class({
				type: "string",
				format: "time",
				check: "string_format",
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDuration(Class, params) {
			return new Class({
				type: "string",
				format: "duration",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _number(Class, params) {
			return new Class({
				type: "number",
				checks: [],
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _int(Class, params) {
			return new Class({
				type: "number",
				check: "number_format",
				abort: false,
				format: "safeint",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _boolean(Class, params) {
			return new Class({
				type: "boolean",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _undefined$1(Class, params) {
			return new Class({
				type: "undefined",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _unknown(Class) {
			return new Class({ type: "unknown" });
		}
		// @__NO_SIDE_EFFECTS__
		function _never(Class, params) {
			return new Class({
				type: "never",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lt(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lte(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gt(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gte(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _multipleOf(value, params) {
			return new $ZodCheckMultipleOf({
				check: "multiple_of",
				...normalizeParams(params),
				value
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _maxLength(maximum, params) {
			return new $ZodCheckMaxLength({
				check: "max_length",
				...normalizeParams(params),
				maximum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _minLength(minimum, params) {
			return new $ZodCheckMinLength({
				check: "min_length",
				...normalizeParams(params),
				minimum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _length(length, params) {
			return new $ZodCheckLengthEquals({
				check: "length_equals",
				...normalizeParams(params),
				length
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _regex(pattern, params) {
			return new $ZodCheckRegex({
				check: "string_format",
				format: "regex",
				...normalizeParams(params),
				pattern
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lowercase(params) {
			return new $ZodCheckLowerCase({
				check: "string_format",
				format: "lowercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uppercase(params) {
			return new $ZodCheckUpperCase({
				check: "string_format",
				format: "uppercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _includes(includes, params) {
			return new $ZodCheckIncludes({
				check: "string_format",
				format: "includes",
				...normalizeParams(params),
				includes
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _startsWith(prefix, params) {
			return new $ZodCheckStartsWith({
				check: "string_format",
				format: "starts_with",
				...normalizeParams(params),
				prefix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _endsWith(suffix, params) {
			return new $ZodCheckEndsWith({
				check: "string_format",
				format: "ends_with",
				...normalizeParams(params),
				suffix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _overwrite(tx) {
			return new $ZodCheckOverwrite({
				check: "overwrite",
				tx
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _normalize(form) {
			return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
		}
		// @__NO_SIDE_EFFECTS__
		function _trim() {
			return /* @__PURE__ */ _overwrite((input) => input.trim());
		}
		// @__NO_SIDE_EFFECTS__
		function _toLowerCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _toUpperCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _slugify() {
			return /* @__PURE__ */ _overwrite((input) => slugify(input));
		}
		// @__NO_SIDE_EFFECTS__
		function _array(Class, element, params) {
			return new Class({
				type: "array",
				element,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _refine(Class, fn, _params) {
			return new Class({
				type: "custom",
				check: "custom",
				fn,
				...normalizeParams(_params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _superRefine(fn, params) {
			const ch = /* @__PURE__ */ _check((payload) => {
				payload.addIssue = (issue$2) => {
					if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
					else {
						const _issue = issue$2;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						if (!("input" in _issue)) _issue.input = payload.value;
						_issue.inst ?? (_issue.inst = ch);
						_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
						payload.issues.push(issue(_issue));
					}
				};
				return fn(payload.value, payload);
			}, params);
			return ch;
		}
		// @__NO_SIDE_EFFECTS__
		function _check(fn, params) {
			const ch = new $ZodCheck({
				check: "custom",
				...normalizeParams(params)
			});
			ch._zod.check = fn;
			return ch;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/to-json-schema.js
		function assignProps(target, ...sources) {
			for (const source of sources) for (const key of Reflect.ownKeys(source)) if (Object.prototype.propertyIsEnumerable.call(source, key)) assignProp(target, key, source[key]);
			return target;
		}
		function initializeContext(params) {
			let target = params?.target ?? "draft-2020-12";
			if (target === "draft-4") target = "draft-04";
			if (target === "draft-7") target = "draft-07";
			return {
				processors: params.processors ?? {},
				metadataRegistry: params?.metadata ?? globalRegistry,
				target,
				unrepresentable: params?.unrepresentable ?? "throw",
				override: params?.override ?? (() => {}),
				io: params?.io ?? "output",
				counter: 0,
				seen: /* @__PURE__ */ new Map(),
				sharedDefsExtractedFor: void 0,
				sharedEmitDoneFor: void 0,
				cycles: params?.cycles ?? "ref",
				reused: params?.reused ?? "inline",
				intersections: [],
				deferred: [],
				external: params?.external ?? void 0
			};
		}
		/**
		* Applies the `unrepresentable` setting at a site that has no JSON Schema equivalent. Throws
		* `message` unless the setting (or the handler's return value) says otherwise. Returns `true` if a
		* custom JSON Schema was written into `json`, in which case the caller must not write its own.
		*/
		function handleUnrepresentable(schema, ctx, json, params, message) {
			const result = typeof ctx.unrepresentable === "function" ? ctx.unrepresentable({
				zodSchema: schema,
				path: params.path,
				message
			}) : ctx.unrepresentable;
			if (result === "any") return false;
			if (result === void 0 || result === "throw") throw new Error(message);
			Object.assign(json, result);
			return true;
		}
		function process(schema, ctx, _params = {
			path: [],
			schemaPath: []
		}) {
			var _a;
			const def = schema._zod.def;
			const seen = ctx.seen.get(schema);
			if (seen) {
				seen.count++;
				if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
				return seen.schema;
			}
			const result = {
				schema: {},
				count: 1,
				cycle: void 0,
				path: _params.path
			};
			ctx.seen.set(schema, result);
			ctx.sharedDefsExtractedFor = void 0;
			ctx.sharedEmitDoneFor = void 0;
			const overrideSchema = schema._zod.toJSONSchema?.();
			if (overrideSchema) result.schema = overrideSchema;
			else {
				const params = {
					..._params,
					schemaPath: [..._params.schemaPath, schema],
					path: _params.path
				};
				if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
				else {
					const _json = result.schema;
					const processor = ctx.processors[def.type];
					if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
					processor(schema, ctx, _json, params);
				}
				const parent = schema._zod.parent;
				if (parent) {
					if (!result.ref) result.ref = parent;
					process(parent, ctx, params);
					ctx.seen.get(parent).isParent = true;
				}
			}
			const meta = ctx.metadataRegistry.get(schema);
			if (meta) assignProps(result.schema, meta);
			if (ctx.io === "input" && isTransforming(schema)) {
				delete result.schema.examples;
				delete result.schema.default;
			}
			if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
			delete result.schema._prefault;
			return ctx.seen.get(schema).schema;
		}
		function encodeJSONPointerSegment(segment) {
			return segment.replace(/~/g, "~0").replace(/\//g, "~1");
		}
		function extractDefs(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			if (ctx.external && ctx.sharedDefsExtractedFor === ctx.external) return;
			const idToSchema = /* @__PURE__ */ new Map();
			for (const entry of ctx.seen.entries()) {
				const id = ctx.metadataRegistry.get(entry[0])?.id;
				if (id) {
					const existing = idToSchema.get(id);
					if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
					idToSchema.set(id, entry[0]);
				}
			}
			const makeURI = (entry) => {
				const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
				if (ctx.external) {
					const externalId = ctx.external.registry.get(entry[0])?.id;
					const uriGenerator = ctx.external.uri ?? ((id) => id);
					if (externalId) return { ref: uriGenerator(externalId) };
					const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
					entry[1].defId = id;
					return {
						defId: id,
						ref: `${uriGenerator("__shared")}#/${defsSegment}/${encodeJSONPointerSegment(id)}`
					};
				}
				const uriPrefix = `#`;
				const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
				if (entry[1] === root && !entry[1].schema.id) return { ref: uriPrefix };
				const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
				return {
					defId,
					ref: defUriPrefix + encodeJSONPointerSegment(defId)
				};
			};
			const extractToDef = (entry) => {
				if (entry[1].schema.$ref) return;
				const seen = entry[1];
				const { ref, defId } = makeURI(entry);
				seen.def = { ...seen.schema };
				if (defId) seen.defId = defId;
				const schema = seen.schema;
				for (const key in schema) delete schema[key];
				schema.$ref = ref;
			};
			if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
			}
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (schema === entry[0]) {
					extractToDef(entry);
					continue;
				}
				if (ctx.external) {
					const ext = ctx.external.registry.get(entry[0])?.id;
					if (schema !== entry[0] && ext) {
						extractToDef(entry);
						continue;
					}
				}
				if (ctx.metadataRegistry.get(entry[0])?.id) {
					extractToDef(entry);
					continue;
				}
				if (seen.cycle) {
					extractToDef(entry);
					continue;
				}
				if (seen.count > 1) {
					if (ctx.reused === "ref") {
						extractToDef(entry);
						continue;
					}
				}
			}
			if (ctx.external) ctx.sharedDefsExtractedFor = ctx.external;
		}
		/** Rewrites `anyOf: [{type: "a"}, {type: "b"}]` to `type: ["a", "b"]`, which every JSON Schema draft treats as equivalent and most consumers render far better for the nullable case. Only branches that are a bare type assertion qualify — anything carrying a constraint, `$ref`, `const` or metadata is left alone. Runs after `flattenRef`, so a branch an override decorated or `$defs` extraction turned into a `$ref` is no longer bare and correctly stays in `anyOf`. `oneOf` is excluded: `integer` and `number` overlap, so "exactly one" and "at least one" are not the same there. OpenAPI 3.0 is excluded: its `type` must be a single string. */
		function compactTypeUnion(schema) {
			const options = schema.anyOf;
			if (!Array.isArray(options) || options.length === 0 || schema.type !== void 0) return;
			const types = [];
			for (const option of options) {
				if (!option || typeof option !== "object") return;
				compactTypeUnion(option);
				const keys = Object.keys(option);
				if (keys.length !== 1 || keys[0] !== "type") return;
				const type = option.type;
				for (const member of Array.isArray(type) ? type : [type]) {
					if (typeof member !== "string") return;
					if (!types.includes(member)) types.push(member);
				}
			}
			delete schema.anyOf;
			schema.type = types.length === 1 ? types[0] : types;
		}
		/** Keywords `foldIntersection` knows how to combine. Anything else — `$ref`, `patternProperties`,
		* an annotation like `description` — makes a member unfoldable, so a constraint this does not
		* understand leaves the `allOf` alone instead of being silently dropped or misattributed. */
		const FOLDABLE_KEYS = /* @__PURE__ */ new Set([
			"type",
			"properties",
			"required",
			"additionalProperties"
		]);
		const UNION_KEYS = ["oneOf", "anyOf"];
		/** A member's constraint on a key it does not declare itself. A `catchall` states one; `false`, an absent `additionalProperties`, and the empty schema a loose object emits state nothing. */
		function undeclaredConstraint(member) {
			const extra = member.additionalProperties;
			if (extra === void 0 || extra === false || typeof extra !== "object" || extra === null) return null;
			return Object.keys(extra).length ? extra : null;
		}
		/** Combines object members into the single object they describe together, or returns `null` if any of them carries a keyword outside {@link FOLDABLE_KEYS}. */
		function foldObjects(members) {
			const objects = [];
			for (const member of members) {
				if (typeof member !== "object" || member.type !== "object") return null;
				for (const key in member) if (!FOLDABLE_KEYS.has(key)) return null;
				objects.push(member);
			}
			const properties = {};
			const required = /* @__PURE__ */ new Set();
			for (const object of objects) {
				for (const key in object.properties) {
					if (Object.prototype.hasOwnProperty.call(properties, key)) continue;
					const parts = [];
					for (const other of objects) {
						const part = other.properties?.[key] ?? undeclaredConstraint(other);
						if (part === null || part === void 0) continue;
						if (!parts.some((seen) => JSON.stringify(seen) === JSON.stringify(part))) parts.push(part);
					}
					assignProp(properties, key, parts.length === 1 ? parts[0] : foldObjects(parts) ?? { allOf: parts });
				}
				for (const key of object.required ?? []) required.add(key);
			}
			const folded = {
				type: "object",
				properties
			};
			if (required.size) folded.required = [...required];
			if (objects.every((object) => object.additionalProperties === false)) folded.additionalProperties = false;
			else {
				const constraints = [];
				for (const object of objects) {
					const constraint = undeclaredConstraint(object);
					if (constraint && !constraints.some((seen) => JSON.stringify(seen) === JSON.stringify(constraint))) constraints.push(constraint);
				}
				if (constraints.length === 1) folded.additionalProperties = constraints[0];
				else if (constraints.length > 1) folded.additionalProperties = { allOf: constraints };
			}
			return folded;
		}
		/** `additionalProperties` in an `allOf` member sees only that member's own `properties`, so two
		* closed object members reject each other's keys and the schema validates nothing. Zod's parser
		* pools the key sets instead — `handleIntersectionResults` reports a key as unrecognized only when
		* *every* side rejects it — so the emitted schema has to pool them too, and folding the members
		* into one object is the encoding that says so on every target.
		*
		* This runs from `finalize`, after `extractDefs`, which is what keeps it clear of the `$ref`
		* machinery: a member extracted into `$defs` is already a `$ref` by now and declines to fold, so it
		* keeps its reference and its own closedness rather than being inlined as a stale copy. */
		function foldIntersection(json) {
			const allOf = json.allOf;
			if (!Array.isArray(allOf) || allOf.length < 2) return;
			for (const key of FOLDABLE_KEYS) if (key in json) return;
			const unions = allOf.filter((m) => UNION_KEYS.some((k) => Array.isArray(m[k])));
			let folded = null;
			if (!unions.length) folded = foldObjects(allOf);
			else {
				const union = unions[0];
				const keyword = UNION_KEYS.find((k) => Array.isArray(union[k]));
				if (Object.keys(union).length !== 1) return;
				const rest = allOf.filter((m) => m !== union);
				const branches = union[keyword].map((branch) => foldObjects([...rest, branch]));
				if (branches.some((b) => !b)) return;
				folded = { [keyword]: branches };
			}
			if (!folded) return;
			delete json.allOf;
			assignProps(json, folded);
		}
		function finalize(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const flattenRef = (zodSchema) => {
				const seen = ctx.seen.get(zodSchema);
				if (seen.ref === null) return;
				const schema = seen.def ?? seen.schema;
				const _cached = { ...schema };
				const ref = seen.ref;
				seen.ref = null;
				if (ref) {
					flattenRef(ref);
					const refSeen = ctx.seen.get(ref);
					const refSchema = refSeen.schema;
					if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
						schema.allOf = schema.allOf ?? [];
						schema.allOf.push(refSchema);
					} else assignProps(schema, refSchema);
					assignProps(schema, _cached);
					if (zodSchema._zod.parent === ref) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (!(key in _cached)) delete schema[key];
					}
					if (refSchema.$ref && refSeen.def) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
					}
				}
				const parent = zodSchema._zod.parent;
				if (parent && parent !== ref) {
					flattenRef(parent);
					const parentSeen = ctx.seen.get(parent);
					if (parentSeen?.schema.$ref) {
						schema.$ref = parentSeen.schema.$ref;
						if (parentSeen.def) for (const key in schema) {
							if (key === "$ref" || key === "allOf") continue;
							if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
						}
					}
				}
				ctx.override({
					zodSchema,
					jsonSchema: schema,
					path: seen.path ?? []
				});
			};
			if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
				for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
				if (ctx.target !== "openapi-3.0") for (const entry of ctx.seen.entries()) compactTypeUnion(entry[1].def ?? entry[1].schema);
				for (const rewrite of ctx.deferred) rewrite();
				if (ctx.intersections.length) {
					const carriers = /* @__PURE__ */ new Map();
					for (const seen of ctx.seen.values()) for (const json of [seen.schema, seen.def]) {
						const allOf = json?.allOf;
						if (!Array.isArray(allOf)) continue;
						const existing = carriers.get(allOf);
						if (existing) existing.push(json);
						else carriers.set(allOf, [json]);
					}
					for (const allOf of ctx.intersections) for (const json of carriers.get(allOf) ?? []) foldIntersection(json);
				}
			}
			const result = {};
			if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
			else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
			else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
			else if (ctx.target === "openapi-3.0") {}
			if (ctx.external?.uri) {
				const id = ctx.external.registry.get(schema)?.id;
				if (!id) throw new Error("Schema is missing an `id` property");
				result.$id = ctx.external.uri(id);
			}
			assignProps(result, root.defId ? root.schema : root.def ?? root.schema);
			const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
			if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
			const defs = ctx.external?.defs ?? {};
			if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.def && seen.defId) {
					if (seen.def.id === seen.defId) delete seen.def.id;
					assignProp(defs, seen.defId, seen.def);
				}
			}
			if (ctx.external) ctx.sharedEmitDoneFor = ctx.external;
			if (ctx.external) {} else if (Object.keys(defs).length > 0) {
				if (ctx.target === "draft-2020-12") result.$defs = defs;
				else result.definitions = defs;
			}
			try {
				const finalized = JSON.parse(JSON.stringify(result));
				Object.defineProperty(finalized, "~standard", {
					value: {
						...schema["~standard"],
						jsonSchema: {
							input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
							output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
						}
					},
					enumerable: false,
					writable: false
				});
				return finalized;
			} catch (_err) {
				throw new Error("Error converting schema to JSON.");
			}
		}
		function isTransforming(_schema, _ctx) {
			const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
			if (ctx.seen.has(_schema)) return false;
			ctx.seen.add(_schema);
			const def = _schema._zod.def;
			if (def.type === "transform") return true;
			if (def.type === "array") return isTransforming(def.element, ctx);
			if (def.type === "set") return isTransforming(def.valueType, ctx);
			if (def.type === "lazy") return isTransforming(def.getter(), ctx);
			if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault" || def.type === "catch") return isTransforming(def.innerType, ctx);
			if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
			if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
			if (def.type === "pipe") {
				if (_schema._zod.traits.has("$ZodCodec")) return true;
				return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
			}
			if (def.type === "object") {
				for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
				return false;
			}
			if (def.type === "union") {
				for (const option of def.options) if (isTransforming(option, ctx)) return true;
				return false;
			}
			if (def.type === "tuple") {
				for (const item of def.items) if (isTransforming(item, ctx)) return true;
				if (def.rest && isTransforming(def.rest, ctx)) return true;
				return false;
			}
			return false;
		}
		/**
		* Creates a toJSONSchema method for a schema instance.
		* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
		*/
		const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
			const ctx = initializeContext({
				...params,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
			const { libraryOptions, target } = params ?? {};
			const ctx = initializeContext({
				...libraryOptions ?? {},
				target,
				io,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/core/json-schema-processors.js
		const formatMap = {
			guid: "uuid",
			url: "uri",
			datetime: "date-time",
			json_string: "json-string",
			regex: ""
		};
		const stringProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			json.type = "string";
			const { minimum, maximum, format, patterns, contentEncoding, laxFormat } = schema._zod.bag;
			if (typeof minimum === "number") json.minLength = minimum;
			if (typeof maximum === "number") json.maxLength = maximum;
			if (format) {
				json.format = formatMap[format] ?? format;
				if (json.format === "") delete json.format;
				if (format === "time" || laxFormat) delete json.format;
			}
			if (contentEncoding) json.contentEncoding = contentEncoding;
			if (patterns && patterns.size > 0) {
				const patternList = [...patterns];
				if (patternList.length === 1) json.pattern = patternList[0].source;
				else if (patternList.length > 1) json.allOf = [...patternList.map((regex) => ({
					...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
					pattern: regex.source
				}))];
			}
		};
		const numberProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
			if (typeof format === "string" && format.includes("int")) json.type = "integer";
			else json.type = "number";
			const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
			const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
			const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
			if (exMin) {
				if (legacy) {
					json.minimum = exclusiveMinimum;
					json.exclusiveMinimum = true;
				} else json.exclusiveMinimum = exclusiveMinimum;
			} else if (typeof minimum === "number") json.minimum = minimum;
			if (exMax) {
				if (legacy) {
					json.maximum = exclusiveMaximum;
					json.exclusiveMaximum = true;
				} else json.exclusiveMaximum = exclusiveMaximum;
			} else if (typeof maximum === "number") json.maximum = maximum;
			if (typeof multipleOf === "number") {
				if (Number.isFinite(multipleOf) && multipleOf !== 0) json.multipleOf = Math.abs(multipleOf);
				else handleUnrepresentable(schema, ctx, json, params, `A multipleOf divisor of ${multipleOf} cannot be represented in JSON Schema`);
			}
		};
		const booleanProcessor = (_schema, _ctx, json, _params) => {
			json.type = "boolean";
		};
		const undefinedProcessor = (schema, ctx, json, params) => {
			handleUnrepresentable(schema, ctx, json, params, "Undefined cannot be represented in JSON Schema");
		};
		const neverProcessor = (_schema, _ctx, json, _params) => {
			json.not = {};
		};
		const enumProcessor = (schema, _ctx, json, _params) => {
			const def = schema._zod.def;
			const values = getEnumValues(def.entries);
			if (values.length === 0) {
				json.not = {};
				return;
			}
			if (values.every((v) => typeof v === "number")) json.type = "number";
			if (values.every((v) => typeof v === "string")) json.type = "string";
			json.enum = values;
		};
		const customProcessor = (schema, ctx, json, params) => {
			handleUnrepresentable(schema, ctx, json, params, "Custom types cannot be represented in JSON Schema");
		};
		const transformProcessor = (schema, ctx, json, params) => {
			handleUnrepresentable(schema, ctx, json, params, "Transforms cannot be represented in JSON Schema");
		};
		const arrayProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			const { minimum, maximum } = schema._zod.bag;
			if (typeof minimum === "number") json.minItems = minimum;
			if (typeof maximum === "number") json.maxItems = maximum;
			json.type = "array";
			json.items = process(def.element, ctx, {
				...params,
				path: [...params.path, "items"]
			});
		};
		function inputOptin(schema) {
			const def = schema._zod.def;
			if (def.type === "pipe" && def.in._zod.traits.has("$ZodTransform")) return inputOptin(def.out);
			if (def.type === "catch") return inputOptin(def.innerType);
			return schema._zod.optin;
		}
		const objectProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			const shape = def.shape;
			if (Object.getOwnPropertySymbols(shape).length && handleUnrepresentable(schema, ctx, json, params, "Symbol keys cannot be represented in JSON Schema")) return;
			json.type = "object";
			json.properties = {};
			for (const key in shape) assignProp(json.properties, key, process(shape[key], ctx, {
				...params,
				path: [
					...params.path,
					"properties",
					key
				]
			}));
			const allKeys = new Set(Object.keys(shape));
			const requiredKeys = new Set([...allKeys].filter((key) => {
				const field = def.shape[key];
				if (ctx.io === "input") return inputOptin(field) === void 0;
				else return field._zod.optout === void 0;
			}));
			if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
			if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
			else if (!def.catchall) {
				if (ctx.io === "output") json.additionalProperties = false;
			} else if (def.catchall) json.additionalProperties = process(def.catchall, ctx, {
				...params,
				path: [...params.path, "additionalProperties"]
			});
		};
		const unionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const isExclusive = def.inclusive === false;
			const options = def.options.map((x, i) => process(x, ctx, {
				...params,
				path: [
					...params.path,
					isExclusive ? "oneOf" : "anyOf",
					i
				]
			}));
			if (isExclusive) json.oneOf = options;
			else json.anyOf = options;
		};
		const intersectionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const a = process(def.left, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					0
				]
			});
			const b = process(def.right, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					1
				]
			});
			const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
			const allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
			json.allOf = allOf;
			ctx.intersections.push(allOf);
		};
		const nullableProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const inner = process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			if (ctx.target === "openapi-3.0") {
				seen.ref = def.innerType;
				json.nullable = true;
			} else json.anyOf = [inner, { type: "null" }];
		};
		const nonoptionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		/** Round-trips a default value through JSON so the emitted schema is guaranteed to be valid JSON.
		* A BigInt has no reliable encoding, so it goes through `unrepresentable` like any other
		* unrepresentable value. Returns a sentinel when the caller must not write a default of its own. */
		const UNREPRESENTABLE_DEFAULT = Symbol();
		function serializeDefaultValue(value, schema, ctx, json, params) {
			let unrepresentable = false;
			const serialized = JSON.stringify(value, (_, val) => {
				if (typeof val !== "bigint") return val;
				unrepresentable = true;
				return null;
			});
			if (!unrepresentable) return JSON.parse(serialized);
			handleUnrepresentable(schema, ctx, json, params, "BigInt defaults cannot be represented in JSON Schema");
			return UNREPRESENTABLE_DEFAULT;
		}
		const defaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
			if (value !== UNREPRESENTABLE_DEFAULT) json.default = value;
		};
		const prefaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			if (ctx.io !== "input") return;
			const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
			if (value !== UNREPRESENTABLE_DEFAULT) json._prefault = value;
		};
		const catchProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			let catchValue;
			try {
				catchValue = def.catchValue(void 0);
			} catch {
				handleUnrepresentable(schema, ctx, json, params, "Dynamic catch values are not supported in JSON Schema");
				return;
			}
			json.default = catchValue;
		};
		const pipeProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			const inIsTransform = def.in._zod.traits.has("$ZodTransform");
			const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
			process(innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = innerType;
		};
		const readonlyProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.readOnly = true;
		};
		const optionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/classic/errors.js
		const _installedErrorProtos = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
		function _lazyMethod(proto, key, make) {
			Object.defineProperty(proto, key, {
				configurable: true,
				enumerable: false,
				get() {
					const value = make(this);
					Object.defineProperty(this, key, {
						value,
						configurable: true,
						writable: true
					});
					return value;
				},
				set(value) {
					Object.defineProperty(this, key, {
						value,
						configurable: true,
						writable: true
					});
				}
			});
		}
		const initializer = (inst, issues) => {
			$ZodError.init(inst, issues);
			inst.name = "ZodError";
			const proto = Object.getPrototypeOf(inst);
			if (_installedErrorProtos.has(proto)) return;
			_installedErrorProtos.add(proto);
			_lazyMethod(proto, "format", (self) => (mapper) => formatError(self, mapper));
			_lazyMethod(proto, "flatten", (self) => (mapper) => flattenError(self, mapper));
			_lazyMethod(proto, "addIssue", (self) => (issue) => {
				self.issues.push(issue);
				self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
			});
			_lazyMethod(proto, "addIssues", (self) => (issues) => {
				self.issues.push(...issues);
				self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
			});
			Object.defineProperty(proto, "isEmpty", {
				configurable: true,
				enumerable: false,
				get() {
					return this.issues.length === 0;
				}
			});
		};
		const ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, void 0, { Parent: Error });
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/classic/parse.js
		const parse = /* @__PURE__ */ _parse(ZodRealError);
		const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
		const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
		const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
		const encode = /* @__PURE__ */ _encode(ZodRealError);
		const decode = /* @__PURE__ */ _decode(ZodRealError);
		const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
		const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
		const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
		const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
		const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
		const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
		//#endregion
		//#region node_modules/.pnpm/zod@4.5.4/node_modules/zod/v4/classic/schemas.js
		function _ensureDefaultLocale() {
			if (!globalConfig.localeError) config(en_default());
		}
		function _ensureDefaultMemoizer() {
			if (!globalConfig.memoizer) config({ memoizer: memoizer() });
		}
		const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
			_ensureDefaultLocale();
			$ZodType.init(inst, def);
			inst.def = def;
			inst.type = def.type;
			return inst;
		}, {
			check(...chks) {
				const def = this.def;
				return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
					check: ch,
					def: { check: "custom" },
					onattach: []
				} } : ch)] }), { parent: true });
			},
			with(...chks) {
				return this.check(...chks);
			},
			clone(def, params) {
				return clone(this, def, params);
			},
			brand() {
				return this;
			},
			register(reg, meta) {
				reg.add(this, meta);
				return this;
			},
			refine(check, params) {
				return this.check(refine(check, params));
			},
			superRefine(refinement, params) {
				return this.check(superRefine(refinement, params));
			},
			overwrite(fn) {
				return this.check(/* @__PURE__ */ _overwrite(fn));
			},
			optional() {
				return optional(this);
			},
			exactOptional() {
				return exactOptional(this);
			},
			nullable() {
				return nullable(this);
			},
			nullish() {
				return optional(nullable(this));
			},
			nonoptional(params) {
				return nonoptional(this, params);
			},
			array() {
				return array(this);
			},
			or(arg) {
				return union([this, arg]);
			},
			and(arg) {
				return intersection(this, arg);
			},
			transform(tx) {
				return pipe(this, transform(tx));
			},
			default(d) {
				return _default(this, d);
			},
			prefault(d) {
				return prefault(this, d);
			},
			catch(params) {
				return _catch(this, params);
			},
			pipe(target) {
				return pipe(this, target);
			},
			readonly() {
				return readonly(this);
			},
			describe(description) {
				const cl = this.clone();
				globalRegistry.add(cl, { description });
				return cl;
			},
			meta(...args) {
				if (args.length === 0) return globalRegistry.get(this);
				const cl = this.clone();
				globalRegistry.add(cl, args[0]);
				return cl;
			},
			isOptional() {
				return this.safeParse(void 0).success;
			},
			isNullable() {
				return this.safeParse(null).success;
			},
			apply(fn, ...args) {
				return args.length === 0 ? fn(this) : fn(this, ...args);
			},
			get "~standard"() {
				return hide(this, "~standard", {
					...standardProps(this),
					jsonSchema: {
						input: createStandardJSONSchemaMethod(this, "input"),
						output: createStandardJSONSchemaMethod(this, "output")
					}
				});
			},
			set "~standard"(value) {
				own(this, "~standard", value);
			},
			parse: function _parse(data, params) {
				return parse(this, data, params, { callee: _parse });
			},
			parseAsync: async function _parseAsync(data, params) {
				return await parseAsync(this, data, params, { callee: _parseAsync });
			},
			safeParse(data, params) {
				return safeParse(this, data, params);
			},
			async safeParseAsync(data, params) {
				return safeParseAsync(this, data, params);
			},
			get spa() {
				return this?.safeParseAsync;
			},
			set spa(value) {
				own(this, "spa", value);
			},
			encode: function _encode(data, params) {
				return encode(this, data, params, { callee: _encode });
			},
			decode: function _decode(data, params) {
				return decode(this, data, params, { callee: _decode });
			},
			encodeAsync: async function _encodeAsync(data, params) {
				return await encodeAsync(this, data, params, { callee: _encodeAsync });
			},
			decodeAsync: async function _decodeAsync(data, params) {
				return await decodeAsync(this, data, params, { callee: _decodeAsync });
			},
			safeEncode(data, params) {
				return safeEncode(this, data, params);
			},
			safeDecode(data, params) {
				return safeDecode(this, data, params);
			},
			async safeEncodeAsync(data, params) {
				return safeEncodeAsync(this, data, params);
			},
			async safeDecodeAsync(data, params) {
				return safeDecodeAsync(this, data, params);
			},
			toJSONSchema(params) {
				return createToJSONSchemaMethod(this, {})(params);
			},
			get description() {
				return globalRegistry.get(this)?.description;
			},
			get _def() {
				return this._zod.def;
			}
		});
		/** @internal */
		const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
			const bag = inst._zod.bag;
			inst.format = bag.format ?? null;
			inst.minLength = bag.minimum ?? null;
			inst.maxLength = bag.maximum ?? null;
		}, {
			regex(...args) {
				return this.check(/* @__PURE__ */ _regex(...args));
			},
			includes(...args) {
				return this.check(/* @__PURE__ */ _includes(...args));
			},
			startsWith(...args) {
				return this.check(/* @__PURE__ */ _startsWith(...args));
			},
			endsWith(...args) {
				return this.check(/* @__PURE__ */ _endsWith(...args));
			},
			min(...args) {
				return this.check(/* @__PURE__ */ _minLength(...args));
			},
			max(...args) {
				return this.check(/* @__PURE__ */ _maxLength(...args));
			},
			length(...args) {
				return this.check(/* @__PURE__ */ _length(...args));
			},
			nonempty(...args) {
				return this.check(/* @__PURE__ */ _minLength(1, ...args));
			},
			lowercase(params) {
				return this.check(/* @__PURE__ */ _lowercase(params));
			},
			uppercase(params) {
				return this.check(/* @__PURE__ */ _uppercase(params));
			},
			trim() {
				return this.check(/* @__PURE__ */ _trim());
			},
			normalize(...args) {
				return this.check(/* @__PURE__ */ _normalize(...args));
			},
			toLowerCase() {
				return this.check(/* @__PURE__ */ _toLowerCase());
			},
			toUpperCase() {
				return this.check(/* @__PURE__ */ _toUpperCase());
			},
			slugify() {
				return this.check(/* @__PURE__ */ _slugify());
			}
		});
		const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			_ZodString.init(inst, def);
		}, {
			email(params) {
				return this.check(/* @__PURE__ */ _email(ZodEmail, params));
			},
			url(params) {
				return this.check(/* @__PURE__ */ _url(ZodURL, params));
			},
			jwt(params) {
				return this.check(/* @__PURE__ */ _jwt(ZodJWT, params));
			},
			emoji(params) {
				return this.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
			},
			guid(params) {
				return this.check(/* @__PURE__ */ _guid(ZodGUID, params));
			},
			uuid(params) {
				return this.check(/* @__PURE__ */ _uuid(ZodUUID, params));
			},
			uuidv4(params) {
				return this.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
			},
			uuidv6(params) {
				return this.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
			},
			uuidv7(params) {
				return this.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
			},
			nanoid(params) {
				return this.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
			},
			cuid(params) {
				return this.check(/* @__PURE__ */ _cuid(ZodCUID, params));
			},
			cuid2(params) {
				return this.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
			},
			ulid(params) {
				return this.check(/* @__PURE__ */ _ulid(ZodULID, params));
			},
			base64(params) {
				return this.check(/* @__PURE__ */ _base64(ZodBase64, params));
			},
			base64url(params) {
				return this.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
			},
			xid(params) {
				return this.check(/* @__PURE__ */ _xid(ZodXID, params));
			},
			ksuid(params) {
				return this.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
			},
			ipv4(params) {
				return this.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
			},
			ipv6(params) {
				return this.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
			},
			cidrv4(params) {
				return this.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
			},
			cidrv6(params) {
				return this.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
			},
			e164(params) {
				return this.check(/* @__PURE__ */ _e164(ZodE164, params));
			},
			datetime(params) {
				return this.check(/* @__PURE__ */ _isoDateTime(ZodISODateTime, params));
			},
			date(params) {
				return this.check(/* @__PURE__ */ _isoDate(ZodISODate, params));
			},
			time(params) {
				return this.check(/* @__PURE__ */ _isoTime(ZodISOTime, params));
			},
			duration(params) {
				return this.check(/* @__PURE__ */ _isoDuration(ZodISODuration, params));
			}
		});
		function string(params) {
			return /* @__PURE__ */ _string(ZodString, params);
		}
		const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			_ZodString.init(inst, def);
		});
		const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
			$ZodISODateTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
			$ZodISODate.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
			$ZodISOTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
			$ZodISODuration.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
			$ZodEmail.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
			$ZodGUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
			$ZodUUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
			$ZodURL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
			$ZodEmoji.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
			$ZodNanoID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
			$ZodCUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
			$ZodCUID2.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
			$ZodULID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
			$ZodXID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
			$ZodKSUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
			$ZodIPv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
			$ZodIPv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
			$ZodCIDRv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
			$ZodCIDRv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
			$ZodBase64.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
			$ZodBase64URL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
			$ZodE164.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
			$ZodJWT.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
			$ZodNumber.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
			const bag = inst._zod.bag;
			inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
			inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
			inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
			inst.isFinite = true;
			inst.format = bag.format ?? null;
		}, {
			gt(value, params) {
				return this.check(/* @__PURE__ */ _gt(value, params));
			},
			gte(value, params) {
				return this.check(/* @__PURE__ */ _gte(value, params));
			},
			min(value, params) {
				return this.check(/* @__PURE__ */ _gte(value, params));
			},
			lt(value, params) {
				return this.check(/* @__PURE__ */ _lt(value, params));
			},
			lte(value, params) {
				return this.check(/* @__PURE__ */ _lte(value, params));
			},
			max(value, params) {
				return this.check(/* @__PURE__ */ _lte(value, params));
			},
			int(params) {
				return this.check(int(params));
			},
			safe(params) {
				return this.check(int(params));
			},
			positive(params) {
				return this.check(/* @__PURE__ */ _gt(0, params));
			},
			nonnegative(params) {
				return this.check(/* @__PURE__ */ _gte(0, params));
			},
			negative(params) {
				return this.check(/* @__PURE__ */ _lt(0, params));
			},
			nonpositive(params) {
				return this.check(/* @__PURE__ */ _lte(0, params));
			},
			multipleOf(value, params) {
				return this.check(/* @__PURE__ */ _multipleOf(value, params));
			},
			step(value, params) {
				return this.check(/* @__PURE__ */ _multipleOf(value, params));
			},
			finite() {
				return this;
			}
		});
		function number(params) {
			return /* @__PURE__ */ _number(ZodNumber, params);
		}
		const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
			$ZodNumberFormat.init(inst, def);
			ZodNumber.init(inst, def);
		});
		function int(params) {
			return /* @__PURE__ */ _int(ZodNumberFormat, params);
		}
		const ZodBoolean = /*@__PURE__*/ $constructor("ZodBoolean", (inst, def) => {
			$ZodBoolean.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
		});
		function boolean(params) {
			return /* @__PURE__ */ _boolean(ZodBoolean, params);
		}
		const ZodUndefined = /*@__PURE__*/ $constructor("ZodUndefined", (inst, def) => {
			$ZodUndefined.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => undefinedProcessor(inst, ctx, json, params);
		});
		function _undefined(params) {
			return /* @__PURE__ */ _undefined$1(ZodUndefined, params);
		}
		const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
			$ZodUnknown.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => void 0;
		});
		function unknown() {
			return /* @__PURE__ */ _unknown(ZodUnknown);
		}
		const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
			$ZodNever.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
		});
		function never(params) {
			return /* @__PURE__ */ _never(ZodNever, params);
		}
		const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
			_ensureDefaultMemoizer();
			$ZodArray.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
			inst.element = def.element;
		}, {
			min(n, params) {
				return this.check(/* @__PURE__ */ _minLength(n, params));
			},
			nonempty(params) {
				return this.check(/* @__PURE__ */ _minLength(1, params));
			},
			max(n, params) {
				return this.check(/* @__PURE__ */ _maxLength(n, params));
			},
			length(n, params) {
				return this.check(/* @__PURE__ */ _length(n, params));
			},
			unwrap() {
				return this.element;
			}
		});
		function array(element, params) {
			return /* @__PURE__ */ _array(ZodArray, element, params);
		}
		const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
			_ensureDefaultMemoizer();
			$ZodObjectJIT.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
			installLazyProp(inst, "shape", (self) => self._zod.def.shape, false);
		}, {
			keyof() {
				return _enum(Object.keys(this._zod.def.shape));
			},
			catchall(catchall) {
				return this.clone({
					...this._zod.def,
					catchall
				});
			},
			passthrough() {
				return this.clone({
					...this._zod.def,
					catchall: unknown()
				});
			},
			loose() {
				return this.clone({
					...this._zod.def,
					catchall: unknown()
				});
			},
			strict() {
				return this.clone({
					...this._zod.def,
					catchall: never()
				});
			},
			strip() {
				return this.clone({
					...this._zod.def,
					catchall: void 0
				});
			},
			extend(incoming) {
				return extend(this, incoming);
			},
			safeExtend(incoming) {
				return safeExtend(this, incoming);
			},
			merge(other) {
				return merge(this, other);
			},
			pick(mask) {
				return pick(this, mask);
			},
			omit(mask) {
				return omit(this, mask);
			},
			partial(...args) {
				return partial(ZodOptional, this, args[0]);
			},
			exactPartial(...args) {
				return partial(ZodExactOptional, this, args[0], "exactPartial");
			},
			required(...args) {
				return required(ZodNonOptional, this, args[0]);
			}
		});
		function object(shape, params) {
			const def = {
				type: "object",
				shape: shape ?? {},
				...normalizeParams(params)
			};
			return new ZodObject(def);
		}
		const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
			$ZodUnion.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
			inst.options = def.options;
		});
		function union(options, params) {
			return new ZodUnion({
				type: "union",
				options,
				...normalizeParams(params)
			});
		}
		const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
			$ZodIntersection.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
		});
		function intersection(left, right) {
			return new ZodIntersection({
				type: "intersection",
				left,
				right
			});
		}
		const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
			$ZodEnum.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
			inst.enum = def.entries;
			inst.options = Object.values(def.entries);
			const keys = new Set(Object.keys(def.entries));
			inst.extract = (values, params) => {
				const newEntries = {};
				for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
			inst.exclude = (values, params) => {
				const newEntries = { ...def.entries };
				for (const value of values) if (keys.has(value)) delete newEntries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
		});
		function _enum(values, params) {
			const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
			return new ZodEnum({
				type: "enum",
				entries,
				...normalizeParams(params)
			});
		}
		const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
			_ensureDefaultMemoizer();
			$ZodTransform.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
			inst._zod.parse = (payload, _ctx) => {
				if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				payload.addIssue = (issue$1) => {
					if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
					else {
						const _issue = issue$1;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						if (!("input" in _issue)) _issue.input = payload.value;
						_issue.inst ?? (_issue.inst = inst);
						payload.issues.push(issue(_issue));
					}
				};
				const output = def.transform(payload.value, payload);
				if (output instanceof Promise) return output.then((output) => {
					payload.value = output;
					return payload;
				});
				payload.value = output;
				return payload;
			};
		});
		function transform(fn) {
			return new ZodTransform({
				type: "transform",
				transform: fn
			});
		}
		const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function optional(innerType) {
			return new ZodOptional({
				type: "optional",
				innerType
			});
		}
		const ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
			$ZodExactOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function exactOptional(innerType) {
			return new ZodExactOptional({
				type: "optional",
				innerType
			});
		}
		const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
			$ZodNullable.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nullable(innerType) {
			return new ZodNullable({
				type: "nullable",
				innerType
			});
		}
		const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
			$ZodDefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeDefault = inst.unwrap;
		});
		function _default(innerType, defaultValue) {
			return new ZodDefault({
				type: "default",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
			$ZodPrefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function prefault(innerType, defaultValue) {
			return new ZodPrefault({
				type: "prefault",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
			$ZodNonOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nonoptional(innerType, params) {
			return new ZodNonOptional({
				type: "nonoptional",
				innerType,
				...normalizeParams(params)
			});
		}
		const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
			$ZodCatch.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeCatch = inst.unwrap;
		});
		function _catch(innerType, catchValue) {
			return new ZodCatch({
				type: "catch",
				innerType,
				catchValue: typeof catchValue === "function" ? catchValue : constantCatch(catchValue)
			});
		}
		const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
			$ZodPipe.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
			inst.in = def.in;
			inst.out = def.out;
		});
		function pipe(in_, out) {
			return new ZodPipe({
				type: "pipe",
				in: in_,
				out
			});
		}
		const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
			$ZodReadonly.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function readonly(innerType) {
			return new ZodReadonly({
				type: "readonly",
				innerType
			});
		}
		const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
			$ZodCustom.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
		});
		function refine(fn, _params = {}) {
			return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
		}
		function superRefine(fn, params) {
			return /* @__PURE__ */ _superRefine(fn, params);
		}
		//#endregion
		//#region lib/typert.remote-client.js
		const _lovstudio_dsh_plugin_marketplace_pluginMarketGithub_listStarred_result$schema = object({
			"fullNames": array(string()).readonly(),
			"truncated": boolean().readonly()
		});
		const _lovstudio_dsh_plugin_marketplace_pluginMarketGithub_probeCredential_parameter_0$schema = object({ "token": union([_undefined(), string()]).readonly().optional() });
		const _lovstudio_dsh_plugin_marketplace_pluginMarketGithub_probeCredential_result$schema = object({
			"login": string().readonly(),
			"rateLimitRemaining": number().readonly(),
			"scopes": array(string()).readonly(),
			"canStar": boolean().readonly()
		});
		const _lovstudio_dsh_plugin_marketplace_pluginMarketGithub_resolvePackage_parameter_0$schema = object({ "fullName": string().readonly() });
		const _lovstudio_dsh_plugin_marketplace_pluginMarketGithub_resolvePackage_result$schema = object({
			"pkgName": union([_undefined(), string()]).readonly().optional(),
			"pkgVersion": union([_undefined(), string()]).readonly().optional(),
			"npmPublished": boolean().readonly()
		});
		const _lovstudio_dsh_plugin_marketplace_pluginMarketGithub_search_parameter_0$schema = object({
			"pushedFrom": string().readonly(),
			"pushedTo": string().readonly(),
			"page": number().readonly(),
			"perPage": number().readonly()
		});
		const _lovstudio_dsh_plugin_marketplace_pluginMarketGithub_search_result$schema = object({
			"total": number().readonly(),
			"incomplete": boolean().readonly(),
			"items": array(object({
				"id": number().readonly(),
				"fullName": string().readonly(),
				"name": string().readonly(),
				"owner": string().readonly(),
				"repositoryUrl": string().readonly(),
				"description": string().readonly(),
				"topics": array(string()).readonly(),
				"language": union([_undefined(), string()]).readonly().optional(),
				"stars": number().readonly(),
				"pushedAt": string().readonly(),
				"archived": boolean().readonly()
			})).readonly(),
			"rateLimitRemaining": number().readonly(),
			"rateLimitResetAt": number().readonly()
		});
		const _lovstudio_dsh_plugin_marketplace_pluginMarketGithub_setStar_parameter_0$schema = object({
			"fullName": string().readonly(),
			"starred": boolean().readonly()
		});
		const _lovstudio_dsh_plugin_marketplace_pluginMarketGithub_setStar_result$schema = object({
			"fullName": string(),
			"starred": boolean()
		});
		const TYPERT_REMOTE = {
			package: "@lovstudio/dsh-plugin-marketplace",
			descriptors: [
				{
					id: "@lovstudio/dsh-plugin-marketplace#pluginMarketGithub/listStarred",
					service: "pluginMarketGithub",
					namespace: "pluginMarketGithub",
					method: "listStarred",
					invocation: { kind: "direct" },
					parameters: [],
					result: {
						mode: "strict",
						typeSymbol: "@lovstudio/dsh-plugin-marketplace/host#GitHubMarketStarredResult",
						schema: _lovstudio_dsh_plugin_marketplace_pluginMarketGithub_listStarred_result$schema
					},
					sourceLocation: {
						"file": "packages/plugin-marketplace/src/host/index.ts",
						"line": 192,
						"column": 9
					}
				},
				{
					id: "@lovstudio/dsh-plugin-marketplace#pluginMarketGithub/probeCredential",
					service: "pluginMarketGithub",
					namespace: "pluginMarketGithub",
					method: "probeCredential",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@lovstudio/dsh-plugin-marketplace/host#GitHubMarketCredentialProbeRequest",
							schema: _lovstudio_dsh_plugin_marketplace_pluginMarketGithub_probeCredential_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@lovstudio/dsh-plugin-marketplace/host#GitHubMarketCredentialProbeResult",
						schema: _lovstudio_dsh_plugin_marketplace_pluginMarketGithub_probeCredential_result$schema
					},
					sourceLocation: {
						"file": "packages/plugin-marketplace/src/host/index.ts",
						"line": 121,
						"column": 9
					}
				},
				{
					id: "@lovstudio/dsh-plugin-marketplace#pluginMarketGithub/resolvePackage",
					service: "pluginMarketGithub",
					namespace: "pluginMarketGithub",
					method: "resolvePackage",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@lovstudio/dsh-plugin-marketplace/host#GitHubMarketPackageRequest",
							schema: _lovstudio_dsh_plugin_marketplace_pluginMarketGithub_resolvePackage_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@lovstudio/dsh-plugin-marketplace/host#GitHubMarketPackageResult",
						schema: _lovstudio_dsh_plugin_marketplace_pluginMarketGithub_resolvePackage_result$schema
					},
					sourceLocation: {
						"file": "packages/plugin-marketplace/src/host/index.ts",
						"line": 161,
						"column": 9
					}
				},
				{
					id: "@lovstudio/dsh-plugin-marketplace#pluginMarketGithub/search",
					service: "pluginMarketGithub",
					namespace: "pluginMarketGithub",
					method: "search",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@lovstudio/dsh-plugin-marketplace/host#GitHubMarketSearchRequest",
							schema: _lovstudio_dsh_plugin_marketplace_pluginMarketGithub_search_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@lovstudio/dsh-plugin-marketplace/host#GitHubMarketSearchPage",
						schema: _lovstudio_dsh_plugin_marketplace_pluginMarketGithub_search_result$schema
					},
					sourceLocation: {
						"file": "packages/plugin-marketplace/src/host/index.ts",
						"line": 239,
						"column": 9
					}
				},
				{
					id: "@lovstudio/dsh-plugin-marketplace#pluginMarketGithub/setStar",
					service: "pluginMarketGithub",
					namespace: "pluginMarketGithub",
					method: "setStar",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "@lovstudio/dsh-plugin-marketplace/host#GitHubMarketStarRequest",
							schema: _lovstudio_dsh_plugin_marketplace_pluginMarketGithub_setStar_parameter_0$schema
						}
					}],
					result: {
						mode: "strict",
						typeSymbol: "@lovstudio/dsh-plugin-marketplace#pluginMarketGithub/setStar:result",
						schema: _lovstudio_dsh_plugin_marketplace_pluginMarketGithub_setStar_result$schema
					},
					sourceLocation: {
						"file": "packages/plugin-marketplace/src/host/index.ts",
						"line": 216,
						"column": 9
					}
				}
			]
		};
		//#endregion
		//#region src/client/market-cache.ts
		/** IndexedDB persistence for complete catalogs and provider crawl checkpoints. */
		const DATABASE_NAME = "dsh-plugin-market";
		const DATABASE_VERSION = 1;
		const STORE_NAME = "catalogs";
		const browserGlobals = globalThis;
		/** Resolve an IndexedDB request as a promise. */
		function requestResult(request) {
			return new Promise((resolve, reject) => {
				request.onsuccess = () => {
					resolve(request.result);
				};
				request.onerror = () => {
					reject(request.error ?? /* @__PURE__ */ new Error("IndexedDB request failed"));
				};
			});
		}
		/** Open the marketplace cache and create its single object store on first use. */
		function openDatabase(factory) {
			const request = factory.open(DATABASE_NAME, DATABASE_VERSION);
			request.onupgradeneeded = () => {
				if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME);
			};
			return requestResult(request);
		}
		/** Wait for one IndexedDB transaction to commit. */
		function transactionDone(transaction) {
			return new Promise((resolve, reject) => {
				transaction.oncomplete = () => {
					resolve();
				};
				transaction.onabort = () => {
					reject(transaction.error ?? /* @__PURE__ */ new Error("IndexedDB transaction aborted"));
				};
				transaction.onerror = () => {
					reject(transaction.error ?? /* @__PURE__ */ new Error("IndexedDB transaction failed"));
				};
			});
		}
		/**
		* Create a cache scoped to one normalized catalog base URL.
		*
		* @param key - normalized catalog base URL.
		* @param factory - browser IndexedDB implementation.
		* @returns the persistent catalog cache.
		*/
		function createMarketCatalogCache(key, factory = browserGlobals.indexedDB ?? null) {
			return {
				async load() {
					if (factory === null) return null;
					const database = await openDatabase(factory);
					try {
						return await requestResult(database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(key)) ?? null;
					} finally {
						database.close();
					}
				},
				async save(value) {
					if (factory === null) throw new Error("IndexedDB is unavailable");
					const database = await openDatabase(factory);
					try {
						const transaction = database.transaction(STORE_NAME, "readwrite");
						transaction.objectStore(STORE_NAME).put(value, key);
						await transactionDone(transaction);
					} finally {
						database.close();
					}
				}
			};
		}
		/** Complete local-catalog window used by each token projection. */
		const SEARCH_TERM_FETCH_SIZE = Number.MAX_SAFE_INTEGER;
		/**
		* Compare two catalog rows by the active toolbar ordering.
		* @param a - the first catalog row.
		* @param b - the second catalog row.
		* @param sort - the selected catalog metric.
		* @param order - the selected direction.
		* @returns a value suitable for `Array.prototype.sort`.
		*/
		function compareMarketPlugins(a, b, sort, order) {
			let result;
			if (sort === "name") result = a.name.localeCompare(b.name);
			else if (sort === "updated") result = Date.parse(a.pushedAt ?? "") - Date.parse(b.pushedAt ?? "");
			else if (sort === "score") result = (a.score ?? 0) - (b.score ?? 0);
			else result = a.stars - b.stars;
			if (!Number.isFinite(result)) result = 0;
			if (result === 0) result = a.fullName.localeCompare(b.fullName);
			return order === "asc" ? result : -result;
		}
		const FIELD_FILTERS = /* @__PURE__ */ new Map([
			["category", "category"],
			["owner", "owner"],
			["author", "owner"],
			["language", "language"],
			["lang", "language"],
			["grade", "grade"],
			["tag", "tag"]
		]);
		/** Whether a character starts a quoted phrase token. */
		function isQuote(char) {
			return char === "\"" || char === "“" || char === "”";
		}
		/**
		* Tokenize a query on whitespace, keeping double-quoted phrases together.
		* @param text - the raw search input.
		* @returns raw tokens; quote characters stay on their token.
		*/
		function tokenizeQuery(text) {
			const tokens = [];
			let current = "";
			let inQuote = false;
			for (const char of text) {
				if (isQuote(char)) {
					inQuote = !inQuote;
					current += char;
					continue;
				}
				if (/\s/.test(char) && !inQuote) {
					if (current.length > 0) {
						tokens.push(current);
						current = "";
					}
					continue;
				}
				current += char;
			}
			if (current.length > 0) tokens.push(current);
			return tokens;
		}
		/** Strip one level of matching quote characters from a token. */
		function stripQuotes(token) {
			if (token.length >= 2 && isQuote(token[0]) && isQuote(token[token.length - 1])) return token.slice(1, -1);
			return token;
		}
		/** Whether a token is a bare `field:value` filter (no quotes, known field). */
		function parseFieldToken(token) {
			const colon = token.indexOf(":");
			if (colon <= 0) return null;
			const field = token.slice(0, colon).toLocaleLowerCase();
			const value = token.slice(colon + 1);
			if (value.length === 0) return null;
			const mapped = FIELD_FILTERS.get(field);
			if (mapped === void 0) return null;
			return {
				field: mapped,
				value
			};
		}
		/**
		* Parse a numeric comparison (`stars:>=100`, `score:<60`, `stars:50`).
		* @param raw - the comparison text after the colon.
		* @returns the operator and numeric value, or null when not a number.
		*/
		function parseComparison(raw) {
			const match = /^(?<op><=|>=|<|>|=)?(?<num>\d+)$/.exec(raw.trim());
			if (match?.groups === void 0) return null;
			return {
				operator: match.groups.op ?? "=",
				value: Number(match.groups.num)
			};
		}
		/**
		* Parse a raw search input into the constraint set and implied requests.
		* Supports the Google-style subset: bare terms (AND), `A OR B`, `-exclude`,
		* `"exact phrase"`, `field:value` filters (category/owner/author/language/
		* lang/grade/tag), and numeric `stars:`/`score:` comparisons.
		* @param text - the raw search input.
		* @returns the parsed query.
		*/
		function parseMarketQuery(text) {
			const tokens = tokenizeQuery(text);
			const positive = /* @__PURE__ */ new Set();
			const terms = [];
			const orGroups = [];
			const phrases = [];
			const excluded = [];
			const apiFilters = {};
			let starsMin;
			let starsMax;
			let scoreMax;
			const addTerm = (term) => {
				if (term.length > 0) terms.push(term);
			};
			let pendingOr = null;
			for (const token of tokens) {
				const quoted = token.startsWith("\"") || token.startsWith("“");
				const excludedToken = token.startsWith("-");
				if (token.toLocaleUpperCase() === "OR") {
					pendingOr = "or";
					continue;
				}
				const body = stripQuotes(excludedToken ? token.slice(1) : token).trim().toLocaleLowerCase();
				if (body.length === 0) continue;
				if (excludedToken) {
					excluded.push(body);
					continue;
				}
				if (quoted) {
					phrases.push(body);
					positive.add(body);
					continue;
				}
				const field = parseFieldToken(body);
				if (field !== null) {
					apiFilters[field.field] = field.value;
					continue;
				}
				const numeric = /^(stars|score):/.exec(body);
				if (numeric !== null) {
					const field = numeric[0].endsWith(":") ? numeric[0].slice(0, -1) : "stars";
					const comparison = parseComparison(body.slice(numeric[0].length));
					if (comparison !== null) {
						const apply = (value) => {
							if (field === "stars") {
								if (comparison.operator === ">=") starsMin = Math.max(starsMin ?? 0, value);
								else if (comparison.operator === ">") starsMin = Math.max(starsMin ?? 0, value + 1);
								else if (comparison.operator === "<=") starsMax = Math.min(starsMax ?? Infinity, value);
								else if (comparison.operator === "<") starsMax = Math.min(starsMax ?? Infinity, value - 1);
								else {
									starsMin = Math.max(starsMin ?? 0, value);
									starsMax = Math.min(starsMax ?? Infinity, value);
								}
							} else if (comparison.operator === ">=" || comparison.operator === ">") apiFilters.minScore = Math.max(apiFilters.minScore ?? 0, value + (comparison.operator === ">" ? 1 : 0));
							else if (comparison.operator === "<=" || comparison.operator === "<") scoreMax = Math.min(scoreMax ?? Infinity, value - (comparison.operator === "<" ? 1 : 0));
							else {
								apiFilters.minScore = value;
								scoreMax = value;
							}
						};
						apply(comparison.value);
					}
					continue;
				}
				if (pendingOr === "or") {
					const group = orGroups[orGroups.length - 1];
					if (group === void 0) {
						const previous = terms.pop();
						orGroups.push(previous === void 0 ? [body] : [previous, body]);
					} else group.push(body);
					pendingOr = null;
					positive.add(body);
					continue;
				}
				addTerm(body);
				positive.add(body);
				pendingOr = null;
			}
			const result = {
				positive: [...positive],
				andTerms: [...new Set(terms)],
				orGroups: orGroups.filter((group) => group.length > 0),
				phrases: [...new Set(phrases)],
				excluded,
				apiFilters,
				hasPositive: positive.size > 0
			};
			if (starsMin !== void 0) result.starsMin = starsMin;
			if (starsMax !== void 0) result.starsMax = starsMax;
			if (scoreMax !== void 0) result.scoreMax = scoreMax;
			return result;
		}
		/** The lowercase searchable haystack of one plugin row. */
		function haystack(plugin) {
			return [
				plugin.name,
				plugin.owner,
				plugin.description,
				...plugin.tags
			].join(" ").toLocaleLowerCase();
		}
		/**
		* Whether a bare term matches a plugin row (case-insensitive substring over
		* the haystack).
		* @param plugin - the candidate row.
		* @param term - the term to look for.
		* @returns whether the haystack contains the term.
		*/
		function matchesTerm(plugin, term) {
			return haystack(plugin).includes(term.toLocaleLowerCase());
		}
		/**
		* Whether an exact phrase appears verbatim in the haystack.
		* @param plugin - the candidate row.
		* @param phrase - the lowercase phrase to look for.
		* @returns whether the haystack contains the phrase.
		*/
		function matchesPhrase(plugin, phrase) {
			return haystack(plugin).includes(phrase.toLocaleLowerCase());
		}
		/** Whether the local numeric gates admit a plugin row. */
		function passesNumericGates(plugin, parsed) {
			if (parsed.starsMin !== void 0 && plugin.stars < parsed.starsMin) return false;
			if (parsed.starsMax !== void 0 && plugin.stars > parsed.starsMax) return false;
			const score = plugin.score ?? 0;
			if (parsed.scoreMax !== void 0 && score > parsed.scoreMax) return false;
			return true;
		}
		/**
		* Whether a plugin row satisfies every parsed constraint. Exclusions win over
		* everything; AND terms must all match; each OR group needs at least one
		* member; phrases must appear verbatim.
		* @param plugin - the candidate row.
		* @param parsed - the parsed query.
		* @returns whether the row passes the full gate set.
		*/
		function accepts(plugin, parsed) {
			if (parsed.excluded.some((term) => matchesTerm(plugin, term))) return false;
			if (!parsed.andTerms.every((term) => matchesTerm(plugin, term))) return false;
			if (!parsed.orGroups.every((group) => group.some((term) => matchesTerm(plugin, term)))) return false;
			if (!parsed.phrases.every((phrase) => matchesPhrase(plugin, phrase))) return false;
			return passesNumericGates(plugin, parsed);
		}
		/** Match-quality bonus (0-3) of one unit against one row. */
		function unitBonus(plugin, unit) {
			const needle = unit.toLocaleLowerCase();
			const name = plugin.name.toLocaleLowerCase();
			const owner = plugin.owner.toLocaleLowerCase();
			const description = plugin.description.toLocaleLowerCase();
			const tags = plugin.tags.map((tag) => tag.toLocaleLowerCase());
			let bonus = 0;
			if (name.includes(needle) || owner.includes(needle)) bonus += 3;
			if (tags.some((tag) => tag.includes(needle))) bonus += 2;
			if (description.includes(needle)) bonus += 1;
			return Math.min(3, bonus);
		}
		/**
		* Positive constraint units (AND terms + phrases; OR groups count per group).
		* @param parsed - the parsed query.
		* @returns the member units of the query.
		*/
		function positiveUnits(parsed) {
			return [...parsed.andTerms, ...parsed.phrases];
		}
		/**
		* Rank one candidate for a parsed query: term coverage dominates, then match
		* quality, then the catalog's own quality score, then star count. An OR group
		* counts as one covered unit when any member matches.
		* @param plugin - the candidate row.
		* @param parsed - the parsed query.
		* @returns the rank; higher is better.
		*/
		function rankPlugin(plugin, parsed) {
			const andUnits = positiveUnits(parsed);
			const groups = parsed.orGroups;
			if (andUnits.length === 0 && groups.length === 0) return plugin.score ?? 0;
			let covered = 0;
			let bonus = 0;
			for (const unit of andUnits) if (matchesTerm(plugin, unit)) {
				covered += 1;
				bonus += unitBonus(plugin, unit);
			}
			for (const group of groups) {
				const best = Math.max(...group.map((term) => matchesTerm(plugin, term) ? unitBonus(plugin, term) : 0));
				if (best > 0) {
					covered += 1;
					bonus += best;
				}
			}
			const total = andUnits.length + groups.length;
			const coverage = covered / total;
			const quality = bonus / (total * 3);
			const starsFactor = Math.min(10, Math.log2(plugin.stars + 1));
			return coverage * 1e3 + quality * 100 + (plugin.score ?? 0) + starsFactor;
		}
		/**
		* Merge per-token pages into one deduplicated, gate-filtered, relevance-ranked
		* list. Rows keep the first catalog page they appear in; ties break by stars
		* then name.
		* @param pages - one page per requested token (or the single browse page).
		* @param parsed - the parsed query whose gates filter the merge.
		* @param limit - maximum rows to return.
		* @returns the ranked slice and the total that passed the gates.
		*/
		function mergeAndRank(pages, parsed, limit) {
			const seen = /* @__PURE__ */ new Set();
			const candidates = [];
			for (const page of pages) for (const plugin of page) {
				if (seen.has(plugin.fullName)) continue;
				seen.add(plugin.fullName);
				if (accepts(plugin, parsed)) candidates.push(plugin);
			}
			candidates.sort((a, b) => {
				const byRank = rankPlugin(b, parsed) - rankPlugin(a, parsed);
				if (byRank !== 0) return byRank;
				const byStars = b.stars - a.stars;
				if (byStars !== 0) return byStars;
				return a.name.localeCompare(b.name);
			});
			return {
				items: candidates.slice(0, limit),
				total: candidates.length
			};
		}
		/**
		* Decide the local projection plan for a parsed query: one bounded entry per
		* positive term, or an empty list for an unqualified browse.
		* @param parsed - the parsed query.
		* @returns the per-request keywords; an empty list means one browse request.
		*/
		function planSearch(parsed) {
			if (!parsed.hasPositive) return [];
			return parsed.positive.slice(0, 4);
		}
		//#endregion
		//#region src/client/api.ts
		/**
		* Local-first client for the dshfind plugin catalog. Only `refresh()` reads
		* the public cloud API; list, detail, suggestion, and facet operations query
		* the last complete IndexedDB snapshot after validating its durable payload.
		*/
		/** Default catalog base URL (production environment of the published contract). */
		const DEFAULT_MARKET_BASE_URL = "https://api.dshfind.com";
		const EMPTY_CATALOG = { items: [] };
		/** One validated plugin row (unknowns dropped, required fields enforced). */
		function parsePlugin(raw) {
			const record = raw ?? {};
			const tags = Array.isArray(record.tags) ? record.tags.filter((tag) => typeof tag === "string") : [];
			const summary = {
				fullName: typeof record.full_name === "string" ? record.full_name : "",
				name: typeof record.name === "string" ? record.name : "",
				owner: typeof record.owner === "string" ? record.owner : "",
				repositoryUrl: typeof record.repository_url === "string" ? record.repository_url : "",
				description: typeof record.description === "string" ? record.description : "",
				tags,
				stars: typeof record.stars === "number" ? record.stars : 0,
				archived: record.archived === true,
				isFeatured: record.is_featured === true,
				isOfficial: record.is_official === true,
				isInsider: record.is_insider === true,
				isRisky: record.is_risky === true,
				isPlugin: record.is_plugin === true
			};
			if (typeof record.language === "string") summary.language = record.language;
			if (typeof record.contributors === "number") summary.contributors = record.contributors;
			if (typeof record.pushed_at === "string") summary.pushedAt = record.pushed_at;
			if (typeof record.category === "string") summary.category = record.category;
			if (typeof record.score === "number") summary.score = record.score;
			if (record.grade === "S" || record.grade === "A" || record.grade === "B" || record.grade === "C") summary.grade = record.grade;
			if (typeof record.risk_note === "string") summary.riskNote = record.risk_note;
			const install = typeof record.install === "object" && record.install !== null ? record.install : typeof record._github_id === "number" && summary.fullName.length > 0 ? githubInstallInfo(summary.fullName) : void 0;
			if (install !== void 0) {
				const parsed = {};
				if (typeof install.cmd === "string") parsed.cmd = install.cmd;
				if (typeof install.kind === "string") parsed.kind = install.kind;
				if (typeof install.pkg_name === "string") parsed.pkgName = install.pkg_name;
				if (typeof install.pkg_version === "string") parsed.pkgVersion = install.pkg_version;
				if (typeof install.npm_published === "boolean") parsed.npmPublished = install.npm_published;
				summary.install = parsed;
			}
			return summary;
		}
		/** Whether a parsed row carries the minimum identity a card can render. */
		function isUsablePlugin(plugin) {
			return plugin.fullName.length > 0 && plugin.name.length > 0;
		}
		/** Validate one `GET /v1/plugins` page envelope. */
		function parsePluginList(raw) {
			const record = raw ?? {};
			const items = Array.isArray(record.data) ? record.data.map(parsePlugin).filter(isUsablePlugin) : [];
			const result = {
				items,
				total: typeof record.total === "number" ? record.total : items.length,
				page: typeof record.page === "number" ? record.page : 1,
				perPage: typeof record.per_page === "number" ? record.per_page : items.length,
				totalPages: typeof record.total_pages === "number" ? record.total_pages : 1
			};
			if (typeof record.data_version === "string") result.dataVersion = record.data_version;
			return result;
		}
		/** Validate a complete `GET /v1/catalog` response. */
		function parseCatalog(raw, updatedAt) {
			const record = raw ?? {};
			if (!Array.isArray(record.data)) throw new Error("dshfind catalog snapshot: missing data array");
			const catalog = {
				items: record.data.map(parsePlugin).filter(isUsablePlugin),
				raw
			};
			if (typeof record.data_version === "string") catalog.dataVersion = record.data_version;
			if (updatedAt !== void 0) catalog.updatedAt = updatedAt;
			return catalog;
		}
		/** Validate the IndexedDB wrapper before parsing its catalog payload. */
		function parseCachedCatalog(raw) {
			if (raw === null || typeof raw !== "object") return EMPTY_CATALOG;
			const envelope = raw;
			if (typeof envelope.updatedAt !== "number" || !Number.isFinite(envelope.updatedAt)) return EMPTY_CATALOG;
			return parseCatalog(envelope.catalog, envelope.updatedAt);
		}
		function safeInteger(value, minimum = 0) {
			return typeof value === "number" && Number.isSafeInteger(value) && value >= minimum;
		}
		/** Validate a durable GitHub per-request checkpoint. */
		function parseGithubSyncCheckpoint(raw) {
			if (raw === null || typeof raw !== "object") return void 0;
			const candidate = raw.githubSync;
			if (candidate === void 0 || typeof candidate.replace !== "boolean" || !safeInteger(candidate.runEnd, GITHUB_EPOCH) || !safeInteger(candidate.total) || !safeInteger(candidate.requests) || !safeInteger(candidate.downloaded) || !safeInteger(candidate.blockedUntil) || !Array.isArray(candidate.pending) || !Array.isArray(candidate.rows)) return void 0;
			const pending = [];
			for (const rawTask of candidate.pending) {
				if (rawTask === null || typeof rawTask !== "object") return void 0;
				const task = rawTask;
				if (!safeInteger(task.from, GITHUB_EPOCH) || !safeInteger(task.to, task.from) || task.to > candidate.runEnd || !safeInteger(task.page, 1) || task.totalPages !== void 0 && !safeInteger(task.totalPages, task.page)) return void 0;
				pending.push({
					from: task.from,
					to: task.to,
					page: task.page,
					...task.totalPages === void 0 ? {} : { totalPages: task.totalPages }
				});
			}
			const rows = candidate.rows.filter((row) => row !== null && typeof row === "object" && !Array.isArray(row));
			if (rows.length !== candidate.rows.length) return void 0;
			return {
				replace: candidate.replace,
				runEnd: candidate.runEnd,
				total: candidate.total,
				requests: candidate.requests,
				downloaded: candidate.downloaded,
				blockedUntil: candidate.blockedUntil,
				pending,
				rows
			};
		}
		/**
		* Serialize a market request into `GET /v1/plugins` query parameters.
		* @param request - the request to serialize.
		* @returns the query string (without the leading `?`).
		*/
		function toQueryString(request) {
			const params = new URLSearchParams();
			params.set("page", String(request.page));
			params.set("per_page", String(request.perPage));
			if (request.q !== void 0 && request.q.length > 0) params.set("q", request.q);
			if (request.category !== void 0 && request.category.length > 0) params.set("category", request.category);
			if (request.owner !== void 0 && request.owner.length > 0) params.set("owner", request.owner);
			if (request.language !== void 0 && request.language.length > 0) params.set("language", request.language);
			if (request.grade !== void 0 && request.grade.length > 0) params.set("grade", request.grade);
			if (request.tag !== void 0 && request.tag.length > 0) params.set("tag", request.tag);
			if (request.minScore !== void 0) params.set("min_score", String(request.minScore));
			if (request.featured === true) params.set("featured", "true");
			if (request.official === true) params.set("official", "true");
			if (request.installable === true) params.set("is_plugin", "true");
			params.set("sort", request.sort);
			params.set("order", request.order);
			return params.toString();
		}
		/**
		* Create a checked router over every selectable provider implementation.
		* @param providers - Complete provider implementations keyed by selectable id.
		* @param initial - Provider that receives the first operation.
		* @returns one stable face whose operations follow the current selection.
		*/
		function createMarketProviderRouter(providers, initial) {
			let selected = initial;
			const current = () => providers[selected];
			return {
				provider: {
					initialize: (report) => current().initialize(report),
					incremental: (report) => current().incremental(report),
					refresh: (report) => current().refresh(report),
					list: (request) => current().list(request),
					detail: (fullName) => current().detail(fullName),
					suggest: (q) => current().suggest(q),
					facets: () => current().facets()
				},
				select(id) {
					selected = id;
				},
				selected() {
					return selected;
				}
			};
		}
		function same(value, expected) {
			return value?.toLocaleLowerCase() === expected.toLocaleLowerCase();
		}
		function admits(plugin, request) {
			if (request.q !== void 0 && request.q.length > 0 && !matchesTerm(plugin, request.q)) return false;
			if (request.category !== void 0 && !same(plugin.category, request.category)) return false;
			if (request.owner !== void 0 && !same(plugin.owner, request.owner)) return false;
			if (request.language !== void 0 && !same(plugin.language, request.language)) return false;
			if (request.grade !== void 0 && !same(plugin.grade, request.grade)) return false;
			const requestedTag = request.tag;
			if (requestedTag !== void 0 && !plugin.tags.some((tag) => same(tag, requestedTag))) return false;
			if (request.minScore !== void 0 && (plugin.score ?? 0) < request.minScore) return false;
			if (request.featured === true && !plugin.isFeatured) return false;
			if (request.official === true && !plugin.isOfficial) return false;
			if (request.installable === true && plugin.isPlugin !== true) return false;
			return true;
		}
		/** Build the provider operations that project one durable in-memory catalog. */
		function localProvider(current, initialize, incremental) {
			let refreshPromise = null;
			return {
				initialize,
				incremental,
				async refresh(report) {
					refreshPromise ??= incremental(report).finally(() => {
						refreshPromise = null;
					});
					return refreshPromise;
				},
				async list(request) {
					const snapshot = await current();
					const matching = snapshot.items.filter((plugin) => admits(plugin, request)).sort((a, b) => compareMarketPlugins(a, b, request.sort, request.order));
					const start = (request.page - 1) * request.perPage;
					const result = {
						items: matching.slice(start, start + request.perPage),
						total: matching.length,
						page: request.page,
						perPage: request.perPage,
						totalPages: Math.ceil(matching.length / request.perPage),
						catalogTotal: snapshot.items.length
					};
					if (snapshot.dataVersion !== void 0) result.dataVersion = snapshot.dataVersion;
					if (snapshot.updatedAt !== void 0) result.updatedAt = snapshot.updatedAt;
					return result;
				},
				async detail(fullName) {
					return (await current()).items.find((plugin) => plugin.fullName === fullName) ?? null;
				},
				async suggest(q) {
					return (await current()).items.filter((plugin) => matchesTerm(plugin, q)).slice(0, 10).map((plugin) => ({
						type: "plugin",
						id: plugin.fullName,
						label: plugin.name,
						sub: plugin.description,
						href: plugin.repositoryUrl,
						stars: plugin.stars,
						featured: plugin.isFeatured
					}));
				},
				async facets() {
					const snapshot = await current();
					const counts = /* @__PURE__ */ new Map();
					for (const plugin of snapshot.items) {
						if (plugin.category === void 0 || plugin.category === "") continue;
						counts.set(plugin.category, (counts.get(plugin.category) ?? 0) + 1);
					}
					return [...counts].map(([value, count]) => ({
						value,
						count
					})).sort((a, b) => a.value.localeCompare(b.value));
				}
			};
		}
		/**
		* Create the catalog API client.
		* @param baseUrl - catalog base URL (deployment-configurable).
		* @param fetchImpl - fetch implementation (test seam; defaults to global fetch).
		* @param cache - durable snapshot cache (test seam; defaults to IndexedDB).
		* @returns the typed read face.
		*/
		function createMarketApi(baseUrl = DEFAULT_MARKET_BASE_URL, fetchImpl = (input, init) => fetch(input, init), cache) {
			const base = baseUrl.replace(/\/+$/, "");
			const storage = cache ?? createMarketCatalogCache(base);
			let catalog = EMPTY_CATALOG;
			const ready = storage.load().then((value) => {
				catalog = parseCachedCatalog(value);
			}).catch(() => {
				catalog = EMPTY_CATALOG;
			});
			async function fetchCatalog(dataVersion, report) {
				await ready;
				report?.({
					phase: "downloading",
					requests: 0,
					items: 0,
					totalItems: 0
				});
				const query = dataVersion === void 0 ? "" : `?data_version=${encodeURIComponent(dataVersion)}`;
				const response = await fetchImpl(`${base}/v1/catalog${query}`, { headers: { accept: "application/json" } });
				if (!response.ok) throw new Error(`dshfind catalog /v1/catalog: HTTP ${String(response.status)}`);
				const raw = await response.json();
				const updatedAt = Date.now();
				const next = parseCatalog(raw, updatedAt);
				report?.({
					phase: "saving",
					requests: 1,
					items: next.items.length,
					totalItems: next.items.length
				});
				await storage.save({
					updatedAt,
					catalog: raw
				});
				catalog = next;
			}
			async function syncIncremental(report) {
				await ready;
				if (catalog.items.length === 0 || catalog.dataVersion === void 0) {
					await fetchCatalog(void 0, report);
					return;
				}
				report?.({
					phase: "checking",
					requests: 0,
					items: 0,
					totalItems: 0
				});
				const response = await fetchImpl(`${base}/v1/plugins?${toQueryString({
					page: 1,
					perPage: 1,
					sort: "updated",
					order: "desc"
				})}`, { headers: { accept: "application/json" } });
				if (!response.ok) throw new Error(`dshfind catalog /v1/plugins: HTTP ${String(response.status)}`);
				const head = parsePluginList(await response.json());
				if (head.dataVersion !== catalog.dataVersion) {
					await fetchCatalog(head.dataVersion, report);
					return;
				}
				const updatedAt = Date.now();
				if (catalog.raw === void 0) throw new Error("dshfind catalog cache lost its durable response");
				report?.({
					phase: "saving",
					requests: 1,
					items: catalog.items.length,
					totalItems: catalog.items.length
				});
				await storage.save({
					updatedAt,
					catalog: catalog.raw
				});
				catalog = {
					...catalog,
					updatedAt
				};
			}
			async function current() {
				await ready;
				return catalog;
			}
			return localProvider(current, (report) => fetchCatalog(void 0, report), syncIncremental);
		}
		const GITHUB_EPOCH = Date.parse("2008-01-01T00:00:00.000Z");
		const GITHUB_QUERY_LIMIT = 1e3;
		const GITHUB_PAGE_SIZE = 100;
		/**
		* The install probe of a GitHub Topic row. GitHub search carries no package
		* manifest, so the spec stays the repository itself and pnpm resolves the real
		* dependency name while installing.
		* @param fullName - `owner/repository`.
		* @returns the wire-shaped install probe.
		*/
		function githubInstallInfo(fullName) {
			return {
				cmd: `dsh plugin --profile web add -w github:${fullName}`,
				source: "auto",
				kind: "git"
			};
		}
		/** Convert a validated GitHub row into the cache's provider-neutral wire record. */
		function githubCatalogRow(repository) {
			return {
				_github_id: repository.id,
				full_name: repository.fullName,
				name: repository.name,
				owner: repository.owner,
				repository_url: repository.repositoryUrl,
				description: repository.description,
				tags: repository.topics,
				language: repository.language,
				stars: repository.stars,
				pushed_at: repository.pushedAt,
				archived: repository.archived,
				is_featured: false,
				is_official: repository.owner.toLocaleLowerCase() === "deepseek-ai",
				is_insider: false,
				is_risky: false,
				is_plugin: true,
				install: githubInstallInfo(repository.fullName)
			};
		}
		function sleep(milliseconds) {
			return new Promise((resolve) => {
				window.setTimeout(resolve, milliseconds);
			});
		}
		/** Preserve the last complete catalog beside one resumable GitHub checkpoint. */
		function githubCheckpointEnvelope(catalog, githubSync) {
			return {
				...catalog.updatedAt === void 0 ? {} : { updatedAt: catalog.updatedAt },
				...catalog.raw === void 0 ? {} : { catalog: catalog.raw },
				githubSync
			};
		}
		/** Merge committed crawl rows over the last complete GitHub catalog. */
		function githubCheckpointRows(catalog, checkpoint) {
			const previous = !checkpoint.replace && catalog.raw !== void 0 ? catalog.raw.data ?? [] : [];
			const rows = /* @__PURE__ */ new Map();
			if (Array.isArray(previous)) {
				for (const raw of previous) if (raw !== null && typeof raw === "object") {
					const id = raw._github_id;
					if (typeof id === "number" && Number.isSafeInteger(id)) rows.set(id, raw);
				}
			}
			for (const row of checkpoint.rows) {
				const id = row._github_id;
				if (typeof id === "number" && Number.isSafeInteger(id)) rows.set(id, row);
			}
			return [...rows.values()];
		}
		/** Project every committed request immediately without promoting an incomplete snapshot. */
		function githubCheckpointCatalog(catalog, checkpoint) {
			const raw = { data: githubCheckpointRows(catalog, checkpoint) };
			if (catalog.dataVersion !== void 0) raw.data_version = catalog.dataVersion;
			return parseCatalog(raw, catalog.updatedAt);
		}
		/** Select the newest returned push as the next completed-catalog cursor. */
		function githubCompletionCursor(catalog, checkpoint) {
			const previous = Date.parse(catalog.dataVersion ?? "");
			let latestValue;
			let latestTime = Number.NEGATIVE_INFINITY;
			for (const row of checkpoint.rows) {
				const pushedAt = row.pushed_at;
				if (typeof pushedAt !== "string") continue;
				const time = Date.parse(pushedAt);
				if (Number.isFinite(time) && time > latestTime) {
					latestValue = pushedAt;
					latestTime = time;
				}
			}
			if (latestValue !== void 0 && (!Number.isFinite(previous) || latestTime > previous)) return latestValue;
			return new Date(checkpoint.runEnd).toISOString();
		}
		/** Execute and checkpoint every request in one inclusive pushed-at crawl. */
		async function crawlGithub(search, initial, persist, wait, clock, report) {
			let checkpoint = initial;
			while (checkpoint.pending.length > 0) {
				const [task, ...rest] = checkpoint.pending;
				if (task === void 0) throw new Error("GitHub synchronization lost its next request");
				const delay = checkpoint.blockedUntil - clock();
				if (delay > 0) {
					report?.({
						phase: "waiting",
						requests: checkpoint.requests,
						items: checkpoint.downloaded,
						totalItems: checkpoint.total,
						waitUntil: checkpoint.blockedUntil
					});
					await wait(delay);
				}
				const result = await search({
					pushedFrom: new Date(task.from).toISOString(),
					pushedTo: new Date(task.to).toISOString(),
					page: task.page,
					perPage: GITHUB_PAGE_SIZE
				});
				if (result.incomplete) throw new Error("GitHub repository search returned incomplete results");
				const requests = checkpoint.requests + 1;
				const blockedUntil = result.rateLimitRemaining === 0 ? result.rateLimitResetAt + 1e3 : 0;
				const total = checkpoint.requests === 0 ? result.total : checkpoint.total;
				let nextPending = rest;
				let rows = checkpoint.rows;
				let downloaded = checkpoint.downloaded;
				let phase = "downloading";
				let totalPages;
				if (task.page === 1 && result.total > GITHUB_QUERY_LIMIT) {
					phase = "partitioning";
					if (task.from >= task.to) throw new Error(`GitHub search interval ${new Date(task.from).toISOString()} exceeds 1,000 rows`);
					const middle = Math.floor((task.from + task.to) / 2e3) * 1e3;
					if (middle < task.from || middle >= task.to) throw new Error(`GitHub search interval ${new Date(task.from).toISOString()} cannot be bisected`);
					nextPending = [
						{
							from: task.from,
							to: middle,
							page: 1
						},
						{
							from: middle + 1e3,
							to: task.to,
							page: 1
						},
						...rest
					];
				} else {
					totalPages = task.totalPages ?? Math.ceil(result.total / GITHUB_PAGE_SIZE);
					rows = [...rows, ...result.items.map(githubCatalogRow)];
					downloaded += result.items.length;
					if (task.page < totalPages) nextPending = [{
						...task,
						page: task.page + 1,
						totalPages
					}, ...rest];
				}
				const next = {
					...checkpoint,
					total,
					requests,
					downloaded,
					blockedUntil,
					pending: nextPending,
					rows
				};
				await persist(next);
				checkpoint = next;
				report?.({
					phase,
					requests,
					items: downloaded,
					totalItems: total,
					...totalPages === void 0 ? {} : {
						page: task.page,
						totalPages
					}
				});
			}
			return checkpoint;
		}
		/**
		* Create the GitHub Topic provider over Host-authenticated search and its own
		* IndexedDB snapshot.
		* @param search - Host Remote operation for one GitHub search-result page.
		* @param cache - persistent complete-catalog snapshot.
		* @param clock - current UTC time used for interval cursors and rate-limit waits.
		* @param wait - delay operation used when GitHub exhausts the search bucket.
		* @returns a local-first provider backed by the `dsh-plugin` topic.
		*/
		function createGithubMarketApi(search, cache = createMarketCatalogCache("github:topic:dsh-plugin"), clock = Date.now, wait = sleep) {
			const storage = cache;
			let catalog = EMPTY_CATALOG;
			let resumable;
			const ready = storage.load().then((value) => {
				catalog = parseCachedCatalog(value);
				resumable = parseGithubSyncCheckpoint(value);
			}).catch(() => {
				catalog = EMPTY_CATALOG;
				resumable = void 0;
			});
			async function synchronize(replace, report) {
				await ready;
				if (resumable === void 0) {
					const runEnd = Math.floor(clock() / 1e3) * 1e3;
					const cursor = catalog.dataVersion === void 0 ? NaN : Date.parse(catalog.dataVersion);
					resumable = {
						replace,
						runEnd,
						total: 0,
						requests: 0,
						downloaded: 0,
						blockedUntil: 0,
						pending: [{
							from: replace || !Number.isFinite(cursor) ? GITHUB_EPOCH : cursor,
							to: runEnd,
							page: 1
						}],
						rows: []
					};
				}
				report?.({
					phase: "checking",
					requests: resumable.requests,
					items: resumable.downloaded,
					totalItems: resumable.total
				});
				const completed = await crawlGithub(search, resumable, async (checkpoint) => {
					await storage.save(githubCheckpointEnvelope(catalog, checkpoint));
					resumable = checkpoint;
				}, wait, clock, report);
				const raw = {
					data: githubCheckpointRows(catalog, completed),
					data_version: githubCompletionCursor(catalog, completed)
				};
				const updatedAt = clock();
				const next = parseCatalog(raw, updatedAt);
				report?.({
					phase: "saving",
					requests: completed.requests,
					items: completed.downloaded,
					totalItems: completed.total
				});
				await storage.save({
					updatedAt,
					catalog: raw
				});
				catalog = next;
				resumable = void 0;
			}
			async function current() {
				await ready;
				return resumable === void 0 ? catalog : githubCheckpointCatalog(catalog, resumable);
			}
			return localProvider(current, (report) => synchronize(true, report), async (report) => {
				await ready;
				await synchronize(catalog.items.length === 0, report);
			});
		}
		//#endregion
		//#region src/client/agent-copy.ts
		/**
		* The installed module name of a plugin row, when the Host inventory carries
		* one. Providers that probe npm supply the exact package name; providers that
		* only see the repository fall back to the repository name.
		* @param plugin - the plugin row.
		* @param installed - installed module names from the Host inventory remote.
		* @returns the matching installed module name, or null.
		*/
		function installedName(plugin, installed) {
			if (installed.length === 0) return null;
			const names = new Map(installed.map((name) => [name.toLocaleLowerCase(), name]));
			const probed = plugin.install?.pkgName;
			if (probed !== void 0 && probed.length > 0) {
				const match = names.get(probed.toLocaleLowerCase());
				if (match !== void 0) return match;
			}
			return names.get(plugin.name.toLocaleLowerCase()) ?? null;
		}
		/**
		* Whether a plugin row is already installed (module-name match against the
		* Host inventory).
		* @param plugin - the plugin row.
		* @param installed - installed module names from the Host inventory remote.
		* @returns whether the package or probed npm name is installed.
		*/
		function isInstalled(plugin, installed) {
			return installedName(plugin, installed) !== null;
		}
		/**
		* The documented install command of a plugin, when installable.
		* @param plugin - the plugin row.
		* @returns the exact install command, or null when the catalog probed none.
		*/
		function installCommand(plugin) {
			return plugin.install?.cmd ?? null;
		}
		/**
		* Resolve the single package spec of an official Web-profile install command.
		* The workspace-root flag is optional in the documented command because the
		* Host always passes it.
		*/
		function installSpec(plugin) {
			const command = installCommand(plugin);
			if (command === null) return null;
			return /^(?:dsh|npx -y @deepseek-ai\/dsh(?:@[^\s]+)?) plugin --profile web add (?:(?:-w|--workspace-root) )?([^\s]+)$/.exec(command)?.[1] ?? null;
		}
		/**
		* Resolve the installed dependency name used by `dsh plugin remove`: the name
		* the Host inventory actually reports, falling back to the probed npm name.
		* @param plugin - the plugin row.
		* @param installed - installed module names from the Host inventory remote.
		* @returns the dependency name to remove, or null.
		*/
		function uninstallSpec(plugin, installed = []) {
			const matched = installedName(plugin, installed);
			if (matched !== null) return matched;
			const name = plugin.install?.pkgName;
			return name === void 0 || name.length === 0 ? null : name;
		}
		/**
		* Derive the uninstall command from the documented install command: same
		* invocation with `add` replaced by `remove`. Null when no dependency name is
		* known.
		* @param plugin - the plugin row.
		* @param installed - installed module names from the Host inventory remote.
		* @returns the uninstall command, or null.
		*/
		function uninstallCommand(plugin, installed = []) {
			const spec = uninstallSpec(plugin, installed);
			return spec === null ? null : `dsh plugin --profile web remove -w ${spec}`;
		}
		/** One line of the per-plugin agent block: `- key: value` when the value is present. */
		function line(key, value) {
			return value === void 0 || value === null || value.length === 0 ? null : `- ${key}: ${value}`;
		}
		/**
		* The compact per-plugin Markdown block for agent consumption: identity,
		* quality assessment, metadata, install command, and source links.
		* @param plugin - the plugin row (or detail payload).
		* @param locale - `zh` keeps the description in Chinese when the row carries
		*   no localized copy; the block itself stays English for the model.
		* @returns the Markdown block.
		*/
		function pluginAgentMarkdown(plugin, locale = "en") {
			const description = plugin.i18n?.[locale]?.description ?? plugin.description;
			const grade = plugin.grade ?? "ungraded";
			const score = plugin.score === void 0 ? "n/a" : String(plugin.score);
			const stars = String(plugin.stars);
			return [
				`## ${plugin.fullName}`,
				line("id", plugin.fullName),
				line("name", plugin.name),
				line("owner", plugin.owner),
				line("category", plugin.category),
				line("grade", grade),
				line("score", score),
				line("stars", stars),
				line("language", plugin.language),
				line("tags", plugin.tags.join(", ")),
				line("description", description),
				line("install", installCommand(plugin)),
				line("repository", plugin.repositoryUrl)
			].filter((entry) => entry !== null).join("\n");
		}
		/**
		* The batch block of the current visible results, for pasting an entire
		* candidate set into an agent conversation. Each plugin gets the one-line
		* summary; the full per-plugin block is available through the card action.
		* @param items - the visible (or selected) plugin rows.
		* @param total - total rows reported for the current query.
		* @param query - the search text that produced the list, when any.
		* @param locale - description-locale preference.
		* @returns the Markdown list.
		*/
		function listAgentMarkdown(items, total, query, locale = "en") {
			const count = `${String(items.length)} of ${String(total)} loaded`;
			return [
				query.length === 0 ? `Plugin market results (${count})` : `Plugin market results for query: ${query} (${count})`,
				"",
				...items.map((plugin) => {
					const description = plugin.i18n?.[locale]?.description ?? plugin.description;
					const summary = description.length > 160 ? `${description.slice(0, 157)}…` : description;
					return `- ${plugin.fullName} (${plugin.grade ?? "ungraded"}, score ${plugin.score ?? "n/a"}, ${String(plugin.stars)} stars): ${summary}`;
				}),
				"",
				"Install any of these with: dsh plugin --profile web add -w <pkg>"
			].join("\n");
		}
		//#endregion
		//#region src/client/market-store.ts
		/**
		* Fresh initial marketplace state (one per controller instance).
		* @returns the initial state.
		*/
		function createMarketViewState() {
			return {
				search: "",
				filters: {
					category: "",
					owner: "",
					language: "",
					grade: "",
					featured: false,
					official: false,
					installable: false
				},
				sort: "stars",
				order: "desc",
				items: [],
				total: 0,
				catalogTotal: 0,
				updatedAt: null,
				syncStatus: "idle",
				syncError: null,
				syncProgress: null,
				status: "idle",
				mode: "api",
				nextPage: 1,
				ranked: [],
				selected: null,
				detail: null,
				detailStatus: "idle",
				overlayOpen: false,
				installed: [],
				installedOnly: false,
				action: null,
				installWarning: null,
				starred: [],
				starBusy: [],
				starSupported: false,
				starError: null,
				restartConfirm: false,
				restartActivity: null,
				restartStatusUnavailable: false,
				restartMode: "service"
			};
		}
		//#endregion
		//#region src/client/plugin-actions.ts
		const TOKEN_PATH = "/plugin-marketplace/action-token";
		const ACTION_PATH = "/plugin-marketplace/action";
		const COMPATIBILITY_PATH = "/plugin-marketplace/compatibility";
		let sessionPromise = null;
		/** Read the current Host generation's action token and restart capability. */
		async function pluginActionSession() {
			sessionPromise ??= fetch(TOKEN_PATH, {
				headers: { Accept: "application/json" },
				cache: "no-store"
			}).then(async (response) => {
				if (!response.ok) throw new Error(`plugin action token failed: ${response.status} ${response.statusText}`);
				const body = await response.json();
				if (typeof body.token !== "string" || body.token.length === 0) throw new Error("plugin action token response is invalid");
				return {
					token: body.token,
					restart: body.restart === "service" ? "service" : "manual"
				};
			});
			return sessionPromise;
		}
		/** Drop the token after the Host generation changes. */
		function resetPluginActionToken() {
			sessionPromise = null;
		}
		/**
		* Report the harness peer ranges one candidate package would violate. The check
		* is advisory: an unreachable manifest or a failed request yields no mismatch,
		* because a diagnostic must never be the reason an install cannot start.
		*/
		async function checkPluginCompatibility(spec, retryToken = true) {
			let response;
			try {
				response = await fetch(COMPATIBILITY_PATH, {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						token: (await pluginActionSession()).token,
						spec
					})
				});
			} catch {
				return [];
			}
			if (response.status === 400 && retryToken) {
				resetPluginActionToken();
				return checkPluginCompatibility(spec, false);
			}
			if (!response.ok) return [];
			const body = await response.json().catch(() => null);
			if (!Array.isArray(body?.mismatches)) return [];
			return body.mismatches.filter((row) => {
				const peer = row;
				return typeof peer?.name === "string" && typeof peer.expected === "string" && typeof peer.actual === "string";
			});
		}
		/** Delegate one install or uninstall to the current official DSH CLI. */
		async function runPluginAction(action, spec, retryToken = true) {
			const response = await fetch(ACTION_PATH, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					token: (await pluginActionSession()).token,
					action,
					spec
				})
			});
			if (response.status === 400 && retryToken) {
				resetPluginActionToken();
				return runPluginAction(action, spec, false);
			}
			const body = await response.json();
			if (!response.ok) throw new Error(typeof body.error === "string" ? body.error : `plugin action failed: ${response.status}`);
			if (typeof body.ok !== "boolean" || typeof body.exitCode !== "number" || typeof body.command !== "string") throw new Error("plugin action response is invalid");
			return {
				ok: body.ok,
				exitCode: body.exitCode,
				command: body.command,
				...typeof body.error === "string" ? { error: body.error } : {},
				...body.hotMounted === true ? { hotMounted: true } : {},
				...typeof body.hotMountNote === "string" ? { hotMountNote: body.hotMountNote } : {},
				...typeof body.rolledBack === "boolean" ? { rolledBack: body.rolledBack } : {}
			};
		}
		//#endregion
		//#region src/client/market-controller.ts
		/**
		* Marketplace controller: query projection between the local provider
		* repository and the shared view store. Constructed once in `apply` (the
		* store instance is created here too); every register's inject face closes
		* over it, so all three surfaces read and mutate one state source.
		*/
		/** How often an open restart confirmation refreshes Agent activity. */
		const RESTART_STATUS_POLL_MS = 1500;
		/** Case-insensitive membership of one `owner/repository` in a star set. */
		function contains(names, fullName) {
			const wanted = fullName.toLocaleLowerCase();
			return names.some((name) => name.toLocaleLowerCase() === wanted);
		}
		/** Whether a parsed query needs the multi-request merge pipeline. */
		function needsMerge(parsed) {
			return parsed.positive.length > 1;
		}
		/**
		* The controller: one store instance plus the complete operation set of the
		* marketplace surfaces. Stale responses are dropped by a monotonic sequence
		* taken at request start — a later search, filter, or sort invalidates every
		* in-flight list request.
		*/
		var MarketController = class {
			ports;
			/** The uSES-safe state source bound into every register's `useView`. */
			store = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)(createMarketViewState());
			seq = 0;
			detailSeq = 0;
			facetPromise = null;
			syncQueued = false;
			/** The query the last reload resolved; paging reuses it without re-converting. */
			queryCache = "";
			/**
			* @param ports - the catalog API and the installed-name reader.
			*/
			constructor(ports) {
				this.ports = ports;
			}
			/** Open the shell-overlay marketplace. */
			open() {
				this.store.update((state) => {
					state.overlayOpen = true;
				});
			}
			/** Close the shell-overlay marketplace. */
			close() {
				this.store.update((state) => {
					state.overlayOpen = false;
				});
			}
			/**
			* Load the first list page unless a load already started. Guards double
			* mounts (the Settings tab and the overlay can both be mounted).
			*/
			ensureLoaded() {
				if (this.store.getSnapshot().status !== "idle") return;
				this.reload();
			}
			/**
			* Replace the search text and reload from page one.
			* @param text - the raw search input (Google-style syntax).
			*/
			applySearch(text) {
				this.store.update((state) => {
					state.search = text;
				});
				this.reload();
			}
			/**
			* Replace the toolbar filter selection and reload from page one.
			* @param filters - the new filter selection.
			*/
			applyFilters(filters) {
				this.store.update((state) => {
					state.filters = filters;
				});
				this.reload();
			}
			/**
			* Project the loaded catalog rows by Host inventory state without reloading
			* the local catalog, which has no installed-state field.
			* @param installedOnly - whether to show installed rows only.
			*/
			applyInstalledFilter(installedOnly) {
				this.store.update((state) => {
					state.installedOnly = installedOnly;
				});
			}
			/**
			* Replace the sort key and direction together, then reload from page one.
			* @param sort - the new sort key.
			* @param order - the new sort direction.
			*/
			applyOrdering(sort, order) {
				this.store.update((state) => {
					state.sort = sort;
					state.order = order;
				});
				this.reload();
			}
			/** Retry the current list after an error (same query, page one). */
			retry() {
				this.reload();
			}
			/**
			* Synchronize the selected provider into its durable local snapshot, then
			* re-run the current query without discarding usable cached rows on failure.
			*
			* @param queueIfBusy - run once more after the active synchronization; used when provider or credentials change.
			* @returns settlement after the local projection or failure state publishes.
			*/
			async syncCatalog(queueIfBusy = false) {
				if (this.store.getSnapshot().syncStatus === "syncing") {
					if (queueIfBusy) this.syncQueued = true;
					return;
				}
				this.store.update((state) => {
					state.syncStatus = "syncing";
					state.syncError = null;
					state.syncProgress = {
						phase: "checking",
						requests: 0,
						items: 0,
						totalItems: 0
					};
				});
				let projectedItems = -1;
				try {
					await this.ports.api.refresh((progress) => {
						this.store.update((state) => {
							state.syncProgress = progress;
						});
						if (progress.items === projectedItems) return;
						projectedItems = progress.items;
						this.facetPromise = null;
						this.reload(true);
					});
					this.facetPromise = null;
					await this.reload(true);
					this.store.update((state) => {
						state.syncStatus = "idle";
						state.syncProgress = null;
					});
				} catch (reason) {
					this.store.update((state) => {
						state.syncStatus = "error";
						state.syncError = reason instanceof Error ? reason.message : String(reason);
						state.syncProgress = null;
					});
				}
				if (this.syncQueued) {
					this.syncQueued = false;
					await this.syncCatalog();
				}
			}
			/**
			* Load the next list page: a local repository page in api mode, or a local
			* slice of the merged cache. No-op while a load is in flight or the list
			* is exhausted.
			*/
			loadNextPage() {
				const state = this.store.getSnapshot();
				if (state.status === "loading" || state.status === "error" || state.status === "exhausted") return;
				if (state.mode === "merged") {
					const slice = state.ranked.slice(state.items.length, state.items.length + 40);
					/* v8 ignore next -- 'ready' merged mode always has unshown ranked rows
					* (applyMerged/mergeMore set 'exhausted' exactly at the end), so an
					* empty slice cannot occur through the public operations. */
					if (slice.length === 0) {
						this.store.update((view) => {
							view.status = "exhausted";
						});
						return;
					}
					this.store.update((view) => {
						view.items = [...view.items, ...slice];
						view.status = view.items.length >= view.ranked.length ? "exhausted" : "ready";
					});
					return;
				}
				this.loadApiPage(state.nextPage, false);
			}
			/**
			* Open the detail dialog for one plugin and fetch its detail payload.
			* @param fullName - the `owner/repo` catalog id of the plugin.
			*/
			openDetail(fullName) {
				this.store.update((state) => {
					state.selected = fullName;
					state.detailStatus = "loading";
				});
				const seq = ++this.detailSeq;
				this.ports.api.detail(fullName).then((detail) => {
					if (seq !== this.detailSeq) return;
					if (detail === null) {
						this.store.update((state) => {
							state.detailStatus = "error";
						});
						return;
					}
					this.store.update((state) => {
						state.detail = detail;
						state.detailStatus = "ready";
					});
				}, () => {
					if (seq !== this.detailSeq) return;
					this.store.update((state) => {
						state.detailStatus = "error";
					});
				});
			}
			/** Close the detail dialog and drop its payload. */
			closeDetail() {
				this.store.update((state) => {
					state.selected = null;
					state.detail = null;
					state.detailStatus = "idle";
				});
			}
			/**
			* Resolve the package spec for one catalog action. A repository spec is
			* traded for the published package name when npm serves it: pnpm builds a
			* git-hosted package through its `prepare` script, which it refuses to run
			* until that exact build is allowlisted, while the published package needs
			* no build at all.
			*/
			async actionSpec(state, fullName, kind) {
				const row = state.items.find((plugin) => plugin.fullName === fullName) ?? (state.detail !== null && state.detail.fullName === fullName ? state.detail : void 0);
				if (row === void 0) return null;
				if (kind === "uninstall") return uninstallSpec(row, state.installed);
				const spec = installSpec(row);
				const resolve = this.ports.resolvePackage;
				if (spec === null || !spec.startsWith("github:") || resolve === void 0) return spec;
				try {
					const resolved = await resolve(row.fullName);
					const name = resolved.pkgName;
					return resolved.npmPublished && name !== void 0 && name.length > 0 ? name : spec;
				} catch {
					return spec;
				}
			}
			/** Run one profile package action and publish its exact result. */
			async runAction(kind, fullName) {
				this.store.update((state) => {
					state.action = {
						fullName,
						kind,
						status: "running",
						message: "",
						startedAt: Date.now()
					};
				});
				const spec = await this.actionSpec(this.store.getSnapshot(), fullName, kind);
				if (spec === null) {
					this.store.update((state) => {
						state.action = {
							fullName,
							kind,
							status: "error",
							message: "not-installable"
						};
					});
					return;
				}
				if (kind === "install") {
					const mismatches = await this.ports.checkCompatibility(spec);
					if (mismatches.length > 0) {
						this.store.update((state) => {
							state.action = null;
							state.installWarning = {
								fullName,
								spec,
								mismatches
							};
						});
						return;
					}
				}
				await this.performAction(kind, fullName, spec);
			}
			/** Delegate one resolved spec to the CLI and publish its exact result. */
			async performAction(kind, fullName, spec) {
				await (kind === "install" ? this.ports.install(spec) : this.ports.uninstall(spec)).then((result) => {
					this.store.update((state) => {
						const action = {
							fullName,
							kind,
							status: result.ok ? "ok" : "error",
							message: result.ok ? `${kind}ed` : result.rolledBack === true ? "load-failed" : result.rolledBack === false ? "load-failed-stuck" : `dsh plugin exit ${String(result.exitCode)}`,
							command: result.command
						};
						if (!result.ok && result.error !== void 0) action.detail = result.error;
						if (result.hotMounted === true) action.hotMounted = true;
						if (result.ok && result.hotMounted !== true && result.hotMountNote !== void 0) action.detail = result.hotMountNote;
						state.action = action;
					});
					if (result.ok) this.refreshInstalled();
				}, (reason) => {
					this.store.update((state) => {
						state.action = {
							fullName,
							kind,
							status: "error",
							message: "request-failed",
							detail: reason instanceof Error ? reason.message : String(reason)
						};
					});
				});
			}
			/** Install one Marketplace package into the Web profile. */
			install(fullName) {
				this.runAction("install", fullName);
			}
			/** Uninstall one Marketplace package from the Web profile. */
			uninstall(fullName) {
				this.runAction("uninstall", fullName);
			}
			/** Dismiss the settled package-action banner. */
			dismissAction() {
				this.store.update((state) => {
					state.action = null;
				});
			}
			/** Install anyway, accepting the reported harness mismatches. */
			confirmInstallWarning() {
				const warning = this.store.getSnapshot().installWarning;
				if (warning === null) return;
				this.store.update((state) => {
					state.installWarning = null;
					state.action = {
						fullName: warning.fullName,
						kind: "install",
						status: "running",
						message: "",
						startedAt: Date.now()
					};
				});
				this.performAction("install", warning.fullName, warning.spec);
			}
			/** Abandon the install that raised a compatibility warning. */
			dismissInstallWarning() {
				this.store.update((state) => {
					state.installWarning = null;
				});
			}
			/** Restart immediately when idle, otherwise open the live safety confirmation. */
			async restart() {
				let activity;
				try {
					activity = await this.ports.status();
				} catch {
					this.store.update((state) => {
						state.restartConfirm = true;
						state.restartActivity = null;
						state.restartStatusUnavailable = true;
					});
					return;
				}
				if (!activity.running) {
					await this.requestRestart();
					return;
				}
				this.store.update((state) => {
					state.restartConfirm = true;
					state.restartActivity = activity;
					state.restartStatusUnavailable = false;
				});
				this.restartTimer ??= setInterval(() => {
					this.ports.status().then((current) => {
						this.store.update((state) => {
							state.restartActivity = current;
							state.restartStatusUnavailable = false;
						});
					}, () => {
						this.store.update((state) => {
							state.restartStatusUnavailable = true;
						});
					});
				}, RESTART_STATUS_POLL_MS);
			}
			/** Confirm the pending restart. */
			/** Ask Better Restart to reboot, publishing a failure the banner can show. */
			async requestRestart() {
				try {
					await this.ports.restart();
				} catch (reason) {
					this.store.update((state) => {
						const detail = reason instanceof Error ? reason.message : String(reason);
						state.action = state.action === null ? {
							kind: "install",
							fullName: "",
							status: "error",
							message: "restart-failed",
							detail
						} : {
							...state.action,
							status: "error",
							message: "restart-failed",
							detail
						};
					});
				}
			}
			confirmRestart() {
				this.stopRestartPoll();
				this.store.update((state) => {
					state.restartConfirm = false;
				});
				this.requestRestart();
			}
			/** Dismiss the pending restart confirmation. */
			dismissRestart() {
				this.stopRestartPoll();
				this.store.update((state) => {
					state.restartConfirm = false;
					state.restartActivity = null;
					state.restartStatusUnavailable = false;
				});
			}
			restartTimer = null;
			stopRestartPoll() {
				if (this.restartTimer === null) return;
				clearInterval(this.restartTimer);
				this.restartTimer = null;
			}
			/**
			* Refresh the starred-repository set from GitHub. A failure (no credential,
			* or a token without the starring scope) leaves the star actions hidden
			* rather than failing the marketplace.
			*/
			async refreshStarred() {
				const list = this.ports.listStarred;
				if (list === void 0) return;
				try {
					const fullNames = await list();
					this.store.update((state) => {
						state.starred = fullNames;
						state.starSupported = true;
					});
				} catch {
					this.store.update((state) => {
						state.starSupported = false;
					});
				}
			}
			/**
			* Star or unstar one repository, keeping the local set in step.
			* @param fullName - the `owner/repository` to toggle.
			*/
			toggleStar(fullName) {
				const set = this.ports.setStar;
				if (set === void 0) return;
				const snapshot = this.store.getSnapshot();
				if (contains(snapshot.starBusy, fullName)) return;
				const starred = !contains(snapshot.starred, fullName);
				this.store.update((state) => {
					state.starBusy = [...state.starBusy, fullName];
					state.starError = null;
				});
				set(fullName, starred).then(() => {
					this.store.update((state) => {
						state.starred = starred ? [...state.starred, fullName] : state.starred.filter((name) => name.toLocaleLowerCase() !== fullName.toLocaleLowerCase());
						state.starBusy = state.starBusy.filter((name) => name !== fullName);
					});
				}, (reason) => {
					this.store.update((state) => {
						state.starBusy = state.starBusy.filter((name) => name !== fullName);
						state.starError = reason instanceof Error ? reason.message : String(reason);
					});
				});
			}
			/** Clear the latest star failure. */
			dismissStarError() {
				this.store.update((state) => {
					state.starError = null;
				});
			}
			/** Learn whether this launcher can restart itself, before offering to. */
			async refreshRestartMode() {
				const { restart } = await pluginActionSession();
				this.store.update((state) => {
					state.restartMode = restart;
				});
			}
			/** Refresh the installed module-name set from the Host inventory remote. */
			async refreshInstalled() {
				try {
					const names = await this.ports.installed();
					this.store.update((state) => {
						state.installed = names;
					});
				} catch {}
			}
			/**
			* The category facet list, fetched once per controller lifetime.
			* @returns the facet list (empty after a failed fetch).
			*/
			fetchFacets() {
				this.facetPromise ??= this.ports.api.facets().catch(() => []);
				return this.facetPromise;
			}
			requestFor(state, q, page, perPage) {
				const { apiFilters } = parseMarketQuery(this.queryCache);
				const request = {
					sort: state.sort,
					order: state.order,
					page,
					perPage
				};
				if (q !== void 0) request.q = q;
				const category = (apiFilters.category ?? state.filters.category) || void 0;
				if (category !== void 0) request.category = category;
				const owner = (apiFilters.owner ?? state.filters.owner) || void 0;
				if (owner !== void 0) request.owner = owner;
				const language = (apiFilters.language ?? state.filters.language) || void 0;
				if (language !== void 0) request.language = language;
				const grade = (apiFilters.grade ?? state.filters.grade) || void 0;
				if (grade !== void 0) request.grade = grade;
				if (apiFilters.tag !== void 0) request.tag = apiFilters.tag;
				if (apiFilters.minScore !== void 0) request.minScore = apiFilters.minScore;
				if (state.filters.featured) request.featured = true;
				if (state.filters.official) request.official = true;
				if (state.filters.installable) request.installable = true;
				return request;
			}
			async reload(preserveItems = false) {
				const state = this.store.getSnapshot();
				const seq = ++this.seq;
				if (!preserveItems) this.store.update((view) => {
					view.items = [];
					view.ranked = [];
					view.total = 0;
					view.status = "loading";
				});
				const query = state.search;
				if (seq !== this.seq) return;
				this.queryCache = query;
				const parsed = parseMarketQuery(query);
				const merged = needsMerge(parsed);
				this.store.update((view) => {
					view.mode = merged ? "merged" : "api";
					view.nextPage = 1;
				});
				try {
					if (merged) {
						const base = this.requestFor(state, void 0, 1, SEARCH_TERM_FETCH_SIZE);
						const pages = await Promise.all(planSearch(parsed).map((term) => this.ports.api.list({
							...base,
							q: term
						})));
						const result = mergeAndRank(pages.map((page) => page.items), parsed, Number.MAX_SAFE_INTEGER);
						const ordered = [...result.items].sort((a, b) => compareMarketPlugins(a, b, state.sort, state.order));
						if (seq !== this.seq) return;
						this.store.update((view) => {
							view.ranked = ordered;
							view.total = result.total;
							const metadata = pages[0];
							if (metadata?.catalogTotal !== void 0) view.catalogTotal = metadata.catalogTotal;
							if (metadata?.updatedAt !== void 0) view.updatedAt = metadata.updatedAt;
							view.items = ordered.slice(0, 40);
							view.status = ordered.length > 0 && ordered.length <= 40 ? "exhausted" : "ready";
						});
					} else await this.loadApiPage(1, true, seq);
				} catch {
					if (seq !== this.seq) return;
					this.store.update((view) => {
						view.status = "error";
					});
				}
			}
			async loadApiPage(page, fromReload, pinnedSeq) {
				const state = this.store.getSnapshot();
				const parsed = parseMarketQuery(this.queryCache);
				const seq = pinnedSeq ?? ++this.seq;
				if (!fromReload) this.store.update((view) => {
					view.status = "loading";
				});
				try {
					const result = await this.ports.api.list(this.requestFor(state, parsed.positive[0], page, 40));
					if (seq !== this.seq) return;
					const items = result.items.filter((plugin) => accepts(plugin, parsed));
					this.store.update((view) => {
						view.items = fromReload ? items : [...view.items, ...items];
						view.total = result.total;
						if (result.catalogTotal !== void 0) view.catalogTotal = result.catalogTotal;
						if (result.updatedAt !== void 0) view.updatedAt = result.updatedAt;
						view.nextPage = page + 1;
						view.status = view.items.length >= result.total ? "exhausted" : "ready";
						view.mode = "api";
					});
				} catch {
					if (seq !== this.seq) return;
					this.store.update((view) => {
						view.status = "error";
					});
				}
			}
		};
		//#endregion
		//#region src/client/locales.ts
		/** Copy dictionaries for the plugin marketplace surfaces. */
		/** Simplified Chinese dictionary and key source of truth. */
		const zh = {
			tab: "插件市场",
			sidebarEntry: "插件市场",
			searchPlaceholder: "搜索插件",
			searchSyntaxLabel: "语法",
			searchSyntaxHelp: "AND、OR、-排除、\"精确短语\"",
			searchFieldsLabel: "字段",
			searchFieldsHelp: "category、owner、language、grade、tag；stars、score 支持数值比较",
			total: "共 {count} 个插件",
			sortLabel: "排序",
			sortDimension: "维度",
			sortDirection: "方向",
			sortStars: "热度",
			sortUpdated: "最新",
			sortScore: "评分",
			sortName: "名称",
			orderDesc: "降序",
			orderAsc: "升序",
			filterLabel: "筛选",
			filterActive: "筛选 ({count})",
			filterCategory: "分类",
			filterOwner: "作者",
			filterLanguage: "语言",
			filterGrade: "质量等级",
			filterFeatured: "精选",
			filterOfficial: "官方",
			filterInstallable: "可安装",
			filterInstalled: "已安装",
			filterClear: "清除面板筛选",
			searchFiltersOverride: "搜索框中的字段条件优先；请编辑搜索内容以移除这些条件。",
			gradeNone: "未评级",
			loading: "正在加载插件…",
			loadMore: "加载更多",
			loadingMore: "加载更多…",
			loadedCount: "已加载 {count}",
			empty: "没有找到匹配的插件。",
			emptyCatalog: "本地还没有插件数据，请先从云端同步。",
			emptySyncing: "正在同步插件，已抓取的数据会实时显示。",
			error: "加载失败，请检查网络后重试。",
			retry: "重试",
			exhausted: "已显示全部 {count} 个插件",
			installedBadge: "已安装",
			stars: "{count} 星",
			details: "详情",
			copyId: "复制 ID",
			copyAgent: "复制给 Agent",
			install: "安装",
			uninstall: "卸载",
			installing: "安装中…",
			uninstalling: "卸载中…",
			installSuccess: "已安装，重启后生效",
			uninstallSuccess: "已卸载，重启后生效",
			installSuccessManual: "已安装，需手动重启 DSH 生效",
			uninstallSuccessManual: "已卸载，需手动重启 DSH 生效",
			restartManualHint: "当前 DSH 未提供自动重启能力：请回到运行 DSH 的终端按 Ctrl+C，再重新执行原来的启动命令（如 npx @deepseek-ai/dsh web）。",
			copyRestartHint: "复制重启说明",
			installSuccessLive: "已安装并生效，刷新页面即可看到界面",
			uninstallSuccessLive: "已卸载并生效，刷新页面即可更新界面",
			reloadPage: "刷新页面",
			actionFailed: "操作失败",
			copyError: "复制错误信息",
			restart: "重启应用",
			dismiss: "关闭",
			restartConfirmTitle: "确认重启",
			restartRunning: "有 {count} 个 Agent 正在运行，重启会中断它们。",
			restartSafe: "当前没有运行中的会话，可以安全重启。",
			restartUnavailable: "无法读取运行状态，仍可继续。",
			restartAcknowledge: "我知道重启会中断正在运行的对话",
			restartConfirm: "确认重启",
			restartCancel: "取消",
			compatTitle: "版本可能不匹配",
			compatSummary: "该插件声明的 DSH 内置包版本与当前运行的版本不一致。安装后可能在启动时报错，并影响其他插件加载。",
			compatRow: "{name}：声明 {expected}，当前 {actual}",
			compatVersions: "声明 {expected} · 当前 {actual}",
			compatConfirm: "仍要安装",
			compatCancel: "取消安装",
			compatCopy: "复制诊断信息",
			copyInstallCommand: "复制安装命令",
			copyUninstallCommand: "复制卸载命令",
			copyLoaded: "复制已加载 {loaded}/{total} 项 (for Agent)",
			copyAgentList: "复制给 Agent",
			copied: "已复制",
			copyFailed: "复制失败",
			openRepo: "打开仓库",
			moreActions: "更多操作",
			restartFailed: "重启失败",
			loadFailed: "该插件无法在当前 harness 上加载，已撤销安装",
			loadFailedStuck: "该插件无法在当前 harness 上加载，且撤销失败，请按提示手动卸载后再启动",
			settingsCredentialNoStar: "该 token 无法 Star：经典 token 需勾选 public_repo，细粒度 token 需要 Starring 用户权限（写）。",
			star: "Star",
			starred: "已 Star",
			starFailed: "Star 失败",
			detailTitle: "插件详情",
			close: "关闭",
			authorLabel: "作者",
			categoryLabel: "分类",
			languageLabel: "语言",
			scoreLabel: "质量评分",
			gradeLabel: "评级",
			contributorsLabel: "贡献者",
			tagsLabel: "标签",
			riskLabel: "风险提示",
			highlightsLabel: "亮点",
			introLabel: "简介",
			commandLabel: "终端命令",
			notInstallable: "该仓库不可直接安装",
			detailError: "详情加载失败。",
			detailRetry: "重试",
			detailClose: "关闭",
			overlayTitle: "插件市场",
			refreshSummary: "（{count}个插件，{relative}前更新）",
			refreshNever: "（{count}个插件，尚未更新）",
			refreshAction: "从云端同步最新插件数据",
			refreshSyncingProgress: "正在同步（{synced} / {total}）……",
			refreshFailed: "同步失败，继续使用本地数据",
			refreshFailedDetail: "同步失败：{reason}",
			relativeMinute: "不到1分钟",
			relativeMinutes: "{count}分钟",
			relativeHours: "{count}小时",
			relativeDays: "{count}天",
			settingsTitle: "插件市场",
			settingsCardDescription: "本地优先插件目录的数据来源与同步方式。",
			settingsExpand: "展开设置",
			settingsCollapse: "收起设置",
			settingsUnsaved: "未保存",
			settingsOverridden: "已覆盖",
			settingsReset: "恢复默认",
			settingsReadOnly: "本部署的设置为只读。",
			settingsSaveFailed: "本部署没有接受这些值，已保留供你修改。",
			settingsDiscard: "放弃修改",
			settingsSave: "保存",
			settingsSaving: "保存中…",
			settingsProvider: "数据来源",
			settingsProviderDescription: "市场检索使用该来源同步到本地的完整目录。",
			settingsProviderDshfind: "dshfind 插件目录",
			settingsProviderGithub: "GitHub Topic（dsh-plugin）",
			settingsGithubToken: "GitHub Token",
			settingsGithubTokenConfigured: "已配置",
			settingsGithubTokenMissing: "未配置",
			settingsGithubTokenPlaceholder: "粘贴新的 token",
			settingsGithubTokenDescription: "仅写入本机凭据存储；页面不会读取或显示原值。",
			settingsGithubTokenHelp: "创建 GitHub Token",
			settingsCredentialTest: "测试",
			settingsCredentialTesting: "测试中…",
			settingsCredentialValid: "Token 有效，当前账号：{account}",
			settingsCredentialInvalid: "Token 无效：{reason}",
			settingsStartupSync: "启动后静默更新",
			settingsStartupSyncDescription: "每次应用启动后检查增量；失败时继续使用现有本地数据。",
			tagsMore: "+{count}",
			languageUnknown: "未知",
			archivedBadge: "已归档",
			riskyBadge: "有风险",
			officialBadge: "官方",
			featuredBadge: "精选",
			mergedNote: "多关键词已合并重排（前 4 个词）"
		};
		/** English dictionary checked against the Chinese key set. */
		const en = {
			tab: "Plugin market",
			sidebarEntry: "Plugin market",
			searchPlaceholder: "Search plugins",
			searchSyntaxLabel: "Syntax",
			searchSyntaxHelp: "AND, OR, -exclude, and \"exact phrase\"",
			searchFieldsLabel: "Fields",
			searchFieldsHelp: "category, owner, language, grade, and tag; stars and score accept numeric comparisons",
			total: "{count} plugins",
			sortLabel: "Sort",
			sortDimension: "Dimension",
			sortDirection: "Direction",
			sortStars: "Popularity",
			sortUpdated: "Updated",
			sortScore: "Score",
			sortName: "Name",
			orderDesc: "Desc",
			orderAsc: "Asc",
			filterLabel: "Filters",
			filterActive: "Filters ({count})",
			filterCategory: "Category",
			filterOwner: "Author",
			filterLanguage: "Language",
			filterGrade: "Grade",
			filterFeatured: "Featured",
			filterOfficial: "Official",
			filterInstallable: "Installable",
			filterInstalled: "Installed",
			filterClear: "Clear panel filters",
			searchFiltersOverride: "Field filters in the search box take precedence; edit the search text to remove them.",
			gradeNone: "Ungraded",
			loading: "Loading plugins…",
			loadMore: "Load more",
			loadingMore: "Loading more…",
			loadedCount: "{count} loaded",
			empty: "No matching plugins.",
			emptyCatalog: "There is no local plugin data yet. Sync it from the cloud first.",
			emptySyncing: "Syncing plugins. Downloaded data will appear here as it arrives.",
			error: "Failed to load. Check your network and retry.",
			retry: "Retry",
			exhausted: "All {count} plugins shown",
			installedBadge: "Installed",
			stars: "{count} stars",
			details: "Details",
			copyId: "Copy ID",
			copyAgent: "Copy for Agent",
			install: "Install",
			uninstall: "Uninstall",
			installing: "Installing…",
			uninstalling: "Uninstalling…",
			installSuccess: "Installed — takes effect after restart",
			uninstallSuccess: "Removed — takes effect after restart",
			installSuccessManual: "Installed — restart DSH yourself to apply",
			uninstallSuccessManual: "Removed — restart DSH yourself to apply",
			restartManualHint: "This DSH launcher cannot restart itself: press Ctrl+C in the terminal running DSH, then run your start command again (e.g. npx @deepseek-ai/dsh web).",
			copyRestartHint: "Copy restart steps",
			installSuccessLive: "Installed and active — reload the page to see it",
			uninstallSuccessLive: "Removed and stopped — reload the page to refresh it",
			reloadPage: "Reload page",
			actionFailed: "Operation failed",
			copyError: "Copy error",
			restart: "Restart app",
			dismiss: "Dismiss",
			restartConfirmTitle: "Confirm restart",
			restartRunning: "{count} agent(s) are running; restarting interrupts them.",
			restartSafe: "No conversations are running; a restart is safe.",
			restartUnavailable: "Could not read the running state; you may still continue.",
			restartAcknowledge: "I understand restarting interrupts running conversations",
			restartConfirm: "Restart now",
			restartCancel: "Cancel",
			compatTitle: "Versions may not match",
			compatSummary: "This plugin declares DSH core package versions that differ from the running ones. Installing it may fail at startup and stop other plugins from loading.",
			compatRow: "{name}: declares {expected}, running {actual}",
			compatVersions: "declares {expected} · running {actual}",
			compatConfirm: "Install anyway",
			compatCancel: "Cancel install",
			compatCopy: "Copy diagnostics",
			copyInstallCommand: "Copy install command",
			copyUninstallCommand: "Copy uninstall command",
			copyLoaded: "Copy loaded {loaded}/{total} (for Agent)",
			copyAgentList: "Copy for Agent",
			copied: "Copied",
			copyFailed: "Copy failed",
			openRepo: "Open repository",
			moreActions: "More actions",
			restartFailed: "Restart failed",
			loadFailed: "This plugin cannot load in this harness — the install was undone",
			loadFailedStuck: "This plugin cannot load in this harness, and undoing the install failed — remove it as shown before starting again",
			settingsCredentialNoStar: "This token cannot star: a classic token needs the public_repo scope, a fine-grained token needs Starring (write).",
			star: "Star",
			starred: "Starred",
			starFailed: "Star failed",
			detailTitle: "Plugin details",
			close: "Close",
			authorLabel: "Author",
			categoryLabel: "Category",
			languageLabel: "Language",
			scoreLabel: "Quality score",
			gradeLabel: "Grade",
			contributorsLabel: "Contributors",
			tagsLabel: "Tags",
			riskLabel: "Risk note",
			highlightsLabel: "Highlights",
			introLabel: "Introduction",
			commandLabel: "Terminal command",
			notInstallable: "This repository is not directly installable",
			detailError: "Failed to load details.",
			detailRetry: "Retry",
			detailClose: "Close",
			overlayTitle: "Plugin market",
			refreshSummary: "({count} plugins, updated {relative} ago)",
			refreshNever: "({count} plugins, not updated yet)",
			refreshAction: "Sync the latest plugin data from the cloud",
			refreshSyncingProgress: "Syncing ({synced} / {total})…",
			refreshFailed: "Sync failed; continuing with local data",
			refreshFailedDetail: "Sync failed: {reason}",
			relativeMinute: "less than 1 minute",
			relativeMinutes: "{count} minutes",
			relativeHours: "{count} hours",
			relativeDays: "{count} days",
			settingsTitle: "Plugin market",
			settingsCardDescription: "Data sources and synchronization for the local-first plugin catalog.",
			settingsExpand: "Show settings",
			settingsCollapse: "Hide settings",
			settingsUnsaved: "Unsaved",
			settingsOverridden: "Overridden",
			settingsReset: "Reset to default",
			settingsReadOnly: "This deployment stores settings read-only.",
			settingsSaveFailed: "The deployment did not accept these values; they were left for you to correct.",
			settingsDiscard: "Discard",
			settingsSave: "Save",
			settingsSaving: "Saving…",
			settingsProvider: "Data source",
			settingsProviderDescription: "Marketplace queries use the complete local catalog synchronized from this source.",
			settingsProviderDshfind: "dshfind plugin catalog",
			settingsProviderGithub: "GitHub Topic (dsh-plugin)",
			settingsGithubToken: "GitHub token",
			settingsGithubTokenConfigured: "Configured",
			settingsGithubTokenMissing: "Not configured",
			settingsGithubTokenPlaceholder: "Paste a new token",
			settingsGithubTokenDescription: "Written only to local credential storage; the page never reads or reveals the stored value.",
			settingsGithubTokenHelp: "Create a GitHub token",
			settingsCredentialTest: "Test",
			settingsCredentialTesting: "Testing…",
			settingsCredentialValid: "Token is valid for {account}.",
			settingsCredentialInvalid: "Token is invalid: {reason}",
			settingsStartupSync: "Sync silently after startup",
			settingsStartupSyncDescription: "Check for provider changes after every app start; keep existing local data on failure.",
			tagsMore: "+{count}",
			languageUnknown: "Unknown",
			archivedBadge: "Archived",
			riskyBadge: "Risky",
			officialBadge: "Official",
			featuredBadge: "Featured",
			mergedNote: "Multi-keyword results merged and re-ranked (first 4 terms)"
		};
		//#endregion
		//#region src/client/copy-feedback.ts
		/**
		* Copy-to-clipboard-with-feedback hook shared by the marketplace controls:
		* writes the given text through the shared clipboard helper and flips a
		* transient `copied` flag for one second on success. A refused write leaves
		* the flag untouched, so a control never claims a copy the host declined.
		*/
		/** How long the `copied` flag stays true after a successful write, in ms. */
		const COPIED_FEEDBACK_MS = 1e3;
		/**
		* Copy `text` to the clipboard with one-second success feedback.
		* @param text - the text to write on copy.
		* @returns the `copied` flag and the `onCopy` handler.
		*/
		function useMarketCopyFeedback(text) {
			const [copied, setCopied] = (0, react.useState)(false);
			return {
				copied,
				onCopy: (0, react.useCallback)(() => {
					if (copied) return;
					(0, _deepseek_ai_dsh_client_ui_primitives.writeClipboard)(text).then((ok) => {
						if (!ok) return;
						setCopied(true);
						window.setTimeout(() => {
							setCopied(false);
						}, COPIED_FEEDBACK_MS);
					});
				}, [copied, text])
			};
		}
		//#endregion
		//#region node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
		function r(e) {
			var t, f, n = "";
			if ("string" == typeof e || "number" == typeof e) n += e;
			else if ("object" == typeof e) if (Array.isArray(e)) {
				var o = e.length;
				for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
			} else for (f in e) e[f] && (n && (n += " "), n += f);
			return n;
		}
		function clsx() {
			for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
			return n;
		}
		//#endregion
		//#region src/client/action-banner.tsx
		/**
		* Label an in-flight package operation. The CLI reports nothing before it
		* exits, so the elapsed second count carries the liveness the label cannot.
		*/
		function runningLabel(action, t, elapsedSeconds = 0) {
			const label = action.kind === "install" ? t("installing") : t("uninstalling");
			return elapsedSeconds <= 0 ? label : `${label} ${String(elapsedSeconds)}s`;
		}
		/** Build the diagnostic clipboard payload of a failed action. */
		function errorCopyText(action) {
			return [
				`${action.message === "restart-failed" ? "Restart" : action.message === "load-failed" || action.message === "load-failed-stuck" ? "Load" : action.kind === "install" ? "Install" : "Uninstall"} failed: ${action.fullName}`,
				action.command === void 0 ? null : `Command: ${action.command}`,
				`Status: ${action.message}`,
				action.detail === void 0 ? null : `Error:\n${action.detail}`
			].filter((line) => line !== null).join("\n");
		}
		/** Render one settled package action and its next step. */
		function ActionBanner({ action, restartMode, onRestart, onDismissAction, t, css }) {
			const errorCopy = useMarketCopyFeedback(errorCopyText(action));
			const hintCopy = useMarketCopyFeedback(action.detail === void 0 ? t("restartManualHint") : `${t("restartManualHint")}\n${action.detail}`);
			const success = action.status === "ok";
			const live = success && action.hotMounted === true;
			const manual = success && !live && restartMode === "manual";
			const text = success ? live ? action.kind === "install" ? t("installSuccessLive") : t("uninstallSuccessLive") : manual ? action.kind === "install" ? t("installSuccessManual") : t("uninstallSuccessManual") : action.kind === "install" ? t("installSuccess") : t("uninstallSuccess") : action.message === "not-installable" ? t("notInstallable") : action.message === "restart-failed" ? t("restartFailed") : action.message === "load-failed" ? t("loadFailed") : action.message === "load-failed-stuck" ? t("loadFailedStuck") : t("actionFailed");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: css.actionBanner,
				"data-tone": success ? "ok" : "error",
				role: "status",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: css.actionText,
						children: text
					}),
					live ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: css.action,
						onClick: () => {
							window.location.reload();
						},
						children: t("reloadPage")
					}) : manual ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: css.action,
						onClick: hintCopy.onCopy,
						title: t("restartManualHint"),
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, { size: 14 }), hintCopy.copied ? t("copied") : t("copyRestartHint")]
					}) : success ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: css.action,
						onClick: onRestart,
						children: t("restart")
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: css.action,
						onClick: errorCopy.onCopy,
						"aria-label": t("copyError"),
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, { size: 14 }), errorCopy.copied ? t("copied") : t("copyError")]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: css.action,
						onClick: onDismissAction,
						children: t("dismiss")
					}),
					manual ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
						className: css.errorDetail,
						children: t("restartManualHint")
					}) : null,
					action.detail === void 0 || action.detail === "" ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
						className: css.errorDetail,
						children: action.detail
					})
				]
			});
		}
		//#endregion
		//#region src/client/icons.tsx
		const STAR_PATH = "M8 1.6l1.86 3.77 4.16.61-3.01 2.93.71 4.14L8 11.1l-3.72 1.95.71-4.14L1.98 5.98l4.16-.61L8 1.6z";
		/** Hollow star: the repository is not starred by the authenticated user. */
		function IconStarOutline16({ size = 16, className }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: size,
				height: size,
				className,
				viewBox: "0 0 16 16",
				fill: "none",
				xmlns: "http://www.w3.org/2000/svg",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: STAR_PATH,
					stroke: "currentColor",
					strokeWidth: "1.2",
					strokeLinejoin: "round"
				})
			});
		}
		/** Filled star: the repository is starred by the authenticated user. */
		function IconStarFill16({ size = 16, className }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				width: size,
				height: size,
				className,
				viewBox: "0 0 16 16",
				fill: "none",
				xmlns: "http://www.w3.org/2000/svg",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: STAR_PATH,
					fill: "currentColor",
					stroke: "currentColor",
					strokeWidth: "1.2",
					strokeLinejoin: "round"
				})
			});
		}
		//#endregion
		//#region src/client/use-elapsed.ts
		/**
		* Elapsed-time readout for an operation whose only progress signal is that it
		* is still running: the `dsh plugin` CLI reports nothing until it exits, so the
		* marketplace shows how long it has been working instead of a fake percentage.
		*/
		/** Refresh cadence of the readout. */
		const TICK_MS = 1e3;
		/**
		* Whole seconds since `startedAt`, refreshed once per second.
		* @param startedAt - epoch milliseconds the operation started, or undefined
		*   when nothing is running.
		* @returns elapsed whole seconds; zero when nothing is running.
		*/
		function useElapsedSeconds(startedAt) {
			const [now, setNow] = (0, react.useState)(() => Date.now());
			(0, react.useEffect)(() => {
				if (startedAt === void 0) return void 0;
				setNow(Date.now());
				const timer = setInterval(() => {
					setNow(Date.now());
				}, TICK_MS);
				return () => {
					clearInterval(timer);
				};
			}, [startedAt]);
			if (startedAt === void 0) return 0;
			return Math.max(0, Math.floor((now - startedAt) / 1e3));
		}
		//#endregion
		//#region \0dsh-css:/Users/mark/lovstudio/dsh-plugins/dsh-plugin-marketplace/src/client/MarketplaceCard.module.css.mjs
		const css$5 = "._29AfwG_card{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:10px;flex-direction:column;gap:6px;padding:10px 12px;display:flex}._29AfwG_body{text-align:left;min-width:0;color:inherit;cursor:pointer;background:0 0;border:none;flex-direction:column;gap:4px;padding:0;display:flex}._29AfwG_titleRow{align-items:center;gap:6px;min-width:0;display:flex}._29AfwG_name{color:var(--dsw-alias-label-primary);white-space:nowrap;text-overflow:ellipsis;font-size:14px;font-weight:600;line-height:22px;overflow:hidden}._29AfwG_grade{box-sizing:border-box;min-width:18px;height:18px;color:var(--dsw-alias-label-primary);border-radius:4px;flex:none;justify-content:center;align-items:center;padding:0 4px;font-size:11px;font-weight:700;line-height:18px;display:inline-flex}._29AfwG_grade[data-grade=S]{background:var(--dsw-alias-state-success-secondary)}._29AfwG_grade[data-grade=A]{background:var(--dsw-alias-interactive-bg-hover-accent)}._29AfwG_grade[data-grade=B]{background:var(--dsw-alias-interactive-bg-hover)}._29AfwG_grade[data-grade=C]{background:var(--dsw-alias-state-warn-secondary)}._29AfwG_badge,._29AfwG_installed{box-sizing:border-box;border-radius:9px;flex:none;align-items:center;height:18px;padding:0 6px;font-size:11px;font-weight:500;line-height:18px;display:inline-flex}._29AfwG_badge{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}._29AfwG_installed{background:var(--dsw-alias-state-success-secondary);color:var(--dsw-alias-label-primary)}._29AfwG_metaRow{min-width:0;color:var(--dsw-alias-label-secondary);align-items:center;gap:8px;font-size:12px;line-height:18px;display:flex}._29AfwG_metaRow>*+:before{content:\"·\";color:var(--dsw-alias-label-tertiary);margin-right:8px}._29AfwG_owner{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}._29AfwG_meta{flex:none}._29AfwG_description{color:var(--dsw-alias-label-secondary);-webkit-line-clamp:2;-webkit-box-orient:vertical;margin:0;font-size:13px;line-height:20px;display:-webkit-box;overflow:hidden}._29AfwG_tagRow{align-items:center;gap:6px;min-width:0;display:flex;overflow:hidden}._29AfwG_tag{box-sizing:border-box;background:var(--dsw-alias-bg-layer-2);height:20px;color:var(--dsw-alias-label-secondary);border-radius:10px;flex:none;align-items:center;padding:0 8px;font-size:11px;line-height:20px;display:inline-flex}._29AfwG_tagMore{color:var(--dsw-alias-label-tertiary);flex:none;font-size:11px}._29AfwG_actions{border-top:1px solid var(--dsw-alias-border-l1);flex-wrap:wrap;align-items:center;gap:4px;padding-top:6px;display:flex}._29AfwG_action{height:26px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:6px;align-items:center;gap:4px;padding:0 8px;font-size:12px;line-height:26px;display:inline-flex}._29AfwG_action:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}._29AfwG_action:disabled{opacity:.6;cursor:default}._29AfwG_action:disabled:hover{color:var(--dsw-alias-label-secondary);background:0 0}._29AfwG_actionOn,._29AfwG_actionOn:hover{color:var(--dsw-alias-label-primary)}._29AfwG_actionBanner{box-sizing:border-box;border-radius:8px;flex-wrap:wrap;align-items:center;gap:8px;padding:6px 8px;font-size:12px;line-height:18px;display:flex}._29AfwG_actionBanner[data-tone=ok]{background:var(--dsw-alias-state-success-tertiary);color:var(--dsw-alias-state-success-primary)}._29AfwG_actionBanner[data-tone=error]{background:var(--dsw-alias-state-warn-tertiary);color:var(--dsw-alias-state-warn-primary)}._29AfwG_actionText{flex:1;min-width:0}._29AfwG_errorDetail{box-sizing:border-box;background:var(--dsw-alias-state-warn-secondary);min-width:0;max-height:96px;color:var(--dsw-alias-label-secondary);font-family:var(--ds-font-family-code);white-space:pre-wrap;word-break:break-word;--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2);border-radius:6px;flex-basis:100%;padding:6px 8px;font-size:11px;line-height:16px;overflow:auto}._29AfwG_spinner{animation:.9s linear infinite _29AfwG_marketSpin}@keyframes _29AfwG_marketSpin{to{transform:rotate(360deg)}}";
		const tagId$5 = "@lovstudio/dsh-plugin-marketplace/MarketplaceCard.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$5) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@lovstudio/dsh-plugin-marketplace";
			tag.dataset.pluginCss = tagId$5;
			tag.textContent = css$5;
			document.head.appendChild(tag);
		}
		var MarketplaceCard_module_css_default = {
			"action": "_29AfwG_action",
			"actionBanner": "_29AfwG_actionBanner",
			"actionOn": "_29AfwG_actionOn",
			"actions": "_29AfwG_actions",
			"actionText": "_29AfwG_actionText",
			"badge": "_29AfwG_badge",
			"body": "_29AfwG_body",
			"card": "_29AfwG_card",
			"description": "_29AfwG_description",
			"errorDetail": "_29AfwG_errorDetail",
			"grade": "_29AfwG_grade",
			"installed": "_29AfwG_installed",
			"marketSpin": "_29AfwG_marketSpin",
			"meta": "_29AfwG_meta",
			"metaRow": "_29AfwG_metaRow",
			"name": "_29AfwG_name",
			"owner": "_29AfwG_owner",
			"spinner": "_29AfwG_spinner",
			"tag": "_29AfwG_tag",
			"tagMore": "_29AfwG_tagMore",
			"tagRow": "_29AfwG_tagRow",
			"titleRow": "_29AfwG_titleRow"
		};
		//#endregion
		//#region src/client/MarketplaceCard.tsx
		/**
		* One marketplace row: identity, quality assessment, description, tags, and
		* the per-plugin actions (details, copy id, copy for agent, direct profile
		* install/uninstall, and open repository).
		*/
		/** Localized badge label of one row, when any applies. */
		function badgeLabel(t, plugin) {
			if (plugin.archived) return t("archivedBadge");
			if (plugin.isRisky) return t("riskyBadge");
			if (plugin.isOfficial) return t("officialBadge");
			if (plugin.isFeatured) return t("featuredBadge");
			return null;
		}
		/** Render one marketplace card. */
		function MarketplaceCard({ plugin, installed, locale, action, restartMode, canStar, starred, starBusy, onToggleStar, onInstall, onUninstall, onRestart, onDismissAction, onDetails, onOpenRepository, t }) {
			const [menuOpen, setMenuOpen] = (0, react.useState)(false);
			const idCopy = useMarketCopyFeedback(plugin.fullName);
			const agentCopy = useMarketCopyFeedback(pluginAgentMarkdown(plugin, locale));
			const badge = badgeLabel(t, plugin);
			const installedFlag = isInstalled(plugin, installed);
			const spec = installedFlag ? uninstallSpec(plugin, installed) : installSpec(plugin);
			const ownAction = action !== null && action.fullName === plugin.fullName ? action : null;
			const running = ownAction?.status === "running";
			const elapsed = useElapsedSeconds(running ? ownAction?.startedAt : void 0);
			const menuItems = [
				{
					id: "details",
					label: t("details"),
					icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutline16, { size: 14 })
				},
				{
					id: "copyId",
					label: idCopy.copied ? t("copied") : t("copyId"),
					icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, { size: 14 })
				},
				{
					id: "copyAgent",
					label: agentCopy.copied ? t("copied") : t("copyAgent"),
					icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, { size: 14 })
				},
				{
					id: "openRepo",
					label: t("openRepo"),
					icon: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRightUpOutline14, { size: 12 })
				}
			];
			const onMenuSelect = (id) => {
				setMenuOpen(false);
				if (id === "details") onDetails(plugin.fullName);
				else if (id === "copyId") idCopy.onCopy();
				else if (id === "copyAgent") agentCopy.onCopy();
				else if (id === "openRepo") onOpenRepository(plugin.repositoryUrl);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
				className: MarketplaceCard_module_css_default.card,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: MarketplaceCard_module_css_default.body,
						onClick: () => {
							onDetails(plugin.fullName);
						},
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: MarketplaceCard_module_css_default.titleRow,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: MarketplaceCard_module_css_default.name,
										children: plugin.name
									}),
									plugin.grade === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: MarketplaceCard_module_css_default.grade,
										"data-grade": plugin.grade,
										children: plugin.grade
									}),
									badge === null ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: MarketplaceCard_module_css_default.badge,
										children: badge
									}),
									installedFlag ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: MarketplaceCard_module_css_default.installed,
										children: t("installedBadge")
									}) : null
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: MarketplaceCard_module_css_default.metaRow,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: MarketplaceCard_module_css_default.owner,
										children: plugin.fullName
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: MarketplaceCard_module_css_default.meta,
										children: t("stars", { count: String(plugin.stars) })
									}),
									plugin.language === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: MarketplaceCard_module_css_default.meta,
										children: plugin.language
									}),
									plugin.score === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										className: MarketplaceCard_module_css_default.meta,
										children: [
											t("scoreLabel"),
											" ",
											plugin.score
										]
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: MarketplaceCard_module_css_default.description,
								children: plugin.description
							}),
							plugin.tags.length === 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: MarketplaceCard_module_css_default.tagRow,
								children: [plugin.tags.slice(0, 3).map((tag) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MarketplaceCard_module_css_default.tag,
									children: tag
								}, tag)), plugin.tags.length > 3 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MarketplaceCard_module_css_default.tagMore,
									children: t("tagsMore", { count: String(plugin.tags.length - 3) })
								}) : null]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: MarketplaceCard_module_css_default.actions,
						children: [
							canStar ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: clsx(MarketplaceCard_module_css_default.action, starred && MarketplaceCard_module_css_default.actionOn),
								disabled: starBusy,
								"aria-pressed": starred,
								onClick: () => {
									onToggleStar(plugin.fullName);
								},
								children: [starred ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconStarFill16, { size: 14 }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconStarOutline16, { size: 14 }), starred ? t("starred") : t("star")]
							}) : null,
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: MarketplaceCard_module_css_default.action,
								disabled: spec === null || running,
								onClick: () => {
									if (installedFlag) onUninstall(plugin.fullName);
									else onInstall(plugin.fullName);
								},
								"aria-label": installedFlag ? t("uninstall") : t("install"),
								children: [running ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
									size: 14,
									className: MarketplaceCard_module_css_default.spinner
								}) : installedFlag ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconTrashOutline16, { size: 14 }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconDownloadOutline16, { size: 14 }), running && ownAction !== null ? runningLabel(ownAction, t, elapsed) : installedFlag ? t("uninstall") : t("install")]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
								open: menuOpen,
								anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: MarketplaceCard_module_css_default.action,
									"aria-label": t("moreActions"),
									onClick: () => {
										setMenuOpen((open) => !open);
									},
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconEllipsisOutline16, { size: 14 })
								}),
								items: menuItems,
								onSelect: onMenuSelect,
								onClose: () => {
									setMenuOpen(false);
								},
								align: "end",
								portal: true,
								compact: true
							})
						]
					}),
					ownAction !== null && ownAction.status !== "running" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ActionBanner, {
						action: ownAction,
						restartMode,
						onRestart,
						onDismissAction,
						t,
						css: MarketplaceCard_module_css_default
					}) : null
				]
			});
		}
		//#endregion
		//#region \0dsh-css:/Users/mark/lovstudio/dsh-plugins/dsh-plugin-marketplace/src/client/MarketplaceDetail.module.css.mjs
		const css$4 = ".pahW1a_backdrop{z-index:30;box-sizing:border-box;background:var(--dsw-alias-bg-mask-1);justify-content:center;align-items:center;padding:24px;display:flex;position:fixed;inset:0}.pahW1a_dialog{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l3);background:var(--dsw-alias-bg-overlay);width:min(720px,92vw);max-height:86vh;color:var(--dsw-alias-label-primary);box-shadow:var(--dsw-shadow-lv3);--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2);border-radius:14px;flex-direction:column;gap:12px;padding:16px 18px;display:flex;overflow:auto}.pahW1a_header{justify-content:space-between;align-items:flex-start;gap:12px;display:flex}.pahW1a_heading{align-items:center;gap:8px;min-width:0;display:flex}.pahW1a_name{white-space:nowrap;text-overflow:ellipsis;font-size:16px;font-weight:600;line-height:24px;overflow:hidden}.pahW1a_grade{box-sizing:border-box;border-radius:4px;flex:none;justify-content:center;align-items:center;min-width:18px;height:18px;padding:0 4px;font-size:11px;font-weight:600;line-height:18px;display:inline-flex}.pahW1a_grade[data-grade=S]{background:var(--dsw-alias-state-success-secondary);color:var(--dsw-alias-state-success-primary)}.pahW1a_grade[data-grade=A]{background:var(--dsw-alias-interactive-bg-hover-accent);color:var(--dsw-alias-brand-primary)}.pahW1a_grade[data-grade=B]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}.pahW1a_grade[data-grade=C]{background:var(--dsw-alias-state-warn-secondary);color:var(--dsw-alias-state-warn-primary)}.pahW1a_close{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:50%;flex:none;justify-content:center;align-items:center;display:inline-flex}.pahW1a_close:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.pahW1a_meta{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:10px;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px 16px;margin:0;padding:10px 12px;display:grid}.pahW1a_metaItem{flex-direction:column;gap:2px;min-width:0;display:flex}.pahW1a_metaItem dt{color:var(--dsw-alias-label-tertiary);font-size:11px}.pahW1a_metaItem dd{white-space:nowrap;text-overflow:ellipsis;margin:0;font-size:13px;line-height:20px;overflow:hidden}.pahW1a_intro{color:var(--dsw-alias-label-primary);margin:0;font-size:13px;line-height:20px}.pahW1a_highlights{color:var(--dsw-alias-label-secondary);margin:0;padding-left:18px;font-size:13px;line-height:20px}.pahW1a_description{color:var(--dsw-alias-label-secondary);margin:0;font-size:13px;line-height:20px}.pahW1a_tags{flex-wrap:wrap;align-items:center;gap:6px;display:flex}.pahW1a_tagsLabel{color:var(--dsw-alias-label-tertiary);font-size:12px}.pahW1a_tag{box-sizing:border-box;background:var(--dsw-alias-bg-layer-2);height:20px;color:var(--dsw-alias-label-secondary);border-radius:10px;align-items:center;padding:0 8px;font-size:11px;line-height:20px;display:inline-flex}.pahW1a_risk{box-sizing:border-box;border:1px solid var(--dsw-alias-state-warn-secondary);background:var(--dsw-alias-state-warn-tertiary);color:var(--dsw-alias-state-warn-primary);border-radius:8px;align-items:flex-start;gap:6px;margin:0;padding:8px 10px;font-size:12px;line-height:18px;display:flex}.pahW1a_install{flex-direction:column;gap:4px;display:flex}.pahW1a_installLabel{color:var(--dsw-alias-label-tertiary);font-size:12px}.pahW1a_command{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-markdown-code-block);color:var(--dsw-alias-label-primary);font-family:var(--ds-font-family-code);overflow-wrap:anywhere;border-radius:8px;padding:8px 10px;font-size:12px;line-height:18px;display:block}.pahW1a_notInstallable{color:var(--dsw-alias-label-secondary);font-size:13px}.pahW1a_actions{border-top:1px solid var(--dsw-alias-border-l1);flex-wrap:wrap;align-items:center;gap:4px;padding-top:6px;display:flex}.pahW1a_action{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-button-elevated-fill);height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;border-radius:8px;align-items:center;gap:4px;padding:0 10px;font-size:12px;line-height:28px;display:inline-flex}.pahW1a_action:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.pahW1a_action:disabled{opacity:.6;cursor:default}.pahW1a_action:disabled:hover{color:var(--dsw-alias-label-secondary);background:0 0}.pahW1a_actionBanner{box-sizing:border-box;border-radius:8px;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 10px;font-size:12px;line-height:18px;display:flex}.pahW1a_actionBanner[data-tone=ok]{background:var(--dsw-alias-state-success-tertiary);color:var(--dsw-alias-state-success-primary)}.pahW1a_actionBanner[data-tone=error]{background:var(--dsw-alias-state-warn-tertiary);color:var(--dsw-alias-state-warn-primary)}.pahW1a_actionText{flex:1;min-width:0}.pahW1a_errorDetail{box-sizing:border-box;background:var(--dsw-alias-state-warn-secondary);min-width:0;max-height:96px;color:var(--dsw-alias-label-secondary);font-family:var(--ds-font-family-code);white-space:pre-wrap;word-break:break-word;--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2);border-radius:6px;flex-basis:100%;padding:6px 8px;font-size:11px;line-height:16px;overflow:auto}.pahW1a_center{flex-direction:column;align-items:center;gap:8px;padding:24px 0;display:flex}.pahW1a_error{color:var(--dsw-alias-state-error-primary);margin:0;font-size:13px}.pahW1a_actionOn,.pahW1a_actionOn:hover{color:var(--dsw-alias-label-primary)}.pahW1a_spinner{animation:.9s linear infinite pahW1a_marketSpin}@keyframes pahW1a_marketSpin{to{transform:rotate(360deg)}}";
		const tagId$4 = "@lovstudio/dsh-plugin-marketplace/MarketplaceDetail.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$4) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@lovstudio/dsh-plugin-marketplace";
			tag.dataset.pluginCss = tagId$4;
			tag.textContent = css$4;
			document.head.appendChild(tag);
		}
		var MarketplaceDetail_module_css_default = {
			"action": "pahW1a_action",
			"actionBanner": "pahW1a_actionBanner",
			"actionOn": "pahW1a_actionOn",
			"actions": "pahW1a_actions",
			"actionText": "pahW1a_actionText",
			"backdrop": "pahW1a_backdrop",
			"center": "pahW1a_center",
			"close": "pahW1a_close",
			"command": "pahW1a_command",
			"description": "pahW1a_description",
			"dialog": "pahW1a_dialog",
			"error": "pahW1a_error",
			"errorDetail": "pahW1a_errorDetail",
			"grade": "pahW1a_grade",
			"header": "pahW1a_header",
			"heading": "pahW1a_heading",
			"highlights": "pahW1a_highlights",
			"install": "pahW1a_install",
			"installLabel": "pahW1a_installLabel",
			"intro": "pahW1a_intro",
			"marketSpin": "pahW1a_marketSpin",
			"meta": "pahW1a_meta",
			"metaItem": "pahW1a_metaItem",
			"name": "pahW1a_name",
			"notInstallable": "pahW1a_notInstallable",
			"risk": "pahW1a_risk",
			"spinner": "pahW1a_spinner",
			"tag": "pahW1a_tag",
			"tags": "pahW1a_tags",
			"tagsLabel": "pahW1a_tagsLabel"
		};
		//#endregion
		//#region src/client/MarketplaceDetail.tsx
		/**
		* Detail dialog of one plugin: localized copy, quality assessment, direct
		* package action, and the same copy actions as the card. Rendered by the
		* marketplace surface as a fixed overlay; Escape and backdrop clicks close it.
		*/
		/** The localized copy block of a detail payload for the active locale. */
		function localizedOf(detail, locale) {
			return detail.i18n?.[locale] ?? {};
		}
		/** Render the detail dialog. */
		function MarketplaceDetail({ detail, status, locale, installed, action, restartMode, canStar, starred, starBusy, onToggleStar, onInstall, onUninstall, onRestart, onDismissAction, onClose, onRetry, onOpenRepository, t }) {
			(0, react.useEffect)(() => {
				const onKeyDown = (event) => {
					if (event.key === "Escape") onClose();
				};
				window.addEventListener("keydown", onKeyDown);
				return () => {
					window.removeEventListener("keydown", onKeyDown);
				};
			}, [onClose]);
			const copy = detail === null ? void 0 : localizedOf(detail, locale);
			const install = detail?.install;
			const installedFlag = detail !== null && isInstalled(detail, installed);
			const command = detail === null ? null : installedFlag ? uninstallCommand(detail, installed) : installCommand(detail);
			const spec = detail === null ? null : installedFlag ? uninstallSpec(detail, installed) : installSpec(detail);
			const ownAction = action !== null && detail !== null && action.fullName === detail.fullName ? action : null;
			const running = ownAction?.status === "running";
			const elapsed = useElapsedSeconds(running ? ownAction?.startedAt : void 0);
			const agentCopy = useMarketCopyFeedback(detail === null ? "" : pluginAgentMarkdown(detail, locale));
			const idCopy = useMarketCopyFeedback(detail?.fullName ?? "");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: MarketplaceDetail_module_css_default.backdrop,
				role: "presentation",
				onMouseDown: (event) => {
					if (event.target === event.currentTarget) onClose();
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
					className: MarketplaceDetail_module_css_default.dialog,
					role: "dialog",
					"aria-modal": "true",
					"aria-label": t("detailTitle"),
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
							className: MarketplaceDetail_module_css_default.header,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: MarketplaceDetail_module_css_default.heading,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MarketplaceDetail_module_css_default.name,
									children: detail?.name ?? "…"
								}), detail?.grade === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MarketplaceDetail_module_css_default.grade,
									"data-grade": detail.grade,
									children: detail.grade
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: MarketplaceDetail_module_css_default.close,
								onClick: onClose,
								"aria-label": t("detailClose"),
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 16 })
							})]
						}),
						status === "loading" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: MarketplaceDetail_module_css_default.center,
							children: t("loading")
						}) : null,
						status === "error" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: MarketplaceDetail_module_css_default.center,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: MarketplaceDetail_module_css_default.error,
								children: t("detailError")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: MarketplaceDetail_module_css_default.action,
								onClick: onRetry,
								children: t("detailRetry")
							})]
						}) : null,
						status === "ready" && detail !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("dl", {
								className: MarketplaceDetail_module_css_default.meta,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: MarketplaceDetail_module_css_default.metaItem,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("authorLabel") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: detail.owner })]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: MarketplaceDetail_module_css_default.metaItem,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("categoryLabel") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: detail.category === void 0 || detail.category.length === 0 ? "—" : detail.category })]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: MarketplaceDetail_module_css_default.metaItem,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("languageLabel") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: detail.language ?? t("languageUnknown") })]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: MarketplaceDetail_module_css_default.metaItem,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("gradeLabel") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: detail.grade ?? t("gradeNone") })]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: MarketplaceDetail_module_css_default.metaItem,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("scoreLabel") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: detail.score === void 0 ? "—" : String(detail.score) })]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: MarketplaceDetail_module_css_default.metaItem,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("stars", { count: String(detail.stars) }) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: String(detail.stars) })]
									}),
									detail.contributors === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: MarketplaceDetail_module_css_default.metaItem,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("contributorsLabel") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: String(detail.contributors) })]
									})
								]
							}),
							copy?.intro === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: MarketplaceDetail_module_css_default.intro,
								children: copy.intro
							}),
							copy?.highlights === void 0 || copy.highlights.length === 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
								className: MarketplaceDetail_module_css_default.highlights,
								children: copy.highlights.map((highlight) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: highlight }, highlight))
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: MarketplaceDetail_module_css_default.description,
								children: detail.description
							}),
							detail.tags.length === 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: MarketplaceDetail_module_css_default.tags,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MarketplaceDetail_module_css_default.tagsLabel,
									children: t("tagsLabel")
								}), detail.tags.map((tag) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MarketplaceDetail_module_css_default.tag,
									children: tag
								}, tag))]
							}),
							detail.isRisky ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
								className: MarketplaceDetail_module_css_default.risk,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, { size: 14 }), detail.riskNote !== void 0 ? detail.riskNote : t("riskyBadge")]
							}) : null,
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: MarketplaceDetail_module_css_default.install,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MarketplaceDetail_module_css_default.installLabel,
									children: t("commandLabel")
								}), command === null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MarketplaceDetail_module_css_default.notInstallable,
									children: t("notInstallable")
								}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
									className: MarketplaceDetail_module_css_default.command,
									children: command
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: MarketplaceDetail_module_css_default.actions,
								children: [
									canStar ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: clsx(MarketplaceDetail_module_css_default.action, starred && MarketplaceDetail_module_css_default.actionOn),
										disabled: starBusy,
										"aria-pressed": starred,
										onClick: () => {
											onToggleStar(detail.fullName);
										},
										children: [starred ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconStarFill16, { size: 14 }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(IconStarOutline16, { size: 14 }), starred ? t("starred") : t("star")]
									}) : null,
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: MarketplaceDetail_module_css_default.action,
										onClick: idCopy.onCopy,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, { size: 14 }), idCopy.copied ? t("copied") : t("copyId")]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: MarketplaceDetail_module_css_default.action,
										onClick: agentCopy.onCopy,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, { size: 14 }), agentCopy.copied ? t("copied") : t("copyAgent")]
									}),
									install === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: MarketplaceDetail_module_css_default.action,
										disabled: spec === null || running,
										onClick: () => {
											if (installedFlag) onUninstall(detail.fullName);
											else onInstall(detail.fullName);
										},
										children: [running ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconLoadingOutline16, {
											size: 14,
											className: MarketplaceDetail_module_css_default.spinner
										}) : installedFlag ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconTrashOutline16, { size: 14 }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconDownloadOutline16, { size: 14 }), running && ownAction !== null ? runningLabel(ownAction, t, elapsed) : installedFlag ? t("uninstall") : t("install")]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										type: "button",
										className: MarketplaceDetail_module_css_default.action,
										onClick: () => {
											onOpenRepository(detail.repositoryUrl);
										},
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRightUpOutline14, { size: 12 }), t("openRepo")]
									})
								]
							}),
							ownAction !== null && ownAction.status !== "running" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ActionBanner, {
								restartMode,
								action: ownAction,
								onRestart,
								onDismissAction,
								t,
								css: MarketplaceDetail_module_css_default
							}) : null
						] }) : null
					]
				})
			});
		}
		//#endregion
		//#region src/client/types.ts
		/** The empty filter selection. */
		const EMPTY_MARKET_FILTERS = {
			category: "",
			owner: "",
			language: "",
			grade: "",
			featured: false,
			official: false,
			installable: false
		};
		//#endregion
		//#region \0dsh-css:/Users/mark/lovstudio/dsh-plugins/dsh-plugin-marketplace/src/client/MarketplaceRoot.module.css.mjs
		const css$3 = ".qtZjWW_root{flex-direction:column;gap:8px;width:100%;min-height:0;display:flex}.qtZjWW_toolbar{z-index:2;padding:var(--dsh-market-sticky-inset,0px) 0 8px;background:var(--dsh-market-surface,var(--dsw-alias-bg-layer-1));align-items:center;gap:6px;margin-bottom:-8px;display:flex;position:sticky;top:0}.qtZjWW_toolbarControls{flex:none;align-items:center;gap:6px;display:flex}.qtZjWW_searchWrap{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);min-width:0;height:32px;color:var(--dsw-alias-label-secondary);border-radius:8px;flex:1;align-items:center;gap:6px;padding:0 10px;display:inline-flex}.qtZjWW_search{min-width:0;color:var(--dsw-alias-label-primary);background:0 0;border:none;outline:none;flex:1;font-size:13px;line-height:20px}.qtZjWW_search::placeholder{color:var(--dsw-alias-label-tertiary)}.qtZjWW_searchWrap:focus-within,.qtZjWW_filterRow:focus-within,.qtZjWW_action:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}.qtZjWW_select{box-sizing:border-box;min-width:0;height:30px;color:var(--dsw-alias-label-primary);background:0 0;border:0;outline:0;flex:1;padding:0 24px 0 0;font-size:13px}.qtZjWW_input{box-sizing:border-box;min-width:0;height:30px;color:var(--dsw-alias-label-primary);background:0 0;border:0;outline:0;flex:1;padding:0 8px 0 0;font-size:13px}.qtZjWW_acknowledgement{color:var(--dsw-alias-label-primary);cursor:pointer;align-items:center;gap:8px;margin-top:12px;font-size:13px;line-height:1.5;display:flex}.qtZjWW_acknowledgement input{width:16px;height:16px;accent-color:var(--dsw-alias-interactive-primary)}.qtZjWW_mismatchList{background:var(--dsw-alias-fill-secondary);border-radius:8px;flex-direction:column;gap:10px;max-height:220px;margin:12px 0 0;padding:10px 12px;list-style:none;display:flex;overflow-y:auto}.qtZjWW_mismatchList li{flex-direction:column;gap:2px;display:flex}.qtZjWW_mismatchName{font-family:var(--dsw-font-family-mono,ui-monospace, SFMono-Regular, Menlo, monospace);color:var(--dsw-alias-label-primary);overflow-wrap:anywhere;font-size:12px;line-height:1.4}.qtZjWW_mismatchVersions{color:var(--dsw-alias-label-secondary);font-size:11px;line-height:1.4}.qtZjWW_action{height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:0;border-radius:6px;align-items:center;gap:4px;padding:0 8px;font-size:12px;line-height:18px;display:inline-flex}.qtZjWW_action:not(:disabled):hover,.qtZjWW_action[aria-expanded=true],.qtZjWW_action[data-active=true]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.qtZjWW_toolbarAction{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);height:32px;color:var(--dsw-alias-label-primary);border-radius:8px;padding:0 12px;font-size:13px}.qtZjWW_toolbarAction:not(:disabled):hover,.qtZjWW_toolbarAction[aria-expanded=true],.qtZjWW_toolbarAction[data-active=true]{border-color:var(--dsw-alias-border-l1)}.qtZjWW_action:disabled,.qtZjWW_select:disabled,.qtZjWW_input:disabled{cursor:not-allowed;opacity:.5}.qtZjWW_filters{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:10px;gap:8px;padding:10px;display:grid}.qtZjWW_sortPanel{gap:4px;padding:8px 10px}.qtZjWW_sortRow{grid-template-columns:64px minmax(0,1fr);align-items:center;gap:8px;min-height:28px;display:grid}.qtZjWW_sortPanelLabel{color:var(--dsw-alias-label-tertiary);font-size:12px}.qtZjWW_sortChoices{flex-wrap:wrap;align-items:center;gap:2px;display:flex}.qtZjWW_sortChoice{height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:0;border-radius:6px;padding:0 8px;font-size:12px;line-height:18px}.qtZjWW_sortChoice:hover,.qtZjWW_sortChoice[aria-pressed=true]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.qtZjWW_sortChoice:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:1px}.qtZjWW_filterHint{color:var(--dsw-alias-state-warn-label);margin:0;font-size:12px;line-height:18px}.qtZjWW_filterFields{grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;display:grid}.qtZjWW_filterRow{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:8px;align-items:center;gap:8px;min-width:0;height:32px;padding-left:10px;display:flex}.qtZjWW_filterLabel{color:var(--dsw-alias-label-tertiary);white-space:nowrap;flex:none;font-size:12px}.qtZjWW_filterFooter{justify-content:space-between;align-items:center;gap:8px;min-height:28px;display:flex}.qtZjWW_checkRow{flex-wrap:wrap;align-items:center;gap:2px;display:flex}.qtZjWW_check{height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;border-radius:6px;align-items:center;gap:5px;padding:0 6px;font-size:12px;display:inline-flex}.qtZjWW_check:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.qtZjWW_check input{width:14px;height:14px;accent-color:var(--dsw-alias-interactive-primary);margin:0}.qtZjWW_filterClear{flex:none;margin-left:auto}.qtZjWW_filterClear:disabled{visibility:hidden}@media (width<=640px){.qtZjWW_filterFields{grid-template-columns:repeat(2,minmax(0,1fr))}}.qtZjWW_help{grid-template-columns:max-content minmax(0,1fr);gap:2px 8px;margin:0;font-size:12px;line-height:18px;display:grid}.qtZjWW_help dt{color:var(--dsw-alias-label-secondary);font-weight:500}.qtZjWW_help dd{min-width:0;color:var(--dsw-alias-label-tertiary);margin:0}.qtZjWW_metaRow{top:calc(var(--dsh-market-sticky-inset,0px) + 40px);z-index:1;background:var(--dsh-market-surface,var(--dsw-alias-bg-layer-1));flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin-bottom:-8px;padding-bottom:8px;display:flex;position:sticky}.qtZjWW_metaInfo{flex-wrap:wrap;align-items:center;gap:8px;min-width:0;display:flex}.qtZjWW_total{color:var(--dsw-alias-label-secondary);font-size:12px}.qtZjWW_loaded,.qtZjWW_metaSeparator{color:var(--dsw-alias-label-tertiary);font-size:12px}.qtZjWW_copyAction{color:var(--dsw-alias-label-secondary);margin-left:auto}.qtZjWW_mergedNote{color:var(--dsw-alias-state-warn-label);font-size:12px}.qtZjWW_list{flex-direction:column;gap:8px;min-height:0;display:flex}.qtZjWW_state{color:var(--dsw-alias-label-secondary);justify-content:center;align-items:center;gap:8px;margin:0;padding:16px 0;font-size:13px;display:flex}.qtZjWW_pagination{justify-content:center;min-height:1px;display:flex}.qtZjWW_starError{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-l2);border-radius:8px;flex-wrap:wrap;align-items:center;gap:8px;padding:6px 8px;display:flex}.qtZjWW_starErrorText{color:var(--dsw-alias-label-primary);font-size:12px}.qtZjWW_starErrorDetail{color:var(--dsw-alias-label-secondary);font-family:var(--dsw-font-mono,monospace);overflow-wrap:anywhere;flex-basis:100%;font-size:11px}";
		const tagId$3 = "@lovstudio/dsh-plugin-marketplace/MarketplaceRoot.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@lovstudio/dsh-plugin-marketplace";
			tag.dataset.pluginCss = tagId$3;
			tag.textContent = css$3;
			document.head.appendChild(tag);
		}
		var MarketplaceRoot_module_css_default = {
			"acknowledgement": "qtZjWW_acknowledgement",
			"action": "qtZjWW_action",
			"check": "qtZjWW_check",
			"checkRow": "qtZjWW_checkRow",
			"copyAction": "qtZjWW_copyAction",
			"filterClear": "qtZjWW_filterClear",
			"filterFields": "qtZjWW_filterFields",
			"filterFooter": "qtZjWW_filterFooter",
			"filterHint": "qtZjWW_filterHint",
			"filterLabel": "qtZjWW_filterLabel",
			"filterRow": "qtZjWW_filterRow",
			"filters": "qtZjWW_filters",
			"help": "qtZjWW_help",
			"input": "qtZjWW_input",
			"list": "qtZjWW_list",
			"loaded": "qtZjWW_loaded",
			"mergedNote": "qtZjWW_mergedNote",
			"metaInfo": "qtZjWW_metaInfo",
			"metaRow": "qtZjWW_metaRow",
			"metaSeparator": "qtZjWW_metaSeparator",
			"mismatchList": "qtZjWW_mismatchList",
			"mismatchName": "qtZjWW_mismatchName",
			"mismatchVersions": "qtZjWW_mismatchVersions",
			"pagination": "qtZjWW_pagination",
			"root": "qtZjWW_root",
			"search": "qtZjWW_search",
			"searchWrap": "qtZjWW_searchWrap",
			"select": "qtZjWW_select",
			"sortChoice": "qtZjWW_sortChoice",
			"sortChoices": "qtZjWW_sortChoices",
			"sortPanel": "qtZjWW_sortPanel",
			"sortPanelLabel": "qtZjWW_sortPanelLabel",
			"sortRow": "qtZjWW_sortRow",
			"starError": "qtZjWW_starError",
			"starErrorDetail": "qtZjWW_starErrorDetail",
			"starErrorText": "qtZjWW_starErrorText",
			"state": "qtZjWW_state",
			"toolbar": "qtZjWW_toolbar",
			"toolbarAction": "qtZjWW_toolbarAction",
			"toolbarControls": "qtZjWW_toolbarControls",
			"total": "qtZjWW_total"
		};
		//#endregion
		//#region src/client/MarketplaceRoot.tsx
		/**
		* The shared marketplace surface: search toolbar, filter panel, sort
		* controls, the infinite-scroll list, and the detail dialog. Mounted both as
		* the Settings Plugins tab and inside the shell-overlay modal; both bind the
		* same controller, so state survives switching surfaces.
		*/
		/** Search debounce before a reload starts, in ms. */
		const SEARCH_DEBOUNCE_MS = 350;
		const SORT_FIELDS = [
			{
				value: "stars",
				key: "sortStars"
			},
			{
				value: "updated",
				key: "sortUpdated"
			},
			{
				value: "score",
				key: "sortScore"
			},
			{
				value: "name",
				key: "sortName"
			}
		];
		const SORT_ORDERS = [{
			value: "desc",
			key: "orderDesc"
		}, {
			value: "asc",
			key: "orderAsc"
		}];
		/** Render sort dimension and direction as two compact selection rows. */
		function SortPanel({ id, sort, order, onChange, t }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				id,
				className: `${MarketplaceRoot_module_css_default.filters} ${MarketplaceRoot_module_css_default.sortPanel}`,
				role: "region",
				"aria-label": t("sortLabel"),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: MarketplaceRoot_module_css_default.sortRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: MarketplaceRoot_module_css_default.sortPanelLabel,
						children: t("sortDimension")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: MarketplaceRoot_module_css_default.sortChoices,
						children: SORT_FIELDS.map((option) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: MarketplaceRoot_module_css_default.sortChoice,
							"aria-pressed": sort === option.value,
							onClick: () => {
								if (sort !== option.value) onChange(option.value, order);
							},
							children: t(option.key)
						}, option.value))
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: MarketplaceRoot_module_css_default.sortRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: MarketplaceRoot_module_css_default.sortPanelLabel,
						children: t("sortDirection")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: MarketplaceRoot_module_css_default.sortChoices,
						children: SORT_ORDERS.map((option) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: MarketplaceRoot_module_css_default.sortChoice,
							"aria-pressed": order === option.value,
							onClick: () => {
								if (order !== option.value) onChange(sort, option.value);
							},
							children: t(option.key)
						}, option.value))
					})]
				})]
			});
		}
		/** Render the collapsible filter panel. */
		function FilterPanel({ id, facets, filters, installedOnly, queryFilters, searchFiltersActive, onApply, onInstalledOnlyChange, t }) {
			const [ownerDraft, setOwnerDraft] = (0, react.useState)(filters.owner);
			const [languageDraft, setLanguageDraft] = (0, react.useState)(filters.language);
			const hintId = `${id}-query-hint`;
			const category = queryFilters.category ?? filters.category;
			const owner = queryFilters.owner ?? ownerDraft;
			const language = queryFilters.language ?? languageDraft;
			const grade = queryFilters.grade ?? filters.grade;
			const hasCatalogFilters = filters.category !== "" || filters.owner !== "" || filters.language !== "" || filters.grade !== "" || filters.featured || filters.official || filters.installable;
			const hasPanelFilters = hasCatalogFilters || installedOnly;
			(0, react.useEffect)(() => {
				setOwnerDraft(filters.owner);
			}, [filters.owner]);
			(0, react.useEffect)(() => {
				setLanguageDraft(filters.language);
			}, [filters.language]);
			const commit = (next) => {
				onApply({
					...filters,
					...next
				});
			};
			const commitDraft = (key, draft, current, setDraft) => {
				const next = draft.trim();
				setDraft(next);
				if (next !== current) commit({ [key]: next });
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				id,
				className: MarketplaceRoot_module_css_default.filters,
				role: "region",
				"aria-label": t("filterLabel"),
				children: [
					searchFiltersActive ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						id: hintId,
						className: MarketplaceRoot_module_css_default.filterHint,
						children: t("searchFiltersOverride")
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: MarketplaceRoot_module_css_default.filterFields,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: MarketplaceRoot_module_css_default.filterRow,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MarketplaceRoot_module_css_default.filterLabel,
									children: t("filterCategory")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
									className: MarketplaceRoot_module_css_default.select,
									value: category,
									disabled: queryFilters.category !== void 0,
									"aria-describedby": queryFilters.category === void 0 ? void 0 : hintId,
									onChange: (event) => {
										commit({ category: event.target.value });
									},
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "",
											children: "—"
										}),
										queryFilters.category !== void 0 && !facets.some((facet) => facet.value === queryFilters.category) ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: queryFilters.category,
											children: queryFilters.category
										}) : null,
										facets.map((facet) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
											value: facet.value,
											children: [
												facet.value,
												" (",
												facet.count,
												")"
											]
										}, facet.value))
									]
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: MarketplaceRoot_module_css_default.filterRow,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MarketplaceRoot_module_css_default.filterLabel,
									children: t("filterOwner")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									className: MarketplaceRoot_module_css_default.input,
									value: owner,
									placeholder: "deepseek-ai",
									disabled: queryFilters.owner !== void 0,
									"aria-describedby": queryFilters.owner === void 0 ? void 0 : hintId,
									onChange: (event) => {
										setOwnerDraft(event.target.value);
									},
									onBlur: () => {
										commitDraft("owner", ownerDraft, filters.owner, setOwnerDraft);
									},
									onKeyDown: (event) => {
										if (event.key === "Enter") commitDraft("owner", ownerDraft, filters.owner, setOwnerDraft);
									}
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: MarketplaceRoot_module_css_default.filterRow,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MarketplaceRoot_module_css_default.filterLabel,
									children: t("filterLanguage")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									className: MarketplaceRoot_module_css_default.input,
									value: language,
									placeholder: "TypeScript",
									disabled: queryFilters.language !== void 0,
									"aria-describedby": queryFilters.language === void 0 ? void 0 : hintId,
									onChange: (event) => {
										setLanguageDraft(event.target.value);
									},
									onBlur: () => {
										commitDraft("language", languageDraft, filters.language, setLanguageDraft);
									},
									onKeyDown: (event) => {
										if (event.key === "Enter") commitDraft("language", languageDraft, filters.language, setLanguageDraft);
									}
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: MarketplaceRoot_module_css_default.filterRow,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MarketplaceRoot_module_css_default.filterLabel,
									children: t("filterGrade")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
									className: MarketplaceRoot_module_css_default.select,
									value: grade,
									disabled: queryFilters.grade !== void 0,
									"aria-describedby": queryFilters.grade === void 0 ? void 0 : hintId,
									onChange: (event) => {
										commit({ grade: event.target.value });
									},
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "",
											children: "—"
										}),
										queryFilters.grade !== void 0 && ![
											"S",
											"A",
											"B",
											"C"
										].includes(queryFilters.grade) ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: queryFilters.grade,
											children: queryFilters.grade
										}) : null,
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "S",
											children: "S"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "A",
											children: "A"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "B",
											children: "B"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: "C",
											children: "C"
										})
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: MarketplaceRoot_module_css_default.filterFooter,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: MarketplaceRoot_module_css_default.checkRow,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: MarketplaceRoot_module_css_default.check,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: filters.featured,
										onChange: (event) => {
											commit({ featured: event.target.checked });
										}
									}), t("filterFeatured")]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: MarketplaceRoot_module_css_default.check,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: filters.official,
										onChange: (event) => {
											commit({ official: event.target.checked });
										}
									}), t("filterOfficial")]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: MarketplaceRoot_module_css_default.check,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: filters.installable,
										onChange: (event) => {
											commit({ installable: event.target.checked });
										}
									}), t("filterInstallable")]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: MarketplaceRoot_module_css_default.check,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: installedOnly,
										onChange: (event) => {
											onInstalledOnlyChange(event.target.checked);
										}
									}), t("filterInstalled")]
								})
							]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: `${MarketplaceRoot_module_css_default.action} ${MarketplaceRoot_module_css_default.filterClear}`,
							disabled: !hasPanelFilters,
							onClick: () => {
								if (hasCatalogFilters) onApply(EMPTY_MARKET_FILTERS);
								if (installedOnly) onInstalledOnlyChange(false);
							},
							children: t("filterClear")
						})]
					})
				]
			});
		}
		/** Count effective toolbar and query filters without double-counting overrides. */
		function activeFilterCount(filters, installedOnly, parsed) {
			const { apiFilters } = parsed;
			let count = 0;
			for (const field of [
				"category",
				"owner",
				"language",
				"grade"
			]) if ((apiFilters[field] ?? filters[field]) !== "") count += 1;
			if (apiFilters.tag !== void 0) count += 1;
			if (apiFilters.minScore !== void 0 || parsed.scoreMax !== void 0) count += 1;
			if (parsed.starsMin !== void 0 || parsed.starsMax !== void 0) count += 1;
			if (filters.featured) count += 1;
			if (filters.official) count += 1;
			if (filters.installable) count += 1;
			if (installedOnly) count += 1;
			return count;
		}
		/** Confirm an interrupting restart while Agent activity remains live. */
		function RestartConfirmDialog({ activity, unavailable, onConfirm, onCancel, t }) {
			const [acknowledged, setAcknowledged] = (0, react.useState)(false);
			const running = activity?.running === true;
			const description = unavailable ? t("restartUnavailable") : running ? t("restartRunning", { count: String(activity.active) }) : t("restartSafe");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
				open: true,
				onClose: onCancel,
				title: t("restartConfirmTitle"),
				description,
				footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					variant: "outline",
					onClick: onCancel,
					children: t("restartCancel")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					variant: "primary",
					disabled: running && !acknowledged,
					onClick: onConfirm,
					children: t("restartConfirm")
				})] }),
				children: running ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
					className: MarketplaceRoot_module_css_default.acknowledgement,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: acknowledged,
						onChange: (event) => {
							setAcknowledged(event.currentTarget.checked);
						}
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("restartAcknowledge") })]
				}) : null
			});
		}
		/**
		* Warn before installing a plugin whose declared harness ranges the running
		* installation does not satisfy, and let the user proceed anyway: the ranges are
		* often stale metadata rather than a real break, so this informs instead of
		* blocking.
		*/
		function CompatibilityDialog({ warning, onConfirm, onCancel, t }) {
			const rows = warning.mismatches.map((peer) => t("compatRow", peer));
			const copy = useMarketCopyFeedback([`${warning.fullName} (${warning.spec})`, ...rows].join("\n"));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
				open: true,
				onClose: onCancel,
				title: t("compatTitle"),
				description: t("compatSummary"),
				footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "outline",
						onClick: copy.onCopy,
						children: copy.copied ? t("copied") : t("compatCopy")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "outline",
						onClick: onCancel,
						children: t("compatCancel")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "primary",
						onClick: onConfirm,
						children: t("compatConfirm")
					})
				] }),
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
					className: MarketplaceRoot_module_css_default.mismatchList,
					children: warning.mismatches.map((peer) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: MarketplaceRoot_module_css_default.mismatchName,
						children: peer.name
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: MarketplaceRoot_module_css_default.mismatchVersions,
						children: t("compatVersions", peer)
					})] }, peer.name))
				})
			});
		}
		/** Render the marketplace surface. */
		function MarketplaceRoot({ controller, useView, locale, t }) {
			const view = useView((state) => state);
			const [input, setInput] = (0, react.useState)(view.search);
			const [sortOpen, setSortOpen] = (0, react.useState)(false);
			const [filtersOpen, setFiltersOpen] = (0, react.useState)(false);
			const [facets, setFacets] = (0, react.useState)([]);
			const sentinelRef = (0, react.useRef)(null);
			const sortId = (0, react.useId)();
			const filtersId = (0, react.useId)();
			const parsedSearch = parseMarketQuery(view.search);
			const filterCount = activeFilterCount(view.filters, view.installedOnly, parsedSearch);
			const searchFiltersActive = Object.keys(parsedSearch.apiFilters).length > 0 || parsedSearch.starsMin !== void 0 || parsedSearch.starsMax !== void 0 || parsedSearch.scoreMax !== void 0;
			const visibleItems = view.installedOnly ? view.items.filter((plugin) => isInstalled(plugin, view.installed)) : view.items;
			const copyLabel = t("copyLoaded", {
				loaded: String(visibleItems.length),
				total: String(view.total)
			});
			const listCopy = useMarketCopyFeedback(listAgentMarkdown(visibleItems, view.total, view.search, locale));
			const starErrorCopy = useMarketCopyFeedback(view.starError ?? "");
			(0, react.useEffect)(() => {
				controller.ensureLoaded();
			}, [controller]);
			(0, react.useEffect)(() => {
				setInput(view.search);
			}, [view.search]);
			(0, react.useEffect)(() => {
				if (input === view.search) return;
				const timer = window.setTimeout(() => {
					controller.applySearch(input);
				}, SEARCH_DEBOUNCE_MS);
				return () => {
					window.clearTimeout(timer);
				};
			}, [
				input,
				view.search,
				controller
			]);
			(0, react.useEffect)(() => {
				let current = true;
				controller.fetchFacets().then((result) => {
					if (current) setFacets(result);
				});
				return () => {
					current = false;
				};
			}, [controller]);
			(0, react.useEffect)(() => {
				const el = sentinelRef.current;
				/* v8 ignore next -- unreachable defensive arm for ref-less mounts. */
				if (el === null) return;
				if (typeof IntersectionObserver === "undefined") return;
				const observer = new IntersectionObserver((entries) => {
					if (entries.some((entry) => entry.isIntersecting)) controller.loadNextPage();
				}, { rootMargin: "240px" });
				observer.observe(el);
				return () => {
					observer.disconnect();
				};
			}, [
				view.status,
				view.items.length,
				controller
			]);
			const openRepository = (url) => {
				window.open(url, "_blank", "noopener");
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: MarketplaceRoot_module_css_default.root,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: MarketplaceRoot_module_css_default.toolbar,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: MarketplaceRoot_module_css_default.searchWrap,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, { size: 16 }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								className: MarketplaceRoot_module_css_default.search,
								type: "search",
								value: input,
								placeholder: t("searchPlaceholder"),
								"aria-label": t("searchPlaceholder"),
								onChange: (event) => {
									setInput(event.target.value);
								}
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: MarketplaceRoot_module_css_default.toolbarControls,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: `${MarketplaceRoot_module_css_default.action} ${MarketplaceRoot_module_css_default.toolbarAction}`,
								"data-active": filterCount > 0 ? "true" : void 0,
								"aria-expanded": filtersOpen,
								"aria-controls": filtersId,
								onClick: () => {
									setFiltersOpen((open) => !open);
									setSortOpen(false);
								},
								children: filterCount > 0 ? t("filterActive", { count: String(filterCount) }) : t("filterLabel")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: `${MarketplaceRoot_module_css_default.action} ${MarketplaceRoot_module_css_default.toolbarAction}`,
								"aria-expanded": sortOpen,
								"aria-controls": sortId,
								onClick: () => {
									setSortOpen((open) => !open);
									setFiltersOpen(false);
								},
								children: t("sortLabel")
							})]
						})]
					}),
					filtersOpen ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FilterPanel, {
						id: filtersId,
						facets,
						filters: view.filters,
						installedOnly: view.installedOnly,
						queryFilters: parsedSearch.apiFilters,
						searchFiltersActive,
						onApply: (filters) => {
							controller.applyFilters(filters);
						},
						onInstalledOnlyChange: (installedOnly) => {
							controller.applyInstalledFilter(installedOnly);
						},
						t
					}) : null,
					sortOpen ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SortPanel, {
						id: sortId,
						sort: view.sort,
						order: view.order,
						onChange: (sort, order) => {
							controller.applyOrdering(sort, order);
						},
						t
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("dl", {
						className: MarketplaceRoot_module_css_default.help,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("searchSyntaxLabel") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: t("searchSyntaxHelp") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", { children: t("searchFieldsLabel") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", { children: t("searchFieldsHelp") })
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: MarketplaceRoot_module_css_default.metaRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: MarketplaceRoot_module_css_default.metaInfo,
							role: "status",
							"aria-live": "polite",
							"aria-atomic": "true",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MarketplaceRoot_module_css_default.total,
									children: t("total", { count: String(view.total) })
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MarketplaceRoot_module_css_default.metaSeparator,
									"aria-hidden": "true",
									children: "·"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MarketplaceRoot_module_css_default.loaded,
									children: t("loadedCount", { count: String(visibleItems.length) })
								}),
								view.mode === "merged" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MarketplaceRoot_module_css_default.mergedNote,
									children: t("mergedNote")
								}) : null
							]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: `${MarketplaceRoot_module_css_default.action} ${MarketplaceRoot_module_css_default.copyAction}`,
							disabled: visibleItems.length === 0,
							onClick: listCopy.onCopy,
							"aria-label": copyLabel,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, { size: 14 }), listCopy.copied ? t("copied") : t("copyAgentList")]
						})]
					}),
					view.starError === null ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: MarketplaceRoot_module_css_default.starError,
						role: "status",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: MarketplaceRoot_module_css_default.starErrorText,
								children: t("starFailed")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: MarketplaceRoot_module_css_default.action,
								onClick: starErrorCopy.onCopy,
								"aria-label": t("copyError"),
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, { size: 14 }), starErrorCopy.copied ? t("copied") : t("copyError")]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: MarketplaceRoot_module_css_default.action,
								onClick: () => {
									controller.dismissStarError();
								},
								children: t("dismiss")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
								className: MarketplaceRoot_module_css_default.starErrorDetail,
								children: view.starError
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: MarketplaceRoot_module_css_default.list,
						children: [
							visibleItems.map((plugin) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarketplaceCard, {
								plugin,
								installed: view.installed,
								locale,
								action: view.action,
								restartMode: view.restartMode,
								canStar: view.starSupported,
								starred: view.starred.some((name) => name.toLocaleLowerCase() === plugin.fullName.toLocaleLowerCase()),
								starBusy: view.starBusy.includes(plugin.fullName),
								onToggleStar: (fullName) => {
									controller.toggleStar(fullName);
								},
								onInstall: (fullName) => {
									controller.install(fullName);
								},
								onUninstall: (fullName) => {
									controller.uninstall(fullName);
								},
								onRestart: () => {
									controller.restart();
								},
								onDismissAction: () => {
									controller.dismissAction();
								},
								onDetails: (fullName) => {
									controller.openDetail(fullName);
								},
								onOpenRepository: openRepository,
								t
							}, plugin.fullName)),
							view.status === "loading" && view.items.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: MarketplaceRoot_module_css_default.state,
								role: "status",
								children: t("loading")
							}) : null,
							view.status === "loading" && view.items.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: MarketplaceRoot_module_css_default.state,
								role: "status",
								children: t("loadingMore")
							}) : null,
							view.status === "error" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: MarketplaceRoot_module_css_default.state,
								role: "alert",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("error") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: MarketplaceRoot_module_css_default.action,
									onClick: () => {
										controller.retry();
									},
									children: t("retry")
								})]
							}) : null,
							(view.status === "ready" || view.status === "exhausted") && visibleItems.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: MarketplaceRoot_module_css_default.state,
								role: "status",
								children: t(view.syncStatus === "syncing" ? "emptySyncing" : input.trim() === "" && filterCount === 0 ? "emptyCatalog" : "empty")
							}) : null,
							view.status === "exhausted" && visibleItems.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: MarketplaceRoot_module_css_default.state,
								role: "status",
								children: t("exhausted", { count: String(visibleItems.length) })
							}) : null
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						ref: sentinelRef,
						className: MarketplaceRoot_module_css_default.pagination,
						"data-testid": "market-sentinel",
						children: view.status === "ready" && view.items.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: MarketplaceRoot_module_css_default.action,
							onClick: () => {
								controller.loadNextPage();
							},
							children: t("loadMore")
						}) : null
					}),
					view.installWarning === null ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CompatibilityDialog, {
						warning: view.installWarning,
						onConfirm: () => {
							controller.confirmInstallWarning();
						},
						onCancel: () => {
							controller.dismissInstallWarning();
						},
						t
					}),
					view.restartConfirm ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RestartConfirmDialog, {
						activity: view.restartActivity,
						unavailable: view.restartStatusUnavailable,
						onConfirm: () => {
							controller.confirmRestart();
						},
						onCancel: () => {
							controller.dismissRestart();
						},
						t
					}) : null,
					view.selected === null ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarketplaceDetail, {
						detail: view.detail,
						status: view.detailStatus,
						locale,
						installed: view.installed,
						action: view.action,
						restartMode: view.restartMode,
						canStar: view.starSupported,
						starred: view.detail !== null && view.starred.some((name) => name.toLocaleLowerCase() === view.detail?.fullName.toLocaleLowerCase()),
						starBusy: view.detail !== null && view.starBusy.includes(view.detail.fullName),
						onToggleStar: (fullName) => {
							controller.toggleStar(fullName);
						},
						onInstall: (fullName) => {
							controller.install(fullName);
						},
						onUninstall: (fullName) => {
							controller.uninstall(fullName);
						},
						onRestart: () => {
							controller.restart();
						},
						onDismissAction: () => {
							controller.dismissAction();
						},
						onClose: () => {
							controller.closeDetail();
						},
						/* v8 ignore next -- the dialog renders only while selected is set. */
						onRetry: () => {
							if (view.selected !== null) controller.openDetail(view.selected);
						},
						onOpenRepository: openRepository,
						t
					})
				]
			});
		}
		//#endregion
		//#region \0dsh-css:/Users/mark/lovstudio/dsh-plugins/dsh-plugin-marketplace/src/client/MarketOverlay.module.css.mjs
		const css$2 = ".keWc2G_backdrop{z-index:30;box-sizing:border-box;background:var(--dsw-alias-bg-mask-1);justify-content:center;align-items:center;padding:24px;display:flex;position:fixed;inset:0}.keWc2G_modal{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l3);background:var(--dsw-alias-bg-overlay);width:min(960px,94vw);height:min(86vh,760px);color:var(--dsw-alias-label-primary);box-shadow:var(--dsw-shadow-lv3);border-radius:14px;flex-direction:column;display:flex;overflow:hidden}.keWc2G_header{box-sizing:border-box;border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;justify-content:space-between;align-items:center;gap:12px;padding:12px 16px;display:flex}.keWc2G_heading{flex:1;align-items:baseline;gap:8px;min-width:0;display:flex}.keWc2G_title{font-size:15px;font-weight:600;line-height:22px}.keWc2G_refresh{min-width:0;max-width:100%;color:var(--dsw-alias-label-tertiary);cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background:0 0;border:none;border-radius:4px;align-items:center;gap:4px;padding:2px 4px;font-size:12px;display:inline-flex;overflow:hidden}.keWc2G_refresh span{text-overflow:ellipsis;min-width:0;overflow:hidden}.keWc2G_refresh:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}.keWc2G_refresh:disabled{cursor:wait}.keWc2G_spinning{animation:.9s linear infinite keWc2G_refresh-spin}.keWc2G_syncError{min-width:0;max-width:360px;color:var(--dsw-alias-label-error);text-overflow:ellipsis;white-space:nowrap;font-size:12px;line-height:18px;overflow:hidden}@keyframes keWc2G_refresh-spin{to{transform:rotate(360deg)}}.keWc2G_close{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:50%;flex:none;justify-content:center;align-items:center;display:inline-flex}.keWc2G_close:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.keWc2G_body{box-sizing:border-box;--dsh-market-sticky-inset:14px;--dsh-market-surface:var(--dsw-alias-bg-overlay);--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2);flex:1;min-height:0;padding:0 16px 20px;overflow:auto}";
		const tagId$2 = "@lovstudio/dsh-plugin-marketplace/MarketOverlay.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@lovstudio/dsh-plugin-marketplace";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var MarketOverlay_module_css_default = {
			"backdrop": "keWc2G_backdrop",
			"body": "keWc2G_body",
			"close": "keWc2G_close",
			"header": "keWc2G_header",
			"heading": "keWc2G_heading",
			"modal": "keWc2G_modal",
			"refresh": "keWc2G_refresh",
			"refresh-spin": "keWc2G_refresh-spin",
			"spinning": "keWc2G_spinning",
			"syncError": "keWc2G_syncError",
			"title": "keWc2G_title"
		};
		//#endregion
		//#region src/client/MarketOverlay.tsx
		/**
		* Shell-overlay marketplace: a frame-wide modal wrapping the shared
		* marketplace surface. Renders nothing while closed; Escape and the close
		* button close it.
		*/
		/** Localized age bucket used by the refresh-button label. */
		function relativeAge(updatedAt, now, t) {
			const minutes = Math.max(0, Math.floor((now - updatedAt) / 6e4));
			if (minutes < 1) return t("relativeMinute");
			if (minutes < 60) return t("relativeMinutes", { count: String(minutes) });
			const hours = Math.floor(minutes / 60);
			if (hours < 24) return t("relativeHours", { count: String(hours) });
			return t("relativeDays", { count: String(Math.floor(hours / 24)) });
		}
		/** Render the provider-independent completed/total synchronization counter. */
		function progressLabel(progress, t) {
			return t("refreshSyncingProgress", {
				synced: String(progress.items),
				total: String(progress.totalItems)
			});
		}
		/** Render the marketplace overlay, or nothing while closed. */
		function MarketOverlay(props) {
			const { controller, useView } = props;
			const open = useView((state) => state.overlayOpen);
			const catalogTotal = useView((state) => state.catalogTotal);
			const updatedAt = useView((state) => state.updatedAt);
			const syncStatus = useView((state) => state.syncStatus);
			const syncError = useView((state) => state.syncError);
			const syncProgress = useView((state) => state.syncProgress);
			const [now, setNow] = (0, react.useState)(() => Date.now());
			(0, react.useEffect)(() => {
				if (!open) return;
				const onKeyDown = (event) => {
					if (event.key === "Escape") controller.close();
				};
				window.addEventListener("keydown", onKeyDown);
				return () => {
					window.removeEventListener("keydown", onKeyDown);
				};
			}, [open, controller]);
			(0, react.useEffect)(() => {
				if (!open || updatedAt === null) return;
				setNow(Date.now());
				const timer = window.setInterval(() => {
					setNow(Date.now());
				}, 6e4);
				return () => {
					window.clearInterval(timer);
				};
			}, [open, updatedAt]);
			if (!open) return null;
			const refreshLabel = updatedAt === null ? props.t("refreshNever", { count: String(catalogTotal) }) : props.t("refreshSummary", {
				count: String(catalogTotal),
				relative: relativeAge(updatedAt, now, props.t)
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: MarketOverlay_module_css_default.backdrop,
				role: "presentation",
				onMouseDown: (event) => {
					if (event.target === event.currentTarget) controller.close();
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
					className: MarketOverlay_module_css_default.modal,
					role: "dialog",
					"aria-modal": "true",
					"aria-label": props.t("overlayTitle"),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: MarketOverlay_module_css_default.header,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: MarketOverlay_module_css_default.heading,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MarketOverlay_module_css_default.title,
									children: props.t("overlayTitle")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: MarketOverlay_module_css_default.refresh,
									disabled: syncStatus === "syncing",
									"aria-label": props.t("refreshAction"),
									title: syncStatus === "error" ? props.t("refreshFailed") : props.t("refreshAction"),
									onClick: () => {
										controller.syncCatalog();
									},
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRefreshOutline16, {
										className: syncStatus === "syncing" ? MarketOverlay_module_css_default.spinning : void 0,
										size: 14
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										role: syncStatus === "syncing" ? "status" : void 0,
										children: syncStatus === "syncing" ? syncProgress === null ? props.t("refreshSyncingProgress", {
											synced: "0",
											total: "0"
										}) : progressLabel(syncProgress, props.t) : refreshLabel
									})]
								}),
								syncStatus === "error" && syncError !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: MarketOverlay_module_css_default.syncError,
									role: "status",
									title: syncError,
									children: props.t("refreshFailedDetail", { reason: syncError })
								}) : null
							]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: MarketOverlay_module_css_default.close,
							onClick: () => {
								controller.close();
							},
							"aria-label": props.t("close"),
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, { size: 16 })
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: MarketOverlay_module_css_default.body,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarketplaceRoot, { ...props })
					})]
				})
			});
		}
		//#endregion
		//#region \0dsh-css:/Users/mark/lovstudio/dsh-plugins/dsh-plugin-marketplace/src/client/MarketSettingsCard.module.css.mjs
		const css$1 = ".Lbn48q_card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:12px;list-style:none;transition:border-color .16s,background .16s}.Lbn48q_card:hover{border-color:var(--dsw-alias-label-dimmed)}.Lbn48q_cardOpen{border-color:var(--dsw-alias-label-dimmed);background:var(--dsw-alias-bg-layer-2)}.Lbn48q_header{appearance:none;width:100%;color:inherit;font:inherit;text-align:left;cursor:pointer;background:0 0;border:0;border-radius:12px;align-items:center;gap:12px;padding:14px 16px;display:flex}.Lbn48q_header:focus-visible,.Lbn48q_discard:focus-visible,.Lbn48q_save:focus-visible,.Lbn48q_test:focus-visible,.Lbn48q_tokenHelp:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}.Lbn48q_header:focus-visible{outline-offset:-2px}.Lbn48q_headText{flex-direction:column;flex:1;gap:4px;min-width:0;display:flex}.Lbn48q_name{color:var(--dsw-alias-label-primary);font-size:15px;font-weight:600;line-height:1.4}.Lbn48q_description{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:1.5}.Lbn48q_chevron{color:var(--dsw-alias-label-tertiary);flex:none;transition:transform .16s}.Lbn48q_chevronOpen{transform:rotate(180deg)}.Lbn48q_body{border-top:1px solid var(--dsw-alias-border-l2);margin:0 16px;padding-bottom:8px}.Lbn48q_readOnly{color:var(--dsw-alias-label-tertiary);margin:12px 0 0;font-size:12px;line-height:1.5}.Lbn48q_pending,.Lbn48q_badge{background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);white-space:nowrap;border-radius:999px;flex:none;padding:1px 8px;font-size:11px;font-weight:500;line-height:17px}.Lbn48q_field{flex-direction:column;gap:6px;padding:12px 0;display:flex}.Lbn48q_field+.Lbn48q_field{border-top:1px solid var(--dsw-alias-border-l2)}.Lbn48q_fieldHead{align-items:center;gap:8px;display:flex}.Lbn48q_label{min-width:0;color:var(--dsw-alias-label-primary);flex:1;font-size:13px;font-weight:500;line-height:1.5}.Lbn48q_badges{align-items:center;gap:8px;display:inline-flex}.Lbn48q_reset{color:var(--dsw-alias-label-secondary);font:inherit;cursor:pointer;background:0 0;border:0;padding:0;font-size:12px;line-height:1.5}.Lbn48q_reset:hover:not(:disabled){color:var(--dsw-alias-label-primary)}.Lbn48q_reset:disabled{cursor:default}.Lbn48q_select{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);height:34px;color:var(--dsw-alias-label-primary);font:inherit;border-radius:8px;padding:0 12px;font-size:13px;line-height:1.5}.Lbn48q_input{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);height:34px;color:var(--dsw-alias-label-primary);font:inherit;border-radius:8px;padding:0 12px;font-size:13px}.Lbn48q_secretRow{gap:8px;display:flex}.Lbn48q_secretRow .Lbn48q_input{flex:1;min-width:0}.Lbn48q_test{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);font:inherit;cursor:pointer;background:0 0;border-radius:8px;flex:none;padding:0 12px;font-size:12px}.Lbn48q_test:hover:not(:disabled){border-color:var(--dsw-alias-label-dimmed);color:var(--dsw-alias-label-primary)}.Lbn48q_test:disabled{opacity:.4;cursor:default}.Lbn48q_testSuccess,.Lbn48q_testError{margin:0;font-size:12px;line-height:1.5}.Lbn48q_testSuccess{color:var(--dsw-alias-state-success-primary)}.Lbn48q_testError{color:var(--dsw-alias-label-error)}.Lbn48q_select:focus-visible,.Lbn48q_input:focus-visible{border-color:var(--dsw-alias-brand-primary);outline:none}.Lbn48q_select:disabled,.Lbn48q_input:disabled{color:var(--dsw-alias-label-tertiary);cursor:default}.Lbn48q_hint{color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px;line-height:1.5}.Lbn48q_tokenHelp{color:var(--dsw-alias-brand-primary);text-decoration:none}.Lbn48q_tokenHelp:hover{text-decoration:underline}.Lbn48q_switchOff,.Lbn48q_switchOn{cursor:pointer;border:0;border-radius:999px;flex-shrink:0;width:36px;height:20px;padding:0;transition:background-color .12s;position:relative}.Lbn48q_switchOff{background:var(--dsw-alias-border-l2)}.Lbn48q_switchOn{background:var(--dsw-alias-brand-primary)}.Lbn48q_switchThumb{background:var(--dsw-alias-bg-base);border-radius:50%;width:16px;height:16px;transition:transform .12s;position:absolute;top:2px;left:2px}.Lbn48q_switchOn .Lbn48q_switchThumb{transform:translate(16px)}.Lbn48q_switchOff:disabled,.Lbn48q_switchOn:disabled{opacity:.5;cursor:default}.Lbn48q_footer{border-top:1px solid var(--dsw-alias-border-l2);justify-content:flex-end;align-items:center;gap:8px;padding:12px 0 4px;display:flex}.Lbn48q_failed{min-width:0;color:var(--dsw-alias-label-error);flex:1;margin:0;font-size:12px;line-height:1.5}.Lbn48q_discard,.Lbn48q_save{appearance:none;font:inherit;cursor:pointer;border:1px solid #0000;border-radius:8px;padding:5px 14px;font-size:13px;line-height:1.5}.Lbn48q_discard{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);background:0 0}.Lbn48q_discard:hover:not(:disabled){border-color:var(--dsw-alias-label-dimmed);color:var(--dsw-alias-label-primary)}.Lbn48q_save{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-layer-3)}.Lbn48q_discard:disabled,.Lbn48q_save:disabled{opacity:.4;cursor:default}";
		const tagId$1 = "@lovstudio/dsh-plugin-marketplace/MarketSettingsCard.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@lovstudio/dsh-plugin-marketplace";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var MarketSettingsCard_module_css_default = {
			"badge": "Lbn48q_badge",
			"badges": "Lbn48q_badges",
			"body": "Lbn48q_body",
			"card": "Lbn48q_card",
			"cardOpen": "Lbn48q_cardOpen",
			"chevron": "Lbn48q_chevron",
			"chevronOpen": "Lbn48q_chevronOpen",
			"description": "Lbn48q_description",
			"discard": "Lbn48q_discard",
			"failed": "Lbn48q_failed",
			"field": "Lbn48q_field",
			"fieldHead": "Lbn48q_fieldHead",
			"footer": "Lbn48q_footer",
			"header": "Lbn48q_header",
			"headText": "Lbn48q_headText",
			"hint": "Lbn48q_hint",
			"input": "Lbn48q_input",
			"label": "Lbn48q_label",
			"name": "Lbn48q_name",
			"pending": "Lbn48q_pending",
			"readOnly": "Lbn48q_readOnly",
			"reset": "Lbn48q_reset",
			"save": "Lbn48q_save",
			"secretRow": "Lbn48q_secretRow",
			"select": "Lbn48q_select",
			"switchOff": "Lbn48q_switchOff",
			"switchOn": "Lbn48q_switchOn",
			"switchThumb": "Lbn48q_switchThumb",
			"test": "Lbn48q_test",
			"testError": "Lbn48q_testError",
			"testSuccess": "Lbn48q_testSuccess",
			"tokenHelp": "Lbn48q_tokenHelp"
		};
		//#endregion
		//#region src/client/MarketSettingsCard.tsx
		/** Marketplace card contributed to the configurable-plugins settings tab. */
		/** Provider choices backed by complete provider implementations. */
		const PROVIDERS = [{
			id: "dshfind",
			key: "settingsProviderDshfind"
		}, {
			id: "github",
			key: "settingsProviderGithub"
		}];
		const GITHUB_TOKEN_HELP_URL = "https://github.com/settings/personal-access-tokens/new";
		/** Render the marketplace's provider and startup-sync preferences as a plugin card. */
		function MarketSettingsCard(props) {
			const [open, setOpen] = (0, react.useState)(false);
			const state = props.useMarketSettingsCard((snapshot) => snapshot);
			if (!state.available) return null;
			const title = props.t("settingsTitle");
			const disabled = !state.writable || state.saving;
			const githubTokenMissing = state.provider.value === "github" && !state.githubToken.configured && state.githubToken.value.trim().length === 0;
			const saveDisabled = !state.dirty || state.saving || githubTokenMissing;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
				className: clsx(MarketSettingsCard_module_css_default.card, open && MarketSettingsCard_module_css_default.cardOpen),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: MarketSettingsCard_module_css_default.header,
					"aria-expanded": open,
					"aria-label": `${props.t(open ? "settingsCollapse" : "settingsExpand")}: ${title}`,
					onClick: () => {
						setOpen(!open);
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: MarketSettingsCard_module_css_default.headText,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: MarketSettingsCard_module_css_default.name,
								children: title
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: MarketSettingsCard_module_css_default.description,
								children: props.t("settingsCardDescription")
							})]
						}),
						state.dirty ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: MarketSettingsCard_module_css_default.pending,
							children: props.t("settingsUnsaved")
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, { className: clsx(MarketSettingsCard_module_css_default.chevron, open && MarketSettingsCard_module_css_default.chevronOpen) })
					]
				}), open ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: MarketSettingsCard_module_css_default.body,
					children: [
						!state.writable ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: MarketSettingsCard_module_css_default.readOnly,
							role: "status",
							children: props.t("settingsReadOnly")
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: MarketSettingsCard_module_css_default.field,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: MarketSettingsCard_module_css_default.fieldHead,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
										className: MarketSettingsCard_module_css_default.label,
										htmlFor: "plugin-market-provider",
										children: props.t("settingsProvider")
									}), state.provider.overridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										className: MarketSettingsCard_module_css_default.badges,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: MarketSettingsCard_module_css_default.badge,
											children: props.t("settingsOverridden")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: MarketSettingsCard_module_css_default.reset,
											disabled,
											onClick: () => {
												props.resetField("provider");
											},
											children: props.t("settingsReset")
										})]
									}) : null]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
									id: "plugin-market-provider",
									className: MarketSettingsCard_module_css_default.select,
									value: state.provider.value,
									disabled,
									onChange: (event) => {
										props.selectProvider(event.target.value);
									},
									children: PROVIDERS.map((provider) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: provider.id,
										children: props.t(provider.key)
									}, provider.id))
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: MarketSettingsCard_module_css_default.hint,
									children: props.t("settingsProviderDescription")
								})
							]
						}),
						state.provider.value === "github" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: MarketSettingsCard_module_css_default.field,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: MarketSettingsCard_module_css_default.fieldHead,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
										className: MarketSettingsCard_module_css_default.label,
										htmlFor: "plugin-market-github-token",
										children: props.t("settingsGithubToken")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										className: MarketSettingsCard_module_css_default.badge,
										children: [props.t(state.githubToken.configured ? "settingsGithubTokenConfigured" : "settingsGithubTokenMissing"), state.githubToken.suffix === void 0 ? null : ` · ••••${state.githubToken.suffix}`]
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: MarketSettingsCard_module_css_default.secretRow,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										id: "plugin-market-github-token",
										type: "password",
										autoComplete: "off",
										className: MarketSettingsCard_module_css_default.input,
										value: state.githubToken.value,
										placeholder: state.githubToken.suffix === void 0 ? props.t("settingsGithubTokenPlaceholder") : `••••${state.githubToken.suffix}`,
										disabled: disabled || !state.githubToken.writable,
										onChange: (event) => {
											props.setGithubToken(event.target.value);
										}
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: MarketSettingsCard_module_css_default.test,
										disabled: disabled || state.githubToken.testStatus === "testing" || state.githubToken.value.trim().length === 0 && !state.githubToken.configured,
										onClick: props.testGithubToken,
										children: props.t(state.githubToken.testStatus === "testing" ? "settingsCredentialTesting" : "settingsCredentialTest")
									})]
								}),
								state.githubToken.testStatus === "success" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: MarketSettingsCard_module_css_default.testSuccess,
									role: "status",
									children: props.t("settingsCredentialValid", { account: state.githubToken.testDetail ?? "" })
								}) : null,
								state.githubToken.testStatus === "success" && state.githubToken.canStar === false ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: MarketSettingsCard_module_css_default.hint,
									role: "status",
									children: props.t("settingsCredentialNoStar")
								}) : null,
								state.githubToken.testStatus === "error" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: MarketSettingsCard_module_css_default.testError,
									role: "status",
									children: props.t("settingsCredentialInvalid", { reason: state.githubToken.testDetail ?? "" })
								}) : null,
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
									className: MarketSettingsCard_module_css_default.hint,
									children: [
										props.t("settingsGithubTokenDescription"),
										" ",
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
											className: MarketSettingsCard_module_css_default.tokenHelp,
											href: GITHUB_TOKEN_HELP_URL,
											target: "_blank",
											rel: "noreferrer",
											children: props.t("settingsGithubTokenHelp")
										})
									]
								})
							]
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: MarketSettingsCard_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: MarketSettingsCard_module_css_default.fieldHead,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
										className: MarketSettingsCard_module_css_default.label,
										htmlFor: "plugin-market-startup-sync",
										children: props.t("settingsStartupSync")
									}),
									state.syncOnStartup.overridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										className: MarketSettingsCard_module_css_default.badges,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: MarketSettingsCard_module_css_default.badge,
											children: props.t("settingsOverridden")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											type: "button",
											className: MarketSettingsCard_module_css_default.reset,
											disabled,
											onClick: () => {
												props.resetField("syncOnStartup");
											},
											children: props.t("settingsReset")
										})]
									}) : null,
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										id: "plugin-market-startup-sync",
										type: "button",
										role: "switch",
										"aria-checked": state.syncOnStartup.value,
										className: state.syncOnStartup.value ? MarketSettingsCard_module_css_default.switchOn : MarketSettingsCard_module_css_default.switchOff,
										disabled,
										onClick: () => {
											props.setSyncOnStartup(!state.syncOnStartup.value);
										},
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: MarketSettingsCard_module_css_default.switchThumb })
									})
								]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: MarketSettingsCard_module_css_default.hint,
								children: props.t("settingsStartupSyncDescription")
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: MarketSettingsCard_module_css_default.footer,
							children: [
								state.failed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: MarketSettingsCard_module_css_default.failed,
									role: "status",
									children: props.t("settingsSaveFailed")
								}) : null,
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: MarketSettingsCard_module_css_default.discard,
									disabled: !state.dirty || state.saving,
									onClick: props.discard,
									children: props.t("settingsDiscard")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: MarketSettingsCard_module_css_default.save,
									disabled: saveDisabled,
									onClick: props.save,
									children: props.t(state.saving ? "settingsSaving" : "settingsSave")
								})
							]
						})
					]
				}) : null]
			});
		}
		//#endregion
		//#region src/market-settings.ts
		/** Durable plugin-market synchronization preferences. */
		/** Provider ids with complete initialization and incremental implementations. */
		const MARKET_PROVIDER_IDS = ["dshfind", "github"];
		/** Settings namespace owned by the plugin marketplace. */
		const MARKET_SETTINGS_NAMESPACE = "ui-plugin-market";
		/** Default catalog provider. */
		const DEFAULT_MARKET_PROVIDER = "github";
		Schema.object({
			provider: Schema.union([...MARKET_PROVIDER_IDS]).default(DEFAULT_MARKET_PROVIDER),
			syncOnStartup: Schema.boolean().default(true)
		});
		//#endregion
		//#region src/client/market-settings-card-controller.ts
		/** Staged plugin-configuration card over the marketplace settings namespace. */
		/** Owns the marketplace card's drafts and revision-fenced settings writes. */
		var MarketSettingsCardController = class {
			scope;
			credentials;
			probeCredential;
			store;
			unsubscribe;
			providerDraft;
			syncDraft;
			saving = false;
			failed = false;
			githubTokenDraft = "";
			githubTokenConfigured = false;
			githubTokenWritable = true;
			githubTokenSuffix;
			githubTokenTest = { status: "idle" };
			/** @param scope - Host-backed `ui-plugin-market` settings scope. */
			constructor(scope, credentials, probeCredential) {
				this.scope = scope;
				this.credentials = credentials;
				this.probeCredential = probeCredential;
				this.store = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)(this.projection());
				this.unsubscribe = scope.subscribe(() => {
					this.publish();
				});
				this.readGithubToken();
			}
			/** Stop following the settings scope. */
			dispose() {
				this.unsubscribe();
			}
			/**
			* Project the controller into the card registration face.
			* @returns the snapshot and actions injected into the card registration.
			*/
			inject() {
				return {
					hooks: { marketSettingsCard: this.store },
					selectProvider: (provider) => {
						this.stageProvider({
							kind: "set",
							value: provider
						});
					},
					setSyncOnStartup: (enabled) => {
						this.stageSync({
							kind: "set",
							value: enabled
						});
					},
					setGithubToken: (value) => {
						this.githubTokenDraft = value;
						this.githubTokenTest = { status: "idle" };
						this.failed = false;
						this.publish();
					},
					testGithubToken: () => {
						this.testGithubToken();
					},
					resetField: (field) => {
						if (field === "provider") this.stageProvider({ kind: "clear" });
						else this.stageSync({ kind: "clear" });
					},
					save: () => {
						this.save();
					},
					discard: () => {
						this.discard();
					}
				};
			}
			stageProvider(draft) {
				this.providerDraft = draft;
				this.failed = false;
				this.publish();
			}
			stageSync(draft) {
				this.syncDraft = draft;
				this.failed = false;
				this.publish();
			}
			discard() {
				if (this.providerDraft === void 0 && this.syncDraft === void 0 && this.githubTokenDraft.length === 0 && !this.failed) return;
				this.providerDraft = void 0;
				this.syncDraft = void 0;
				this.githubTokenDraft = "";
				this.failed = false;
				this.publish();
			}
			async save() {
				const plan = this.plan();
				const token = this.githubTokenDraft.trim();
				if (plan.length === 0 && token.length === 0 || this.saving) return;
				this.saving = true;
				this.failed = false;
				this.publish();
				let landed = true;
				if (token.length > 0) {
					try {
						await this.credentials.set("GITHUB_TOKEN", token);
					} catch (_credentialWriteFailure) {
						landed = false;
					}
					await this.readGithubToken();
					landed = this.githubTokenConfigured && landed;
				}
				for (const write of plan) try {
					if (write.draft.kind === "clear") {
						await this.scope.unset(write.field);
						landed = !this.stored(write.field) && landed;
					} else {
						await this.scope.set(write.field, write.draft.value);
						landed = this.userLayer()?.[write.field] === write.draft.value && landed;
					}
				} catch (_settingsWriteFailure) {
					landed = false;
				}
				if (landed) {
					this.providerDraft = void 0;
					this.syncDraft = void 0;
					this.githubTokenDraft = "";
				}
				this.saving = false;
				this.failed = !landed;
				this.publish();
			}
			plan() {
				const value = this.sectionValue();
				const plan = [];
				if (this.providerDraft?.kind === "clear") {
					if (this.stored("provider")) plan.push({
						field: "provider",
						draft: this.providerDraft
					});
				} else if (this.providerDraft !== void 0 && this.providerDraft.value !== value.provider) plan.push({
					field: "provider",
					draft: this.providerDraft
				});
				if (this.syncDraft?.kind === "clear") {
					if (this.stored("syncOnStartup")) plan.push({
						field: "syncOnStartup",
						draft: this.syncDraft
					});
				} else if (this.syncDraft !== void 0 && this.syncDraft.value !== value.syncOnStartup) plan.push({
					field: "syncOnStartup",
					draft: this.syncDraft
				});
				return plan;
			}
			projection() {
				const snapshot = this.scope.getSnapshot();
				const value = this.sectionValue();
				const base = this.baseValue();
				return {
					available: snapshot.status === "ready",
					writable: snapshot.writable,
					dirty: this.plan().length > 0 || this.githubTokenDraft.trim().length > 0,
					saving: this.saving,
					failed: this.failed,
					provider: {
						value: this.providerDraft?.kind === "set" ? this.providerDraft.value : this.providerDraft?.kind === "clear" ? base.provider : value.provider,
						overridden: this.providerDraft?.kind === "set" ? true : this.providerDraft?.kind === "clear" ? false : this.stored("provider")
					},
					syncOnStartup: {
						value: this.syncDraft?.kind === "set" ? this.syncDraft.value : this.syncDraft?.kind === "clear" ? base.syncOnStartup : value.syncOnStartup,
						overridden: this.syncDraft?.kind === "set" ? true : this.syncDraft?.kind === "clear" ? false : this.stored("syncOnStartup")
					},
					githubToken: {
						value: this.githubTokenDraft,
						configured: this.githubTokenConfigured,
						writable: this.githubTokenWritable,
						...this.githubTokenSuffix === void 0 ? {} : { suffix: this.githubTokenSuffix },
						testStatus: this.githubTokenTest.status,
						...this.githubTokenTest.detail === void 0 ? {} : { testDetail: this.githubTokenTest.detail },
						...this.githubTokenTest.canStar === void 0 ? {} : { canStar: this.githubTokenTest.canStar }
					}
				};
			}
			sectionValue() {
				return this.scope.getSnapshot().value ?? {
					provider: "github",
					syncOnStartup: true
				};
			}
			baseValue() {
				const base = this.scope.getSnapshot().base;
				return {
					provider: base?.provider ?? "github",
					syncOnStartup: base?.syncOnStartup ?? true
				};
			}
			userLayer() {
				return this.scope.getSnapshot().user;
			}
			stored(field) {
				const user = this.userLayer();
				return user !== void 0 && Object.hasOwn(user, field);
			}
			publish() {
				const next = this.projection();
				const previous = this.store.getSnapshot();
				if (previous.available === next.available && previous.writable === next.writable && previous.dirty === next.dirty && previous.saving === next.saving && previous.failed === next.failed && previous.provider.value === next.provider.value && previous.provider.overridden === next.provider.overridden && previous.syncOnStartup.value === next.syncOnStartup.value && previous.syncOnStartup.overridden === next.syncOnStartup.overridden && previous.githubToken.value === next.githubToken.value && previous.githubToken.configured === next.githubToken.configured && previous.githubToken.writable === next.githubToken.writable && previous.githubToken.suffix === next.githubToken.suffix && previous.githubToken.testStatus === next.githubToken.testStatus && previous.githubToken.testDetail === next.githubToken.testDetail) return;
				this.store.set(next);
			}
			/**
			* Re-read the write-only GitHub credential after a Host invalidation.
			* @param ref - invalidated Host credential reference.
			*/
			refreshCredential(ref) {
				if (ref === "GITHUB_TOKEN") this.readGithubToken();
			}
			async testGithubToken() {
				if (this.githubTokenTest.status === "testing") return;
				const token = this.githubTokenDraft.trim();
				if (token.length === 0 && !this.githubTokenConfigured) return;
				this.githubTokenTest = { status: "testing" };
				this.publish();
				try {
					const result = await this.probeCredential(token.length === 0 ? void 0 : token);
					this.githubTokenTest = {
						status: "success",
						detail: result.login,
						canStar: result.canStar
					};
				} catch (error) {
					this.githubTokenTest = {
						status: "error",
						detail: error instanceof Error ? error.message : String(error)
					};
				}
				this.publish();
			}
			async readGithubToken() {
				try {
					const response = await this.credentials.describe(["GITHUB_TOKEN"]);
					if (!response.ok) return;
					const view = response.value?.GITHUB_TOKEN;
					const configured = view?.configured ?? false;
					const writable = view?.writable ?? true;
					const suffix = view?.suffix;
					if (configured === this.githubTokenConfigured && writable === this.githubTokenWritable && suffix === this.githubTokenSuffix) return;
					this.githubTokenConfigured = configured;
					this.githubTokenWritable = writable;
					this.githubTokenSuffix = suffix;
					this.publish();
				} catch (_credentialReadFailure) {}
			}
		};
		//#endregion
		//#region \0dsh-css:/Users/mark/lovstudio/dsh-plugins/dsh-plugin-marketplace/src/client/SidebarMarketEntry.module.css.mjs
		const css = ".LSbXCW_entry{box-sizing:border-box;width:calc(100% + 4px);height:42px;color:var(--dsw-alias-label-primary);cursor:pointer;background:0 0;border:none;border-radius:12px;align-items:center;gap:8px;margin:1px -2px;padding:0 10px 0 8px;font-family:inherit;font-size:14px;line-height:22px;display:flex;overflow:hidden}.LSbXCW_entry:hover{background:var(--dsw-alias-interactive-bg-hover)}.LSbXCW_entry[data-wide=true] .LSbXCW_label{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.LSbXCW_entry:not([data-wide=true]){border-radius:50%;justify-content:center;gap:0;width:36px;height:36px;margin:2px 0;padding:0}";
		const tagId = "@lovstudio/dsh-plugin-marketplace/SidebarMarketEntry.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@lovstudio/dsh-plugin-marketplace";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var SidebarMarketEntry_module_css_default = {
			"entry": "LSbXCW_entry",
			"label": "LSbXCW_label"
		};
		//#endregion
		//#region src/client/SidebarMarketEntry.tsx
		/** Isometric sandbox glyph for the plugin-discovery destination. */
		function MarketplaceIcon({ size }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				width: size,
				height: size,
				viewBox: "0 0 16 16",
				fill: "none",
				xmlns: "http://www.w3.org/2000/svg",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M8 1.45703L14.0898 4.88281L8 8.30859L1.91016 4.88281L8 1.45703Z",
					stroke: "currentColor",
					strokeWidth: "1.25",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M1.91016 4.88281V11.1172L8 14.543L14.0898 11.1172V4.88281M8 8.30859V14.543",
					stroke: "currentColor",
					strokeWidth: "1.25",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})]
			});
		}
		/** Render the sidebar plugin-market entry. */
		function SidebarMarketEntry({ controller, wide, t }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: SidebarMarketEntry_module_css_default.entry,
				"data-wide": wide ? "true" : void 0,
				"aria-label": t("sidebarEntry"),
				title: wide ? void 0 : t("sidebarEntry"),
				onClick: () => {
					controller.open();
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarketplaceIcon, { size: wide ? 16 : 18 }), wide ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: SidebarMarketEntry_module_css_default.label,
					children: t("sidebarEntry")
				}) : null]
			});
		}
		//#endregion
		//#region src/client/index.ts
		/**
		* Plugin marketplace, browser half: registers the three marketplace surfaces
		* — the Settings Plugins tab, the sidebar region entry, the shell overlay,
		* — over shared marketplace state.
		*
		* dshfind synchronization writes one complete validated snapshot to
		* IndexedDB; every browse, search, detail, facet, sort, and paging read stays
		* local. Install and uninstall delegate to the current official `dsh plugin`
		* CLI through this package's same-origin Host action endpoint. Installed-state
		* badges come from the read-only Host pluginInventory Remote.
		*/
		/** Dictionary namespace owned by this plugin. */
		const NS = "pluginMarket";
		/** Config boundary: a malformed entry fails the load loudly here. */
		const Config = Schema.object({ baseUrl: Schema.string().default(DEFAULT_MARKET_BASE_URL) });
		/** Required services (cordis fiber inject). Every `remote.<ns>` the plugin
		* touches must be declared, or the Cordis tracker rejects the access. */
		const inject = [
			"slots",
			"locale",
			"remote",
			"settingsScope",
			"remote.credentials",
			"remote.pluginInventory"
		];
		/** Map a locale id onto the description-locale preference of agent copy. */
		function localeOf(active) {
			return active.startsWith("zh") ? "zh" : "en";
		}
		/**
		* Mount the marketplace surfaces on one shared controller.
		* @param ctx - client root context.
		* @param config - resolved plugin config (schema defaults applied).
		*/
		async function apply(ctx, config) {
			const disposeGithubRemote = await ctx.remote.$mount(TYPERT_REMOTE);
			ctx.effect(() => disposeGithubRemote, "ui-plugin-market: GitHub Remote contribution");
			await ctx.inject(["remote.pluginMarketGithub"], (scope) => {
				mountMarketplace(scope, config);
			});
		}
		/** Mount marketplace consumers after the package-owned GitHub Remote namespace is active. */
		function mountMarketplace(ctx, config) {
			const restartUi = () => ctx.get("betterRestartUi");
			const t = ctx.locale.bind(NS);
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-plugin-market: dictionaries");
			const providerRouter = createMarketProviderRouter({
				dshfind: createMarketApi(config?.baseUrl ?? "https://api.dshfind.com"),
				github: createGithubMarketApi(async (request) => {
					const response = await ctx.remote.pluginMarketGithub.search(request);
					if (!response.ok) throw new Error(`pluginMarketGithub.search failed: ${response.error.code}: ${response.error.message}`);
					return response.value;
				})
			}, DEFAULT_MARKET_PROVIDER);
			const controller = new MarketController({
				api: providerRouter.provider,
				installed: async () => {
					const remote = ctx.get("remote");
					/* v8 ignore next -- 'remote' is a declared injection, so the registry
					* always satisfies it before this closure can run. */
					if (remote === void 0) throw new Error("remote service unavailable");
					const result = await remote.pluginInventory.list();
					if (!result.ok) throw new Error(`pluginInventory.list failed: ${result.error.code}: ${result.error.message}`);
					return result.value.entries.map((entry) => entry.moduleName);
				},
				resolvePackage: async (fullName) => {
					const response = await ctx.remote.pluginMarketGithub.resolvePackage({ fullName });
					if (!response.ok) throw new Error(`pluginMarketGithub.resolvePackage failed: ${response.error.code}: ${response.error.message}`);
					return response.value;
				},
				listStarred: async () => {
					const response = await ctx.remote.pluginMarketGithub.listStarred();
					if (!response.ok) throw new Error(`pluginMarketGithub.listStarred failed: ${response.error.code}: ${response.error.message}`);
					return response.value.fullNames;
				},
				setStar: async (fullName, starred) => {
					const response = await ctx.remote.pluginMarketGithub.setStar({
						fullName,
						starred
					});
					if (!response.ok) throw new Error(response.error.message);
				},
				install: async (spec) => runPluginAction("install", spec),
				uninstall: async (spec) => runPluginAction("uninstall", spec),
				checkCompatibility: async (spec) => checkPluginCompatibility(spec),
				status: () => restartUi()?.status() ?? Promise.resolve({
					running: false,
					active: 0
				}),
				restart: () => {
					const ui = restartUi();
					if (ui === void 0) return Promise.reject(/* @__PURE__ */ new Error("Better Restart is not active: install @lovstudio/dsh-better-restart to restart from the marketplace"));
					return Promise.resolve(ui.restart());
				}
			});
			const settings = ctx.settingsScope.bind({ namespace: MARKET_SETTINGS_NAMESPACE });
			const settingsCard = new MarketSettingsCardController(settings, ctx.remote.credentials, async (token) => {
				const response = await ctx.remote.pluginMarketGithub.probeCredential(token === void 0 ? {} : { token });
				if (!response.ok) throw new Error(`pluginMarketGithub.probeCredential failed: ${response.error.message}`);
				return response.value;
			});
			ctx.effect(() => () => {
				settingsCard.dispose();
			}, "ui-plugin-market: settings card");
			let startupHandled = false;
			const applyStartupPreference = () => {
				const snapshot = settings.getSnapshot();
				if (snapshot.status !== "ready" || snapshot.value === void 0) return;
				const changed = providerRouter.selected() !== snapshot.value.provider;
				providerRouter.select(snapshot.value.provider);
				if (!startupHandled) {
					startupHandled = true;
					if (snapshot.value.syncOnStartup) controller.syncCatalog();
				} else if (changed) controller.syncCatalog(true);
			};
			applyStartupPreference();
			controller.refreshStarred();
			ctx.effect(() => settings.subscribe(applyStartupPreference), "ui-plugin-market: startup synchronization preference");
			controller.refreshInstalled();
			controller.refreshRestartMode();
			ctx.effect(() => ctx.on("connection/reset", () => {
				resetPluginActionToken();
				controller.refreshInstalled();
				controller.refreshRestartMode();
			}), "ui-plugin-market: installed-name refresh");
			ctx.effect(() => ctx.remote.$on("credentials/reference-updated", (ref) => {
				settingsCard.refreshCredential(ref);
				if (ref !== "GITHUB_TOKEN") return;
				controller.refreshStarred();
				if (providerRouter.selected() === "github") controller.syncCatalog(true);
			}), "ui-plugin-market: GitHub credential refresh");
			const marketInjected = () => ({
				controller,
				locale: localeOf(ctx.locale.getSnapshot().active),
				hooks: { view: controller.store }
			});
			const entryInjected = () => ({ controller });
			ctx.slots.inject("settings.plugins.tab", () => ctx.slots.register({
				name: "settings.plugins.tab",
				id: "market",
				order: 20,
				label: () => t("tab"),
				locale: NS,
				inject: marketInjected
			}, MarketplaceRoot));
			ctx.slots.inject("settings.plugin.item", () => ctx.slots.register({
				name: "settings.plugin.item",
				key: MARKET_SETTINGS_NAMESPACE,
				locale: NS,
				inject: () => settingsCard.inject()
			}, MarketSettingsCard));
			ctx.slots.inject("sidebar.footer.action", () => ctx.slots.register({
				name: "sidebar.footer.action",
				id: "plugin-market",
				order: 0,
				label: () => t("sidebarEntry"),
				locale: NS,
				inject: entryInjected
			}, SidebarMarketEntry));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "plugin-market",
				order: 0,
				locale: NS,
				inject: marketInjected
			}, MarketOverlay));
		}
		//#endregion
		exports.Config = Config;
		exports.NS = NS;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.cjs.map