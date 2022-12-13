# OSRS High Alchemy Calculator

Generates a list of items to buy from the Grand Exchange in Old School RuneScape for the highest profit per item type when using high alchemy.

Builds upon [alchmate.com](https://alchmate.com/)

```
╔════════════════════════╤════════╤══════════╤════════╤═══════════╤═══════════╗
║ Item                   │ Profit │ Quantity │  Price │ Max Price │ High Alch ║
╟────────────────────────┼────────┼──────────┼────────┼───────────┼───────────╢
║ Mithril platebody      │ 43,250 │      125 │  2,650 │     2,996 │     3,120 ║
╟────────────────────────┼────────┼──────────┼────────┼───────────┼───────────╢
║ Mithril battleaxe      │ 35,625 │      125 │    605 │       890 │     1,014 ║
╟────────────────────────┼────────┼──────────┼────────┼───────────┼───────────╢
║ Green d'hide body      │ 31,875 │      125 │  4,301 │     4,556 │     4,680 ║
╟────────────────────────┼────────┼──────────┼────────┼───────────┼───────────╢
║ Adamant plateskirt (t) │ 29,688 │        8 │      5 │     3,716 │     3,840 ║
╟────────────────────────┼────────┼──────────┼────────┼───────────┼───────────╢
║ Adamant full helm      │ 29,125 │      125 │  1,755 │     1,988 │     2,112 ║
╚════════════════════════╧════════╧══════════╧════════╧═══════════╧═══════════╝
```

## Tech

- Inquirer (CLI input)
- Puppeteer (Fetch dynamic HTML)
- JSDOM (Web scraping)
- Numeral (Currency formatting)
- Table (Output formatting)
