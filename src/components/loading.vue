<template>
  <div class="loading">
    <img src="/static/images/loading.gif">
    <p>加载中...</p>
  </div>
</template>

<script>
  export default {
    name: 'loading'
  }
</script>

<style scoped lang="scss">
  .loading{
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    img{
      width: 20px;
      height: 20px;
      margin: 0 5px 0 0;
    }
    p{
      color: #fff;
      font-size: 12px;
    }
  }
</style>
