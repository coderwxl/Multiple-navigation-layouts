<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
      <el-menu
        :default-active="activeMenu"
        :background-color="variables.leftMenuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        mode="vertical"
      >
        <div v-for="item in routes" :key="item.path" class="nav-item">
          <app-link :to="resolvePath(item)">
            <el-menu-item
              v-if="!item.hidden"
              :index="menuItemPath(item)"
            >{{ item.meta ? item.meta.title : item.children[0].meta.title }}</el-menu-item>
          </app-link>
        </div>
      </el-menu>
  </div>
</template>

<script>
import path from 'path'
import { mapGetters } from 'vuex'
import Logo from './Logo'
import variables from '@/styles/variables.scss'
import { isExternal } from '@/utils/validate'
import AppLink from './Link'
import GetSubRoutes from '../../mixin/GetSubRoutes'

export default {
  components: { Logo, AppLink },
  mixins: [ GetSubRoutes ],
  data() { 
    return {
      routes: []
    }
  },
  watch: {
    $route: {
      handler(newVal, oldVal) {
        this.routes = this.GetLevel2Routes(newVal, oldVal);
      },
      deep: true,
      immediate: true
    } 
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      let secondRoute = ''
      let currentRoute = this.GetLevel1Route()
      if (currentRoute.path === "/"){
        secondRoute = '/' + this.$route.path.split('/')[1]
      } else {
        secondRoute = '/' + this.$route.path.split('/')[1] + '/' + this.$route.path.split('/')[2]
      }
      return secondRoute
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    resolvePath(item) {
      // 如果有子项，默认跳转第一个子项路由
      let pathtmp = ''
      const getDefaultPath = (item, parent) => {
        // 如果path是个外部链接（不建议），直接返回链接，存在个问题：如果是外部链接点击跳转后当前页内容还是上一个路由内容
        if (isExternal(item.path)) {
          pathtmp = item.path
          return
        }
        // 第一次需要父项路由拼接，所以只是第一个传parent
        if (parent) {
          pathtmp += (parent.path + '/' + item.path)
        } else {
          pathtmp += ('/' + item.path)
        }
        // 如果还有子项，继续递归
        if (item.children) {
          getDefaultPath(item.children[0])
        }
      }

      if (item.children) {
        getDefaultPath(item.children[0], item)
        return path.resolve(this.GetLevel1Route().path, pathtmp)
      }

      return path.resolve(this.GetLevel1Route().path, item.path)
    },
    menuItemPath(item) {
      return path.resolve(this.GetLevel1Route().path, item.path)
    }
  }
}
</script>
