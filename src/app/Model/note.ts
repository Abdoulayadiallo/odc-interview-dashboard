import { Critere } from "./critere";
import { Participant } from "./participant";
import { Question } from "./question";

export class Note {
    id: number;
    point: number;
    commentaire: string;
    critere: Critere[];
    participant: Participant[];
}
