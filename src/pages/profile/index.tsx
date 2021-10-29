import { useState } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useReady, useTabItemTap } from '@tarojs/runtime'
import Toast, { ToastType } from '@taroify/core/toast'
import '@taroify/core/toast/style'
import Cell from '@taroify/core/cell'
import '@taroify/core/cell/style'
import { Arrow } from '@taroify/icons'
import UserInfo from './UserInfo'

export interface UserInfoI {
  avatarUrl: string,
  nickName: string,
  gender: number,
  bio: string,
}

const About = () => {
  /*const [aboutUs, setAboutUs] = useState(false)
  const [rateUs, setRateUs] = useState(false)
  const [rateValue, setRateValue] = useState(5)*/
  const [loginCode, setLoginCode] = useState('')
  const [hasLogin, setHasLogin] = useState(false)
  let userInfoInit: UserInfoI
  userInfoInit = {
    avatarUrl: '',
    nickName: '',
    gender: 0,
    bio: '',
  }
  const [userInfo, setUserInfo] = useState(userInfoInit)

  const [toastInfo, setToastInfo] = useState({
    open: false,
    type: ToastType.Loading,
    content: '登录中',
  })

  useReady(() => {
    Taro.setNavigationBarColor({
      backgroundColor: '#17ce7c',
      frontColor: '#ffffff',
      fail: () => {
        setToastInfo({
          open: true,
          type: ToastType.Fail,
          content: '状态栏颜色设置失败',
        })
      }
    }).then()
  })
  // tap vibrate
  useTabItemTap(() => {
    Taro.vibrateShort().then()
  })

  useReady(() => {
    try {
      let info = Taro.getStorageSync('userInfo')
      if (info) {
        setUserInfo(info)
      }
      let token = Taro.getStorageSync('token')
      // 存在token
      if (token) {
        setHasLogin(true)
      } else {
        // 不存在token
        // 先 login  再 get userinfo
        Taro.login({
          success: (result) => {
            // 获取 code 失败
            if (!result.code) {
              setToastInfo({
                open: true,
                type: ToastType.Fail,
                content: '登录失败',
              })
              return
            }
            // 获取code成功
            setLoginCode(result.code)
          }
        }).then()
      }
    } catch (err) {
      setToastInfo({
        open: true,
        type: ToastType.Fail,
        content: err,
      })
    }
  })

  // 登录获取token
  const handleLogin = () => {
    // 获取用户信息
    Taro.getUserProfile({
      desc: '用于完善会员资料',
      success: (res) => {
        // 获取加密数据和iv后进行登录
        handleLoginRequest(loginCode, res.encryptedData, res.iv)
      },
      fail: (err) => {
        setToastInfo({
          open: true,
          type: ToastType.Fail,
          content: err.errMsg,
        })
      },
    })
  }

  // 一键登录
  const handleLoginRequest = (LoginCode, encryptedData, iv: string) => {
    Taro.request({
      url: 'https://api.hellozwz.com/v1/token/open-id',
      data: {
        code: LoginCode,
        encrypt: encryptedData,
        iv: iv
      },
      method: 'POST'
    })
      .then((loginRes) => {
        // 登录失败
        if (loginRes.statusCode !== 201) {
          setToastInfo({
            open: true,
            type: ToastType.Fail,
            content: '登录失败',
          })
          return
        }
        const { code, data, msg } = loginRes.data
        // 登录失败
        if (code !== 2000) {
          // 登录失败
          setToastInfo({
            open: true,
            type: ToastType.Fail,
            content: msg,
          })
          return
        }
        const { expires_at, token, user } = data
        const { authority_id, phone, avatar_url, nick_name, gender, bio } = user
        const userInfoRes = {
          avatarUrl: avatar_url,
          nickName: nick_name,
          gender: gender,
          bio: bio,
        }
        setUserInfo(userInfoRes)
        Taro.setStorageSync('userInfo', userInfoRes)
        Taro.setStorageSync('token', token)
        Taro.setStorageSync('expires_at', expires_at)
        Taro.setStorageSync('authority_id', authority_id)
        Taro.setStorageSync('phone', phone)
        setHasLogin(true)
      })
      .catch((err) => {
        setToastInfo({
          open: true,
          type: ToastType.Fail,
          content: err,
        })
      })
  }

  /*const handleClickZWZ = () => {
    Taro.setClipboardData({
      data: 'akazwz',
      success: function () {
      }
    }).then()
  }*/

  // 退出登录
  /* const handleQuitLogin = () => {
     Taro.removeStorageSync('token')
     Taro.removeStorageSync('expires_at')
     Taro.removeStorageSync('authority_id')
     Taro.removeStorageSync('phone')
     setUserInfo({
       avatarUrl: '',
       nickName: '',
       bio: '',
     })
     setHasLogin(false)
   }*/

  // 前往修改资料
  const handleToUpdateProfile = () => {
    Taro.navigateTo({
      url: '/pages/update-profile/index',
    })
  }

  return (
    <View>
      <UserInfo
        hasLogin={hasLogin}
        userInfo={userInfo}
        handleBtnClick={hasLogin ? handleToUpdateProfile : handleLogin}
      />
      <Cell title='通知管理' rightIcon={<Arrow />} clickable />
      <Cell title='手机绑定' rightIcon={<Arrow />} clickable />
      <Cell title='更多设置' rightIcon={<Arrow />} clickable />
      <Cell title='清除缓存' rightIcon={<Arrow />} clickable onClick={() => {
        Taro.clearStorageSync()
      }}
      />
      <Toast open={toastInfo.open} type={toastInfo.type}>{toastInfo.content}</Toast>
    </View>
  )
}
export default About
