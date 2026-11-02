import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-music-assets',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && (req.url.startsWith('/music/') || req.url.startsWith('/audio/'))) {
            const filename = path.basename(req.url.split('?')[0]);
            // Check public/audio, music, or fallback track-N.mp3 mapping
            const candidatePaths = [
              path.resolve('public/audio', filename),
              path.resolve('music', filename),
              path.resolve('music', filename.replace(/^track-/, '')),
              path.resolve('public/audio', filename.replace(/^track-/, '')),
            ];

            for (const filePath of candidatePaths) {
              if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                const stat = fs.statSync(filePath);
                const fileSize = stat.size;
                const range = req.headers.range;

                if (range) {
                  const parts = range.replace(/bytes=/, '').split('-');
                  const start = parseInt(parts[0], 10);
                  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                  const chunksize = (end - start) + 1;
                  const fileStream = fs.createReadStream(filePath, { start, end });

                  res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'audio/mpeg',
                  });
                  fileStream.pipe(res);
                  return;
                } else {
                  res.writeHead(200, {
                    'Content-Length': fileSize,
                    'Content-Type': 'audio/mpeg',
                    'Accept-Ranges': 'bytes',
                  });
                  fs.createReadStream(filePath).pipe(res);
                  return;
                }
              }
            }
          }
          next();
        });
      }
    }
  ],
})
