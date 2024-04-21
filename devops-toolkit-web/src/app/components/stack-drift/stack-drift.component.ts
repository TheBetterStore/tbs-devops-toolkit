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
import {BaseComponent} from "../base.component";
import {AuthenticationService} from "../../services/authentication.service";
import {StackService} from "../../services/stack.service";
import {ParameterService} from "../../services/parameter.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
  selector: 'app-stack-drift',
  standalone: true,
  imports: [TableModule, DropdownModule, ToastModule,ProgressSpinnerModule, ConfirmDialogModule,
    ToolbarModule, ButtonModule, FormsModule, InputTextModule, NgIf],
  templateUrl: './stack-drift.component.html',
  styleUrl: './stack-drift.component.scss'
})
export class StackDriftComponent extends BaseComponent {
  isLoading = false;
  errorMsg: string = "";
  infoMsg: string = "";
  stackName: string;

  drifts?: any
  sub: any;

  constructor(authenticationService: AuthenticationService, private stackService: StackService,
              private parameterService: ParameterService,
              private router: Router,
              private route: ActivatedRoute,
              private messageService: MessageService, private confirmationService: ConfirmationService) {
    super(authenticationService);
    this.stackName = this.route.snapshot.paramMap.get('stackName') + "";
  }

  ngOnInit(): void {
    this.initialise();
  }

  initialise() {
    this.loadStackResourceDrifts(this.stackName);
  }

  loadStackResourceDrifts(stackName: string) {
    const self = this;
    this.stackService.describeResourceDrifts(stackName)
      .subscribe(
        p => {
          console.log(p);
          this.drifts = p;
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

  jsonStringify(json: string) {
    return JSON.stringify(json);
  }
}
