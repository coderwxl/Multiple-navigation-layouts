<template>
  <div class="sub-nav">
    <el-menu
      :active-text-color="variables.menuActiveText"
      :default-active="activeMenu"
      mode="horizontal"
    >
      <div v-for="item in routes" :key="item.path" class="nav-item">
        <app-link :to="resolvePath(item)">
          <el-menu-item
            v-if="!item.hidden"
            :index="resolvePath(item)"
          >{{ item.meta ? item.meta.title : item.children[0].meta.title }}</el-menu-item>
        </app-link>
      </div>
    </el-menu>
  </div>
</template>

<script>
import path from 'path'
import AppLink from './Sidebar/Link'
import variables from '@/styles/variables.scss'
import { isExternal } from '@/utils/validate'
import GetSubRoutes from '../mixin/GetSubRoutes'

export default {
  name: "Subbar",
  components: {
    AppLink
  },
  mixins: [ GetSubRoutes ],
  data() {
    return {
      routes: []
    }
  },
  watch: {
    $route: {
      handler(newVal, oldVal) {
        this.routes = this.GetLevel3Routes(newVal, oldVal);
      },
      deep: true,
      immediate: true
    } 
  },
  computed: {
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    variables() {
      return variables
    }
  },
  methods: {
    resolvePath(item) {
      // 如果是个完整的url直接返回
      if (isExternal(item.path)) {
        return item.path
      }
      let secondRoute = ''
      let currentRoute = this.GetLevel1Route()
      if (currentRoute.path === "/"){
        secondRoute = this.$route.path.split('/')[1]
      } else {
        secondRoute = this.$route.path.split('/')[2]
      }
      let tmp = currentRoute.children.find(item => item.path === secondRoute)

      return path.resolve(this.GetLevel1Route().path, tmp.path, item.path)
    }
  }
}
</script>
