import { TianqinDataEntity } from '../../entity/data';
import { Body, Inject, Post, Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { TianqinDataService } from '../../service/data';
import { pDataPath } from '../../../../comm/path';
import { Context } from '@midwayjs/koa';
import * as path from 'path';
import * as fs from 'fs';
import * as AdmZip from 'adm-zip';
import axios from 'axios';

/**
 * 天勤数据分析
 */
@Provide()
@CoolController({
  api: ['update', 'info', 'list', 'page'],
  entity: TianqinDataEntity,
  service: TianqinDataService,
  pageQueryOp: {
    fieldEq: [
      'weekTrendDirection',
      'weekTrendState',
      'dayTrendDirection',
      'dayTrendState',
      'hourTrendDirection',
      'status',
    ],
    keyWordLikeFields: ['mainSymbol', 'contractName', 'remark'],
  },
})
export class AdminTianqinDataController extends BaseController {
  @Inject()
  tianqinDataService: TianqinDataService;

  @Inject()
  ctx: Context;

  /**
   * 解析品种code，生成模板文件名占位符
   * 取 "." 后的部分，若为1位则补 "9" 凑够2位
   * 示例：DCE.jd => jd，DCE.p => p9
   */
  private parseCode(code: string): string {
    if (!code) return '';
    const dotIndex = code.indexOf('.');
    let suffix = dotIndex >= 0 ? code.substring(dotIndex + 1) : code;
    if (suffix.length === 1) {
      suffix = suffix + '9';
    }
    return suffix;
  }

  /**
   * 导出策略文件
   * 按日趋势方向匹配模板（多头→Long，空头→Short），复制模板文件打包zip下载
   */
  @Post('/export', { summary: '导出策略文件' })
  async export(@Body() query: any) {
    // 1. 按页面查询条件获取数据
    const list = await this.tianqinDataService.list(query, {
      fieldEq: [
        'weekTrendDirection',
        'weekTrendState',
        'dayTrendDirection',
        'dayTrendState',
        'hourTrendDirection',
        'status',
      ],
      keyWordLikeFields: ['mainSymbol', 'contractName', 'remark'],
    });

    if (!list || list.length === 0) {
      return this.fail('没有可导出的数据');
    }

    // 2. 清空并重建临时输出目录
    const outputDir = path.join(pDataPath(), 'tianqin-data-export');
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }
    fs.mkdirSync(outputDir, { recursive: true });

    // 模板根目录
    const templatesDir = path.join(pDataPath(), 'tianqin-templates');

    // 3. 遍历数据，按日趋势方向选择模板并复制到临时目录
    const zip = new AdmZip();

    for (const item of list) {
      const dayTrendDirection = item.dayTrendDirection || '';

      // 多头→Long，空头→Short，其他跳过
      let subDir: string;
      if (dayTrendDirection.includes('多头')) {
        subDir = 'Long';
      } else if (dayTrendDirection.includes('空头')) {
        subDir = 'Short';
      } else {
        continue;
      }

      // 解析品种code
      const code = this.parseCode(item.code || '');

      // 拼接模板文件路径：{Long|Short}/TS05_myunit_[code]888.tuf
      const templateFileName = `TS05_myunit_${code}888.tuf`;
      const templatePath = path.join(templatesDir, subDir, templateFileName);

      // 模板不存在则跳过
      if (!fs.existsSync(templatePath)) {
        continue;
      }

      // 复制模板到输出目录
      const outputFilePath = path.join(outputDir, templateFileName);
      fs.copyFileSync(templatePath, outputFilePath);

      // 加入zip
      zip.addLocalFile(outputFilePath);
    }

    // 4. 打包zip
    const zipFileName = `tianqin-data-strategies-${Date.now()}.zip`;
    const zipPath = path.join(outputDir, zipFileName);
    zip.writeZip(zipPath);

    // 5. 返回zip下载
    const zipBuffer = fs.readFileSync(zipPath);
    this.ctx.set('Content-Type', 'application/zip');
    this.ctx.set(
      'Content-Disposition',
      `attachment; filename="${zipFileName}"`
    );
    this.ctx.body = zipBuffer;

    // 6. 延迟清理临时目录
    setTimeout(() => {
      try {
        if (fs.existsSync(outputDir)) {
          fs.rmSync(outputDir, { recursive: true });
        }
      } catch (e) {
        // ignore
      }
    }, 5000);
  }

  /**
   * 启动数据分析任务
   * 转发到 http://192.168.0.191:8002/api/macd_kdj
   */
  @Post('/startTask', { summary: '启动任务' })
  async startTask() {
    const res = await axios.post('http://192.168.0.191:8002/api/macd_kdj', {});
    return res.data;
  }
}
