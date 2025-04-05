import { IsNotEmpty } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';

export class CreateBookDto {
    @IsNotEmpty({ message: '书名不能为空' })
    bookName: string;

    @IsNotEmpty({ message: '作者不能为空' })
    author: string;

    @IsNotEmpty({ message: '简介不能为空' })
    description: string;

    @IsNotEmpty({ message: '封面不能为空' })
    cover: string;
}

// 在 NestJS 中，PartialType 主要用于 创建 DTO（数据传输对象）的部分更新类型，让所有字段变为 可选（optional），避免手动重复定义。
// 这行代码的作用是 基于 CreateBookDto 生成一个 UpdateBookDto，但所有字段都是可选的。这样，在更新书籍信息时，用户不需要提供所有字段，只需要提交想要修改的字段。
// 与validationPipe配合使用,在post时必须传递所有字段,但Patch时候字段可选
export class UpdateBookDto extends PartialType(CreateBookDto) {
    @IsNotEmpty({ message: 'id不能为空' })
    id: string
}
