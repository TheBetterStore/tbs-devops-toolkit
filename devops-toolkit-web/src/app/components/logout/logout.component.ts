import {Component, NgZone} from '@angular/core';
import {AuthenticationService} from "../../services/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {

  constructor(private authenticationService: AuthenticationService,
              private ngZone: NgZone,
              private route: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit(): void {
    console.log('Signing out...');
    this.logout();
  }

  async logout(): Promise<any> {
    await this.authenticationService.logout();
    this.ngZone.run(() => {
      this.router.navigate(['/login']);
    });
  }
}
