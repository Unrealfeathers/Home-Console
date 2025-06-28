<script setup lang="ts">
import { ref } from 'vue'
import { ElConfigProvider, ElMessage, ElLoading } from 'element-plus';
import { getDataListService, deleteDataService } from '@/services/data.ts'
import zhCn from 'element-plus/es/locale/lang/zh-cn';

const location = ref('')
const dataList = ref([
    {
        "id": "",
        "device_name": "",
        "timestamp": "",
        "temperature": "",
        "humidity": "",
        "illuminance": "",
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
    getDataList()
}

// 当页码发生变化，调用此函数
const onCurrentChange = (num: number) => {
    pageNum.value = num
    getDataList()
}

// 获取数据列表
const getDataList = async () => {
    let params = {
        page: pageNum.value,
        size: pageSize.value,

        location: location.value ? location.value : null
    }
    let result = await getDataListService(params);
    total.value = result.data.total;
    dataList.value = result.data.items;
}

const deleteData = async (id: string) => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    let params = {
        data_id: id
    }
    try {
        await deleteDataService(params)
        getDataList()
        ElMessage.success('数据删除成功')
    } catch (error) {
        ElMessage.error('数据删除失败')
    } finally {
        loading.close()
    }
}

getDataList();
</script>

<template>
    <div class="card_container">
        <el-card class="card">
            <el-form inline class="header">
                <el-form-item label="位置:">
                    <el-select style="width: 200px" placeholder="请选择" v-model="location">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="客厅" value="1"></el-option>
                        <el-option label="卧室" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" @click="location = ''">重置</el-button>
                    <el-button type="primary" @click="getDataList()">搜索</el-button>
                </el-form-item>
            </el-form>
            <el-table class="table" :data="dataList">
                <el-table-column label="数据ID" prop="id"></el-table-column>
                <el-table-column label="设备名" prop="device_name"></el-table-column>
                <el-table-column label="时间戳" prop="timestamp" show-overflow-tooltip> </el-table-column>
                <el-table-column label="温度" prop="temperature"></el-table-column>
                <el-table-column label="湿度" prop="humidity"> </el-table-column>
                <el-table-column label="光照度" prop="illuminance"></el-table-column>
                <el-table-column label="位置" prop="location_name"></el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <div class="operation" v-if="scope.row.id">
                            <el-button type="danger" size="small" @click="deleteData(scope.row.id)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
                <template #empty>
                    <el-empty description="没有数据" />
                </template>
            </el-table>
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
</style>