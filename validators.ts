import { FormGroup, FormArray, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { ContactType } from '@libs/core/models/enumerations/contact-type.enum';
import { phoneRegex, urlRegex, minPhoneNumberLength, englishLetterRegex } from '@libs/shared/settings/common.settings';
import { AddressType } from '@libs/core/models/enumerations/address-type.enum';
import { GetFullDateService } from '@libs/shared/services/get-full-date.service';
import * as moment from 'moment';

export const hasAtLeastNCheckedValueValidator = (minRequired = 1, propertyToBeChecked?: string) =>
  (form: FormGroup): any => {
    {
      let checked = 0;

      Object.keys(form.controls).forEach((key: any) => {
        const control = (form as FormGroup).controls[key];
        let checkedResult = false;
        if (propertyToBeChecked?.length > 0) {
          checkedResult = control && control.value[propertyToBeChecked] === true;
        }
        else {
          checkedResult = control && control.value === true;
        }
        if (checkedResult === true) {
          checked++;
        }
      });

      if (checked < minRequired) {
        return {
          atLeastNCheckedValue: {
            actualCheckedValues: checked,
            requiredCheckValues: minRequired
          },
        };
      }

      return null;
    };
  };

export const hasAtLeastNRowValidator = (minRequired = 1) => (form: FormArray): any => {
  let rows = 0;
  const controls = form.controls;
  rows = controls.length;
  if (rows < minRequired) {
    return {
      atLeastNRow: {
        actualRowsCount: rows,
        requiredRowsCount: minRequired
      }
    };
  }
  return null;
};

export const hasAtMostNRowValidator = (maxRequired = 1) => (form: FormArray): any => {
  let rows = 0;
  const controls = form.controls;
  rows = controls.length;
  if (rows > maxRequired) {
    return {
      atMosttNRow: {
        actualRowsCount: rows,
        requiredRowsCount: maxRequired
      }
    };
  }
  return null;
};

export const validateMinMaxValues = (min: number, max: number): boolean => {
  if (max < min) {
    return false;
  }
  else {
    return true;
  }
};

export const validateTime = (start: string, end: string): boolean => {
  if (Date.parse('01/01/2011 ' + start + ':00') >= Date.parse('01/01/2011 ' + end + ':00')) {
    return false;
  }
  else {
    return true;
  }
};

export const spaceCapacityValidation = (): ValidatorFn =>
  (formGroup: FormGroup) => {
    const maxControl = formGroup.get('maxCapacity');
    const maxValue = maxControl.value;
    const minControl = formGroup.get('minCapacity');
    const minValue = minControl.value;
    const capacityValid = validateMinMaxValues(minValue, maxValue);
    return capacityValid ? null : { InvalidCapacity: formGroup.invalid };
  };

export const spaceCovidCapacityValidation = (): ValidatorFn =>
  (formGroup: FormGroup) => {
    const isCovidActive = formGroup.get('isCovidActive');
    const isCovidValue = isCovidActive.value;
    const maxCovidControl = formGroup.get('maxCovidCapacity');
    const maxCovidValue = maxCovidControl.value;
    const minCovidControl = formGroup.get('minCovidCapacity');
    const minCovidValue = minCovidControl.value;
    if (isCovidValue) {
      const covidCapacityValid = validateMinMaxValues(minCovidValue, maxCovidValue);
      maxCovidControl.setValidators([Validators.required, Validators.min(2), Validators.max(99999)]);
      minCovidControl.setValidators([Validators.required, Validators.min(2), Validators.max(99999)]);
      return covidCapacityValid ? null : { InvalidCapacity: formGroup.invalid };
    }
    else {
      maxCovidControl.clearValidators();
      minCovidControl.clearValidators();
    }
    return null;
  };

export const addressStateValidation = (): ValidatorFn =>
  (formGroup: FormGroup) => {
    const countryIdControl = formGroup.get('country');
    const countryIdValue = countryIdControl.value;
    const regionIdControl = formGroup.get('regionId');
    const regionIdValue = regionIdControl.value;
    const regionNameControl = formGroup.get('regionName');
    const regionNameValue = regionNameControl.value;
    const addressTypeControl = formGroup.get('addressType');
    const addressTypeValue = addressTypeControl.value;
    // eslint-disable-next-line max-len
    return addressTypeValue === AddressType.General || (countryIdValue !== 228 && !!regionNameValue) || (!!regionIdValue && countryIdValue === 228) ? null : { InvalidUsState: formGroup.invalid };
  };

export const workingHoursValidation = (): ValidatorFn =>
  (formGroup: FormGroup) => {
    const fromHour = formGroup.get('fromHour');
    const fromHourValue = fromHour.value;
    const toHour = formGroup.get('toHour');
    const toHourValue = toHour.value;
    return validateTime(fromHourValue, toHourValue) ? null : { InvalidWorkingHours: formGroup.invalid };
  };

export const ProposalSpaceTimeValidation = (): ValidatorFn =>
  (formGroup: FormGroup) => {
    const fromHour = formGroup.get('startTime');
    const fromHourValue = fromHour.value;
    const toHour = formGroup.get('endTime');
    const toHourValue = toHour.value;
    if (!validateTime(fromHourValue, toHourValue)) {
      return { InvalidWorkingHours: true };
    }
    return null;
  };

export const additionalInfoValidation = (): ValidatorFn =>
  (formGroup: FormGroup) => {
    const videoUrl = formGroup.get('videoUrl');
    const videoUrlValue = videoUrl.value;
    const vr360ViewUrl = formGroup.get('vr360ViewUrl');
    const vr360ViewUrlValue = vr360ViewUrl.value;
    const videoUrlValid = validateUrlHelper(videoUrlValue);
    const vr360ViewUrlValid = validateUrlHelper(vr360ViewUrlValue);
    return videoUrlValid && vr360ViewUrlValid ? null : { InvalidUrl: formGroup.invalid };
  };

export const venueInformationValidation = (): ValidatorFn =>
  (formGroup: FormGroup) => {
    const brandsControl = formGroup.get('brands');
    const brandsControlValue = brandsControl.value;
    const chainControl = formGroup.get('chain');
    const chainControlValue = chainControl.value;
    if (!brandsControlValue && chainControlValue) {
      brandsControl.setValidators(Validators.required);
    }
    else {
      brandsControl.clearValidators();
    }
    return null;
  };

export const urlValidator = (control: FormControl) => {
  if (control.value.length === 0) {
    return null;
  }
  const isUrlValid = validateUrlHelper(control.value);
  return (isUrlValid) ? null : { InvalidUrl: true };
};

export const validateUrlHelper = (value: string): boolean => {
  const urlValid = urlRegex.test(value);
  return urlValid;
};

export const PhoneValidator = (control: FormControl) => {
  if (control.value.length === 0) {
    return null;
  }
  const isPhoneValid = validatePhoneNumberHelper(control.value);
  return (isPhoneValid && control.value.length >= minPhoneNumberLength) ? null : { InvalidPhone: true };
};

export const validatePhoneNumberHelper = (value: string): boolean => {
  const phoneNumberValid = phoneRegex.test(value);
  return phoneNumberValid;
};

export const onlyEnglishLetterValidator = (control: FormControl) => {
  const value = control?.value || '';
  if (value.length > 0 && !englishLetterRegex.test(value)) {
    return {
      onlyEnglishLetter: true
    };
  }
  else {
    return null;
  }
};


export const contactUsValueValidator = (): ValidatorFn =>
  (formGroup: FormGroup) => {
    const contentControl = formGroup.get('content');
    const contactTypeControl = formGroup.get('contactUsTypeId');
    const contactTypeValue = contactTypeControl.value;
    if ((contactTypeValue === ContactType.Facebook)
      || (contactTypeValue === ContactType.Instagram) || (contactTypeValue === ContactType.Pinterest)
      || (contactTypeValue === ContactType.Twitter) || (contactTypeValue === ContactType.Website)) {
      if (contentControl.dirty) {
        contentControl.setValidators(urlValidator);
      }
    }
    if ((contactTypeValue === ContactType.Telephone)) {
      if (contentControl.dirty) {
        contentControl.setValidators([PhoneValidator, Validators.required]);
      }
    }
    if (contactTypeValue === ContactType.Email || contactTypeValue === ContactType.Enquiries) {
      if (contentControl.dirty) {
        contentControl.setValidators([Validators.email, Validators.required]);
      }
    }
    return null;
  };

export const validateDate = (firstDate: string, secondDate: string): boolean => {
  if (Date.parse(firstDate) <= Date.parse(secondDate)) {
    return false;
  }
  else {
    return true;
  }
};

export const bookingWizardPeopleValidation = (): ValidatorFn =>
  (formGroup: FormGroup) => {
    const maxControl = formGroup.get('maxNoOfPersons');
    const maxValue = maxControl.value;
    const minControl = formGroup.get('minNoOfPersons');
    const minValue = minControl.value;
    const peopleValid = validateMinMaxValues(minValue, maxValue);
    return peopleValid ? null : { InvalidRangeOfPeople: formGroup.invalid };
  };

export const bookingWizardRoomsValidation = (): ValidatorFn =>
  (formGroup: FormGroup) => {
    const maxControl = formGroup.get('maxNoOfRooms');
    const maxValue = maxControl.value;
    const minControl = formGroup.get('minNoOfRooms');
    const minValue = minControl.value;
    const roomsValid = validateMinMaxValues(minValue, maxValue);
    return roomsValid ? null : { InvalidRangeOfRooms: formGroup.invalid };
  };

export const bookingWizardBudgetValidation = (): ValidatorFn =>
  (formGroup: FormGroup) => {
    const maxControl = formGroup.get('maximumValue');
    const maxValue = maxControl.value;
    const minControl = formGroup.get('minimumValue');
    const minValue = minControl.value;
    const budgetValid = validateMinMaxValues(minValue, maxValue);
    return budgetValid ? null : { InvalidRangeOfBudget: formGroup.invalid };
  };

export const bookingWizardTimeValidation = (): ValidatorFn =>
  (formGroup: FormGroup) => {
    const startTime = formGroup.get('startTime');
    const startTimeValue = startTime.value;
    const endTime = formGroup.get('endTime');
    const endTimeValue = endTime.value;
    return validateTime(startTimeValue, endTimeValue) ? null : { InvalidBookingTime: formGroup.invalid };
  };

export const bookingOptionsDateValidation = (getFullDateService: GetFullDateService): ValidatorFn =>
  (formGroup: FormGroup) => {
    const bookingExpiryDate = formGroup.get('bookingExpiryDate').value;
    const decisionDate = formGroup.get('decisionDate').value;

    const expiryDateTime = getFullDateService.getFullDate(bookingExpiryDate, formGroup.get('bookingExpiryTime').value);
    const decisionDateTime = getFullDateService.getFullDate(decisionDate, formGroup.get('decisionTime').value);

    const bookingExpiryHour = moment(expiryDateTime).hours();
    const decisionHour = moment(decisionDateTime).hours();

    const diff = decisionHour - bookingExpiryHour;

    if (Date.parse(decisionDate) === Date.parse(bookingExpiryDate)) {
      if (diff < 1) {
        return { InvalidBookingOptionsDate: formGroup.invalid };
      } else { return null; }
    } else {
      return validateDate(decisionDate, bookingExpiryDate) ? null : { InvalidBookingOptionsDate: formGroup.invalid };
    }
  };

export const addressItemGoogleNameValidation = () => (form: FormGroup): any => {
  if (!form.value.address.placeId && form.get('name').dirty) {
    return {
      shouldHaveGooglePlace: true
    };
  }
  return null;
};
