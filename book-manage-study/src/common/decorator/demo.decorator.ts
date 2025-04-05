import { SetMetadata } from '@nestjs/common';

export const Demo = (...args: string[]) => SetMetadata('demo', args);
