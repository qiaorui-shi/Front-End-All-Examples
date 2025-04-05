def call() {
    // ============== 全局变量 ============
    env.GLOBAL_BUILD_INFO = "========全局构建信息打印==========\n"

    // 前置信息获取
    def buildInfo = env.JOB_NAME.split('/')

    // 组项目名
    // env.PROJECT_GROUP = buildInfo[1].split('%2F')[0]
    // 更改获取组名的方式 fast-app%2Fout%2Fac-fam-notification ， 获取项目名前面的值为
    def lastIndex = buildInfo[1].lastIndexOf("%2F")
    env.PROJECT_GROUP = buildInfo[1].substring(0, lastIndex)
    env.GLOBAL_BUILD_INFO += "gitlab分组: " + env.PROJECT_GROUP + "\n"

    // 更改获取项目名的方式 分隔符最后一个
    env.PROJECT_NAME = buildInfo[1].split('%2F')[-1].replaceAll("_", "-")
    env.GLOBAL_BUILD_INFO += "gitlab服务名: "+ env.PROJECT_NAME + "\n"
}