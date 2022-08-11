import { assert } from "chai";

import * as path from "path";
import * as fs from "fs";
import * as tmp from "tmp";
import {userInfo} from "os";

import * as thislib from "../../src";
import { FConfiguration, FExceptionArgument } from "@freemework/common";

describe("Development configuration test getString", function () {
	let tempDirectoryObj: tmp.DirResult;
	before(() => {
		// runs before all tests in this block
		tempDirectoryObj = tmp.dirSync();
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

	it("Site's and user's values should override Devel Virtual Files FConfiguration", function () {
		const config = thislib.develVirtualFilesConfiguration(tempDirectoryObj.name, "DEVEL");
		assert.equal(config.getString("a.a.a"), "project-root-a");
		assert.equal(config.getString("a.a.b"), "project-site-b"); // Site's value
		assert.equal(config.getString("a.a.d"), "user-own-d"); // User's value
	});

	it("Environment variables should override Devel Virtual Files FConfiguration", function () {
		process.env["a.a.a"] = "env-own-a";
		process.env["a.a.b"] = "env-own-b";
		process.env["a.a.c"] = "env-own-c";
		process.env["a.a.d"] = "env-own-d";
		const config = thislib.develVirtualFilesConfiguration(tempDirectoryObj.name, "DEVEL");
		assert.equal(config.getString("a.a.a"), "env-own-a");
		assert.equal(config.getString("a.a.b"), "env-own-b");
		assert.equal(config.getString("a.a.c"), "env-own-c");
		assert.equal(config.getString("a.a.d"), "env-own-d");
	});

	it("Environment variables should NOT override File FConfiguration", function () {
		process.env["a.a.a"] = "env-own-a";
		process.env["a.a.b"] = "env-own-b";
		process.env["a.a.c"] = "env-own-c";
		process.env["a.a.d"] = "env-own-d";
		const config = thislib.fileConfiguration(path.join(tempDirectoryObj.name, "project.properties", "config.properties"));
		assert.equal(config.getString("a.a.a"), "project-root-a");
		assert.equal(config.getString("a.a.b"), "project-root-b");
		assert.equal(config.getString("a.a.c"), "project-root-c");
		assert.equal(config.getString("a.a.d"), "project-root-d");
	});

	it("File FConfiguration should be namespace-able", function () {
		const config = thislib.fileConfiguration(path.join(tempDirectoryObj.name, "project.properties", "config.properties"));
		const nsConfig1 = config.getNamespace("a");
		assert.equal(nsConfig1.getString("a.a"), "project-root-a");
		assert.equal(nsConfig1.getString("a.b"), "project-root-b");
		assert.equal(nsConfig1.getString("a.c"), "project-root-c");
		assert.equal(nsConfig1.getString("a.d"), "project-root-d");
		const nsConfig1_2 = nsConfig1.getNamespace("a");
		assert.equal(nsConfig1_2.getString("a"), "project-root-a");
		assert.equal(nsConfig1_2.getString("b"), "project-root-b");
		assert.equal(nsConfig1_2.getString("c"), "project-root-c");
		assert.equal(nsConfig1_2.getString("d"), "project-root-d");
		const nsConfig2 = config.getNamespace("a.a");
		assert.equal(nsConfig2.getString("a"), "project-root-a");
		assert.equal(nsConfig2.getString("b"), "project-root-b");
		assert.equal(nsConfig2.getString("c"), "project-root-c");
		assert.equal(nsConfig2.getString("d"), "project-root-d");
	});

	it("Devel Virtual Files FConfiguration should be namespace-able", function () {
		const config = thislib.develVirtualFilesConfiguration(tempDirectoryObj.name, "DEVEL");
		const nsConfig1 = config.getNamespace("a");
		assert.equal(nsConfig1.getString("a.a"), "project-root-a");
		assert.equal(nsConfig1.getString("a.b"), "project-site-b"); // Site's value
		assert.equal(nsConfig1.getString("a.d"), "user-own-d"); // User's value
		const nsConfig1_2 = nsConfig1.getNamespace("a");
		assert.equal(nsConfig1_2.getString("a"), "project-root-a");
		assert.equal(nsConfig1_2.getString("b"), "project-site-b"); // Site's value
		assert.equal(nsConfig1_2.getString("d"), "user-own-d"); // User's value
		const nsConfig2 = config.getNamespace("a.a");
		assert.equal(nsConfig2.getString("a"), "project-root-a");
		assert.equal(nsConfig2.getString("b"), "project-site-b"); // Site's value
		assert.equal(nsConfig2.getString("d"), "user-own-d"); // User's value
	});
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

	beforeEach(() => {
		config = thislib.fileConfiguration(path.join(tempDirectoryObj.name, "project.properties", "configTypes.properties"));
	});
	it("Should be return enabledType", function () {
		assert.equal(config.getEnabled("enabledType"), true);
	});
	it("Should be return disabledType", function () {
		assert.equal(config.getEnabled("disabledType"), false);
	});
	it("Should be return int", function () {
		assert.equal(config.getInteger("int"), 12345);
	});
	it("Should be return intMinus", function () {
		assert.equal(config.getInteger("intMinus"), -12345);
	});
	it("Should be return intZero", function () {
		assert.equal(config.getInteger("intZero"), 0);
	});
	it.skip("Should be return intBig", function () {
		assert.equal(config.getInteger("intBig"), 123456789123456789123456789);
	});
	it("Should be return string", function () {
		assert.equal(config.getString("string"), "string-hello-world");
	});
	it("Should be return empty string", function () {
		assert.equal(config.getString("emptyString"), "");
	});
	it("Should be return booleanTrue", function () {
		assert(config.getBoolean("booleanTrue"));
	});
	it("Should be return booleanFalse", function () {
		assert(!config.getBoolean("booleanFalse"));
	});
	it("Should be return float", function () {
		assert.equal(config.getFloat("float"), 0.123);
	});
	it("Should be return floatMinus", function () {
		assert.equal(config.getFloat("floatMinus"), -0.123);
	});
	it("Should be return floatA", function () {
		assert.equal(config.getFloat("floatA"), 123.123);
	});
	it("Should be return Base64", function () {
		const data = config.getBase64("base64Type");
		assert.instanceOf(data, Uint8Array);
		assert.equal(data.length, 3);
		assert.equal(data[0], 1);
		assert.equal(data[1], 2);
		assert.equal(data[2], 3);
	});
	it("Should be return URL", function () {
		const data = config.getURL("urlType");
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

	beforeEach(() => {
		config = thislib.fileConfiguration(path.join(tempDirectoryObj.name, "project.properties", "configdefaultValue.properties"));
	});
	it("Should be return getEnabled true", function () {
		assert.equal(config.getEnabled("int", true), true);
	});
	it("Should be return getEnabled false", function () {
		assert.equal(config.getEnabled("int", false), false);
	});
	it("Should be return int", function () {
		assert.equal(config.getInteger("int", 12345), 12345);
	});
	it("Should be return ZERO int", function () {
		assert.equal(config.getInteger("int", 0), 0);
	});
	it("Should be return string", function () {
		assert.equal(config.getString("string", "string-hello-world"), "string-hello-world");
	});
	it("Should be return empty string", function () {
		assert.equal(config.getString("string", ""), "");
	});
	it("Should be return booleanTrue", function () {
		assert(config.getBoolean("booleanTrue", true));
	});
	it("Should be return booleanFalse", function () {
		assert(!(config.getBoolean("booleanFalse", false)));
	});
	it("Should be return float", function () {
		assert.equal(config.getFloat("float", 0.123), 0.123);
	});
	it("Should be return ZERO float", function () {
		assert.equal(config.getFloat("float", 0), 0);
	});
});

describe("Negative test", function () {
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
			path.join(projectConfigDir, "configErrors.properties"),
			"# Test config file\r\n" +
			"boolean = 123\r\n" +
			"int = fake\r\n" +
			"float = fake\r\n" +
			"enable = fake\r\n" +
			"base64 = wrong_base64\r\n" +
			"a.b.c.url = wrong_url"
		);
	});

	beforeEach(() => {
		config = thislib.fileConfiguration(path.join(tempDirectoryObj.name, "project.properties", "configErrors.properties"));
	});
	it("Should be execution error Wrong argument on getBoolean", function () {
		try {
			let empty: any;
			config.getBoolean(empty);
		} catch (err) {
			assert.instanceOf(err, FExceptionArgument);
			return;
		}
		assert.fail("Should never happened");
	});
	it("Should be execution error Wrong argument on getConfiguration #1", function () {
		try {
			let empty: any;
			config.getNamespace(empty);
		} catch (err) {
			assert.instanceOf(err, FExceptionArgument);
			return;
		}
		assert.fail("Should never happened");
	});
	it("Should be execution error Wrong argument on getConfiguration #2", function () {
		try {
			config.getNamespace("a.b").getNamespace("o.l.o.l.o");
		} catch (err) {
			assert.instanceOf(err, Error);
			assert.include((<Error>err).message, "'a.b.o.l.o.l.o'");
			return;
		}
		assert.fail("Should never happened");
	});
	it("Should be execution error Wrong argument on getConfiguration #3", function () {
		assert.isTrue(config.getNamespace("a.b").hasNamespace("c"), "Should exist: a.b.c");
		assert.isFalse(config.getNamespace("a.b").hasNamespace("o.l.o.l.o"), "Should not exist: a.b.o.l.o.l.o");
	});
	it("Should be execution error Wrong argument on getEnabled", function () {
		try {
			let empty: any;
			config.getEnabled(empty);
		} catch (err) {
			assert.instanceOf(err, FExceptionArgument);
			return;
		}
		assert.fail("Should never happened");
	});
	it("Should be execution error Wrong argument on getFloat", function () {
		try {
			let empty: any;
			config.getFloat(empty);
		} catch (err) {
			assert.instanceOf(err, FExceptionArgument);
			return;
		}
		assert.fail("Should never happened");
	});
	it("Should be execution error Wrong argument on getInteger", function () {
		try {
			let empty: any;
			config.getInteger(empty);
		} catch (err) {
			assert.instanceOf(err, FExceptionArgument);
			return;
		}
		assert.fail("Should never happened");
	});
	it("Should be execution error Wrong argument on getString", function () {
		try {
			let empty: any;
			config.getString(empty);
		} catch (err) {
			assert.instanceOf(err, FExceptionArgument);
			return;
		}
		assert.fail("Should never happened");
	});
	it("Should be execution error not found key on getString", function () {
		try {
			const fake = "fake";
			config.getString(fake);
		} catch (err) {
			assert((<any>err).message.startsWith("A value for key "));
			return;
		}
		assert.fail("Should never happened");
	});
	it("Should be execution error not found key on getBoolean", function () {
		try {
			const fake = "fake";
			config.getBoolean(fake);
		} catch (err) {
			assert((<any>err).message.startsWith("A value for key "));
			return;
		}
		assert.fail("Should never happened");
	});
	it("Should be execution error not found key on getEnabled", function () {
		try {
			const fake = "fake";
			config.getEnabled(fake);
		} catch (err) {
			assert((<any>err).message.startsWith("A value for key "));
			return;
		}
		assert.fail("Should never happened");
	});
	it("Should be execution error not found key on getFloat", function () {
		try {
			const fake = "fake";
			config.getFloat(fake);
		} catch (err) {
			assert((<any>err).message.startsWith("A value for key "));
			return;
		}
		assert.fail("Should never happened");
	});
	it("Should be execution error not found key on getInteger", function () {
		try {
			const fake = "fake";
			config.getInteger(fake);
		} catch (err) {
			assert((<any>err).message.startsWith("A value for key "));
			return;
		}
		assert.fail("Should never happened");
	});
	it("Should be execution error Bad type of key on getBoolean", function () {
		try {
			config.getBoolean("boolean");
		} catch (err) {
			assert((<any>err).message.startsWith("Bad type of key "));
			return;
		}
		assert.fail("Should never happened");
	});
	it("Should be execution error Bad type of key on getInteger", function () {
		try {
			config.getInteger("int");
		} catch (err) {
			assert((<any>err).message.startsWith("Bad type of key "));
			return;
		}
		assert.fail("Should never happened");
	});
	it("Should be execution error Bad type of key on getFloat", function () {
		try {
			config.getFloat("float");
		} catch (err) {
			assert((<any>err).message.startsWith("Bad type of key "));
			return;
		}
		assert.fail("Should never happened");
	});
	it("Should be execution error Bad type of key on getEnabled", function () {
		try {
			config.getEnabled("enable");
		} catch (err) {
			assert((<any>err).message.startsWith("Bad type of key "));
			return;
		}
		assert.fail("Should never happened");
	});
	it("Should be execution error Bad type of key on getBase64", function () {
		try {
			config.getBase64("base64");
		} catch (err) {
			assert((<any>err).message.startsWith("Bad type of key "));
			return;
		}
		assert.fail("Should never happened");
	});
	it("Should be execution error Bad type of key on getURL", function () {
		try {
			config.getNamespace("a").getNamespace("b").getNamespace("c").getURL("url");
		} catch (err) {
			assert((<any>err).message.startsWith("Bad type of key "));
			assert.include((<any>err).message, "'a.b.c.url'");
			return;
		}
		assert.fail("Should never happened");
	});
	it("Should be execution error FExceptionArgument on develVirtualFilesConfiguration", function () {
		try {
			let emptyDir: any;
			thislib.develVirtualFilesConfiguration(emptyDir, emptyDir);
		} catch (err) {
			assert.instanceOf(err, FExceptionArgument);
			return;
		}
		assert.fail("Should never happened");
	});
	it("Should be execution error Bad configuration directory on develVirtualFilesConfiguration", function () {
		try {
			let emptyDir: any = "go";
			thislib.develVirtualFilesConfiguration(emptyDir, emptyDir);
		} catch (err) {
			assert((<any>err).message.startsWith("Bad configuration directory"));
			return;
		}
		assert.fail("Should never happened");
	});
});

describe("Negative test specific for develVirtualFilesConfiguration", function () {
	it("Should be execution error Skip a configuration file on develVirtualFilesConfiguration", function () {
		try {
			const tempDirectoryObj = tmp.dirSync();
			const config = thislib.develVirtualFilesConfiguration(tempDirectoryObj.name, "project.properties");
		} catch (err) {
			assert((<any>err).message.startsWith("Skip a configuration file"));
			return;
		}
		assert.fail("Should never happened");
	});
});
