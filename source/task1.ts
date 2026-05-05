import { createDecipheriv } from 'crypto';
import { readFileSync, createWriteStream, existsSync, statSync } from 'fs';
import { join } from 'path';
import { createGunzip } from 'zlib';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { Task } from './task.interface';


export class Task1 implements Task {


    constructor(private dir: string, private task1Result: string) {
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

    private async extract(decrypted: Buffer<ArrayBuffer>) {
      // GZIP-Dateien müssen per Streaming entpackt werden um  die große Datei verarbeiten zu können
      const gunzip = createGunzip();
      const source = Readable.from(decrypted);
      const dest = createWriteStream(this.task1Result);

      console.log('Decompressing to', this.task1Result, '...');
      await pipeline(source, gunzip, dest);
      console.log('Decompression complete:', this.task1Result);
    }

    public async run(): Promise<void> {
      if (existsSync(this.task1Result) && statSync(this.task1Result).size > 0) {
        console.log('Output file already exists:', this.task1Result);
        return;
      }
      const decrypted = this.decryp();
      await this.extract(decrypted);
    }
}