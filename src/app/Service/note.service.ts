import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Note } from '../Model/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  public host = environment.host;
  public clientHost = environment.client;
  constructor(private http:HttpClient) { }

  addNote(note: Note,critereId:number,postulantId:number,Jury:string): Observable<Note> {
    return this.http.post<Note>(`${this.host}/note/add/${critereId}/${postulantId}/${Jury}`, note);
  }
 DelNote(id: number): Observable<Object> {
    return this.http.delete(`${this.host}/note/delete/${id}`);
  }
 
  getAllNote(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.host}/note/list`);
  }
  getNoteByPostulant(idPostulant:number): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.host}/note/postulant/${idPostulant}`);
  }
  getNoteByCritere(idCritere:number): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.host}/note/critere/${idCritere}`);
  }
  updateNote(id: number, note: Note): Observable<Object>{
    return this.http.put(`${this.host}/note/update/${id}`, note);
  }
}
