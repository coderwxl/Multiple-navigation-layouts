import { constantRoutes } from '@/router'

export default {
    methods: { 
        SplitString(str, delimiter) {
            return str.split(delimiter).filter(item => item != '')
        },
        GetLevel1Route() {
            let arr = this.SplitString(this.$route.path, '/')
            for (let obj of constantRoutes) {
                if (this.$route.path === '/dashboard') {
                    if (obj.path === '/') {
                        return obj
                    }
                } else {
                    if (arr.length >= 1 && ("/"+arr[0]) === obj.path) {
                        return obj
                    }
                }
            }
            return {}
        },
        GetLevel2Routes(newRoute, oldRoute) {
            console.log("GetLevel2Routes")
            console.log(newRoute)
            let arr = this.SplitString(newRoute.path, '/')
            console.log(arr)
            for (let obj of constantRoutes) {
                if (newRoute.path === '/dashboard') {
                    if (obj.path === '/') {
                        return obj.children  ? obj.children : []
                    }
                } else {
                    if (arr.length >= 1 && ("/"+arr[0]) === obj.path) {
                        console.log("########")
                        console.log(obj.children)
                        return obj.children  ? obj.children : []
                    }
                }
            }
            return []
        },
        GetLevel3Routes(newRoute, oldRoute) {
            let arr = this.SplitString(newRoute.path, '/')
            for (let obj of constantRoutes) {
                if (newRoute.path === '/dashboard') {
                    if (obj.path === '/') {
                        if (!obj.children) {
                            return []
                        }
                        for (let sub of obj.children) {
                            if (arr[0] === sub.path) {
                                return sub.children ? sub.children : []
                            }
                        }
                    }
                } else {
                    if (arr.length >= 2 && ("/"+arr[0]) === obj.path) {
                        if (!obj.children) {
                            return []
                        }
                        for (let sub of obj.children) {
                            if (arr[1] === sub.path) {
                                return sub.children ? sub.children : []
                            }
                        }
                    }
                }
            }
            return []
        }
    }
}