// 交易发布列表页
var app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    good: {},
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
  },
  //详情页请求
  onLoad(options) {
    var id = options.bookid
    console.log(id)
    db.collection("booklist")
      .doc(id)
      .get()
      .then(res => {
        console.log("详情页请求成功", res);
        this.setData({
          good: res.data
        })
      }).catch(err => {
        console.log("详情页请求失败", err);
      })
  },
  // 点击复制联系方式
 copyText(e) {
  let name = e.currentTarget.dataset.name;
  wx.setClipboardData({ //设置系统剪贴板的内容
    data: name,
    success(res) {
      console.log(res,name);
      wx.getClipboardData({ // 获取系统剪贴板的内容
        success(res) {
          wx.showToast({
            title: '复制成功',
          })
        }
      })
    }
  })
},
  //购物车
  addShop(){//加入购物车
    let carts = wx.getStorageSync('carts')||[];//获取储存中的购物车
    let index = carts.findIndex(v=>v._id===this.data.good._id)
    //findIndex() 方法返回传入一个测试条件（函数）符合条件的数组第一个元素位置。
    //如果储存里的商品id=本地数据商品id 则返回此元素位置
    if(index>-1){//如果购物车为空
      wx.showToast({//加入后的提示弹框
        title: '该商品已在购物车',
        icon:'none',
        mask:true,
      })
    }else{//购物车不为空
      this.data.good.num=1;//添加一个数量属性
      this.data.good.isCarted=true;//添加一个判断是否勾选的属性
      this.data.good.select="circle";
      carts.push(this.data.good)//把本地商品添加进购物车
      wx.setStorageSync('carts', carts)//添加成功后储存购物车
      wx.showToast({//加入后的提示弹框
        title: '加入成功',
        icon:'success',
        mask:true,
      })
      console.log(carts)
    }
  },

  previewImage: function (e) {
    var current = e.target.dataset.src;
    var href = this.data.imghref;
    var goodsimg = this.data.goods_img;
    var imglist = [];
    for (var i = 0; i < goodsimg.length; i++) {
      imglist[i] = href + goodsimg[i].img
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: imglist // 需要预览的图片http链接列表  
    })
  },
  gotoCart:function(){
    wx.navigateTo({
      url: '../shopping-cart/shopping-cart',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },


  onShareAppMessage() {

  }
})