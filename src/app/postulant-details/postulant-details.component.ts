import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Note } from '../Model/note';
import { Postulant } from '../Model/postulant';
import { Question } from '../Model/question';
import { NoteService } from '../Service/note.service';
import { PostulantService } from '../Service/postulant.service';
import { QuestionService } from '../Service/question.service';
declare var $: any;
@Component({
  selector: 'app-postulant-details',
  templateUrl: './postulant-details.component.html',
  styleUrls: ['./postulant-details.component.scss']
})
export class PostulantDetailsComponent implements OnInit {
  idPostulant:number
  commentaireFinal:string
  postulant: Postulant = new Postulant;
  notePostulant: Note[] = [];
  questionCritere: Question[]=[];
  qcritere: Question = new Question();
  pattern = /^[a-zA-Z0-9\s]*$/;

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
        if(data[i].critere.id==i+1){

          console.log(data[i].critere.id + "----------------")
          this.questionService.getQuestionBycritere(data[i].critere.id).subscribe(
            response=>{
              console.log(Question)
                this.qcritere=response[0]
                console.log(this.qcritere)
                this.questionCritere.push(this.qcritere)
              }
          )
        }
        
      }
      console.log(this.questionCritere)
    })
  }
  AccepterPostulant(){
    if(this.commentaireFinal!=null && this.pattern.test(this.commentaireFinal)){
      this.postulantService.accepterPostulant(this.idPostulant, this.commentaireFinal)
    .subscribe(response => {
      console.log('Postulant a été accepté');
      Swal.fire({
        icon: 'success',
        title: 'Felicitation',
        text: 'Postulant ' + this.postulant.prenom +' '+this.postulant.nom + ' valider',
        timer: 5000,
      });
      $('#AccepterPostulantModal').modal('hide');
      console.log(response)
    }, error => {
      console.error(error);
    });
    }
  }
  RefuserPostulant(){
    if(this.commentaireFinal!=null && this.pattern.test(this.commentaireFinal)){
      this.postulantService.RefuserPostulant(this.idPostulant, this.commentaireFinal)
    .subscribe(response => {
      console.log('Postulant a été refusé');
      console.log(response)
      Swal.fire({
        icon: 'success',
        title: 'Felicitation',
        text: 'Postulant ' + this.postulant.prenom +' '+this.postulant.nom + ' refuser',
        timer: 5000,
      });
      $('#RefuserPostulantModal').modal('hide');
    }, error => {
      console.error(error);
    });
    }
  }
  EnAttentePostulant(){
    if(this.commentaireFinal!=null && this.pattern.test(this.commentaireFinal)){
      this.postulantService.MettreEnAttentePostulant(this.idPostulant, this.commentaireFinal)
    .subscribe(response => {
      console.log('Postulant a été mis dans la liste d attente');
      Swal.fire({
        icon: 'success',
        title: 'Felicitation',
        text: 'Postulant ' + this.postulant.prenom +' '+this.postulant.nom + ' mit en attente',
        timer: 5000,
      });
      $('#enAttentePostulantModal').modal('hide');
      console.log(response)
    }, error => {
      console.error(error);
    });
    }
  }
  // getQuestionByCritere(id:number){
  //   this.questionService.getQuestionBycritere(id).subscribe{
  //     this.questionCritere=data
  //   }
  // }


}
