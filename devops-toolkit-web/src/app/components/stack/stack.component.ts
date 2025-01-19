import { Component } from '@angular/core';
import {TableModule} from "primeng/table";
import {DropdownModule} from "primeng/dropdown";
import {ToastModule} from "primeng/toast";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {StackService} from "../../services/stack.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {IStack} from "../../../models/stack.interface";
import {IParameterFilter} from "../../../models/parameter-filter.interface";
import {IParameter} from "../../../models/parameter.interface";
import {ParameterService} from "../../services/parameter.service";
import {BaseComponent} from "../base.component";
import {AuthenticationService} from "../../services/authentication.service";
import {DialogModule} from "primeng/dialog";

@Component({
  selector: 'app-stack',
  standalone: true,
  imports: [TableModule, DropdownModule, ToastModule,ProgressSpinnerModule, ConfirmDialogModule, DialogModule,
    ToolbarModule, ButtonModule, FormsModule, InputTextModule, NgIf],
  templateUrl: './stack.component.html',
  styleUrl: './stack.component.scss'
})
export class StackComponent extends BaseComponent {
  isLoading = false;
  errorMsg: string = "";
  infoMsg: string = "";

  stackName: string;

  stack?: IStack;

  parameters: IParameter[] = [];
  parameterResponse: any;
  selectedParam: IParameter = {
    ARN: "",
    DataType: "",
    LastModifiedDate: undefined,
    Name: "",
    Type: "",
    Value: "",
    Version: 0
  };
  nextToken: string = "";
  maxRowsPerPage = 20;
  pageSize = 20;
  offset = 0;

  sub: any;

  hasMoreParameters = false;

  createdChangesetId = "";

  securityTag = "";

  displayParamDialog = false;
  paramSubmitted = false;

  constructor(authenticationService: AuthenticationService, private stackService: StackService,
              private parameterService: ParameterService,
              private router: Router,
              private route: ActivatedRoute,
              private messageService: MessageService, private confirmationService: ConfirmationService) {
    super(authenticationService);
    this.stackName = this.route.snapshot.paramMap.get('stackName') + "";
    this.initialise();
  }

  ngOnInit(): void {
    this.initialise();
  }

  initialise() {
    this.loadStack(this.stackName);
    this.loadParameters(this.stackName, false);

    this.selectedParam = {
      ARN: "",
      DataType: "",
      LastModifiedDate: undefined,
      Name: "",
      Type: "",
      Value: "",
      Version: 0
    };
  }


  loadStack(stackName: string) {
    const self = this;
    this.stackService.getStacks(stackName, "")
      .subscribe(
        p => {
          if(p && p.length == 1) {
            self.stack = p[0];
            // console.log(self.stack);
            self.securityTag = "";
            const tags = self.stack?.Tags;
            const securityTag = tags.find((x: { Key: string; }) => x.Key == 'security');
            self.securityTag = (securityTag?.Value ? securityTag?.Value : "");
            if(self.stack?.Parameters) {
              self.stack.Parameters.sort((a: any, b: any) => {
                const x = a.ParameterKey;
                const y = b.ParameterKey;
                if(x < y) {
                  return -1
                }
                if(x > y) {
                  return 1;
                }
                return 0;
              });
            }
          }
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

  loadParameters(stackName: string, getMore: boolean): void {
    const self = this;
    let sortOrder = 1; // Ascending, -1 = Descending
    let sortField = "";

    console.log("Loading");
    self.isLoading = true;
    self.parameters = [];

    const nameFilter: IParameterFilter = {Key: "Name", Option: "BeginsWith", Values: `/${stackName}`}

    let nextToken = "";
    this.hasMoreParameters = false;
    if(getMore && this.nextToken) {
      nextToken = this.nextToken;
    }

    this.parameterService.getParameters([nameFilter], this.pageSize, this.offset, sortField, sortOrder, nextToken)
      .subscribe(
        p => {
          console.log(p)
          self.parameterResponse = p;
          self.parameters = this.mapParameters(p.Parameters);
          self.nextToken = p.NextToken;
          self.errorMsg = '';
          self.isLoading = false;
          if(p.NextToken && p.Parameters && p.Parameters.length > 0) {
            this.hasMoreParameters = true;
          }
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

  mapParameters(s: any): any {
    for(let i = 0; i < s.length; i++) {
      const ssmParamKey = s[i].Name;
      const ssmParamValue = s[i].Value;
      if(this.stack?.Parameters) {
        let stackParams = this.stack.Parameters;
        const stackParam = stackParams.filter(function (o: any) {
          return o.ParameterValue == ssmParamKey;
        });
        if(stackParam && stackParam.length == 1 && stackParam[0].ResolvedValue != ssmParamValue) {
          s[i].HasChanged = true;
        }
      }
    }
    s.sort((a: any, b: any) => {
      const x = a.Name;
      const y = b.Name;
      if(x < y) {
        return -1
      }
      if(x > y) {
        return 1;
      }
      return 0;
    });
    return s;
  }

  getMore() {
    if(this.hasMoreParameters) {
      this.loadParameters(this.stackName, true);
    }
  }

  reloadParams() {
    this.loadParameters(this.stackName, false);
  }

  cancelUpdateParam() {
    this.selectedParam.Value = this.selectedParam.OriginalValue + "";
    this.displayParamDialog = false;
  }

  updateParam() {
    const self = this;

    if(this.selectedParam && this.selectedParam.Name) {
      const paramName = this.selectedParam.Name;

      this.confirmationService.confirm({
        message: `Confirm update of parameter ${paramName} value to ${this.selectedParam.Value}?`,
        header: "Parameter update",
        reject: () => {
          this.displayParamDialog = false;
        },
        accept: () => {
          self.isLoading = true;
          this.parameterService.updateParameter(paramName, this.selectedParam.Value)
            .subscribe(
              p => {
                self.messageService.add({
                  severity: 'info',
                  summary: 'Success',
                  detail: "Parameter updated",
                  life: 5000
                });
                self.errorMsg = '';
                self.isLoading = false;
                this.displayParamDialog = false;
                this.reloadParams();
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
      });
    }
  }

  createChangeSet() {
    console.log('Creating changeset');
    const self = this;
    self.isLoading = true;
    this.stackService.createChangeSet(this.stackName)
      .subscribe(
        p => {
          this.createdChangesetId = p.Id;
          self.messageService.add({
            severity: 'info',
            summary: 'Success',
            detail: "Changeset created",
            life: 5000
          });
          self.errorMsg = '';
          self.isLoading = false;
          this.reloadParams();
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

  editParam(param: IParameter) {
    this.selectedParam = param;
    this.displayParamDialog = true;
  }

  hasCreatedChangeSet() {
    return this.createdChangesetId != ""
  }
  viewCreatedChangeSet() {
    console.log(this.createdChangesetId);
    this.router.navigate(['/changesets', this.createdChangesetId]);
  }
}
