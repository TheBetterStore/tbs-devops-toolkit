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
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {MessageService} from "primeng/api";
import {ComplianceService} from "../../services/compliance.service";
import {IComplianceByConfigRule} from "../../../models/compliance-byconfig-rule";
import {BaseComponent} from "../base.component";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
  selector: 'app-compliance',
  standalone: true,
  imports: [TableModule, DropdownModule, ToastModule,ProgressSpinnerModule, ConfirmDialogModule,
    ToolbarModule, ButtonModule, FormsModule, InputTextModule, NgIf, RouterLink],
  templateUrl: './compliance.component.html',
  styleUrl: './compliance.component.scss'
})
export class ComplianceComponent extends BaseComponent {
  isLoading = false;
  errorMsg: string = "";
  infoMsg: string = "";

  pageSize = 50;

  sub: any;
  rules: IComplianceByConfigRule[];
  selectedRule: any;

  constructor(authenticationService: AuthenticationService, private complianceService: ComplianceService,
              private router: Router, private route: ActivatedRoute,
              private messageService: MessageService) {
    super(authenticationService);
    this.rules = [];

    this.loadRules(false);

  }

  loadRules(getMore: boolean) {
    const self = this;
    console.log("Loading");
    self.isLoading = true;
    this.complianceService.getConfigRules()
      .subscribe(
        p => {
          console.log(p);
          self.rules = p;
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
    return JSON.stringify(this.rules, null, 2);
  }

  resetCounts() {
    const self = this;
    this.complianceService.resetNonComplianceRuleCounts()
      .subscribe(
        p => {
          console.log(p);
          self.errorMsg = '';
          self.isLoading = false;
        },
        e => {
          console.log(e);
          self.messageService.add({
            severity: 'error',
            summary: 'Rule counts reset failed',
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
