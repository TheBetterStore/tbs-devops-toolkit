import { Component } from '@angular/core';
import {IApplicationErrorConfig} from "../../../models/application-error-config.interface";
import {ApplicationErrorService} from "../../services/application-error.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {NgIf} from "@angular/common";
import {TableModule} from "primeng/table";

@Component({
  selector: 'app-application-error-configs',
  standalone: true,
  imports: [
    ButtonModule,
    NgIf,
    SharedModule,
    TableModule
  ],
  templateUrl: './application-error-configs.component.html',
  styleUrl: './application-error-configs.component.scss'
})
export class ApplicationErrorConfigsComponent {
  isLoading = false;
  errorMsg: string = "";
  infoMsg: string = "";

  applicationErrorConfigs: IApplicationErrorConfig[] = [];
  selectedApplication: IApplicationErrorConfig | null = null;

  cols: any[] = [];
  sub: any;
  pageSize = 10;

  constructor(private applicationErrorService: ApplicationErrorService, private route: ActivatedRoute,
              private messageService: MessageService, private confirmationService: ConfirmationService,
              private router: Router) {}

  ngOnInit(): void {
    this.loadApplicationErrorConfigs();
  }

  loadApplicationErrorConfigs() {
    const self = this;
    self.isLoading = true;
    this.applicationErrorService.getAppErrorConfigs()
    .subscribe(
      p => {
        console.log(p);
        self.applicationErrorConfigs = p.Items;
        self.errorMsg = '';
        self.isLoading = false;
      },
      e => {
        console.log(e);
        self.messageService.add({
          severity: 'error',
          summary: 'Status retrieval failed',
          detail: e.message,
          life: 5000
        });
        self.errorMsg = e.message;
        self.isLoading = false;
      },
      () => {
      }
    );
  }

  onRowSelect(event: any) {
    console.log(event)
  }

  onRowUnselect(event: any) {
    console.log(event)
  }
}
