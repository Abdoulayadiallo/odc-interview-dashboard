import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Critere } from '../Model/critere';
import { Question } from '../Model/question';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  public host = environment.host;
  public clientHost = environment.client;
  constructor(private http:HttpClient) { }

  getAllQuestion(): Observable<Question> {
    return this.http.get<Question>(`${this.host}/question/list`);
  }
  getQuestionBycritere(idCritere:number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.host}/question/critere/${idCritere}`);
  }
  AjouterQuestion(question: Question): Observable<HttpErrorResponse | HttpResponse<any>> {
    return this.http.post<HttpErrorResponse | HttpResponse<any>>(`${this.host}/question/add`, question);
  }
  ModifierCritere(idQuestion:number,question: Question): Observable<HttpErrorResponse | HttpResponse<any>> {
    return this.http.put<HttpErrorResponse | HttpResponse<any>>(`${this.host}/question/update/${idQuestion}`, question);
  }
  getOneQuestionByCritere(id:number):Observable<HttpErrorResponse | HttpResponse<any>>{
    return this.http.get<HttpErrorResponse | HttpResponse<any>>(`${this.host}/question/critere/${id}`);
  }
  getAllQuestionByEntretien(id:number):Observable<HttpErrorResponse | HttpResponse<any>>{
    return this.http.get<HttpErrorResponse | HttpResponse<any>>(`${this.host}/question/entretien/${id}`);
  }
  deleteQuestion(id:number): Observable<HttpErrorResponse | HttpResponse<any>| any> {
    return this.http.delete(`${this.host}/question/delete/${id}`,{responseType: 'text'});
  }
}
