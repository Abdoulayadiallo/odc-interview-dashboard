import { Critere } from "./critere";

export class CritereResponse {
    contenu: Critere[];
    pageNo:number;
    pageSize: number;
    totalElements: number;
    totalPages:number ;
    last: false
}
