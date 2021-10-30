import { Text, View } from '@tarojs/components'
import Image from '@taroify/core/image'
import '@taroify/core/image/style'
import Row from '@taroify/core/row'
import '@taroify/core/row/style'
import Col from '@taroify/core/col'
import '@taroify/core/col/style'
import Button from '@taroify/core/button'
import '@taroify/core/button/style'
import Tag from '@taroify/core/tag'
import '@taroify/core/tag/style'

const UserInfo = (props: any) => {
  const { userInfo, hasLogin, handleBtnClick } = props
  const { avatarUrl, nickName, bio, gender } = userInfo
  return (
    <View
      style={{
        backgroundColor: '#FF9933',
        padding: '1rem'
      }}
    >
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
        }}
      >
        <Row
          gutter='20'
          justify='center'
          align='center'
        >
          <Col span='8'>
            <View>
              <Image
                src={hasLogin ? avatarUrl : 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ6m9WsdeiclaLlZ9YIibCYZ7HlS8NroTvnDlLvj91BIju5UB36I51Px0uLMpVahrwRq8Mk1t2mSCRQ/132'}
                round
                style={{
                  width: '5rem',
                  height: '5rem',
                  marginTop: '-1rem',
                  marginLeft: '1rem'
                }}
              />
            </View>
          </Col>
          <Col span='8' style={{ overflow: 'hidden' }}>
            {nickName}
          </Col>
          <Col span='8'>
            <Button
              color='primary'
              shape='round'
              onClick={handleBtnClick}
            >
              {hasLogin ? '修改资料' : '一键登录'}
            </Button>
          </Col>
        </Row>
        <Row
          gutter='20'
          justify='center'
          align='center'
        >
          <Col span='24' style={{ margin: '1rem' }}>
            <Text style={{ marginLeft: '1rem' }}>
              {gender === 0 ? '🙆‍♂' : '🙆‍♀'}
            </Text>️
            <Tag
              color={hasLogin ? 'primary' : 'default'}
              shape='round'
              size='medium'
              style={{ marginLeft: '1rem' }}
            >
              微信通知
            </Tag>
            <Tag
              color='default'
              shape='round'
              size='medium'
              style={{ marginLeft: '1rem' }}
            >
              短信通知
            </Tag>
          </Col>
        </Row>
        <Row
          gutter='20'
          justify='center'
        >
          <Col
            span='24'
            style={{
              marginBottom: '10px',
              fontWeight: 'lighter',
              wordWrap: 'break-word',
              wordBreak: 'break-all',
            }}
          >
            <View style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
              <Text>{bio}</Text>
            </View>
          </Col>
        </Row>
      </View>
    </View>
  )
}

export default UserInfo
