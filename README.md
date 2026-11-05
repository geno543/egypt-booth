# Egypt booth: Egypt Passport game

A bilingual (English / 中文) game for the Egypt booth at the university culture festival.
Visitors scan a QR code, open an "Egypt passport", travel down the Nile and play five 20-second
mini-games. Each win stamps their passport. Five stamps unlock a gift ticket they show at the booth.

| Stop | Place | Mini-game | What they learn |
|---|---|---|---|
| 1 | Alexandria | Match Egyptian words to their meanings | Ahlan, Yalla, Ma'lesh, Inshallah… |
| 2 | Cairo | Build a koshari as the cook shouts each layer in Arabic | The national dish and its layers |
| 3 | Khan el-Khalili | Roll 3D dice and call them the tawla way | "Shesh besh!" and the ahwa |
| 4 | Al-Moez Street | Tap the flickering Ramadan lanterns to light them | Fanous and Ramadan nights |
| 5 | Aswan | Steer a felucca past rocks, catch hibiscus flowers | Feluccas, Nubia, karkadeh |

Most players will know nothing about Egypt, so every stop follows **learn, play, remember**:
a short lesson with a real photo before the game, teaching inside the game (study cards, layer names,
a Ramadan word on every lantern), and a "You learned" card after it. The finale ends with
"What you now know about Egypt".

Then a "Mabrouk!" celebration (spinning tanoura, confetti) and the gift ticket.
The whole thing takes about 3 minutes. Everyone who finishes gets a gift; stars only decide
whether they get to choose.

There is also a reading page, `guide.html` (the "Egypt guide"), with the food, words, feasts,
arts and map of Egypt. The game links to it.

No build step, no frameworks, no outside servers. Fonts, photos, icons and sounds all live in
this folder (sounds are generated in the browser), so it also works in mainland China.

## Files

```
index.html                  the game
guide.html                  the Egypt guide (reading page)
poster.html                 printable QR poster for the booth table
assets/css/game.css         game styling
assets/css/style.css        guide styling
assets/js/game-content.js   GAME TEXT in English and Chinese (stops, mini-game words, messages)
assets/js/game.js           game engine: passport, Nile map, stamps, sound, gift ticket
assets/js/minigames.js      the five mini-games
assets/js/content.js        event settings + guide text in English and Chinese
assets/js/app.js            guide behaviour
assets/js/icons.js          the custom icon set (no emoji)
assets/js/qr.js             QR code maker used by the poster
assets/img/                 photos, plus credits.json with photographer and license for each
assets/fonts/               Archivo (Latin) and Aref Ruqaa (Arabic) font files
```

## Before the event: change these

Open `assets/js/content.js` and edit the `config` block at the top:

```js
event:      { en: 'International Culture Festival', zh: '国际文化节' },
booth:      { en: 'Egypt booth', zh: '埃及展位' },
university: { en: 'Your University', zh: '你的大学' },
```

In `assets/js/game-content.js`, `perfectStars: 13` is how many stars (out of 15) earn
"free choice of gift". Lower it if you have plenty of the good gifts.

## Try it on your computer

Double-click `index.html`. Everything works offline, including sound and the gift ticket.

## Put it online

Any static host works. Upload the whole folder.

- **Netlify Drop**: go to app.netlify.com/drop and drag the folder in. You get a link in seconds.
- **Vercel**: `npm i -g vercel`, then run `vercel` inside this folder.
- **GitHub Pages**: push the folder to a repository, then Settings > Pages > Deploy from branch.

**If your university is in mainland China**, test the final link on a Chinese phone using mobile data
(not campus Wi-Fi with a VPN) a few days before the event. `vercel.app` links are often blocked there.
`github.io` and `netlify.app` usually load. A Chinese cloud host (Alibaba Cloud OSS, Tencent COS) is the most reliable.

The `og:image` line in `index.html` and `guide.html` points to
`https://geno543.github.io/egypt-booth/assets/img/hero-fanous.jpg`, so shared links show the lantern photo.
Change it if the site ends up at a different address.

## Useful links

- `your-link/` opens the game (the QR code should point here)
- `your-link/?lang=zh` or `?lang=en` forces Chinese or English
- `your-link/?reset` wipes the progress on that phone (for staff demo phones)
- `your-link/guide.html` opens the Egypt guide

Without `?lang`, the game picks Chinese automatically when the phone's language is Chinese.
Progress is saved on the phone, so a visitor who closes the page can carry on later.

## Printing the QR poster

`poster.html` makes a bilingual A4 poster with a QR code that opens the game (the site root).

1. Put the site online first. The poster warns you if you type a `localhost` link.
2. Open `poster.html`, paste your public link, and optionally force Chinese or English.
3. Click **Print / Save as PDF**: A4, margins **None**, **Background graphics** on.
   For a bigger poster, print the PDF on A3 with "Fit to page".
4. Test the printed code with an iPhone, an Android phone and WeChat's scanner before the event.

Booth and event names come from `config` in `assets/js/content.js`. The QR code is made inside
the page by `assets/js/qr.js`, so it needs no internet connection.

## How the gift ticket works (for booth staff)

1. After the fifth stamp, the visitor gets a **gift ticket** with a code like `EG-7K4Q`,
   their name (if they typed one), their stars out of 15 and the time.
2. The star on the right of the ticket keeps turning and the clock ticks every second.
   **A screenshot will not move**, so check the star is turning.
3. A high score says "Top score: free choice of gift". Let them pick any gift.
4. Staff **press and hold** the dashed button under the ticket for about one second.
   The ticket gets a green REDEEMED stamp and the time of the gift.
5. Each phone keeps one ticket. Replaying stops does not create a new one.

## Photos

Every photo is listed with its author and license in `assets/img/credits.json`, and the guide shows
the credits in its footer under "Photo credits". To use your own booth photos, replace a file in
`assets/img/` with one that has the same name (landscape, about 1600 px wide, under 400 KB).
