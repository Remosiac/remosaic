# Remosaic

A flexible color-memory picture puzzle. Flash piece colors, match sets, and unlock the art underneath.

**Play online:** [https://remosiac.github.io/remosaic/](https://remosiac.github.io/remosaic/)  
(Works on iPhone Safari — use Share → Add to Home Screen for an app-like icon.)

Or open `index.html` locally — no install or server required.

## Deploy (GitHub Pages)

This repo is set up for **GitHub Pages** from the `main` branch root:

1. Repo **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `/ (root)`
4. Save — site goes live at `https://remosiac.github.io/remosaic/`

## Modes

| Mode | Description |
|------|-------------|
| **Classic** | 25-level campaign; new shapes at 3, 7, 10, 15, 20, 25 |
| **Kids** | Longer flashes, ghost tints, extra peeks, no focus pressure |
| **Challenge** | Faster flashes, fewer peeks, more focus levels |
| **Daily** | One seeded puzzle per calendar day (same layout for everyone) |
| **Endless** | Infinite waves; boards grow and timings tighten |
| **Your photo** | Upload (or drag-and-drop) an image to hide under the mosaic |

## How to play

1. Click pieces to flash their color (and pattern, if enabled).
2. Collect a full set of the same color (pairs / triples / quads).
3. Matched pieces clear and reveal the picture.
4. Clear the board to unlock the image.

### Level twists

- **Preview** — brief full-board flash at start  
- **Ghost** — faint color linger after a flash  
- **Focus** — one color at a time (new color drops the old partial)  
- **Peeks** — limited show-all (`Peek` button or **P**)  
- **Match size** — 2 / 3 / 4 of a kind  
- **2-in-a-row streak** — hit the same color on two consecutive clicks. Switch before that and your **last fully solved color** returns to the board. Only that one color comes back (not the whole board). Solving a newer color locks the previous one in.

### Settings (⚙)

- **Sound** — soft blips  
- **Haptics** — vibrate on match (supported phones)  
- **Color patterns** — stripes, dots, grids (colorblind-friendly)  
- **Count marks** — dots on pieces already counted  

Settings save in `localStorage`. Daily best moves and endless best wave are saved too.

### Keys

- **P** — peek  
- **R** — restart level / wave  

## Files

- `index.html` — screens & layout  
- `styles.css` — theme, patterns, modes  
- `game.js` — modes, matching, art, photo, daily seed  

## Privacy

Photos stay in the browser session only (object URL). Nothing is uploaded to a server.
