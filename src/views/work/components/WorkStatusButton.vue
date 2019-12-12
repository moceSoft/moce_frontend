<template>
  <div class="status">
    <el-dropdown >
      <el-button  size="mini" :type="statusTag">{{statusText}} <i class="el-icon-arrow-down el-icon--right"></i></el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(status, i) in operableStatuses" :key="i">
          {{status}}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>


<script>

const STATUS_TAG_TYPE = {
	0 : null,
	10 : null,
	20 : 'success',
	30 : 'danger',
	40 : 'warning',
	50 : 'danger',
	60 : 'info',
	70 : 'danger',
	80 : 'success',
}

const STATUS_TAG_TEXT = {
	0 : '等待处理',
	10 : '进行中',
	20 : '完成',
	30 : '失败',
	40 : '超时',
	50 : '无法完成',
	60 : '关闭',
	70 : '未通过审核',
	80 : '等待审核',
}

const STATUS_OPERABLE_TAG_TEXT = {
  0 : '等待处理',
  10 : '进行中',
  20 : '完成',
  50 : '无法完成',
  60 : '关闭',
  70 : '通过审核',
}

export default {
  name: 'WorkStatusButton',
  props: {
    status: {
      type: Number,
      default: 0
    },
    reviewUser:{
      type : Number,
      default: 0
    },

  },
  data() {
    return {
      statuses : STATUS_TAG_TEXT,
      operableStatuses : STATUS_OPERABLE_TAG_TEXT
    }
  },
  computed: {
    // 计算属性的 getter
    statusText: function () {
    	return STATUS_TAG_TEXT[this.status]
    },
    statusTag : function(){
    	return STATUS_TAG_TYPE[this.status]
    },
    operational : function(){
      return this.$store.state.user.id === this.appointedUser
    }
  },
  methods: {

  }
}
</script>
<style scoped>
  .status{
    display: inline-block;
  }
</style>