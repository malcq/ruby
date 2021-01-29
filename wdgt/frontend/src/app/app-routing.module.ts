import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';

import { AuthRedirectGuard } from './_core/auth-redirect.guard';

import { ROUTES } from './config/router';

const routes: Routes = [
  { path: '', redirectTo: `/${ROUTES.chat}`, pathMatch: 'full' },
  { path: ROUTES.login, component: LoginComponent },
  { path: ROUTES.chat, component: ChatComponent, canActivate: [AuthRedirectGuard] },
  { path: '**', redirectTo: `/${ROUTES.chat}`, pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
