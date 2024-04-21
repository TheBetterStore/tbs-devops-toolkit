import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {Amplify} from 'aws-amplify';
//import aws_exports from './aws-exports';
import amplifyconfig from './amplifyconfiguration.json';
import {FooterComponent} from "./app/components/template/footer/footer.component";
import {NavbarComponent} from "./app/components/template/navbar/navbar.component";

Amplify.configure(amplifyconfig);

bootstrapApplication(AppComponent, appConfig)
  .then(appRef => {
    appRef.bootstrap(NavbarComponent)
  })
  .catch((err) => console.error(err));

