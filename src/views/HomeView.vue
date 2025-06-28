<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useTokenStore } from '@/stores/token.ts';
import { getUserInfoService } from '@/services/user.ts'
import router from '@/router';

const isCollapse = ref(false)
const tokenStore = useTokenStore()

const user_info = ref({
    username: '',
    email: '',
    phone: '',
    role: '',
})

const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
}

const getUserInfo = async () => {
    let response = await getUserInfoService();
    if (response.status_code == 0) {
        user_info.value.username = response.data.username
        user_info.value.email = response.data.email
        user_info.value.phone = response.data.phone
        user_info.value.role = response.data.role
    } else {
        ElMessage.error('请先登录')
        router.push('/')
    }

}

getUserInfo()
</script>

<template>
    <!-- 导航栏 -->
    <el-header class="header">
        <el-row>
            <el-col>
                <div class="header-text" @click="toggleCollapse">
                    控制台
                </div>
            </el-col>
        </el-row>
    </el-header>
    <!-- 主界面 -->
    <el-container class="main">
        <!-- 侧边栏 -->
        <el-aside :style="{ minWidth: isCollapse ? '0px' : '10vw', width: isCollapse ? '0px' : '160px' }" class="aside">
            <el-menu class="menu" text-color="black" :collapse="isCollapse" router>
                <el-menu-item index="/home">
                    <span class="menu-text">首页</span>
                </el-menu-item>
                <el-sub-menu index="1">
                    <template #title>
                        <span>节点管理</span>
                    </template>
                    <el-menu-item index="/device/list">
                        <span>设备管理</span>
                    </el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="2">
                    <template #title>
                        <span>数据管理</span>
                    </template>
                    <el-menu-item index="/data/list">
                        <span>环境数据</span>
                    </el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="3">
                    <template #title>
                        <span>账号管理</span>
                    </template>
                    <el-menu-item index="/info">
                        <span>信息修改</span>
                    </el-menu-item>
                    <el-menu-item index="/password">
                        <span>密码修改</span>
                    </el-menu-item>
                    <el-menu-item index="/" @click="tokenStore.removeToken()">
                        <span>退出登录</span>
                    </el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="4" v-if="user_info.role === 'admin'">
                    <template #title>
                        <span>用户管理</span>
                    </template>
                    <el-menu-item index="/user/list">
                        <span>系统用户</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 内容页 -->
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<style scoped>
.header {
    height: 7vh;
    width: 100vw;
    background-color: #99baf3;
}

.header-text {
    font-size: 1.5rem;
    padding: 5px;
    margin-top: 5px;
    color: #FFFAFA;
}

.main {
    height: 93vh;
    width: 100vw;
    background-color: #f8f8f8;
}

.aside {
    /* position: relative; */
    /* z-index: 1000; */
    background-color: #ffffff;
}

.el-aside {
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu {
    border-right: 0px;
    background-color: transparent;
}
</style>