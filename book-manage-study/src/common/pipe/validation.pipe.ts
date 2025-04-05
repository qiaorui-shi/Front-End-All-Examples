import { PipeTransform, Injectable, ArgumentMetadata, HttpException } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { validate } from "class-validator"

@Injectable()
export class ValidationPipe implements PipeTransform {
    // 要实现PipeTransform接口，必须实现transform方法
    // 1、可以看到transform是异步的，nest支持同步和异步管道，这样做的原因是有些class-validator的校验是可以异步的
    // 2、value是当前处理的方法参数，metadata是当前处理的方法参数的元数据
    async transform(value: any, metadata: ArgumentMetadata) {
        // 3、如果当前参数为原生javascript类型，则绕过直接return，因为它们不能附加验证装饰器
        if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
            return value
        }

        // 4、通过plainToInstance将普通的javascript参数转换为可验证的类型对象
        const object = plainToInstance(metadata.metatype, value);
        // 5、通过validate方法对转换后的对象进行验证
        const errors = await validate(object);
        if (errors.length > 0) {
            // 6、如果验证失败，则抛出异常
            throw new HttpException('Validation failed', 400);
        }
        return value
    }

    // toValidate是用来判断当前处理的方法参数的类型是否是dto类
    toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object]
        return !types.includes(metatype)
    }
}