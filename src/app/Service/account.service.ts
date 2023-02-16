import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JuryResponse } from '../Model/jury-response';
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
  isAuthentificate: boolean;
  constructor(private http: HttpClient) { }

  login(utilisateur: Utilisateur): Observable<HttpErrorResponse | HttpResponse<any>> {
    return this.http.post<HttpErrorResponse | HttpResponse<any>>(`${this.host}/utilisateur/login`, utilisateur, { observe: 'response' });
  }
  addJury(utilisateur: Utilisateur,idEntretien:number): Observable<Utilisateur | HttpErrorResponse> {
    return this.http.post<Utilisateur>(`${this.host}/utilisateur/register/${idEntretien}`, utilisateur);
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
          this.isAuthentificate=true
          return true;
        }
      }
    } else {
      this.logOut();
      this.isAuthentificate=false
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
  getAllJury(pageNo:number = 0,pageSize:number = 10,sortBy:string ="",sortDir:string="",keyword:string=""): Observable<JuryResponse> {
    return this.http.get<JuryResponse>(`${this.host}/utilisateur/jurylist?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}&keyword=${keyword}`);
  }
  getOneJuryById(juryId: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.host}/utillsateur/${juryId}`);
  }
  getAllJuryByEntretien(idEntretien:number,pageNo:number = 0,pageSize:number = 10,sortBy:string ="",sortDir:string="",keyword:string=""): Observable<JuryResponse> {
    return this.http.get<JuryResponse>(`${this.host}/utilisateur/entretien/${idEntretien}?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}&keyword=${keyword}`);
  }
}
