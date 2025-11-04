const { By, until } = require("selenium-webdriver");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testInventory(driver, data) {
  try {
    const userDiv = await driver.wait(
      until.elementLocated(By.xpath("//div[@title='User' and contains(@class, 'd-flex')]/span[text()='Justinas']")),
      5000
    );
    await userDiv.click();
    await sleep(1500);

    const createInventoryButton = await driver.wait(
      until.elementLocated(By.xpath("//button[@title='Create new inventory']")),
      5000
    );
    await createInventoryButton.click();
    await sleep(1500);

    const fieldsTab = await driver.wait(
      until.elementLocated(By.xpath("//a[@role='button' and @data-rr-ui-event-key='fields']")),
      5000
    );
    await fieldsTab.click();
    await sleep(1000);

    if (data.label) {
      const container = await driver.wait(
        until.elementLocated(By.css("div.d-flex.flex-wrap.gap-2.mb-3")),
        5000
      );
      const buttons = await container.findElements(By.tagName("button"));
      let addLineButton = null;

      for (const btn of buttons) {
        const text = await btn.getText();
        if (text.trim() === "+ line") {
          addLineButton = btn;
          break;
        }
      }

      if (addLineButton) {
        await driver.executeScript("arguments[0].scrollIntoView(true);", addLineButton);
        await addLineButton.click();
        await sleep(1000);
      } else {
        console.log("No '+ line' button found, skipping field addition.");
      }
    } else {
      console.log("No label expected; skipping '+ line' button.");
    }

    const itemsTab = await driver.wait(
      until.elementLocated(By.xpath("//a[@role='button' and @data-rr-ui-event-key='items']")),
      5000
    );
    await itemsTab.click();
    await sleep(1000);

    const saveInventoryButton = await driver.wait(
      until.elementLocated(By.xpath("//button[text()='Save Inventory']")),
      5000
    );
    await saveInventoryButton.click();
    await sleep(1500);

    const addItemButton = await driver.wait(
      until.elementLocated(By.xpath("//button[@title='Add new item']")),
      5000
    );
    await addItemButton.click();
    await sleep(1500);

    let result;
    try {
      await driver.wait(async () => {
        const labelElems = data.label
          ? await driver.findElements(By.xpath(`//label[normalize-space(text())='${data.label}']`))
          : [];
        const noFieldsElems = await driver.findElements(By.xpath("//p[normalize-space(text())='noFieldsFounds']"));

        if (labelElems.length > 0) {
          result = "label";
          return true;
        }
        if (noFieldsElems.length > 0) {
          result = "noFields";
          return true;
        }
        return false; 
      }, 5000);
    } catch {
      result = "none";
    }

    if (result === "label") {
      console.log(`Inventory test passed: '${data.label}' label found.`);
    } else if (result === "noFields") {
      console.log("Inventory test result: noFieldsFounds.");
    } else {
      console.log("Inventory test: neither label nor noFieldsFounds found.");
    }

  } catch (error) {
    console.error("Inventory test failed:", error);
  }
}

module.exports = { testInventory };
