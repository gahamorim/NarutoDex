const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    try {
        for (var i = 65; i <= 90; i++) {
            await page.goto(`https://naruto.fandom.com/pt-br/wiki/Categoria:Personagens?from=${String.fromCharCode(i)}`);
            const characterHtmlList = await page.$('#mw-content-text > div.category-page__members > ul:nth-child(2)');
            const eachCharacterInHtml = await characterHtmlList.$$('.category-page__member > a')

            for (let i = 1; i <= [...eachCharacterInHtml].length; i++) {
                page.click(`#mw-content-text > div.category-page__members > ul:nth-child(2) > li:nth-child(${i}) > a`)
                await page.waitForNavigation()
                await page.goBack()
            }
        }
    } catch (error) {
        console.log(error)
    }

    // fs.writeFile('narutoExample.json', JSON.stringify(nameList, null, 2), err => {
    //     if (err) throw new Error('Something went wrong')
    //     console.log('Well done!')
    // })

    await browser.close();
})();