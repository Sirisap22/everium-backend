import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { verifyId } from '../utils/tokenizer.utils';

export function isValidChecksum(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidChecksum',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' && value.length > 1 && verifyId(value);
        },
      },
    });
  };
}