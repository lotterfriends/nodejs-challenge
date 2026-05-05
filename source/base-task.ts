import { createReadStream, existsSync, readFileSync, statSync, writeFileSync } from 'fs';
import { Task } from './task.interface';

export abstract class BaseTask implements Task {

    protected abstract taskName: string;

    protected resultExists(filePath: string): boolean {
        return existsSync(filePath) && statSync(filePath).size > 0;
    }

    protected readResult(filePath: string): string {
        return readFileSync(filePath, 'utf8').trim();
    }

    protected writeResult(filePath: string, content: string): void {
        writeFileSync(filePath, content, 'utf8');
    }

    protected checkDependency(filePath: string, dependencyName: string): void {
        if (!this.resultExists(filePath)) {
            console.log(`${this.taskName} cannot be computed because ${dependencyName} result is missing or empty.`);
            process.exit(1);
        }
    }

    protected streamFile(filePath: string, onChunk: (chunk: string) => void): Promise<void> {
        const stream = createReadStream(filePath, { encoding: 'utf8', highWaterMark: 64 * 1024 });
        return new Promise<void>((resolve, reject) => {
            stream.on('data', (chunk: string) => onChunk(chunk));
            stream.on('end', () => resolve());
            stream.on('error', (err) => {
                console.error('Error reading file:', err);
                reject(err);
            });
        });
    }

    abstract run(): Promise<void>;
}
