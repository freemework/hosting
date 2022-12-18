import { FConfiguration } from "@freemework/common";
import { assert } from "chai";

import * as path from "path";
import * as fs from "fs";
import * as tmp from "tmp";

import { FConfigurationDirectory } from "../../src";

describe("FConfigurationDirectory tests", function () {
	let tempDirectoryObj: tmp.DirResult;
	let configuration: FConfiguration;
	before(async () => {
		// runs before all tests in this block
		tempDirectoryObj = tmp.dirSync({ unsafeCleanup: true });
		fs.writeFileSync(
			path.join(tempDirectoryObj.name, "config.db.host"),
			"localhost"
		);
		fs.writeFileSync(
			path.join(tempDirectoryObj.name, "config.db.port"),
			"5432"
		);
		configuration = await FConfigurationDirectory.read(tempDirectoryObj.name);
	});
	after(() => {
		tempDirectoryObj.removeCallback();
	});

	it("Generic test", function() {
		assert.equal(configuration.get("config.db.host").asString, "localhost");
		assert.equal(configuration.get("config.db.port").asIntegerPositive, 5432);
	});
});
