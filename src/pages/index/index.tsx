import { View, Text } from '@tarojs/components'
import { useTabItemTap } from '@tarojs/runtime'
import Taro from '@tarojs/taro'

const Index = () => {
  // tap vibrate
  useTabItemTap(() => {
    Taro.vibrateShort().then()
  })
  return (
    <View className='index'>
      <Text>Hello world!</Text>
    </View>
  )
}

export default Index
