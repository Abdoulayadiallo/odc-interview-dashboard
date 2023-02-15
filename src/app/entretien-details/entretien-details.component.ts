import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject, catchError, map, of, startWith } from 'rxjs';
import { Entretien } from '../Model/entretien';
import { Postulantresponse } from '../Model/postulantresponse';
import { AccountService } from '../Service/account.service';
import { EntretienService } from '../Service/entretien.service';
import { PostulantService } from '../Service/postulant.service';

@Component({
  selector: 'app-entretien-details',
  templateUrl: './entretien-details.component.html',
  styleUrls: ['./entretien-details.component.scss']
})
export class EntretienDetailsComponent implements OnInit {
  id: any;
  entretien: Entretien;
  entretienPicture:string
//Postulant Liste
postulantResponse!: Postulantresponse;
  postulantState$!: Observable<{
    appState: string;
    appData?: Postulantresponse;
    error?: HttpErrorResponse;
  }>;

  private currentPageSubject = new BehaviorSubject<number>(0);
  responseSubject = new BehaviorSubject<Postulantresponse>(
    this.postulantResponse
  );
  currentPage$ = this.currentPageSubject.asObservable();


  constructor(
    private entretienService:EntretienService,
    private route:ActivatedRoute,
    private postulantService: PostulantService,
    private juryService:AccountService
    ) { }

  ngOnInit(): void {
    //Recuperer path variable id
    this.id=this.route.snapshot.params["id"]
    //Recuperer l'emplacement de l'image
    this.entretienPicture= this.entretienService.imageentretien
    
    //Recuperer la liste des Postulants
    this.getEntretienById()
    if(this.id){

      this.postulantState$ = this.postulantService
        .getAllPostulantByEntretien(this.id)
        .pipe(
          map((response: Postulantresponse) => {
            // this.loadingService.loadingOff();
            this.responseSubject.next(response);
            this.currentPageSubject.next(response.pageNo);
            console.log(response);
            return { appState: 'APP_LOADED', appData: response };
          }),
          startWith({
            appState: 'APP_LOADED',
            appData: this.responseSubject.value,
          }),
          catchError((error: HttpErrorResponse) => {
            // this.loadingService.loadingOff();
            return of({ appState: 'APP_ERROR', error });
          })
        );
    }
  }
  //Recuperer Entretien par id
  getEntretienById(){
    this.entretienService.getOneEntretienById(this.id).subscribe(
      (data)=>{
        this.entretien=data
      }
    )
  }

}
