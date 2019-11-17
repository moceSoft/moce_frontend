<template>
  <div class="app-container flex-center">
  </div>
</template>

<script>
import { getInfo } from '@/api/position';

export default {
  name: 'positionView',
  components :{
  },
  data() {
    return {
    }
  },
  created(){
    // this.fetchData();
    const id = this.$route.params && this.$route.params.id
    this.fetchData(id);
  },
  methods: {
    fetchData(id){
      getInfo(id).then(response=>{

      }).catch(error=>{
        
      })
    }
  }
}
</script>
<style>
</style>
