<template>
  <div class="login_container">
    {{ $route.params.name }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 这是数据
    }
  },
  methods: {
    /** 调用方法 */
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
</style>
