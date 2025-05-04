import * as w3up from '@web3-storage/w3up-client'

// 调试标签
const TAG = '[Web3.Storage]'

// 环境变量配置
const EMAIL = import.meta.env.VITE_W3UP_EMAIL // 修改变量名
const SPACE_DID = import.meta.env.VITE_W3UP_SPACE_DID

// 客户端实例
let client = null

/**
 * 初始化授权
 */
async function authorizeClient() {
  console.debug(TAG, '开始授权流程')
  
  // 基础验证
  if (!EMAIL || !SPACE_DID) {
    throw new Error(`缺少环境变量: ${!EMAIL ? 'VITE_W3UP_EMAIL' : ''} ${
      !SPACE_DID ? 'VITE_W3UP_SPACE_DID' : ''
    }`.trim())
  }

  try {
    // 1. 创建新客户端
    const instance = await w3up.create()
    
    // 2. 显式授权（弹出验证页面）
    console.debug(TAG, '正在请求授权...')
    await instance.authorize(EMAIL)
    
    // 3. 设置工作空间
    await instance.setCurrentSpace(SPACE_DID)
    
    console.debug(TAG, '授权成功')
    return instance
  } catch (error) {
    console.error(TAG, '授权失败:', error)
    throw new Error(`授权失败: ${error.message}`)
  }
}

/**
 * 获取客户端实例
 */
async function getClient() {
  if (!client) {
    client = await authorizeClient()
  }
  return client
}

/**
 * 上传文件到IPFS
 */
export async function uploadToIPFS(file) {
  // 输入验证（保持不变）
  if (!(file instanceof File)) {
    throw new Error('无效的文件对象')
  }

  try {
    const client = await getClient()
    const result = await client.uploadFile(file)
    
    if (!result?.cid) {
      throw new Error('无效的CID响应')
    }
    
    return result.cid.toString()
  } catch (error) {
    console.error(TAG, '上传失败:', error)
    throw new Error(`上传失败: ${error.message}`)
  }
}

// 清理资源
export async function cleanup() {
  if (client) {
    await client.close()
    client = null
  }
}