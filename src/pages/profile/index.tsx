import { useState } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useDidShow, useTabItemTap } from '@tarojs/runtime'
import Cell from '@taroify/core/cell'
import '@taroify/core/cell/style'
import Notify from '@taroify/core/notify'
import '@taroify/core/notify/style'
import { Arrow } from '@taroify/icons'
import UserInfo from './UserInfo'

export interface UserInfoI {
  avatarUrl: string,
  nickName: string,
  gender: number,
  bio: string,
}

const About = () => {
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
  const [failNotify, setFailNotify] = useState({
    open: false,
    content: ''
  })
  const [successNotify, setSuccessNotify] = useState({
    open: false,
    content: ''
  })

  useDidShow(() => {
    setNavColor()
    getUserProfile()
  })

  const setNavColor = () => {
    Taro.setNavigationBarColor({
      backgroundColor: '#FF9933',
      frontColor: '#ffffff',
      fail: () => {
        setFailNotify({
          open: true,
          content: '背景色设置失败',
        })
      }
    }).then()
  }

  const getUserProfile = () => {
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
            setFailNotify({
              open: true,
              content: '登录失败',
            })
            return
          }
          // 获取code成功
          setLoginCode(result.code)
        }
      }).then()
    }
  }

  // tap vibrate
  useTabItemTap(() => {
    Taro.vibrateShort().then()
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
      fail: () => {
        setFailNotify({
          open: true,
          content: '登录失败',
        })
      },
    })
  }

  // 一键登录
  const handleLoginRequest = (LoginCode, encryptedData, iv: string) => {
    Taro.showLoading({
      title: '登录中',
    }).then()

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
        Taro.hideLoading()
        // 登录失败
        if (loginRes.statusCode !== 201) {

          setFailNotify({
            open: true,
            content: '登录失败',
          })
          return
        }
        const { code, data } = loginRes.data
        // 登录失败
        if (code !== 2000) {
          // 登录失败
          setFailNotify({
            open: true,
            content: '登录失败',
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
        setSuccessNotify({
          open: true,
          content: '登录成功',
        })
      })
      .catch(() => {
        Taro.hideLoading()
        setFailNotify({
          open: true,
          content: '登录失败',
        })
      })
  }

  // 前往修改资料
  const handleToUpdateProfile = () => {
    Taro.navigateTo({
      url: '/pages/update-profile/index',
    }).then()
  }

  return (
    <View>
      <UserInfo
        hasLogin={hasLogin}
        userInfo={userInfo}
        handleBtnClick={hasLogin ? handleToUpdateProfile : handleLogin}
      />
      <Cell
        title='通知管理'
        rightIcon={<Arrow />}
        clickable
        onClick={() => {
          Taro.navigateTo({
            url: '/pages/notify/index',
          }).then()
        }}
      />
      <Cell title='手机绑定' rightIcon={<Arrow />} clickable />
      <Cell title='更多设置' rightIcon={<Arrow />} clickable />
      <Cell title='清除缓存' rightIcon={<Arrow />} clickable onClick={() => {
        Taro.clearStorageSync()
      }}
      />
      <Notify open={failNotify.open} color='danger'
              onClose={() => setFailNotify({ open: false, content: '' })}>{failNotify.content}</Notify>
      <Notify open={successNotify.open} color='success'
              onClose={() => setSuccessNotify({ open: false, content: '' })}>{successNotify.content}</Notify>
    </View>
  )
}

export default About
