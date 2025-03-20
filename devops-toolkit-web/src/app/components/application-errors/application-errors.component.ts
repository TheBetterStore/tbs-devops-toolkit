import { Component } from '@angular/core';
import {ApplicationErrorService} from "../../services/application-error.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, MessageService, PrimeTemplate} from "primeng/api";
import {ILambdaDlqError} from "../../../models/lambdadlq-error.interface";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";
import {NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";

@Component({
  selector: 'app-application-errors',
  standalone: true,
  imports: [
    ConfirmDialogModule,
    DialogModule,
    NgIf,
    PaginatorModule,
    PrimeTemplate,
    ProgressSpinnerModule,
    TableModule,
    ToastModule,
    ToolbarModule
  ],
  templateUrl: './application-errors.component.html',
  styleUrl: './application-errors.component.scss'
})



export class ApplicationErrorsComponent {
  isLoading = false;
  errorMsg: string = "";
  infoMsg: string = "";

  sub: any;
  pageSize = 10;

  dlqName: string = '';
  applicationId: string = '';

  lambdaDlqErrors: ILambdaDlqError[] = [];
  lambdaDlqError: any;

  showDialog = false;

  payloadStr = ''

  constructor(private applicationErrorService: ApplicationErrorService, private route: ActivatedRoute,
              private messageService: MessageService, private confirmationService: ConfirmationService,
              private router: Router) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.paramMap);

    this.sub = this.route.queryParamMap
      .subscribe(params => {
        this.dlqName = params?.get('dlqName') + '';
        this.applicationId = params?.get('applicationId') + '';
        console.log('DlqName: ' + this.dlqName);

        this.loadApplicationErrors(this.dlqName);
      });
  }

  loadApplicationErrors(dlqName: string) {
    const self = this;
    self.isLoading = true;
    this.applicationErrorService.getDlqErrors(dlqName)
      .subscribe(
        p => {
          console.log(p);
          self.lambdaDlqErrors = p;
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

  viewPayload(rec: any) {
    this.lambdaDlqError = rec;
    this.showDialog = true;
    this.payloadStr = JSON.stringify(this.lambdaDlqError.payload, null, 2);
  }

  jsonToStr(j: object) {
    return JSON.stringify(j);
  }

}
