import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeurl'
})
export class SafeurlPipe implements PipeTransform {

  constructor(
    public sanitizer: DomSanitizer,
  ) {}

  transform(value: any) {
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }

}
