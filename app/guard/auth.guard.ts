import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { ProfileService } from '../services/profile/profile.service';
import { profile } from 'console';
import { Strings } from '../enum/strings';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  [x: string]: any;

  constructor(private authService: AuthService, private router: Router ,private profileService: ProfileService) {


  }
    async canLoad(
      route: Route,
      segments: UrlSegment[]): Promise<boolean> {
        const roleType = route.data.type;
        try {
          // this code caan change url to admin ot tabs 
          const type = await this.authService.checkUserAuth();
          if(type) {
            if(type == roleType) return true;
            else {
              let url = Strings.TABS;
              if(type == 'admin') url = Strings.ADMIN;
              this.navigate(url);
            }
          } else {
            this.checkForAlert(roleType);
          }
        } catch(e) {
          console.log(e);
          this.checkForAlert(roleType);
        }
    }

    navigate(url) {
      this.router.navigateByUrl(url, {replaceUrl: true});
      return false;
    }
  
    async checkForAlert(roleType) {
      const id = await this.authService.getId();
      if(id) {
        // check network
        console.log('alert: ', id);
        this.showAlert(roleType);
      } else {
        this.authService.logout();
        this.navigate(Strings.LOGIN);
      }
    }
  
    showAlert(role) {
      this.alertCtrl.create({
        header: 'Authentication Failed',
        message: 'Please check your Internet Connectivity and tr again',
        buttons: [
          {
            text: 'Logout',
            handler: () => {
              this.authService.logout();
              this.navigate(Strings.LOGIN);
            }
          },
          {
            text: 'Retry',
            handler: () => {
              let url = Strings.TABS;
              if(role == 'admin') url = Strings.ADMIN;
              this.navigate(url);
            }
          }
        ]
      })
      .then(alertEl => alertEl.present());
    }
}
