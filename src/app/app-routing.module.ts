import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'password-reset',
    loadChildren: () => import('./auth/password-reset/password-reset.module').then( m => m.PasswordResetPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'baseform',
    loadChildren: () => import('./shared/components/baseform/baseform.module').then( m => m.BaseformPageModule)
  },
  {
    path: 'workorders/home',
    loadChildren: () => import('./workorders/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'change-language',
    loadChildren: () => import('./language/language.module').then( m => m.LanguagePageModule)
  },
  {
    path: 'workorders/create',
    loadChildren: () => import('./workorders/create/create.module').then( m => m.CreatePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
