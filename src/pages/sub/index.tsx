import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const Sub = () => {
  return (
    <View className='index'>
      <Text>通知</Text>
      <Button onClick={() => {
        Taro.requestSubscribeMessage({
          tmplIds: ['XV16ZyG6Af_gG8D4qg7M17Fw23m_zYWNo689XpJKYQE'],
          fail: () => {
            console.log('fail')
          },
          success: () => {
            console.log('success')
          }
        }).then()
      }}
      >
        获取通知
      </Button>
    </View>
  )
}

export default Sub
