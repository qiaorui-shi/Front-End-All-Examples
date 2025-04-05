def call(Map opts = [langType: '' ]) {
    init()

    pipeline {
    agent any

    // ========================================================================== //
    // O p t i o n s //
    // ========================================================================== //

    options {
        buildDiscarder(logRotator(numToKeepStr: '2', daysToKeepStr: '7'))

        // 同一时间只允许一个 pipeline
        disableConcurrentBuilds()

        // do not allow more than 3 builds to run in a minute
        // rateLimitBuilds(throttle: [count: 3, durationName: 'minute', userBoost: false])

        // 控制台日志显示时间戳
        timestamps()

        // requires ansicolor
        // ansiColor('xterm')
        }

        // ========================================================================== //
        // S t a g e s //
        // ========================================================================== //

    stages {
    // 1. 确认构建的项目类型， java, vue, node, react
        stage('构建确认') {
            steps {
                timeout(time: 1, unit: 'MINUTES') {
                    script {
                        getBuildConfirm(opts.langType)
                    }
                }
            }
    }

    // 2. 开始构建代码并生成镜像
    stage('镜像打包') {
        agent {
        docker {
        // 构建环境
            reuseNode "${env.AGENT_REUSE_NODE}"
                image "${env.AGENT_IMAGE}"
                args "${env.AGENT_ARGS}"
            }
        }

        steps {
            timeout(time: 20, unit: 'MINUTES') {
                script {
                    getImagePackage(langType: "${env.LANG_TYPE}")
                }
            }
        }
    }

    // 3. 根据镜像进行服务部署
    stage('服务部署') {
        when {
        expression { env.DEPLOY == 'true'}
    }

    steps {
        script {
            deployToRancher()
        }
    }
    }

    // 4. 通知测试人员
    stage('通知测试') {
    when {
        branch 'testing'
    }

    steps {
        timeout(time: 5, unit: 'MINUTES') {
            script {
                informToTester()
            }
        }
    }
}

stage('构建信息') {
steps {
println(env.GLOBAL_BUILD_INFO + env.PROJECT_BUILD_INFO)
println(env.PUBLISH_ENV)
}
}
}

post {
always {
script {
if (env.PUBLISH_ENV == "none" || env.PUBLISH_ENV == "" || env.PUBLISH_ENV == null) {
echo "PUBLISH_ENV 为 空，跳过发布通知"
} else if (env.PUBLISH_ENV != null && env.PUBLISH_ENV.trim() != '') {
qwMessage()
} else {
echo "PUBLISH_ENV 为 null，跳过发布通知"
}
}
}
}
}
}