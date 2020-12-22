const puppeteer = require('puppeteer');
const fs = require('fs');
 
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://naruto.fandom.com/wiki/Category:Characters');
  const imgList = await page.evaluate(() => {
      const nodeList = document.querySelectorAll('article img');
      const imgArray = [...nodeList]
      const imgList = imgArray.map(({src}) => ({
          src
      }))

      return imgList
  })

  console.log(imgList)
 
  fs.writeFile('narutoimg.json', JSON.stringify(imgList, null, 2), err => {
      if (err) throw new Error('Something went wrong')
      console.log('Well done!')
  })
  await browser.close();
})(); 