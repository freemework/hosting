import { assert } from "chai";

import * as thislib from "../../src";

describe("envConfiguration basic tests", function () {
	it("Parse array of float", function () {
		const config = thislib.tomlConfiguration("a = [1.01,1e-1]");

		assert.equal(config.getString("a_indexer"), "0 1");
		assert.equal(config.getString("a.0"), "1.01");
		assert.equal(config.getString("a.1"), "0.1");
	});

	it("Parse array of object", function () {
		const config = thislib.tomlConfiguration(`
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

		assert.equal(config.getString("setup.model_indexer"), "0 1 2");
		assert.equal(config.getString("setup.model.0.title"), "model1");
		assert.equal(config.getString("setup.model.0.desc"), "desc1");
		assert.equal(config.getString("setup.model.1.title"), "model2");
		assert.equal(config.getString("setup.model.1.desc"), "desc2");
		assert.equal(config.getString("setup.model.2.title"), "model3");
		assert.equal(config.getString("setup.model.2.desc"), "desc3");
	});

	it("Parse array of object with index", function () {
		const config = thislib.tomlConfiguration(`
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

		assert.equal(config.getString("setup.model_indexer"), "model1 model2 model3");
		assert.equal(config.getString("setup.model.model1.title"), "model1");
		assert.equal(config.getString("setup.model.model1.desc"), "desc1");
		assert.equal(config.getString("setup.model.model2.title"), "model2");
		assert.equal(config.getString("setup.model.model2.desc"), "desc2");
		assert.equal(config.getString("setup.model.model3.title"), "model3");
		assert.equal(config.getString("setup.model.model3.desc"), "desc3");
	});

	it("Parse array of object with named index", function () {
		const config = thislib.tomlConfiguration(`
[setup]

model_indexer = "model1 model3"

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

		assert.equal(config.getString("setup.model_indexer"), "model1 model3");
		assert.equal(config.getString("setup.model.model1.title"), "model1");
		assert.equal(config.getString("setup.model.model1.desc"), "desc1");
		assert.equal(config.getString("setup.model.model2.title"), "model2");
		assert.equal(config.getString("setup.model.model2.desc"), "desc2");
		assert.equal(config.getString("setup.model.model3.title"), "model3");
		assert.equal(config.getString("setup.model.model3.desc"), "desc3");
	});


	it.skip("getIndexer with named index", function () {
		const config = thislib.tomlConfiguration(`
[setup]

model_indexer = "model1 model3"

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

		const indexer = config.getNamespace("setup.model").getIndexer();
		assert.equal(indexer.length, 2);
		assert.equal(config.getString("setup.model_indexer"), "model1 model3");
		assert.equal(indexer[0].getString("title"), "model1");
		assert.equal(indexer[0].getString("desc"), "desc1");
		assert.equal(indexer[1].getString("title"), "model3");
		assert.equal(indexer[1].getString("desc"), "desc3");
	});
});

