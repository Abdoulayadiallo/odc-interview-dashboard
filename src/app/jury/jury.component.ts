import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, catchError, map, of, startWith, Subscription } from 'rxjs';
import { Entretien } from '../Model/entretien';
import { Entretienresponse } from '../Model/entretienresponse';
import { JuryResponse } from '../Model/jury-response';
import { Utilisateur } from '../Model/utilisateur';
import { AccountService } from '../Service/account.service';
import { EntretienService } from '../Service/entretien.service';

@Component({
  selector: 'app-jury',
  templateUrl: './jury.component.html',
  styleUrls: ['./jury.component.scss']
})
export class JuryComponent implements OnInit {
  //Jury Liste
  juryResponse: JuryResponse = new JuryResponse();
  juryState$!: Observable<{
    appStateJury: string;
    appDataJury?: JuryResponse;
    errorJury?: HttpErrorResponse;
  }>;
  //Jury ajout
  juryAjout: Utilisateur = new Utilisateur();
  idEntretien:number

  private currentPageSubjectJury = new BehaviorSubject<number>(0);
  responseSubjectJury = new BehaviorSubject<JuryResponse>(this.juryResponse);
  currentPageJury$ = this.currentPageSubjectJury.asObservable();
  excel: File;
  excelChange: boolean = false;
  postulantNombre: number;
  juryNombre: number;
  subcriptions: Subscription[] = [];
  entretiens: Entretien[]=[];

  //Fin jury Liste
  juryId:number
  constructor(private juryService:AccountService,
    private entretienService:EntretienService) { }

  ngOnInit(): void {
    this.getJurys()  
  }
  //Ajout jury

  AjouterJury(utilisateur: Utilisateur): void {
    // this.loadingService.isLoading.next(true);
    console.log(utilisateur);
    this.subcriptions.push(
      this.juryService.addJury(utilisateur, this.idEntretien).subscribe(
        (response) => {
          console.log(response);
          setTimeout(()=>{
            this.getJurys();
          },20)
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
  }

  //Jury liste
  getJurys() {
    this.juryState$ = this.juryService.getAllJury().pipe(
      map((response: JuryResponse) => {
        // this.loadingService.loadingOff();
        this.responseSubjectJury.next(response);
        this.currentPageSubjectJury.next(response.pageNo);
        console.log(response);
        return { appStateJury: 'APP_LOADED', appDataJury: response };
      }),
      startWith({
        appStateJury: 'APP_LOADED',
        appDataJury: this.responseSubjectJury.value,
      }),
      catchError((error: HttpErrorResponse) => {
        // this.loadingService.loadingOff();
        return of({ appStateJury: 'APP_ERROR', error });
      })
    );
  }

  
  //Naviguer entre les pages Jury
  gotToPageJury(
    name: string = '',
    pageNo: number = 0,
    pageSize: number = 10,
    sortBy: string = '',
    sortDir: string = ''
  ): void {
    // this.loadingService.loadingOn();
    this.juryState$ = this.juryService
      .getAllJury(pageNo, pageSize, sortBy, sortDir, name)
      .pipe(
        map((response: JuryResponse) => {
          // this.loadingService.loadingOff();
          this.responseSubjectJury.next(response);
          this.currentPageSubjectJury.next(pageNo);
          console.log(response);
          return { appStateJury: 'APP_LOADED', appDataJury: response };
        }),
        startWith({
          appStateJury: 'APP_LOADED',
          appDataJury: this.responseSubjectJury.value,
        }),
        catchError((error: HttpErrorResponse) => {
          // this.loadingService.loadingOff();
          return of({ appStateJury: 'APP_ERROR', error });
        })
      );
  }
  goToNextOrPreviousPageJury(direction: string, name?: string): void {
    this.gotToPageJury(
      name,
      direction === 'forward'
        ? this.currentPageSubjectJury.value + 1
        : this.currentPageSubjectJury.value - 1
    );
  }
  getAllEntretien(){
    this.entretienService.getAllEntretien().subscribe(data =>{
      this.entretiens=data.contenu
    })
  }
    //Recuperer jury Id
    getJuryId(id: number) {
      this.juryId = id;
      console.log(this.juryId);
    }
    // Supprimer Postulant
    DeleteJury() {
      this.juryService
        .deleteJury(this.juryId)
        .subscribe((data) => {
          this.getJurys()
          console.log(data);
        });
    }
}
