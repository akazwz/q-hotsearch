import { View, Text } from '@tarojs/components'
import { useDidShow, useTabItemTap } from '@tarojs/runtime'
import Taro from '@tarojs/taro'
import Button from '@taroify/core/button'
import '@taroify/core/button/style'
import { useState } from 'react'

export interface Notify {
  NotifyCount: number,
  NotifyGap: number,
  AllNotifyCount: number,
  NotifyLimitCount: number,
  LastNotify: string
}

const NotifyManage = () => {
  const [notify, setNotify] = useState({
    NotifyCount: 0,
    NotifyGap: 0,
    AllNotifyCount: 0,
    NotifyLimitCount: 0,
    LastNotify: '',
  })

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
      if (res.statusCode !== 200) {
        console.log('err')
        return
      }
      const { code, data } = res.data
      if (code !== 2000) {
        console.log('error')
        return
      }

      const { notify_count, notify_gap, all_notify_count, notify_limit_count, last_notify } = data
      setNotify({
        NotifyCount: notify_count,
        NotifyGap: notify_gap,
        AllNotifyCount: all_notify_count,
        NotifyLimitCount: notify_limit_count,
        LastNotify: last_notify,
      })
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
      {notify.NotifyCount}
      {notify.NotifyGap}
      {notify.AllNotifyCount}
      {notify.NotifyLimitCount}
      {notify.LastNotify}
    </View>
  )
}

export default NotifyManage
