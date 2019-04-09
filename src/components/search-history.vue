<template>
  <ul class="search-list">
    <li class="search-item" v-for="(item, key) in list" :key="key" @click="onClick(item)">
      <span class="text">{{item}}</span>
      <span class="icon" @click.stop="del(item)"><i class="icon-delete"></i></span>
    </li>
  </ul>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex'
  export default {
    name: 'search-history',
    computed: {
      ...mapGetters([
        'searchHistory'
      ]),
      list: {
        get() {
          const list = this.searchHistory.slice(0)
          list.reverse()
          return list
        }
      }
    },
    methods: {
      ...mapMutations({
        setSearchHistory: 'SET_SEARCH_HISTORY'
      }),
      del(val) {
        const list = this.searchHistory.slice(0)
        const index = list.findIndex(item => item === val)
        if (index !== -1) {
          list.splice(index, 1)
          this.setSearchHistory(list)
        }
      },
      onClick(item) {
        this.$emit('submit', item)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../common/styles/variable";
  .search-list{
    .search-item{
      display: flex;
      align-items: center;
      height: 40px;
      overflow: hidden;
      .text{
        flex: 1;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
      .icon{
        @include extend-click;
        .icon-delete{
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
</style>
