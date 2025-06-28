<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useTokenStore } from '@/stores/token.ts';
import { userLoginService, userRegisterService } from '@/services/user.ts'

const isLogin = ref(true)
const router = useRouter()
const tokenStore = useTokenStore()

const login_data = ref({
    username: '',
    password: ''
})
const signup_data = ref({
    username: '',
    password: '',
    rePassword: ''
})

const clearData = () => {
    login_data.value = {
        username: '',
        password: ''
    }
    signup_data.value = {
        username: '',
        password: '',
        rePassword: ''
    }
}

const login = async () => {
    let result = await userLoginService(login_data.value);

    if (result.status_code == 0) {
        tokenStore.setToken(result.data)
        ElMessage.success('登陆成功')
        router.push('/home')
    } else {
        ElMessage.error('登陆失败')
        ElMessage.error(result.message)
        clearData()
    }
}

const signup = async () => {
    let result = await userRegisterService(signup_data.value);
    if (result.status_code == 0) {
        ElMessage.success('注册成功')
        clearData()
        isLogin.value = true
    } else {
        ElMessage.error('注册失败')
        ElMessage.error(result.message)
        clearData()
    }
}

const checkPassword = (rule: any, value: any, callback: any) => {
    if (value == '') {
        callback(new Error('请再次输入密码'))
    } else if (value != signup_data.value.password) {
        callback(new Error('两次输入密码不一致'))
    } else {
        callback()
    }
}

const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 4, max: 64, message: '长度在 4 到 64 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 4, max: 32, message: '长度在 4 到 32 个字符', trigger: 'blur' }
    ],
    rePassword: [
        { validator: checkPassword, trigger: 'blur' }
    ]
}
</script>

<template>
    <!-- 登陆表单 -->
    <el-form class="wrapper" ref="form" autocomplete="off" v-if="isLogin" :model="login_data" :rules="rules">
        <el-form-item>
            <div class="header">
                <h1 class="header-text">
                    登录
                </h1>
            </div>
        </el-form-item>
        <el-form-item prop="username">
            <el-input size="large" type="text" v-model="login_data.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item prop="password">
            <el-input size="large" type="password" v-model="login_data.password" placeholder="密码" />
        </el-form-item>
        <el-form-item>
            <el-button class="button" @click="login()">登录</el-button>
        </el-form-item>
        <el-form-item>
            <div class="footer">
                <el-text class="footer-text">没有账号？</el-text>
                <el-link class="footer-text-light" type="info" :underline="false"
                    @click="isLogin = false; clearData()">点击注册</el-link>
            </div>
        </el-form-item>
    </el-form>
    <!-- 注册表单 -->
    <el-form class="wrapper" ref="form" autocomplete="off" v-if="!isLogin" :model="signup_data" :rules="rules">
        <el-form-item>
            <div class="header">
                <h1 class="header-text">
                    注册
                </h1>
            </div>
        </el-form-item>
        <el-form-item prop="username">
            <el-input size="large" type="text" v-model="signup_data.username" placeholder="用户名" />
        </el-form-item>
        <el-form-item prop="password">
            <el-input size="large" type="password" v-model="signup_data.password" placeholder="密码" />
        </el-form-item>
        <el-form-item prop="rePassword">
            <el-input size="large" type="password" v-model="signup_data.rePassword" placeholder="重复密码" />
        </el-form-item>
        <el-form-item>
            <el-button class="button" @click="signup()">注册</el-button>
        </el-form-item>
        <el-form-item>
            <div class="footer">
                <el-link class="footer-text-light" type="info" :underline="false"
                    @click="isLogin = true; clearData()">返回登陆</el-link>
            </div>
        </el-form-item>
    </el-form>
</template>

<style scoped>
.wrapper {
    width: 90%;
    max-width: 500px;
    min-width: 300px;
    min-height: 400px;

    padding: 20px;
    background-color: #ffffff;
    border-radius: 15px;
    box-sizing: border-box;

    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    flex-direction: column;
    justify-content: center;

    height: auto;
    margin: 20px 0;

    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

    @media (min-width: 768px) {
        width: 18vw;
        height: 60vh;
        padding: 0 50px;
        min-height: auto;
        margin: 0;
    }

    @media (min-width: 1200px) {
        width: 400px;
    }
}

.header {
    text-align: center;
    width: 100%;
}

.header-text {
    font-size: 2rem;
    color: black;
    font-weight: bold;
}

.button {
    font-size: 20px;
    text-align: center;
    padding: 10px;
    height: 100%;
    width: 100%;
    border-radius: 20px;
    margin-top: 10px;
    background-color: #abc1ee;
    color: #fff;
}

.footer {
    width: 100%;
    margin-top: 10px;
    display: flex;
    text-align: center;
    justify-content: center;
}

.footer-text {
    font-size: 1rem;
    color: #888888;
    font-weight: bold;
}

.footer-text-light {
    font-size: 1rem;
    color: #abc1ee;
    font-weight: bold;
}
</style>