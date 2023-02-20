import {Participant} from "../Model/participant"
import { Entretien } from "./entretien";
export class Utilisateur {
    id: number;
    image: string;
    nom: string;
    prenom: string;
    email: string;
    username: string;
    numero: string;
    genre: string;
    bio: string;
    dateCreation: Date;
    participant: Participant;
    role:role 
    entretien:Entretien
}

export class role{
    id: number;
    roleName: string
}