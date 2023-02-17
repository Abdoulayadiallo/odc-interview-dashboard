import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Critere } from '../Model/critere';

@Injectable({
  providedIn: 'root'
})
export class CritereService {
  public host = environment.host;
  public clientHost = environment.client;

  constructor(private http:HttpClient) { }

  getAllCritere(): Observable<Critere[]> {
    return this.http.get<Critere[]>(`${this.host}/critere/list`);
  }
  AjouterCritere(critere: Critere): Observable<HttpErrorResponse | HttpResponse<any>> {
    return this.http.post<HttpErrorResponse | HttpResponse<any>>(`${this.host}/critere/add`, critere);
  }
}
