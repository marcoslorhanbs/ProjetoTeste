const { Builder, By, Key, until } = require("selenium-webdriver");
const describe = require("jest")
describe("Test e2e", () => {
  test("cadastro user, Login e exclusão", (done) => {
    //Teste de sistema 1
    async function testeDeRegistro() {
      const driver = await new Builder()
        .withCapabilities({
          browserName: "chrome",
          chromeOptions: { w3c: false },
        })
        .forBrowser("chrome")
        .build();
      try {
        await driver
          .get("http://localhost:3000/register")
          .then(function (click) {
            console.log(click);
          });

        await driver
          .findElement(By.css("input[name='firstName'"))
          .sendKeys("joaozinho");
        await driver
          .findElement(By.css("input[name='lastName'"))
          .sendKeys("Testador");
        await driver.findElement(By.css("input[name='age'")).sendKeys("33");
        await driver
          .findElement(By.css("input[name='username'"))
          .sendKeys("joaozinho");
        await driver.findElement(By.css("input[name='blood'")).sendKeys("O+");
        await driver
          .findElement(By.css("input[name='zip'"))
          .sendKeys("58900-000");
        await driver
          .findElement(By.css("input[name='email'"))
          .sendKeys("joaozinho@gmail.com");
        await driver
          .findElement(By.css("input[name='password'"))
          .sendKeys("000");
        await driver
          .findElement(By.css("input[name='city'"))
          .sendKeys("New Tork");
        await driver
          .findElement(By.css("input[name='road'"))
          .sendKeys("Center");
        await driver
          .findElement(By.css("input[name='district'"))
          .sendKeys("Broklin");

        setTimeout(async () => {
          await driver.findElement(By.css("button[type=submit]")).click();
        }, 3000);
      } finally {
        setTimeout(async () => {
          //Esperar por 10 segundos para ver o resultado
          const url = await driver.getCurrentUrl();
          expect(url).toBe("http://localhost:3000/login");
          await driver.quit();

          testeDeLoginExclusao();
        }, 6000);
      }
    }

    // Teste de sistema 2

    async function testeDeLoginExclusao() {
      const driver = await new Builder()
        .withCapabilities({
          browserName: "chrome",
          chromeOptions: { w3c: false },
        })
        .forBrowser("chrome")
        .build();

      try {
        await driver.get("http://localhost:3000/login");
        await driver
          .findElement(By.css("input[name='username'"))
          .sendKeys("Joaozinho");
        await driver
          .findElement(By.css("input[name='password'"))
          .sendKeys("000");

        setTimeout(async () => {
          await driver.findElement(By.css("input[type=submit]")).click();
        }, 3000);

        setTimeout(async () => {
          await driver.findElement(By.css("#card > a")).click();
        }, 5000);

        setTimeout(async () => {
          await driver.findElement(By.css("a[href='/delete']")).click();
        }, 6000);

        setTimeout(async () => {
          await driver
            .findElement(By.css("input[name='email'"))
            .sendKeys("joaozinho@gmail.com");
        }, 8000);

        setTimeout(async () => {
          await driver.findElement(By.css("button[type=submit]")).click();
        }, 10000);
      } finally {
        setTimeout(async () => {
          const url = await driver.getCurrentUrl();
          expect(url).toBe("http://localhost:3000/");
          await driver.quit();
          done();
        }, 13000);
      }
    }
    (function runTests() {
      testeDeRegistro();
    })();
  });
});
