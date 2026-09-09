import * as path from 'path';
import * as os from 'os';
import * as md5 from 'md5';
import * as fs from 'fs';

/**
 * 获得配置文件中的 keys
 * @returns
 */
const getKeys = () => {
  const configFile = path.join(__dirname, '../config/config.default.js');
  const configContent = fs.readFileSync(configFile, 'utf8');
  const keys = configContent.match(/keys: '([^']+)'/)?.[1];
  return keys;
};

/**
 * 项目数据目录
 * @returns
 */
export const pDataPath = () => {
  const dirPath = path.join(os.homedir(), '.cool-admin', md5(getKeys()));
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  return dirPath;
};

/**
 * 上传目录
 * @returns
 */
export const pUploadPath = () => {
  const uploadPath = path.join(pDataPath(), 'upload');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return uploadPath;
};

/**
 * 插件目录
 * @returns
 */
export const pPluginPath = () => {
  const pluginPath = path.join(pDataPath(), 'plugin');
  if (!fs.existsSync(pluginPath)) {
    fs.mkdirSync(pluginPath, { recursive: true });
  }
  return pluginPath;
};

/**
 * sqlite 数据库文件
 */
export const pSqlitePath = () => {
  return path.join(pDataPath(), 'cool.sqlite');
};

/**
 * 缓存目录
 * @returns
 */
export const pCachePath = () => {
  return path.join(pDataPath(), 'cache');
};
