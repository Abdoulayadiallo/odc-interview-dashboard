import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Utilisateur } from '../Model/utilisateur';
import { AccountService } from '../Service/account.service';
import { AlertService } from '../Service/alert.service';
import { LoadingService } from '../Service/loading.service';
import { navbarData } from './nav-data';

interface SideNavToggle {
  screenWidth: number;
  hidded: boolean;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms',
          style({ opacity: 1 })
        )
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('350ms',
          style({ opacity: 0 })
        )
      ])
    ]),
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' })
          ])
        )
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit {

  profilePicture: File;
  profilePictureChange: boolean;
  private subscriptions: Subscription[] = [];
  utilisateur: Utilisateur;
  userpicture: string;
  username: string;

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  hidded = false;
  screenWidth = 0;
  navData = navbarData;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.hidded = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, hidded: this.hidded, screenWidth: this.screenWidth });
    }
  }
  constructor(private router: Router,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private accountService: AccountService) { }
  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.userpicture = this.accountService.userPicture;
    this.getUserInfo(this.accountService.loggInUsername);
    this.username = this.accountService.loggInUsername;
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.hidded = !this.hidded
    this.onToggleSideNav.emit({ collapsed: this.collapsed, hidded: this.hidded, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.hidded = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, hidded: this.hidded, screenWidth: this.screenWidth });
  }
  getUserInfo(username: string): void {
    this.subscriptions.push(
      this.accountService.getUserInformation(username).subscribe(
        (response: Utilisateur) => {
          this.utilisateur = response;
          console.log(response)
          console.log(this.utilisateur)
        },
        error => {
          console.log(error);
          this.utilisateur = null;
        }
      ));
  }

  logOut(): void {
    this.loadingService.isLoading.next(true);
    this.accountService.logOut();
    this.router.navigateByUrl('/signin');
    this.loadingService.isLoading.next(false);
    //  this.alertService.presentToast(
    //    "Vous vous êtes deconnecter avec succès.",
    //    "success"
    //  );
  }



}
