<template>
  <div :class="classObj" class="app-wrapper">
    <topbar />
    <sidebar v-if="routes2.length>1" class="sidebar-container" />
    <div :class="{sidebarHide: routes2.length<=1, threeLevelRouteShow: routes2.length>1 && routes3.length>1}" class="main-container">
      <subbar v-if="routes2.length>1 && routes3.length>1" />
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, Topbar, Subbar } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import GetSubRoutes from './mixin/GetSubRoutes'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Topbar,
    Subbar
  },
  data() {
    return {
      routes2: [],
      routes3: []
    }
  },
  mixins: [ResizeMixin, GetSubRoutes],
  watch: {
    $route: {
      handler(newVal, oldVal) {
        this.routes2 = this.GetLevel2Routes(newVal, oldVal);
        this.routes3 = this.GetLevel3Routes(newVal, oldVal);
      },
      deep: true,
      immediate: true
    } 
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: this.sidebar.hide,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    // height: 100%;
    // height: $contentHeight;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
