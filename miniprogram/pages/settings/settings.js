// pages/settings/settings.js
const db = wx.cloud.database();

Page({
  data: {
    storeId:'',
    avatarUrl:'',
    xiaoquList: ['雁塔校区','长安校区'],
    xiaoquIndex: 1,
    xueyuanList:['计算机科学学院','国际商学院','数科院','地科院','生科院'],
    xueyuanIndex: 4,
    gradeList:['大一','大二','大三','大四'],
    gradeIndex: 3,
  },
  changexiaoqu(e) {
    this.setData({ xiaoquIndex: e.detail.value });
  },
  changexueyuan(e) {
    this.setData({ xueyuanIndex: e.detail.value });
  },
  changegrade(e) {
    this.setData({ gradeIndex: e.detail.value });
  },
  getData(e){
    this.setData({
      storeId:e.detail.value
    });
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },
  save(){
    db.collection('booklist').add({
      data:{
          grade:this.data.gradeList[this.data.gradeIndex],
          address:this.data.xiaoquList[this.data.xiaoquIndex],
          storeId:this.data.storeId,
          school:this.data.xueyuanList[this.data.xueyuanIndex],
      }
  })
  .then(res=>{
      console.log(res)
  })
  
  }
})
