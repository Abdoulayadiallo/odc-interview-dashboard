import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Utilisateur } from '../Model/utilisateur';
import { AccountService } from '../Service/account.service';
import { EntretienService } from '../Service/entretien.service';
import { PostulantService } from '../Service/postulant.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  entretienPicture: File;
  private subscriptions: Subscription[] = [];
  utilisateur: Utilisateur;
  userpicture: string;
  entretienNombre: number;
  juryNombre: number;


  constructor(
    private accountService: AccountService,
    private postulantService:PostulantService,
    private entretienService:EntretienService,
  ) { }

  ngOnInit(): void {
    this.userpicture = this.accountService.userPicture;
    const username=this.accountService.loggInUsername
    this.getUserInfo(username)
    this.getAllEntretienNombre()
    this.getAlljuryNombre()
  }
  onProfilePictureSelected(event: any): void {
    console.log(event);
    this.entretienPicture = event.target.files[0] as File;
    console.log(this.entretienPicture);
    // this.profilePictureChange = true;
  }
  getUserInfo(username: string): void {
    this.subscriptions.push(
      this.accountService.getUserInformation(username).subscribe(
      (response: Utilisateur) => {
        this.utilisateur = response;
        //this.idJury=response.id;
      //  this.usernameconnected=response.username
        //console.log("(-------------------------------)"+this.usernameconnected)
       // console.log(this.idJury)
       //this.nomEntretien= response.entretien.entretienNom
       // this.userpre=response.prenom
       // this.rolename=response.role.roleName
        //this.idEntretien=response.entretien.id
        //console.log(this.utilisateur)
      },
      error => {
        console.log(error);
        this.utilisateur = null;
      }
    ));
  }
  getAllEntretienNombre(){
    this.entretienService.getAllEntretien().subscribe(data=>{
      this.entretienNombre=data.totalElements
      console.log(data)
    })
  }
  getAlljuryNombre(){
    this.accountService.getAllJury().subscribe(data=>{
      this.juryNombre=data.length
      console.log(data)
    })
  }

}
