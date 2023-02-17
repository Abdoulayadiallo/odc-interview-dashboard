import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Critere } from '../Model/critere';
import { Entretien } from '../Model/entretien';
import { CritereService } from '../Service/critere.service';
import { EntretienService } from '../Service/entretien.service';

@Component({
  selector: 'app-critere',
  templateUrl: './critere.component.html',
  styleUrls: ['./critere.component.scss']
})
export class CritereComponent implements OnInit {
  // Variable Critere
  critere:Critere = new Critere; 
  idEntretien: any;
  criteres: Critere[] = [];
  entretien: Entretien;
  constructor(
    private critereService:CritereService,
    private route:ActivatedRoute,
    private entretienService:EntretienService
  ) { }

  ngOnInit(): void {
    this.idEntretien=this.route.snapshot.params["idEntretien"]
    this.critere.entretien=this.entretien
    console.log(this.idEntretien)
    console.log(this.critere.entretien)
    this.getAllcritere()
  }
  //Ajouter Entretien
  AjouterCritere() {
    // this.loadingService.isLoading.next(true);
    this.critereService.AjouterCritere(this.critere).subscribe(
      (response) => {
        console.log(response);
        this.getAllcritere()

      },
      (error) => {
        console.log(error);
        // this.loadingService.isLoading.next(false);
        // this.alerteService.presentToast(' <ion-icon name="warning" size="large"></ion-icon> Email ou mots de passe incorrecte',"danger")
      }
    );
  }
  getAllcritere(){
    this.critereService.getAllCritere().subscribe(data =>{
      this.criteres=data
    })
  }
  getEntretienById(){
    this.entretienService.getOneEntretienById(this.idEntretien).subscribe(data=>{
        console.log(data)
        this.entretien=data
      }
    )
    
  }
}
