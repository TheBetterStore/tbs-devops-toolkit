import { Component } from '@angular/core';
import {ApplicationErrorService} from "../../services/application-error.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {NgIf} from "@angular/common";
import {TableModule} from "primeng/table";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ToastModule} from "primeng/toast";
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {IApplicationErrorCode} from "../../../models/application-error-code.interface";
import {IApplicationErrorConfig} from "../../../models/application-error-config.interface";
import {ToolbarModule} from "primeng/toolbar";

@Component({
  selector: 'app-application-error-configs',
  standalone: true,
  imports: [
    ButtonModule,
    NgIf,
    SharedModule,
    TableModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    ToastModule,
    DialogModule,
    FormsModule,
    ToolbarModule
  ],
  templateUrl: './application-error-configs.component.html',
  styleUrl: './application-error-configs.component.scss'
})
export class ApplicationErrorConfigsComponent {
  isLoading = false;
  errorMsg: string = "";
  infoMsg: string = "";

  showDialog: boolean = false;

  applicationErrorConfigs: IApplicationErrorConfig[] = [];
  selectedApplicationErrorConfigs!: IApplicationErrorConfig[] | null;
  applicationErrorConfig!: IApplicationErrorConfig;
  selectedRecs: any;

  submitted: boolean = false;

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
        self.applicationErrorConfigs = p;
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

  editRec(rec: IApplicationErrorConfig) {
    this.applicationErrorConfig = { ...rec};
    this.showDialog = true;
  }

  openNew() {
    this.applicationErrorConfig = { ApplicationId: '', Region: '', Description: '', DlqName: '', DlqErrorCount: 0};
    this.submitted = false;
    this.showDialog = true;
    console.log('New');
  }

  deleteSelectedRecs() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected application config?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.applicationErrorConfigs
          = this.applicationErrorConfigs.filter((val) => !this.selectedApplicationErrorConfigs?.includes(val));
        this.selectedApplicationErrorConfigs = null;
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
        console.log('CodesInitial', this.applicationErrorConfigs);
        this.applicationErrorConfigs = this.applicationErrorConfigs.filter((val) => val.Id !== rec.Id);
        console.log('CodesAfter', this.applicationErrorConfigs);
        this.applicationErrorConfig ={ ApplicationId: '',  Region: '', Description: '', DlqName: '', DlqErrorCount: 0 };
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


    if (this.applicationErrorConfig.ApplicationId?.trim()) {
      if (this.applicationErrorConfig.Id) {
        this.applicationErrorConfigs[this.findIndexById(this.applicationErrorConfig.Id)] = this.applicationErrorConfig;
      } else {
        this.applicationErrorConfig.Id = this.applicationErrorConfig.ApplicationId;
        this.applicationErrorConfigs.push(this.applicationErrorConfig);
      }

      this.applicationErrorService.saveAppErrorConfig(this.applicationErrorConfig)
        .subscribe(
          p => {
            self.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: "Application saved",
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
            this.applicationErrorConfigs = [...this.applicationErrorConfigs];
            this.showDialog = false;
            this.applicationErrorConfig ={ ApplicationId: '',  Region: '', Description: '', DlqName: '', DlqErrorCount: 0};
          }
        );

    }
  }

  findIndexById(id: string): number {
    const index = this.applicationErrorConfigs.map(e => e.ApplicationId).indexOf(id);
    console.log('index:', index);
    return index;
  }

}
