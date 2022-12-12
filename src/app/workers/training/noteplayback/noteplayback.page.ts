import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { NotecreatePage } from '../notecreate/notecreate.page';

@Component({
  selector: 'app-noteplayback',
  templateUrl: './noteplayback.page.html',
  styleUrls: ['./noteplayback.page.scss'],
})
export class NoteplaybackPage implements OnInit {
  loadingNote: false;
  audioNote;
  audioNoteParams;
  constructor(
    public modalCtrl: ModalController,
    public activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    public router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.audioNote = this.sanitizer.bypassSecurityTrustResourceUrl(params.file);
      this.audioNoteParams = params;
    });
  }

  async onSave(){
    const modal = await this.modalCtrl.create({
      component: NotecreatePage,
      cssClass: 'tuna-modal'
    });

    modal.present();
    modal.onDidDismiss().then((noteData) => {
      this.router.navigate(['/workers/status', {name: noteData.data.name, ...this.audioNoteParams}]);
    });
  }

  onDelete(){
    this.router.navigate(['/workers/recordnote']);
  }

}
