package org.vue
import org.common.ImageRegistry

def call() {

    def basicImage = "acnginx:1.23.3"
    env.BRANCH_HASH = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
    def packageJson = readJSON file: 'package.json'
    def scripts = packageJson.scripts.keySet().toList()

    env.PROJECT_BUILD_INFO = ""

    // 获取 config.js 中的配置
    def publicPath = '/'
    if (fileExists('vue.config.js')) {
        def vueConfigJs = readFile(file: 'vue.config.js')

        try {
            publicPath = (vueConfigJs =~ /publicPath:\s*'([^']+)'/)[0][1]
        } catch (Exception e) {
            echo "无法解析 publicPath，使用默认值 '/', 报错信息: ${e.message}"
            publicPath = '/'
        }

        if (publicPath == './') {
            publicPath = '/'
        }
    }

    def buildArg = input(
        id: 'buildArg', message: '确认构建相关参数', parameters: [
            choice(
                name:"publishEnv",
                choices:["dev","test","prod","none"],
                description:"发布环境(none只生成镜像)"
            ),
            choice(
                name: 'buildScript',
                choices: scripts,
                description: '构建命令'
            ),
            booleanParam(name: 'install', defaultValue: false, description: '更新依赖(新分支及添加新组建需要勾选)'),

            // 扫描选项暂时关闭
            // booleanParam(name: 'scan', defaultValue: false, description: '是否扫描'),

            string(
                name: 'accessPath',
                defaultValue: publicPath,
                description: '访问路径(自动读取可更改)'
            ),
            choice(
                name: 'routePartern',
                choices:['hash','history'],
                description: "路由模式"
            ),
            choice(
                name: 'projectCategory',
                choices:['default','sgcc','hubei','jiangsu','hebei',"qiyema","bms"],
                description: "项目选择(服务需要在同一坏境部署多个使用)"
            ),
            choice(
                name:"nodeVersion",
                choices:["14.21.3","16.20.2","18.19.1","14.19.1","12.22.2"],
                description:"node版本"
            )
        ]
    )
    def buildCommand = "npm run ${buildArg.buildScript}";

    if ( buildArg.install ){
        buildCommand = "npm set registry https://registry.npmmirror.com/ && npm install && npm run ${buildArg.buildScript}"
//npm config set legacy-peer-deps=true --location=projectr 
//      buildCommand = "node -v && npm get registry && npm install && npm run ${buildArg.buildScript}"

    }

    env.BUILD_COMMAND = buildCommand
    env.PROJECT_BUILD_INFO += "构建命令: " + env.BUILD_COMMAND + "\n"

    // 8月4日 去除历史模式更换基础镜像判断
    env.ROUTE_PARTERN = buildArg.routePartern
    env.PROJECT_BUILD_INFO += "路由模式: " + env.ROUTE_PARTERN + "\n"

    if (env.LANG_TYPE == "node") {
        basicImage = "node:14.9.0-alpine"
    }

    // 项目全局变量确认
    env.BASIC_IMAGE = basicImage
    env.PROJECT_BUILD_INFO += "基础镜像: " + env.BASIC_IMAGE + "\n"

    env.PROJECT_CATEGORY = buildArg.projectCategory
    env.PROJECT_BUILD_INFO += "项目分类: " + env.PROJECT_CATEGORY + "\n"

    // 补全访问路径
    def tmp_ap = buildArg.accessPath
    if (!tmp_ap.endsWith("/")) {
        tmp_ap += "/"
    }

    env.ACCESS_PATH = tmp_ap
    env.PROJECT_BUILD_INFO +=  "访问路径: " + env.ACCESS_PATH + "\n"

    env.PUBLISH_ENV = buildArg.publishEnv
    env.PROJECT_BUILD_INFO += "发布环境: " + env.PUBLISH_ENV + "\n"

    if (env.PUBLISH_ENV == "prod" || env.PUBLISH_ENV == "none" ) {
        env.DEPLOY = false
    } else {
        env.DEPLOY = true
    }

    env.NOTIFY = buildArg.notify

    env.AGENT_IMAGE = "${ImageRegistry.AcRegistryHost}/${ImageRegistry.AcRegistryHostSub}/node:${buildArg.nodeVersion}"
    env.PROJECT_BUILD_INFO += "构建环境镜像: " + "${env.AGENT_IMAGE}" + "\n"

    env.AGENT_ARGS =  "--name node-runner-${env.PROJECT_NAME}-${env.BRANCH_HASH}"
    env.AGENT_REUSE_NODE = true

}

return this
