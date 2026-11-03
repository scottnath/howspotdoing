# Favicon sources

The icon is the site title's question mark with the cannabis-leaf dot (`src/components/SiteTitle.astro`).

- `pixel-16.txt`, `pixel-32.txt`: hand-drawn pixel art for browser-tab sizes. `Y` is yellow, `K` forces black, `o` forces transparent; the 1px black outline is added automatically. Shrinking the vector mark this small blurs it, so these are drawn on the pixel grid.
- `mark.svg`: the detailed vector mark, used for 96px and larger (apple-touch and Windows tile sizes get a white background and 10% padding).

Regenerate the tab sizes:

```sh
python3 utils/favicon/pixel.py utils/favicon/pixel-16.txt public/favicons/favicon-16x16.png
python3 utils/favicon/pixel.py utils/favicon/pixel-32.txt public/favicons/favicon-32x32.png
```

`favicon.ico` holds 16, 32 and 48 (the 16 art tripled, nearest-neighbour); copy it to both `public/favicons/` and `public/`.
