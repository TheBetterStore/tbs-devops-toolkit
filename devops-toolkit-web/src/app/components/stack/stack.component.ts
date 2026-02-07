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
import {IParameterFilter} from "../../../models/parameter-filter.interface";
import {ISSMParameter} from "../../../models/ssm-parameter.interface";
import {ParameterService} from "../../services/parameter.service";
import {BaseComponent} from "../base.component";
import {AuthenticationService} from "../../services/authentication.service";
import {DialogModule} from "primeng/dialog";
import {IStackParameter} from "../../../models/stack-parameter.interface";
import {IStack} from "../../../models/stack.interface";

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

  parameters: ISSMParameter[] = [];
  parameterResponse: any;
  selectedSsmParam: ISSMParameter = {
    ARN: "",
    DataType: "",
    LastModifiedDate: undefined,
    Name: "",
    Type: "",
    Value: "",
    Version: 0
  };

  selectedStackParam: IStackParameter = {
    ParameterKey: "",
    ParameterValue: ""
  };

  nextToken: string = "";
  maxRowsPerPage = 20;
  pageSize = 20;
  offset = 0;

  sub: any;

  hasMoreParameters = false;

  createdChangesetId = "";

  securityTag = "";

  displaySsmParamDialog = false;
  displayStackParamDialog = false;
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

    this.selectedSsmParam = {
      ARN: "",
      DataType: "",
      LastModifiedDate: undefined,
      Name: "",
      Type: "",
      Value: "",
      Version: 0
    };

    this.selectedStackParam = {
      ParameterKey: "",
      ParameterValue: ""
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
            // console.log(self.stack?.Parameters);
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
          for(let i = 0; i < self.parameters.length; i++) {
            const p = self.parameters[i];
            let x = self.stack?.Parameters.find( x => x.ParameterValue == p.Name);
            if(x && x.ResolvedValue != p.Value) {
              x.OriginalValue = x.ResolvedValue;
              x.PendingValue = p.Value
            }
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

  cancelUpdateSsmParam() {
    this.selectedSsmParam.Value = this.selectedSsmParam.OriginalValue + "";
    this.displaySsmParamDialog = false;
  }


  cancelUpdateStackParam() {
    this.selectedStackParam.ParameterValue = this.selectedStackParam.OriginalValue + "";
    this.displayStackParamDialog = false;
  }

  updateStackParam() {
    this.displayStackParamDialog = false;
  }

  updateSsmParam() {
    const self = this;

    if(this.selectedSsmParam && this.selectedSsmParam.Name) {
      const paramName = this.selectedSsmParam.Name;

      this.confirmationService.confirm({
        message: `Confirm update of parameter ${paramName} value to ${this.selectedSsmParam.Value}?`,
        header: "Parameter update",
        reject: () => {
          this.displaySsmParamDialog = false;
        },
        accept: () => {
          self.isLoading = true;
          this.parameterService.updateParameter(paramName, this.selectedSsmParam.Value)
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
                this.displaySsmParamDialog = false;
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
    if(this.stack) {
      this.stackService.createChangeSet(this.stack)
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
  }

  editSsmParam(param: ISSMParameter) {
    this.selectedSsmParam = param;
    this.displaySsmParamDialog = true;
  }

  editStackParam(param: IStackParameter) {
    if(!param.ResolvedValue) {
      this.selectedStackParam = param;
      this.displayStackParamDialog = true;
    }
    else {
      console.log(param.ParameterKey);
      const ssmParam = this.parameters.find((x) => x.Name == param.ParameterValue);
      if(ssmParam) {
        this.selectedSsmParam = ssmParam;
        this.displaySsmParamDialog = true;
      } else {
        console.log('Cannot find ssmParam');
      }

    }

  }

  hasCreatedChangeSet() {
    return this.createdChangesetId != ""
  }
  viewCreatedChangeSet() {
    console.log(this.createdChangesetId);
    this.router.navigate(['/changesets', this.createdChangesetId]);
  }
}
