import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PasswordChange } from '../Model/password-change';
import { Utilisateur } from '../Model/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public host = environment.host;
  public clientHost = environment.client;
  public token!: string | any;
  public loggInUsername!: string;
  public redirectUrl!: string;
  private jwtHelper = new JwtHelperService();
  public userPicture =`${this.host}/image/user/`;
  constructor(private http: HttpClient) { }

  login(utilisateur: Utilisateur): Observable<HttpErrorResponse | HttpResponse<any>> {
    return this.http.post<HttpErrorResponse | HttpResponse<any>>(`${this.host}/utilisateur/login`, utilisateur, { observe: 'response' });
  }

  resetPassword(email: string) {
    return this.http.get(`${this.host}/utilisateur/resetPassword/${email}`, {
      responseType: 'text'
    });
  }

  logOut(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  loadToken(): void {
    this.token = localStorage.getItem('token');
  }

  getToken(): string {
    return this.token;
  }

  isLoggedIn(): boolean | any {
    this.loadToken();
    if (this.token != null && this.token !== '') {
      if (this.jwtHelper.decodeToken(this.token).sub != null || '') {
        if (!this.jwtHelper.isTokenExpired(this.token)) {
          this.loggInUsername = this.jwtHelper.decodeToken(this.token).sub;
          return true;
        }
      }
    } else {
      this.logOut();
      return false;
    }
  }

  getUserInformation(username: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.host}/utilisateur/${username}`);
  }


  searchUsers(username: string): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.host}/utilisateur/findByUsername/${username}`);
  }

  updateUser(updateUser: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.host}/utilisateur/update`, updateUser);
  }

  changePassword(changePassword: PasswordChange) {
    return this.http.post(`${this.host}/utilisateur/changePassword`, changePassword, { responseType: 'text' });
  }

  uploadeUserProfilePicture(profilePicture: File) {
    const fd = new FormData();
    fd.append('image', profilePicture);
    return this.http
      .post(`${this.host}/utilisateur/photo/upload`, fd, { responseType: 'text' })
      .subscribe(
        (response: any) => {
          console.log(response);
          console.log('Profile utilisateur ajouté avec succès. ' + response);
        },
        error => {
          console.log(error);
        }
      );
  }
  getAllJury(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.host}/utilisateur/jurylist`);
  }
  getOneJuryById(juryId: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.host}/utillsateur/${juryId}`);
  }
}
