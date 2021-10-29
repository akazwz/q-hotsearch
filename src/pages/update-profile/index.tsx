import { View } from '@tarojs/components'
import { useDidShow, useReady, useTabItemTap } from '@tarojs/runtime'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import Toast, { ToastType } from '@taroify/core/toast'
import { Contact } from '@taroify/icons'
import Image from '@taroify/core/image'
import '@taroify/core/image/style'
import Cell from '@taroify/core/cell'
import '@taroify/core/cell/style'
import Field from '@taroify/core/field'
import '@taroify/core/field/style'
import Radio from '@taroify/core/radio'
import '@taroify/core/radio/style'
import Divider from '@taroify/core/divider'
import '@taroify/core/divider/style'
import Button from '@taroify/core/button'
import '@taroify/core/button/style'
import { UserInfoI } from '../profile'

const UpdateProfile = () => {
  const [toastInfo, setToastInfo] = useState({
    open: false,
    type: ToastType.Loading,
    content: '加载中',
  })

  const [avatarUrl, setAvatarUrl] = useState('')
  const [nickName, setNickName] = useState('')
  const [gender, setGender] = useState(0)
  const [bio, setBio] = useState('')
  const [btnLoading, setBtnLoading] = useState(false)
  // tap vibrate
  useTabItemTap(() => {
    Taro.vibrateShort().then()
  })

  useDidShow(() => {
    Taro.hideHomeButton().then()
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

  const handleUpdateUserProfile = () => {
    setBtnLoading(true)
    Taro.request({
      url: 'https://api.hellozwz.com/v1/users/profile',
      method: 'PUT',
      data: {
        avatar_url: avatarUrl,
        nick_name: nickName,
        gender: gender,
        bio: bio,
      },
      header: {
        token: Taro.getStorageSync('token')
      },
    })
      .then((res) => {
        setBtnLoading(false)
        if (res.statusCode !== 200) {
          setToastInfo({
            open: true,
            type: ToastType.Fail,
            content: '修改失败',
          })
          return
        }
        const { code } = res.data
        if (code !== 2000) {
          setToastInfo({
            open: true,
            type: ToastType.Fail,
            content: '修改失败',
          })
          return
        }
        setToastInfo({
          open: true,
          type: ToastType.Success,
          content: '修改成功',
        })
        const userInfoUpdated = {
          avatarUrl: avatarUrl,
          nickName: nickName,
          gender: gender,
          bio: bio,
        }
        Taro.setStorageSync('userInfo', userInfoUpdated)
      })
      .catch((err) => {
        setBtnLoading(false)
        setToastInfo({
          open: true,
          type: ToastType.Fail,
          content: err,
        })
      })
  }

  return (
    <View>
      <View style={{
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center'
      }}
      >
        <Image
          src={avatarUrl}
          round
          style={{
            width: '7rem',
            height: '7rem',
            margin: '3rem',
          }}
          fallback={<Contact />}
        />
      </View>
      <Divider />
      <Cell.Group inset>
        <Field
          label='昵称'
          value={nickName}
          placeholder='请输入昵称'
          maxlength={30}
          onChange={(e) => {
            setNickName(e.detail.value)
          }}
        />
        <Field
          label='性别'
        >
          <Radio.Group
            direction='horizontal'
            value={gender}
            onChange={setGender}
          >
            <Radio name={0}>男</Radio>
            <Radio name={1}>女</Radio>
          </Radio.Group>
        </Field>
        <Field
          label='个签'
          value={bio}
          placeholder='请输入个性签名'
          maxlength={140}
          onChange={(e) => {
            setBio(e.detail.value)
          }}
        />
      </Cell.Group>
      <Divider />
      <View>
        <Button
          color='primary'
          block
          loading={btnLoading}
          onClick={handleUpdateUserProfile}
        >
          提交
        </Button>
      </View>
      <Toast open={toastInfo.open} type={toastInfo.type}>{toastInfo.content}</Toast>
    </View>
  )
}

export default UpdateProfile
