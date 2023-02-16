import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
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
  UploadPostulant(idEntretien: number,file:File): Observable<HttpErrorResponse | HttpResponse<any>> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<HttpErrorResponse | HttpResponse<any>>(`${this.host}/postulant/upload/${idEntretien}`,fd);
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
}
