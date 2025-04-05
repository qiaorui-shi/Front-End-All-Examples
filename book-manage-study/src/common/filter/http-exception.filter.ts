import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    // 假如该异常处理在全局和模块中都注册了,那么处理异常是在全局还是模块中处理?
    // 这里registryType 是用来区分是哪个模块的异常
    // 通过构造函数注入参数registryType调试发现是模块中处理
    public registryType: any = undefined
    constructor(type?: string) {
        console.log('type:', type)
        this.registryType = type
    }
    // ArgumentsHost 是一个功能强大的使用程序对象 在这里用来获取request和response对象
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const validatorMessage = exception.message

        console.log("🚀 ~ this.registryType:", this.registryType)
        // 如果捕获到了多个错误，抛出第一个就行 处理class-validator校验全部字段的问题
        const execptionResponse: any = exception.getResponse()
        let { message, error, statusCode } = execptionResponse
        if (typeof message === 'object') {
            message = message[0]
        }
        response
            .status(status)
            .json({
                statusCode: statusCode || status,
                message: message || validatorMessage,
            });
    }
}
