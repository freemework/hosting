import { assert } from "chai";

import * as path from "path";
import * as fs from "fs";
import * as tmp from "tmp";
import { userInfo } from "os";

import { FConfiguration, FExceptionArgument } from "@freemework/common";

import * as THE from "../../src";
import { FConfigurationProperties } from "../../src";

describe("FConfigurationProperties configuration test getString", function () {
	let tempDirectoryObj: tmp.DirResult;
	before(() => {
		// runs before all tests in this block
		tempDirectoryObj = tmp.dirSync({ unsafeCleanup: true });
		const currentUserName = userInfo().username;
		const projectConfigDir = path.join(tempDirectoryObj.name, "project.properties");
		const userConfigDir = path.join(tempDirectoryObj.name, "user.properties");
		fs.mkdirSync(projectConfigDir);
		fs.mkdirSync(userConfigDir);
		fs.writeFileSync(
			path.join(projectConfigDir, "config.properties"),
			"# Test config file string \r\n" +
			"a.a.a = project-root-a\r\n" +
			"a.a.b = project-root-b\r\n" +
			"a.a.c = project-root-c\r\n" +
			"a.a.d = project-root-d\r\n"
		);
		fs.writeFileSync(
			path.join(projectConfigDir, "config-DEVEL.properties"),
			"# Test config file string \r\n" +
			"a.a.b = project-site-b\r\n" +
			"a.a.c = project-site-c\r\n" +
			"a.a.d = project-site-d\r\n"
		);
		fs.writeFileSync(
			path.join(userConfigDir, "config-" + currentUserName + ".properties"),
			"# Test config file string\r\n" +
			"a.a.d = user-own-d\r\n"
		);
	});
	after(() => {
		tempDirectoryObj.removeCallback();
	});

	beforeEach(() => {
		delete process.env["a.a.a"];
		delete process.env["a.a.b"];
		delete process.env["a.a.c"];
		delete process.env["a.a.d"];
	});

	// it("Site's and user's values should override Devel Virtual Files FConfiguration", function () {
	// 	const config = THE.develVirtualFilesConfiguration(tempDirectoryObj.name, "DEVEL");
	// 	assert.equal(config.get("a.a.a").asString, "project-root-a");
	// 	assert.equal(config.get("a.a.b").asString, "project-site-b"); // Site's value
	// 	assert.equal(config.get("a.a.d").asString, "user-own-d"); // User's value
	// });

	// it("Environment variables should override Devel Virtual Files FConfiguration", function () {
	// 	process.env["a.a.a"] = "env-own-a";
	// 	process.env["a.a.b"] = "env-own-b";
	// 	process.env["a.a.c"] = "env-own-c";
	// 	process.env["a.a.d"] = "env-own-d";
	// 	const config = THE.develVirtualFilesConfiguration(tempDirectoryObj.name, "DEVEL");
	// 	assert.equal(config.get("a.a.a").asString, "env-own-a");
	// 	assert.equal(config.get("a.a.b").asString, "env-own-b");
	// 	assert.equal(config.get("a.a.c").asString, "env-own-c");
	// 	assert.equal(config.get("a.a.d").asString, "env-own-d");
	// });

	it("Environment variables should NOT override File FConfiguration", async function () {
		process.env["a.a.a"] = "env-own-a";
		process.env["a.a.b"] = "env-own-b";
		process.env["a.a.c"] = "env-own-c";
		process.env["a.a.d"] = "env-own-d";
		const config = await FConfigurationProperties.fromFile(path.join(tempDirectoryObj.name, "project.properties", "config.properties"));
		assert.equal(config.get("a.a.a").asString, "project-root-a");
		assert.equal(config.get("a.a.b").asString, "project-root-b");
		assert.equal(config.get("a.a.c").asString, "project-root-c");
		assert.equal(config.get("a.a.d").asString, "project-root-d");
	});

	it("File FConfiguration should be namespace-able", async function () {
		const config = await FConfigurationProperties.fromFile(path.join(tempDirectoryObj.name, "project.properties", "config.properties"));
		const nsConfig1 = config.getNamespace("a");
		assert.equal(nsConfig1.get("a.a").asString, "project-root-a");
		assert.equal(nsConfig1.get("a.b").asString, "project-root-b");
		assert.equal(nsConfig1.get("a.c").asString, "project-root-c");
		assert.equal(nsConfig1.get("a.d").asString, "project-root-d");
		const nsConfig1_2 = nsConfig1.getNamespace("a");
		assert.equal(nsConfig1_2.get("a").asString, "project-root-a");
		assert.equal(nsConfig1_2.get("b").asString, "project-root-b");
		assert.equal(nsConfig1_2.get("c").asString, "project-root-c");
		assert.equal(nsConfig1_2.get("d").asString, "project-root-d");
		const nsConfig2 = config.getNamespace("a.a");
		assert.equal(nsConfig2.get("a").asString, "project-root-a");
		assert.equal(nsConfig2.get("b").asString, "project-root-b");
		assert.equal(nsConfig2.get("c").asString, "project-root-c");
		assert.equal(nsConfig2.get("d").asString, "project-root-d");
	});

	// it("Devel Virtual Files FConfiguration should be namespace-able", function () {
	// 	const config = THE.develVirtualFilesConfiguration(tempDirectoryObj.name, "DEVEL");
	// 	const nsConfig1 = config.getNamespace("a");
	// 	assert.equal(nsConfig1.get("a.a").asString, "project-root-a");
	// 	assert.equal(nsConfig1.get("a.b").asString, "project-site-b"); // Site's value
	// 	assert.equal(nsConfig1.get("a.d").asString, "user-own-d"); // User's value
	// 	const nsConfig1_2 = nsConfig1.getNamespace("a");
	// 	assert.equal(nsConfig1_2.get("a").asString, "project-root-a");
	// 	assert.equal(nsConfig1_2.get("b").asString, "project-site-b"); // Site's value
	// 	assert.equal(nsConfig1_2.get("d").asString, "user-own-d"); // User's value
	// 	const nsConfig2 = config.getNamespace("a.a");
	// 	assert.equal(nsConfig2.get("a").asString, "project-root-a");
	// 	assert.equal(nsConfig2.get("b").asString, "project-site-b"); // Site's value
	// 	assert.equal(nsConfig2.get("d").asString, "user-own-d"); // User's value
	// });
});

describe("Checks all methods with type", function () {
	let tempDirectoryObj: tmp.DirResult;
	let config: FConfiguration;
	before(() => {
		// runs before all tests in this block
		tempDirectoryObj = tmp.dirSync();
		const projectConfigDir = path.join(tempDirectoryObj.name, "project.properties");
		const userConfigDir = path.join(tempDirectoryObj.name, "user.properties");
		fs.mkdirSync(projectConfigDir);
		fs.mkdirSync(userConfigDir);
		fs.writeFileSync(
			path.join(projectConfigDir, "configTypes.properties"),
			"# Test config file\r\n" +
			"int = 12345\r\n" +
			"intMinus = -12345\r\n" +
			"intZero = 0\r\n" +
			"intBig = 123456789123456789123456789\r\n" +
			"string = string-hello-world\r\n" +
			"emptyString = \r\n" +
			"booleanTrue = true\r\n" +
			"booleanFalse = false\r\n" +
			"float = 0.123\r\n" +
			"floatMinus = -0.123\r\n" +
			"floatA = 123.123\r\n" +
			"object = { hello: world }\r\n" +
			"enabledType = enabled\r\n" +
			"disabledType = disabled\r\n" +
			"base64Type = AQID\r\n" +
			"urlType = https://user:password@host.local/test?a=123\r\n"
		);
	});

	beforeEach(async () => {
		config = await FConfigurationProperties.fromFile(path.join(tempDirectoryObj.name, "project.properties", "configTypes.properties"));
	});
	it("Should be return enabledType", function () {
		assert.equal(config.get("enabledType").asBoolean, true);
	});
	it("Should be return disabledType", function () {
		assert.equal(config.get("disabledType").asBoolean, false);
	});
	it("Should be return int", function () {
		assert.equal(config.get("int").asInteger, 12345);
	});
	it("Should be return intMinus", function () {
		assert.equal(config.get("intMinus").asInteger, -12345);
	});
	it("Should be return intZero", function () {
		assert.equal(config.get("intZero").asInteger, 0);
	});
	it.skip("Should be return intBig", function () {
		assert.equal(config.get("intBig").asInteger, 123456789123456789123456789);
	});
	it("Should be return string", function () {
		assert.equal(config.get("string").asString, "string-hello-world");
	});
	it("Should be return empty string", function () {
		assert.equal(config.get("emptyString").asString, "");
	});
	it("Should be return booleanTrue", function () {
		assert(config.get("booleanTrue").asBoolean);
	});
	it("Should be return booleanFalse", function () {
		assert(!config.get("booleanFalse").asBoolean);
	});
	it("Should be return float", function () {
		assert.equal(config.get("float").asNumber, 0.123);
	});
	it("Should be return floatMinus", function () {
		assert.equal(config.get("floatMinus").asNumber, -0.123);
	});
	it("Should be return floatA", function () {
		assert.equal(config.get("floatA").asNumber, 123.123);
	});
	it("Should be return Base64", function () {
		const data = config.get("base64Type").asBase64;
		assert.instanceOf(data, Uint8Array);
		assert.equal(data.length, 3);
		assert.equal(data[0], 1);
		assert.equal(data[1], 2);
		assert.equal(data[2], 3);
	});
	it("Should be return URL", function () {
		const data = config.get("urlType").asUrl;
		assert.instanceOf(data, URL);
		assert.equal(data.toString(), "https://user:password@host.local/test?a=123");
	});
});
describe("Checks all methods default value", function () {
	let tempDirectoryObj: tmp.DirResult;
	let config: FConfiguration;
	before(() => {
		// runs before all tests in this block
		tempDirectoryObj = tmp.dirSync();
		const projectConfigDir = path.join(tempDirectoryObj.name, "project.properties");
		const userConfigDir = path.join(tempDirectoryObj.name, "user.properties");
		fs.mkdirSync(projectConfigDir);
		fs.mkdirSync(userConfigDir);
		fs.writeFileSync(
			path.join(projectConfigDir, "configdefaultValue.properties"),
			"# Test config file\r\n"
		);
	});

	beforeEach(async () => {
		config = await FConfigurationProperties.fromFile(path.join(tempDirectoryObj.name, "project.properties", "configdefaultValue.properties"));
	});
	it("Should be return getEnabled true", function () {
		assert.equal(config.get("int", "true").asBoolean, true);
	});
	it("Should be return getEnabled false", function () {
		assert.equal(config.get("int", "false").asBoolean, false);
	});
	it("Should be return int", function () {
		assert.equal(config.get("int", "12345").asInteger, 12345);
	});
	it("Should be return ZERO int", function () {
		assert.equal(config.get("int", "0").asInteger, 0);
	});
	it("Should be return string", function () {
		assert.equal(config.get("string", "string-hello-world").asString, "string-hello-world");
	});
	it("Should be return empty string", function () {
		assert.equal(config.get("string", "").asString, "");
	});
	it("Should be return booleanTrue", function () {
		assert(config.get("booleanTrue", "true").asBoolean);
	});
	it("Should be return booleanFalse", function () {
		assert(!(config.get("booleanFalse", "false").asBoolean));
	});
	it("Should be return float", function () {
		assert.equal(config.get("float", "0.123").asNumber, 0.123);
	});
	it("Should be return ZERO float", function () {
		assert.equal(config.get("float", "0").asNumber, 0);
	});
});

// it("Should be execution error FExceptionArgument on develVirtualFilesConfiguration", function () {
// 	try {
// 		let emptyDir: any;
// 		THE.develVirtualFilesConfiguration(emptyDir, emptyDir);
// 	} catch (err) {
// 		assert.instanceOf(err, FExceptionArgument);
// 		return;
// 	}
// 	assert.fail("Should never happened");
// });
// it("Should be execution error Bad configuration directory on develVirtualFilesConfiguration", function () {
// 	try {
// 		let emptyDir: any = "go";
// 		THE.develVirtualFilesConfiguration(emptyDir, emptyDir);
// 	} catch (err) {
// 		assert((<any>err).message.startsWith("Bad configuration directory"));
// 		return;
// 	}
// 	assert.fail("Should never happened");
// });

// describe("Negative test specific for develVirtualFilesConfiguration", function () {
// 	it("Should be execution error Skip a configuration file on develVirtualFilesConfiguration", function () {
// 		try {
// 			const tempDirectoryObj = tmp.dirSync();
// 			const config = THE.develVirtualFilesConfiguration(tempDirectoryObj.name, "project.properties");
// 		} catch (err) {
// 			assert((<any>err).message.startsWith("Skip a configuration file"));
// 			return;
// 		}
// 		assert.fail("Should never happened");
// 	});
// });
