import { Entretien } from "./entretien";

export class Entretienresponse {
    contenu: Entretien[];
    pageNo:number;
    pageSize: number;
    totalElements: number;
    totalPages:number ;
    last: boolean
}
