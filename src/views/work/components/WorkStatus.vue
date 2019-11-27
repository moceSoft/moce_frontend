<template>
  <el-tag :type="statusTag">
    {{statusText}}
  </el-tag>
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
  name: 'WorkStatus',
  props: {
    status: {
      type: Number,
      default: 0
    },
  },
  data() {
    return {
      
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
  },
  methods: {
    handleCopy(text, event) {
      clip(text, event)
    },
    clipboardSuccess() {
      this.$message({
        message: 'Copy successfully',
        type: 'success',
        duration: 1500
      })
    }
  }
}
</script>