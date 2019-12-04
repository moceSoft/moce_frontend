<template>
	<div>
		<el-dialog
		  title="添加项目成员"
		  :show-close=false
		  :visible="visible"
  		  :before-close="handleClose"
  		  :fullscreen="fullScreen"
  		  destroy-on-close="true"
		>
			<div v-loading="loading">
				<div class="filter-container">
			      <el-row :gutter="4">
			        <el-col :lg="4" :xs="24" :sm="8" :md="6">
			          <el-input v-model="query.name" placeholder="员工姓名"  class="filter-item" @keyup.enter.native="handleFilter" />
			        </el-col>
			        <el-col :lg="4" :xs="24" :sm="8" :md="6">
			          <el-input v-model="query.phone" placeholder="员工电话" class="filter-item" @keyup.enter.native="handleFilter" />
			        </el-col>
			        <el-col :lg="8" :xs="24" :sm="24" :md="12">
			          <el-button-group> 
			            <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
			              搜索
			            </el-button>
			          </el-button-group>
			        </el-col>
			      </el-row>
			    </div>
			    <div v-if="total > 0">
	  				<el-checkbox-group v-model="select">
						<el-popover
							:title="user.name"
		    				trigger="hover"
		    				v-for="user in tableData" :key="user.id" 
		    				style="margin:5px"
		    				transition="">
		    				<div>
		    					{{user.department_name | getDepartment}} - {{user.position_name | getPosition}}
		    				</div>
							<el-checkbox class="user_item" slot="reference" :label="user.id">
								<div>
									<avatar :avatar="user.avatar" :sex='parseInt(user.sex)' :size="60" />
									<div style="text-align:center">{{user.name}}</div>
								</div>
							</el-checkbox>
						</el-popover>
					</el-checkbox-group>
				</div>
				<div v-else style="padding:20px;text-align:center">
					未找到员工信息
				</div>
    			<pagination v-show="total>0" :total="total" :page.sync="query.page" :limit.sync="query.limit" @pagination="getList" style="padding:0"/>
			</div>

		  	<span slot="footer" class="dialog-footer">
			    <el-button @click="close">关闭</el-button>
			    <el-button type="primary" @click="submit">确认添加</el-button>
		  	</span>
		</el-dialog>
	</div>
</template>

<script>
import { fetchList } from '@/api/user'
import { addProjectUser } from '@/api/project'
import Avatar from '@/components/Avatar'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import waves from '@/directive/waves' // waves directive

export default {
	components:{
		Avatar,
		Pagination
	},
  	directives: { waves },
	props :{
		visible: {
			type : Boolean,
			default : false
		},
		id :{
			type : Number,
		},
	},
	filters:{
	    getDepartment(department){
	      return department?department:'未指派部门'
	    },
	    getPosition(position){
	      return position?position:'未指派职位' 
	    },
	},
	data(){
		return {
		  tableData : [],
	      query : {
	        name : '',
	        department : '',
	        phone : '',
	        page: 1,
	        limit: 30,
	        filter : true,
	      },
	      loading : true,
      	  total : 0,
      	  select : [],
		}
	},
	mounted(){
		this.getList()
	},
	computed:{
		fullScreen : ()=>{
			return window.innerWidth < 1024?true:false
		}
	},
	methods:{
		getList(){
			this.loading = true;
		    fetchList({...this.query, project: this.id}).then(response => {
		        this.tableData = response.data.list
		        this.total = parseInt(response.data.count)
		        this.loading = false
		    }).catch(error=>{
		        // console.error(error)
		        this.loading = false
		        // this.$message
		    })
		},
		close(){
			this.$emit('close')
		},
      	handleClose(done) {
	        
      	},
      	handleFilter(){
      		this.getList()
      	},
      	submit(){
      		this.$confirm('确认添加该项目成员?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'primary'
	        }).then(()=>{
	      		addProjectUser({project : this.id, users : this.select}).then(response=>{

	      		}).catch(error=>{

	      		})
      		})
      	}
	}
}
</script>
<style scoped>
.user_item{
	position:relative;
	width:96px;
	height:96px;
	border:1px solid #dcdfe6;
	border-radius: 3px;
	padding:6px;
}
.user_item:hover{
	background-color:#ecf5ff;
	border-color:#b3d8ff;
}
.user_item>>>.el-checkbox__input{
	position:absolute;
	top:-1px;
	left:-1px;
}
</style>