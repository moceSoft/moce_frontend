<template>
  <div ref="rightPanel" class="rightPanel-container" :class="{show:show}">
    <div class="rightPanel-background" />
    <div class="rightPanel">
      <div class="handle-button" :style="{'top':buttonTop+'px','background-color':theme}" v-show="show" @click="closeDrawer"> 
        <i class="el-icon-close" />
      </div>
      <div class="rightPanel-items">
        <slot />
      </div>
      <div class="drawer_clost_btn">
        <el-button type="primary" style="width:100%" @click="closeDrawer">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { addClass, removeClass } from '@/utils'

export default {
  name: 'Drawer',
  props: {
    clickNotClose: {
      default: false,
      type: Boolean
    },
    buttonTop: {
      default: 0,
      type: Number
    },
    show : {
      default : false,
      type: Boolean
    }
  },
  data() {
    return {
      display : this.show
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme
    }
  },
  watch: {
    display(value) {
      if (value && !this.clickNotClose) {
        this.addEventClick()
      }
      if (value) {
        addClass(document.body, 'showRightPanel')
      } else {
        removeClass(document.body, 'showRightPanel')
      }
    }
  },
  mounted() {
    this.insertToBody()
  },
  beforeDestroy() {
    const elx = this.$refs.rightPanel
    elx.remove()
  },
  methods: {
    addEventClick() {
      window.addEventListener('click', this.closeDrawer)
    },
    closeDrawer(evt) {
      const parent = evt.target.closest('.rightPanel')
      if (!parent) {
        this.display = false;
        window.removeEventListener('click', this.closeDrawer)
      }
      this.$emit('close');
    },
    insertToBody() {
      const elx = this.$refs.rightPanel
      const body = document.querySelector('body')
      body.insertBefore(elx, body.firstChild)
    }
  }
}
</script>

<style>
.showRightPanel {
  overflow: hidden;
  position: relative;
  width: calc(100% - 15px);
}
.rightPanel-items{
  width: 100%;
  height: 100%;
  overflow: auto;
}
.drawer_clost_btn{
  position:absolute;
  bottom:0;
  padding:18px;
  width:100%;
}

.drawer_container{
  padding:20px;
}
.drawer-title {
  margin-bottom: 12px;
  color: rgba(0, 0, 0, .85);
  font-size: 14px;
  line-height: 22px;
  font-weight: 300;
  margin-top: 0;
  border-bottom: 1px solid #e7e7e7;
  padding-bottom: 12px;
}
.drawer-item {
  color: rgba(0, 0, 0, .65);
  font-size: 14px;
  padding: 12px 0;
}
</style>

<style lang="scss" scoped>
.rightPanel-background {
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity .3s cubic-bezier(.7, .3, .1, 1);
  background: rgba(0, 0, 0, .2);
  z-index: -1;
}

.rightPanel {
  width: 100%;
  max-width: 360px;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, .05);
  transition: all .25s cubic-bezier(.7, .3, .1, 1);
  transform: translate(100%);
  background: #fff;
  z-index: 200;
}

.show {
  transition: all .3s cubic-bezier(.7, .3, .1, 1);

  .rightPanel-background {
    z-index: 199;
    opacity: 1;
    width: 100%;
    height: 100%;
  }

  .rightPanel {
    transform: translate(0);
  }
}

.handle-button {
  width: 48px;
  height: 48px;
  position: absolute;
  left: -48px;
  text-align: center;
  font-size: 24px;
  border-radius: 6px 0 0 6px !important;
  z-index: 0;
  pointer-events: auto;
  cursor: pointer;
  color: #fff;
  line-height: 48px;
  i {
    font-size: 24px;
    line-height: 48px;
  }
}
</style>
