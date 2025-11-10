# PWA Icons

This directory should contain PWA icons for mobile installation.

## Required Icon Sizes

Generate the following icon sizes from your base Fishy logo:

- icon-16x16.png
- icon-32x32.png
- icon-72x72.png
- icon-96x96.png
- icon-120x120.png (iOS)
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png (iOS)
- icon-180x180.png (iOS)
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Icon Design Guidelines

- **Style**: 8-bit pixel art matching the Fishy brand
- **Background**: Transparent or ocean blue (#8bcfcf)
- **Content**: Simple fish character or "FISHY" text in pixel font
- **Safe Area**: Leave 10% padding around edges for iOS masking
- **Format**: PNG with transparency

## Tools for Icon Generation

1. **Online Tools**:
   - https://realfavicongenerator.net/
   - https://www.pwa-manifest-generator.com/

2. **Command Line**:
   ```bash
   # Using ImageMagick
   convert logo.png -resize 192x192 icon-192x192.png
   convert logo.png -resize 512x512 icon-512x512.png
   ```

3. **Design Software**:
   - Aseprite (pixel art)
   - GIMP
   - Photoshop

## Temporary Placeholder

Until custom icons are created, you can use one of the game's existing fish sprites
from `/assets/player/skins/` as a temporary placeholder.

## Testing

After adding icons:
1. Build the web version: `just build-web`
2. Test manifest: Chrome DevTools > Application > Manifest
3. Verify icons appear in install prompt
4. Test on actual mobile device
