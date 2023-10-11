import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { NotecreatePage } from '../notecreate/notecreate.page';
import { ContentService } from 'src/app/shared/services/content/content.service';

@Component({
  selector: 'app-noteplayback',
  templateUrl: './noteplayback.page.html',
  styleUrls: ['./noteplayback.page.scss'],
})
export class NoteplaybackPage implements OnInit {
  commonText: any;
  loadingNote: false;
  audioNote;
  audioNoteParams;
  constructor(
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    public router: Router,
    public contentService: ContentService,
  ) { }

  ngOnInit() {
    this.commonText = this.contentService?.commonText;
    this.activatedRoute.params.subscribe((params) => {
      this.audioNote = this.sanitizer.bypassSecurityTrustResourceUrl(params.file);//use url
      this.audioNoteParams = params;
    });
  }

  async onSave() {
    const modal = await this.modalCtrl.create({
      component: NotecreatePage,
      cssClass: 'tuna-modal'
    });

    modal.present();
    modal.onDidDismiss().then((noteData) => {
      this.router.navigate(
        [ this.audioNoteParams?.previousUrl ],
        { 
          queryParams: {name: noteData?.data?.name, ...this.audioNoteParams},
          replaceUrl: true,
        }
      );
    });
  }

  onDelete() {
    this.router.navigate(['/workers/recordnote'], { replaceUrl: true });
  }

}
