const { chromium } = require("playwright");
const dayjs = require("dayjs");

// add locale id
const localeId = require("dayjs/locale/id");
dayjs.locale(localeId);

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://sipd.kemendagri.go.id/aklap/login");
  await page.isVisible('btn[type="submit"]');

  await page.fill('input[name="username"]', "ppkATMA");
  await page.fill('input[name="password"]', "kaltimprov");

  const tahun = dayjs().format("YYYY");

  await page.click("#vs1__combobox");
  await page.keyboard.type(tahun);

  await page.keyboard.press("Enter");

  await page.waitForResponse(
    (resp) => resp.url().includes("daerah-by-tahun") && resp.status() === 200
  );

  await page.click("#vs2__combobox");

  await page.keyboard.type("Provinsi Kalimantan Timur");
  await page.keyboard.press("Enter");

  await page.click('label[for="remember"]');

  await page.getByText("Log In").click();

  /* start input data here */

  await page.waitForURL("https://sipd.kemendagri.go.id/aklap/home");

  await page.click('a[href="/aklap/input-transaksi-non-anggaran"]');
  await page.waitForURL(
    "https://sipd.kemendagri.go.id/aklap/input-transaksi-non-anggaran"
  );

  await page.selectOption("select.custom-select", "badan-layanan-umum-daerah");
  await page.isVisible("button.btn.btn-success.rounded-0");

  await Promise.all([
    page.waitForResponse(
      (resp) => resp.url().includes("get-skpd") && resp.status() === 200
    ),
    page.waitForResponse(
      (resp) => resp.url().includes("skpd-unit") && resp.status() === 200
    ),
    page.waitForResponse(
      (resp) => resp.url().includes("generate-nomor") && resp.status() === 200
    ),
  ]);

  await page.click('[aria-describedby="input-tanggal_jurnal-feedback"]');
  await page.isVisible("header.b-calendar-grid-caption");

  const bulanInComponent = await page.$eval(
    "header.b-calendar-grid-caption",
    (el) => el.innerHTML
  );
  const bulanValueComponent = dayjs(bulanInComponent);
  const tanggal = dayjs().subtract(2, "months");

  // get the difference month between bulanValueComponent and tanggal
  const diffMonth = tanggal.diff(bulanValueComponent, "month");
  if (diffMonth > 0) {
    for (let i = 0; i <= diffMonth; i++) {
      await page.click('button[title="Next month"]');
    }
  } else {
    for (let i = 0; i <= Math.abs(diffMonth); i++) {
      await page.click('button[title="Previous month"]');
    }
  }

  const tanggalString = tanggal.format("YYYY-MM-DD");
  await page.click(`[data-date="${tanggalString}"]`);

  await page.click("#vs4__combobox");
  await page.keyboard.press("Enter");

  await page.waitForResponse(
    (resp) => resp.url().includes("get-urusan") && resp.status() === 200
  );

  await page.click("#vs5__combobox");
  await page.keyboard.press("Enter");

  await page.waitForResponse(
    (resp) => resp.url().includes("get-urusan") && resp.status() === 200
  );

  await page.click("#vs6__combobox");
  await page.keyboard.press("Enter");

  await page.waitForResponse(
    (resp) => resp.url().includes("get-urusan") && resp.status() === 200
  );

  await page.click("#vs7__combobox");
  await page.keyboard.press("Enter");

  await page.waitForResponse(
    (resp) => resp.url().includes("get-urusan") && resp.status() === 200
  );

  await page.click("#vs8__combobox");
  await page.keyboard.press("Enter");

  await page.waitForResponse(
    (resp) => resp.url().includes("get-urusan") && resp.status() === 200
  );

  await page.click("#vs9__combobox");
  await page.keyboard.press("Enter");

  await page.waitForResponse(
    (resp) =>
      resp.url().includes("main-account-list-urusan") && resp.status() === 200
  );

  await page.click(`div[item-text="namaRekening"] > div`);
  await page.keyboard.type("5.1.01.99.99.9999");
  await page.keyboard.press("Enter");

  await page.waitForResponse(
    (resp) =>
      resp.url().includes("paired-account-list") && resp.status() === 200
  );

  await page.getByPlaceholder("Pilih Nama dan Kode Rekening").click();
  await page.keyboard.type("8.1.01.99.99.9999");
  await page.keyboard.press("Enter");

  await page.fill(
    'input[aria-describedby="input-nominal_realisasi-feedback"]',
    "999999999"
  );

  await page.getByText("Preview").click();
  await page.getByText("Tutup").click();
  await page.getByText("Tambah").click();
  // await Promise.all([page.waitForEvent("dialog")]);

  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.click(".custom-file.b-form-file");
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles("test.pdf");

  await page.fill(
    'input[aria-describedby="input-nilai-feedback"]',
    "Belanja Pegawai Testing"
  );

  await page.getByText("Preview").click();

  const count = await page.getByText("999.999.999").count();

  if (count == 4) {
    console.log("success tambah jurnal");
  } else {
    console.log("failed tambah jurnal");
  }

  await page.getByText("Tutup").click();
  await page.getByText("Simpan").click();

  // await page.click(".swal2-confirm");

  await page.waitForURL("https://sipd.kemendagri.go.id/aklap/home");

  //   await browser.close();
})();
