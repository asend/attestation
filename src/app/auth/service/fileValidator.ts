import { ValidatorFn, FormControl } from '@angular/forms';

export class FileValidator {

  static fileMaxSize(maxSize: number): ValidatorFn {
    // @ts-ignore
    const validatorFn = (file: File) => {
      if (file instanceof File && file.size > maxSize) {
        return { fileMinSize: { requiredSize: maxSize, actualSize: file.size, file } };
      }
    };
    // @ts-ignore
    return FileValidator.fileValidation(validatorFn);
  }

  static fileMinSize(minSize: number): ValidatorFn {
    // @ts-ignore
    const validatorFn = (file: File) => {
      if (file instanceof File && file.size < minSize) {
        return { fileMinSize: { requiredSize: minSize, actualSize: file.size, file } };
      }
    };
    // @ts-ignore
    return FileValidator.fileValidation(validatorFn);
  }

  /**
   * extensions must not contain dot
   */
  static fileExtensions(allowedExtensions: Array<string>): ValidatorFn {
    // @ts-ignore
    const validatorFn = (file: File) => {
      if (allowedExtensions.length === 0) {
        return null;
      }

      if (file instanceof File) {
        const ext = FileValidator.getExtension(file.name);
        if (allowedExtensions.indexOf(<string>ext) === -1) {
          return { fileExtension: { allowedExtensions: allowedExtensions, actualExtension: file.type, file } };
        }
      }
    };
    // @ts-ignore
    return FileValidator.fileValidation(validatorFn);
  }

  private static getExtension(filename: string): null|string {
    if (filename.indexOf('.') === -1) {
      return null;
    }
    // @ts-ignore
    return filename.split('.').pop();
  }

  private static fileValidation(validatorFn: (arg0: File) => null|object): ValidatorFn {
    // @ts-ignore
    return (formControl: FormControl) => {
      if (!formControl.value) {
        return null;
      }

      const files: File[] = [];
      const isMultiple = Array.isArray(formControl.value);
      isMultiple
        ? formControl.value.forEach((file: File) => files.push(file))
        : files.push(formControl.value);

      for (const file of files) {
        return validatorFn(file);
      }

      return null;
    };
  }

}
