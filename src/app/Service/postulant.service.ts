import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NombreResponse } from '../Model/nombre-response';
import { Postulant } from '../Model/postulant';
import { Postulantresponse } from '../Model/postulantresponse';

@Injectable({
  providedIn: 'root'
})
export class PostulantService {

  public host = environment.host;
  public clientHost = environment.client;

  constructor(private http: HttpClient) { }

  getOnePostulantById(postId: number): Observable<Postulant> {
    return this.http.get<Postulant>(`${this.host}/postulant/${postId}`);
  }
  UploadPostulant(idEntretien: number,file:File): Observable<HttpErrorResponse | HttpResponse<any>|any> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post(`${this.host}/postulant/upload/${idEntretien}`,fd, { responseType: 'text' });
  }

  getAllPostulant(pageNo: number = 0, pageSize: number = 10, sortBy: string = "", sortDir: string = "", genre: string = "", nom: string = ""): Observable<Postulantresponse> {
    return this.http.get<Postulantresponse>(`${this.host}/postulant/list?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}&genre=${genre}&nom=${nom}`);
  }
  getAllPostulantByEntretien(idEntretien: number, pageNo: number = 0, pageSize: number = 10, sortBy: string = "", sortDir: string = "", genre: string = "", keyword: string = ""): Observable<Postulantresponse> {
    return this.http.get<Postulantresponse>(`${this.host}/postulant/list/PostulantEntretien/${idEntretien}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}&genre=${genre}&keyword=${keyword}`);
  }
  getAllPostulantNombre( genre: string = ""): Observable<NombreResponse> {
    return this.http.get<NombreResponse>(`${this.host}/postulant/nombreGenre/${genre}`);
  }

  getOnePostulantParGenre(idEntretien: number, genre: string): Observable<NombreResponse> {
    return this.http.get<NombreResponse>(`${this.host}/postulant/nombreGenre/${idEntretien}/${genre}`);
  }
  deletePostulant(id:number): Observable<HttpErrorResponse | HttpResponse<any>|any> {
    return this.http.delete(`${this.host}/postulant/delete/${id}`,{
      responseType: 'text'
    });
  }
  DownloadPostulant(id:number): Observable<Blob> {
    return this.http.get(`${this.host}/postulant/download/${id}`,{
      responseType: 'blob'
    });
  }
  DownloadAllPostulant(): Observable<Blob> {
    return this.http.get(`${this.host}/postulant/download`,{
      responseType: 'blob'
    });
  }
  getAllPostulantByJury(idJury: number, pageNo: number = 0, pageSize: number = 10, sortBy: string = "", sortDir: string = "", keyword: string = ""): Observable<Postulantresponse> {
    return this.http.get<Postulantresponse>(`${this.host}/postulant/list/utilisateur/${idJury}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}&keyword=${keyword}`);
  }
  accepterPostulant(idPostulant: number, commentaireFinal: string) {
    const body = JSON.stringify(commentaireFinal).replace(/"/g, '');
    return this.http.post(`${this.host}/postulant/accepter/${idPostulant}`, body);
  }
  RefuserPostulant(idPostulant: number, commentaireFinal: string) {
    const body = JSON.stringify(commentaireFinal).replace(/"/g, '');
    return this.http.post(`${this.host}/postulant/refuser/${idPostulant}`, body);
  }
  MettreEnAttentePostulant(idPostulant: number, commentaireFinal: string) {
    const body = JSON.stringify(commentaireFinal).replace(/"/g, '');
    return this.http.post(`${this.host}/postulant/enattente/${idPostulant}`, body);
  }
}
