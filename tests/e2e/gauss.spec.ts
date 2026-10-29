import { test, expect } from "@playwright/test";
import { PDFDocument } from "pdf-lib";

const route = "/math/class10/ap/gauss-sum";
const stage = (page: import("@playwright/test").Page, name: string) =>
  page
    .getByRole("navigation", { name: "Lesson stages" })
    .getByRole("button", { name });

test("mystery keeps the answer hidden and the physical cards work with a keyboard", async ({
  page,
}) => {
  await page.goto(route);
  const mystery = page.getByRole("region", {
    name: "The mystery",
    exact: true,
  });
  await expect(mystery).not.toContainText("5050");
  await page.getByRole("button", { name: "Reveal total", exact: true }).click();
  await expect(mystery).toContainText("5050");
  await page.getByRole("button", { name: "Conceal total" }).click();
  await expect(mystery).not.toContainText("5050");
  await page
    .getByRole("button", { name: "Can we find a smarter way?" })
    .click();
  for (const [a, b] of [
    [1, 10],
    [2, 9],
    [3, 8],
    [4, 7],
    [5, 6],
  ]) {
    await page.getByRole("button", { name: `Card ${a}`, exact: true }).focus();
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: `Card ${b}`, exact: true }).focus();
    await page.keyboard.press("Space");
  }
  await page.getByRole("button", { name: "Connect the discovery" }).click();
  await expect(page.getByTestId("card-conclusion")).toContainText("55");
  await page.screenshot({
    path: test.info().outputPath("card-pairs.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Undo last pair" }).click();
  await expect(page.getByTestId("card-conclusion")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Card 5", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Reset cards", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Card 1", exact: true }),
  ).toBeEnabled();
  for (const value of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    await page
      .getByRole("button", { name: `Card ${value}`, exact: true })
      .click();
  await expect(
    page.getByText("The totals are not all equal yet.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Connect the discovery" }),
  ).toHaveCount(0);
});

test("odd and even models, teacher-paced proof and changing parameters stay accurate", async ({
  page,
}) => {
  await page.goto(route);
  await stage(page, "03 Discover").click();
  await page.getByRole("button", { name: "Pair opposite ends" }).click();
  await expect(
    page.getByRole("region", { name: "Gauss challenge" }),
  ).toContainText("50 physical pairs");
  await expect(
    page.getByRole("region", { name: "Gauss challenge" }),
  ).toContainText("5050");
  await page.getByRole("slider", { name: "Last natural number" }).fill("9");
  await expect(
    page.getByRole("region", { name: "Gauss challenge" }),
  ).toContainText("4 physical pairs + centre term 5");
  await page.getByRole("button", { name: "Two copies", exact: true }).click();
  await expect(
    page.getByText("9 columns, each summing to 10.", { exact: false }),
  ).toBeVisible();
  await page.getByRole("slider", { name: "Last natural number" }).fill("1");
  await page
    .getByRole("button", { name: "Physical pairs", exact: true })
    .click();
  await expect(
    page.getByText("1 number → 0 physical pairs + centre term 1"),
  ).toBeVisible();
  await stage(page, "04 Generalise").click();
  await expect(page.getByTestId("final-formula")).toHaveCount(0);
  for (const label of [
    "Make a second copy",
    "Reverse and pair",
    "Count the columns",
    "Divide by two",
  ]) {
    await page.getByRole("button", { name: label, exact: true }).click();
    if (label !== "Divide by two")
      await expect(page.getByTestId("final-formula")).toHaveCount(0);
  }
  await expect(page.getByTestId("final-formula")).toContainText("57");
  await page
    .getByRole("spinbutton", { name: "First term", exact: true })
    .fill("10");
  await page
    .getByRole("spinbutton", { name: "Common difference", exact: true })
    .fill("-3");
  await page
    .getByRole("spinbutton", { name: "Number of terms", exact: true })
    .fill("5");
  await expect(page.getByTestId("final-formula")).toContainText("20");
  await page.locator(".ap-main").evaluate((el) => el.scrollTo({ top: 0 }));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(800);
  await page.screenshot({
    path: test.info().outputPath("formula-lab.png"),
    fullPage: true,
  });
  await page
    .getByRole("spinbutton", { name: "Common difference", exact: true })
    .fill("0");
  await expect(page.getByTestId("final-formula")).toContainText("50");
  await page
    .getByRole("spinbutton", { name: "Number of terms", exact: true })
    .fill("1");
  await expect(page.getByTestId("final-formula")).toContainText("10");
  await page
    .getByRole("spinbutton", { name: "Number of terms", exact: true })
    .fill("100");
  await expect(
    page.getByText("all 100 terms are included", { exact: false }),
  ).toBeVisible();
  await expect(page.locator(".katex-error")).toHaveCount(0);
});

test("the full classroom flow checks predictions, assessment, exit and reset", async ({
  page,
}) => {
  await page.goto(route);
  await stage(page, "05 Apply").click();
  const savings = page.getByRole("region", { name: "Savings application" });
  await expect(savings).not.toContainText("175");
  for (const [name, value] of [
    ["a", "10"],
    ["d", "5"],
    ["n", "7"],
  ])
    await page
      .getByRole("textbox", { name: `Savings ${name}`, exact: true })
      .fill(value);
  await page
    .getByRole("button", { name: "Check AP values", exact: true })
    .click();
  await expect(
    page.getByText("Yes. Now combine", { exact: false }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Total saved (₹)", exact: true })
    .fill("40");
  await page.getByRole("button", { name: "Check prediction" }).click();
  await expect(savings).toContainText("Not quite");
  await expect(savings).not.toContainText("175");
  await page
    .getByRole("textbox", { name: "Total saved (₹)", exact: true })
    .fill("175");
  await page.getByRole("button", { name: "Check prediction" }).click();
  await expect(savings).toContainText("Correct.");
  await page.getByRole("button", { name: "An extra challenge" }).click();
  await page.getByRole("textbox", { name: "Sum of eight terms" }).fill("136");
  await page.getByRole("button", { name: "Check prediction" }).nth(1).click();
  await expect(savings).toContainText("The last term is 31");
  await stage(page, "06 Check").click();
  const challenge = page.getByRole("region", {
    name: "Quick challenge",
    exact: true,
  });
  await expect(challenge).not.toContainText("210");
  await page.getByRole("textbox", { name: "Answer to question 1" }).fill("200");
  await challenge
    .getByRole("button", { name: "Check", exact: true })
    .nth(0)
    .click();
  await expect(challenge).not.toContainText("210");
  await page.getByRole("textbox", { name: "Answer to question 1" }).fill("210");
  await challenge
    .getByRole("button", { name: "Check", exact: true })
    .nth(0)
    .click();
  await page.getByRole("textbox", { name: "Answer to question 2" }).fill("40");
  await challenge
    .getByRole("button", { name: "Check", exact: true })
    .nth(1)
    .click();
  await page.getByRole("radio", { name: "n-1", exact: true }).check();
  await challenge
    .getByRole("button", { name: "Check", exact: true })
    .nth(2)
    .click();
  await expect(page.locator(".ap-assessment-summary")).toContainText("3 / 3");
  await page.screenshot({
    path: test.info().outputPath("assessment.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Next stage", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Exit ticket total (₹)", exact: true })
    .fill("45");
  await page.getByRole("button", { name: "Check prediction" }).click();
  await expect(
    page.getByRole("region", { name: "Conclusion and exit ticket" }),
  ).toContainText("Correct.");
  await page.getByRole("button", { name: "Start a fresh lesson" }).click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "The boy who added 100 numbers.",
    }),
  ).toBeVisible();
  await stage(page, "06 Check").click();
  await expect(page.locator(".ap-assessment-summary")).toContainText("0 / 3");
});

test("navigation, timer, themes and responsive framing", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(route);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "The boy who added 100 numbers.",
    }),
  ).toBeVisible();
  await expect(page.locator(".ap-number-wall span").last()).toHaveCSS(
    "opacity",
    "1",
  );
  await page.screenshot({
    path: test.info().outputPath("mystery.png"),
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Start stage timer", exact: true })
    .click();
  await expect(page.locator(".ap-stage-timer strong")).toHaveText("03:59", {
    timeout: 3000,
  });
  await page
    .getByRole("button", { name: "Pause stage timer", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reset stage timer", exact: true })
    .click();
  await expect(page.locator(".ap-stage-timer strong")).toHaveText("04:00");
  await page
    .getByRole("button", { name: "Teacher notes", exact: true })
    .click();
  await expect(
    page.getByRole("complementary", { name: "Teacher notes panel" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Hide teacher notes" }).click();
  await page.getByRole("button", { name: "Light mode", exact: true }).click();
  await expect(page.locator(".ap-lab")).toHaveAttribute("data-theme", "light");
  await page.screenshot({
    path: test.info().outputPath("light-mode.png"),
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Presentation mode", exact: true })
    .click();
  await expect(page.locator(".ap-lab")).toHaveClass(/ap-presentation/);
  await page
    .getByRole("button", { name: "Exit presentation", exact: true })
    .click();
  for (let i = 0; i < 7; i++) {
    await page
      .getByRole("navigation", { name: "Lesson stages" })
      .getByRole("button")
      .nth(i)
      .click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    expect(
      await page
        .locator(".ap-main")
        .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    ).toBe(true);
    await expect(page.locator(".katex-error")).toHaveCount(0);
  }
  await page.locator(".ap-stage-top").focus();
  await page.keyboard.press("p");
  await expect(stage(page, "06 Check")).toHaveAttribute("aria-current", "step");
  await page.keyboard.press("n");
  await expect(stage(page, "07 Reflect")).toHaveAttribute(
    "aria-current",
    "step",
  );
  expect(errors).toEqual([]);
});

test("printable A4 kit has six complete sheets", async ({
  page,
  browserName,
}, info) => {
  test.skip(info.project.name === "mobile" || browserName !== "chromium");
  await page.goto(route + "/print");
  await expect(
    page.getByRole("heading", {
      name: "Ten numbers. Many possibilities.",
      exact: true,
    }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".ap-print-page")).toHaveCount(6);
  await expect(page.locator(".ap-print-cards > div")).toHaveCount(10);
  await page.emulateMedia({ media: "print" });
  await page.setViewportSize({ width: 688, height: 1016 });
  const widths = await page.locator(".ap-print-page").evaluateAll((nodes) =>
    nodes.map((node) => ({
      width: node.clientWidth,
      scroll: node.scrollWidth,
      height: node.clientHeight,
      scrollHeight: node.scrollHeight,
    })),
  );
  for (const width of widths) {
    expect(width.scroll).toBeLessThanOrEqual(width.width + 1);
    expect(width.scrollHeight).toBeLessThanOrEqual(width.height + 1);
    expect(width.height).toBeLessThanOrEqual(1016);
  }
  const pdfBytes = await page.pdf({
    path: info.outputPath("gauss-tlm-a4.pdf"),
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
  });
  expect((await PDFDocument.load(pdfBytes)).getPageCount()).toBe(6);
  await page.screenshot({
    path: info.outputPath("print-preview.png"),
    fullPage: true,
  });
});

test("saved lesson reloads offline without controlling other modules", async ({
  page,
  context,
}, info) => {
  test.skip(
    info.project.name === "mobile" || Boolean(process.env.PLAYWRIGHT_BASE_URL),
  );
  await page.goto(route);
  await page
    .getByRole("button", { name: "Teacher notes", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Save lesson offline", exact: true })
    .click();
  await expect(
    page.getByText("Lesson saved on this browser", { exact: false }),
  ).toBeVisible({ timeout: 40000 });
  const scopes = await page.evaluate(async () =>
    (await navigator.serviceWorker.getRegistrations()).map((r) => r.scope),
  );
  expect(scopes.every((scope) => new URL(scope).pathname === route)).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "The boy who added 100 numbers.",
    }),
  ).toBeVisible();
  await stage(page, "04 Generalise").click();
  await expect(page.getByTestId("formula-proof")).toBeVisible();
  await page.goto(route + "/print");
  await expect(page.locator(".ap-print-page")).toHaveCount(6);
  await context.setOffline(false);
});

test("existing student game and PIN dashboard remain available", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Project Thales: Triangle Detective Mission",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /reveal|show answer|show solution/i }),
  ).toHaveCount(0);
  await page.goto("/teacher");
  await expect(page.getByLabel(/PIN/i)).toBeVisible();
});
