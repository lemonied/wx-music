<template>
  <div class="user-center" :class="{playing: !!currentSong}">
    <suspension></suspension>
    <div class="user-center-header" :class="{playing: !!currentSong}" id="userHeader">
      <div class="switches-wrapper">
        <switches :tabs="['我喜欢的', '最近听的']" v-model="tab"></switches>
      </div>
      <div id="playBtn">
        <div v-if="showPlayBtn">
          <div class="play-btn" @click="randomPlay"><i class="icon-play" ></i><span class="text">随机播放全部</span></div>
          <div class="clear" @click="clear"><i class="icon-clear" ></i>&nbsp;清空</div>
        </div>
      </div>
    </div>
    <div class="list-wrapper" :style="'padding-top: ' + paddingTop + 'px'">
      <songs-list
        :list="collections"
        del
        @del="toggleCollect"
        v-if="tab === 0"
      ></songs-list>
      <songs-list
        v-else
        :list="recent"
        del
        @del="delRecent"
      ></songs-list>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import SongsList from '../../components/songs-list'
  import SearchHistory from '../../components/search-history'
  import Empty from '../../components/empty'
  import Switches from '../../components/switches'
  import Suspension from '../../components/suspension'
  import {playMode} from '../../utils/config'
  import {modal} from '../../utils'

  export default {
    name: 'index',
    components: {Suspension, Switches, Empty, SearchHistory, SongsList},
    computed: {
      ...mapGetters([
        'recent',
        'collections',
        'currentSong'
      ]),
      showPlayBtn: {
        get() {
          return this.tab === 0
            ? !!this.collections.length
            : !!this.recent.length
        }
      },
      paddingTop: {
        get() {
          return this.tab === 0
            ? this.collections.length
              ? this.userHeaderHeight
              : this.userHeaderHeight - this.playBtnHeight
            : this.recent.length
              ? this.userHeaderHeight
              : this.userHeaderHeight - this.playBtnHeight
        }
      }
    },
    data() {
      return {
        tab: 0,
        userHeaderHeight: 0,
        playBtnHeight: 0
      }
    },
    methods: {
      ...mapMutations({
        setRecent: 'SET_RECENT',
        setCollections: 'SET_COLLECTIONS',
        setPlayList: 'SET_PLAY_LIST',
        setMode: 'SET_MODE'
      }),
      ...mapActions([
        'toggleCollect',
        'setCurrentSong'
      ]),
      delRecent(val) {
        const list = this.recent.slice(0)
        const index = list.findIndex(item => item.songid === val.songid)
        if (index !== -1) {
          list.splice(index, 1)
          this.setRecent(list)
        }
      },
      randomPlay() {
        this.setMode(playMode.random)
        const list = (this.tab === 0 ? this.collections : this.recent).filter(item => !item.vip)
        this.setPlayList(list)
        const index = Math.floor(Math.random() * list.length)
        this.setCurrentSong(list[index])
      },
      clear() {
        switch (this.tab) {
          case 0:
            modal.confirm('确定清空我的收藏？').then(() => {
              this.setCollections([])
            })
            break
          case 1:
            modal.confirm('确定清空力士播放记录？').then(() => {
              this.setRecent([])
            })
            break
          default:
        }
      }
    },
    onReady() {
      setTimeout(() => {
        const query = mpvue.createSelectorQuery()
        query.select('#userHeader').boundingClientRect(res => {
          if (res) {
            this.userHeaderHeight = res.height
          }
        }).exec()
        query.select('#playBtn').boundingClientRect(res => {
          if (res) {
            this.playBtnHeight = res.height
          }
        }).exec()
      }, 200)
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/styles/variable";
  .user-center{
    &.playing{
      padding-top: $topHeight;
    }
    .user-center-header{
      background: $color-background;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      &.playing{
        top: $topHeight;
      }
      .switches-wrapper {
        padding: 10px 0 30px 0;
      }
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-text-l;
        color: $color-text-l;
        border-radius: 100px;
        font-size: 0;
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
      .clear {
        text-align: right;
        padding: 0 30px;
        height: 20px;
        color: #fff;
        font-size: 12px;
        .icon-clear{
          display: inline-block;
        }
      }
    }
    .list-wrapper{
      padding: 10px 20px;
    }
  }
</style>
