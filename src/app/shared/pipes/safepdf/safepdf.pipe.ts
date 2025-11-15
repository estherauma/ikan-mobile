import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safepdf',
  standalone: false
})
export class SafepdfPipe implements PipeTransform {
  
  constructor(
    public sanitizer: DomSanitizer,
  ) {}
  
  transform(value: any) {
    if (value) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(value);
    }
    return null;
  }

}