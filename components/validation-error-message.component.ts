import { Component, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-validation-message',
  template: '<mat-error class="mat-validation-error" [class.hidden]="hide">{{textMessage}}</mat-error>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationMessageComponent {
    textMessage = '';
    hide = true;

    @Input()
    set text(value: string) {
        if(this.textMessage !== value) {
            this.textMessage = value;
            this.hide = false;
            this.cdr.detectChanges();
        }
    }

    constructor(private cdr: ChangeDetectorRef) { }
}
