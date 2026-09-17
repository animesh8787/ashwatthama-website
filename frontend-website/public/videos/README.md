# Demo video

Drop your video file here as:

```
public/videos/demo.mp4
```

That's it — no code changes needed. The Demo section (`components/sections/demo.tsx`)
already points at this path. Until the file exists, the section falls back to the
"Demo Coming Soon" placeholder automatically.

An optional poster image (shown before the video loads/plays) can go at:

```
public/videos/demo-poster.jpg
```

## Format & size guidance

- **Format:** `.mp4` (H.264 video + AAC audio) — plays natively in every browser
  without extra libraries.
- **Size:** keep it under ~20–30 MB if possible. This is a static-export site
  deployed via git — large binary files bloat the repo and slow down every
  future `git clone`/deploy, and GitHub warns above 50 MB and hard-blocks above
  100 MB per file.
- **Compress with ffmpeg** (free, cross-platform) if your source file is larger:

  ```bash
  ffmpeg -i your-source-video.mov -vcodec h264 -acodec aac -crf 28 -vf "scale=1920:-2" public/videos/demo.mp4
  ```

  - `-crf 28` — quality/size tradeoff (lower = better quality, bigger file; 23–28 is a good range for a marketing demo)
  - `-vf "scale=1920:-2"` — caps resolution at 1080p, which is plenty for a page video and cuts file size a lot if your source is 4K

- **If your video is longer than a couple of minutes or won't compress under
  ~30 MB**, self-hosting isn't the right fit — better to upload it to YouTube
  (unlisted works fine) or a video CDN (Vimeo, Cloudflare Stream, Mux) and
  embed that instead. Ask to switch the Demo section to an embed if you end up
  needing this.
