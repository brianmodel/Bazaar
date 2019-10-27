const puppeteer = require("puppeteer");

describe("APP e2e", () => {
  it("app loads", async () => {
    if (process.env.DISABLE_E2E) {
      return;
    }
    let browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();

    page.emulate({
      viewport: {
        width: 500,
        height: 2400
      },
      userAgent: ""
    });

    await page.goto("http://localhost:3000/");
    await page.waitForSelector("#app");

    const pageHtml = await page.$eval("#app", e => e.innerHTML);

    expect(pageHtml).toContain("myQuery");

    await page.click("#react-select-2-input");
    await page.type("#react-select-2-input", "set id");
    await page.keyboard.press("Enter");
    await page.click("#selectOutputs .plus-button");

    await page.waitForSelector(".selected-chips:first-child", {
      visible: true
    });
    const chipText = await page.$eval(
      ".selected-chips:first-child",
      e => e.textContent
    );
    expect(chipText).toContain("set_id");

    await page.click("#react-select-3-input");
    await page.type("#react-select-3-input", "set id");
    await page.keyboard.press("Enter");
    await page.click('.filter-box input[placeholder="Enter value"]');
    await page.type(
      '.filter-box input[placeholder="Enter value"]',
      "10,12,13,16,20,24,25"
    );

    await page.click("#runQuery");

    await page.waitForSelector("#resultsDisplay");

    await page.click("#resultsDisplay .result-options button");

    await page.waitForSelector("#sqlQuery pre", {
      visible: true
    });

    await page.$eval("#sqlQuery h2", e => e.click());

    await page.waitFor(() => document.querySelectorAll("tr").length === 5);

    await page.click("#newQuery");
    browser.close();
  }, 16000);
});
