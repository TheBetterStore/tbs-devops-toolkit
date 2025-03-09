import { Component } from '@angular/core';
import {IApplicationErrorConfig} from "../../../models/application-error-config.interface";
import {IApplicationErrorCode} from "../../../models/application-error-code.interface";
import {ApplicationErrorService} from "../../services/application-error.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
  selector: 'app-application-error-codes',
  standalone: true,
  imports: [],
  templateUrl: './application-error-codes.component.html',
  styleUrl: './application-error-codes.component.scss'
})
export class ApplicationErrorCodesComponent {
  isLoading = false;
  errorMsg: string = "";
  infoMsg: string = "";

  applicationErrorCodes: IApplicationErrorCode[] = [];
  selectedApplication: IApplicationErrorConfig | null = null;

  applicationId: string = '';

  sub: any;
  pageSize = 10;

  constructor(private applicationErrorService: ApplicationErrorService, private route: ActivatedRoute,
              private messageService: MessageService, private confirmationService: ConfirmationService,
              private router: Router) {}

  ngOnInit(): void {

    console.log(this.route.snapshot.paramMap);

    this.sub = this.route.queryParamMap
      .subscribe(params => {
        this.applicationId = params?.get('applicationId') + '';
        console.log('AppId: ' + this.applicationId);

        this.loadApplicationErrorConfigs(this.applicationId);
      });


  }

  loadApplicationErrorConfigs(applicationId: string) {
    const self = this;
    self.isLoading = true;
    this.applicationErrorService.getAppErrorCodes(applicationId)
      .subscribe(
        p => {
          console.log(p);
          console.log(p.NextToken);
          self.applicationErrorCodes = p.Items;
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
}
