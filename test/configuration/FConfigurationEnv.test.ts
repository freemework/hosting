import { assert } from "chai";

import { FConfiguration } from "@freemework/common";

import { FConfigurationEnv } from "../../src";

describe("FConfigurationEnv basic tests", function () {
	it("Should get value of 'a.a.a'", function () {
		process.env["a.a.a"] = "env-own-a";
		try {
			const config = new FConfigurationEnv();

			assert.equal(config.get("a.a.a").asString, "env-own-a");
		} finally {
			delete process.env["a.a.a"];
		}
	});

	it.skip("Should get value of 'A_A_A' via 'a.a.a'", function () {
		// This test just a proposal to change contract. Translate "." in "_"

		process.env.A_A_A = "env-own-a";
		try {
			const config = new FConfigurationEnv();

			assert.equal(config.get("A_A_A").asString, "env-own-a");
			assert.equal(config.get("a.a.a").asString, "env-own-a");
		} finally {
			delete process.env.A_A_A;
		}
	});

	it.skip("Should get value of 'A_A_A' via 'a.a.a'", function () {
		// This test just a proposal to change contract. Translate "." in "_"

		process.env.A_A_A = "env-own-a";
		try {
			const config = FConfiguration.factoryJson({ "A_A_A": "env-own-a" });

			assert.equal(config.get("A_A_A").asString, "env-own-a");
			assert.equal(config.get("a.a.a").asString, "env-own-a");
		} finally {
			delete process.env.A_A_A;
		}
	});
});

