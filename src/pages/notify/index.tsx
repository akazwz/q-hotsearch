import { useState } from 'react'
import { View } from '@tarojs/components'
import { useDidShow, useTabItemTap } from '@tarojs/runtime'
import Taro from '@tarojs/taro'
import Button from '@taroify/core/button'
import '@taroify/core/button/style'
import Cell from '@taroify/core/cell'
import '@taroify/core/cell/style'
import Notify from '@taroify/core/notify'
import '@taroify/core/notify/style'
import Stepper from '@taroify/core/stepper'
import '@taroify/core/stepper/style'
import Divider from '@taroify/core/divider'
import '@taroify/core/divider/style'

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
  const [notifyCount, setNotifyCount] = useState(0)
  const [notifyGap, setNotifyGap] = useState(0)
  const [failNotify, setFailNotify] = useState({
    open: false,
    content: ''
  })
  const [successNotify, setSuccessNotify] = useState({
    open: false,
    content: ''
  })

  // tap vibrate
  useTabItemTap(() => {
    Taro.vibrateShort().then()
  })

  useDidShow(() => {
    // 获取通知设置
    Taro.request({
      url: 'https://api.hellozwz.com/v1/users/notify',
      method: 'GET',
      header: {
        token: Taro.getStorageSync('token'),
      },
    }).then((res) => {
      if (res.statusCode !== 200) {
        setFailNotify({
          open: true,
          content: '加载通知设置失败',
        })
        return
      }
      const { code, data } = res.data
      if (code !== 2000) {
        setFailNotify({
          open: true,
          content: '加载通知设置失败',
        })
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
      setNotifyCount(notify_count)
      setNotifyGap(notify_gap)
    })
  })

  const handleSaveNotifySetting = () => {
    Taro.showLoading({ title: '保存中' }).then()
    Taro.request({
      url: 'https://api.hellozwz.com/v1/users/notify',
      method: 'POST',
      header: {
        token: Taro.getStorageSync('token'),
      },
      data: {
        notify_count: notifyCount,
        notify_gap: notifyGap,
      },
    })
      .then((res) => {
        Taro.hideLoading()
        if (res.statusCode !== 200) {
          setFailNotify({
            open: true,
            content: '保存失败',
          })
          return
        }
        const { code } = res.data
        if (code !== 2000) {
          setFailNotify({
            open: true,
            content: '保存失败',
          })
          return
        }
        setSuccessNotify({
          open: true,
          content: '保存成功',
        })
      })
      .catch(() => {
        Taro.hideLoading()
        setFailNotify({
          open: true,
          content: '保存失败',
        })
      })
  }

  return (
    <View className='index'>
      <Divider
        style={{
          color: '#1989fa',
          borderColor: '#1989fa',
          padding: '0 16px'
        }}
      >
        通知管理
      </Divider>

      <Cell title='通知次数'>
        <Stepper
          value={notifyCount}
          min={0}
          max={300}
          onChange={(value) => {
            // 增加时调用通知订阅
            if (value > notifyCount) {
              Taro.requestSubscribeMessage({
                tmplIds: ['XV16ZyG6Af_gG8D4qg7M17Fw23m_zYWNo689XpJKYQE'],
                fail: () => {
                  return
                },
                success: (result) => {
                  const { XV16ZyG6Af_gG8D4qg7M17Fw23m_zYWNo689XpJKYQE } = result
                  if (XV16ZyG6Af_gG8D4qg7M17Fw23m_zYWNo689XpJKYQE === 'reject') {
                    return
                  }
                  setNotifyCount(Number(value))
                }
              }).then()
            } else {
              setNotifyCount(Number(value))
            }
          }}
        >
          <Stepper.Button />
          <Stepper.Input disabled />
          <Stepper.Button />
        </Stepper>
      </Cell>
      <Cell title='通知间隔' clickable>
        <Stepper
          value={notifyGap}
          onChange={(value) => {
            // 增加时调用通知订阅
            setNotifyGap(Number(value))
          }}
        />
      </Cell>
      <Cell title='已经通知次数' clickable>{notify.AllNotifyCount}</Cell>
      <Cell title='通知限额' clickable>{notify.NotifyLimitCount}</Cell>
      <Cell title='上次通知' clickable>{notify.LastNotify}</Cell>
      <Button
        block
        color='info'
        onClick={handleSaveNotifySetting}
      >
        保存
      </Button>
      <Notify
        open={failNotify.open}
        color='danger'
        onClose={() => setFailNotify({ open: false, content: '' })}
      >
        {failNotify.content}
      </Notify>
      <Notify
        open={successNotify.open}
        color='success'
        onClose={() => setSuccessNotify({ open: false, content: '' })}
      >
        {successNotify.content}
      </Notify>
    </View>
  )
}

export default NotifyManage
