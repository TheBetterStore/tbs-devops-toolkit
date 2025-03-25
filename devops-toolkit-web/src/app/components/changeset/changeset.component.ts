import { Component } from '@angular/core';
import {StackService} from "../../services/stack.service";
import {ParameterService} from "../../services/parameter.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
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

@Component({
  selector: 'app-changeset',
  standalone: true,
  imports: [TableModule, DropdownModule, ToastModule,ProgressSpinnerModule, ConfirmDialogModule,
    ToolbarModule, ButtonModule, FormsModule, InputTextModule, NgIf],
  templateUrl: './changeset.component.html',
  styleUrl: './changeset.component.scss'
})
export class ChangesetComponent {
  isLoading = false;
  errorMsg: string = "";
  infoMsg: string = ""

  changesetId: string

  changeset: any;

  pageSize = 20;
  offset = 0;

  sub: any;

  selectedResourceChange: any;
  changesJson: string = '';

  constructor(private stackService: StackService,
              private parameterService: ParameterService,
              private router: Router,
              private route: ActivatedRoute,
              private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.changesetId = this.route.snapshot.paramMap.get('changesetId') + "";
    console.log(this.changesetId);
  }

  ngOnInit(): void {
    this.initialise();
  }

  initialise() {
    this.loadChangeSet(this.changesetId);
  }

  loadChangeSet(changesetId: string) {
    const self = this;
    self.isLoading = true;
    this.stackService.getChangeSet(changesetId)
      .subscribe(
        p => {
          console.log(p);
          self.changeset = p;

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

  onExecuteClicked() {
    const self = this;
    self.isLoading = true;
    this.stackService.executeChangeSet(this.changesetId)
      .subscribe(
        p => {
          console.log(p);
          self.changeset = p;
          this.loadChangeSet(this.changesetId);
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


  onReturnClicked() {
    console.log(this.changeset);
    this.router.navigate(['/stacks', this.changeset.StackName]);
  }

  onRowSelect(event: any) {
    console.log(event);
    this.selectedResourceChange = event.data.ResourceChange;
    this.changesJson = JSON.stringify(this.selectedResourceChange.Details, null, 2);
  }

  onRowUnselect(event: any) {
    console.log(event);
    this.selectedResourceChange = event.data.ResourceChange;
    this.changesJson = JSON.stringify(this.selectedResourceChange.Details, null, 2);
  }
}
