import * as types from './mutation-types'
import {storageType} from '../utils/config'

const MAX_COLLECTIONS = 100
const MAX_SEARCH_HISTORY = 20
const MAX_RECENT = 50

const mutations = {
  [types.SET_CURRENT_SONG](state, o) {
    state.currentSong = o
  },
  [types.SET_CURRENT_LINE_NUM](state, o) {
    state.currentLineNum = o
  },
  [types.SET_CURRENT_TIME](state, o) {
    state.currentTime = o
  },
  [types.SET_LYRIC_LINES](state, o) {
    state.lyricLines = o
  },
  [types.SET_MODE](state, o) {
    state.mode = o
  },
  [types.SET_PLAY_LIST](state, o) {
    state.playList = o
  },
  [types.SET_COLLECTIONS](state, o) {
    const list = o.slice(-MAX_COLLECTIONS)
    mpvue.setStorageSync(storageType.collections, list)
    state.collections = list
  },
  [types.SET_PLAYING](state, o) {
    state.playing = o
  },
  [types.SET_SEARCH_HISTORY](state, o) {
    const list = o.slice(-MAX_SEARCH_HISTORY)
    mpvue.setStorageSync(storageType.searchHistory, list)
    state.searchHistory = list
  },
  [types.SET_RECENT](state, o) {
    const list = o.slice(-MAX_RECENT)
    mpvue.setStorageSync(storageType.recent, list)
    state.recent = list
  }
}

export default mutations
