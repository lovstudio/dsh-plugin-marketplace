window.__ModuleLoader__.load({
	id: "@lovstudio/dsh-plugin-marketplace",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_runtime_client = require("@deepseek-ai/dsh-client-runtime/client");
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region ../../../vendor/cosmokit/src/misc.ts
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
		//#endregion
		//#region ../../../vendor/cosmokit/src/types.ts
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
		let Binary;
		(function(_Binary) {
			_Binary.is = isArrayBufferLike;
			_Binary.isSource = isArrayBufferSource;
			function fromSource(source) {
				if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
				else return source;
			}
			_Binary.fromSource = fromSource;
			function toBase64(source) {
				source = fromSource(source);
				if (typeof Buffer !== "undefined") return Buffer.from(source).toString("base64");
				let binary = "";
				const bytes = new Uint8Array(source);
				for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
				return btoa(binary);
			}
			_Binary.toBase64 = toBase64;
			function fromBase64(source) {
				if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "base64"));
				return Uint8Array.from(atob(source), (c) => c.charCodeAt(0));
			}
			_Binary.fromBase64 = fromBase64;
			function toHex(source) {
				source = fromSource(source);
				if (typeof Buffer !== "undefined") return Buffer.from(source).toString("hex");
				return Array.from(new Uint8Array(source), (byte) => byte.toString(16).padStart(2, "0")).join("");
			}
			_Binary.toHex = toHex;
			function fromHex(source) {
				if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "hex"));
				const hex = source.length % 2 === 0 ? source : source.slice(0, source.length - 1);
				const buffer = [];
				for (let i = 0; i < hex.length; i += 2) buffer.push(parseInt(`${hex[i]}${hex[i + 1]}`, 16));
				return Uint8Array.from(buffer).buffer;
			}
			_Binary.fromHex = fromHex;
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
		//#endregion
		//#region ../../../vendor/cosmokit/src/time.ts
		let Time;
		(function(_Time) {
			_Time.millisecond = 1;
			const second = _Time.second = 1e3;
			const minute = _Time.minute = second * 60;
			const hour = _Time.hour = minute * 60;
			const day = _Time.day = hour * 24;
			const week = _Time.week = day * 7;
			let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
			function setTimezoneOffset(offset) {
				timezoneOffset = offset;
			}
			_Time.setTimezoneOffset = setTimezoneOffset;
			function getTimezoneOffset() {
				return timezoneOffset;
			}
			_Time.getTimezoneOffset = getTimezoneOffset;
			function getDateNumber(date = /* @__PURE__ */ new Date(), offset) {
				if (typeof date === "number") date = new Date(date);
				if (offset === void 0) offset = timezoneOffset;
				return Math.floor((date.valueOf() / minute - offset) / 1440);
			}
			_Time.getDateNumber = getDateNumber;
			function fromDateNumber(value, offset) {
				const date = new Date(value * day);
				if (offset === void 0) offset = timezoneOffset;
				return new Date(+date + offset * minute);
			}
			_Time.fromDateNumber = fromDateNumber;
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
				return (parseFloat(capture[1]) * week || 0) + (parseFloat(capture[2]) * day || 0) + (parseFloat(capture[3]) * hour || 0) + (parseFloat(capture[4]) * minute || 0) + (parseFloat(capture[5]) * second || 0);
			}
			_Time.parseTime = parseTime;
			function parseDate(date) {
				const parsed = parseTime(date);
				if (parsed) date = Date.now() + parsed;
				else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date}`;
				else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date}`;
				return date ? new Date(date) : /* @__PURE__ */ new Date();
			}
			_Time.parseDate = parseDate;
			function format(ms) {
				const abs = Math.abs(ms);
				if (abs >= day - hour / 2) return Math.round(ms / day) + "d";
				else if (abs >= hour - minute / 2) return Math.round(ms / hour) + "h";
				else if (abs >= minute - second / 2) return Math.round(ms / minute) + "m";
				else if (abs >= second) return Math.round(ms / second) + "s";
				return ms + "ms";
			}
			_Time.format = format;
			function toDigits(source, length = 2) {
				return source.toString().padStart(length, "0");
			}
			_Time.toDigits = toDigits;
			function template(template, time = /* @__PURE__ */ new Date()) {
				return template.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
			}
			_Time.template = template;
		})(Time || (Time = {}));
		//#endregion
		//#region ../../../vendor/schemastery/src/index.ts
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
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/core.js
		var _a$1;
		function $constructor(name, initializer, params) {
			function init(inst, def) {
				if (!inst._zod) Object.defineProperty(inst, "_zod", {
					value: {
						def,
						constr: _,
						traits: /* @__PURE__ */ new Set()
					},
					enumerable: false
				});
				if (inst._zod.traits.has(name)) return;
				inst._zod.traits.add(name);
				initializer(inst, def);
				const proto = _.prototype;
				const keys = Object.keys(proto);
				for (let i = 0; i < keys.length; i++) {
					const k = keys[i];
					if (!(k in inst)) inst[k] = proto[k].bind(inst);
				}
			}
			const Parent = params?.Parent ?? Object;
			class Definition extends Parent {}
			Object.defineProperty(Definition, "name", { value: name });
			function _(def) {
				var _a;
				const inst = params?.Parent ? new Definition() : this;
				init(inst, def);
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				for (const fn of inst._zod.deferred) fn();
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
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/util.js
		function getEnumValues(entries) {
			const numericValues = Object.values(entries).filter((v) => typeof v === "number");
			return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
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
				throw new Error("cached value already set");
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
			const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
			if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
			return ratio - roundedRatio;
		}
		const EVALUATING = /* @__PURE__*/ Symbol("evaluating");
		function defineLazy(object, key, getter) {
			let value = void 0;
			Object.defineProperty(object, key, {
				get() {
					if (value === EVALUATING) return;
					if (value === void 0) {
						value = EVALUATING;
						value = getter();
					}
					return value;
				},
				set(v) {
					Object.defineProperty(object, key, { value: v });
				},
				configurable: true
			});
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
			for (const def of defs) Object.assign(mergedDescriptors, Object.getOwnPropertyDescriptors(def));
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
		function optionalKeys(shape) {
			return Object.keys(shape).filter((k) => {
				return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
			});
		}
		const NUMBER_FORMAT_RANGES = {
			safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
			int32: [-2147483648, 2147483647],
			uint32: [0, 4294967295],
			float32: [-34028234663852886e22, 34028234663852886e22],
			float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
		};
		function pick(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = {};
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						newShape[key] = currDef.shape[key];
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
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
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
				for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
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
		function partial(Class, schema, mask) {
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
			return clone(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const oldShape = schema._zod.def.shape;
					const shape = { ...oldShape };
					if (mask) for (const key in mask) {
						if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						shape[key] = Class ? new Class({
							type: "optional",
							innerType: oldShape[key]
						}) : oldShape[key];
					}
					else for (const key in oldShape) shape[key] = Class ? new Class({
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
				if (mask) for (const key in mask) {
					if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
					if (!mask[key]) continue;
					shape[key] = new Class({
						type: "nonoptional",
						innerType: oldShape[key]
					});
				}
				else for (const key in oldShape) shape[key] = new Class({
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
		function finalizeIssue(iss, ctx, config) {
			const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
			const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
			rest.path ?? (rest.path = []);
			rest.message = message;
			if (ctx?.reportInput) rest.input = _input;
			return rest;
		}
		function getLengthableOrigin(input) {
			if (Array.isArray(input)) return "array";
			if (typeof input === "string") return "string";
			return "unknown";
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
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/errors.js
		const initializer$1 = (inst, def) => {
			inst.name = "$ZodError";
			Object.defineProperty(inst, "_zod", {
				value: inst._zod,
				enumerable: false
			});
			Object.defineProperty(inst, "issues", {
				value: def,
				enumerable: false
			});
			inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
			Object.defineProperty(inst, "toString", {
				value: () => inst.message,
				enumerable: false
			});
		};
		const $ZodError = $constructor("$ZodError", initializer$1);
		const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
		function flattenError(error, mapper = (issue) => issue.message) {
			const fieldErrors = {};
			const formErrors = [];
			for (const sub of error.issues) if (sub.path.length > 0) {
				fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
				fieldErrors[sub.path[0]].push(mapper(sub));
			} else formErrors.push(mapper(sub));
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
							if (!(i === fullpath.length - 1)) curr[el] = curr[el] || { _errors: [] };
							else {
								curr[el] = curr[el] || { _errors: [] };
								curr[el]._errors.push(mapper(issue));
							}
							curr = curr[el];
							i++;
						}
					}
				}
			};
			processError(error);
			return fieldErrors;
		}
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/parse.js
		const _parse = (_Err) => (schema, value, _ctx, _params) => {
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
				captureStackTrace(e, _params?.callee);
				throw e;
			}
			return result.value;
		};
		const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
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
				captureStackTrace(e, params?.callee);
				throw e;
			}
			return result.value;
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
		const _encode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parse(_Err)(schema, value, ctx);
		};
		const _decode = (_Err) => (schema, value, _ctx) => {
			return _parse(_Err)(schema, value, _ctx);
		};
		const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parseAsync(_Err)(schema, value, ctx);
		};
		const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _parseAsync(_Err)(schema, value, _ctx);
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
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/regexes.js
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const cuid = /^[cC][0-9a-z]{6,}$/;
		const cuid2 = /^[0-9a-z]+$/;
		const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
		const xid = /^[0-9a-vA-V]{20}$/;
		const ksuid = /^[A-Za-z0-9]{27}$/;
		const nanoid = /^[a-zA-Z0-9_-]{21}$/;
		/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
		const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
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
		const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
		function emoji() {
			return new RegExp(_emoji$1, "u");
		}
		const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
		const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
		const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
		const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
		const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
		const base64url = /^[A-Za-z0-9_-]*$/;
		const httpProtocol = /^https?$/;
		const e164 = /^\+[1-9]\d{6,14}$/;
		const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
		const date$1 = /*@__PURE__*/ new RegExp(`^${dateSource}$`);
		function timeSource(args) {
			const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
			return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
		}
		function time$1(args) {
			return new RegExp(`^${timeSource(args)}$`);
		}
		function datetime$1(args) {
			const time = timeSource({ precision: args.precision });
			const opts = ["Z"];
			if (args.local) opts.push("");
			if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
			const timeRegex = `${time}(?:${opts.join("|")})`;
			return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
		}
		const string$1 = (params) => {
			const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
			return new RegExp(`^${regex}$`);
		};
		const integer = /^-?\d+$/;
		const number$1 = /^-?\d+(?:\.\d+)?$/;
		const boolean$1 = /^(?:true|false)$/i;
		const lowercase = /^[^A-Z]*$/;
		const uppercase = /^[^a-z]*$/;
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/checks.js
		const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
			var _a;
			inst._zod ?? (inst._zod = {});
			inst._zod.def = def;
			(_a = inst._zod).onattach ?? (_a.onattach = []);
		});
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
				if (def.value < curr) if (def.inclusive) bag.maximum = def.value;
				else bag.exclusiveMaximum = def.value;
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
				payload.issues.push({
					origin,
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
				if (def.value > curr) if (def.inclusive) bag.minimum = def.value;
				else bag.exclusiveMinimum = def.value;
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
				payload.issues.push({
					origin,
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
				if (typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
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
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
				if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length <= def.maximum) return;
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
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
				if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length >= def.minimum) return;
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
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.minimum = def.length;
				bag.maximum = def.length;
				bag.length = def.length;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const length = input.length;
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
			const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
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
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/doc.js
		var Doc = class {
			constructor(args = []) {
				this.content = [];
				this.indent = 0;
				if (this) this.args = args;
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
				const args = this?.args;
				const lines = [...(this?.content ?? [``]).map((x) => `  ${x}`)];
				return new F(...args, lines.join("\n"));
			}
		};
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/versions.js
		const version = {
			major: 4,
			minor: 4,
			patch: 3
		};
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/schemas.js
		const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
			var _a;
			inst ?? (inst = {});
			inst._zod.def = def;
			inst._zod.bag = inst._zod.bag || {};
			inst._zod.version = version;
			const checks = [...inst._zod.def.checks ?? []];
			if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
			for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
			if (checks.length === 0) {
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred?.push(() => {
					inst._zod.run = inst._zod.parse;
				});
			} else {
				const runChecks = (payload, checks, ctx) => {
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
							if (!isAborted) isAborted = aborted(payload, currLen);
						});
						else {
							if (payload.issues.length === currLen) continue;
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
			defineLazy(inst, "~standard", () => ({
				validate: (value) => {
					try {
						const r = safeParse$1(inst, value);
						return r.success ? { value: r.data } : { issues: r.error?.issues };
					} catch (_) {
						return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
					}
				},
				vendor: "zod",
				version: 1
			}));
		});
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
		const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				try {
					const trimmed = payload.value.trim();
					if (!def.normalize && def.protocol?.source === httpProtocol.source) {
						if (!/^https?:\/\//i.test(trimmed)) {
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
					}
					const url = new URL(trimmed);
					if (def.hostname) {
						def.hostname.lastIndex = 0;
						if (!def.hostname.test(url.hostname)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid hostname",
							pattern: def.hostname.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.protocol) {
						def.protocol.lastIndex = 0;
						if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid protocol",
							pattern: def.protocol.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.normalize) payload.value = url.href;
					else payload.value = trimmed;
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
			def.pattern ?? (def.pattern = nanoid);
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
			def.pattern ?? (def.pattern = datetime$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
			def.pattern ?? (def.pattern = date$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
			def.pattern ?? (def.pattern = time$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
			def.pattern ?? (def.pattern = duration$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
			def.pattern ?? (def.pattern = ipv4);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv4`;
		});
		const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
			def.pattern ?? (def.pattern = ipv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv6`;
			inst._zod.check = (payload) => {
				try {
					new URL(`http://[${payload.value}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "ipv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv4);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				const parts = payload.value.split("/");
				try {
					if (parts.length !== 2) throw new Error();
					const [address, prefix] = parts;
					if (!prefix) throw new Error();
					const prefixNum = Number(prefix);
					if (`${prefixNum}` !== prefix) throw new Error();
					if (prefixNum < 0 || prefixNum > 128) throw new Error();
					new URL(`http://[${address}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "cidrv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
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
				const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
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
				payload.value = Array(input.length);
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
		function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
			const isPresent = key in input;
			if (result.issues.length) {
				if (isOptionalIn && isOptionalOut && !isPresent) return;
				final.issues.push(...prefixIssues(key, result.issues));
			}
			if (!isPresent && !isOptionalIn) {
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
		function normalizeDef(def) {
			const keys = Object.keys(def.shape);
			for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
			const okeys = optionalKeys(def.shape);
			return {
				...def,
				keys,
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
			const isOptionalIn = _catchall.optin === "optional";
			const isOptionalOut = _catchall.optout === "optional";
			for (const key in input) {
				if (key === "__proto__") continue;
				if (keySet.has(key)) continue;
				if (t === "never") {
					unrecognized.push(key);
					continue;
				}
				const r = _catchall.run({
					value: input[key],
					issues: []
				}, ctx);
				if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
				else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
			}
			if (unrecognized.length) payload.issues.push({
				code: "unrecognized_keys",
				keys: unrecognized,
				input,
				inst
			});
			if (!proms.length) return payload;
			return Promise.all(proms).then(() => {
				return payload;
			});
		}
		const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
			$ZodType.init(inst, def);
			if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
				const sh = def.shape;
				Object.defineProperty(def, "shape", { get: () => {
					const newSh = { ...sh };
					Object.defineProperty(def, "shape", { value: newSh });
					return newSh;
				} });
			}
			const _normalized = cached(() => normalizeDef(def));
			defineLazy(inst._zod, "propValues", () => {
				const shape = def.shape;
				const propValues = {};
				for (const key in shape) {
					const field = shape[key]._zod;
					if (field.values) {
						propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
						for (const v of field.values) propValues[key].add(v);
					}
				}
				return propValues;
			});
			const isObject$1 = isObject;
			const catchall = def.catchall;
			let value;
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
				payload.value = {};
				const proms = [];
				const shape = value.shape;
				for (const key of value.keys) {
					const el = shape[key];
					const isOptionalIn = el._zod.optin === "optional";
					const isOptionalOut = el._zod.optout === "optional";
					const r = el._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
					else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
				}
				if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
				return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
			};
		});
		const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
			$ZodObject.init(inst, def);
			const superParse = inst._zod.parse;
			const _normalized = cached(() => normalizeDef(def));
			const generateFastpass = (shape) => {
				const doc = new Doc([
					"shape",
					"payload",
					"ctx"
				]);
				const normalized = _normalized.value;
				const parseStr = (key) => {
					const k = esc(key);
					return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
				};
				doc.write(`const input = payload.value;`);
				const ids = Object.create(null);
				let counter = 0;
				for (const key of normalized.keys) ids[key] = `key_${counter++}`;
				doc.write(`const newResult = {};`);
				for (const key of normalized.keys) {
					const id = ids[key];
					const k = esc(key);
					const schema = shape[key];
					const isOptionalIn = schema?._zod?.optin === "optional";
					const isOptionalOut = schema?._zod?.optout === "optional";
					doc.write(`const ${id} = ${parseStr(key)};`);
					if (isOptionalIn && isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }

        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }

      `);
					else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
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
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
					else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }

        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }

      `);
				}
				doc.write(`payload.value = newResult;`);
				doc.write(`return payload;`);
				const fn = doc.compile();
				return (payload, ctx) => fn(shape, payload, ctx);
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
			defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "values", () => {
				if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
			});
			defineLazy(inst._zod, "pattern", () => {
				if (def.options.every((o) => o._zod.pattern)) {
					const patterns = def.options.map((o) => o._zod.pattern);
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
				for (const key of sharedKeys) {
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
			for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
				unrecIssue ?? (unrecIssue = iss);
				for (const k of iss.keys) {
					if (!unrecKeys.has(k)) unrecKeys.set(k, {});
					unrecKeys.get(k).l = true;
				}
			} else result.issues.push(iss);
			for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
				if (!unrecKeys.has(k)) unrecKeys.set(k, {});
				unrecKeys.get(k).r = true;
			}
			else result.issues.push(iss);
			const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
			if (bothKeys.length && unrecIssue) result.issues.push({
				...unrecIssue,
				keys: bothKeys
			});
			if (aborted(result)) return result;
			const merged = mergeValues(left.value, right.value);
			if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
			result.value = merged.data;
			return result;
		}
		const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
			$ZodType.init(inst, def);
			const values = getEnumValues(def.entries);
			const valuesSet = new Set(values);
			inst._zod.values = valuesSet;
			inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
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
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				const _out = def.transform(payload.value, payload);
				if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				if (_out instanceof Promise) throw new $ZodAsyncError();
				payload.value = _out;
				payload.fallback = true;
				return payload;
			};
		});
		function handleOptionalResult(result, input) {
			if (input === void 0 && (result.issues.length || result.fallback)) return {
				issues: [],
				value: void 0
			};
			return result;
		}
		const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.optout = "optional";
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? new Set([...def.innerType._zod.values, void 0]) : void 0;
			});
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (def.innerType._zod.optin === "optional") {
					const input = payload.value;
					const result = def.innerType._zod.run(payload, ctx);
					if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, input));
					return handleOptionalResult(result, input);
				}
				if (payload.value === void 0) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
			inst._zod.parse = (payload, ctx) => {
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
			});
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (payload.value === null) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
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
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) payload.value = def.defaultValue;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => {
				const v = def.innerType._zod.values;
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
		const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => {
					payload.value = result.value;
					if (result.issues.length) {
						payload.value = def.catchValue({
							...payload,
							error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
							input: payload.value
						});
						payload.issues = [];
						payload.fallback = true;
					}
					return payload;
				});
				payload.value = result.value;
				if (result.issues.length) {
					payload.value = def.catchValue({
						...payload,
						error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
						input: payload.value
					});
					payload.issues = [];
					payload.fallback = true;
				}
				return payload;
			};
		});
		const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => def.in._zod.values);
			defineLazy(inst._zod, "optin", () => def.in._zod.optin);
			defineLazy(inst._zod, "optout", () => def.out._zod.optout);
			defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
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
			if (left.issues.length) {
				left.aborted = true;
				return left;
			}
			return next._zod.run({
				value: left.value,
				issues: left.issues,
				fallback: left.fallback
			}, ctx);
		}
		const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
			defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then(handleReadonlyResult);
				return handleReadonlyResult(result);
			};
		});
		function handleReadonlyResult(payload) {
			payload.value = Object.freeze(payload.value);
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
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/registries.js
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
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/api.js
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
						_issue.input ?? (_issue.input = payload.value);
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
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/to-json-schema.js
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
				cycles: params?.cycles ?? "ref",
				reused: params?.reused ?? "inline",
				external: params?.external ?? void 0
			};
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
			if (meta) Object.assign(result.schema, meta);
			if (ctx.io === "input" && isTransforming(schema)) {
				delete result.schema.examples;
				delete result.schema.default;
			}
			if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
			delete result.schema._prefault;
			return ctx.seen.get(schema).schema;
		}
		function extractDefs(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
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
						ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
					};
				}
				if (entry[1] === root) return { ref: "#" };
				const defUriPrefix = `#/${defsSegment}/`;
				const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
				return {
					defId,
					ref: defUriPrefix + defId
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
					} else Object.assign(schema, refSchema);
					Object.assign(schema, _cached);
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
			for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
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
			Object.assign(result, root.def ?? root.schema);
			const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
			if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
			const defs = ctx.external?.defs ?? {};
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.def && seen.defId) {
					if (seen.def.id === seen.defId) delete seen.def.id;
					defs[seen.defId] = seen.def;
				}
			}
			if (ctx.external) {} else if (Object.keys(defs).length > 0) if (ctx.target === "draft-2020-12") result.$defs = defs;
			else result.definitions = defs;
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
			if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx);
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
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/json-schema-processors.js
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
			const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
			if (typeof minimum === "number") json.minLength = minimum;
			if (typeof maximum === "number") json.maxLength = maximum;
			if (format) {
				json.format = formatMap[format] ?? format;
				if (json.format === "") delete json.format;
				if (format === "time") delete json.format;
			}
			if (contentEncoding) json.contentEncoding = contentEncoding;
			if (patterns && patterns.size > 0) {
				const regexes = [...patterns];
				if (regexes.length === 1) json.pattern = regexes[0].source;
				else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
					...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
					pattern: regex.source
				}))];
			}
		};
		const numberProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
			if (typeof format === "string" && format.includes("int")) json.type = "integer";
			else json.type = "number";
			const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
			const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
			const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
			if (exMin) if (legacy) {
				json.minimum = exclusiveMinimum;
				json.exclusiveMinimum = true;
			} else json.exclusiveMinimum = exclusiveMinimum;
			else if (typeof minimum === "number") json.minimum = minimum;
			if (exMax) if (legacy) {
				json.maximum = exclusiveMaximum;
				json.exclusiveMaximum = true;
			} else json.exclusiveMaximum = exclusiveMaximum;
			else if (typeof maximum === "number") json.maximum = maximum;
			if (typeof multipleOf === "number") json.multipleOf = multipleOf;
		};
		const booleanProcessor = (_schema, _ctx, json, _params) => {
			json.type = "boolean";
		};
		const neverProcessor = (_schema, _ctx, json, _params) => {
			json.not = {};
		};
		const enumProcessor = (schema, _ctx, json, _params) => {
			const def = schema._zod.def;
			const values = getEnumValues(def.entries);
			if (values.every((v) => typeof v === "number")) json.type = "number";
			if (values.every((v) => typeof v === "string")) json.type = "string";
			json.enum = values;
		};
		const customProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
		};
		const transformProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
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
		const objectProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			json.type = "object";
			json.properties = {};
			const shape = def.shape;
			for (const key in shape) json.properties[key] = process(shape[key], ctx, {
				...params,
				path: [
					...params.path,
					"properties",
					key
				]
			});
			const allKeys = new Set(Object.keys(shape));
			const requiredKeys = new Set([...allKeys].filter((key) => {
				const v = def.shape[key]._zod;
				if (ctx.io === "input") return v.optin === void 0;
				else return v.optout === void 0;
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
			json.allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
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
		const defaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.default = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const prefaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			if (ctx.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
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
				throw new Error("Dynamic catch values are not supported in JSON Schema");
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
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/iso.js
		const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
			$ZodISODateTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function datetime(params) {
			return /* @__PURE__ */ _isoDateTime(ZodISODateTime, params);
		}
		const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
			$ZodISODate.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function date(params) {
			return /* @__PURE__ */ _isoDate(ZodISODate, params);
		}
		const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
			$ZodISOTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function time(params) {
			return /* @__PURE__ */ _isoTime(ZodISOTime, params);
		}
		const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
			$ZodISODuration.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function duration(params) {
			return /* @__PURE__ */ _isoDuration(ZodISODuration, params);
		}
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/errors.js
		const initializer = (inst, issues) => {
			$ZodError.init(inst, issues);
			inst.name = "ZodError";
			Object.defineProperties(inst, {
				format: { value: (mapper) => formatError(inst, mapper) },
				flatten: { value: (mapper) => flattenError(inst, mapper) },
				addIssue: { value: (issue) => {
					inst.issues.push(issue);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				addIssues: { value: (issues) => {
					inst.issues.push(...issues);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				isEmpty: { get() {
					return inst.issues.length === 0;
				} }
			});
		};
		const ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, { Parent: Error });
		//#endregion
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/parse.js
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
		//#region ../../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/schemas.js
		const _installedGroups = /* @__PURE__ */ new WeakMap();
		function _installLazyMethods(inst, group, methods) {
			const proto = Object.getPrototypeOf(inst);
			let installed = _installedGroups.get(proto);
			if (!installed) {
				installed = /* @__PURE__ */ new Set();
				_installedGroups.set(proto, installed);
			}
			if (installed.has(group)) return;
			installed.add(group);
			for (const key in methods) {
				const fn = methods[key];
				Object.defineProperty(proto, key, {
					configurable: true,
					enumerable: false,
					get() {
						const bound = fn.bind(this);
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: bound
						});
						return bound;
					},
					set(v) {
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: v
						});
					}
				});
			}
		}
		const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
			$ZodType.init(inst, def);
			Object.assign(inst["~standard"], { jsonSchema: {
				input: createStandardJSONSchemaMethod(inst, "input"),
				output: createStandardJSONSchemaMethod(inst, "output")
			} });
			inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
			inst.def = def;
			inst.type = def.type;
			Object.defineProperty(inst, "_def", { value: def });
			inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
			inst.safeParse = (data, params) => safeParse(inst, data, params);
			inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
			inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
			inst.spa = inst.safeParseAsync;
			inst.encode = (data, params) => encode(inst, data, params);
			inst.decode = (data, params) => decode(inst, data, params);
			inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
			inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
			inst.safeEncode = (data, params) => safeEncode(inst, data, params);
			inst.safeDecode = (data, params) => safeDecode(inst, data, params);
			inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
			inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
			_installLazyMethods(inst, "ZodType", {
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
				apply(fn) {
					return fn(this);
				}
			});
			Object.defineProperty(inst, "description", {
				get() {
					return globalRegistry.get(inst)?.description;
				},
				configurable: true
			});
			return inst;
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
			_installLazyMethods(inst, "_ZodString", {
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
		});
		const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			_ZodString.init(inst, def);
			inst.email = (params) => inst.check(/* @__PURE__ */ _email(ZodEmail, params));
			inst.url = (params) => inst.check(/* @__PURE__ */ _url(ZodURL, params));
			inst.jwt = (params) => inst.check(/* @__PURE__ */ _jwt(ZodJWT, params));
			inst.emoji = (params) => inst.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.uuid = (params) => inst.check(/* @__PURE__ */ _uuid(ZodUUID, params));
			inst.uuidv4 = (params) => inst.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
			inst.uuidv6 = (params) => inst.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
			inst.uuidv7 = (params) => inst.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
			inst.nanoid = (params) => inst.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.cuid = (params) => inst.check(/* @__PURE__ */ _cuid(ZodCUID, params));
			inst.cuid2 = (params) => inst.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
			inst.ulid = (params) => inst.check(/* @__PURE__ */ _ulid(ZodULID, params));
			inst.base64 = (params) => inst.check(/* @__PURE__ */ _base64(ZodBase64, params));
			inst.base64url = (params) => inst.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
			inst.xid = (params) => inst.check(/* @__PURE__ */ _xid(ZodXID, params));
			inst.ksuid = (params) => inst.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
			inst.ipv4 = (params) => inst.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
			inst.ipv6 = (params) => inst.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
			inst.cidrv4 = (params) => inst.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
			inst.cidrv6 = (params) => inst.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
			inst.e164 = (params) => inst.check(/* @__PURE__ */ _e164(ZodE164, params));
			inst.datetime = (params) => inst.check(datetime(params));
			inst.date = (params) => inst.check(date(params));
			inst.time = (params) => inst.check(time(params));
			inst.duration = (params) => inst.check(duration(params));
		});
		function string(params) {
			return /* @__PURE__ */ _string(ZodString, params);
		}
		const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			_ZodString.init(inst, def);
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
			_installLazyMethods(inst, "ZodNumber", {
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
			const bag = inst._zod.bag;
			inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
			inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
			inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
			inst.isFinite = true;
			inst.format = bag.format ?? null;
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
			$ZodArray.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
			inst.element = def.element;
			_installLazyMethods(inst, "ZodArray", {
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
		});
		function array(element, params) {
			return /* @__PURE__ */ _array(ZodArray, element, params);
		}
		const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
			$ZodObjectJIT.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
			defineLazy(inst, "shape", () => {
				return def.shape;
			});
			_installLazyMethods(inst, "ZodObject", {
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
				required(...args) {
					return required(ZodNonOptional, this, args[0]);
				}
			});
		});
		function object(shape, params) {
			return new ZodObject({
				type: "object",
				shape: shape ?? {},
				...normalizeParams(params)
			});
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
			return new ZodEnum({
				type: "enum",
				entries: Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values,
				...normalizeParams(params)
			});
		}
		const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
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
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = inst);
						payload.issues.push(issue(_issue));
					}
				};
				const output = def.transform(payload.value, payload);
				if (output instanceof Promise) return output.then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				payload.value = output;
				payload.fallback = true;
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
				catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
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
		//#region ../../host/plugin-market-github/lib/typert.remote-client.js
		const _deepseek_ai_dsh_host_plugin_market_github_pluginMarketGithub_probeCredential_parameter_0$schema = object({ "token": string().readonly().optional() });
		const _deepseek_ai_dsh_host_plugin_market_github_pluginMarketGithub_probeCredential_result$schema = object({
			"login": string().readonly(),
			"rateLimitRemaining": number().readonly()
		});
		const _deepseek_ai_dsh_host_plugin_market_github_pluginMarketGithub_search_parameter_0$schema = object({
			"pushedFrom": string().readonly(),
			"pushedTo": string().readonly(),
			"page": number().readonly(),
			"perPage": number().readonly()
		});
		const _deepseek_ai_dsh_host_plugin_market_github_pluginMarketGithub_search_result$schema = object({
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
				"language": string().readonly().optional(),
				"stars": number().readonly(),
				"pushedAt": string().readonly(),
				"archived": boolean().readonly()
			})).readonly(),
			"rateLimitRemaining": number().readonly(),
			"rateLimitResetAt": number().readonly()
		});
		const TYPERT_REMOTE = {
			package: "@lovstudio/dsh-plugin-marketplace",
			descriptors: [{
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
						typeSymbol: "@lovstudio/dsh-plugin-marketplace/types#GitHubMarketCredentialProbeRequest",
						schema: _deepseek_ai_dsh_host_plugin_market_github_pluginMarketGithub_probeCredential_parameter_0$schema
					}
				}],
				result: {
					mode: "strict",
					typeSymbol: "@lovstudio/dsh-plugin-marketplace/types#GitHubMarketCredentialProbeResult",
					schema: _deepseek_ai_dsh_host_plugin_market_github_pluginMarketGithub_probeCredential_result$schema
				},
				sourceLocation: {
					"file": "packages/host/plugin-market-github/src/index.ts",
					"line": 92,
					"column": 9
				}
			}, {
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
						typeSymbol: "@lovstudio/dsh-plugin-marketplace/types#GitHubMarketSearchRequest",
						schema: _deepseek_ai_dsh_host_plugin_market_github_pluginMarketGithub_search_parameter_0$schema
					}
				}],
				result: {
					mode: "strict",
					typeSymbol: "@lovstudio/dsh-plugin-marketplace/types#GitHubMarketSearchPage",
					schema: _deepseek_ai_dsh_host_plugin_market_github_pluginMarketGithub_search_result$schema
				},
				sourceLocation: {
					"file": "packages/host/plugin-market-github/src/index.ts",
					"line": 120,
					"column": 9
				}
			}]
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
		const FIELD_FILTERS = new Map([
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
							if (field === "stars") if (comparison.operator === ">=") starsMin = Math.max(starsMin ?? 0, value);
							else if (comparison.operator === ">") starsMin = Math.max(starsMin ?? 0, value + 1);
							else if (comparison.operator === "<=") starsMax = Math.min(starsMax ?? Infinity, value);
							else if (comparison.operator === "<") starsMax = Math.min(starsMax ?? Infinity, value - 1);
							else {
								starsMin = Math.max(starsMin ?? 0, value);
								starsMax = Math.min(starsMax ?? Infinity, value);
							}
							else if (comparison.operator === ">=" || comparison.operator === ">") apiFilters.minScore = Math.max(apiFilters.minScore ?? 0, value + (comparison.operator === ">" ? 1 : 0));
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
			const install = record.install;
			if (install !== void 0 && typeof install === "object") {
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
				const response = await fetchImpl(`${base}/v1/catalog${dataVersion === void 0 ? "" : `?data_version=${encodeURIComponent(dataVersion)}`}`, { headers: { accept: "application/json" } });
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
				is_plugin: true
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
				restartConfirm: false,
				restartActivity: null,
				restartStatusUnavailable: false
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
		/** How often the open restart confirmation re-reads agent activity. */
		const RESTART_STATUS_POLL_MS = 1500;
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
			store = (0, _deepseek_ai_dsh_client_runtime_client.createSnapshotStore)(createMarketViewState());
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
			/** The npm package name a catalog row installs as, when installable. */
			packageNameOf(state, fullName) {
				const row = state.items.find((plugin) => plugin.fullName === fullName) ?? (state.detail !== null && state.detail.fullName === fullName ? state.detail : void 0);
				if (row === void 0 || row.install === void 0) return null;
				return row.install.pkgName ?? row.name;
			}
			/**
			* Install one plugin into the managed profile; the change needs a restart.
			* @param fullName - the `owner/repo` catalog id of the plugin.
			*/
			install(fullName) {
				const pkg = this.packageNameOf(this.store.getSnapshot(), fullName);
				if (pkg === null) {
					this.store.update((state) => {
						state.action = {
							fullName,
							kind: "install",
							status: "error",
							message: "not-installable"
						};
					});
					return;
				}
				this.store.update((state) => {
					state.action = {
						fullName,
						kind: "install",
						status: "running",
						message: ""
					};
				});
				this.ports.install(pkg).then((result) => {
					this.store.update((state) => {
						const action = {
							fullName,
							kind: "install",
							status: result.ok ? "ok" : "error",
							message: result.ok ? "installed" : `pnpm exit ${String(result.exitCode)}`
						};
						if (result.command !== void 0) action.command = result.command;
						if (!result.ok && result.error !== void 0) action.detail = result.error;
						if (!result.ok && result.ignoredBuilds !== void 0 && result.ignoredBuilds.length > 0) action.ignoredBuilds = result.ignoredBuilds;
						state.action = action;
					});
					if (result.ok) this.refreshInstalled();
				}, (reason) => {
					this.store.update((state) => {
						const action = {
							fullName,
							kind: "install",
							status: "error",
							message: "remote-failed"
						};
						const detail = reason instanceof Error ? reason.message : String(reason);
						if (detail !== "") action.detail = detail;
						state.action = action;
					});
				});
			}
			/**
			* Uninstall one plugin from the managed profile; the change needs a restart.
			* @param fullName - the `owner/repo` catalog id of the plugin.
			*/
			uninstall(fullName) {
				const pkg = this.packageNameOf(this.store.getSnapshot(), fullName);
				if (pkg === null) {
					this.store.update((state) => {
						state.action = {
							fullName,
							kind: "uninstall",
							status: "error",
							message: "not-installable"
						};
					});
					return;
				}
				this.store.update((state) => {
					state.action = {
						fullName,
						kind: "uninstall",
						status: "running",
						message: ""
					};
				});
				this.ports.uninstall(pkg).then((result) => {
					this.store.update((state) => {
						const action = {
							fullName,
							kind: "uninstall",
							status: result.ok ? "ok" : "error",
							message: result.ok ? "uninstalled" : `pnpm exit ${String(result.exitCode)}`
						};
						if (result.command !== void 0) action.command = result.command;
						if (!result.ok && result.error !== void 0) action.detail = result.error;
						if (!result.ok && result.ignoredBuilds !== void 0 && result.ignoredBuilds.length > 0) action.ignoredBuilds = result.ignoredBuilds;
						state.action = action;
					});
					if (result.ok) this.refreshInstalled();
				}, (reason) => {
					this.store.update((state) => {
						const action = {
							fullName,
							kind: "uninstall",
							status: "error",
							message: "remote-failed"
						};
						const detail = reason instanceof Error ? reason.message : String(reason);
						if (detail !== "") action.detail = detail;
						state.action = action;
					});
				});
			}
			/** Dismiss the settled install/uninstall action banner. */
			dismissAction() {
				this.store.update((state) => {
					state.action = null;
				});
			}
			/**
			* Approve the ignored build scripts of the settled failed action and retry
			* the install. The user approves explicitly from the banner; pnpm ≥10
			* blocks dependency build scripts until allowed, which is the commonest
			* reason a native-dependency plugin fails to install.
			* @param fullName - the `owner/repo` catalog id of the failed action.
			*/
			approveBuilds(fullName) {
				const action = this.store.getSnapshot().action;
				if (action === null || action.status !== "error" || action.ignoredBuilds === void 0) return;
				this.ports.approveBuilds(action.ignoredBuilds).then((result) => {
					if (!result.ok) {
						this.store.update((state) => {
							if (state.action?.fullName !== fullName) return;
							state.action.detail = result.error ?? "approve-builds failed";
						});
						return;
					}
					this.install(fullName);
				}, () => {
					this.store.update((state) => {
						if (state.action?.fullName !== fullName) return;
						state.action.detail = "approve-builds remote failed";
					});
				});
			}
			/**
			* Re-boot the application tree so profile changes take effect. When an
			* agent conversation is mid-turn the reboot would interrupt it, so the
			* restart is gated behind an explicit confirmation that stays open while
			* activity is live. A failed activity read does not block the reboot — the
			* guard is a safety nicety, not a gate.
			*/
			async restart() {
				let activity;
				try {
					activity = await this.ports.status();
				} catch {
					await this.ports.restart();
					return;
				}
				if (!activity.running) {
					await this.ports.restart();
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
			/** Confirm the pending restart: re-boot the application tree in place. */
			confirmRestart() {
				this.stopRestartPoll();
				this.store.update((state) => {
					state.restartConfirm = false;
				});
				this.ports.restart();
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
			actionFailed: "操作失败",
			copyError: "复制错误信息",
			approveBuilds: "允许构建脚本并重试",
			restart: "重启应用",
			dismiss: "关闭",
			restartConfirmTitle: "确认重启",
			restartRunning: "有 {count} 个 Agent 正在运行，重启会中断它们。",
			restartSafe: "当前没有运行中的会话，可以安全重启。",
			restartUnavailable: "无法读取运行状态，仍可继续。",
			restartAcknowledge: "我知道重启会中断正在运行的对话",
			restartConfirm: "确认重启",
			restartCancel: "取消",
			copyLoaded: "复制已加载 {loaded}/{total} 项 (for Agent)",
			copyAgentList: "复制给 Agent",
			copied: "已复制",
			copyFailed: "复制失败",
			openRepo: "打开仓库",
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
			installLabel: "安装",
			installCommandHint: "在终端运行以下命令安装此插件：",
			uninstallCommandHint: "在终端运行以下命令卸载此插件：",
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
			actionFailed: "Operation failed",
			copyError: "Copy error",
			approveBuilds: "Approve build scripts and retry",
			restart: "Restart app",
			dismiss: "Dismiss",
			restartConfirmTitle: "Confirm restart",
			restartRunning: "{count} agent(s) are running; restarting interrupts them.",
			restartSafe: "No conversations are running; a restart is safe.",
			restartUnavailable: "Could not read the running state; you may still continue.",
			restartAcknowledge: "I understand restarting interrupts running conversations",
			restartConfirm: "Restart now",
			restartCancel: "Cancel",
			copyLoaded: "Copy loaded {loaded}/{total} (for Agent)",
			copyAgentList: "Copy for Agent",
			copied: "Copied",
			copyFailed: "Copy failed",
			openRepo: "Open repository",
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
			installLabel: "Install",
			installCommandHint: "Run this command in a terminal to install:",
			uninstallCommandHint: "Run this command in a terminal to uninstall:",
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
		//#region src/client/agent-copy.ts
		/**
		* Whether a plugin row is already installed (module-name match against the
		* Host inventory).
		* @param plugin - the plugin row.
		* @param installed - installed module names from the Host inventory remote.
		* @returns whether the package or probed npm name is installed.
		*/
		function isInstalled(plugin, installed) {
			if (installed.length === 0) return false;
			const names = new Set(installed);
			return names.has(plugin.name) || plugin.install?.pkgName !== void 0 && names.has(plugin.install.pkgName);
		}
		/**
		* The documented install command of a plugin, when installable.
		* @param plugin - the plugin row.
		* @returns the exact install command, or null when the catalog probed none.
		*/
		function installCommand(plugin) {
			return plugin.install?.cmd ?? null;
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
				"Install any of these with: dsh plugin --profile web add <pkg>"
			].join("\n");
		}
		//#endregion
		//#region src/client/action-banner.tsx
		/** The running label of an in-flight operation.
		* @param action - the in-flight operation.
		* @param t - the marketplace dictionary translator.
		* @returns the localized installing/uninstalling label.
		*/
		function runningLabel(action, t) {
			return action.kind === "install" ? t("installing") : t("uninstalling");
		}
		/** The settled banner tone + text of an operation.
		* @param action - the settled operation.
		* @param t - the marketplace dictionary translator.
		* @returns the banner tone, localized text, and the specific failure text.
		*/
		function actionBanner(action, t) {
			if (action.status === "ok") return {
				tone: "ok",
				text: action.kind === "install" ? t("installSuccess") : t("uninstallSuccess")
			};
			const state = {
				tone: "error",
				text: action.message === "not-installable" ? t("notInstallable") : t("actionFailed")
			};
			if (action.detail !== void 0) state.detail = action.detail;
			return state;
		}
		/** The copy payload of a failed operation: the plugin, the command that ran,
		* the outcome code, and the specific failure text, in a keyed layout an
		* agent or an issue can consume directly. When the profile manager captured
		* no diagnostics, the payload says so and points at a terminal re-run.
		* @param action - the settled operation.
		* @returns the clipboard text.
		*/
		function errorCopyText(action) {
			const lines = [`${action.kind === "install" ? "Install" : "Uninstall"} failed: ${action.fullName}`];
			if (action.command !== void 0 && action.command !== "") lines.push(`Command: ${action.command}`);
			lines.push(`Status: ${action.message}`);
			if (action.detail !== void 0 && action.detail !== "") lines.push(`Error:\n${action.detail}`);
			else if (action.message !== "not-installable") lines.push("Error: no pnpm diagnostics captured; re-run the command in a terminal to see the full output.");
			return lines.join("\n");
		}
		/** Render the settled install/uninstall banner: the outcome line, the
		* restart action on success, a copy action for the specific failure text and
		* an approve-build-scripts retry on error, and the dismiss action.
		* @param props - the settled action and the host-surface callbacks and styles.
		* @returns the banner element.
		*/
		function ActionBanner({ action, onRestart, onDismissAction, onApproveBuilds, t, css }) {
			const banner = actionBanner(action, t);
			const errorCopy = useMarketCopyFeedback(errorCopyText(action));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/action-banner.tsx:107:5:div",
				className: css.actionBanner,
				"data-tone": banner.tone,
				role: "status",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/action-banner.tsx:108:7:span",
						className: css.actionText,
						children: banner.text
					}),
					action.status === "ok" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/action-banner.tsx:110:9:button",
						type: "button",
						className: css.action,
						onClick: onRestart,
						children: t("restart")
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/action-banner.tsx:114:9:button",
						type: "button",
						className: css.action,
						onClick: errorCopy.onCopy,
						"aria-label": t("copyError"),
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/action-banner.tsx:120:11:IconCopyOutline16",
							size: 14
						}), errorCopy.copied ? t("copied") : t("copyError")]
					}),
					action.status === "error" && action.ignoredBuilds !== void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/action-banner.tsx:125:9:button",
						type: "button",
						className: css.action,
						onClick: onApproveBuilds,
						children: t("approveBuilds")
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/action-banner.tsx:129:7:button",
						type: "button",
						className: css.action,
						onClick: onDismissAction,
						children: t("dismiss")
					}),
					banner.detail === void 0 || banner.detail === "" ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/action-banner.tsx:133:9:code",
						className: css.errorDetail,
						children: banner.detail
					})
				]
			});
		}
		//#endregion
		//#region \0dsh-css:/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.module.css.mjs
		const css$5 = ".Cqxsuq_card{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:10px;flex-direction:column;gap:6px;padding:10px 12px;display:flex}.Cqxsuq_body{text-align:left;min-width:0;color:inherit;cursor:pointer;background:0 0;border:none;flex-direction:column;gap:4px;padding:0;display:flex}.Cqxsuq_titleRow{align-items:center;gap:6px;min-width:0;display:flex}.Cqxsuq_name{color:var(--dsw-alias-label-primary);white-space:nowrap;text-overflow:ellipsis;font-size:14px;font-weight:600;line-height:22px;overflow:hidden}.Cqxsuq_grade{box-sizing:border-box;min-width:18px;height:18px;color:var(--dsw-alias-label-primary);border-radius:4px;flex:none;justify-content:center;align-items:center;padding:0 4px;font-size:11px;font-weight:700;line-height:18px;display:inline-flex}.Cqxsuq_grade[data-grade=S]{background:var(--dsw-alias-state-success-secondary)}.Cqxsuq_grade[data-grade=A]{background:var(--dsw-alias-interactive-bg-hover-accent)}.Cqxsuq_grade[data-grade=B]{background:var(--dsw-alias-interactive-bg-hover)}.Cqxsuq_grade[data-grade=C]{background:var(--dsw-alias-state-warn-secondary)}.Cqxsuq_badge,.Cqxsuq_installed{box-sizing:border-box;border-radius:9px;flex:none;align-items:center;height:18px;padding:0 6px;font-size:11px;font-weight:500;line-height:18px;display:inline-flex}.Cqxsuq_badge{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Cqxsuq_installed{background:var(--dsw-alias-state-success-secondary);color:var(--dsw-alias-label-primary)}.Cqxsuq_metaRow{min-width:0;color:var(--dsw-alias-label-secondary);align-items:center;gap:8px;font-size:12px;line-height:18px;display:flex}.Cqxsuq_metaRow>*+:before{content:\"·\";color:var(--dsw-alias-label-tertiary);margin-right:8px}.Cqxsuq_owner{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.Cqxsuq_meta{flex:none}.Cqxsuq_description{color:var(--dsw-alias-label-secondary);-webkit-line-clamp:2;-webkit-box-orient:vertical;margin:0;font-size:13px;line-height:20px;display:-webkit-box;overflow:hidden}.Cqxsuq_tagRow{align-items:center;gap:6px;min-width:0;display:flex;overflow:hidden}.Cqxsuq_tag{box-sizing:border-box;background:var(--dsw-alias-bg-layer-2);height:20px;color:var(--dsw-alias-label-secondary);border-radius:10px;flex:none;align-items:center;padding:0 8px;font-size:11px;line-height:20px;display:inline-flex}.Cqxsuq_tagMore{color:var(--dsw-alias-label-tertiary);flex:none;font-size:11px}.Cqxsuq_actions{border-top:1px solid var(--dsw-alias-border-l1);flex-wrap:wrap;align-items:center;gap:4px;padding-top:6px;display:flex}.Cqxsuq_action{height:26px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:6px;align-items:center;gap:4px;padding:0 8px;font-size:12px;line-height:26px;display:inline-flex}.Cqxsuq_action:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.Cqxsuq_action:disabled{opacity:.6;cursor:default}.Cqxsuq_action:disabled:hover{color:var(--dsw-alias-label-secondary);background:0 0}.Cqxsuq_actionBanner{box-sizing:border-box;border-radius:8px;flex-wrap:wrap;align-items:center;gap:8px;padding:6px 8px;font-size:12px;line-height:18px;display:flex}.Cqxsuq_actionBanner[data-tone=ok]{background:var(--dsw-alias-state-success-tertiary);color:var(--dsw-alias-state-success-primary)}.Cqxsuq_actionBanner[data-tone=error]{background:var(--dsw-alias-state-warn-tertiary);color:var(--dsw-alias-state-warn-primary)}.Cqxsuq_actionText{flex:1;min-width:0}.Cqxsuq_errorDetail{box-sizing:border-box;background:var(--dsw-alias-state-warn-secondary);min-width:0;max-height:96px;color:var(--dsw-alias-label-secondary);font-family:var(--ds-font-family-code);white-space:pre-wrap;word-break:break-word;--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2);border-radius:6px;flex-basis:100%;padding:6px 8px;font-size:11px;line-height:16px;overflow:auto}";
		const tagId$5 = "@lovstudio/dsh-plugin-marketplace/MarketplaceCard.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$5) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@lovstudio/dsh-plugin-marketplace";
			tag.dataset.pluginCss = tagId$5;
			tag.textContent = css$5;
			document.head.appendChild(tag);
		}
		var MarketplaceCard_module_css_default = {
			"action": "Cqxsuq_action",
			"actionBanner": "Cqxsuq_actionBanner",
			"actionText": "Cqxsuq_actionText",
			"actions": "Cqxsuq_actions",
			"badge": "Cqxsuq_badge",
			"body": "Cqxsuq_body",
			"card": "Cqxsuq_card",
			"description": "Cqxsuq_description",
			"errorDetail": "Cqxsuq_errorDetail",
			"grade": "Cqxsuq_grade",
			"installed": "Cqxsuq_installed",
			"meta": "Cqxsuq_meta",
			"metaRow": "Cqxsuq_metaRow",
			"name": "Cqxsuq_name",
			"owner": "Cqxsuq_owner",
			"tag": "Cqxsuq_tag",
			"tagMore": "Cqxsuq_tagMore",
			"tagRow": "Cqxsuq_tagRow",
			"titleRow": "Cqxsuq_titleRow"
		};
		//#endregion
		//#region src/client/MarketplaceCard.tsx
		/** Localized badge label of one row, when any applies. */
		function badgeLabel(t, plugin) {
			if (plugin.archived) return t("archivedBadge");
			if (plugin.isRisky) return t("riskyBadge");
			if (plugin.isOfficial) return t("officialBadge");
			if (plugin.isFeatured) return t("featuredBadge");
			return null;
		}
		/** Render one marketplace card. */
		function MarketplaceCard({ plugin, installed, locale, action, onInstall, onUninstall, onRestart, onDismissAction, onApproveBuilds, onDetails, onOpenRepository, t }) {
			const idCopy = useMarketCopyFeedback(plugin.fullName);
			const agentCopy = useMarketCopyFeedback(pluginAgentMarkdown(plugin, locale));
			const badge = badgeLabel(t, plugin);
			const installedFlag = isInstalled(plugin, installed);
			const ownAction = action !== null && action.fullName === plugin.fullName ? action : null;
			const running = ownAction?.status === "running";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
				"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:69:5:article",
				className: MarketplaceCard_module_css_default.card,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:70:7:button",
						type: "button",
						className: MarketplaceCard_module_css_default.body,
						onClick: () => {
							onDetails(plugin.fullName);
						},
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:71:9:span",
								className: MarketplaceCard_module_css_default.titleRow,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:72:11:span",
										className: MarketplaceCard_module_css_default.name,
										children: plugin.name
									}),
									plugin.grade === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:74:13:span",
										className: MarketplaceCard_module_css_default.grade,
										"data-grade": plugin.grade,
										children: plugin.grade
									}),
									badge === null ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:76:36:span",
										className: MarketplaceCard_module_css_default.badge,
										children: badge
									}),
									installedFlag ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:77:28:span",
										className: MarketplaceCard_module_css_default.installed,
										children: t("installedBadge")
									}) : null
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:79:9:span",
								className: MarketplaceCard_module_css_default.metaRow,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:80:11:span",
										className: MarketplaceCard_module_css_default.owner,
										children: plugin.fullName
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:81:11:span",
										className: MarketplaceCard_module_css_default.meta,
										children: t("stars", { count: String(plugin.stars) })
									}),
									plugin.language === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:82:51:span",
										className: MarketplaceCard_module_css_default.meta,
										children: plugin.language
									}),
									plugin.score === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:83:48:span",
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
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:85:9:span",
								className: MarketplaceCard_module_css_default.description,
								children: plugin.description
							}),
							plugin.tags.length === 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:87:11:span",
								className: MarketplaceCard_module_css_default.tagRow,
								children: [plugin.tags.slice(0, 3).map((tag) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:89:15:span",
									className: MarketplaceCard_module_css_default.tag,
									children: tag
								}, tag)), plugin.tags.length > 3 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:92:17:span",
									className: MarketplaceCard_module_css_default.tagMore,
									children: t("tagsMore", { count: String(plugin.tags.length - 3) })
								}) : null]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:97:7:div",
						className: MarketplaceCard_module_css_default.actions,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:98:9:button",
								type: "button",
								className: MarketplaceCard_module_css_default.action,
								onClick: () => {
									onDetails(plugin.fullName);
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconListPenOutline16, {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:99:11:IconListPenOutline16",
									size: 14
								}), t("details")]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:102:9:button",
								type: "button",
								className: MarketplaceCard_module_css_default.action,
								onClick: idCopy.onCopy,
								"aria-label": t("copyId"),
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:108:11:IconCopyOutline16",
									size: 14
								}), idCopy.copied ? t("copied") : t("copyId")]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:111:9:button",
								type: "button",
								className: MarketplaceCard_module_css_default.action,
								onClick: agentCopy.onCopy,
								"aria-label": t("copyAgent"),
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:117:11:IconCopyOutline16",
									size: 14
								}), agentCopy.copied ? t("copied") : t("copyAgent")]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:120:9:button",
								type: "button",
								className: MarketplaceCard_module_css_default.action,
								disabled: running,
								onClick: () => {
									if (installedFlag) onUninstall(plugin.fullName);
									else onInstall(plugin.fullName);
								},
								"aria-label": installedFlag ? t("uninstall") : t("install"),
								children: [installedFlag ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconTrashOutline16, {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:130:28:IconTrashOutline16",
									size: 14
								}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconDownloadOutline16, {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:130:63:IconDownloadOutline16",
									size: 14
								}), ownAction !== null && ownAction.status === "running" ? runningLabel(ownAction, t) : installedFlag ? t("uninstall") : t("install")]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:135:9:button",
								type: "button",
								className: MarketplaceCard_module_css_default.action,
								onClick: () => {
									onOpenRepository(plugin.repositoryUrl);
								},
								"aria-label": t("openRepo"),
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRightUpOutline14, {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:141:11:IconRightUpOutline14",
									size: 12
								}), t("openRepo")]
							})
						]
					}),
					ownAction !== null && ownAction.status !== "running" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ActionBanner, {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceCard.tsx:146:9:ActionBanner",
						action: ownAction,
						onRestart,
						onDismissAction,
						onApproveBuilds,
						t,
						css: MarketplaceCard_module_css_default
					}) : null
				]
			});
		}
		//#endregion
		//#region \0dsh-css:/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.module.css.mjs
		const css$4 = "._4OtLRa_backdrop{z-index:30;box-sizing:border-box;background:var(--dsw-alias-bg-mask-1);justify-content:center;align-items:center;padding:24px;display:flex;position:fixed;inset:0}._4OtLRa_dialog{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l3);background:var(--dsw-alias-bg-overlay);width:min(720px,92vw);max-height:86vh;color:var(--dsw-alias-label-primary);box-shadow:var(--dsw-shadow-lv3);--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2);border-radius:14px;flex-direction:column;gap:12px;padding:16px 18px;display:flex;overflow:auto}._4OtLRa_header{justify-content:space-between;align-items:flex-start;gap:12px;display:flex}._4OtLRa_heading{align-items:center;gap:8px;min-width:0;display:flex}._4OtLRa_name{white-space:nowrap;text-overflow:ellipsis;font-size:16px;font-weight:600;line-height:24px;overflow:hidden}._4OtLRa_grade{box-sizing:border-box;border-radius:4px;flex:none;justify-content:center;align-items:center;min-width:18px;height:18px;padding:0 4px;font-size:11px;font-weight:600;line-height:18px;display:inline-flex}._4OtLRa_grade[data-grade=S]{background:var(--dsw-alias-state-success-secondary);color:var(--dsw-alias-state-success-primary)}._4OtLRa_grade[data-grade=A]{background:var(--dsw-alias-interactive-bg-hover-accent);color:var(--dsw-alias-brand-primary)}._4OtLRa_grade[data-grade=B]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}._4OtLRa_grade[data-grade=C]{background:var(--dsw-alias-state-warn-secondary);color:var(--dsw-alias-state-warn-primary)}._4OtLRa_close{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:50%;flex:none;justify-content:center;align-items:center;display:inline-flex}._4OtLRa_close:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}._4OtLRa_meta{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:10px;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:8px 16px;margin:0;padding:10px 12px;display:grid}._4OtLRa_metaItem{flex-direction:column;gap:2px;min-width:0;display:flex}._4OtLRa_metaItem dt{color:var(--dsw-alias-label-tertiary);font-size:11px}._4OtLRa_metaItem dd{white-space:nowrap;text-overflow:ellipsis;margin:0;font-size:13px;line-height:20px;overflow:hidden}._4OtLRa_intro{color:var(--dsw-alias-label-primary);margin:0;font-size:13px;line-height:20px}._4OtLRa_highlights{color:var(--dsw-alias-label-secondary);margin:0;padding-left:18px;font-size:13px;line-height:20px}._4OtLRa_description{color:var(--dsw-alias-label-secondary);margin:0;font-size:13px;line-height:20px}._4OtLRa_tags{flex-wrap:wrap;align-items:center;gap:6px;display:flex}._4OtLRa_tagsLabel{color:var(--dsw-alias-label-tertiary);font-size:12px}._4OtLRa_tag{box-sizing:border-box;background:var(--dsw-alias-bg-layer-2);height:20px;color:var(--dsw-alias-label-secondary);border-radius:10px;align-items:center;padding:0 8px;font-size:11px;line-height:20px;display:inline-flex}._4OtLRa_risk{box-sizing:border-box;border:1px solid var(--dsw-alias-state-warn-secondary);background:var(--dsw-alias-state-warn-tertiary);color:var(--dsw-alias-state-warn-primary);border-radius:8px;align-items:flex-start;gap:6px;margin:0;padding:8px 10px;font-size:12px;line-height:18px;display:flex}._4OtLRa_install{flex-direction:column;gap:4px;display:flex}._4OtLRa_installLabel{color:var(--dsw-alias-label-tertiary);font-size:12px}._4OtLRa_command{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-markdown-code-block);color:var(--dsw-alias-label-primary);font-family:var(--ds-font-family-code);overflow-wrap:anywhere;border-radius:8px;padding:8px 10px;font-size:12px;line-height:18px;display:block}._4OtLRa_notInstallable{color:var(--dsw-alias-label-secondary);font-size:13px}._4OtLRa_actions{border-top:1px solid var(--dsw-alias-border-l1);flex-wrap:wrap;align-items:center;gap:4px;padding-top:6px;display:flex}._4OtLRa_action{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-button-elevated-fill);height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;border-radius:8px;align-items:center;gap:4px;padding:0 10px;font-size:12px;line-height:28px;display:inline-flex}._4OtLRa_action:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}._4OtLRa_action:disabled{opacity:.6;cursor:default}._4OtLRa_action:disabled:hover{color:var(--dsw-alias-label-secondary);background:0 0}._4OtLRa_actionBanner{box-sizing:border-box;border-radius:8px;flex-wrap:wrap;align-items:center;gap:8px;padding:8px 10px;font-size:12px;line-height:18px;display:flex}._4OtLRa_actionBanner[data-tone=ok]{background:var(--dsw-alias-state-success-tertiary);color:var(--dsw-alias-state-success-primary)}._4OtLRa_actionBanner[data-tone=error]{background:var(--dsw-alias-state-warn-tertiary);color:var(--dsw-alias-state-warn-primary)}._4OtLRa_actionText{flex:1;min-width:0}._4OtLRa_errorDetail{box-sizing:border-box;background:var(--dsw-alias-state-warn-secondary);min-width:0;max-height:96px;color:var(--dsw-alias-label-secondary);font-family:var(--ds-font-family-code);white-space:pre-wrap;word-break:break-word;--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2);border-radius:6px;flex-basis:100%;padding:6px 8px;font-size:11px;line-height:16px;overflow:auto}._4OtLRa_center{flex-direction:column;align-items:center;gap:8px;padding:24px 0;display:flex}._4OtLRa_error{color:var(--dsw-alias-state-error-primary);margin:0;font-size:13px}";
		const tagId$4 = "@lovstudio/dsh-plugin-marketplace/MarketplaceDetail.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$4) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@lovstudio/dsh-plugin-marketplace";
			tag.dataset.pluginCss = tagId$4;
			tag.textContent = css$4;
			document.head.appendChild(tag);
		}
		var MarketplaceDetail_module_css_default = {
			"action": "_4OtLRa_action",
			"actionBanner": "_4OtLRa_actionBanner",
			"actionText": "_4OtLRa_actionText",
			"actions": "_4OtLRa_actions",
			"backdrop": "_4OtLRa_backdrop",
			"center": "_4OtLRa_center",
			"close": "_4OtLRa_close",
			"command": "_4OtLRa_command",
			"description": "_4OtLRa_description",
			"dialog": "_4OtLRa_dialog",
			"error": "_4OtLRa_error",
			"errorDetail": "_4OtLRa_errorDetail",
			"grade": "_4OtLRa_grade",
			"header": "_4OtLRa_header",
			"heading": "_4OtLRa_heading",
			"highlights": "_4OtLRa_highlights",
			"install": "_4OtLRa_install",
			"installLabel": "_4OtLRa_installLabel",
			"intro": "_4OtLRa_intro",
			"meta": "_4OtLRa_meta",
			"metaItem": "_4OtLRa_metaItem",
			"name": "_4OtLRa_name",
			"notInstallable": "_4OtLRa_notInstallable",
			"risk": "_4OtLRa_risk",
			"tag": "_4OtLRa_tag",
			"tags": "_4OtLRa_tags",
			"tagsLabel": "_4OtLRa_tagsLabel"
		};
		//#endregion
		//#region src/client/MarketplaceDetail.tsx
		/**
		* Detail dialog of one plugin: localized copy, quality assessment, install
		* guidance, and the same copy actions as the card. Rendered by the
		* marketplace surface as a fixed overlay; Escape and backdrop clicks close it.
		*/
		/** The localized copy block of a detail payload for the active locale. */
		function localizedOf(detail, locale) {
			return detail.i18n?.[locale] ?? {};
		}
		/** Render the detail dialog. */
		function MarketplaceDetail({ detail, status, locale, installed, action, onInstall, onUninstall, onRestart, onDismissAction, onApproveBuilds, onClose, onRetry, onOpenRepository, t }) {
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
			const ownAction = action !== null && detail !== null && action.fullName === detail.fullName ? action : null;
			const running = ownAction?.status === "running";
			const agentCopy = useMarketCopyFeedback(detail === null ? "" : pluginAgentMarkdown(detail, locale));
			const idCopy = useMarketCopyFeedback(detail?.fullName ?? "");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:78:5:div",
				className: MarketplaceDetail_module_css_default.backdrop,
				role: "presentation",
				onMouseDown: (event) => {
					if (event.target === event.currentTarget) onClose();
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
					"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:85:7:section",
					className: MarketplaceDetail_module_css_default.dialog,
					role: "dialog",
					"aria-modal": "true",
					"aria-label": t("detailTitle"),
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:86:9:header",
							className: MarketplaceDetail_module_css_default.header,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:87:11:div",
								className: MarketplaceDetail_module_css_default.heading,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:88:13:span",
									className: MarketplaceDetail_module_css_default.name,
									children: detail?.name ?? "…"
								}), detail?.grade === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:90:15:span",
									className: MarketplaceDetail_module_css_default.grade,
									"data-grade": detail.grade,
									children: detail.grade
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:93:11:button",
								type: "button",
								className: MarketplaceDetail_module_css_default.close,
								onClick: onClose,
								"aria-label": t("detailClose"),
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:94:13:IconCloseOutline16",
									size: 16
								})
							})]
						}),
						status === "loading" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:98:33:p",
							className: MarketplaceDetail_module_css_default.center,
							children: t("loading")
						}) : null,
						status === "error" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:101:11:div",
							className: MarketplaceDetail_module_css_default.center,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:102:13:p",
								className: MarketplaceDetail_module_css_default.error,
								children: t("detailError")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:103:13:button",
								type: "button",
								className: MarketplaceDetail_module_css_default.action,
								onClick: onRetry,
								children: t("detailRetry")
							})]
						}) : null,
						status === "ready" && detail !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("dl", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:109:13:dl",
								className: MarketplaceDetail_module_css_default.meta,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:110:15:div",
										className: MarketplaceDetail_module_css_default.metaItem,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:111:17:dt",
											children: t("authorLabel")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:112:17:dd",
											children: detail.owner
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:114:15:div",
										className: MarketplaceDetail_module_css_default.metaItem,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:115:17:dt",
											children: t("categoryLabel")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:116:17:dd",
											children: detail.category === void 0 || detail.category.length === 0 ? "—" : detail.category
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:118:15:div",
										className: MarketplaceDetail_module_css_default.metaItem,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:119:17:dt",
											children: t("languageLabel")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:120:17:dd",
											children: detail.language ?? t("languageUnknown")
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:122:15:div",
										className: MarketplaceDetail_module_css_default.metaItem,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:123:17:dt",
											children: t("gradeLabel")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:124:17:dd",
											children: detail.grade ?? t("gradeNone")
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:126:15:div",
										className: MarketplaceDetail_module_css_default.metaItem,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:127:17:dt",
											children: t("scoreLabel")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:128:17:dd",
											children: detail.score === void 0 ? "—" : String(detail.score)
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:130:15:div",
										className: MarketplaceDetail_module_css_default.metaItem,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:131:17:dt",
											children: t("stars", { count: String(detail.stars) })
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:132:17:dd",
											children: String(detail.stars)
										})]
									}),
									detail.contributors === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:135:17:div",
										className: MarketplaceDetail_module_css_default.metaItem,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:136:19:dt",
											children: t("contributorsLabel")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:137:19:dd",
											children: String(detail.contributors)
										})]
									})
								]
							}),
							copy?.intro === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:143:15:p",
								className: MarketplaceDetail_module_css_default.intro,
								children: copy.intro
							}),
							copy?.highlights === void 0 || copy.highlights.length === 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:146:15:ul",
								className: MarketplaceDetail_module_css_default.highlights,
								children: copy.highlights.map((highlight) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:147:51:li",
									children: highlight
								}, highlight))
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:150:13:p",
								className: MarketplaceDetail_module_css_default.description,
								children: detail.description
							}),
							detail.tags.length === 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:153:15:div",
								className: MarketplaceDetail_module_css_default.tags,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:154:17:span",
									className: MarketplaceDetail_module_css_default.tagsLabel,
									children: t("tagsLabel")
								}), detail.tags.map((tag) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:155:41:span",
									className: MarketplaceDetail_module_css_default.tag,
									children: tag
								}, tag))]
							}),
							detail.isRisky ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:160:15:p",
								className: MarketplaceDetail_module_css_default.risk,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:161:17:IconWarningOutline16",
									size: 14
								}), detail.riskNote !== void 0 ? detail.riskNote : t("riskyBadge")]
							}) : null,
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:166:13:div",
								className: MarketplaceDetail_module_css_default.install,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:167:15:span",
									className: MarketplaceDetail_module_css_default.installLabel,
									children: t("installLabel")
								}), install === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:169:17:span",
									className: MarketplaceDetail_module_css_default.notInstallable,
									children: t("notInstallable")
								}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:171:17:code",
									className: MarketplaceDetail_module_css_default.command,
									children: install.pkgName ?? detail.name
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:175:13:div",
								className: MarketplaceDetail_module_css_default.actions,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:176:15:button",
										type: "button",
										className: MarketplaceDetail_module_css_default.action,
										onClick: idCopy.onCopy,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:177:17:IconCopyOutline16",
											size: 14
										}), idCopy.copied ? t("copied") : t("copyId")]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:180:15:button",
										type: "button",
										className: MarketplaceDetail_module_css_default.action,
										onClick: agentCopy.onCopy,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:181:17:IconCopyOutline16",
											size: 14
										}), agentCopy.copied ? t("copied") : t("copyAgent")]
									}),
									install === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:185:17:button",
										type: "button",
										className: MarketplaceDetail_module_css_default.action,
										disabled: running,
										onClick: () => {
											if (installedFlag) onUninstall(detail.fullName);
											else onInstall(detail.fullName);
										},
										children: [installedFlag ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconTrashOutline16, {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:194:36:IconTrashOutline16",
											size: 14
										}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconDownloadOutline16, {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:194:71:IconDownloadOutline16",
											size: 14
										}), ownAction !== null && ownAction.status === "running" ? runningLabel(ownAction, t) : installedFlag ? t("uninstall") : t("install")]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:200:15:button",
										type: "button",
										className: MarketplaceDetail_module_css_default.action,
										onClick: () => {
											onOpenRepository(detail.repositoryUrl);
										},
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRightUpOutline14, {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:205:17:IconRightUpOutline14",
											size: 12
										}), t("openRepo")]
									})
								]
							}),
							ownAction !== null && ownAction.status !== "running" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ActionBanner, {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceDetail.tsx:211:15:ActionBanner",
								action: ownAction,
								onRestart,
								onDismissAction,
								onApproveBuilds,
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
		//#region \0dsh-css:/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.module.css.mjs
		const css$3 = ".YNHX0W_root{flex-direction:column;gap:8px;width:100%;min-height:0;display:flex}.YNHX0W_toolbar{align-items:center;gap:6px;display:flex}.YNHX0W_toolbarControls{flex:none;align-items:center;gap:6px;display:flex}.YNHX0W_searchWrap{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);min-width:0;height:32px;color:var(--dsw-alias-label-secondary);border-radius:8px;flex:1;align-items:center;gap:6px;padding:0 10px;display:inline-flex}.YNHX0W_search{min-width:0;color:var(--dsw-alias-label-primary);background:0 0;border:none;outline:none;flex:1;font-size:13px;line-height:20px}.YNHX0W_search::placeholder{color:var(--dsw-alias-label-tertiary)}.YNHX0W_searchWrap:focus-within,.YNHX0W_filterRow:focus-within,.YNHX0W_action:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}.YNHX0W_select{box-sizing:border-box;min-width:0;height:30px;color:var(--dsw-alias-label-primary);background:0 0;border:0;outline:0;flex:1;padding:0 24px 0 0;font-size:13px}.YNHX0W_input{box-sizing:border-box;min-width:0;height:30px;color:var(--dsw-alias-label-primary);background:0 0;border:0;outline:0;flex:1;padding:0 8px 0 0;font-size:13px}.YNHX0W_acknowledgement{color:var(--dsw-alias-label-primary);cursor:pointer;align-items:center;gap:8px;margin-top:12px;font-size:13px;line-height:1.5;display:flex}.YNHX0W_acknowledgement input{width:16px;height:16px;accent-color:var(--dsw-alias-interactive-primary)}.YNHX0W_action{height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:0;border-radius:6px;align-items:center;gap:4px;padding:0 8px;font-size:12px;line-height:18px;display:inline-flex}.YNHX0W_action:not(:disabled):hover,.YNHX0W_action[aria-expanded=true],.YNHX0W_action[data-active=true]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.YNHX0W_toolbarAction{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);height:32px;color:var(--dsw-alias-label-primary);border-radius:8px;padding:0 12px;font-size:13px}.YNHX0W_toolbarAction:not(:disabled):hover,.YNHX0W_toolbarAction[aria-expanded=true],.YNHX0W_toolbarAction[data-active=true]{border-color:var(--dsw-alias-border-l1)}.YNHX0W_action:disabled,.YNHX0W_select:disabled,.YNHX0W_input:disabled{cursor:not-allowed;opacity:.5}.YNHX0W_filters{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:10px;gap:8px;padding:10px;display:grid}.YNHX0W_sortPanel{gap:4px;padding:8px 10px}.YNHX0W_sortRow{grid-template-columns:64px minmax(0,1fr);align-items:center;gap:8px;min-height:28px;display:grid}.YNHX0W_sortPanelLabel{color:var(--dsw-alias-label-tertiary);font-size:12px}.YNHX0W_sortChoices{flex-wrap:wrap;align-items:center;gap:2px;display:flex}.YNHX0W_sortChoice{height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:0;border-radius:6px;padding:0 8px;font-size:12px;line-height:18px}.YNHX0W_sortChoice:hover,.YNHX0W_sortChoice[aria-pressed=true]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.YNHX0W_sortChoice:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:1px}.YNHX0W_filterHint{color:var(--dsw-alias-state-warn-label);margin:0;font-size:12px;line-height:18px}.YNHX0W_filterFields{grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;display:grid}.YNHX0W_filterRow{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:8px;align-items:center;gap:8px;min-width:0;height:32px;padding-left:10px;display:flex}.YNHX0W_filterLabel{color:var(--dsw-alias-label-tertiary);white-space:nowrap;flex:none;font-size:12px}.YNHX0W_filterFooter{justify-content:space-between;align-items:center;gap:8px;min-height:28px;display:flex}.YNHX0W_checkRow{flex-wrap:wrap;align-items:center;gap:2px;display:flex}.YNHX0W_check{height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;border-radius:6px;align-items:center;gap:5px;padding:0 6px;font-size:12px;display:inline-flex}.YNHX0W_check:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.YNHX0W_check input{width:14px;height:14px;accent-color:var(--dsw-alias-interactive-primary);margin:0}.YNHX0W_filterClear{flex:none;margin-left:auto}.YNHX0W_filterClear:disabled{visibility:hidden}@media (width<=640px){.YNHX0W_filterFields{grid-template-columns:repeat(2,minmax(0,1fr))}}.YNHX0W_help{grid-template-columns:max-content minmax(0,1fr);gap:2px 8px;margin:0;font-size:12px;line-height:18px;display:grid}.YNHX0W_help dt{color:var(--dsw-alias-label-secondary);font-weight:500}.YNHX0W_help dd{min-width:0;color:var(--dsw-alias-label-tertiary);margin:0}.YNHX0W_metaRow{flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;display:flex}.YNHX0W_metaInfo{flex-wrap:wrap;align-items:center;gap:8px;min-width:0;display:flex}.YNHX0W_total{color:var(--dsw-alias-label-secondary);font-size:12px}.YNHX0W_loaded,.YNHX0W_metaSeparator{color:var(--dsw-alias-label-tertiary);font-size:12px}.YNHX0W_copyAction{color:var(--dsw-alias-label-secondary);margin-left:auto}.YNHX0W_mergedNote{color:var(--dsw-alias-state-warn-label);font-size:12px}.YNHX0W_list{flex-direction:column;gap:8px;min-height:0;display:flex}.YNHX0W_state{color:var(--dsw-alias-label-secondary);justify-content:center;align-items:center;gap:8px;margin:0;padding:16px 0;font-size:13px;display:flex}.YNHX0W_pagination{justify-content:center;min-height:1px;display:flex}";
		const tagId$3 = "@lovstudio/dsh-plugin-marketplace/MarketplaceRoot.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@lovstudio/dsh-plugin-marketplace";
			tag.dataset.pluginCss = tagId$3;
			tag.textContent = css$3;
			document.head.appendChild(tag);
		}
		var MarketplaceRoot_module_css_default = {
			"acknowledgement": "YNHX0W_acknowledgement",
			"action": "YNHX0W_action",
			"check": "YNHX0W_check",
			"checkRow": "YNHX0W_checkRow",
			"copyAction": "YNHX0W_copyAction",
			"filterClear": "YNHX0W_filterClear",
			"filterFields": "YNHX0W_filterFields",
			"filterFooter": "YNHX0W_filterFooter",
			"filterHint": "YNHX0W_filterHint",
			"filterLabel": "YNHX0W_filterLabel",
			"filterRow": "YNHX0W_filterRow",
			"filters": "YNHX0W_filters",
			"help": "YNHX0W_help",
			"input": "YNHX0W_input",
			"list": "YNHX0W_list",
			"loaded": "YNHX0W_loaded",
			"mergedNote": "YNHX0W_mergedNote",
			"metaInfo": "YNHX0W_metaInfo",
			"metaRow": "YNHX0W_metaRow",
			"metaSeparator": "YNHX0W_metaSeparator",
			"pagination": "YNHX0W_pagination",
			"root": "YNHX0W_root",
			"search": "YNHX0W_search",
			"searchWrap": "YNHX0W_searchWrap",
			"select": "YNHX0W_select",
			"sortChoice": "YNHX0W_sortChoice",
			"sortChoices": "YNHX0W_sortChoices",
			"sortPanel": "YNHX0W_sortPanel",
			"sortPanelLabel": "YNHX0W_sortPanelLabel",
			"sortRow": "YNHX0W_sortRow",
			"state": "YNHX0W_state",
			"toolbar": "YNHX0W_toolbar",
			"toolbarAction": "YNHX0W_toolbarAction",
			"toolbarControls": "YNHX0W_toolbarControls",
			"total": "YNHX0W_total"
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
				"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:61:5:div",
				id,
				className: `${MarketplaceRoot_module_css_default.filters} ${MarketplaceRoot_module_css_default.sortPanel}`,
				role: "region",
				"aria-label": t("sortLabel"),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:62:7:div",
					className: MarketplaceRoot_module_css_default.sortRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:63:9:span",
						className: MarketplaceRoot_module_css_default.sortPanelLabel,
						children: t("sortDimension")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:64:9:div",
						className: MarketplaceRoot_module_css_default.sortChoices,
						children: SORT_FIELDS.map((option) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:66:13:button",
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
					"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:78:7:div",
					className: MarketplaceRoot_module_css_default.sortRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:79:9:span",
						className: MarketplaceRoot_module_css_default.sortPanelLabel,
						children: t("sortDirection")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:80:9:div",
						className: MarketplaceRoot_module_css_default.sortChoices,
						children: SORT_ORDERS.map((option) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:82:13:button",
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
				"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:140:5:div",
				id,
				className: MarketplaceRoot_module_css_default.filters,
				role: "region",
				"aria-label": t("filterLabel"),
				children: [
					searchFiltersActive ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:142:9:p",
						id: hintId,
						className: MarketplaceRoot_module_css_default.filterHint,
						children: t("searchFiltersOverride")
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:144:7:div",
						className: MarketplaceRoot_module_css_default.filterFields,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:145:9:label",
								className: MarketplaceRoot_module_css_default.filterRow,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:146:11:span",
									className: MarketplaceRoot_module_css_default.filterLabel,
									children: t("filterCategory")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:147:11:select",
									className: MarketplaceRoot_module_css_default.select,
									value: category,
									disabled: queryFilters.category !== void 0,
									"aria-describedby": queryFilters.category === void 0 ? void 0 : hintId,
									onChange: (event) => {
										commit({ category: event.target.value });
									},
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:154:13:option",
											value: "",
											children: "—"
										}),
										queryFilters.category !== void 0 && !facets.some((facet) => facet.value === queryFilters.category) ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:156:15:option",
											value: queryFilters.category,
											children: queryFilters.category
										}) : null,
										facets.map((facet) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:159:15:option",
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
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:163:9:label",
								className: MarketplaceRoot_module_css_default.filterRow,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:164:11:span",
									className: MarketplaceRoot_module_css_default.filterLabel,
									children: t("filterOwner")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:165:11:input",
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
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:178:9:label",
								className: MarketplaceRoot_module_css_default.filterRow,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:179:11:span",
									className: MarketplaceRoot_module_css_default.filterLabel,
									children: t("filterLanguage")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:180:11:input",
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
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:193:9:label",
								className: MarketplaceRoot_module_css_default.filterRow,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:194:11:span",
									className: MarketplaceRoot_module_css_default.filterLabel,
									children: t("filterGrade")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:195:11:select",
									className: MarketplaceRoot_module_css_default.select,
									value: grade,
									disabled: queryFilters.grade !== void 0,
									"aria-describedby": queryFilters.grade === void 0 ? void 0 : hintId,
									onChange: (event) => {
										commit({ grade: event.target.value });
									},
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:202:13:option",
											value: "",
											children: "—"
										}),
										queryFilters.grade !== void 0 && ![
											"S",
											"A",
											"B",
											"C"
										].includes(queryFilters.grade) ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:204:15:option",
											value: queryFilters.grade,
											children: queryFilters.grade
										}) : null,
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:206:13:option",
											value: "S",
											children: "S"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:207:13:option",
											value: "A",
											children: "A"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:208:13:option",
											value: "B",
											children: "B"
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:209:13:option",
											value: "C",
											children: "C"
										})
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:213:7:div",
						className: MarketplaceRoot_module_css_default.filterFooter,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:214:9:div",
							className: MarketplaceRoot_module_css_default.checkRow,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:215:11:label",
									className: MarketplaceRoot_module_css_default.check,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:216:13:input",
										type: "checkbox",
										checked: filters.featured,
										onChange: (event) => {
											commit({ featured: event.target.checked });
										}
									}), t("filterFeatured")]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:223:11:label",
									className: MarketplaceRoot_module_css_default.check,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:224:13:input",
										type: "checkbox",
										checked: filters.official,
										onChange: (event) => {
											commit({ official: event.target.checked });
										}
									}), t("filterOfficial")]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:231:11:label",
									className: MarketplaceRoot_module_css_default.check,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:232:13:input",
										type: "checkbox",
										checked: filters.installable,
										onChange: (event) => {
											commit({ installable: event.target.checked });
										}
									}), t("filterInstallable")]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:239:11:label",
									className: MarketplaceRoot_module_css_default.check,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:240:13:input",
										type: "checkbox",
										checked: installedOnly,
										onChange: (event) => {
											onInstalledOnlyChange(event.target.checked);
										}
									}), t("filterInstalled")]
								})
							]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:248:9:button",
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
		/** Restart confirmation dialog: gates the reboot while agents run. */
		function RestartConfirmDialog({ activity, unavailable, onConfirm, onCancel, t }) {
			const [acknowledged, setAcknowledged] = (0, react.useState)(false);
			const running = activity?.running === true;
			const description = unavailable ? t("restartUnavailable") : running ? t("restartRunning", { count: String(activity.active) }) : t("restartSafe");
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
				"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:301:5:Modal",
				open: true,
				onClose: onCancel,
				title: t("restartConfirmTitle"),
				description,
				footer: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:308:11:Button",
					variant: "outline",
					onClick: onCancel,
					children: t("restartCancel")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
					"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:309:11:Button",
					variant: "primary",
					disabled: running && !acknowledged,
					onClick: onConfirm,
					children: t("restartConfirm")
				})] }),
				children: running ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
					"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:316:9:label",
					className: MarketplaceRoot_module_css_default.acknowledgement,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:317:11:input",
						type: "checkbox",
						checked: acknowledged,
						onChange: (event) => {
							setAcknowledged(event.currentTarget.checked);
						}
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:322:11:span",
						children: t("restartAcknowledge")
					})]
				}) : null
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
				"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:389:5:div",
				className: MarketplaceRoot_module_css_default.root,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:390:7:div",
						className: MarketplaceRoot_module_css_default.toolbar,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:391:9:label",
							className: MarketplaceRoot_module_css_default.searchWrap,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconSearchOutline16, {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:392:11:IconSearchOutline16",
								size: 16
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:393:11:input",
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
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:402:9:div",
							className: MarketplaceRoot_module_css_default.toolbarControls,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:403:11:button",
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
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:416:11:button",
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
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:432:9:FilterPanel",
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
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:446:9:SortPanel",
						id: sortId,
						sort: view.sort,
						order: view.order,
						onChange: (sort, order) => {
							controller.applyOrdering(sort, order);
						},
						t
					}) : null,
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("dl", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:455:7:dl",
						className: MarketplaceRoot_module_css_default.help,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:456:9:dt",
								children: t("searchSyntaxLabel")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:457:9:dd",
								children: t("searchSyntaxHelp")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dt", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:458:9:dt",
								children: t("searchFieldsLabel")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("dd", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:459:9:dd",
								children: t("searchFieldsHelp")
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:462:7:div",
						className: MarketplaceRoot_module_css_default.metaRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:463:9:div",
							className: MarketplaceRoot_module_css_default.metaInfo,
							role: "status",
							"aria-live": "polite",
							"aria-atomic": "true",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:464:11:span",
									className: MarketplaceRoot_module_css_default.total,
									children: t("total", { count: String(view.total) })
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:465:11:span",
									className: MarketplaceRoot_module_css_default.metaSeparator,
									"aria-hidden": "true",
									children: "·"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:466:11:span",
									className: MarketplaceRoot_module_css_default.loaded,
									children: t("loadedCount", { count: String(visibleItems.length) })
								}),
								view.mode === "merged" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:467:37:span",
									className: MarketplaceRoot_module_css_default.mergedNote,
									children: t("mergedNote")
								}) : null
							]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:469:9:button",
							type: "button",
							className: `${MarketplaceRoot_module_css_default.action} ${MarketplaceRoot_module_css_default.copyAction}`,
							disabled: visibleItems.length === 0,
							onClick: listCopy.onCopy,
							"aria-label": copyLabel,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCopyOutline16, {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:476:11:IconCopyOutline16",
								size: 14
							}), listCopy.copied ? t("copied") : t("copyAgentList")]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:481:7:div",
						className: MarketplaceRoot_module_css_default.list,
						children: [
							visibleItems.map((plugin) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarketplaceCard, {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:483:11:MarketplaceCard",
								plugin,
								installed: view.installed,
								locale,
								action: view.action,
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
								onApproveBuilds: () => {
									controller.approveBuilds(plugin.fullName);
								},
								onDetails: (fullName) => {
									controller.openDetail(fullName);
								},
								onOpenRepository: openRepository,
								t
							}, plugin.fullName)),
							view.status === "loading" && view.items.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:501:11:p",
								className: MarketplaceRoot_module_css_default.state,
								role: "status",
								children: t("loading")
							}) : null,
							view.status === "loading" && view.items.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:504:11:p",
								className: MarketplaceRoot_module_css_default.state,
								role: "status",
								children: t("loadingMore")
							}) : null,
							view.status === "error" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:507:11:div",
								className: MarketplaceRoot_module_css_default.state,
								role: "alert",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:508:13:p",
									children: t("error")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:509:13:button",
									type: "button",
									className: MarketplaceRoot_module_css_default.action,
									onClick: () => {
										controller.retry();
									},
									children: t("retry")
								})]
							}) : null,
							(view.status === "ready" || view.status === "exhausted") && visibleItems.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:513:11:p",
								className: MarketplaceRoot_module_css_default.state,
								role: "status",
								children: t(view.syncStatus === "syncing" ? "emptySyncing" : input.trim() === "" && filterCount === 0 ? "emptyCatalog" : "empty")
							}) : null,
							view.status === "exhausted" && visibleItems.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:520:11:p",
								className: MarketplaceRoot_module_css_default.state,
								role: "status",
								children: t("exhausted", { count: String(visibleItems.length) })
							}) : null
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:524:7:div",
						ref: sentinelRef,
						className: MarketplaceRoot_module_css_default.pagination,
						"data-testid": "market-sentinel",
						children: view.status === "ready" && view.items.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:526:11:button",
							type: "button",
							className: MarketplaceRoot_module_css_default.action,
							onClick: () => {
								controller.loadNextPage();
							},
							children: t("loadMore")
						}) : null
					}),
					view.restartConfirm ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RestartConfirmDialog, {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:533:9:RestartConfirmDialog",
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
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketplaceRoot.tsx:543:9:MarketplaceDetail",
						detail: view.detail,
						status: view.detailStatus,
						locale,
						installed: view.installed,
						action: view.action,
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
						onApproveBuilds: () => {
							if (view.selected !== null) controller.approveBuilds(view.selected);
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
		//#region \0dsh-css:/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketOverlay.module.css.mjs
		const css$2 = ".FxbWaa_backdrop{z-index:30;box-sizing:border-box;background:var(--dsw-alias-bg-mask-1);justify-content:center;align-items:center;padding:24px;display:flex;position:fixed;inset:0}.FxbWaa_modal{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l3);background:var(--dsw-alias-bg-overlay);width:min(960px,94vw);height:min(86vh,760px);color:var(--dsw-alias-label-primary);box-shadow:var(--dsw-shadow-lv3);border-radius:14px;flex-direction:column;display:flex;overflow:hidden}.FxbWaa_header{box-sizing:border-box;border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;justify-content:space-between;align-items:center;gap:12px;padding:12px 16px;display:flex}.FxbWaa_heading{flex:1;align-items:baseline;gap:8px;min-width:0;display:flex}.FxbWaa_title{font-size:15px;font-weight:600;line-height:22px}.FxbWaa_refresh{min-width:0;max-width:100%;color:var(--dsw-alias-label-tertiary);cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background:0 0;border:none;border-radius:4px;align-items:center;gap:4px;padding:2px 4px;font-size:12px;display:inline-flex;overflow:hidden}.FxbWaa_refresh span{text-overflow:ellipsis;min-width:0;overflow:hidden}.FxbWaa_refresh:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}.FxbWaa_refresh:disabled{cursor:wait}.FxbWaa_spinning{animation:.9s linear infinite FxbWaa_refresh-spin}.FxbWaa_syncError{min-width:0;max-width:360px;color:var(--dsw-alias-label-error);text-overflow:ellipsis;white-space:nowrap;font-size:12px;line-height:18px;overflow:hidden}@keyframes FxbWaa_refresh-spin{to{transform:rotate(360deg)}}.FxbWaa_close{width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:50%;flex:none;justify-content:center;align-items:center;display:inline-flex}.FxbWaa_close:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.FxbWaa_body{box-sizing:border-box;--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2);flex:1;min-height:0;padding:14px 16px 20px;overflow:auto}";
		const tagId$2 = "@lovstudio/dsh-plugin-marketplace/MarketOverlay.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@lovstudio/dsh-plugin-marketplace";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var MarketOverlay_module_css_default = {
			"backdrop": "FxbWaa_backdrop",
			"body": "FxbWaa_body",
			"close": "FxbWaa_close",
			"header": "FxbWaa_header",
			"heading": "FxbWaa_heading",
			"modal": "FxbWaa_modal",
			"refresh": "FxbWaa_refresh",
			"refresh-spin": "FxbWaa_refresh-spin",
			"spinning": "FxbWaa_spinning",
			"syncError": "FxbWaa_syncError",
			"title": "FxbWaa_title"
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
				"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketOverlay.tsx:75:5:div",
				className: MarketOverlay_module_css_default.backdrop,
				role: "presentation",
				onMouseDown: (event) => {
					if (event.target === event.currentTarget) controller.close();
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
					"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketOverlay.tsx:82:7:section",
					className: MarketOverlay_module_css_default.modal,
					role: "dialog",
					"aria-modal": "true",
					"aria-label": props.t("overlayTitle"),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketOverlay.tsx:83:9:header",
						className: MarketOverlay_module_css_default.header,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketOverlay.tsx:84:11:div",
							className: MarketOverlay_module_css_default.heading,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketOverlay.tsx:85:13:span",
									className: MarketOverlay_module_css_default.title,
									children: props.t("overlayTitle")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketOverlay.tsx:86:13:button",
									type: "button",
									className: MarketOverlay_module_css_default.refresh,
									disabled: syncStatus === "syncing",
									"aria-label": props.t("refreshAction"),
									title: syncStatus === "error" ? props.t("refreshFailed") : props.t("refreshAction"),
									onClick: () => {
										controller.syncCatalog();
									},
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRefreshOutline16, {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketOverlay.tsx:94:15:IconRefreshOutline16",
										className: syncStatus === "syncing" ? MarketOverlay_module_css_default.spinning : void 0,
										size: 14
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketOverlay.tsx:95:15:span",
										role: syncStatus === "syncing" ? "status" : void 0,
										children: syncStatus === "syncing" ? syncProgress === null ? props.t("refreshSyncingProgress", {
											synced: "0",
											total: "0"
										}) : progressLabel(syncProgress, props.t) : refreshLabel
									})]
								}),
								syncStatus === "error" && syncError !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketOverlay.tsx:104:15:span",
									className: MarketOverlay_module_css_default.syncError,
									role: "status",
									title: syncError,
									children: props.t("refreshFailedDetail", { reason: syncError })
								}) : null
							]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketOverlay.tsx:109:11:button",
							type: "button",
							className: MarketOverlay_module_css_default.close,
							onClick: () => {
								controller.close();
							},
							"aria-label": props.t("close"),
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCloseOutline16, {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketOverlay.tsx:115:13:IconCloseOutline16",
								size: 16
							})
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketOverlay.tsx:118:9:div",
						className: MarketOverlay_module_css_default.body,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarketplaceRoot, {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketOverlay.tsx:119:11:MarketplaceRoot",
							...props
						})
					})]
				})
			});
		}
		//#endregion
		//#region ../../../node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
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
		//#region \0dsh-css:/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.module.css.mjs
		const css$1 = ".lgEfRa_card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:12px;list-style:none;transition:border-color .16s,background .16s}.lgEfRa_card:hover{border-color:var(--dsw-alias-label-dimmed)}.lgEfRa_cardOpen{border-color:var(--dsw-alias-label-dimmed);background:var(--dsw-alias-bg-layer-2)}.lgEfRa_header{appearance:none;width:100%;color:inherit;font:inherit;text-align:left;cursor:pointer;background:0 0;border:0;border-radius:12px;align-items:center;gap:12px;padding:14px 16px;display:flex}.lgEfRa_header:focus-visible,.lgEfRa_discard:focus-visible,.lgEfRa_save:focus-visible,.lgEfRa_test:focus-visible,.lgEfRa_tokenHelp:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}.lgEfRa_header:focus-visible{outline-offset:-2px}.lgEfRa_headText{flex-direction:column;flex:1;gap:4px;min-width:0;display:flex}.lgEfRa_name{color:var(--dsw-alias-label-primary);font-size:15px;font-weight:600;line-height:1.4}.lgEfRa_description{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:1.5}.lgEfRa_chevron{color:var(--dsw-alias-label-tertiary);flex:none;transition:transform .16s}.lgEfRa_chevronOpen{transform:rotate(180deg)}.lgEfRa_body{border-top:1px solid var(--dsw-alias-border-l2);margin:0 16px;padding-bottom:8px}.lgEfRa_readOnly{color:var(--dsw-alias-label-tertiary);margin:12px 0 0;font-size:12px;line-height:1.5}.lgEfRa_pending,.lgEfRa_badge{background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);white-space:nowrap;border-radius:999px;flex:none;padding:1px 8px;font-size:11px;font-weight:500;line-height:17px}.lgEfRa_field{flex-direction:column;gap:6px;padding:12px 0;display:flex}.lgEfRa_field+.lgEfRa_field{border-top:1px solid var(--dsw-alias-border-l2)}.lgEfRa_fieldHead{align-items:center;gap:8px;display:flex}.lgEfRa_label{min-width:0;color:var(--dsw-alias-label-primary);flex:1;font-size:13px;font-weight:500;line-height:1.5}.lgEfRa_badges{align-items:center;gap:8px;display:inline-flex}.lgEfRa_reset{color:var(--dsw-alias-label-secondary);font:inherit;cursor:pointer;background:0 0;border:0;padding:0;font-size:12px;line-height:1.5}.lgEfRa_reset:hover:not(:disabled){color:var(--dsw-alias-label-primary)}.lgEfRa_reset:disabled{cursor:default}.lgEfRa_select{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);height:34px;color:var(--dsw-alias-label-primary);font:inherit;border-radius:8px;padding:0 12px;font-size:13px;line-height:1.5}.lgEfRa_input{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);height:34px;color:var(--dsw-alias-label-primary);font:inherit;border-radius:8px;padding:0 12px;font-size:13px}.lgEfRa_secretRow{gap:8px;display:flex}.lgEfRa_secretRow .lgEfRa_input{flex:1;min-width:0}.lgEfRa_test{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);font:inherit;cursor:pointer;background:0 0;border-radius:8px;flex:none;padding:0 12px;font-size:12px}.lgEfRa_test:hover:not(:disabled){border-color:var(--dsw-alias-label-dimmed);color:var(--dsw-alias-label-primary)}.lgEfRa_test:disabled{opacity:.4;cursor:default}.lgEfRa_testSuccess,.lgEfRa_testError{margin:0;font-size:12px;line-height:1.5}.lgEfRa_testSuccess{color:var(--dsw-alias-state-success-primary)}.lgEfRa_testError{color:var(--dsw-alias-label-error)}.lgEfRa_select:focus-visible,.lgEfRa_input:focus-visible{border-color:var(--dsw-alias-brand-primary);outline:none}.lgEfRa_select:disabled,.lgEfRa_input:disabled{color:var(--dsw-alias-label-tertiary);cursor:default}.lgEfRa_hint{color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px;line-height:1.5}.lgEfRa_tokenHelp{color:var(--dsw-alias-brand-primary);text-decoration:none}.lgEfRa_tokenHelp:hover{text-decoration:underline}.lgEfRa_switchOff,.lgEfRa_switchOn{cursor:pointer;border:0;border-radius:999px;flex-shrink:0;width:36px;height:20px;padding:0;transition:background-color .12s;position:relative}.lgEfRa_switchOff{background:var(--dsw-alias-border-l2)}.lgEfRa_switchOn{background:var(--dsw-alias-brand-primary)}.lgEfRa_switchThumb{background:var(--dsw-alias-bg-base);border-radius:50%;width:16px;height:16px;transition:transform .12s;position:absolute;top:2px;left:2px}.lgEfRa_switchOn .lgEfRa_switchThumb{transform:translate(16px)}.lgEfRa_switchOff:disabled,.lgEfRa_switchOn:disabled{opacity:.5;cursor:default}.lgEfRa_footer{border-top:1px solid var(--dsw-alias-border-l2);justify-content:flex-end;align-items:center;gap:8px;padding:12px 0 4px;display:flex}.lgEfRa_failed{min-width:0;color:var(--dsw-alias-label-error);flex:1;margin:0;font-size:12px;line-height:1.5}.lgEfRa_discard,.lgEfRa_save{appearance:none;font:inherit;cursor:pointer;border:1px solid #0000;border-radius:8px;padding:5px 14px;font-size:13px;line-height:1.5}.lgEfRa_discard{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);background:0 0}.lgEfRa_discard:hover:not(:disabled){border-color:var(--dsw-alias-label-dimmed);color:var(--dsw-alias-label-primary)}.lgEfRa_save{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-layer-3)}.lgEfRa_discard:disabled,.lgEfRa_save:disabled{opacity:.4;cursor:default}";
		const tagId$1 = "@lovstudio/dsh-plugin-marketplace/MarketSettingsCard.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@lovstudio/dsh-plugin-marketplace";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var MarketSettingsCard_module_css_default = {
			"badge": "lgEfRa_badge",
			"badges": "lgEfRa_badges",
			"body": "lgEfRa_body",
			"card": "lgEfRa_card",
			"cardOpen": "lgEfRa_cardOpen",
			"chevron": "lgEfRa_chevron",
			"chevronOpen": "lgEfRa_chevronOpen",
			"description": "lgEfRa_description",
			"discard": "lgEfRa_discard",
			"failed": "lgEfRa_failed",
			"field": "lgEfRa_field",
			"fieldHead": "lgEfRa_fieldHead",
			"footer": "lgEfRa_footer",
			"headText": "lgEfRa_headText",
			"header": "lgEfRa_header",
			"hint": "lgEfRa_hint",
			"input": "lgEfRa_input",
			"label": "lgEfRa_label",
			"name": "lgEfRa_name",
			"pending": "lgEfRa_pending",
			"readOnly": "lgEfRa_readOnly",
			"reset": "lgEfRa_reset",
			"save": "lgEfRa_save",
			"secretRow": "lgEfRa_secretRow",
			"select": "lgEfRa_select",
			"switchOff": "lgEfRa_switchOff",
			"switchOn": "lgEfRa_switchOn",
			"switchThumb": "lgEfRa_switchThumb",
			"test": "lgEfRa_test",
			"testError": "lgEfRa_testError",
			"testSuccess": "lgEfRa_testSuccess",
			"tokenHelp": "lgEfRa_tokenHelp"
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
				"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:38:5:li",
				className: clsx(MarketSettingsCard_module_css_default.card, open && MarketSettingsCard_module_css_default.cardOpen),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:39:7:button",
					type: "button",
					className: MarketSettingsCard_module_css_default.header,
					"aria-expanded": open,
					"aria-label": `${props.t(open ? "settingsCollapse" : "settingsExpand")}: ${title}`,
					onClick: () => {
						setOpen(!open);
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:46:9:span",
							className: MarketSettingsCard_module_css_default.headText,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:47:11:span",
								className: MarketSettingsCard_module_css_default.name,
								children: title
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:48:11:span",
								className: MarketSettingsCard_module_css_default.description,
								children: props.t("settingsCardDescription")
							})]
						}),
						state.dirty ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:50:24:span",
							className: MarketSettingsCard_module_css_default.pending,
							children: props.t("settingsUnsaved")
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:51:9:IconChevronDownOutline14",
							className: clsx(MarketSettingsCard_module_css_default.chevron, open && MarketSettingsCard_module_css_default.chevronOpen)
						})
					]
				}), open ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:54:9:div",
					className: MarketSettingsCard_module_css_default.body,
					children: [
						!state.writable ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:55:30:p",
							className: MarketSettingsCard_module_css_default.readOnly,
							role: "status",
							children: props.t("settingsReadOnly")
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:56:11:div",
							className: MarketSettingsCard_module_css_default.field,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:57:13:div",
									className: MarketSettingsCard_module_css_default.fieldHead,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:58:15:label",
										className: MarketSettingsCard_module_css_default.label,
										htmlFor: "plugin-market-provider",
										children: props.t("settingsProvider")
									}), state.provider.overridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:60:17:span",
										className: MarketSettingsCard_module_css_default.badges,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:61:19:span",
											className: MarketSettingsCard_module_css_default.badge,
											children: props.t("settingsOverridden")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:62:19:button",
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
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:73:13:select",
									id: "plugin-market-provider",
									className: MarketSettingsCard_module_css_default.select,
									value: state.provider.value,
									disabled,
									onChange: (event) => {
										props.selectProvider(event.target.value);
									},
									children: PROVIDERS.map((provider) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:81:17:option",
										value: provider.id,
										children: props.t(provider.key)
									}, provider.id))
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:84:13:p",
									className: MarketSettingsCard_module_css_default.hint,
									children: props.t("settingsProviderDescription")
								})
							]
						}),
						state.provider.value === "github" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:87:13:div",
							className: MarketSettingsCard_module_css_default.field,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:88:15:div",
									className: MarketSettingsCard_module_css_default.fieldHead,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:89:17:label",
										className: MarketSettingsCard_module_css_default.label,
										htmlFor: "plugin-market-github-token",
										children: props.t("settingsGithubToken")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:92:17:span",
										className: MarketSettingsCard_module_css_default.badge,
										children: [props.t(state.githubToken.configured ? "settingsGithubTokenConfigured" : "settingsGithubTokenMissing"), state.githubToken.suffix === void 0 ? null : ` · ••••${state.githubToken.suffix}`]
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:99:15:div",
									className: MarketSettingsCard_module_css_default.secretRow,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:100:17:input",
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
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:112:17:button",
										type: "button",
										className: MarketSettingsCard_module_css_default.test,
										disabled: disabled || state.githubToken.testStatus === "testing" || state.githubToken.value.trim().length === 0 && !state.githubToken.configured,
										onClick: props.testGithubToken,
										children: props.t(state.githubToken.testStatus === "testing" ? "settingsCredentialTesting" : "settingsCredentialTest")
									})]
								}),
								state.githubToken.testStatus === "success" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:125:17:p",
									className: MarketSettingsCard_module_css_default.testSuccess,
									role: "status",
									children: props.t("settingsCredentialValid", { account: state.githubToken.testDetail ?? "" })
								}) : null,
								state.githubToken.testStatus === "error" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:130:17:p",
									className: MarketSettingsCard_module_css_default.testError,
									role: "status",
									children: props.t("settingsCredentialInvalid", { reason: state.githubToken.testDetail ?? "" })
								}) : null,
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:134:15:p",
									className: MarketSettingsCard_module_css_default.hint,
									children: [
										props.t("settingsGithubTokenDescription"),
										" ",
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:136:17:a",
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
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:147:11:div",
							className: MarketSettingsCard_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:148:13:div",
								className: MarketSettingsCard_module_css_default.fieldHead,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:149:15:label",
										className: MarketSettingsCard_module_css_default.label,
										htmlFor: "plugin-market-startup-sync",
										children: props.t("settingsStartupSync")
									}),
									state.syncOnStartup.overridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:153:17:span",
										className: MarketSettingsCard_module_css_default.badges,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:154:19:span",
											className: MarketSettingsCard_module_css_default.badge,
											children: props.t("settingsOverridden")
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:155:19:button",
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
										"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:165:15:button",
										id: "plugin-market-startup-sync",
										type: "button",
										role: "switch",
										"aria-checked": state.syncOnStartup.value,
										className: state.syncOnStartup.value ? MarketSettingsCard_module_css_default.switchOn : MarketSettingsCard_module_css_default.switchOff,
										disabled,
										onClick: () => {
											props.setSyncOnStartup(!state.syncOnStartup.value);
										},
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:174:17:span",
											className: MarketSettingsCard_module_css_default.switchThumb
										})
									})
								]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:177:13:p",
								className: MarketSettingsCard_module_css_default.hint,
								children: props.t("settingsStartupSyncDescription")
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:179:11:div",
							className: MarketSettingsCard_module_css_default.footer,
							children: [
								state.failed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:180:29:p",
									className: MarketSettingsCard_module_css_default.failed,
									role: "status",
									children: props.t("settingsSaveFailed")
								}) : null,
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:181:13:button",
									type: "button",
									className: MarketSettingsCard_module_css_default.discard,
									disabled: !state.dirty || state.saving,
									onClick: props.discard,
									children: props.t("settingsDiscard")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/MarketSettingsCard.tsx:189:13:button",
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
		/** Owns the marketplace card's drafts and revision-fenced settings writes. */
		var MarketSettingsCardController = class {
			scope;
			api;
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
			constructor(scope, api, probeCredential) {
				this.scope = scope;
				this.api = api;
				this.probeCredential = probeCredential;
				this.store = (0, _deepseek_ai_dsh_client_runtime_client.createSnapshotStore)(this.projection());
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
						landed = (await this.api.credentials.set({
							ref: "GITHUB_TOKEN",
							value: token
						})).result.ok;
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
						...this.githubTokenTest.detail === void 0 ? {} : { testDetail: this.githubTokenTest.detail }
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
						detail: result.login
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
					const response = await this.api.credentials.describe({ refs: ["GITHUB_TOKEN"] });
					if (!response.result.ok) return;
					const view = response.result.value.credentials.GITHUB_TOKEN;
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
		//#region \0dsh-css:/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/SidebarMarketEntry.module.css.mjs
		const css = "._p6LKq_entry{box-sizing:border-box;width:calc(100% + 4px);height:42px;color:var(--dsw-alias-label-primary);cursor:pointer;background:0 0;border:none;border-radius:12px;align-items:center;gap:8px;margin:1px -2px;padding:0 10px 0 8px;font-family:inherit;font-size:14px;line-height:22px;display:flex;overflow:hidden}._p6LKq_entry:hover{background:var(--dsw-alias-interactive-bg-hover)}._p6LKq_entry[data-wide=true] ._p6LKq_label{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}._p6LKq_entry:not([data-wide=true]){border-radius:50%;justify-content:center;gap:0;width:36px;height:36px;margin:2px 0;padding:0}";
		const tagId = "@lovstudio/dsh-plugin-marketplace/SidebarMarketEntry.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@lovstudio/dsh-plugin-marketplace";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var SidebarMarketEntry_module_css_default = {
			"entry": "_p6LKq_entry",
			"label": "_p6LKq_label"
		};
		//#endregion
		//#region src/client/SidebarMarketEntry.tsx
		/** Isometric sandbox glyph for the plugin-discovery destination. */
		function MarketplaceIcon({ size }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/SidebarMarketEntry.tsx:15:5:svg",
				width: size,
				height: size,
				viewBox: "0 0 16 16",
				fill: "none",
				xmlns: "http://www.w3.org/2000/svg",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/SidebarMarketEntry.tsx:23:7:path",
					d: "M8 1.45703L14.0898 4.88281L8 8.30859L1.91016 4.88281L8 1.45703Z",
					stroke: "currentColor",
					strokeWidth: "1.25",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/SidebarMarketEntry.tsx:30:7:path",
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
				"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/SidebarMarketEntry.tsx:50:5:button",
				type: "button",
				className: SidebarMarketEntry_module_css_default.entry,
				"data-wide": wide ? "true" : void 0,
				"aria-label": t("sidebarEntry"),
				title: wide ? void 0 : t("sidebarEntry"),
				onClick: () => {
					controller.open();
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarketplaceIcon, {
					"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/SidebarMarketEntry.tsx:58:7:MarketplaceIcon",
					size: wide ? 14 : 18
				}), wide ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					"data-insp-path": "/Users/mark/yoda/repositories/deepseek-harness/packages/client/ui-plugin-market/src/client/SidebarMarketEntry.tsx:59:15:span",
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
		* local. Install and uninstall run through the loopback-pinned
		* `pluginManager` Remote (pnpm in the managed profile); the success banner
		* delegates restart to `ctx.betterRestartUi`, which reboots the Host tree and
		* reloads the browser after its replacement connection arrives. Installed-
		* state badges come from the Host pluginInventory remote and refresh after
		* each successful operation.
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
			"connection",
			"remote",
			"settingsScope",
			"remote.pluginInventory",
			"remote.pluginManager",
			"betterRestartUi"
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
			const { api: connectionApi } = ctx.get("connection");
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
				install: async (packageName) => {
					const remote = ctx.get("remote");
					if (remote === void 0) throw new Error("remote service unavailable");
					const result = await remote.pluginManager.install(packageName);
					if (!result.ok) return {
						ok: false,
						exitCode: -1,
						error: `${result.error.code}: ${result.error.message}`
					};
					return result.value;
				},
				uninstall: async (packageName) => {
					const remote = ctx.get("remote");
					if (remote === void 0) throw new Error("remote service unavailable");
					const result = await remote.pluginManager.uninstall(packageName);
					if (!result.ok) return {
						ok: false,
						exitCode: -1,
						error: `${result.error.code}: ${result.error.message}`
					};
					return result.value;
				},
				approveBuilds: async (packageNames) => {
					const remote = ctx.get("remote");
					if (remote === void 0) throw new Error("remote service unavailable");
					const result = await remote.pluginManager.approveBuilds([...packageNames]);
					if (!result.ok) throw new Error(`pluginManager.approveBuilds failed: ${result.error.code}: ${result.error.message}`);
					return result.value;
				},
				status: () => ctx.betterRestartUi.status(),
				restart: () => {
					ctx.betterRestartUi.restart();
					return Promise.resolve();
				}
			});
			const settings = ctx.settingsScope.bind({ namespace: MARKET_SETTINGS_NAMESPACE });
			const settingsCard = new MarketSettingsCardController(settings, connectionApi, async (token) => {
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
			ctx.effect(() => settings.subscribe(applyStartupPreference), "ui-plugin-market: startup synchronization preference");
			controller.refreshInstalled();
			ctx.effect(() => ctx.on("connection/reset", () => {
				controller.refreshInstalled();
			}), "ui-plugin-market: installed-name refresh");
			ctx.effect(() => ctx.remote.$on("credentials/updated", (ref) => {
				settingsCard.refreshCredential(ref);
				if (ref === "GITHUB_TOKEN" && providerRouter.selected() === "github") controller.syncCatalog(true);
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
