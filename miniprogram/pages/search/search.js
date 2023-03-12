Page({

  data: {
    hot_list: ['计算机', '大学语文', 'C语言', '计算机网络', '操作系统'],
    list: [],
    searchResult: [],
    searchValue: ''
  },
  onChange(e) {
    this.setData({
      searchValue: e.detail,
    });
  },
  handleSearch: function (e) {
    this._handleSearch(0, this.data.searchValue)
  },
  async _handleSearch(start = 0, keywords = '') {
    console.log('test', keywords);
    const { result } = await wx.cloud.callFunction({
      name: 'books',
      data: {
        keywords,
        start,
        count: 10,
        $url: 'book-search'
      }
    })
    const res = result.data.data
    console.log(">>",res)
    if(res.length>0){
        this.data.list.forEach((key, index) => {
          if (key == keywords) {
            this.data.list.splice(index, 1);
          }
        })
        this.data.list.unshift(keywords);
        this.setData({
          list:this.data.list.slice(0,15)
        })
        wx.setStorageSync('search_history', JSON.stringify(this.data.list))
    }
    // 结果长度>0 this.list
  },
  clear: function () {
    this.setData({
      clearShow: false,
      searchContent: ''
    })
  },
  onShow: function () {
    if (wx.getStorageSync('search_history')) {
      this.setData({
        list: JSON.parse(wx.getStorageSync('search_history')).slice(0, 15)
      })
    }
  },
  //清除历史记录
  remove: function () {
    var _this = this
    wx: wx.showModal({
      content: '确认清除所有历史记录?',
      success: function (res) {
        if (res.confirm) {
          wx: wx.removeStorage({
            key: 'search_history',
            success: function (res) {
              _this.setData({
                search_history: []
              })
              _this.setData({
                list: []
              })
              wx.setStorageSync("search_history", [])
            },
          })
        }
        else {
          console.log("点击取消")
        }
      },
    })
  },
  getSearch(e) {
    let {
      index
    } = e.currentTarget.dataset, {
      hot_list
    } = this.data;
    let va = hot_list[index]
    this.setData({
      search: va
    })
    // 将标签存到历史搜索中
    this.data.list.forEach((item, index) => {
      if (item == va) {
        this.data.list.splice(index, 1);
      }
    })
    this.data.list.unshift(va);
    this.setData({
      list: this.data.list.slice(0, 15)
    })
    wx.setStorageSync('search_history', JSON.stringify(this.data.list))
  },
  clear_input(){
    this.setData({
      search:''
    })
  },
  getSearchOne(e) {
    let {
      index
    } = e.currentTarget.dataset, {
      list
    } = this.data;
    let va = list[index]
    this.setData({
      search: va
    })
    this.data.list.forEach((item, index) => {
      if (item == va) {
        this.data.list.splice(index, 1);
      }
    })
    this.data.list.unshift(va);
    this.setData({
      list: this.data.list.slice(0, 15)
    })
    console.log(this.data.list)
    wx.setStorageSync('search_history', JSON.stringify(this.data.list))
  }
})