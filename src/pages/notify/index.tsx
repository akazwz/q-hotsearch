import { View, Text } from '@tarojs/components'
import { useDidShow, useTabItemTap } from '@tarojs/runtime'
import Taro from '@tarojs/taro'
import Button from '@taroify/core/button'
import '@taroify/core/button/style'

const NotifyManage = () => {
  // tap vibrate
  useTabItemTap(() => {
    Taro.vibrateShort().then()
  })

  useDidShow(() => {
    Taro.request({
      url: 'https://api.hellozwz.com/v1/users/notify',
      method: 'GET',
      header: {
        token: Taro.getStorageSync('token'),
      },
    }).then((res) => {
      console.log(res)
    })
  })

  return (
    <View className='index'>
      <Text>通知管理</Text>
      <Button
        block
        color='info'
        onClick={() => {
          Taro.requestSubscribeMessage({
            tmplIds: ['XV16ZyG6Af_gG8D4qg7M17Fw23m_zYWNo689XpJKYQE'],
            fail: () => {
              console.log('fail')
            },
            success: (result) => {
              const { XV16ZyG6Af_gG8D4qg7M17Fw23m_zYWNo689XpJKYQE } = result
              if (XV16ZyG6Af_gG8D4qg7M17Fw23m_zYWNo689XpJKYQE === 'reject') {
                console.log('fail')
                return
              }
            }
          }).then()
        }}
      >
        获取通知
      </Button>
    </View>
  )
}

export default NotifyManage
