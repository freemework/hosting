export { FConfigurationCommandLine } from "./FConfigurationCommandLine";
export { FConfigurationDirectory } from "./FConfigurationDirectory";
export { FConfigurationEnv } from "./FConfigurationEnv";
export { FConfigurationProperties } from "./FConfigurationProperties";
export { FConfigurationToml } from "./FConfigurationToml";

// export function develVirtualFilesConfiguration(configDir: string, develSite: string): FConfiguration {
// 	if (!configDir) { throw new FExceptionArgument("configDir"); }
// 	if (!fs.existsSync(configDir)) {
// 		throw new FConfigurationException(
// 			"Bad configuration directory (not exists): " + configDir,
// 			null, null
// 		);
// 	}
// 	const projectConfigDir = path.join(configDir, "project.properties");

// 	const files: Array<string> = [];
// 	files.push(path.join(projectConfigDir, "config.properties"));
// 	files.push(path.join(projectConfigDir, "config-" + develSite + ".properties"));
// 	const userConfigDir = path.join(configDir, "user.properties");
// 	const currentUserName = userInfo().username;
// 	if (currentUserName) {
// 		files.push(path.join(userConfigDir, "config-" + currentUserName + ".properties"));
// 	}

// 	const dict: ConfigurationImpl.Dictionary = {};
// 	files.forEach((file) => {
// 		if (!fs.existsSync(file)) {
// 			console.warn("Skip a configuration file (not exists): " + file);
// 			throw new FConfigurationException(
// 				"Skip a configuration file(not exists): " + file,
// 				null, null
// 			);
// 		}
// 		propertiesFileContentProcessor(file, (name: string, value: string) => {
// 			if (name in process.env) {
// 				dict[name] = process.env[name] as string;
// 			} else {
// 				dict[name] = value;
// 			}
// 		});
// 	});
// 	return new ConfigurationImpl(dict);
// }

// export namespace ConfigurationImpl {
// 	export type Dictionary = { [key: string]: string };
// }

// export class ConfigurationImpl implements FConfiguration {
// 	private readonly _dict: Readonly<ConfigurationImpl.Dictionary>;
// 	private readonly _parentNamespace?: string;
// 	private _keys?: ReadonlyArray<string>;

// 	public constructor(dict: Readonly<ConfigurationImpl.Dictionary>, parentNamespace?: string) {
// 		this._dict = dict;
// 		if (parentNamespace !== undefined) {
// 			this._parentNamespace = parentNamespace;
// 		}
// 	}

// 	public get configurationNamespace(): string {
// 		if (this._parentNamespace !== undefined) {
// 			return this._parentNamespace;
// 		}
// 		return "";
// 	}

// 	public get keys(): ReadonlyArray<string> {
// 		return this._keys !== undefined ? this._keys : (this._keys = Object.freeze(Object.keys(this._dict)));
// 	}

// 	/**
// 	 * @deprecated Use `getNamespace` instead
// 	 */
// 	public getConfiguration(configurationNamespace: string): FConfiguration {
// 		return this.getNamespace(configurationNamespace);
// 	}

// 	public getNamespace(configurationNamespace: string): FConfiguration {
// 		if (!configurationNamespace) { throw new FExceptionArgument("configurationNamespace"); }
// 		const subDict: ConfigurationImpl.Dictionary = {};
// 		const criteria = configurationNamespace + ".";
// 		const criteriaLen = criteria.length;
// 		Object.keys(this._dict).forEach((key) => {
// 			if (key.length > criteriaLen && key.startsWith(criteria)) {
// 				const value = this._dict[key];
// 				subDict[key.substring(criteriaLen)] = value;
// 			}
// 		});
// 		if (Object.keys(subDict).length === 0) {
// 			const fullKeyName = this.getFullKey(configurationNamespace);
// 			throw new FConfigurationException(
// 				`Namespace '${fullKeyName}' was not found in the configuration.`,
// 				fullKeyName, null
// 			);
// 		}
// 		const parentNamespace = this._parentNamespace !== undefined ?
// 			`${this._parentNamespace}.${configurationNamespace}` : configurationNamespace;
// 		return new ConfigurationImpl(subDict, parentNamespace);
// 	}

// 	public getIndexer(indexerName: string = "indexer"): Array<FConfiguration> {
// 		const indexer = this.getString(indexerName);
// 		return indexer.split(" ").map(index => this.getNamespace(index));
// 	}

// 	public get(key: string): boolean | number | string {
// 		if (!key) { throw new FExceptionArgument("key"); }
// 		if (key in this._dict) {
// 			const value = this._dict[key];
// 			return value;
// 		}
// 		throwWrongKeyError(key, this._parentNamespace);
// 	}

// 	public getBase64(key: string, defaultValue?: Uint8Array): Uint8Array {
// 		if (!key) { throw new FExceptionArgument("key"); }
// 		if (key in this._dict) {
// 			const value = this._dict[key];
// 			const parsedData = Buffer.from(value, "base64");
// 			const restoredValue = parsedData.toString("base64");
// 			if (restoredValue !== value) {
// 				const partOfValue = value.slice(0, 4);
// 				const maskValue = `${partOfValue}...`;
// 				const fullKeyName = this.getFullKey(key);
// 				throw new FConfigurationException(
// 					`Bad type of key '${fullKeyName}'. Cannot parse value '${maskValue}' as base64.`,
// 					fullKeyName, null
// 				);
// 			}
// 			return parsedData;
// 		}
// 		if (defaultValue !== undefined) { return defaultValue; }
// 		throwWrongKeyError(key, this._parentNamespace);
// 	}

// 	public getBoolean(key: string, defaultValue?: boolean): boolean {
// 		if (!key) { throw new FExceptionArgument("key"); }
// 		if (key in this._dict) {
// 			const value = this._dict[key];
// 			if (value === "true") { return true; }
// 			if (value === "false") { return false; }
// 			const fullKeyName = this.getFullKey(key);
// 			throw new FConfigurationException(
// 				`Bad type of key '${fullKeyName}'. Cannot convert the value '${value}' to boolean type.`,
// 				fullKeyName, null
// 			);
// 		}
// 		if (defaultValue !== undefined) { return defaultValue; }
// 		throwWrongKeyError(key, this._parentNamespace);
// 	}

// 	public getInteger(key: string, defaultValue?: number): number {
// 		if (!key) { throw new FExceptionArgument("key"); }
// 		if (key in this._dict) {
// 			const value = this._dict[key];
// 			const friendlyValue = parseInt(value);
// 			if (friendlyValue.toString() === value) { return friendlyValue; }
// 			const fullKeyName = this.getFullKey(key);
// 			throw new FConfigurationException(
// 				`Bad type of key '${fullKeyName}'. Cannot convert the value '${value}' to integer type.`,
// 				fullKeyName, null
// 			);
// 		}
// 		if (defaultValue !== undefined) { return defaultValue; }
// 		throwWrongKeyError(key, this._parentNamespace);
// 	}

// 	public getFloat(key: string, defaultValue?: number): number {
// 		if (!key) { throw new FExceptionArgument("key"); }
// 		if (key in this._dict) {
// 			const value = this._dict[key];
// 			const friendlyValue = parseFloat(value);
// 			if (friendlyValue.toString() === value) { return friendlyValue; }
// 			const fullKeyName = this.getFullKey(key);
// 			throw new FConfigurationException(
// 				`Bad type of key '${fullKeyName}'. Cannot convert the value '${value}' to float type.`,
// 				fullKeyName, null
// 			);
// 		}
// 		if (defaultValue !== undefined) { return defaultValue; }
// 		throwWrongKeyError(key, this._parentNamespace);
// 	}

// 	public getEnabled(key: string, defaultValue?: boolean): boolean {
// 		if (!key) { throw new FExceptionArgument("key"); }
// 		if (key in this._dict) {
// 			const value = this._dict[key];
// 			if (value === "enabled") { return true; }
// 			if (value === "disabled") { return false; }
// 			const fullKeyName = this.getFullKey(key);
// 			throw new FConfigurationException(
// 				`Bad type of key '${fullKeyName}'. Cannot convert the value '${value}' to enabled boolean value.`,
// 				fullKeyName, null
// 			);
// 		}
// 		if (defaultValue !== undefined) { return defaultValue; }
// 		throwWrongKeyError(key, this._parentNamespace);
// 	}

// 	public getString(key: string, defaultValue?: string): string {
// 		if (!key) { throw new FExceptionArgument("key"); }
// 		if (key in this._dict) { return this._dict[key]; }
// 		if (defaultValue !== undefined) { return defaultValue; }
// 		throwWrongKeyError(key, this._parentNamespace);
// 	}

// 	public getURL(key: string, defaultValue?: URL): URL {
// 		if (!key) { throw new FExceptionArgument("key"); }
// 		if (key in this._dict) {
// 			const value = this._dict[key];
// 			try {
// 				return new URL(value);
// 			} catch (e) {
// 				const partOfValue = value.slice(0, 4);
// 				const maskValue = `${partOfValue}...`;
// 				const fullKeyName = this.getFullKey(key);
// 				throw new FConfigurationException(
// 					`Bad type of key '${fullKeyName}'. Cannot parse value '${maskValue}' as URL.`,
// 					fullKeyName, null,
// 					FException.wrapIfNeeded(e)
// 				);
// 			}
// 		}
// 		if (defaultValue !== undefined) { return defaultValue; }
// 		throwWrongKeyError(key, this._parentNamespace);
// 	}

// 	public has(key: string): boolean {
// 		if (!key) { throw new FExceptionArgument("key"); }
// 		return key in this._dict;
// 	}

// 	public hasNamespace(configurationNamespace: string): boolean {
// 		const criteria = configurationNamespace + ".";
// 		const criteriaLen = criteria.length;
// 		for (const key of Object.keys(this._dict)) {
// 			if (key.length > criteriaLen && key.startsWith(criteria)) {
// 				return true;
// 			}
// 		}
// 		return false;
// 	}

// 	public hasNonEmpty(key: string): boolean {
// 		if (!key) { throw new FExceptionArgument("key"); }
// 		if (key in this._dict) {
// 			const value = this._dict[key];
// 			return !_.isEmpty(value);
// 		}
// 		return false;
// 	}

// 	private getFullKey(key: string): string {
// 		if (this._parentNamespace !== undefined) {
// 			return `${this._parentNamespace}.${key}`;
// 		}
// 		return key;
// 	}
// }


/*==========*/
/* INTERNAL */
/*==========*/


// function throwWrongKeyError(key: string, parentNamespace?: string): never {
// 	if (parentNamespace !== undefined) {
// 		const fullKey: string = `${parentNamespace}.${key}`;
// 		throw new FConfigurationException(
// 			`A value for key '${fullKey}' was not found in current configuration.`,
// 			fullKey, null
// 		);
// 	}
// 	throw new FConfigurationException(
// 		`A value for key '${key}' was not found in current configuration.`,
// 		key, null
// 	);
// }
