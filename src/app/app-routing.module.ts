import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { PropertiesComponent } from './components/properties/properties.component';
import { PropertyDetailsComponent } from './components/property-details/property-details.component';

const routes: Routes = [
  {path:'login', component:LoginComponent},
  {path:'main',component:MainComponent,
    children:[
      {
        path:'properties',
        component:PropertiesComponent,
        // canActivate:[AuthGuard]
      },
      {
        path:'properties/:id',
        component:PropertyDetailsComponent,
        // canActivate:[AuthGuard]
      }
    ]
  },
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'**', component:LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
