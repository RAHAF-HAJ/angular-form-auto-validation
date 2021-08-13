import { Directive, ElementRef, Input, Host, Optional, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { RepeaterFormGroupDirective } from '@libs/shared/forms/components/repeater-form-group.directive';
import { FormArrayService } from '@libs/shared/forms/services/form-array.service';
import { SnackBarNotificationService } from '@libs/shared/notifications/services/snackbar-notification.service';
@Directive({
    selector: '[repeater-add]'
})

export class RepeaterAddDirective implements OnInit, OnDestroy {
    @Input('repeater-add') fields: FormGroup | FormControl | FormArray;
    @Input() repeaterFormArrayName: string;
    @Input() repeaterFormGroup: FormGroup;

    destroy$ = new Subject();
    isAddingAllowedProp = true;
    constructor(public element: ElementRef,
        public renderer: Renderer2,
        private snackBarNotificationService: SnackBarNotificationService,
        @Optional() @Host() private repeatableFormGroupDirective: RepeaterFormGroupDirective,
        private formArrayService: FormArrayService
    ) { }

    @Input() set isAddingAllowed(cond: boolean) {
        this.isAddingAllowedProp = cond;
        if(cond) {
            this.renderer.removeAttribute(this.element.nativeElement, 'disabled');
        }
        else {
            this.renderer.setAttribute(this.element.nativeElement, 'disabled', 'true');
        }
    };

    ngOnInit() {
        fromEvent(this.element.nativeElement, 'click').pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => {
            const formArray = this.formArrayService.getFormArrayItems(this.repeaterFormArrayName,
                this.repeaterFormGroup);
                let isLastRowValid = true;
            //Get the last entered row
            if(formArray && formArray.length > 0) {
                const lastRow = formArray.controls[formArray.length - 1];
                if(lastRow.invalid) {
                    this.snackBarNotificationService.warning('shared.error.repeater');
                    isLastRowValid = false;
                }
                else {
                    isLastRowValid = true;
                }
            }
            if(isLastRowValid) {
                this.addNewRow();
            }
        });
    }

    addNewRow() {
        if (this.fields && this.repeaterFormArrayName && this.repeaterFormGroup && this.isAddingAllowedProp) {
            this.formArrayService.addItemToFormArray(this.repeaterFormArrayName,
                this.repeaterFormGroup, this.fields);
            if (this.repeatableFormGroupDirective) {
                this.repeatableFormGroupDirective.cdr.detectChanges();
            }
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
    }
}
