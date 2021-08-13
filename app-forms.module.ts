import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepeaterFormArrayDirective }from '@libs/shared/forms/components/repeater-form-array.directive';
import { RepeaterRemoveDirective } from '@libs/shared/forms/components/repeater-form-remove-button.directive';
import { RepeaterAddDirective } from '@libs/shared/forms/components/repeater-form-add-button.directive';
import { FormArrayService } from '@libs/shared/forms/services/form-array.service';
import { SelectableFormGroup } from '@libs/shared/forms/services/selectable-form-group.service';
import { RepeaterFormGroupDirective } from '@libs/shared/forms/components/repeater-form-group.directive';

@NgModule({
    imports: [
        CommonModule,
    ],

    entryComponents: [],
    declarations: [
        RepeaterFormArrayDirective,
        RepeaterRemoveDirective,
        RepeaterAddDirective,
        RepeaterFormGroupDirective,

    ],
    exports: [
        RepeaterFormArrayDirective,
        RepeaterRemoveDirective,
        RepeaterAddDirective,
        RepeaterFormGroupDirective,

    ],
    providers: [FormArrayService, SelectableFormGroup]
})
export class AppFormsModule { }
