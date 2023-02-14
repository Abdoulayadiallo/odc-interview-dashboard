import { Utilisateur } from "./utilisateur";

export class JuryResponse {
    contenu: Utilisateur[];
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    Keyword: number;
    pourcentage: number;
    nombreParGenre: number;
    totalListe: number;
}