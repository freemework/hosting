import { FConfigurationDictionary, FUtilUnreadonly } from "@freemework/common";

export class FConfigurationEnv extends FConfigurationDictionary {
	public constructor() {
		const sourceURI: URL = new URL("configuration:env");

		const dict: FUtilUnreadonly<FConfigurationDictionary.Data> = {};

		Object.entries(process.env).forEach(([name, value]) => {
			if (value === undefined) { value = ""; }
			dict[name] = value;
		});

		super(sourceURI, dict);
	}
}


