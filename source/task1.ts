import { createDecipheriv } from 'crypto';
import { readFileSync, createWriteStream } from 'fs';
import { join } from 'path';
import { createGunzip } from 'zlib';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';


export class Task1 {

    private dir: string;

    constructor(dir: string)  {
      this.dir = dir;
    } 
  
    private decryp() {
      // Read decryption parameters
      const key = readFileSync(join(this.dir, 'secret.key'), 'utf8').trim();
      const iv = readFileSync(join(this.dir, 'iv.txt'));
      const authTag = readFileSync(join(this.dir, 'auth.txt'));
      const encrypted = readFileSync(join(this.dir, 'secret.enc'));

      // Decrypt using AES-256-GCM with key as 32-char string
      const keyBuffer = Buffer.from(key.substring(0, 32), 'utf8');
      const decipher = createDecipheriv('aes-256-gcm', keyBuffer, iv);
      decipher.setAuthTag(authTag);

      const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
      console.log('Decryption successful. Decrypted size:', decrypted.length);
      return decrypted;
    }

    private extract(decrypted: Buffer<ArrayBuffer>) {
      // GZIP-Dateien müssen per Streaming entpackt werden um  die große Datei verarbeiten zu können
      const outputPath = join(this.dir, 'output.txt');
      const gunzip = createGunzip();
      const source = Readable.from(decrypted);
      const dest = createWriteStream(outputPath);

      console.log('Decompressing to', outputPath, '...');
      pipeline(source, gunzip, dest).then(() => {
        console.log('Decompression complete:', outputPath);
      }).catch((err) => {
        console.error('Decompression failed:', err);
      });

    }

    public run(): void {
        const decrypted = this.decryp();
        this.extract(decrypted);
    }
}