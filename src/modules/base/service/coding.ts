import { App, IMidwayApplication, Init, Inject, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Ai编码
 */
@Provide()
export class BaseCodingService extends BaseService {
  @App()
  app: IMidwayApplication;

  /**
   * 获得模块目录结构
   */
  async getModuleTree() {
    if (this.app.getEnv() !== 'local') {
      return [];
    }

    const moduleDir = await this.app.getBaseDir();
    const modulesPath = path.join(moduleDir, 'modules');
    // 返回modules下有多少个模块
    const modules = fs.readdirSync(modulesPath);
    return modules.filter(module => module !== '.DS_Store');
  }

  /**
   * 创建代码
   * @param codes 代码
   */
  async createCode(
    codes: {
      path: string;
      content: string;
    }[]
  ) {
    if (this.app.getEnv() !== 'local') {
      throw new Error('只能在开发环境下创建代码');
    }

    const moduleDir = this.app.getAppDir();

    for (const code of codes) {
      // 格式化代码内容
      const formattedContent = await this.formatContent(code.content);

      // 获取完整的文件路径
      const filePath = path.join(moduleDir, code.path);

      // 确保目录存在
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // 写入文件
      fs.writeFileSync(filePath, formattedContent, 'utf8');
    }
  }

  /**
   * 格式化内容
   * @param content
   */
  async formatContent(content: string) {
    // 使用prettier格式化内容
    const prettier = require('prettier');
    return prettier.format(content, {
      parser: 'typescript',
      singleQuote: true,
      trailingComma: 'all',
      bracketSpacing: true,
      arrowParens: 'avoid',
      printWidth: 80,
    });
  }
}
