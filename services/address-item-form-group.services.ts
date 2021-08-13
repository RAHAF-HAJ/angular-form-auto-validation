import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Injectable } from '@angular/core';
import { BaseFormGroup } from '@libs/shared/forms/services/base-form-group.services';
import { AddressModel } from '@libs/shared/models/address.model';
import { AddressValidationValues } from '@libs/core/models/enumerations/address-validation-values.enum';
import { AddressType } from '@libs/core/models/enumerations/address-type.enum';
import { onlyEnglishLetterValidator } from '@libs/shared/automatic-form-validation/validators';
import { USCountryID } from '@libs/shared/settings/common.settings';

@Injectable({
  providedIn: 'root',
})

export class AddressFormGroup extends BaseFormGroup<AddressModel> {
  fg: FormGroup;

  constructor(private fb: FormBuilder) {
    super();
  }

  getFormGroup(addressData?: AddressModel, isFullAddress: boolean = true): FormGroup {
    this.fg = this.fb.group({
      id: [addressData ?.id || ''],
      addressLine1: [addressData ? addressData.addressLine1 : '', this.getAddress1Validation()],
      addressLine2: [addressData ? addressData.addressLine2 : '', this.getAddress2Validation()],
      postalCode: [{ value: addressData ? addressData.postalCode : '', disabled: !isFullAddress }, this.getPostalCodeValidation()],
      cityName: [{ value: addressData ? addressData.cityName : '', disabled: !isFullAddress }, this.getCityNameValidation()],
      regionName: [{ value: addressData ? this.getRegionName(addressData.countryId, addressData.regionName) : '', disabled: !isFullAddress }, this.getRegionNameValidation()],
      countryId: [{ value: addressData ? addressData.countryId : null, disabled: !isFullAddress }, [Validators.required]],
      addressType: [{ value: addressData ? addressData.addressType : AddressType.General, disabled: !isFullAddress }],
      longitude: [{ value: addressData ? addressData.longitude : 0, disabled: !isFullAddress }],
      latitude: [{ value: addressData ? addressData.latitude : 0, disabled: !isFullAddress }],
    });
    if (addressData && Object.keys(addressData).includes('placeId')) {
      this.fg.addControl('placeId', this.fb.control(''));
    }
    this.fg.setValidators([this.getAddressItemValidation()]);
    return this.fg;
  }

  getValueFromFormGroup(data: FormGroup): any {
    const address: AddressModel = {
      addressLine1: data.controls.addressLine1.value,
      addressLine2: data.controls.addressLine2.value,
      cityName: data.controls.cityName.value,
      regionName: data.controls.regionName?.value?.toString(),
      countryId: data.controls.countryId.value,
      postalCode: data.controls.postalCode.value,
      addressType: data.controls.addressType.value,
    };
    const id = data.controls.id.value;
    const longitude = data.controls.longitude.value;
    const latitude = data.controls.latitude.value;
    if (id && id.toString().length > 0) {
      /** Only add lat&long  when there is a place id **/
      address.id = id;
    }
    if (Object.keys(data.value).includes('placeId')) {
      address.placeId = data.get('placeId').value;
      address.longitude = longitude;
      address.latitude = latitude;
    }
    return address;
  }

  getAddress1Validation() {
    return [
      Validators.required,
      onlyEnglishLetterValidator,
      Validators.minLength(AddressValidationValues.MinLength),
      Validators.maxLength(AddressValidationValues.MaxLength)
    ];
  }

  getAddress2Validation() {
    return [
      onlyEnglishLetterValidator,
      Validators.minLength(AddressValidationValues.MinLength),
      Validators.maxLength(AddressValidationValues.MaxLength)
    ];
  }

  getPostalCodeValidation() {
    return [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(10)
    ];
  }

  getCityNameValidation() {
    return [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(100)
    ];
  }

  getRegionNameValidation() {
    return [
      Validators.minLength(1),
      Validators.maxLength(100)
    ];
  }

  getRegionName(countryId: number, regionName: string): any {
    if(countryId === USCountryID) {
      return parseInt(regionName, 10);
    }
    else {
      return regionName;
    }
  }

  getAddressItemValidation = () => (fg: FormGroup): any => {
    const countryId = fg.get('countryId').value;
    if(countryId === USCountryID) {
      fg.get('regionName').setValidators([Validators.required]);
    }
    else {
      fg.get('regionName').clearValidators();
    }
    return null;
  };
}
