<template>
  <el-avatar :size="size" :shape="shape" :src="img"></el-avatar>
</template>

<script>
import avatar_female from '@/assets/images/avatar_female.png'
import avatar_male from '@/assets/images/avatar_male.png'

export default {
  name: 'Avatar',
  props: {
    size: {
      type: Number,
      default: 60
    },
    shape: {
      type: String,
      default: 'square'
    },
    user: {
      type: Object,
      default: function() {
        return {
          sex : 2,
          avatar : '',
        }
      }
    },
  },
  data() {
    return {
    }
  },
  computed : {
    img : function(){
      return this.user.sex === 1?avatar_female:avatar_male
    }
  },
  methods: {
    
  }
}
</script>
