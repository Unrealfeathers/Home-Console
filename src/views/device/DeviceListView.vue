<script setup lang="ts">
import { ref } from 'vue'
import { ElConfigProvider, ElMessage, ElLoading } from 'element-plus';
import { addDeviceService, getDeviceListService, deleteDeviceService, updateDeviceService } from '@/services/device.ts'
import zhCn from 'element-plus/es/locale/lang/zh-cn';

const type_id = ref('')
const is_online = ref('')
const location = ref('')
const deviceList = ref([
    {
        "id": "",
        "name": "",
        "type_name": "",
        "serial_number": "",
        "mac_address": "",
        "firmware_version": "",
        "created_at": "",
        "last_online": "",
        "is_online": "",
        "location_name": ""
    }
])

const total = ref(0)
const pageNum = ref(1)
const pageSize = ref(10)

// 当条数发生变化，调用此函数
const onSizeChange = (size: number) => {
    pageSize.value = size
    pageNum.value = 1
    getDeviceList()
}

// 当页码发生变化，调用此函数
const onCurrentChange = (num: number) => {
    pageNum.value = num
    getDeviceList()
}

const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const addDeviceForm = ref({
    name: '',
    type_id: '',
    serial_number: '',
    mac_address: '',
    firmware_version: '',
    location_id: ''
})
const editDeviceForm = ref({
    id: -1,
    name: '',
    location_id: ''
})

// 关闭添加页面对话框
const addDialogClosed = () => {
    addDeviceForm.value = {
        name: '',
        type_id: '',
        serial_number: '',
        mac_address: '',
        firmware_version: '',
        location_id: ''
    }
    addDialogVisible.value = false
}
// 展示添加页面对话框
const showAddDialog = () => {
    addDialogVisible.value = true
}

// 关闭编辑页面对话框
const editDialogClosed = () => {
    editDeviceForm.value = {
        id: -1,
        name: '',
        location_id: ''
    }
    editDialogVisible.value = false
}
// 展示编辑页面对话框
const showEditDialog = (params: any) => {
    editDeviceForm.value = {
        id: params.id,
        name: params.name,
        location_id: params.location_id
    }
    editDialogVisible.value = true
}

const addFormRules = {
    name: [
        { required: true, message: '请输入设备名', trigger: 'blur' },
        { min: 4, max: 32, message: '长度在 4 到 32 个字符', trigger: 'blur' }
    ],
    type_id: [
        { required: true, message: '请选择类型', trigger: 'blur' }
    ],
    serial_number: [
        { required: true, message: '请输入序列号', trigger: 'blur' },
        { max: 36, message: '长度为 36 个字符', trigger: 'blur' }
    ],
    mac_address: [
        { required: true, message: '请输入MAC地址', trigger: 'blur' },
        { max: 32, message: '长度在 32 个字符', trigger: 'blur' }
    ],
    firmware_version: [
        { required: true, message: '请输入固件版本', trigger: 'blur' },
        { max: 16, message: '长度在 16 个字符', trigger: 'blur' }
    ],
    location_id: [
        { required: true, message: '请选择位置', trigger: 'blur' }
    ]
}
const editFormRules = {
    id: [
        { required: true, message: '请输入设备ID', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入设备名', trigger: 'blur' },
        { min: 4, max: 32, message: '长度在 4 到 32 个字符', trigger: 'blur' }
    ],
    location_id: [
        { required: true, message: '请选择位置', trigger: 'blur' }
    ]
}

// 添加设备
const addDevice = async () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    try {
        await addDeviceService(addDeviceForm.value);
        getDeviceList();
        ElMessage.success('设备添加成功');
    } catch (error) {
        ElMessage.error('设备添加失败');
    } finally {
        loading.close();
        addDialogClosed();
    }
}

// 获取设备列表
const getDeviceList = async () => {
    let params = {
        page: pageNum.value,
        size: pageSize.value,

        type: type_id.value ? type_id.value : null,
        is_online: is_online.value ? is_online.value : null,
        location: location.value ? location.value : null
    }
    let result = await getDeviceListService(params);
    total.value = result.data.total;
    deviceList.value = result.data.items;
}

// 删除设备
const deleteDevice = async (id: string) => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    let params = {
        device_id: id
    }
    try {
        await deleteDeviceService(params)
        getDeviceList()
        ElMessage.success('设备删除成功')
    } catch (error) {
        ElMessage.error('设备删除失败')
    } finally {
        loading.close();
    }
}

// 修改设备信息
const updateUser = async () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    try {
        await updateDeviceService(editDeviceForm.value);
        getDeviceList();
        ElMessage.success('设备信息修改成功');
    } catch (error) {
        ElMessage.error('设备信息修改失败');
    } finally {
        loading.close();
        editDialogClosed();
    }
}

getDeviceList();
</script>

<template>
    <div class="card_container">
        <el-card class="card">
            <el-form inline class="header">
                <el-form-item label="设备类型:">
                    <el-select style="width: 200px" placeholder="请选择" v-model="type_id">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="环境传感器" value="1"></el-option>
                        <el-option label="人体传感器" value="2"></el-option>
                        <el-option label="红外执行器" value="3"></el-option>
                        <el-option label="舵机执行器" value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否在线:">
                    <el-select style="width: 200px" placeholder="请选择" v-model="is_online">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="在线" value="true"></el-option>
                        <el-option label="离线" value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="位置:">
                    <el-select style="width: 200px" placeholder="请选择" v-model="location">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="客厅" value="1"></el-option>
                        <el-option label="卧室" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" @click="type_id = ''; is_online = ''; location = ''">重置</el-button>
                    <el-button type="primary" @click="getDeviceList()">搜索</el-button>
                    <el-button type="success" @click="showAddDialog()">新增</el-button>
                </el-form-item>
            </el-form>
            <!-- 添加设备界面 -->
            <el-dialog title="添加设备" v-model="addDialogVisible" @close="addDialogClosed()" width="30%" center>
                <div class="div-center">
                    <el-form class="edit-form" label-width="auto" label-position="left" :model="addDeviceForm"
                        :rules="addFormRules">
                        <el-form-item label="设备名" prop="name">
                            <el-input v-model="addDeviceForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="类型" prop="type_id">
                            <el-select placeholder="请选择" v-model="addDeviceForm.type_id" style="width: 100%">
                                <el-option label="环境传感器" value="1"></el-option>
                                <el-option label="人体检测器" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="序列号" prop="serial_number">
                            <el-input v-model="addDeviceForm.serial_number"></el-input>
                        </el-form-item>
                        <el-form-item label="MAC地址" prop="mac_address">
                            <el-input v-model="addDeviceForm.mac_address"></el-input>
                        </el-form-item>
                        <el-form-item label="固件版本" prop="firmware_version">
                            <el-input v-model="addDeviceForm.firmware_version"></el-input>
                        </el-form-item>
                        <el-form-item label="位置" prop="location_id">
                            <el-select placeholder="请选择" v-model="addDeviceForm.location_id">
                                <el-option label="客厅" value="1"></el-option>
                                <el-option label="卧室" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <template #footer>
                    <el-button type="primary" @click="addDevice()">确定</el-button>
                    <el-button @click="addDialogClosed()">取消</el-button>
                </template>
            </el-dialog>
            <el-table class="table" :data="deviceList">
                <el-table-column label="设备ID" prop="id"></el-table-column>
                <el-table-column label="设备名" prop="name"></el-table-column>
                <el-table-column label="设备类型" prop="type_name"> </el-table-column>
                <el-table-column label="序列号" prop="serial_number" show-overflow-tooltip></el-table-column>
                <el-table-column label="MAC地址" prop="mac_address" show-overflow-tooltip> </el-table-column>
                <el-table-column label="固件版本" prop="firmware_version"></el-table-column>
                <el-table-column label="创建时间" prop="created_at" show-overflow-tooltip></el-table-column>
                <el-table-column label="最后在线时间" prop="last_online" show-overflow-tooltip> </el-table-column>
                <el-table-column label="状态" prop="is_online">
                    <template #default="scope">
                        <div class="status">
                            <span v-if="scope.row.is_online === true">
                                <i class="dotClass" style="background-color: #67C23A"></i>
                            </span>
                            <span v-if="scope.row.is_online === false">
                                <i class="dotClass" style="background-color: #F56C6C"></i>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="位置" prop="location_name"></el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <div class="operation" v-if="scope.row.id">
                            <el-button type="primary" size="small" @click="showEditDialog(scope.row)">详情</el-button>
                            <el-button type="danger" size="small" @click="deleteDevice(scope.row.id)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="没有数据" />
                </template>
            </el-table>
            <!-- 设备信息修改界面 -->
            <el-dialog title="设备信息修改" v-model="editDialogVisible" @close="editDialogClosed()" width="30%" center>
                <div class="div-center">
                    <el-form class="edit-form" label-width="auto" label-position="left" :model="editDeviceForm"
                        :rules="editFormRules">
                        <el-form-item label="设备ID" prop="id">
                            <el-input v-model="editDeviceForm.id"></el-input>
                        </el-form-item>
                        <el-form-item label="设备名" prop="name">
                            <el-input v-model="editDeviceForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="位置" prop="location_id">
                            <el-select placeholder="请选择" v-model="editDeviceForm.location_id">
                                <el-option label="客厅" value="1"></el-option>
                                <el-option label="卧室" value="2"></el-option>
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

.status {
    display: flex;
    justify-content: start;
    align-items: center;
}

.operation {
    display: flex;
    justify-content: space-around;
}

.dotClass {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: block;
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