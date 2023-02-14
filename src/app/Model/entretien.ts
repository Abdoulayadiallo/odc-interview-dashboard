import { Critere } from "./critere";
import { Etat } from "./etat";

export class Entretien {
    id: number;
    entretienNom: string;
    description: string;
    etat: Etat;
    dateDebut: string;
    dateFin: string;
    dateCreation: string;
    nombreParticipant: number;
    critereList: Critere[];
}
