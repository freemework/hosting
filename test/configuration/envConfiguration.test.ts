import { assert } from "chai";

import * as thislib from "../../src";

describe("envConfiguration basic tests", function () {
	it("Should get value of 'a.a.a'", function () {
		process.env["a.a.a"] = "env-own-a";
		try {
			const config = thislib.envConfiguration();

			assert.equal(config.getString("a.a.a"), "env-own-a");
		} finally {
			delete process.env["a.a.a"];
		}
	});

	it.skip("Should get value of 'A_A_A' via 'a.a.a'", function () {
		// This test just a proposal to change contract. Translate "." in "_"

		process.env.A_A_A = "env-own-a";
		try {
			const config = thislib.envConfiguration();

			assert.equal(config.getString("A_A_A"), "env-own-a");
			assert.equal(config.getString("a.a.a"), "env-own-a");
		} finally {
			delete process.env.A_A_A;
		}
	});
});

