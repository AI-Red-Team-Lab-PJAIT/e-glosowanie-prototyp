import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const sprawdzA11y = async (page: Page) => {
	const wynik = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
	expect(wynik.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
};

const zrzut = async (page: Page, nazwa: string) => {
	await sprawdzA11y(page);
	await expect(page).toHaveScreenshot(`${nazwa}.png`, {
		animations: "disabled",
		mask: [page.locator(".status, .mono, [data-zmienne]")],
	});
};

async function przejdzMfa(page: Page) {
	await page.goto("/");
	await page.waitForURL(/#\/uslugi$/);
	await zrzut(page, "01-uslugi");
	await page.getByRole("button", { name: "Wybory" }).click();
	await zrzut(page, "02-wybory");
	await page.getByRole("link", { name: "Zagłosuj przez internet" }).click();
	await zrzut(page, "03-logowanie");
	await page.getByRole("button", { name: "Profil zaufany" }).click();
	await zrzut(page, "04-dokument");
	await page.getByRole("button", { name: "Rozpocznij skanowanie" }).click();
	await page.getByRole("button", { name: "Dalej" }).click();
	await zrzut(page, "05-twarz");
	await page.getByRole("button", { name: "Rozpocznij skan twarzy" }).click();
	await page.getByRole("button", { name: "Dalej" }).click({ timeout: 10_000 });
	await zrzut(page, "06-tozsamosc");
	await page.getByRole("link", { name: "Przejdź do głosowania" }).click();
}

const warianty = [
	{ wybory: "Wybory Prezydenta RP", opcja: "Wzorcowa Anna", etykieta: "Anna Wzorcowa" },
	{ wybory: "Wybory do Sejmu RP", opcja: "2. Jesionowa Joanna", etykieta: "Joanna Jesionowa" },
	{
		wybory: "Wybory do Parlamentu Europejskiego",
		opcja: "1. Jodłowy Michał",
		etykieta: "Michał Jodłowy",
	},
	{ wybory: "Referendum ogólnokrajowe", opcja: "TAK", etykieta: "TAK" },
];

for (const [i, w] of warianty.entries()) {
	test(`pełny przepływ: ${w.wybory}`, async ({ page }) => {
		await przejdzMfa(page);
		await page.getByText(w.wybory, { exact: true }).click();
		if (i === 0) await zrzut(page, "07-rodzaj");
		await page.getByRole("button", { name: "Dalej" }).click();
		await zrzut(page, `08-karta-${i}`);
		await expect(page.getByRole("button", { name: "Dalej" })).toBeDisabled();
		await page.getByText(w.opcja, { exact: true }).click();
		await page.getByRole("button", { name: "Dalej" }).click();
		await expect(page.getByText(w.etykieta, { exact: true })).toBeVisible();
		if (i === 0) await zrzut(page, "09-potwierdzenie");
		await page.getByRole("button", { name: "Oddaj głos" }).click();
		await expect(page.getByRole("heading", { name: "Głos oddany" })).toBeVisible();
		await expect(page.getByText(/^0x[0-9a-f]{40}$/)).toBeVisible();
		if (i === 0) await zrzut(page, "10-oddany");

		await page.getByRole("link", { name: "Historia głosowań" }).click();
		await expect(page.getByText(w.wybory)).toBeVisible();
		// Historia nie może zdradzać treści głosu.
		await expect(page.getByText(w.etykieta, { exact: true })).toHaveCount(0);
		if (i === 0) await zrzut(page, "11-historia");

		await page.goto("/#/glosuj/rodzaj");
		await expect(page.getByRole("radio", { name: new RegExp(w.wybory) })).toBeDisabled();
	});
}

test("bez MFA karta przekierowuje do logowania", async ({ page }) => {
	await page.goto("/#/glosuj/karta");
	await expect(page).toHaveURL(/#\/glosuj\/logowanie$/);
	await page.goto("/#/glosuj/potwierdzenie");
	await expect(page).toHaveURL(/#\/glosuj\/logowanie$/);
});

test("wygaszone usługi i zakładki nie nawigują", async ({ page }) => {
	await page.goto("/#/uslugi");
	for (const nazwa of ["Mandaty", "eRecepta", "Bilkom"]) {
		await page.getByRole("button", { name: nazwa }).click({ force: true });
		await expect(page).toHaveURL(/#\/uslugi$/);
		await expect(page.getByRole("status")).toHaveText("Niedostępne w prototypie");
	}
	for (const nazwa of ["Dokumenty", "Kod QR", "Więcej"]) {
		await page.getByRole("navigation").getByRole("button", { name: nazwa }).click({ force: true });
		await expect(page).toHaveURL(/#\/uslugi$/);
	}
});

test("wyszukiwarka filtruje usługi i ma stan pusty", async ({ page }) => {
	await page.goto("/#/uslugi");
	await page.getByRole("searchbox", { name: "Szukaj usługi" }).fill("wyb");
	await expect(page.getByRole("button", { name: "Wybory" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Mandaty" })).toHaveCount(0);
	await page.getByRole("searchbox", { name: "Szukaj usługi" }).fill("xyz");
	await expect(page.getByText("Brak usługi „xyz”")).toBeVisible();
});

test("szczegóły wyborów, rejestr i O projekcie", async ({ page }) => {
	await page.goto("/#/uslugi/wybory");
	await page.getByRole("link", { name: /Wybory Prezydenta RP/ }).click();
	await zrzut(page, "12-szczegoly");
	const pobranie = page.waitForEvent("download");
	await page.getByRole("button", { name: "Do kalendarza" }).click();
	expect((await pobranie).suggestedFilename()).toBe("wybory-2027-05-16.ics");
	await page.getByRole("link", { name: "Wróć" }).click();
	await page.getByRole("link", { name: /Twoje dane w rejestrze/ }).click();
	await expect(page.getByText("Jan Przykładowy")).toBeVisible();
	await zrzut(page, "13-rejestr");
	await page.getByRole("link", { name: "O projekcie" }).click();
	await expect(page.getByRole("heading", { name: "O projekcie" })).toBeVisible();
	await zrzut(page, "14-o-projekcie");
});

test("pusta historia i czyszczenie historii", async ({ page }) => {
	await page.goto("/#/uslugi/wybory/historia");
	await expect(page.getByText("Nie oddano jeszcze żadnego głosu")).toBeVisible();
	await page.evaluate(() =>
		localStorage.setItem(
			"e-glosowanie:historia",
			JSON.stringify([
				{
					wyboryId: "pe",
					hash: "a".repeat(64),
					tx: `0x${"b".repeat(40)}`,
					czas: "2028-06-04T10:00:00Z",
				},
			]),
		),
	);
	await page.reload();
	await expect(page.getByText("Wybory do Parlamentu Europejskiego")).toBeVisible();
	await page.getByRole("button", { name: "Wyczyść historię prototypu" }).click();
	await expect(page.getByRole("dialog")).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(page.getByRole("dialog")).toHaveCount(0);
	await page.getByRole("button", { name: "Wyczyść historię prototypu" }).click();
	await page.getByRole("button", { name: "Wyczyść historię", exact: true }).click();
	await expect(page.getByText("Nie oddano jeszcze żadnego głosu")).toBeVisible();
});

test("?demo=off pokazuje ekran logowania zamiast autologowania", async ({ page }) => {
	await page.goto("/?demo=off#/");
	await expect(page.getByRole("heading", { name: "Dzień dobry!" })).toBeVisible();
	await page.getByRole("button", { name: "Zaloguj się" }).click();
	await page.waitForURL(/#\/uslugi$/);
});
