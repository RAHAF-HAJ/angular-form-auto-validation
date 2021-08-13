import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


interface LengthParams {
    actualLength?: number;
    requiredLength?: number;
}

interface NumberSizeParams {
    actual?: number;
    max?: number;
    min?: number;
}

interface RequiredFileSizeParams {
    fileName: string;
    maxSize: number;
    minSize: number;
    unit: string;
    doesExceed: boolean;
}

interface RequiredNRow {
    actualRowsCount: number;
    requiredRowsCount: number;
}


interface RequiredNValue {
    actualCheckedValues: number;
    requiredCheckValues: number;
}
@Injectable({
    providedIn: 'root'
})

export class ValidationErrorMappingService {
    errorMessages: any;
    constructor(public translate: TranslateService) {
        this.errorMessages = {
            required: () => this.translate.instant('general.validation.required'),
            minlength: ({ actualLength, requiredLength }: LengthParams) => this.translate.instant('general.validation.minlength', { actualLength, requiredLength }),
            maxlength: ({ actualLength, requiredLength }: LengthParams) => this.translate.instant('general.validation.maxlength', { actualLength, requiredLength }),
            max: ({ actual, max }: NumberSizeParams) => this.translate.instant('general.validation.max', { actual, max }),
            min: ({ actual, min }: NumberSizeParams) => this.translate.instant('general.validation.min', { actual, min }),
            email: () => this.translate.instant('general.validation.email'),
            requiredFileSize: (args: RequiredFileSizeParams | RequiredFileSizeParams[]) => {
                const getMessage = ({ fileName, minSize, maxSize, unit, doesExceed }: RequiredFileSizeParams) => {
                    if (doesExceed) {
                        return this.translate.instant('general.validation.file.multi-files-exceed-size', { fileName, maxSize, unit });
                    }
                    else {
                        return this.translate.instant('general.validation.file.multi-files-below-size', { fileName, minSize, unit });
                    }
                };
                if (!Array.isArray(args)) {
                    const { minSize, maxSize, unit } = args;
                    if (args.doesExceed) {
                        return this.translate.instant('general.validation.file.exceed-size', { maxSize, unit });
                    }
                    else {
                        return this.translate.instant('general.validation.file.below-size', { minSize, unit });
                    }
                }
                else {
                    const msgs: any = [];
                    args.forEach(arg => {
                        msgs.push(getMessage(arg));
                    });
                    return msgs.join('\r\n');
                }
            },
            atLeastNRow: ({ actualRowsCount, requiredRowsCount }: RequiredNRow) => this.translate.instant('general.validation.atLeastNRow', { actualRowsCount, requiredRowsCount }),
            atLeastNCheckedValue: ({ actualCheckedValues, requiredCheckValues }: RequiredNValue) => this.translate.instant('general.validation.atLeastNCheckedValue', { actualCheckedValues, requiredCheckValues }),
            InvalidCapacity: () => this.translate.instant('general.validation.InvalidCapacity'),
            InvalidUrl: () => this.translate.instant('general.validation.InvalidUrl'),
            InvalidPhone: () => this.translate.instant('general.validation.InvalidPhone'),
            InvalidUsState: () => this.translate.instant('general.validation.required'),
            InvalidWorkingHours: () => this.translate.instant('general.validation.InvalidWorkingHours'),
            onlyEnglishLetter: () => this.translate.instant('general.validation.onlyEnglishLetter'),
            InvalidRangeOfPeople: () => this.translate.instant('general.validation.InvalidRangeOfPeople'),
            InvalidRangeOfRooms: () => this.translate.instant('general.validation.InvalidRangeOfRooms'),
            InvalidRangeOfBudget: () => this.translate.instant('general.validation.InvalidRangeOfBudget'),
            InvalidBookingTime: () => this.translate.instant('general.validation.InvalidBookingTime'),
            InvalidBookingOptionsDate: () => this.translate.instant('general.validation.InvalidBookingOptionsDate'),
            InvalidExpiryDate: () => this.translate.instant('general.validation.InvalidExpiryDate'),
            HasAtLeastOneCostItem: () => this.translate.instant('general.validation.HasAtLeastOneCostItem'),
            shouldHaveGooglePlace: () => this.translate.instant('general.validation.shouldHaveGooglePlace'),
            // exceedFileSize: ({fileName, maxSize, unit}: ExceedFileSizeParams) => this.translate.instant('general.validation.file.exceed-size', {fileName, maxSize, unit}),
            // belowFileSize: ({fileName, minSize, unit}: BelowFileSizeParams) => this.translate.instant('general.validation.file.below-size', {fileName, minSize, unit}),
        };
    }

}
