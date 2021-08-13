import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationMessageComponent } from '@libs/shared/automatic-form-validation/components/validation-error-message.component';
import { ValidatorFormDirective } from '@libs/shared/automatic-form-validation/components/validator-parent-form.directive';
import { FormControlValidatorDirective } from '@libs/shared/automatic-form-validation/components/form-control-validator.directive';
import { FormControlContainerValidatorDirective } from '@libs/shared/automatic-form-validation/components/form-control-container-validator.directive';
import { FormFieldWrapperDirective } from '@libs/shared/automatic-form-validation/components/form-control-wrapper.directive';
import { ErrorMessageContainerDirective } from '@libs/shared/automatic-form-validation/components/error-message-container.directive';
import { SubmissionValidationTriggerDirective } from '@libs/shared/automatic-form-validation/components/submission-validation-trigger.directive';
import { MaterialModule } from '@libs/shared/material/material.module';
import { SubmissionValidationEventService } from '@libs/shared/automatic-form-validation/services/validator-submission-event.service';
import { ValidateOnBlurDirective } from '@libs/shared/automatic-form-validation/components/validate-on-blue.directive';
@NgModule({
    imports: [
        CommonModule,
        MaterialModule
    ],
    entryComponents: [ValidationMessageComponent],
    declarations: [
        ValidationMessageComponent,
        ValidatorFormDirective,
        FormControlValidatorDirective,
        FormControlContainerValidatorDirective,
        FormFieldWrapperDirective,
        ErrorMessageContainerDirective,
        SubmissionValidationTriggerDirective,
        ValidateOnBlurDirective
    ],
    exports: [
        ValidationMessageComponent,
        ValidatorFormDirective,
        FormControlValidatorDirective,
        FormControlContainerValidatorDirective,
        FormFieldWrapperDirective,
        ErrorMessageContainerDirective,
        SubmissionValidationTriggerDirective,
        ValidateOnBlurDirective
    ],
    providers: [SubmissionValidationEventService]
})
export class AutomaticFormValidationModule { }
