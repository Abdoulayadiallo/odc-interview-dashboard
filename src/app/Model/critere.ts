import { Entretien } from "./entretien";

export class Critere {
    id: number;
    critereNom: string;
    barem: string;
    elimination: boolean;
    entretien: Entretien; 
}
