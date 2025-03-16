import { Routes } from '@angular/router';
import {AboutComponent} from "./components/about/about.component";
import {LoginComponent} from "./components/login/login.component";
import {AuthGuard} from "./guards/auth.guard";
import {HomeComponent} from "./components/home/home.component";
import {StacksComponent} from "./components/stacks/stacks.component";
import {ParametersComponent} from "./components/parameters/parameters.component";
import {LogoutComponent} from "./components/logout/logout.component";
import {StackComponent} from "./components/stack/stack.component";
import {ChangesetComponent} from "./components/changeset/changeset.component";
import {ViewAuthGuard} from "./guards/view-auth.guard";
import {MaintainAuthGuard} from "./guards/maintain-auth.guard";
import {StackDriftComponent} from "./components/stack-drift/stack-drift.component";
import {ComplianceComponent} from "./components/compliance/compliance.component";
import {ComplianceDetailsComponent} from "./components/compliance-details/compliance-details.component";
import {
  ApplicationErrorConfigsComponent
} from "./components/application-error-configs/application-error-configs.component";
import {ApplicationErrorCodesComponent} from "./components/application-error-codes/application-error-codes.component";
import {ApplicationErrorsComponent} from "./components/application-errors/application-errors.component";

export const routes: Routes = [
  {path: 'about', component: AboutComponent, canActivate: [AuthGuard()]},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard()]},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'app-error-configs', component: ApplicationErrorConfigsComponent, canActivate: [ViewAuthGuard()]},
  {path: 'app-error-codes', component: ApplicationErrorCodesComponent, canActivate: [ViewAuthGuard()]},
  {path: 'app-errors', component: ApplicationErrorsComponent, canActivate: [ViewAuthGuard()]},
  {path: 'compliance', component: ComplianceComponent, canActivate: [ViewAuthGuard()]},
  {path: 'compliance/:ruleName', component: ComplianceDetailsComponent, canActivate: [ViewAuthGuard()]},
  {path: 'stacks', component: StacksComponent, canActivate: [ViewAuthGuard()]},
  {path: 'stacks/:stackName', component: StackComponent, canActivate: [ViewAuthGuard()]},
  {path: 'stacks/:stackName/drift', component: StackDriftComponent, canActivate: [ViewAuthGuard()]},
  {path: 'changesets/:changesetId', component: ChangesetComponent, canActivate: [MaintainAuthGuard()]},
  {path: 'parameters', component: ParametersComponent, pathMatch: 'full', canActivate: [ViewAuthGuard()]},
  {path: 'login', component: LoginComponent},
  {path: 'logout', component: LogoutComponent}
];
