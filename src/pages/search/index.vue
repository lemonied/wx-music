<template>
  <div class="search">
    <suspension></suspension>
    <div class="search-box-wrapper" :class="{playing: currentSong}">
      <search-box @submit="onSubmit" ref="searchBox"></search-box>
    </div>
    <div class="content">
      <div :class="{playing: currentSong}">
        <div class="shortcut-wrapper" v-if="!showSearchList">
          <div class="hot-key">
            <div class="title">热门搜索</div>
            <ul>
              <li class="item" :key="key" v-for="(val, key) in hotWords" @click="setHot(val.k)">
                <span>{{val.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-if="searchHistory.length">
            <div class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="clear"><i class="icon-clear" ></i></span>
            </div>
            <search-history @submit="setHot"></search-history>
          </div>
        </div>
        <search-list @select="selectHandler" v-else :loading="loading" :list="list" :zhida="zhida"></search-list>
      </div>
    </div>
  </div>
</template>

<script>
  import Suspension from '../../components/suspension'
  import SearchBox from '../../components/search-box'
  import {get, modal} from '../../utils'
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import SearchList from '../../components/search-list'
  import SearchHistory from '../../components/search-history'

  export default {
    components: {SearchHistory, SearchList, SearchBox, Suspension},
    data() {
      return {
        hotWords: [],
        showSearchList: false,
        list: [],
        loading: false,
        zhida: {}
      }
    },
    computed: {
      ...mapGetters([
        'currentSong',
        'searchHistory'
      ])
    },
    keywords: '',
    page: 1,
    totalnum: 0,
    methods: {
      ...mapActions([
        'selectSingleSong',
        'addSearchHistory'
      ]),
      ...mapMutations({
        setSearchHistory: 'SET_SEARCH_HISTORY'
      }),
      getHotWords() {
        get(`https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg`, {
          inCharset: 'utf-8',
          outCharset: 'utf-8',
          notice: '0',
          format: 'json',
          uin: '0',
          needNewCode: '1',
          platform: 'h5',
          _: Date.now()
        }).then(res => {
          if (res.code === 0) {
            this.hotWords = res.data.hotkey.slice(0, 10)
          }
        })
      },
      onSubmit(val) {
        this.showSearchList = !!val
        this.keywords = val
        this.page = 1
        this.list = []
        this.zhida = {}
        if (!val) return
        this.doSearch()
      },
      doSearch() {
        const w = this.keywords
        const page = this.page
        const keywords = encodeURIComponent(w)
        get(`https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp?_=${Date.now()}&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&w=${keywords}&zhidaqu=1&catZhida=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&perpage=20&n=20&p=${page}&remoteplace=txt.mqq.all`, {
        }, loading => this.loading = loading).then(res => {
          if (res.code === 0) {
            const list = this.list.concat(res.data.song.list.map(item => {
              return {
                name: item.songname,
                singer: item.singer.map(item => item.name).join(','),
                album: item.albumname,
                vip: !!item.pay.payplay,
                songmid: item.songmid,
                songid: item.songid,
                duration: item.interval,
                image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.albummid}.jpg?max_age=2592000`
              }
            }))
            const zhida = res.data.zhida
            this.totalnum = res.data.song.totalnum
            this.list = list
            this.zhida = zhida
          }
        })
      },
      setHot(val) {
        this.$refs.searchBox.setValue(val)
        this.onSubmit(val)
      },
      selectHandler(item) {
        this.addSearchHistory(this.keywords)
        this.selectSingleSong(item)
      },
      clear() {
        modal.confirm('确定清空历史搜索记录？').then(() => {
          this.setSearchHistory([])
        })
      }
    },
    onReachBottom() {
      if (this.loading || !this.showSearchList) return
      if (this.list.length >= this.totalnum) return
      this.page++
      this.doSearch()
    },
    created() {},
    onLoad() {
      this.getHotWords()
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/styles/variable";

  .search {
    display: flex;
    flex-direction: column;
    .search-box-wrapper {
      padding: 10px 20px;
      box-sizing: border-box;
      position: fixed;
      width: 100%;
      top: 0;
      left: 0;
      &.playing{
        top: $topHeight;
      }
    }
    .content{
      padding: 70px 0 0 0;
      .playing{
        padding: $topHeight 0 0 0;
      }
    }
    .shortcut-wrapper {
      width: 100%;
      flex: 1;
      height: 100%;
      overflow: hidden;
      .hot-key {
        margin: 0 20px 20px 20px;
        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 10px 8px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }
      .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;
          .text {
            flex: 1;
          }
          .clear {
            @include extend-click;
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
    .search-result {
      width: 100%;
      flex: 1;
      height: 100%;
      overflow: hidden;
    }
  }
</style>
