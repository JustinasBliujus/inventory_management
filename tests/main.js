const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { login } = require("./login");
const { testInventory } = require("./inventoryTest");

const inventoryTestData = [
  { itemName: "Custom line 1", label: "Custom line 1" },
  { itemName: "noFieldsFound." } 
];

async function runTests() {
  const options = new chrome.Options();
  options.addArguments("--start-maximized");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {

    console.log("\nTesting login with bad credentials...");
    const badLogin = await login(driver, "wronguser@example.com", "wrongpass", "http://localhost:5173/login");
    if (!badLogin) {
      console.log("Bad login test passed: 'Incorrect password' alert shown.");
    } else {
      console.log("Bad login test failed: login succeeded unexpectedly!");

      await logout(driver);
    }
    
    console.log("\nTesting login with good credentials...");
    const goodLogin = await login(driver, "justinasbliujus@gmail.com", "aa", "http://localhost:5173/login");
    if (!goodLogin) {
      console.log("Good login test failed: login did not succeed!");
      return;
    }

    console.log("Good login test passed.");

    for (const data of inventoryTestData) {
      console.log(`Running inventory test for: ${data.itemName}`);
      await testInventory(driver, data);
    }

    console.log("\nAll tests completed successfully.");

  } catch (error) {
    console.error("Test run failed:", error);
  } finally {
    await driver.quit();
  }
}

runTests();
