import { FConfiguration, FConfigurationValue } from "@freemework/common";

export class FConfigurationCommandLine extends FConfiguration {
	get sourceURI(): URL {
		throw new Error("Method not implemented.");
	}
	get configurationNamespace(): string | null {
		throw new Error("Method not implemented.");
	}
	get keys(): readonly string[] {
		throw new Error("Method not implemented.");
	}
	getArray(key: string, indexesName?: string | undefined): FConfiguration[] {
		throw new Error("Method not implemented.");
	}
	getNamespace(configurationNamespace: string): FConfiguration {
		throw new Error("Method not implemented.");
	}
	get(key: string, defaultData?: string | null | undefined): FConfigurationValue {
		throw new Error("Method not implemented.");
	}
	findNamespace(configurationNamespace: string): FConfiguration | null {
		throw new Error("Method not implemented.");
	}
	find(key: string): FConfigurationValue | null {
		throw new Error("Method not implemented.");
	}
	hasNamespace(configurationNamespace: string): boolean {
		throw new Error("Method not implemented.");
	}
	has(key: string): boolean {
		throw new Error("Method not implemented.");
	}

}
