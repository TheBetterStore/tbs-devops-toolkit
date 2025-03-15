import { Component } from '@angular/core';
import {IApplicationErrorConfig} from "../../../models/application-error-config.interface";
import {IApplicationErrorCode} from "../../../models/application-error-code.interface";
import {ApplicationErrorService} from "../../services/application-error.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Button, ButtonDirective} from "primeng/button";
import {ToolbarModule} from "primeng/toolbar";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {InputNumberModule} from "primeng/inputnumber";
import {DialogModule} from "primeng/dialog";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-application-error-codes',
  standalone: true,
  imports: [
    SharedModule,
    TableModule,
    FormsModule,
    NgIf,
    ButtonDirective,
    Button,
    ToolbarModule,
    ConfirmDialogModule,
    InputNumberModule,
    DialogModule,
    ProgressSpinnerModule,
    ToastModule
  ],
  templateUrl: './application-error-codes.component.html',
  styleUrl: './application-error-codes.component.scss'
})
export class ApplicationErrorCodesComponent {
  isLoading = false;
  errorMsg: string = "";
  infoMsg: string = "";

  showDialog: boolean = false;

  applicationErrorCodes: IApplicationErrorCode[] = [];
  applicationErrorCode!: IApplicationErrorCode;
  selectedErrorCodes!: IApplicationErrorCode[] | null;
  selectedRecs: any;

  submitted: boolean = false;

  applicationId: string = '';

  sub: any;
  pageSize = 10;

  constructor(private applicationErrorService: ApplicationErrorService, private route: ActivatedRoute,
              private messageService: MessageService, private confirmationService: ConfirmationService,
              private router: Router) {

  }

  ngOnInit(): void {
    console.log(this.route.snapshot.paramMap);

    this.sub = this.route.queryParamMap
      .subscribe(params => {
        this.applicationId = params?.get('applicationId') + '';
        console.log('AppId: ' + this.applicationId);

        this.loadApplicationErrorCodes(this.applicationId);
      });
  }

  loadApplicationErrorCodes(applicationId: string) {
    const self = this;
    self.isLoading = true;
    this.applicationErrorService.getAppErrorCodes(applicationId)
      .subscribe(
        p => {
          console.log(p);
          self.applicationErrorCodes = p;
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

  editRec(rec: IApplicationErrorCode) {
    this.applicationErrorCode = { ...rec};
    this.showDialog = true;
  }

  openNew() {
    this.applicationErrorCode = { ApplicationId: this.applicationId,  ErrorCode: '', Description: '', Remediation: ''};
    this.submitted = false;
    this.showDialog = true;
    console.log('New');
  }

  deleteSelectedRecs() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.applicationErrorCodes = this.applicationErrorCodes.filter((val) => !this.selectedErrorCodes?.includes(val));
        this.selectedErrorCodes = null;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      }
    });
  }

  deleteRec(rec: IApplicationErrorCode) {
    this.confirmationService.confirm({
                                       message: 'Are you sure you want to delete ' + rec.ErrorCode + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        console.log(rec);
        console.log('CodesInitial', this.applicationErrorCodes);
        this.applicationErrorCodes = this.applicationErrorCodes.filter((val) => val.Id !== rec.Id);
        console.log('CodesAfter', this.applicationErrorCodes);
        this.applicationErrorCode ={ ApplicationId: this.applicationId,  ErrorCode: '', Description: '', Remediation: ''};
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.showDialog = false;
    this.submitted = false;
  }

  saveRec() {
    const self = this;
    this.submitted = true;


    if (this.applicationErrorCode.ErrorCode?.trim()) {
      if (this.applicationErrorCode.Id) {
        this.applicationErrorCodes[this.findIndexById(this.applicationErrorCode.Id)] = this.applicationErrorCode;
      } else {
        this.applicationErrorCode.Id = this.createId(this.applicationErrorCode);
        this.applicationErrorCodes.push(this.applicationErrorCode);
      }

      this.applicationErrorService.saveAppErrorCode(this.applicationErrorCode)
        .subscribe(
          p => {
            self.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: "Code saved",
              life: 5000
            });
            self.errorMsg = '';
            self.isLoading = false;
          },
          e => {
            console.log(e);
            self.messageService.add({
              severity: 'error',
              summary: 'Update failed',
              detail: e.message,
              life: 5000
            });
            self.errorMsg = e.message;
            self.isLoading = false;
          },
          () => {
            this.applicationErrorCodes = [...this.applicationErrorCodes];
            this.showDialog = false;
            this.applicationErrorCode ={ ApplicationId: this.applicationId,  ErrorCode: '', Description: '', Remediation: ''};
          }
        );

    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.applicationErrorCodes.length; i++) {
      if (this.applicationErrorCodes[i].Id === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  createId(c: IApplicationErrorCode): string {
    return `${c.ApplicationId}|${c.ErrorCode}`;
  }
}
