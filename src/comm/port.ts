import { execSync } from 'child_process';

/**
 * 同步检查端口是否可用（通过系统命令）
 * @param {number} port - 要检查的端口
 * @returns {boolean} - 是否可用
 */
function isPortAvailableSync(port: number): boolean {
  try {
    if (process.platform === 'win32') {
      // Windows 使用 netstat 检查端口，排除 TIME_WAIT 状态
      const result = execSync(`netstat -ano | findstr :${port}`, {
        encoding: 'utf-8',
      });
      // 如果端口只处于 TIME_WAIT 状态，则认为端口可用
      return !result || result.toLowerCase().includes('time_wait');
    } else {
      // Linux/Mac 使用 lsof 检查端口，只检查 LISTEN 状态
      const result = execSync(`lsof -i :${port} -sTCP:LISTEN`, {
        encoding: 'utf-8',
      });
      return !result;
    }
  } catch (error) {
    // 命令执行失败，端口可用
    return true;
  }
}

/**
 * 查找可用端口（同步）
 * @param {number} startPort - 起始端口
 * @returns {number} - 可用的端口
 */
export function availablePort(startPort: number): number {
  if (!process['pkg']) return startPort;
  let port = startPort;
  while (port <= 8010) {
    if (isPortAvailableSync(port)) {
      if (port !== startPort) {
        console.warn(
          '\x1b[33m%s\x1b[0m',
          `Port ${startPort} is occupied, using port ${port}`
        );
      }
      return port;
    }
    port++;
  }
  return 8001;
}
