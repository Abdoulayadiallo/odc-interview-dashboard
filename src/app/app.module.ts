import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccueilComponent } from './accueil/accueil.component';
import { PostulantComponent } from './postulant/postulant.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JuryComponent } from './jury/jury.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { ProfileComponent } from './profile/profile.component';
import { CritereComponent } from './critere/critere.component';
import { EntretienComponent } from './entretien/entretien.component';
import { BodyComponent } from "./body/body.component";
import { SigninComponent } from './signin/signin.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { PostulantDetailsComponent } from './postulant-details/postulant-details.component';
import { JuryDetailsComponent } from './jury-details/jury-details.component';


@NgModule({
    declarations: [
        AppComponent,
        AccueilComponent,
        PostulantComponent,
        SidebarComponent,
        DashboardComponent,
        JuryComponent,
        QuestionnaireComponent,
        ProfileComponent,
        CritereComponent,
        EntretienComponent,
        BodyComponent,
        SigninComponent,
        PostulantDetailsComponent,
        JuryDetailsComponent,
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgCircleProgressModule.forRoot({
            responsive: true,
            // set defaults here
            radius: 100,
            outerStrokeWidth: 16,
            innerStrokeWidth: 8,
            outerStrokeColor: "#78C000",
            innerStrokeColor: "#C7E596",
            animationDuration: 300,
            showSubtitle: false
          }),
          MatToolbarModule
      
       // NgxLoadingModule.forRoot({})
    ]
})
export class AppModule { }
