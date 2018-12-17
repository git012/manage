<template>
    <div id="main" class="app-main">
        <router-view></router-view>
        <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                theme: this.$store.state.theme,
                spinShow:false
            };
        },
        mounted () {

        },
        beforeDestroy () {

        },
        methods: {

        },
        watch: {
    　　　'$route' (to, from) {
    　　　　  //  监听路由变化时的状态为前进还是后退
        　　}
    　  }
    };
</script>

<style>
.app-main{
    width: 100%;
    height: 100%;
}
</style>
