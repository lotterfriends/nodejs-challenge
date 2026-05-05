import { existsSync, readFileSync, statSync, writeFileSync } from 'fs';
import { Task } from './task.interface';

export class Task4b implements Task {

    constructor(private task4aResult: string, private task4bResult: string) {
    }

    async run(): Promise<void> {

        if (!existsSync(this.task4aResult) || !(statSync(this.task4aResult).size > 0)) {
            console.log('Task4b result cannot be computed because Task4a result is missing or empty.');
            process.exit(1);
            return;
        }
        const result = readFileSync(this.task4aResult, 'utf8').trim();
        const parsedResult = JSON.parse(result);
        if (Array.isArray(parsedResult)) {
            const solution =  (parsedResult as number[]).map(e => String.fromCharCode(e)).join('');
            writeFileSync(this.task4bResult, solution, 'utf8');
            console.log('Task4b Ergebnis:', solution);
            return Promise.resolve();
        }
        return Promise.reject();
    }
}
