Place the cat image file here so the site can use it as the flip-card back image.

Target path (relative to the repo root):

`assets/cat.jpg`

Recommended steps (macOS / Linux):

1. Save or download the image to your local machine (for example, `~/Downloads/cat.jpg`).
2. From the repo root, move the file into the `assets` folder:

```bash
# from repo root
mv ~/Downloads/cat.jpg assets/cat.jpg
```

3. (Optional) Resize the image to a reasonable width to save bandwidth. Example: resize to max dimension 1200px using `sips` (macOS):

```bash
# resize preserving aspect ratio, max width/height 1200px
sips -Z 1200 ~/Downloads/cat.jpg --out assets/cat.jpg
```

Or with ImageMagick (`convert`):

```bash
convert ~/Downloads/cat.jpg -resize 1200x1200\> assets/cat.jpg
```

4. Verify the file exists:

```bash
ls -lh assets/cat.jpg
```

5. (Optional) Commit the image to Git:

```bash
git add assets/cat.jpg
git commit -m "Add cat back image for profile flip card"
git push
```

Notes:
- The web page also supports selecting a local image in-browser using the folder icon on the profile image — no repo changes required when using that.
- Keep the filename exactly `cat.jpg` (lowercase) so the page loads it automatically.
- If you'd like, I can add an optimized copy and commit it for you once you paste the file into `assets/`.
