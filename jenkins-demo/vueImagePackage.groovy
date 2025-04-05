package org.vue

def call(){

    // 开始构建
    sh "${env.BUILD_COMMAND}"

    echo "构建完毕"

    // 不同的项目类型获取的项目产物路径获取方式不同
//    def targetPath = ''
//    if (env.PROJECT_KIND == 'vue') {
//
//        targetPath = sh(
//            script: 'find dist -name "index.html" -exec dirname {} \\;',
//            returnStdout: true
//        ).trim()
//    } else (env.PROJECT_KIND == 'node') {
//
//        targetPath = sh(
//            script: 'ls -d ./dist*/ 2>/dev/null | head -n1',
//            returnStdout: true
//        ).trim()
//    }

    // 获取产物的路径
    def targetPath = sh(
        script: 'ls -d ./dist*/ 2>/dev/null | head -n1',
//        script: 'find dist -name "index.html" -exec dirname {} \\;',
        returnStdout: true
    ).trim()

    sh "rm -f Dockerfile"

    if (targetPath == '') {
        echo "目标路径不存在"
    } else {
        env.TARGET_PATH = targetPath
        sh "cat >.dockerignore <<EFO\n" +
            "*\n" +
            "!${env.TARGET_PATH}\n" +
            "EFO"
    }

    /*
    // 制品库
    script{
        sh "rm -f ${env.PROJECT_NAME}.tar"
        sh "tar -cf ${env.PROJECT_NAME}.tar ${env.TARGET_PATH} "
        def tmptar = "${env.PROJECT_NAME}.tar"
        env.PROJECT_PRODUCT = tmptar
        archiveArtifacts artifacts: "${env.PROJECT_PRODUCT}", fingerprint: true, onlyIfSuccessful: true
    }
     */
    if (env.LANG_TYPE == 'vue') {
        if (env.ROUTE_PARTERN == "history") {
            generateImage(libRes: "dockerfile/vue/history")
        } else {
            generateImage(libRes: "dockerfile/vue/default")
        }
    } else if (env.LANG_TYPE == 'node') {
        generateImage(libRes: "dockerfile/node/default")
    } else {
        echo '构建镜像阶段，不存在相关项目类型'
    }

    def buildStatus = currentBuild.currentResult.toString()
    env.BUILD_STATUS = buildStatus
}

return this
