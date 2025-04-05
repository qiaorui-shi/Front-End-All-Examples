import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 参数装饰器的返回值就是参数的值
export const ParamDemo = createParamDecorator((data: string, ctx: ExecutionContext) => {
    return ''
})