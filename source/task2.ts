import { createReadStream, existsSync, readFileSync, statSync, writeFileSync } from 'fs';
import { Task } from './task.interface';

export class Task2 implements Task {


    constructor(private task1Result: string, private task2Result: string) {
    }

    run(): void {
        if (existsSync(this.task2Result) && statSync(this.task2Result).size > 0) {
            const result = readFileSync(this.task2Result, 'utf8').trim();
            console.log('Task2 result already exists:', this.task2Result);
            console.log('Summe aller Ziffern:', result);
            return;
        }

        const stream = createReadStream(this.task1Result, { encoding: 'utf8', highWaterMark: 64 * 1024 });
        let sum = 0;

        stream.on('data', (chunk: string) => {
            for (const ch of chunk) {
                if (ch >= '0' && ch <= '9') {
                    sum += ch.charCodeAt(0) - 48;
                }
            }
        });

        stream.on('end', () => {
            writeFileSync(this.task2Result, String(sum), 'utf8');
            console.log('Summe aller Ziffern:', sum);
        });

        stream.on('error', (err) => {
            console.error('Error reading file:', err);
        });
    }
}