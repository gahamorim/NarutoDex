const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();
    let characterData = [];

    try {
        for (var i = 65; i <= 90; i++) {
            console.log(`Estou na letra ${String.fromCharCode(i)}!`)
            await page.goto(`https://naruto.fandom.com/pt-br/wiki/Categoria:Personagens?from=${String.fromCharCode(i)}`, {
                waitUntil: 'load',
                timeout: 0
            });
            const characterHtmlList = await page.$('#mw-content-text > div.category-page__members > ul:nth-child(2)');
            const eachCharacterInHtml = await characterHtmlList.$$('.category-page__member > a')

            for (let j = 1; j <= [...eachCharacterInHtml].length; j++) {
                page.click(`#mw-content-text > div.category-page__members > ul:nth-child(2) > li:nth-child(${j}) > a`)
                await page.waitForNavigation({
                    waitUntil: 'load',
                    timeout: 0
                })
                characterData.push(
                    await page.evaluate(() => {
                    const data = {};
                    data['Nome']= document.querySelector('#firstHeading').innerText;
                    [...document.getElementsByClassName('pi-item pi-data pi-item-spacing pi-border-color')]
                        .forEach((a) => {
                            data[a.firstElementChild.innerText]= a.lastElementChild.innerText
                        })
                    return data;
                })
                )
                await page.goBack()
            }
        }
    } catch (error) {
        console.log(error)
    }

    fs.writeFile('allNarutoCharacters.json', JSON.stringify(characterData, null, 2), err => {
        if (err) throw new Error('Something went wrong')
        console.log('Well done!')
    })

    await browser.close();
})();

// [...document.getElementsByClassName('pi-item pi-data pi-item-spacing pi-border-color')]
// .map((a) => a.firstElementChild.parentElement.innerText)