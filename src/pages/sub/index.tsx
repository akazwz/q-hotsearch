import { useState } from 'react'
import Taro from '@tarojs/taro'
import { usePullDownRefresh, useReady, useTabItemTap } from '@tarojs/runtime'
import { View } from '@tarojs/components'
import Button from '@taroify/core/button'
import '@taroify/core/button/style'
import '@taroify/core/tag/style'
import Cell from '@taroify/core/cell'
import '@taroify/core/cell/style'
import SwipeCell from '@taroify/core/swipe-cell'
import '@taroify/core/swipe-cell/style'
import Field from '@taroify/core/field'
import '@taroify/core/field/style'
import Divider from '@taroify/core/divider'
import '@taroify/core/divider/style'
import Dialog from '@taroify/core/dialog'
import '@taroify/core/dialog/style'
import Toast from '@taroify/core/toast'
import '@taroify/core/toast/style'
import { AddOutlined } from '@taroify/icons'

const Sub = () => {
  const [subs, setSubs] = useState([])
  const [keyword, setKeyword] = useState('')
  const [dialogLogin, setDialogLogin] = useState(false)
  const [loading, setLoading] = useState(false)

  // 获取订阅
  useReady(() => {
    getSubWords()
  })

  usePullDownRefresh(() => {
    getSubWords()
  })

  // tap vibrate
  useTabItemTap(() => {
    Taro.vibrateShort().then()
  })

  const getSubWords = () => {
    setLoading(true)
    Taro.vibrateShort().then()
    Taro.request({
      url: 'https://api.hellozwz.com/v1/subs',
      header: {
        token: Taro.getStorageSync('token')
      },
      method: 'GET'
    }).then((res) => {
      Taro.stopPullDownRefresh()
      setLoading(false)
      if (res.data.data) {
        const { data } = res.data
        setSubs(data)
      }
      // 未登录
      if (res.statusCode === 401) {
        setDialogLogin(true)
      }
    }).catch((err) => {
      Taro.stopPullDownRefresh()
      setLoading(false)
      console.log('error:' + err)
    })
  }

  const addSubWord = (word: string) => {
    setLoading(true)
    Taro.request({
      url: 'https://api.hellozwz.com/v1/subs',
      header: {
        token: Taro.getStorageSync('token')
      },
      data: {
        sub_word: word
      },
      method: 'POST'
    }).then((res) => {
      setLoading(false)
      if (res.statusCode === 201) {
        getSubWords()
      }
      // 未登录
      if (res.statusCode === 401) {
        setDialogLogin(true)
      }
    }).catch((err) => {
      setLoading(false)
      console.log('error:' + err)
    })
  }

  const deleteSubWord = (word: string) => {
    setLoading(true)
    Taro.request({
      url: 'https://api.hellozwz.com/v1/subs',
      header: {
        token: Taro.getStorageSync('token')
      },
      data: {
        sub_word: word
      },
      method: 'DELETE'
    }).then((res) => {
      setLoading(false)
      if (res.statusCode === 204) {
        getSubWords()
      }
      // 未登录
      if (res.statusCode === 401) {
        setDialogLogin(true)
      }
    }).catch((err) => {
      setLoading(false)
      console.log('error:' + err)
    })
  }

  return (
    <View>
      <Cell.Group inset>
        <Field
          align='center'
          label='订阅词'
          placeholder='请输入订阅词'
          value={keyword}
          onChange={(value) => {
            setKeyword(value.detail.value)
          }}
        >
          <Field.Button>
            <Button
              size='medium'
              color='primary'
              shape='round'
              icon={<AddOutlined />}
              onClick={() => {
                addSubWord(keyword)
              }}
            >
              添加
            </Button>
          </Field.Button>
        </Field>
      </Cell.Group>
      <Button
        block
        color='info'
        onClick={() => {
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
      <Divider
        style={{
          color: '#1989fa',
          borderColor: '#1989fa',
          padding: '0 16px'
        }}
      >
        订阅管理
      </Divider>
      {subs.map((sub, index) => {
        return <SwipeCell key={index}>
          <Cell bordered={false} title={sub}>
            滑动进行编辑
          </Cell>
          <SwipeCell.Actions side='right'>
            <Button
              variant='contained'
              shape='square'
              color='danger'
              onClick={() => {
                deleteSubWord(sub)
              }}
            >
              删除
            </Button>
            <Button variant='contained' shape='square' color='primary'>编辑</Button>
          </SwipeCell.Actions>
        </SwipeCell>
      })}
      <Dialog open={dialogLogin} onClose={() => setDialogLogin(false)}>
        <Dialog.Header>未登录</Dialog.Header>
        <Dialog.Content>请登录后使用</Dialog.Content>
        <Dialog.Actions>
          <Button onClick={() => setDialogLogin(false)}>确认</Button>
        </Dialog.Actions>
      </Dialog>
      <Toast open={loading} type='loading'>加载中...</Toast>
    </View>
  )
}

export default Sub
