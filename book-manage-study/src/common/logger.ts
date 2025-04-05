import { LoggerService, LogLevel } from "@nestjs/common";

export class Logger implements LoggerService {
    log(message: string, context?: string) {
        console.log("🚀 ~ Logger ~ log ~ context:", context)
        console.log("🚀 ~ Logger ~ log ~ message:", message)
    }

    error(message: string, context: string) {
        console.log("🚀 ~ Logger ~ error ~ context:", context)
        console.log("🚀 ~ Logger ~ error ~ message:", message)
    }

    warn(message: any, ...optionalParams: any[]) {
        console.log("🚀 ~ Logger ~ warn ~ message:", message)
        console.log("🚀 ~ Logger ~ warn ~ optionalParams:", optionalParams)
    }
}