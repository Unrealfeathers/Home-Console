<script setup lang="ts">
import { ref } from 'vue'
import { ElConfigProvider, ElMessage, ElLoading } from 'element-plus';
import { getUserListService, deleteUserService, updateUserInfoService, userRegisterService } from '@/services/user.ts'
import zhCn from 'element-plus/es/locale/lang/zh-cn';

const role = ref('')
const username = ref('')
const userList = ref([
    {
        "id": "",
        "username": "",
        "email": "",
        "phone": "",
        "role": "",
        "last_login": "",
        "created_at": "",
        "updated_at": ""
    }
])

const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const addUserForm = ref({
    username: '',
    password: '',
    rePassword: ''
})
const editUserForm = ref({
    id: -1,
    username: '',
    email: '',
    phone: '',
    role: ''
})

const checkPassword = (rule: any, value: any, callback: any) => {
    if (value == '') {
        callback(new Error('请再次输入密码'))
    } else if (value != addUserForm.value.password) {
        callback(new Error('两次输入密码不一致'))
    } else {
        callback()
    }
}

const addFormRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 4, max: 64, message: '长度在 4 到 64 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 4, max: 32, message: '长度在 4 到 32 个字符', trigger: 'blur' }
    ],
    rePassword: [
        { required: true, message: '请重复密码', trigger: 'blur' },
        { validator: checkPassword, trigger: 'blur' }
    ]
}
const editFormRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        {
            pattern: /^\S{4,64}$/,
            message: '昵称必须是4-64位的非空字符串',
            trigger: 'blur'
        }
    ],
    email: [
        { required: false, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '格式不正确', trigger: 'blur' }
    ],
    phone: [
        { required: false, message: '请输入手机号', trigger: 'blur' },
        { type: 'phone', message: '格式不正确', trigger: 'blur' }
    ],
    role: [
        { required: false, message: '请选择角色', trigger: 'blur' },
        { pattern: /^(admin|user)$/, message: '角色不正确', trigger: 'blur' }
    ]
}

const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)

// 当条数发生变化，调用此函数
const onSizeChange = (size: number) => {
    pageSize.value = size
    pageNum.value = 1
    getUserList()
}
// 当页码发生变化，调用此函数
const onCurrentChange = (num: number) => {
    pageNum.value = num
    getUserList()
}

// 关闭编辑用户的对话框
const editDialogClosed = () => {
    editUserForm.value = {
        id: -1,
        username: '',
        email: '',
        phone: '',
        role: ''
    }
    editDialogVisible.value = false
}
// 展示编辑用户的对话框
const showEditDialog = (params: any) => {
    editUserForm.value = {
        id: params.id,
        username: params.username,
        email: params.email,
        phone: params.phone,
        role: params.role
    }
    editDialogVisible.value = true
}

// 关闭增加用户的对话框
const addDialogClosed = () => {
    addUserForm.value = {
        username: '',
        password: '',
        rePassword: ''
    }
    addDialogVisible.value = false
}
// 展示增加用户的对话框
const showAddDialog = () => {
    addDialogVisible.value = true
}

// 获取用户列表
const getUserList = async () => {
    let params = {
        page: pageNum.value,
        size: pageSize.value,

        username: username.value ? username.value : null,
        role: role.value ? role.value : null
    }
    let result = await getUserListService(params);
    total.value = result.data.total;
    userList.value = result.data.items;
}

// 新增用户
const addUser = async () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    try {
        await userRegisterService(addUserForm.value);
        getUserList();
        ElMessage.success('用户添加成功');
    } catch (error) {
        ElMessage.error('用户添加失败');
    } finally {
        loading.close();
        addDialogClosed();
    }
}

// 删除用户
const deleteUser = async (id: string) => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    let params = {
        user_id: id
    }
    try {
        await deleteUserService(params)
        getUserList();
        ElMessage.success('用户删除成功')
    } catch (error) {
        ElMessage.error('用户删除失败')
    } finally {
        loading.close()
    }
}

// 更新用户信息
const updateUser = async () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    try {
        await updateUserInfoService(editUserForm.value);
        getUserList();
        ElMessage.success('用户信息更新成功');
        editDialogClosed();
    } catch (error) {
        ElMessage.error('用户信息更新失败');
    } finally {
        loading.close();
    }
}

getUserList();
</script>

<template>
    <div class="card_container">
        <el-card class="card">
            <el-form inline class="header">
                <el-form-item label="用户名:">
                    <el-input v-model="username" />
                </el-form-item>
                <el-form-item label="角色:">
                    <el-select style="width: 200px" placeholder="请选择" v-model="role">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="管理员" value="admin"></el-option>
                        <el-option label="用户" value="user"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" @click="username = ''; role = ''">重置</el-button>
                    <el-button type="primary" @click="getUserList()">搜索</el-button>
                    <el-button type="success" @click="showAddDialog()">新增</el-button>
                </el-form-item>
            </el-form>
            <!-- 新增用户界面 -->
            <el-dialog title="新增用户" v-model="addDialogVisible" @close="addDialogClosed()" width="30%" center>
                <div class="div-center">
                    <el-form class="edit-form" label-width="auto" label-position="left" :model="addUserForm"
                        :rules="addFormRules">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="addUserForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="addUserForm.password" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="重复密码" prop="rePassword">
                            <el-input v-model="addUserForm.rePassword" show-password></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <template #footer>
                    <el-button type="primary" @click="addUser()">确定</el-button>
                    <el-button @click="addDialogClosed()">取消</el-button>
                </template>
            </el-dialog>
            <el-table class="table" :data="userList">
                <el-table-column label="用户ID" prop="id"></el-table-column>
                <el-table-column label="用户名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"> </el-table-column>
                <el-table-column label="手机号" prop="phone" show-overflow-tooltip></el-table-column>
                <el-table-column label="角色" prop="role" show-overflow-tooltip> </el-table-column>
                <el-table-column label="最后登录时间" prop="last_login" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" prop="created_at" show-overflow-tooltip></el-table-column>
                <el-table-column label="更新时间" prop="updated_at" show-overflow-tooltip> </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <div class="operation" v-if="scope.row.id">
                            <el-button type="primary" size="small" @click="showEditDialog(scope.row)">详情</el-button>
                            <el-button type="danger" size="small" @click="deleteUser(scope.row.id)">删除</el-button>
                        </div>
                    </template>

                </el-table-column>
                <template #empty>
                    <el-empty description="没有数据" />
                </template>
            </el-table>
            <!-- 用户信息修改界面 -->
            <el-dialog title="用户信息修改" v-model="editDialogVisible" @close="editDialogClosed()" width="30%" center>
                <div class="div-center">
                    <el-form class="edit-form" label-width="auto" label-position="left" :model="editUserForm"
                        :rules="editFormRules">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="editUserForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="editUserForm.email"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="editUserForm.phone"></el-input>
                        </el-form-item>
                        <el-form-item label="角色" prop="role">
                            <el-select placeholder="请选择" v-model="editUserForm.role">
                                <el-option label="管理员" value="admin"></el-option>
                                <el-option label="用户" value="user"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <template #footer>
                    <el-button type="primary" @click="updateUser()">确定</el-button>
                    <el-button @click="editDialogClosed()">取消</el-button>
                </template>
            </el-dialog>
            <!-- 分页条 -->
            <el-config-provider :locale="zhCn">
                <el-pagination class="pagination" v-model:current-page="pageNum" v-model:page-size="pageSize"
                    :page-sizes="[10, 15]" layout="total, sizes, prev, pager, next" background :total="total"
                    @size-change="onSizeChange" @current-change="onCurrentChange" />
            </el-config-provider>
        </el-card>
    </div>
</template>

<style scoped>
.card_container {
    width: 100%;
    height: 100%;
}

.card {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 30px;
    background-color: transparent;
}

.header {
    text-align: center;
}

.table {
    width: 100%;
    max-height: 100%;
    border-radius: 20px;
    background-color: transparent;
    --el-table-border-color: none;
    --el-table-header-bg-color: transparent;
    --el-table-tr-bg-color: transparent;
}

.operation {
    display: flex;
    justify-content: space-around;
}

.pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    padding-right: 20px;
}

.div-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.edit-form {
    width: 80%;
    margin-bottom: 18px;
}
</style>