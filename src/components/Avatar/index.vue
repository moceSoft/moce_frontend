<template>
    <img :src="img" :width="size" :height="size" />
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
    avatar:{
      type: String,
      default: ''
    },
    sex:{
      type: Number,
      default: 2
    }
  },
  data() {
    return {
    }
  },
  computed : {
    img : function(){
      return this.avatar?this.avatar:(this.sex === 1?avatar_female:avatar_male)
    }
  },
  methods: {
    
  }
}
</script>
