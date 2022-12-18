import { assert } from "chai";

import { FConfigurationToml } from "../../src";

describe("FConfigurationToml basic tests", function () {
	it("Parse array of float", function () {
		const config = FConfigurationToml.factory("a = [1.01,1e-1]");

		assert.equal(config.get("a.indexes").asString, "0 1");
		assert.equal(config.get("a.0").asString, "1.01");
		assert.equal(config.get("a.1").asString, "0.1");
	});

	it("Parse array of object", function () {
		const config = FConfigurationToml.factory(`
[setup]
[[setup.model]]
title = "model1"
desc = "desc1"
[[setup.model]]
title = "model2"
desc = "desc2"
[[setup.model]]
title = "model3"
desc = "desc3"
`
		);

		assert.equal(config.get("setup.model.indexes").asString, "0 1 2");
		assert.equal(config.get("setup.model.0.title").asString, "model1");
		assert.equal(config.get("setup.model.0.desc").asString, "desc1");
		assert.equal(config.get("setup.model.1.title").asString, "model2");
		assert.equal(config.get("setup.model.1.desc").asString, "desc2");
		assert.equal(config.get("setup.model.2.title").asString, "model3");
		assert.equal(config.get("setup.model.2.desc").asString, "desc3");
	});

	it("Parse array of object with index", function () {
		const config = FConfigurationToml.factory(`
[setup]
[[setup.model]]
index = "model1"
title = "model1"
desc = "desc1"
[[setup.model]]
index = "model2"
title = "model2"
desc = "desc2"
[[setup.model]]
index = "model3"
title = "model3"
desc = "desc3"
`
		);

		assert.equal(config.get("setup.model.indexes").asString, "model1 model2 model3");
		assert.equal(config.get("setup.model.model1.title").asString, "model1");
		assert.equal(config.get("setup.model.model1.desc").asString, "desc1");
		assert.equal(config.get("setup.model.model2.title").asString, "model2");
		assert.equal(config.get("setup.model.model2.desc").asString, "desc2");
		assert.equal(config.get("setup.model.model3.title").asString, "model3");
		assert.equal(config.get("setup.model.model3.desc").asString, "desc3");
	});
	it("Parse array of object with named index", function () {
		const config = FConfigurationToml.factory(`
[setup]

"model.indexes" = "model1 model3"

[[setup.model]]
index = "model1"
title = "model1"
desc = "desc1"
[[setup.model]]
index = "model2"
title = "model2"
desc = "desc2"
[[setup.model]]
index = "model3"
title = "model3"
desc = "desc3"
`
		);

		assert.equal(config.get("setup.model.indexes").asString, "model1 model3");
		assert.equal(config.get("setup.model.model1.title").asString, "model1");
		assert.equal(config.get("setup.model.model1.desc").asString, "desc1");
		assert.equal(config.get("setup.model.model2.title").asString, "model2");
		assert.equal(config.get("setup.model.model2.desc").asString, "desc2");
		assert.equal(config.get("setup.model.model3.title").asString, "model3");
		assert.equal(config.get("setup.model.model3.desc").asString, "desc3");
	});


	it.skip("getIndexer with named index", function () {
		const config = FConfigurationToml.factory(`
[setup]

"model.indexes" = "model1 model3"

[[setup.model]]
index = "model1"
title = "model1"
desc = "desc1"
[[setup.model]]
index = "model2"
title = "model2"
desc = "desc2"
[[setup.model]]
index = "model3"
title = "model3"
desc = "desc3"
`
		);

		assert.equal(config.get("setup.model.indexes").asString, "model1 model3");

		const array = config
			.getNamespace("setup")
			.getArray("model");
		assert.equal(array.length, 2);
		assert.equal(array[0].get("title").asString, "model1");
		assert.equal(array[0].get("desc").asString, "desc1");
		assert.equal(array[1].get("title").asString, "model3");
		assert.equal(array[1].get("desc").asString, "desc3");
	});
});

