import {ChangeDetectorRef, Component} from '@angular/core';
import {ILogin} from "../../../../models/login.interface";
import {CommonModule, NgFor, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AuthenticationService} from "../../../services/authentication.service";
import {RegionService} from "../../../services/region.service";
import {BaseComponent} from "../../base.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIf, NgFor],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent extends BaseComponent {
  isLoading = false;
  login: ILogin | undefined;

  region: string;

  regionOptions: string[] = ["ap-southeast-2", "us-east-1"];

  constructor(private ref: ChangeDetectorRef,
              authenticationService: AuthenticationService,
              private regionService: RegionService,
              private route: ActivatedRoute,
              private router: Router) {
    super(authenticationService);
    this.region = regionService.getRegion();
    this.authenticationService.loginEvent.subscribe(
      user => this.onLoginChanged(user)
    );
    regionService.regionEvent.subscribe(
      region => {this.region = region;}
    );
  }

  ngOnInit(): void {
    this.initialise();
  }

  async initialise(): Promise<void> {
    this.isLoading = true;
    this.region = this.regionService.getRegion();
    await this.authenticationService.authenticate();
    this.isLoading = false;
  }

  onLoginChanged(login: ILogin): void {
    const self = this;
    self.login = login;
  }

  onRegionChanged(region: string) {
    this.regionService.setRegion(region);
    this.region = region;
    console.log("Selected region: " + region);
    window.location.reload();
  }
}
