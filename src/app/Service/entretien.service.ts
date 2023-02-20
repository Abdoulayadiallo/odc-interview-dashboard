import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Entretien } from '../Model/entretien';
import { Entretienresponse } from '../Model/entretienresponse';

@Injectable({
  providedIn: 'root'
})
export class EntretienService {
  public host = environment.host;
  public imageentretien = `${this.host}/image/interview/`
  public clientHost = environment.client;
  constructor(private http:HttpClient) { }
  
  AjouterEntretien(entretien: Entretien): Observable<HttpErrorResponse | HttpResponse<any>|any> {
    return this.http.post<any | HttpErrorResponse | HttpResponse<any>>(`${this.host}/entretien/add`, entretien);
  }
  ModifierEntretien(id:number,entretien: Entretien): Observable<HttpErrorResponse | HttpResponse<any>> {
    return this.http.put<HttpErrorResponse | HttpResponse<any>>(`${this.host}/entretien/update/${id}`, entretien);
  }
  deleteEntretien(id:number): Observable<HttpErrorResponse | HttpResponse<any>> {
    return this.http.delete<HttpErrorResponse | HttpResponse<any>>(`${this.host}/entretien/delete/${id}`);
  }
  getAllEntretien(keyword:string="",pageNo:number = 0,pageSize:number = 10,sortBy:string ="",sortDir:string="",username:string=""): Observable<Entretienresponse> {
    return this.http.get<Entretienresponse>(`${this.host}/entretien/list?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}$keyword=${keyword}$username=${username}`);
  }
  getAllEntretienNombre(): Observable<Entretienresponse> {
    return this.http.get<Entretienresponse>(`${this.host}/entretien/list`);
  }

  uploadeEntretienPicture(EntretienPicture: File,idEntretien:number) {
    const fd = new FormData();
    fd.append('image', EntretienPicture);
    return this.http
      .post(`${this.host}/entretien/photo/upload/${idEntretien}`, fd, { responseType: 'text' })
      .subscribe(
        (response: any) => {
          console.log(response);
          console.log('entretien image ajouté avec succès. ' + response);
        },
        error => {
          console.log(error);
        }
      );
  }

  getOneEntretienById(id:number):Observable<Entretien>{
    return this.http.get<Entretien>(`${this.host}/entretien/${id}`);
  }
}
