const { By, until } = require("selenium-webdriver");

async function login(driver, email, password, url) {
  await driver.get(url);

  const emailField = await driver.wait(until.elementLocated(By.id("email")), 5000);
  await emailField.sendKeys(email);

  const passwordField = await driver.findElement(By.id("password"));
  await passwordField.sendKeys(password);

  const loginButton = await driver.findElement(By.xpath("//button[text()='Login']"));
  await loginButton.click();

  const result = await driver.wait(async () => {
    const dashboard = await driver.findElements(By.xpath("//p[text()='Latest Inventories']"));
    const errorAlert = await driver.findElements(By.css("div.alert.alert-danger[role='alert']"));

    if (dashboard.length > 0) {
      return "success";
    }

    if (errorAlert.length > 0) {
      return "error";
    }

    return false; 
  }, 10000);

  if (result === "success") {
    console.log(`Login successful for ${email}`);
    return true;
  } else if (result === "error") {
    console.log(`Login failed for ${email}: Incorrect password alert displayed`);
    return false;
  }
}

module.exports = { login };
