import { assert } from "chai";

import { FConfigurationException } from "@freemework/common";

import { FConfigurationEnv } from "../../src";

describe("FConfigurationEnv basic tests", function () {
	it("Should get value of 'a.a.a'", function () {
		process.env["a.a.a"] = "env-own-a";
		try {
			const config = new FConfigurationEnv();

			// Env 'a__a__a' should loaded as 'a.a.a'.
			assert.equal(config.get("a.a.a").asString, "env-own-a");
		} finally {
			delete process.env["a.a.a"];
		}
	});

	it("Should get value of 'a__a__a' via 'a.a.a'", function () {
		process.env.a__a__a = "env-own-a";
		try {
			const config = new FConfigurationEnv();

			// Env 'a__a__a' should loaded as 'a.a.a'.
			assert.equal(config.get("a.a.a").asString, "env-own-a");
		} finally {
			delete process.env.a__a__a;
		}
	});

	it("Should NOT get value of 'a__a__a' via 'a__a__a'", function () {
		process.env.a__a__a = "env-own-a";
		try {
			const config = new FConfigurationEnv();
			// Env 'a__a__a' should loaded as 'a.a.a'.
			assert.throw(()=>config.get("a__a__a"), FConfigurationException);
		} finally {
			delete process.env.a__a__a;
		}
	});
});

