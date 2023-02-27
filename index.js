import puppeteer from "puppeteer";
import fs from 'fs'

const browser = await puppeteer.launch({headless: true})
const page = (await browser.pages())[0]
await page.setViewport({
  width: 1000,
  height: 768,
});
await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36")

async function job() {
  console.log("开始，跳转页面")
  await page.goto("https://www.amazon.com/Amazon-Basics-Collapsible-Storage-Organizer/dp/B071225BBS/ref=zg_bs_home-garden_sccl_100/142-3529176-9624443?psc=1")
  try {
    await page.select('button[type="submit"]')
    await page.waitForSelector("#add-to-cart-button")
  } catch (e) {} finally {
    console.log("添加到购物车")
    await page.click("#add-to-cart-button")
    await page.waitForNavigation()
    console.log("跳转到购物车")
    await page.click("#sw-atc-buy-box #sw-gtc")
    await page.waitForSelector("#a-autoid-1-announce")
    console.log("选择库存")
    await page.click("#a-autoid-1-announce")
    await page.waitForTimeout(1000)
    console.log("选择更多")
    await page.click("li.quantity-option-10")
    console.log("输入999")
    await page.type("input.sc-update-quantity-input", "999")
    console.log("点击更新")
    await page.click(".sc-update-link")
    const stock = await page.$eval(".sc-action-quantity input", el => el.value)
    console.log("库存：", stock)
    const file = "./库存监控.txt"
    fs.appendFileSync(file, `${new Date().toISOString()}, ${stock}`)
  }
}

cron.schedule('0 0/30 * * * * *', job);
job()
