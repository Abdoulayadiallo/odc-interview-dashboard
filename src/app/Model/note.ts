import { Critere } from "./critere";
import { Participant } from "./participant";
import { Postulant } from "./postulant";
import { Question } from "./question";
import { Utilisateur } from "./utilisateur";

export class Note {
    id: number;
    point: number;
    commentaire: string;
    critere: Critere;
    postulant: Postulant;
    utilisateur: Utilisateur;
}
