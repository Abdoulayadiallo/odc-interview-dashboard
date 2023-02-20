import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Critere } from '../Model/critere';
import { Entretien } from '../Model/entretien';
import { Etat } from '../Model/etat';
import { Question } from '../Model/question';
import { CritereService } from '../Service/critere.service';
import { EntretienService } from '../Service/entretien.service';
import { QuestionService } from '../Service/question.service';
declare var $: any;

@Component({
  selector: 'app-critere',
  templateUrl: './critere.component.html',
  styleUrls: ['./critere.component.scss']
})
export class CritereComponent implements OnInit {
  subcription:Subscription[]=[]
  // Variable Critere
  critere: Critere = new Critere;
  critereUpdate: Critere = new Critere;
  idEntretien: any;
  criteres: Critere[] = [];
  entretien: Entretien = new Entretien;
  critereId: number;
  clickedTrue: boolean;
  clickedFalse: boolean;
  aucunBoutonSelectionne = true;
  clickedUpdateTrue: boolean;
  clickedUpdateFalse: boolean;
  aucunBoutonSelectionneUpdate = true;
  baremSaisi = false;
  nomcritereSaisi = false;
  critereSelection: Critere;

  //Variable Question
  question:Question = new Question
  clickedquestionOuvert: boolean;
  clickedquestionFerme: boolean;
  aucunBoutonSelectionneQuestion:boolean=true
  questioncritere: any=[];
  qcritere: Question;

  constructor(
    private critereService: CritereService,
    private route: ActivatedRoute,
    private entretienService: EntretienService,
    private questionService:QuestionService
  ) {
    this.critere = {
      id: null,
      critereNom: '',
      barem: null,
      elimination: null,
      entretien: null,
    };
    this.question = {
      id: null,
      questionNom:null,
      type: null,
      critere:null
    };
  }

  ngOnInit(): void {
    this.idEntretien = this.route.snapshot.params["idEntretien"]
    console.log(this.idEntretien)
    this.getAllcritere()
    this.getEntretienById()
  }
  //Ajouter Critere
  AjouterCritere() {
    // this.loadingService.isLoading.next(true);
    if (this.critere.elimination != null && this.critere.barem != null && this.critere.critereNom != '') {
      this.critereService.AjouterCritere(this.critere).subscribe(
        (response) => {
          console.log(response);
          this.getAllcritere()
          Swal.fire({
            icon: 'success',
            title: 'Felicitation',
            text: 'Critere ajouté',
            timer: 5000,
          })
          $('#addEntretienModal').modal('hide');
        },
        (error) => {
          console.log(error);
          if (error = "ce critere existe deja.") {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ce critere existe déja!',
              timer: 2000,
            })
          }
          else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Une erreur est survenue\n ressayer encore!',
            })
          }
          // this.loadingService.isLoading.next(false);
        }
      );
    }
    this.baremSaisi = !!this.critere.barem;
    this.nomcritereSaisi = !!this.critere.critereNom;
    this.critere=new Critere
    this.clickedTrue= false;
    this.clickedFalse= false;
    this.aucunBoutonSelectionne = true;
  }
  // Recuperer le critere d'elimination
  OnElimination(elimination: boolean) {
    this.clickedTrue = elimination;
    this.clickedFalse = !elimination;
    this.critere.elimination = elimination;
    this.aucunBoutonSelectionne = false;
  }
  // Recuperer le critere d'elimination
  OnEliminationUpdate(elimination: boolean) {
    this.clickedUpdateTrue = elimination;
    this.clickedUpdateFalse = !elimination;
    this.critereUpdate.elimination = elimination;
    this.aucunBoutonSelectionneUpdate = false;
  }
  // Recuperer le type de question
  OnTypeQuestion(type: string) {
    if(type=="ouvert"){
      this.clickedquestionOuvert = true;
      this.question.type = type;
      this.aucunBoutonSelectionneQuestion = false;
    }else{
      this.clickedquestionFerme = true;
      this.question.type = type;
      this.aucunBoutonSelectionneQuestion = false;
    }
  }
  getAllcritere() {
    this.critereService.getAllCritere().subscribe(data => {
      this.criteres = data
      for(let i=0;i<this.criteres.length;i++){
        if(this.criteres[i].id==i+1){
          if(this.critere.id=i+1){
            this.questionService.getQuestionBycritere(this.criteres[i].id).subscribe(response=>{
              this.qcritere=response[0]
              console.log(this.qcritere)
              this.questioncritere.push(response[0])
              console.log(this.questioncritere)
            })
          }
        }
      }
    })
  }
  getEntretienById() {
    this.entretienService.getOneEntretienById(this.idEntretien).subscribe(data => {
      console.log(data)
      this.critere.entretien = data
    }
    )

  }
  updateCritere() {
    if (this.critereUpdate.elimination != null && this.critereUpdate.barem != null && this.critereUpdate.critereNom != '') {
      this.critereService.ModifierCritere(this.critereId, this.critereUpdate).subscribe(
        (response) => {
          console.log(response);
          this.getAllcritere()
          Swal.fire({
            icon: 'success',
            title: 'Felicitation',
            text: 'Critere Modifier',
            timer: 5000,
          })
        },
        (error) => {
          console.log(error);
          // this.loadingService.isLoading.next(false);
          // this.alerteService.presentToast(' <ion-icon name="warning" size="large"></ion-icon> Email ou mots de passe incorrecte',"danger")
        }
      );
    }
  }
  // Get Critere By Id
  getCritereChoici(id: number) {
    this.critereService.getOneCritereById(id).subscribe(data => {
      this.critereId = id
      this.critereUpdate = data
      this.critereSelection = data
      console.log(data)
      this.question.critere = data
      console.log(this.question.critere)
    })
  }
  getCritereChoiciQuestion(id: number) {
    this.critereService.getOneCritereById(id).subscribe(data => {
      this.question.critere = data
      console.log(this.question.critere)
    })
  }
  // Supprimer entretien
  DeleteCritere() {
    if (this.critereId) {

      this.critereService.deleteCritere(this.critereId).subscribe(
        data => {
          console.log(data)
          $('#deleteCritereModal').modal('hide');

          Swal.fire({
            icon: 'success',
            title: 'Critere' + this.critereSelection.critereNom + 'supprimé',
            text: 'Critere supprimé',
            timer: 5000,
          })
          this.getAllcritere()
        },
        (error) => {
          console.log(error);
          if (error = "ce critere existe deja.") {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Une erreur est survenue lors de la suppression du critere!',
              timer: 2000,
            })
          }
        }
      )
    }
  }
  //Ajouter question à critere
  AjouterQuestion(){
    if(this.question.questionNom!='' && this.question.type!=null){
      this.subcription.push(

        this.questionService.AjouterQuestion(this.question).subscribe(data=>{
          console.log(data)  
          this.getAllcritere()

          $('#addQuestionModal').modal('hide');
          Swal.fire({
            icon: 'success',
            title: 'Question' + this.question.questionNom + 'ajoutée',
            text: 'Question ajouté',
            timer: 5000,
          })
        },
        error=>{
          if(error="cette question existe deja."){
            Swal.fire({
              icon: 'info',
              title: 'Question' + this.question.questionNom + 'existe deja',
              text: 'Question existe',
              timer: 5000,
            })
          }
        }),  
      
      )
      }
  }


}
