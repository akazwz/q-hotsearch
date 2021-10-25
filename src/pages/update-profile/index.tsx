import { View, Text } from '@tarojs/components'
import { useReady, useTabItemTap } from '@tarojs/runtime'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { UserInfoI } from '../about'
import Toast, { ToastType } from '@taroify/core/toast'

const UpdateProfile = () => {
  const [toastInfo, setToastInfo] = useState({
    open: false,
    type: ToastType.Loading,
    content: '登录中',
  })

  const [avatarUrl, setAvatarUrl] = useState('')
  const [nickName, setNickName] = useState('')
  const [gender, setGender] = useState(0)
  const [bio, setBio] = useState('')
  // tap vibrate
  useTabItemTap(() => {
    Taro.vibrateShort().then()
  })

  useReady(() => {
    // 加载用户信息
    let userInfoInit: UserInfoI
    userInfoInit = Taro.getStorageSync('userInfo')
    if (!userInfoInit) {
      setToastInfo({
        open: true,
        type: ToastType.Fail,
        content: '获取用户信息失败',
      })
    }

    setAvatarUrl(userInfoInit.avatarUrl)
    setNickName(userInfoInit.nickName)
    setGender(userInfoInit.gender)
    setBio(userInfoInit.bio)
  })

  return (
    <View>
      <Text>Hello world!</Text>
      <Text>{avatarUrl}</Text>
      <Text>{nickName}</Text>
      <Text>{gender}</Text>
      <Text>{bio}</Text>
      <Toast open={toastInfo.open} type={toastInfo.type}>{toastInfo.content}</Toast>
    </View>
  )
}

export default UpdateProfile
