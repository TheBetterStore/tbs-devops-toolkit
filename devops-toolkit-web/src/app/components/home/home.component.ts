import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MessageService} from "primeng/api";
import {NgIf} from "@angular/common";
import {ToastModule} from "primeng/toast";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {AuthenticationService} from "../../services/authentication.service";
import {ILogin} from "../../../models/login.interface";
import {BaseComponent} from "../base.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgIf, ToastModule,ProgressSpinnerModule, ConfirmDialogModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends BaseComponent{
  isLoading = false;
  errorMsg: string = "";
  infoMsg: string = "";

  constructor(private route: ActivatedRoute, authenticationService: AuthenticationService,
              private messageService: MessageService) {
    super(authenticationService);
  }

}
