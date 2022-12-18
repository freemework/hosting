import * as path from "path";
import * as fs from "fs";
import { promisify } from "util";

const readFileAsync = promisify(fs.readFile);
const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

import { FConfigurationDictionary, FUtilUnreadonly } from "@freemework/common";
import { pathToFileURL } from "url";

/**
 * Loading values from files. A filename is used as key name.
 * Main reason for this is https://docs.docker.com/engine/swarm/secrets/
 * @param directory a directory where secret files are placed
 */
export class FConfigurationDirectory extends FConfigurationDictionary {
	public static async read(directory?: string): Promise<FConfigurationDirectory> {
		if (directory === undefined) {
			// Setup default dir
			// https://docs.docker.com/engine/swarm/secrets/
			directory = "/run/secrets";
		}

		const dict: FUtilUnreadonly<FConfigurationDictionary.Data> = {};
		const sourceDirectory = directory;
		const files: Array<string> = await readdirAsync(sourceDirectory);
		await files.reduce(async (p, c) => {
			await p;
			const fullFileName = path.join(sourceDirectory, c);
			const stats = await statAsync(fullFileName);
			if (stats.isFile()) {
				const value = await readFileAsync(fullFileName, "utf-8");
				dict[c] = value.trim();
			}
		}, Promise.resolve());

		return new FConfigurationDirectory(directory, dict);
	}

	private constructor(directory: string, dict: FConfigurationDictionary.Data) {
		const directoryFileURL: URL = pathToFileURL(directory);
		const sourceURI: URL = new URL(`configuration+directory://${directoryFileURL.pathname}`);
		super(sourceURI, dict);
	}
}
