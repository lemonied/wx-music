<template>
  <div class="add-song" :style="'padding-top: ' + topHeight + 'px'">
    <div class="search-box-wrapper" id="addSong">
      <search-box @submit="onSubmit" ref="searchBox"></search-box>
      <div id="switches" v-if="!showSearchList" class="switch-box">
        <switches :tabs="['最近播放', '搜索历史']" v-model="tab"></switches>
      </div>
    </div>
    <div class="shortcut">
      <div class="shortcut-list-wrapper" v-if="!showSearchList">
        <songs-list
          :list="recent"
          diy
          del
          @select="addSong"
          @del="delRecent"
          v-if="tab === 0"
        ></songs-list>
        <search-history @submit="setHot" v-if="tab === 1"></search-history>
        <empty v-if="showEmpty"></empty>
      </div>
      <search-list @select="selectHandler" v-else :loading="loading" :list="list"></search-list>
    </div>
  </div>
</template>

<script>
  import {get, modal} from '../../utils'
  import SearchBox from '../../components/search-box'
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import SongsList from '../../components/songs-list'
  import SearchHistory from '../../components/search-history'
  import Empty from '../../components/empty'
  import SearchList from '../../components/search-list'
  import Switches from '../../components/switches'

  export default {
    name: 'index',
    components: {Switches, SearchList, Empty, SearchHistory, SongsList, SearchBox},
    computed: {
      ...mapGetters([
        'recent',
        'searchHistory'
      ]),
      showEmpty: {
        get() {
          return this.tab === 1 && !this.searchHistory.length
        }
      },
      topHeight: {
        get() {
          return this.showSearchList ? this.paddingTop - this.switchesHeight : this.paddingTop
        }
      }
    },
    data() {
      return {
        showSearchList: false,
        list: [],
        loading: false,
        tab: 0,
        paddingTop: 0,
        switchesHeight: 0
      }
    },
    keywords: '',
    page: 1,
    totalnum: 0,
    methods: {
      ...mapActions([
        'addToPlayList',
        'addSearchHistory'
      ]),
      ...mapMutations({
        setRecent: 'SET_RECENT'
      }),
      addSong(val) {
        this.addToPlayList(val)
        modal.toast(`${val.name} 添加成功！`)
      },
      delRecent(val) {
        const list = this.recent.slice(0)
        const index = list.findIndex(item => item.songid === val.songid)
        if (index !== -1) {
          list.splice(index, 1)
          this.setRecent(list)
        }
      },
      onSubmit(val) {
        this.showSearchList = !!val
        this.keywords = val
        this.page = 1
        this.list = []
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
            this.totalnum = res.data.song.totalnum
            this.list = list
          }
        })
      },
      setHot(val) {
        this.$refs.searchBox.setValue(val)
        this.onSubmit(val)
      },
      selectHandler(item) {
        this.addSearchHistory(this.keywords)
        this.addSong(item)
      },
      getHeight() {
        const query = mpvue.createSelectorQuery()
        query.select('#addSong').boundingClientRect(res => {
          if (res) {
            this.paddingTop = res.height
          }
        }).exec()
        query.select('#switches').boundingClientRect(res => {
          if (res) {
            this.switchesHeight = res.height
          }
        }).exec()
      }
    },
    onReachBottom() {
      if (this.loading || !this.showSearchList) return
      if (this.list.length >= this.totalnum) return
      this.page++
      this.doSearch()
    },
    created() {
      this.$watch('tab', () => {
        setTimeout(() => {
          this.getHeight()
        }, 100)
      })
    },
    onReady() {
      setTimeout(() => {
        this.getHeight()
      }, 200)
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/styles/variable";
  .add-song {
    display: flex;
    flex-direction: column;
    .search-box-wrapper {
      padding: 10px 20px;
      box-sizing: border-box;
      position: fixed;
      width: 100%;
      top: 0;
      left: 0;
      background: $color-background;
    }
    .shortcut {
      flex: 1;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .shortcut-list-wrapper {
        width: 100%;
        flex: 1;
        height: 100%;
        overflow: hidden;
        padding: 10px 15px 0 15px;
        box-sizing: border-box;
      }
    }
  }
  .switch-box{
    margin: 15px auto 0 auto;
  }
</style>
