import { createReadStream, existsSync, readFileSync, statSync, writeFileSync } from 'fs';
import { Task } from './task.interface';

export class Task3 implements Task {

    constructor(private task1Result: string, private task2Result: string, private task3Result: string) {
    }

    async run(): Promise<void> {
        if (existsSync(this.task3Result) && statSync(this.task3Result).size > 0) {
            const result = readFileSync(this.task3Result, 'utf8').trim();
            console.log('Task3 result already exists:', this.task3Result);
            console.log('Task3 Ergebnis (Summe Ziffern + Vokale):', result);
            return;
        }
        
        if (!existsSync(this.task1Result) || !(statSync(this.task1Result).size > 0)) {
            console.log('Task3 result cannot be computed because Task1 result is missing or empty.');
            process.exit(1);
            return;
        }

        if (!existsSync(this.task2Result) || !(statSync(this.task2Result).size > 0)) {
            console.log('Task3 result cannot be computed because Task2 result is missing or empty.');
            process.exit(1);
            return;
        }

        const vowelValues: Record<string, number> = {
            a: 2, e: 4, i: 8, o: 16, u: 32
        };

        const task2Sum = parseInt(readFileSync(this.task2Result, 'utf8').trim(), 10);
        const stream = createReadStream(this.task1Result, { encoding: 'utf8', highWaterMark: 64 * 1024 });
        let vowelSum = 0;

        await new Promise<void>((resolve, reject) => {
            stream.on('data', (chunk: string) => {
                for (const ch of chunk) {
                    const lower = ch.toLowerCase();
                    if (lower in vowelValues) {
                        vowelSum += vowelValues[lower];
                    }
                }
            });

            stream.on('end', () => {
                const total = task2Sum + vowelSum;
                writeFileSync(this.task3Result, String(total), 'utf8');
                console.log('Task3 Ergebnis (Summe Ziffern + Vokale):', total);
                resolve();
            });

            stream.on('error', (err) => {
                console.error('Error reading file:', err);
                reject(err);
            });
        });
    }
}
