import { Question } from "./question";

export class Critere {
    id: number;
    critereNom: string;
    barem: string;
    elimination: boolean;
    questionList: Question[]; 
}
