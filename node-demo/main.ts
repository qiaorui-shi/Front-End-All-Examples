import "reflect-metadata";
function info(metadata: string) {
  return function (target) {
    Reflect.defineMetadata("info", metadata, target);
  };
}

@info("这是一个测试类")
class Test {
  constructor() {
    console.log("🚀 ~ A constructor called");
  }
}

console.log("🚀 ~ metadata:", Reflect.getMetadata("info", Test)); //log: "这是一个测试类"
