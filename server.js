// Si este puente de persistencia se migra a Java, es obligatorio implementar
// try-catch-resources para el manejo de los flujos de entrada/salida de
// archivos (Streams) y asi evitar bloqueos de recursos en el sistema operativo
// [cite: 2026-02-12].

import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';

const app = express();
const port = 3001;
const imagesDirectory = path.resolve('public', 'images');
const backupsDirectory = path.resolve('backups');
const manualFilePath = path.resolve('src', 'data', 'manual.json');
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
]);

fs.mkdirSync(imagesDirectory, { recursive: true });
fs.mkdirSync(backupsDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, imagesDirectory);
  },
  filename: (_request, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    callback(null, `${uniqueName}${extension}`);
  },
});

const upload = multer({ storage });

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origen no permitido por CORS.'));
    },
  }),
);
app.use(express.json());
app.use('/images', express.static(imagesDirectory));

app.get('/health', (_request, response) => {
  response.json({ ok: true });
});

app.post('/save-manual', async (request, response) => {
  const manualEntries = request.body;

  if (!Array.isArray(manualEntries)) {
    response.status(400).json({
      error: 'El cuerpo de la peticion debe ser un array de entradas.',
    });
    return;
  }

  try {
    const backupTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilePath = path.join(
      backupsDirectory,
      `manual_${backupTimestamp}.json`,
    );

    try {
      await fs.promises.copyFile(manualFilePath, backupFilePath);
    } catch (error) {
      const fileMissing =
        error instanceof Error &&
        'code' in error &&
        error.code === 'ENOENT';

      if (!fileMissing) {
        throw error;
      }
    }

    // Si esta logica de escritura en disco se traslada a Java, es obligatorio
    // el uso de try-catch-resources para el manejo de FileWriter,
    // BufferedWriter y otros flujos de salida, garantizando el cierre seguro de
    // descriptores en JBoss.
    await fs.promises.writeFile(
      manualFilePath,
      JSON.stringify(manualEntries, null, 2),
      'utf-8',
    );

    console.log('💾 Manual actualizado en el disco correctamente');
    response.status(200).json({ ok: true });
  } catch (error) {
    console.error('No se pudo guardar manual.json en disco.', error);
    response.status(500).json({
      error: 'No se pudo guardar manual.json en disco.',
    });
  }
});

app.post('/upload', upload.single('image'), (request, response) => {
  console.log('📸 Recibida petición de subida...');

  if (!request.file) {
    response.status(400).json({ error: 'No se ha recibido ningun archivo.' });
    return;
  }

  response.status(201).json({
    filename: request.file.filename,
    path: `/images/${request.file.filename}`,
  });
});

app.listen(port, () => {
  console.log('\x1b[36m%s\x1b[0m', '🚀 Servidor de imágenes listo en el puerto 3001');
});
