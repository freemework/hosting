import { FConfiguration } from "@freemework/common";
import { assert } from "chai";

import * as path from "path";
import * as fs from "fs";
import * as tmp from "tmp";

import * as thislib from "../../src";

describe("secretsDirectoryConfiguration tests", function () {
	let tempDirectoryObj: tmp.DirResult;
	let configuration: FConfiguration;
	before(async () => {
		// runs before all tests in this block
		tempDirectoryObj = tmp.dirSync();
		fs.writeFileSync(
			path.join(tempDirectoryObj.name, "config.db.host"),
			"localhost"
		);
		fs.writeFileSync(
			path.join(tempDirectoryObj.name, "config.db.port"),
			"5432"
		);
		configuration = await thislib.secretsDirectoryConfiguration(tempDirectoryObj.name);
	});
	after(() => {
		tempDirectoryObj.removeCallback();
	});

	it("Generic test", function() {
		assert.equal(configuration.getString("config.db.host"), "localhost");
		assert.equal(configuration.getInteger("config.db.port"), 5432);
	});
});
