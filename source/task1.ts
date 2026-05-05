import { createDecipheriv } from 'crypto';
import { readFileSync, createWriteStream } from 'fs';
import { join } from 'path';
import { createGunzip } from 'zlib';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { BaseTask } from './base-task';


export class Task1 extends BaseTask {

    protected taskName = 'Task1';

    constructor(private dir: string, private task1Result: string) {
        super();
    } 
  
    private decrypt(): Buffer {
      const key = readFileSync(join(this.dir, 'secret.key'), 'utf8').trim();
      const iv = readFileSync(join(this.dir, 'iv.txt'));
      const authTag = readFileSync(join(this.dir, 'auth.txt'));
      const encrypted = readFileSync(join(this.dir, 'secret.enc'));

      const keyBuffer = Buffer.from(key.substring(0, 32), 'utf8');
      const decipher = createDecipheriv('aes-256-gcm', keyBuffer, iv);
      decipher.setAuthTag(authTag);

      const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
      console.log('Decryption successful. Decrypted size:', decrypted.length);
      return decrypted;
    }

    private async decompress(decrypted: Buffer): Promise<void> {
      const gunzip = createGunzip();
      const source = Readable.from(decrypted);
      const dest = createWriteStream(this.task1Result);

      console.log('Decompressing to', this.task1Result, '...');
      await pipeline(source, gunzip, dest);
      console.log('Decompression complete:', this.task1Result);
    }

    public async run(): Promise<void> {
      if (this.resultExists(this.task1Result)) {
        console.log('Output file already exists:', this.task1Result);
        return;
      }
      const decrypted = this.decrypt();
      await this.decompress(decrypted);
    }
}