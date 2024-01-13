import { HttpException, NotFoundException } from '@nestjs/common';

export function ExceptionHandler() {
  return function (_target: any, _key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (error instanceof NotFoundException) return error;
        throw new HttpException('internal server error', 500);
      }
    };

    return descriptor;
  };
}
