import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login-method',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'auth/password-reset',
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
  },
  {
    path: 'workorders/view',
    loadChildren: () => import('./workorders/view/view.module').then( m => m.ViewPageModule)
  },
  {
    path: 'vessels/home',
    loadChildren: () => import('./vessels/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'vessels/view',
    loadChildren: () => import('./vessels/view/view.module').then( m => m.ViewPageModule)
  },
  {
    path: 'vessels/create/stepone',
    loadChildren: () => import('./vessels/create/stepone/stepone.module').then( m => m.SteponePageModule)
  },
  {
    path: 'vessels/create/steptwo',
    loadChildren: () => import('./vessels/create/steptwo/steptwo.module').then( m => m.SteptwoPageModule)
  },
  {
    path: 'vessels/archived-wo',
    loadChildren: () => import('./vessels/archived-wo/archived-wo.module').then( m => m.ArchivedWoPageModule)
  },
  {
    path: 'auth/login-method',
    loadChildren: () => import('./auth/login-method/login-method.module').then( m => m.LoginMethodPageModule)
  },
  {
    path: 'auth/invite-code',
    loadChildren: () => import('./auth/invite-code/invite-code.module').then( m => m.InviteCodePageModule)
  },
  {
    path: 'auth/how-to-signup',
    loadChildren: () => import('./auth/how-to-signup/how-to-signup.module').then( m => m.HowToSignupPageModule)
  },
  {
    path: 'auth/password-reset-success',
    loadChildren: () => import('./auth/password-reset-success/password-reset-success.module').then( m => m.PasswordResetSuccessPageModule)
  },
  {
    path: 'auth/create-password',
    loadChildren: () => import('./auth/create-password/create-password.module').then( m => m.CreatePasswordPageModule)
  },
  {
    path: 'demandletters/home',
    loadChildren: () => import('./demandletters/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'demandletters/create',
    loadChildren: () => import('./demandletters/create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'demandletters/view',
    loadChildren: () => import('./demandletters/view/view.module').then( m => m.ViewPageModule)
  },
  {
    path: 'workorders/select',
    loadChildren: () => import('./workorders/select/select.module').then( m => m.SelectPageModule)
  },
  {
    path: 'demandletters/send',
    loadChildren: () => import('./demandletters/send/send.module').then( m => m.SendPageModule)
  },
  {
    path: 'optionselect',
    loadChildren: () => import('./shared/components/optionselect/optionselect.module').then( m => m.OptionselectPageModule)
  },
  {
    path: 'contracts/view',
    loadChildren: () => import('./contracts/view/view.module').then( m => m.ViewPageModule)
  },
  {
    path: 'contracts/home',
    loadChildren: () => import('./contracts/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'dashboard/indonesianagent',
    loadChildren: () => import('./dashboard/indonesianagent/indonesianagent.module').then( m => m.IndonesianagentPageModule)
  },
  {
    path: 'dashboard/vesselowner',
    loadChildren: () => import('./dashboard/vesselowner/vesselowner.module').then( m => m.VesselownerPageModule)
  },
  {
    path: 'dashboard/worker',
    loadChildren: () => import('./dashboard/worker/worker.module').then( m => m.WorkerPageModule)
  },
  {
    path: 'dashboard/taiwaneseagent',
    loadChildren: () => import('./dashboard/taiwaneseagent/taiwaneseagent.module').then( m => m.TaiwaneseagentPageModule)
  },
  {
    path: 'dashboard/buyer',
    loadChildren: () => import('./dashboard/buyer/buyer.module').then( m => m.BuyerPageModule)
  },
  {
    path: 'intro',
    loadChildren: () => import('./intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./accounts/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'payments/home',
    loadChildren: () => import('./payments/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'payments/view/company',
    loadChildren: () => import('./payments/view/company/company.module').then( m => m.CompanyPageModule)
  },
  {
    path: 'payments/view/details',
    loadChildren: () => import('./payments/view/details/details.module').then( m => m.DetailsPageModule)
  },
  {
    path: 'payments/create',
    loadChildren: () => import('./payments/create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'feedbackdashboard/home',
    loadChildren: () => import('./feedbackdashboard/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'agents/home',
    loadChildren: () => import('./agents/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'agents/details',
    loadChildren: () => import('./agents/details/details.module').then( m => m.DetailsPageModule)
  },
  {
    path: 'notifications/home',
    loadChildren: () => import('./notifications/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'learninghub/home',
    loadChildren: () => import('./learninghub/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'learninghub/detail',
    loadChildren: () => import('./learninghub/detail/detail.module').then( m => m.DetailPageModule),
  },
  {
    path: 'profiles/taiwanese',
    loadChildren: () => import('./profiles/taiwanese/taiwanese.module').then( m => m.TwaiwanesePageModule)
  },
  {
    path: 'workers/home',
    loadChildren: () => import('./workers/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'workers/details',
    loadChildren: () => import('./workers/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'workers/create',
    loadChildren: () => import('./workers/create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'workers/createdetail',
    loadChildren: () => import('./workers/createdetail/createdetail.module').then( m => m.CreatePageModule)
  },
  {
    path: 'mydocuments/home',
    loadChildren: () => import('./mydocuments/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'mydocuments/files',
    loadChildren: () => import('./mydocuments/files/files.module').then( m => m.FilesPageModule)
  },
  {
    path: 'worker/profiles',
    loadChildren: () => import('./workers/profiles/worker/worker.module').then( m => m.WorkerPageModule)
  },
  {
    path: 'buyers/home',
    loadChildren: () => import('./buyers/reporting/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'buyers/create',
    loadChildren: () => import('./buyers/reporting/create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'workers/training',
    loadChildren: () => import('./workers/training/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'workers/status',
    loadChildren: () => import('./workers/training/status/status.module').then( m => m.StatusPageModule)
  },
  {
    path: 'workers/recordnote',
    loadChildren: () => import('./workers/training/recordnote/recordnote.module').then( m => m.RecordnotePageModule)
  },
  {
    path: 'workers/noteplayback',
    loadChildren: () => import('./workers/training/noteplayback/noteplayback.module').then( m => m.NoteplaybackPageModule)
  },
  {
    path: 'workers/notecreate',
    loadChildren: () => import('./workers/training/notecreate/notecreate.module').then( m => m.NotecreatePageModule)
  },
  {
    path: 'todo/home',
    loadChildren: () => import('./todo/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'todo/placement',
    loadChildren: () => import('./todo/placement/placement.module').then( m => m.PlacementPageModule)
  },
  {
    path: 'todo/new',
    loadChildren: () => import('./todo/new/new.module').then( m => m.NewPageModule)
  },
  {
    path: 'todo/list',
    loadChildren: () => import('./todo/list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'todo/badges',
    loadChildren: () => import('./todo/badges/badges.module').then( m => m.BadgesPageModule)
  },
  {
    path: 'todo/create',
    loadChildren: () => import('./todo/create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: 'todo/badgeinfo',
    loadChildren: () => import('./todo/badgeinfo/badgeinfo.module').then( m => m.BadgeinfoPageModule)
  },
  {
    path: 'mydocuments/createpassport',
    loadChildren: () => import('./mydocuments/createpassport/createpassport.module').then( m => m.CreatepassportPageModule)
  },
  {
    path: 'mydocuments/details',
    loadChildren: () => import('./mydocuments/details/details.module').then( m => m.DetailsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
