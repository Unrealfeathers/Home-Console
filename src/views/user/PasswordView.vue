<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
import { useTokenStore } from '@/stores/token.ts';
import { updateUserPasswordService } from '@/services/user.ts'

const router = useRouter();
const tokenStore = useTokenStore()

const password = ref({
    password: "",
    new_password: '',
    re_password: ''
})

const rules = {
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 4, max: 32, message: '长度在 4 到 32 个字符', trigger: 'blur' }
    ],
    new_password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 4, max: 32, message: '长度在 4 到 32 个字符', trigger: 'blur' }
    ],
    re_password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 4, max: 32, message: '长度在 4 到 32 个字符', trigger: 'blur' }
    ]
}

const clearData = () => {
    password.value = {
        password: "",
        new_password: '',
        re_password: ''
    }
}

const updateUserPassword = async () => {
    let result = await updateUserPasswordService(password.value);
    if (result.status_code == 0) {
        ElMessage.success('密码修改成功')
        clearData()
        tokenStore.removeToken()
        router.push('/');
    } else {
        ElMessage.error('密码修改失败')
        ElMessage.error(result.message)
        clearData()
    }
}
</script>


<template>
    <el-card class="wrapper">
        <template #header>
            <div class="header">
                <span>修改密码</span>
            </div>
        </template>
        <el-form :model="password" :rules="rules" label-width="80px" size="large">
            <el-form-item label="原密码" prop="password">
                <el-input type="password" v-model="password.password"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="new_password">
                <el-input type="password" v-model="password.new_password"></el-input>
            </el-form-item>
            <el-form-item label="重复密码" prop="re_password">
                <el-input type="password" v-model="password.re_password"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button class="button" type="primary" @click="updateUserPassword()">修改密码</el-button>
        </template>
    </el-card>
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
        height: auto;
        padding: 0 50px;
        min-height: auto;
        margin: 0;
    }

    @media (min-width: 1200px) {
        width: 400px;
    }
}

.header {
    color: black;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
}

.button {
    height: 100%;
    width: 100%;
    font-size: 20px;
    text-align: center;
    border-radius: 16px;
    color: #ffffff;
    background-color: #abc1ee;
    --el-button-border-color: #ffffff;
}
</style>