<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :md="18"  :xs="24" >
        <el-card class="box-card" style="margin-bottom:10px">
          <div slot="header" class="clearfix">
            <div style="float: left;margin-top:5px">
              <router-link to="/work/index" >
                <el-button size="mini" plain icon="el-icon-back" style="margin-right:10px">
                  返回
                </el-button>
              </router-link>
              #{{info.id}} {{info.title}}
            </div>
            <div style="float: right;margin-top:5px">
              <el-popover
                placement="bottom"
                trigger="click">
                <div>
                  <el-button size="mini">
                    已解决
                  </el-button>
                  <el-button size="mini">
                    无法完成
                  </el-button>
                </div>
                <el-button slot="reference" size="mini">
                  解决结果
                </el-button>
              </el-popover>
              <router-link :to="'/work/update/'+info.id" >
                <el-button type="primary" size="mini" plain style="margin-left:5px">
                  编辑任务
                </el-button>
              </router-link>
              <el-button type="danger" size="mini" plain style="margin-left:5px" @click="closeEvent">
                关闭任务
              </el-button>
            </div>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
          </div>
          <div>
            <el-row :gutter="4" v-loading="workLoading">
              <el-col :md="12" :xs="24" >
                <div class="item">
                  <div>主题：</div>
                  <div>{{info.title}}</div>
                </div>
                <div class="item">
                  <div>当前状态：</div>
                  <div><workstatus :status="parseInt(info.status)" :operable="operable" /></div>
                </div>
                <div class="item item_user">
                  <div>负责人：</div>
                  <div>
                    <router-link :to="'/user/view/'+info.appointed_user">          
                      <img :src="info.appointed_user_avatar?info.appointed_user_avatar:(info.appointed_user_sex==1?avatar_female:avatar_male)"  width="30" height="30" />
                      <div>{{info.appointed_user_name}}</div>
                    </router-link>
                  </div>
                </div>
                <div class="item">
                  <div>优先级：</div>
                  <div>
                    <el-rate
                      v-model="info.rank"
                      disabled
                      text-color="#ff9900"
                      score-template="{value}"
                      :texts="[
                        '次要工作','普通工作','优先工作','重要工作','紧急工作'
                      ]">
                    </el-rate>
                  </div>
                </div>
                <div class="item">
                  <div>所属项目：</div>
                  <div>{{info.project_name?info.project_name:'无'}}</div>
                </div>
                <div class="item">
                  <div>截止日期：</div>
                  <div>{{ info.end_time | endTimeFilter('{y}年{m}月{d}日')}}</div>
                </div>

              </el-col>

              <el-col :md="12" :xs="24" >

                <div class="item item_user">
                  <div>需要审核：</div>
                  <div>
                    <el-switch
                      disabled
                      v-model="info.need_check"
                      active-color="#13ce66"
                      inactive-color="#C0C4CC"
                      active-value=1
                      inactive-value=0>
                    </el-switch>

                    <router-link :to="'/user/view/'+info.check_user" style="margin-left:15px"  v-if="parseInt(info.need_check)">          
                      <img :src="info.check_user_avatar?info.check_user_avatar:(info.check_user_sex==1?avatar_female:avatar_male)"  width="30" height="30" />
                      <div>{{info.check_user_name}}</div>
                    </router-link>
                  </div>
                </div>

                <div class="item item_user">
                  <div>完成报告：</div>
                  <div>
                    <el-switch
                      disabled
                      v-model="info.need_report"
                      active-color="#13ce66"
                      inactive-color="#C0C4CC"
                      active-value=1
                      inactive-value=0>
                    </el-switch>
                    <el-button plain size="mini" type="primary" v-if="info.report" style="margin-left:15px" @click="viewReport">
                      查看报告
                    </el-button>
                  </div>
                </div>

                <div style="border:1px dashed #E7E7E7;border-radius: 4px;padding:0 20px">
                  <!-- <div style="height:40px;line-height:40px;font-size:13px;color:#454545">描述</div> -->
                  <div style="font-size:13px;color:#454545" v-if="info.description"  v-html="info.description"></div>
                  <div v-else style="font-size:18px;color:#D7D7D7;text-align:center;padding:40px;font-weight: bolder">
                    未添加工作描述
                  </div>
                </div>
              </el-col>
            </el-row>
            
          </div>
        </el-card>
        <el-card class="box-card" style="margin-bottom:10px">
          <div>
            <div>
              <span style="display:inline-block;color:#656565;font-size:15px;margin:10px 0">附件</span>
              <el-button style="float:right" size="mini" type="primary">
                上传附件
              </el-button>
            </div>
            <div style="border:1px solid #E7E7E7;height:auto;padding:10px">
              <el-row :gutter="10" style="width:100%">
                <el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="3" v-for="(file, i) in enclosures" :key="i" >
                  <el-link type="primary" class="enclosure">
                    <Enclosure :file="file" />
                  </el-link>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :md="6" :xs="24" >

        <el-card class="box-card" style="margin-bottom:10px">
          <div >
            
            <div class="item_center">
              <div style="margin-bottom: 15px;color:#767676">发布人</div>
              <div>
                <router-link :to="'/user/view/'+info.create_user" class="log_avatar">
                  <el-button plain>
                    <img :src="info.create_user_avatar?info.create_user_avatar:(info.create_user_sex==1?avatar_female:avatar_male)"  width="60" height="60" />
                    <div class="log_user_name">{{info.create_user_name}}</div>
                  </el-button>
                </router-link>
              </div>
            </div>

            <div style="text-align: center;color:#454545;margin-top:10px;font-size:14px">
              发布于 {{info.create_time | formatTime}}
            </div>
            
          </div>
        </el-card>
        <el-card class="box-card" style="margin-bottom:10px">
          <log :id="parseInt(id)" />
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="工作报告"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>{{info.report}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getInfo } from '@/api/work'
import WorkStatus from './components/WorkStatus'
import Log from './components/Log'
import Enclosure from './components/Enclosure'
import { parseTime, formatTime } from '@/utils'
import waves from '@/directive/waves' // waves directive
import avatar_female from '@/assets/images/avatar_female.png'
import avatar_male from '@/assets/images/avatar_male.png'

const STATUS_TAG_TEXT = {
  0 : '等待',
  10 : '进行中',
  20 : '已解决',
  30 : '失败',
  40 : '超时',
  50 : '无法完成',
  60 : '关闭',
  70 : '未通过审核',
  80 : '等待审核',
}
export default {
  name: 'info',
  components : {
    workstatus : WorkStatus,
    Log,
    Enclosure
  },
  directives: { waves },
  filters: {
    reviewFilter(status) {
      const statusMap = {
        1 : '是',
        0 : '否'
      }
      return statusMap[status]
    },

    timeFormatter(time, cFormat) {
      if(time > 0){
        return parseTime(time, cFormat)
      }else{
        return '';
      }
    },
    endTimeFilter(time, format){
      if(time > 0){
        return parseTime(time, format)
      }else{
        return '未设置'
      }
    }
  },
  data() {
    return {
      id : '',
      info: {
        id: 1,
        title : 'test',
        description : '',
        project: 0,
        project_name : null,
        parent : {

        },
        rank : 3,
        need_review : true,
        need_report : 0,
        appointed_user : 2,
        appointed_user_avatar : null,
        appointed_user_name : 'admin',
        appointed_user_sex : 1,
        end_time : 0,
        create_user : 1,
        create_user_avatar : null,
        create_user_name : 'admin',
        create_user_sex : 1,
        create_time : 1574768525,
        finish_time : 1574769525,
        status : 0,
      },

      enclosures : [
        {
          name: '测试.xlxs',
          path : 'https://panjiachen.gitee.io/vue-element-admin/#/components/dropzone',
          type : 'xlsx',
          timestamp : 1574769525
        },
        {
          name: '测试.xlxs',
          path : 'https://panjiachen.gitee.io/vue-element-admin/#/components/dropzone',
          type : 'xlsx',
          timestamp : 1574769525
        },
        {
          name: '测试.xlxs',
          path : 'https://panjiachen.gitee.io/vue-element-admin/#/components/dropzone',
          type : 'xlsx',
          timestamp : 1574769525
        },
        {
          name: '测试.xlxs',
          path : 'https://panjiachen.gitee.io/vue-element-admin/#/components/dropzone',
          type : 'xlsx',
          timestamp : 1574769525
        },
        {
          name: '测试.xlxs',
          path : 'https://panjiachen.gitee.io/vue-element-admin/#/components/dropzone',
          type : 'xlsx',
          timestamp : 1574769525
        },
      ],
      count : 0,
      status : STATUS_TAG_TEXT,
      projects : [],
      workLoading : true,
      avatar_male : avatar_male,
      avatar_female : avatar_female,
      dialogVisible:false
    }
  },
  created(){
    this.id = this.$route.params && this.$route.params.id
    this.getInfo(this.id)
  },
  computed:{
    operable:function(){
      return this.$store.state.user.id === this.info.appointed_user
    }
  },
  methods: {
    getInfo(id){
      getInfo(id).then(response=>{
        this.info = response.data
        this.workLoading = false
      }).catch(error=>{
        this.workLoading = false
      })
    },
    handleFilter(){

    },
    closeEvent(){

    },
    viewReport(){
      this.dialogVisible = true
    },
    handleClose(done) {
      done()
    }
  }
}
</script>
<style scoped>
.item{
 width: 100%;
 display: flex;
 color:#454545;
}
.item>div{
 display: flex;
 align-items: center;
 height:40px;
 font-size:13px;
}
.item>div:first-child{
  width:100px;
}
.item>div:last-child{
  flex-grow: 2;
}

.item_user a{
  display: flex;
  align-items: center;
}
.item_user a>div{
  display: inline-block;
  padding-left:10px;
  padding-top:2px;
}

.enclosure{
  margin-bottom: 5px;padding:0;display:flex;width: 100%;
}

.item_center{
   display: flex;
   align-items: center;
   justify-content: center;
   flex-direction: column;
}
.item_center>div{
  text-align: center;
}
</style>

