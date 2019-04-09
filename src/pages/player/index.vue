<template>
  <div class="player">
    <div class="background">
      <img :src="imgUrl">
    </div>
    <div class="top">
      <div class="subtitle">{{currentSong && currentSong.singer}}</div>
    </div>
    <scroll-view
      scroll-y
      :style="'height: ' + scrollHeight + 'px'"
      scroll-with-animation
      :scroll-top="scrollTop"
    >
      <div class="lyric-wrapper">
        <div class="text lyric-line" :class="{current: currentLineNum === key}" v-for="(val, key) in lyricLines" :key="key">{{val.txt}}</div>
      </div>
    </scroll-view>
    <div class="bottom">
      <div class="progress">
        <div class="played">{{current}}</div>
        <div class="slider">
          <slider
            block-size="20"
            activeColor="#ffcd32"
            block-color="#ffcd32"
            :value="percent"
            @changing="handleChanging"
            @change="handleChange"
          ></slider>
        </div>
        <div class="total">{{total}}</div>
      </div>
      <div class="operators">
        <div class="icon i-left" @click="changeMode">
          <i :class="modeClass"></i>
        </div>
        <div class="icon i-left" :class="disabledClass">
          <i class="icon-prev" @click="pre"></i>
        </div>
        <div class="icon i-center" :class="disabledClass">
          <i :class="playIcon" @click="play"></i>
        </div>
        <div class="icon i-right" :class="disabledClass">
          <i class="icon-next" @click="next"></i>
        </div>
        <div class="icon i-right" @click="toggleCollect(currentSong)">
          <i class="icon" :class="favoriteClass"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import {systemInfo} from '../../utils'
  import {player, playPre, sequencePlay, randomPlay} from '../../utils/player'
  import {playMode} from '../../utils/config'

  let lineHeight = 0
  const scrollHeight = systemInfo.windowHeight - 120

  export default {
    isCurrent: false,
    touching: false,
    computed: {
      ...mapGetters([
        'currentSong',
        'lyricLines',
        'currentTime',
        'currentLineNum',
        'mode',
        'collections',
        'playing'
      ]),
      imgUrl: {
        get() {
          return this.currentSong ? this.currentSong.image : ''
        }
      },
      current: {
        get() {
          const t = this.currentTime
          const m = Math.round(t % 60)
          return `${Math.floor(t / 60)}:${m < 10 ? '0' + m : m}`
        }
      },
      total: {
        get() {
          if (!this.currentSong) return ''
          const t = this.currentSong.duration
          const m = Math.round(t % 60)
          return `${Math.floor(t / 60)}:${m < 10 ? '0' + m : m}`
        }
      },
      modeClass: {
        get() {
          return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
        }
      },
      playIcon: {
        get() {
          return this.playing ? 'icon-pause' : 'icon-play'
        }
      },
      favoriteClass: {
        get() {
          if (!this.currentSong) return 'icon-not-favorite'
          const index = this.collections.findIndex(item => item.songid === this.currentSong.songid)
          return index === -1 ? 'icon-not-favorite' : 'icon-favorite'
        }
      },
      disabledClass: {
        get() {
          return this.loading ? 'disable' : ''
        }
      }
    },
    data() {
      return {
        scrollHeight: scrollHeight,
        scrollTop: 0,
        percent: 0,
        loading: false
      }
    },
    methods: {
      ...mapMutations({
        setMode: 'SET_MODE'
      }),
      ...mapActions([
        'toggleCollect'
      ]),
      changeMode() {
        this.setMode((this.mode + 1) % 3)
      },
      setTitle(song) {
        if (song && this.isCurrent) {
          mpvue.setNavigationBarTitle({ title: song.name })
        }
      },
      setProgress(n) {
        if (this.touching) return
        if (n && this.currentSong) {
          this.percent = Math.floor(n / this.currentSong.duration * 100)
        } else {
          this.percent = 0
        }
      },
      handleChanging() {
        this.touching = true
      },
      handleChange(e) {
        const value = e.mp.detail.value
        player.seek(value / 100 * this.currentSong.duration)
        this.touching = false
      },
      pre() {
        if (this.loading) return
        playPre()
      },
      play() {
        if (this.loading) return
        if (player.paused) {
          player.play()
        } else {
          player.pause()
        }
      },
      next() {
        if (this.loading) return
        if (this.mode === playMode.random) {
          randomPlay()
        } else {
          sequencePlay()
        }
      },
      setLineHeight() {
        const query = mpvue.createSelectorQuery()
        query.select('.lyric-line').boundingClientRect(res => {
          if (res && !lineHeight) {
            lineHeight = res.height
          }
        }).exec()
      }
    },
    created() {
      this.$watch('currentSong', this.setTitle)
      this.$watch('currentLineNum', (n) => {
        this.scrollTop = n * lineHeight - scrollHeight / 2 + 10
      })
      this.$watch('currentTime', this.setProgress)
      // 是否正在加载
      global.loadingSong = (loading) => {
        this.loading = loading
        if (this.loading) {
          mpvue.showNavigationBarLoading()
        } else {
          mpvue.hideNavigationBarLoading()
        }
      }
    },
    onReady() {
      this.isCurrent = true
      this.setTitle(this.currentSong)
      this.setLineHeight()
      if (!this.currentSong) {
        mpvue.switchTab({ url: '/pages/index/main' })
      }
    },
    onShow() {
      this.isCurrent = true
      this.setTitle(this.currentSong)
      this.setProgress(this.currentTime)
      this.setLineHeight()
      if (!this.currentSong) {
        mpvue.switchTab({ url: '/pages/index/main' })
      }
    },
    onHide() {
      this.isCurrent = false
    },
    onUnload() {
      this.isCurrent = false
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/styles/variable";
  .background{
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: -1;
    filter: blur(20px);
    opacity: .6;
    img{
      height: 100%;
      width: 100%;
    }
  }
  .top{
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .subtitle{
    line-height: 20px;
    font-size: 14px;
    color: #fff;
  }
  .lyric-wrapper {
    width: 80%;
    margin: 0 auto;
    text-align: center;
    .text {
      line-height: 32px;
      color: $color-text-l;
      font-size: $font-size-medium;
      width: 100%;
      @include ellipsis;
      &.current {
        color: $color-text;
      }
    }
  }
  .bottom{
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    padding: 10px 0 20px 0;
    .progress{
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      color: #fff;
      padding: 0 0 10px 0;
      .slider{
        width: 80%;
      }
    }
  }
  .operators {
    display: flex;
    align-items: center;
    .icon {
      flex: 1;
      color: $color-theme;
      i {
        font-size: 30px;
      }
      &.disable {
        color: $color-theme-d;
      }
    }
    .i-left {
      text-align: right;
    }
    .i-center {
      padding: 0 20px;
      text-align: center;
      i {
        font-size: 40px;
      }
    }
    .i-right {
      text-align: left;
    }
    .icon-favorite {
      color: $color-sub-theme;
    }
  }
</style>
