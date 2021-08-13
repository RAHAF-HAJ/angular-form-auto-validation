import { FormGroup } from '@angular/forms';

export abstract class BaseFormGroup<T> {
    protected fg: FormGroup;
    isValid() {
        return this.fg.valid;
    }
    isDisabled() {
        return this.fg.disabled;
    }
    abstract getFormGroup(item?: any): FormGroup;
    abstract getValueFromFormGroup(fg: FormGroup): T;
}
