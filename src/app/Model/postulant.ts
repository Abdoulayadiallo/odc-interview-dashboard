import { Participant } from "./participant";

export class Postulant {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    numero: string;
    genre: string;
    numeroMTCL: string;
    resultatFinal: number;
    noteFinal: string;
    rang: number;
    decisionFinal: string;
    commentaireFinal: string;
    dateCreation: Date
    participant: Participant[];
}
