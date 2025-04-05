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
import {HttpClient} from "@angular/common/http";

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
  showImageDialog: boolean = false;

  applicationErrorConfigs: IApplicationErrorConfig[] = [];
  selectedApplicationErrorConfigs!: IApplicationErrorConfig[] | null;
  applicationErrorConfig!: IApplicationErrorConfig;
  selectedRecs: any;

  submitted: boolean = false;

  sub: any;
  pageSize = 10;

  imageUrl: string = '';

  constructor(private applicationErrorService: ApplicationErrorService, private route: ActivatedRoute,
              private messageService: MessageService, private confirmationService: ConfirmationService,
              private router: Router, private http: HttpClient) {}

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
        this.applicationErrorService.getDlqErrorCounts()
          .subscribe(
            q => {
              for (let i = 0; i < q.length; i++) {  // Access object[key] here
                let dlqName = q[i].dlqName;
                let recs = self.applicationErrorConfigs.filter(o => o.DlqName == dlqName);
                for(let j = 0; j < recs.length; j++) {
                  recs[j].DlqErrorCount = q[i].itemCount || 0;
                }
              }
              self.errorMsg = '';
              self.isLoading = false;
            },
            e1 => {
              self.errorMsg = e1.message;
              self.isLoading = false;
            }
          )
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
    self.submitted = true;
    self.isLoading = true;


    if (this.applicationErrorConfig.ApplicationId?.trim()) {
      if (this.applicationErrorConfig.Id) {
        this.applicationErrorConfigs[this.findIndexById(this.applicationErrorConfig.Id)] = this.applicationErrorConfig;
      } else {
        this.applicationErrorConfig.Id = this.applicationErrorConfig.ApplicationId;
        this.applicationErrorConfigs.push(this.applicationErrorConfig);
      }

      const config = this.applicationErrorConfig;
      this.applicationErrorService.saveAppErrorConfig(config)
        .subscribe(
          p => {
            if(config.ImageKey) {
              // Now, upload image
              this.applicationErrorService.getDocsPresignedUrl(config.ImageKey || '', 'PUT')
                .subscribe(
                  q => {
                    console.log('File to upload?', config.FileToUpload);
                    if(config.FileToUpload) {
                      this.applicationErrorService.uploadFile(config.FileToUpload, q.s3PresignedUrl)
                        .subscribe(
                          q => {
                            console.log('File uploaded', q);
                          }
                        )
                    }
                    self.onApplicationSaved(true);
                  });
            } else {
              self.onApplicationSaved(true);
            }
          },
          e => {
            self.onApplicationSaved(false, e);
          },
          () => {
            this.applicationErrorConfigs = [...this.applicationErrorConfigs];
            this.showDialog = false;
            this.applicationErrorConfig ={ ApplicationId: '',  Region: '', Description: '', DlqName: '', DlqErrorCount: 0};
          }
        );

    }
  }

  onApplicationSaved(isSuccess: boolean, e?: Error) {
    this.errorMsg = '';
    this.isLoading = false;

    if(isSuccess) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: "Application saved",
        life: 5000
      });
      this.loadApplicationErrorConfigs();
    } else {
      console.log(e);
      this.messageService.add({
        severity: 'error',
        summary: 'Update failed',
        detail: e?.message,
        life: 5000
      });
    }
  }

  findIndexById(id: string): number {
    const index = this.applicationErrorConfigs.map(e => e.ApplicationId).indexOf(id);
    console.log('index:', index);
    return index;
  }

  selectFileToUpload(event: any) {
    console.log(event);
    const file: File = event.target.files[0];
    if(file) {
      console.log(file.name);
      this.applicationErrorConfig.FileToUpload = file;
      this.applicationErrorConfig.ImageKey = `${this.applicationErrorConfig.ApplicationId}/${file.name}`;
    }
  }

  viewImage(rec: IApplicationErrorConfig) {
    const self = this;
    this.applicationErrorConfig = rec;
    console.log(rec.ImageKey);

    self.isLoading = true;
    this.applicationErrorService.getDocsPresignedUrl(rec.ImageKey || '', 'GET')
      .subscribe(
        q => {
          console.log(q);
          self.imageUrl = q.s3PresignedUrl;
          console.log(self.imageUrl);
          self.errorMsg = '';
          self.showImageDialog = true;
          self.isLoading = false;
        },
        e=> {
          console.log(e);
          self.isLoading = false;
        })
  }

  protected readonly event = event;
}
