<template>
  <div class="default-layout" :class="currentSong ? 'padding-top' : ''">
    <slot></slot>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    name: 'default-layout',
    computed: {
      ...mapGetters([
        'currentSong'
      ])
    }
  }
</script>

<style scoped lang="scss">
  @import "../common/styles/variable";
  .padding-top{
    padding-top: $topHeight;
  }
</style>
