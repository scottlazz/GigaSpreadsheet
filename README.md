<h1 align="center">
  <b>Giga Sheet</b>
</h1>
<p align="center">An open source canvas-based spreadsheet application that doesn't suck

# Demo
[https://scottlazz.github.io/GigaSpreadsheet/](https://scottlazz.github.io/GigaSpreadsheet/)

## Features

-   **It scales to millions of rows**. Only cells on screen are drawn for memory efficiency.
-   **Scrolling is extremely fast at any zoom level**. Renderer specially built for the smoothest possible experience.
-   **Formula support**.
-   **Multiple tabs**.
-   **Resizable rows and columns**.
-   **Merged cells**.
-   **Single and multi-select rows, cells, and columns**.
-   **Minimal dependencies**. Written in pure JavaScript / TypeScript for maximum performance
-   **📡 Real-Time Market Data**. - Live ticking stock prices (e.g., =GME displays real-time GameStop stock price)

# ⚡ Quick Start

First clone the repo then run `npm install` then `npm start` to start the project

The spreadsheet can be configured in `app.ts`
```ts
    const giga = new Giga('grid-wrapper', [{
        gridlinesOn: true,
        subscribeFinance: true,
        mergedCells: [{ startRow: 1, startCol: 1, endRow: 10, endCol: 8 }],
        initialCells: [{
            row: 1, col: 1, text: 'abc'
        }]
    }]);
```

# FAQ

**Why doesn't it use React?**

I didn't want to add unnecessary complexity. A spreadsheet application doesn't seem like a good candidate to use React.
Plus, I don't want the overhead of a virtual DOM.

**Can I install it into my project?**

Soon

**Does it do sorting, searching, or column freezing?**

Not at the moment but eventually!

**Will it support custom html cells?**

My renderer can draw HTML elements over the canvas, so it will be possible to add this feature in the future

**How is it different from Glide Data Grid or any other open source grid?**

My renderer was specially designed for a smooth scrolling experience, even when tens of thousands of cells are shown on screen at once.
The alternatives don't come close.
Glide seems impressive until you zoom all the way out with hardware acceleration turned off and try to use the scrollbar or make a selection.
Mine is lacking many of the features of the other more established options however.
