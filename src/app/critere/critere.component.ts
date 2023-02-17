import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Critere } from '../Model/critere';
import { CritereService } from '../Service/critere.service';

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
  constructor(
    private critereService:CritereService,
    private route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.idEntretien=this.route.snapshot.params["idEntretien"]
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

}
