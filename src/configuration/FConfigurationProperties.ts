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

/**
 * Very similar to Java property files
 */
export class FConfigurationProperties extends FConfigurationDictionary {
	public static async fromFile(propertiesConfigFile: string): Promise<FConfigurationProperties> {
		const propertiesConfigFileURL: URL = pathToFileURL(propertiesConfigFile);
		const sourceURI: URL = new URL(`configuration+file+properties://${propertiesConfigFileURL.pathname}`);

		const fileContent: Buffer = await readFileAsync(propertiesConfigFile);

		return new FConfigurationProperties(
			sourceURI,
			fileContent.toString("utf-8")
		);
	}

	public static factory(propertiesDocument: string): FConfigurationProperties {
		const encodedPropertiesDocument: string = encodeURIComponent(propertiesDocument);
		const sourceURI: URL = new URL(`configuration:properties?data=${encodedPropertiesDocument}`);

		return new FConfigurationProperties(sourceURI, propertiesDocument);
	}

	protected constructor(sourceURI: URL, propertiesDocument: string) {

		const dict: FUtilUnreadonly<FConfigurationDictionary.Data> = {};

		const lines = propertiesDocument.toString().split(/(?:\r\n|\r|\n)/g);
		lines.forEach((line: string) => {
			if (line.startsWith("#")) { return; }
			const indexOfEq = line.indexOf("=");
			if (indexOfEq >= 0) {
				const name: string = line.substring(0, indexOfEq).trim();
				const value: string = line.substring(indexOfEq + 1).trim();
				dict[name] = value;
			}
		});

		super(sourceURI, dict);
	}
}
