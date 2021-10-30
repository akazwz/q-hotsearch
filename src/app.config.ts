export default {
  pages: [
    'pages/index/index',
    'pages/sub/index',
    'pages/profile/index',
    'pages/update-profile/index',
    'pages/notify/index',
  ],
  tabBar: {
    list: [
      {
        'iconPath': 'resource/hot-search.png',
        'selectedIconPath': 'resource/hot-search-selected.png',
        pagePath: 'pages/index/index',
        text: '首页'
      },
      {
        'iconPath': 'resource/sub.png',
        'selectedIconPath': 'resource/sub-selected.png',
        pagePath: 'pages/sub/index',
        text: '订阅'
      },
      {
        'iconPath': 'resource/us.png',
        'selectedIconPath': 'resource/us-selected.png',
        pagePath: 'pages/profile/index',
        text: '我的'
      },
    ],
    'color': '#bfbfbf',
    'selectedColor': '#2c2c2c',
    'backgroundColor': '#fff',
    'borderStyle': 'white'
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
