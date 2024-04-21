import { Component } from '@angular/core';
import {IParameter} from "../../../models/parameter.interface";
import {ParameterService} from "../../services/parameter.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {TableModule} from "primeng/table";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {IParameterFilter} from "../../../models/parameter-filter.interface";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {NgIf} from "@angular/common";
import {ToastModule} from "primeng/toast";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {DialogModule} from "primeng/dialog";

@Component({
  selector: 'app-parameters',
  standalone: true,
  imports: [TableModule, DropdownModule, ToastModule,ProgressSpinnerModule, ConfirmDialogModule, DialogModule,
    ToolbarModule, ButtonModule, FormsModule, InputTextModule, NgIf],
  templateUrl: './parameters.component.html',
  styleUrl: './parameters.component.scss'
})
export class ParametersComponent {


  isLoading = false;
  errorMsg: string = "";
  infoMsg: string = "";

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


  maxRowsPerPage = 20;
  pageSize = 20;
  offset = 0;
  rowsPerPageList = [5, 25, 50, 100, this.maxRowsPerPage];

  cols: any[] = [];
  sub: any;

  filterOptions = ["BeginsWith", "Contains", "Equals"];

  nameFilter: IParameterFilter = {Key: "Name", Option: "Contains", Values: "/"}

  //filters: IParameterFilter[] = [{Key: "Name", Option: "Contains", Values: "/"}]

  nextToken: string = "";
  displayParamDialog = false;

  constructor(private parameterService: ParameterService, private route: ActivatedRoute,
              private messageService: MessageService, private confirmationService: ConfirmationService,
              private router: Router) { }

  ngOnInit(): void {

    this.cols = [
      { field: 'imageUrl', header: '', width: '15%', filterMatchMode: 'contains' },
      { field: 'name', header: 'Name', width: '20%', filterMatchMode: 'contains' },
      { field: 'brand', header: 'Brand', width: '15%', filterMatchMode: 'contains' },
      { field: 'price', header: 'Price', width: '22%', filterMatchMode: 'contains', },

    ];

    console.log(this.route.snapshot.paramMap);

    this.sub = this.route.queryParamMap
      .subscribe(params => {
        let searchPrefix = params?.get('prefix') + '';
        if(searchPrefix) {
          this.nameFilter = {Key: "Name", Option: "BeginsWith", Values: searchPrefix};
        }
        this.loadParameters([this.nameFilter], false);
      });

  }

  loadParameters(filters: IParameterFilter[], getMore: boolean): void {
    const self = this;
    let sortOrder = 1; // Ascending, -1 = Descending
    let sortField = "";

    console.log("Loading");
    self.isLoading = true;
    self.parameters = [];
    self.selectedParam = {
      ARN: "",
      DataType: "",
      LastModifiedDate: undefined,
      Name: "",
      Type: "",
      Value: "",
      Version: 0
    };

    let nextToken = "";
    if(getMore && this.nextToken) {
      nextToken = this.nextToken;
    }

    this.parameterService.getParameters(filters, this.pageSize, this.offset, sortField, sortOrder, nextToken)
      .subscribe(
        p => {
          console.log(p);
          console.log(p.NextToken);
          self.parameterResponse = p;
          self.parameters = p.Parameters;
          self.nextToken = p.NextToken;
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

  search() {
    this.loadParameters([this.nameFilter], false);
  }

  getMore() {
    this.loadParameters([this.nameFilter], true);
  }

  reloadParams() {
    this.loadParameters( [this.nameFilter], false);
  }

  cancelUpdateParam() {
    this.selectedParam.Value = this.selectedParam.OriginalValue + "";
    this.displayParamDialog = false;
  }

  editParam(param: IParameter) {
    this.selectedParam = param;
    this.displayParamDialog = true;
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
}
