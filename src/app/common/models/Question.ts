import { Category } from './Category';

export class Question {
    id: number;
    description: String;
    correctAnswer: String;
    image: String;
    category: Category;
    demo: boolean;
    additional: boolean;
}