import {playMode, storageType} from '../utils/config'

const state = {
  // 当前播放歌曲
  currentSong: null,
  // 当前播放进度
  currentTime: 0,
  // 当前歌词行数
  currentLineNum: 0,
  lyricLines: [],
  mode: playMode.sequence,
  playList: [],
  collections: mpvue.getStorageSync(storageType.collections) || [],
  playing: false,
  searchHistory: mpvue.getStorageSync(storageType.searchHistory) || [],
  recent: mpvue.getStorageSync(storageType.recent) || []
}
export default state
