import org.common.ImageRegistry
import java.text.SimpleDateFormat

def call(Map setdockerfile) {

// 需要使用的 Dockerfile 文件
def libRes = setdockerfile.libRes
def entryPointFile = "dockerfile/java/entrypoint.sh"

// libraryResource 加载共享库资源
def dockerfile = libraryResource libRes
def entrypointfile = libraryResource entryPointFile

if (fileExists("Dockerfile")) {
echo "使用本地 Dockerfile 文件"
} else {
echo "使用共享库Dockerfile"
// writeFile 写入的文件名, text 写入的文件
writeFile file: "Dockerfile", text: dockerfile
}

writeFile file: "entrypoint.sh", text: entrypointfile

// 确定构建镜像的相关信息： 仓库 ，账户 ，项目名称 ， 标签
def imageRegistry = ImageRegistry.AcRegistryHost
def repoAccount = ImageRegistry.HarborAccount

// imagetag增加 时分标签 ===> 增强imagetag 的唯一性，同时兼顾可读性
def timestamp = new SimpleDateFormat('MMdd-HHmm').format(new Date())

imageTag = env.PUBLISH_ENV

if (env.PROJECT_CATEGORY != "default") {
env.PROJECT_NAME = env.PROJECT_NAME + "-" + env.PROJECT_CATEGORY // link-cloud-hubei
env.PROJECT_GROUP = env.PROJECT_GROUP + "-" + env.PROJECT_CATEGORY // ac-front-hubei
}

if (env.PUBLISH_ENV == 'prod') {
imageTag = env.PUBLISH_ENV + '-' + timestamp
}

// 生成整个 docker image 信息
def imageAddress = "${ImageRegistry.AcRegistryHost}/${env.PUBLISH_ENV}/${env.PROJECT_NAME}:${imageTag}"

if (env.PUBLISH_ENV == 'prod') {
imageRegistry = ImageRegistry.AliRegistryHost
imageAddress = "${ImageRegistry.AliRegistryHost}/${ImageRegistry.AliRegistryHostSub}/${env.PROJECT_NAME}:${imageTag}"
repoAccount = ImageRegistry.AliAccount
}

env.IMAGE_ADDRESS = imageAddress

def imageBuildArgs = [
BASIC_IMAGE: "${ImageRegistry.AcRegistryHost}/${ImageRegistry.AcRegistryHostSub}/${env.BASIC_IMAGE}",
PUBLISH_ENV: "${env.PUBLISH_ENV}",
TARGET_PATH: "${env.TARGET_PATH}",
PROJECT_ACTIVE: "${env.PROJECT_ACTIVE}",
ACCESS_PATH: "${env.ACCESS_PATH}"
]

if (env.SKY_WALK == "true") {
imageBuildArgs = [
BASIC_IMAGE: "${ImageRegistry.AcRegistryHost}/${ImageRegistry.AcRegistryHostSub}/${env.BASIC_IMAGE}",
PUBLISH_ENV: "${env.PUBLISH_ENV}",
TARGET_PATH: "${env.TARGET_PATH}",
PROJECT_ACTIVE: "${env.PR