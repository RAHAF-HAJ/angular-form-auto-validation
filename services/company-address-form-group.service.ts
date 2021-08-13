import { AddressModel } from '@libs/shared/models/address.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Injectable } from '@angular/core';
import { BaseFormGroup } from '@libs/shared/forms/services/base-form-group.services';
import { CompanyAddress } from '@libs/company-info/models/company-address.models';
import { AddressFormGroup } from '@libs/shared/forms/services/address-item-form-group.services';
import { AddressType } from '@libs/core/models/enumerations/address-type.enum';
@Injectable({
  providedIn: 'root',
})

export class CompanyAddressFormGroup extends BaseFormGroup<CompanyAddress> {
  fg: FormGroup;
  emptyBillingAddress: {
    id?: null;
    addressLine1: '';
    addressLine2: '';
    cityName: '';
    postalCode: '';
    addressType: AddressType.Billing;
    longitude?: null;
    latitude?: null;
    countryName?: '';
    regionName?: '';
  };

  constructor(public fb: FormBuilder, private addressFormGroup: AddressFormGroup) {
    super();
  }

  public getFormGroup(companyAddress?: CompanyAddress): FormGroup {

    const generalAddress = companyAddress.addresses.find(address => address.addressType === AddressType.General);

    const billingAddress = companyAddress.hasSameBillingAddress ? (this.emptyBillingAddress) as unknown as AddressModel :
      companyAddress.addresses.find(address => address.addressType === AddressType.Billing);

    this.fg = this.fb.group({
      generalAddress: this.addressFormGroup.getFormGroup(generalAddress, false),
      billingAddress: this.addressFormGroup.getFormGroup(billingAddress),
      hasSameBillingAddress: companyAddress.hasSameBillingAddress
    });

    return this.fg;
  }

  getValueFromFormGroup(): CompanyAddress {
    const addresses: AddressModel[] = [];
    addresses.push(this.addressFormGroup.getValueFromFormGroup(this.getGeneralAddressFormGroup));
    if(!this.hasSameBillingAddress) {
      addresses.push(this.addressFormGroup.getValueFromFormGroup(this.getBillingAddressFormGroup));
    }
    return {
      addresses,
      hasSameBillingAddress: this.hasSameBillingAddress,
    };
  }

  get getBillingAddressFormGroup() {
    return this.fg.get('billingAddress') as FormGroup;
  }

  get getGeneralAddressFormGroup() {
    return this.fg.get('generalAddress') as FormGroup;
  }

  get hasSameBillingAddress() {
    return this.fg.get('hasSameBillingAddress').value as boolean;
  }

  companyAddressValidator = () => (formGroup: FormGroup): any => {
    const hasSameBillingAddress = formGroup.get('hasSameBillingAddress').value as boolean;
    const billingAddressFormGroup = formGroup.get('billingAddress') as FormGroup;
    if(hasSameBillingAddress) {
        billingAddressFormGroup.get('addressLine1').clearValidators();
        billingAddressFormGroup.get('postalCode').clearValidators();
        billingAddressFormGroup.get('cityName').clearValidators();
    }
    else {
        billingAddressFormGroup.get('addressLine1').setValidators(this.addressFormGroup.getAddress1Validation());
        billingAddressFormGroup.get('postalCode').setValidators(this.addressFormGroup.getPostalCodeValidation());
        billingAddressFormGroup.get('cityName').setValidators(this.addressFormGroup.getCityNameValidation);
    }
    return null;
  };
}
