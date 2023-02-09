import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

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
        BodyComponent
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
    ]
})
export class AppModule { }
