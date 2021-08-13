import {Directive, ChangeDetectorRef} from '@angular/core';
import { FormArray } from '@angular/forms';
import { ControlContainer } from '@angular/forms';

@Directive({
    selector: '[formArrayName]'
})

export class RepeaterFormArrayDirective {
    constructor(private controlContainer: ControlContainer,
                private cdr: ChangeDetectorRef) {
    }

    removeControlFromArray(index: number) {
        (this.controlContainer.control as FormArray).removeAt(index);
        this.cdr.detectChanges();
    }
}
