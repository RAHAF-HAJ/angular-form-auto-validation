import { Directive, ElementRef, Input, Host, Optional, OnInit, OnDestroy } from '@angular/core';
import {RepeaterFormArrayDirective} from '@libs/shared/forms/components/repeater-form-array.directive';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Directive({
    selector: '[repeater-remove]'
})

export class RepeaterRemoveDirective implements OnInit, OnDestroy {
    @Input('repeater-remove') index: number;
    destroy$ = new Subject();
    constructor(public element: ElementRef,
        @Optional() @Host() private formArrayRepeaterDirective: RepeaterFormArrayDirective) {
    }

    ngOnInit() {
        fromEvent(this.element.nativeElement, 'click').pipe(
            takeUntil(this.destroy$)
        ).subscribe(() => {
            if(this.index || this.index === 0) {
                this.formArrayRepeaterDirective.removeControlFromArray(this.index);
            }
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
    }
}
