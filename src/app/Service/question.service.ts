import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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

}
