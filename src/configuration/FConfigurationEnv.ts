import { FConfiguration, FConfigurationDictionary, FConfigurationValue, FUtilUnreadonly } from "@freemework/common";

export class FConfigurationEnv extends FConfigurationDictionary {
	public constructor() {
		const sourceURI: URL = new URL("configuration:env");

		const dict: FUtilUnreadonly<FConfigurationDictionary.Data> = {};

		Object.entries(process.env).forEach(([name, value]) => {
			// A little bit magic for double underscore "__" (translate it to ".")
			if (!name.startsWith("__") && name.includes("__")) {
				name = name.split("__").join(".");
			}

			if (value === undefined) {
				value = "";
			}
			
			dict[name] = value;
		});

		super(sourceURI, dict);
	}
}


