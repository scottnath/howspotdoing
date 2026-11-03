# Pixel-art favicon: yellow mask drawn by hand, black outline generated (8-neighbour).
# Requires Pillow (pip install pillow).
# Usage: python3 pixel.py art.txt out.png [scale]
import sys
from PIL import Image

Y, K = (0xfe, 0xe0, 0x3c, 255), (0, 0, 0, 255)
rows = [r for r in open(sys.argv[1]).read().split('\n') if r and not r.startswith('#')]
h, w = len(rows), max(len(r) for r in rows)
grid = [[c for c in r.ljust(w, '.')] for r in rows]
yellow = {(x, y) for y in range(h) for x in range(w) if grid[y][x] == 'Y'}
black = {(x, y) for y in range(h) for x in range(w) if grid[y][x] == 'K'}  # hand-placed black
for (x, y) in yellow:
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            p = (x + dx, y + dy)
            if p not in yellow and 0 <= p[0] < w and 0 <= p[1] < h and grid[p[1]][p[0]] != 'o':  # 'o' = force empty
                black.add(p)
im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
for p in black: im.putpixel(p, K)
for p in yellow: im.putpixel(p, Y)
im.save(sys.argv[2])
