import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-clauses',
    templateUrl: './clauses.page.html',
    styleUrls: ['./clauses.page.scss'],
    standalone: false
})
export class ClausesPage implements OnInit {
  clause;
  htmlContent;

  constructor(
    private route: ActivatedRoute,
    private sanitized: DomSanitizer
    ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.clause = params;
      this.htmlContent = this.sanitized.bypassSecurityTrustHtml(this.clause.description);
    });
  }

}
