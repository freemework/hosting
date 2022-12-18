import _ = require("lodash");
import { JsonMap, parse } from "@iarna/toml";

import { readFile } from "fs";
import { promisify } from "util";
import { pathToFileURL } from "url";

const readFileAsync = promisify(readFile);

import {
	FConfiguration,
	FConfigurationDictionary,
	FUtilUnreadonly
} from "@freemework/common";

export class FConfigurationToml extends FConfigurationDictionary {
	public static async fromFile(
		tomlConfigFile: string,
		arrayIndexKey: string = FConfiguration.DEFAULT_INDEX_KEY,
		arrayIndexesKey: string = FConfiguration.DEFAULT_INDEXES_KEY,
	): Promise<FConfigurationToml> {
		const tomlConfigFileURL: URL = pathToFileURL(tomlConfigFile);
		const sourceURI: URL = new URL(`configuration+file+toml://${tomlConfigFileURL.pathname}`);

		const fileContent: Buffer = await readFileAsync(tomlConfigFile);

		return new FConfigurationToml(
			sourceURI,
			fileContent.toString("utf-8"),
			arrayIndexKey,
			arrayIndexesKey
		);
	}

	public static factory(
		tomlDocument: string,
		arrayIndexKey: string = FConfiguration.DEFAULT_INDEX_KEY,
		arrayIndexesKey: string = FConfiguration.DEFAULT_INDEXES_KEY,
	): FConfigurationToml {
		const encodedTomlDocument: string = encodeURIComponent(tomlDocument);
		const sourceURI: URL = new URL(`configuration:toml?data=${encodedTomlDocument}`);

		return new FConfigurationToml(
			sourceURI,
			tomlDocument,
			arrayIndexKey,
			arrayIndexesKey
		);
	}


	protected constructor(
		sourceURI: URL,
		tomlDocument: string,
		arrayIndexKey: string,
		arrayIndexesKey: string,
	) {

		const dict: FUtilUnreadonly<FConfigurationDictionary.Data> = {};
		const tomlData: JsonMap = parse(tomlDocument);
		function recursiveWalker(sourceData: any, ns: string = ""): void {
			if (typeof sourceData === "string") {
				dict[ns] = sourceData;
			} else if (typeof sourceData === "number") {
				dict[ns] = sourceData.toString();
			} else if (typeof sourceData === "boolean") {
				dict[ns] = sourceData ? "true" : "false";
			} else if (Array.isArray(sourceData)) {
				const indexes: Array<string> = [];
				for (let index = 0; index < sourceData.length; ++index) {
					const innerSourceData = sourceData[index];
					const indexName: string = typeof (innerSourceData) === "object" && arrayIndexKey in innerSourceData
						? innerSourceData[arrayIndexKey] : index.toString();
					const subKey = `${ns}.${indexName}`;
					recursiveWalker(innerSourceData, subKey);
					indexes.push(indexName);
				}
				const indexerKey: string = `${ns}.${arrayIndexesKey}`;
				if (!(indexerKey in dict)) {
					dict[indexerKey] = indexes.join(" ");
				}
			} else {
				for (const [key, value] of _.entries(sourceData)) {
					const fullKey = ns !== "" ? `${ns}.${key}` : key;
					recursiveWalker(value, fullKey);
				}
			}
		}
		recursiveWalker(tomlData);

		super(sourceURI, dict);
	}
}
