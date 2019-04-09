<template>
  <div class="music-list">
    <suspension></suspension>
    <div class="mask" :style="'background-image:' + bgStyle"></div>
    <div class="filter" :class="{'top-pos': currentSong}">
      <div class="play-wrapper">
        <div class="play" @click="randomPlay">
          <i class="icon-play" ></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="music-list-box">
      <div class="music-list-con">
        <songs-list
          :list="list"
          :loading="loading"
          rank
        ></songs-list>
      </div>
    </div>
  </div>
</template>

<script>
  import SongsList from './songs-list'
  import Suspension from './suspension'
  import {mapMutations, mapActions} from 'vuex'
  import {playMode} from '../utils/config'

  export default {
    name: 'rich-songs',
    components: {Suspension, SongsList},
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      info: {
        type: Object,
        default: {}
      },
      list: {
        type: Array,
        default: []
      },
      bgStyle: {
        type: String,
        default: ''
      }
    },
    methods: {
      ...mapMutations({
        setMode: 'SET_MODE',
        setPlayList: 'SET_PLAY_LIST'
      }),
      ...mapActions([
        'setCurrentSong'
      ]),
      randomPlay() {
        this.setMode(playMode.random)
        const list = this.list.filter(item => !item.vip)
        this.setPlayList(list)
        const index = Math.floor(Math.random() * list.length)
        this.setCurrentSong(list[index])
      }
    },
    created() {
      this.$watch('loading', (n) => {
        if (n) {
          mpvue.setNavigationBarTitle({ title: '加载中...' })
        }
      })
      this.$watch('info', (n) => {
        if (n.ListName) {
          mpvue.setNavigationBarTitle({ title: n.ListName })
        }
      })
    }
  }
</script>

<style scoped lang="scss">
  @import "../common/styles/variable";

  page{
    height: 100%;
  }
  .music-list-box{
    padding: 60% 0 0 0;
  }
  .music-list-con{
    padding: 0 20px;
    z-index: 3;
    position: relative;
    background: $color-background;
  }
  .mask{
    width: 100%;
    height: 0;
    box-sizing: border-box;
    padding: 30% 0;
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
  }
  .filter{
    background-color: rgba(7,17,27,.4);
    width: 100%;
    height: 0;
    box-sizing: border-box;
    padding: 30% 0;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .play-wrapper{
    position: absolute;
    bottom: 20px;
    width: 100%;
    .play{
      box-sizing: border-box;
      width: 135px;
      padding: 7px 0;
      margin: 0 auto;
      text-align: center;
      border: 1px solid $color-theme;
      color: $color-theme;
      border-radius: 100px;
      font-size: 0;
      .icon-play{
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text{
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
  }
</style>
