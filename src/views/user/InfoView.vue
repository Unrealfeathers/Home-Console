<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { updateUserInfoService, getUserInfoService } from '@/services/user.ts'
import router from '@/router';

const user_info = ref({
    username: '',
    email: '',
    phone: '',
    role: '',
})

const rules = {
    username: [
        { required: true, message: '请输入用户昵称', trigger: 'blur' },
        {
            pattern: /^\S{4,64}$/,
            message: '昵称必须是4-64位的非空字符串',
            trigger: 'blur'
        }
    ],
    email: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ]
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

const updateUserInfo = async () => {
    let response = await updateUserInfoService(user_info.value);
    if (response.status_code == 0) {
        ElMessage.success('修改成功')
        getUserInfo()
    } else {
        ElMessage.error('修改失败')
        ElMessage.error(response.message)
    }
}
getUserInfo()
</script>

<template>
    <el-card class="wrapper">
        <template #header>
            <div class="header">
                <span>个人信息</span>
            </div>
        </template>
        <el-form :model="user_info" :rules="rules" label-width="80px" size="large">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="user_info.username"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="user_info.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="user_info.phone"></el-input>
            </el-form-item>
            <el-form-item label="身份" prop="role">
                <el-input v-model="user_info.role" disabled></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button class="button" type="primary" @click="updateUserInfo()">提交修改</el-button>
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