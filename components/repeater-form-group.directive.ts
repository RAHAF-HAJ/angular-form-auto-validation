import { Directive, ChangeDetectorRef } from '@angular/core';

@Directive({
    selector: '[formGroup]'
})

export class RepeaterFormGroupDirective {
    constructor(public cdr: ChangeDetectorRef) {}
}
