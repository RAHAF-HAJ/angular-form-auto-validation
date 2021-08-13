import { FormGroup, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';
import { SelectableListItem } from '@libs/core/models/selectable-listItem.model';
import {BaseFormGroup} from '@libs/shared/forms/services/base-form-group.services';

@Injectable({
    providedIn: 'root'
})

export class SelectableFormGroup extends BaseFormGroup<SelectableListItem<any>> {
    fg: FormGroup;

    getFormGroup(item: SelectableListItem<any>): FormGroup {
        const fg = new FormGroup({
            isSelected: new FormControl(item.isSelected)
        });
        Object.keys(item.data).forEach(key => {
            fg.addControl(key, new FormControl(item.data[key] || ''));
        });
        return fg;
    }

    getValueFromFormGroup(fg: FormGroup) {
        const value: SelectableListItem<any> = {
            isSelected: false,
            data: {}
        };
        value.isSelected = fg.controls.isSelected.value;
        Object.keys(fg.controls).forEach(key => {
            if (key !== 'isSelected') {
                value.data[key] = fg.controls[key].value;
            }
        });
        return value;
    }
}
