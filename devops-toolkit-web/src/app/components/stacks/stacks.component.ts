import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import {DropdownModule} from "primeng/dropdown";
import {ToastModule} from "primeng/toast";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {IStack} from "../../../models/stack.interface";
import {StackService} from "../../services/stack.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";
@Component({
  selector: 'app-stacks',
  standalone: true,
  imports: [TableModule, DropdownModule, ToastModule,ProgressSpinnerModule, ConfirmDialogModule,
    ToolbarModule, ButtonModule, FormsModule, InputTextModule, NgIf],
  templateUrl: './stacks.component.html',
  styleUrl: './stacks.component.scss'
})
export class StacksComponent {

  isLoading = false;
  errorMsg: string = "";
  infoMsg: string = "";

  maxRowsPerPage = 20;
  pageSize = 10;

  cols: any[] = [];
  sub: any;
  stacks: IStack[];
  selectedStack?: IStack = undefined;

  stackName: string = "";
  nextToken: string = "";

  constructor(private stackService: StackService, private router: Router, private route: ActivatedRoute,
              private messageService: MessageService) {
    this.stacks = [];

    this.sub = this.route.queryParamMap
      .subscribe(params => {
        let stackName = params?.get('stackName');
        if(stackName) {
          this.stackName = stackName;
        }
        this.loadStacks(this.stackName, false);
      });
  }

  loadStacks(stackName: string, getMore: boolean) {
    const self = this;
    let sortOrder = 1; // Ascending, -1 = Descending
    let sortField = "";

    console.log("Loading");
    console.log(stackName);
    self.isLoading = true;
    self.stacks = [];
    self.selectedStack = undefined;

    let nextToken = "";
    if(getMore && this.nextToken) {
      nextToken = this.nextToken;
    }

    this.stackService.getStacks(stackName, nextToken)
      .subscribe(
        p => {
          console.log(p);
          self.stacks = p.Stacks;
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

  onRowSelect(row: any) {
    this.selectedStack = row;
    console.log(this.selectedStack);
  }

  onRowUnselect(event: any) {
    console.log(event);
    this.selectedStack = undefined;
    console.log(this.selectedStack);
  }

  detectDrift(stack: IStack) {
    const self = this;
    console.log(stack.StackName);
    self.isLoading = true;

    this.stackService.checkDrift(stack.StackName)
      .subscribe(
        p => {
          console.log(p);
          // this.loadStacks("", false);
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
  describeDrift(stack: IStack) {
    this.router.navigate([`/stacks/${stack.StackName}/drift`]);
  }

}
