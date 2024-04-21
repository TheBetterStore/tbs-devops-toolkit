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
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {IComplianceByConfigRule} from "../../../models/compliance-byconfig-rule";
import {ComplianceService} from "../../services/compliance.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-compliance-details',
  standalone: true,
  imports:[TableModule, DropdownModule, ToastModule,ProgressSpinnerModule, ConfirmDialogModule,
    ToolbarModule, ButtonModule, FormsModule, InputTextModule, NgIf, RouterLink],
  templateUrl: './compliance-details.component.html',
  styleUrl: './compliance-details.component.scss'
})
export class ComplianceDetailsComponent {
  isLoading = false;
  errorMsg: string = "";
  infoMsg: string = "";

  pageSize = 50;

  sub: any;
  resources: any;
  selectedResource: any;
  ruleName: string;

  constructor(private complianceService: ComplianceService, private router: Router, private route: ActivatedRoute,
              private messageService: MessageService) {
    this.resources = [];

    this.ruleName = this.route.snapshot.paramMap.get('ruleName') + "";
    this.loadResources(false);

  }

  loadResources(getMore: boolean) {
    const self = this;
    console.log("Loading");
    self.isLoading = true;
    this.complianceService.getConfigRuleDetails(this.ruleName)
      .subscribe(
        p => {
          console.log(p);
          self.resources = p;
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

  JSON() {
    return JSON.stringify(this.resources, null, 2);
  }
}
