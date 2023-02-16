import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Note } from '../Model/note';
import { Postulant } from '../Model/postulant';
import { Question } from '../Model/question';
import { NoteService } from '../Service/note.service';
import { PostulantService } from '../Service/postulant.service';
import { QuestionService } from '../Service/question.service';

@Component({
  selector: 'app-postulant-details',
  templateUrl: './postulant-details.component.html',
  styleUrls: ['./postulant-details.component.scss']
})
export class PostulantDetailsComponent implements OnInit {
  idPostulant:number
  postulant: Postulant = new Postulant;
  notePostulant: Note[] = [];
  questionCritere: Question[]=[];
  qcritere: Question = new Question();
  constructor(
    private postulantService:PostulantService,
    private noteService:NoteService,
    private questionService:QuestionService
    ,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.idPostulant=this.route.snapshot.params['idPostulant']
    this.getPostulantById()
    this.getNoteByPostulantById()
  }
  getPostulantById(){
    this.postulantService.getOnePostulantById(this.idPostulant).subscribe(data=>{
      this.postulant=data
    })
  }
  getNoteByPostulantById(){
    this.noteService.getNoteByPostulant(this.idPostulant).subscribe(data=>{
      this.notePostulant=data
      for(let i=0;i<data.length;i++){
        if(data[i].critere.id==i-1){

          console.log(data[i].critere.id + "----------------")
          this.questionService.getQuestionBycritere(data[i].critere.id).subscribe(
            response=>{
                this.qcritere=response[i]
                console.log(this.qcritere)
                this.questionCritere.push(this.qcritere)
              }
          )
        }
        
      }
      console.log(this.questionCritere)
    })
  }
  // getQuestionByCritere(id:number){
  //   this.questionService.getQuestionBycritere(id).subscribe{
  //     this.questionCritere=data
  //   }
  // }


}
