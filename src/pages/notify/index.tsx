import { View, Text } from '@tarojs/components'
import { useTabItemTap } from '@tarojs/runtime'
import Taro from '@tarojs/taro'

const NotifyManage = () => {
  // tap vibrate
  useTabItemTap(() => {
    Taro.vibrateShort().then()
  })
  return (
    <View className='index'>
      <Text>通知管理</Text>
    </View>
  )
}

export default NotifyManage
