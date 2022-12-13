import inquirer from 'inquirer';
import puppeteer from 'puppeteer';
import { JSDOM } from 'jsdom';
import numeral from 'numeral';
import { table } from 'table';
import fs from 'fs';

const getMoney = async () => {
  const { money } = await inquirer.prompt([
    {
      type: 'number',
      name: 'money',
      message: 'Funds to invest?',
      default: 500000
    }
  ]);
  return money;
};

const getAlchMateHtml = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://alchmate.com/');

  const membersCheckboxSelector = '#includeMembers';
  await page.waitForSelector(membersCheckboxSelector);

  const membersCheckbox = await page.$(membersCheckboxSelector);
  await membersCheckbox.evaluate(checkbox => checkbox.click());

  const html = await page.content();

  await browser.close();
  return html;
};

const getTable = alchMateHtml => {
  const { document } = new JSDOM(alchMateHtml).window;

  const trs = document.querySelectorAll('#mainTable tr');
  const table = [];
  trs.forEach(tr => {
    const tds = tr.querySelectorAll('td');
    const row = [];
    tds.forEach(td => row.push(td.textContent));
    table.push(row);
  });

  return table.slice(1);
};

const getNatureRunePrice = alchMateHtml => {
  const { document } = new JSDOM(alchMateHtml).window;
  return Number(document.querySelector('#natVal').value);
};

const toNum = text => Number(text.replaceAll(',', ''));

const toText = num => numeral(num).format('0,0');

const tableToItems = (table, money, natureRunePrice) => {
  const items = table
    .map(row => {
      const price = toNum(row[1]);
      const highAlch = toNum(row[2]);
      const profitPerItem = toNum(row[3]);
      const buyLimit = toNum(row[5]);

      const maxPrice = highAlch - natureRunePrice;

      const expenses = price + natureRunePrice;
      const quantity = Math.round(Math.min(money / expenses, buyLimit));
      const profit = Math.round(quantity * profitPerItem);

      return {
        name: row[0].trim(),
        profit,
        quantity,
        price,
        maxPrice,
        highAlch,
        buyLimit
      };
    })
    .filter(({ buyLimit }) => !!buyLimit);

  items.sort((a, b) => b.profit - a.profit);

  return items;
};

const saveAsTable = items => {
  const formattedItems = items.map(({ name, profit, quantity, price, maxPrice, highAlch }) => ({
    Item: name,
    Profit: toText(profit),
    Quantity: toText(quantity),
    Price: toText(price),
    'Max Price': toText(maxPrice),
    'High Alch': toText(highAlch)
  }));

  const columnConfig = [
    { alignment: 'left' },
    ...Object.keys(formattedItems[0])
      .slice(1)
      .map(() => ({ alignment: 'right' }))
  ];
  const headerRow = Object.keys(formattedItems[0]);
  const dataRows = formattedItems.map(item => Object.values(item));
  const textTable = table([headerRow, ...dataRows], {
    columns: columnConfig
  });

  fs.writeFileSync('items.txt', textTable);
  fs.writeFileSync('C:/Users/benpa/Desktop/OSRS High Alch.txt', textTable);
};

(async () => {
  const money = await getMoney();
  const alchMateHtml = await getAlchMateHtml();
  const table = getTable(alchMateHtml);
  const natureRunePrice = getNatureRunePrice(alchMateHtml);
  const items = tableToItems(table, money, natureRunePrice);
  saveAsTable(items);
  console.log('Done.');
})();
