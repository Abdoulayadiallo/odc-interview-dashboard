import { Entretien } from "./entretien";
import { Notification } from "./notification";
import { Utilisateur } from "./utilisateur";

export class Participant {
        id: number;
        nom: string;
        prenom: string;
        email: string;
        status: string;
        notifications: Notification[];
        utilisateurs: Utilisateur[];
        entretien: Entretien;
}
