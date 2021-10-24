import { useState } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useReady, useTabItemTap } from '@tarojs/runtime'
import Toast from '@taroify/core/toast'
import '@taroify/core/toast/style'
import Cell from '@taroify/core/cell'
import '@taroify/core/cell/style'
import { Arrow } from '@taroify/icons'
import UserInfo from './UserInfo'

const About = () => {
  /*const [aboutUs, setAboutUs] = useState(false)
  const [rateUs, setRateUs] = useState(false)
  const [rateValue, setRateValue] = useState(5)*/
  const [loginError, setLoginError] = useState(false)
  const [userInfo, setUserInfo] = useState({
    avatarUrl: '',
    nickName: '',
  })

  useReady(() => {
    Taro.setNavigationBarColor({
      backgroundColor: '#17ce7c',
      frontColor: '#ffffff',
      fail: () => {
        console.log('error')
      }
    }).then()
  })
  // tap vibrate
  useTabItemTap(() => {
    Taro.vibrateShort().then()
  })

  const [hasLogin, setHasLogin] = useState(false)

  useReady(() => {
    // userInfo local storage
    try {
      let info = Taro.getStorageSync('userInfo')
      if (info) {
        setUserInfo(JSON.parse(info))
      }
      let token = Taro.getStorageSync('token')
      if (token) {
        setHasLogin(true)
      }
    } catch (e) {
      Taro.atMessage({
        'message': e,
        'type': 'error',
      })
    }
  })

  // get userInfo
  const getUserInfo = () => {
    console.log('login')
    // 获取用户信息
    Taro.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        setUserInfo({
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,
        })
        try {
          Taro.setStorageSync('userInfo', JSON.stringify(res.userInfo))
        } catch (e) {
          console.log(e)
        }
        // 获取加密数据和 iv
        const encryptedData = res.encryptedData
        const iv = res.iv
        // 获取加密数据和iv后进行登录
        handleLogin(encryptedData, iv)
      },
      fail: (err) => {
        console.log(err)
      },
    })
  }

  // 登录获取token
  const handleLogin = (encryptedData: string, iv: string) => {
    Taro.login({
      success: (result) => {
        if (result.code) {
          Taro.request({
            url: 'http://192.168.31.217:8000/v1/token/open-id',
            data: {
              code: result.code,
              encrypt: encryptedData,
              iv: iv
            },
            method: 'POST'
          })
            .then((loginRes) => {
              if (loginRes.statusCode === 201) {
                const { code, data } = loginRes.data
                if (code !== 2000) {
                  setLoginError(true)
                  return
                } else {
                  const { expires_at, token, user } = data
                  const { authority_id, phone } = user
                  Taro.setStorageSync('token', token)
                  Taro.setStorageSync('expires_at', expires_at)
                  Taro.setStorageSync('authority_id', authority_id)
                  Taro.setStorageSync('phone', phone)
                  setHasLogin(true)
                }
              } else {
                console.log('login error')
                setLoginError(true)
                return
              }
            })
            .catch((error) => {
              if (error !== null) {
                console.log(error)
                setLoginError(true)
                return
              }
            })
        } else {
          console.log('login fail')
          setLoginError(true)
          return
        }
      }
    }).then()
  }

  /*const handleClickZWZ = () => {
    Taro.setClipboardData({
      data: 'akazwz',
      success: function () {
      }
    }).then()
  }*/

  const handleQuitLogin = () => {
    console.log('quit')
    Taro.clearStorage().then()
    setUserInfo({
      avatarUrl: '',
      nickName: '',
    })
    setHasLogin(false)
  }

  return (
    <View style={{
      backgroundColor: 'red',
      width: '100%',
      height: '100%',
    }}
    >
      <UserInfo
        hasUserInfo={hasLogin}
        userInfo={userInfo}
        handleBtnClick={hasLogin ? handleQuitLogin : getUserInfo}
      />
      <Cell title='通知管理' rightIcon={<Arrow />} clickable />
      <Cell title='手机绑定' rightIcon={<Arrow />} clickable />
      <Cell title='更多设置' rightIcon={<Arrow />} clickable />
      <Toast open={loginError} type='fail'>登录失败</Toast>
    </View>
  )
}
export default About
