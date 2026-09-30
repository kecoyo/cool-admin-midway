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
   * 根据行数据code字段解析模板占位符[code]
   * code格式如 DCE.jd => jd，DCE.p => p9
   * 规则：去掉"."前部分（含"."），剩余部分若为1位则补"9"凑够2位
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
   * 导出XML策略文件（打包成zip下载）
   * 查询条件与/page接口一致
   */
  @Post('/export', { summary: '导出策略文件' })
  async export(@Body() query: any) {
    // 1. 查询全部数据
    const list = await this.tianqinDataService.list({}, {});

    // 2. 准备临时输出目录，清除上次生成的文件
    const outputDir = path.join(pDataPath(), 'tianqin-data-export');
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }
    fs.mkdirSync(outputDir, { recursive: true });

    // 模板目录（模块内 templates）
    const templatesDir = path.join(pDataPath(), 'tianqin-templates');

    // 3. 遍历列表数据，根据hourTrendDirection选择模板文件，直接复制到临时目录
    const zip = new AdmZip();

    for (const item of list) {
      // 条件过滤
      const weekDir = item.weekTrendDirection || '';
      const weekState = item.weekTrendState || '';
      const weekMacdDir = item.weekMacdTrendDirection || '';
      const weekMacdState = item.weekMacdTrendState || '';
      const dayDir = item.dayTrendDirection || '';
      const dayMacdDir = item.dayMacdTrendDirection || '';
      const dayState = item.dayTrendState || '';
      const dayMacdState = item.dayMacdTrendState || '';
      const dayKdjSignal = item.dayKdjSignal || '';
      const hourDir = item.hourTrendDirection || '';

      let isLong = false;
      let isShort = false;

      // 多头：dayTrendDirection=多头 and dayMacdTrendDirection=多头
      // 且（dayTrendState=多头, dayMacdTrendState=多头, dayKdjSignal=金叉）至少成立两个
      if (
        weekDir === '多头' &&
        weekState === '多头' &&
        dayDir === '多头' &&
        hourDir === '多头'
      ) {
        let count = 0;
        if (dayState === '多头') count++;
        if (dayMacdState === '多头') count++;
        if (dayKdjSignal === '金叉') count++;
        if (count >= 2) {
          isLong = true;
        }
      }

      // 空头：dayTrendDirection=空头 and dayMacdTrendDirection=空头
      // 且（dayTrendState=空头, dayMacdTrendState=空头, dayKdjSignal=死叉）至少成立两个
      if (
        !isLong &&
        weekDir === '空头' &&
        weekState === '空头' &&
        dayDir === '空头' &&
        hourDir === '空头'
      ) {
        let count = 0;
        if (dayState === '空头') count++;
        if (dayMacdState === '空头') count++;
        if (dayKdjSignal === '死叉') count++;
        if (count >= 2) {
          isShort = true;
        }
      }

      // 其它都跳过
      if (!isLong && !isShort) {
        continue;
      }

      // 多头使用Long模板，空头使用Short模板
      let subDir: string;
      let prefix: string;
      if (isLong) {
        subDir = 'Long';
        prefix = 'TS05_myunit';
      } else {
        subDir = 'Short';
        prefix = 'TS05_myunit';
      }

      // 解析code占位符
      const code = this.parseCode(item.code || '');

      // 构建模板文件路径：Long/myunit_[code]888.tuf
      const templateFileName = `${prefix}_${code}888.tuf`;
      const templatePath = path.join(templatesDir, subDir, templateFileName);

      if (!fs.existsSync(templatePath)) {
        continue;
      }

      // 直接复制模板文件到临时目录
      const outputFilePath = path.join(outputDir, templateFileName);
      fs.copyFileSync(templatePath, outputFilePath);

      // 添加到zip
      zip.addLocalFile(outputFilePath);
    }

    // 4. 生成zip文件
    const zipFileName = `tianqin-data-strategies-${Date.now()}.zip`;
    const zipPath = path.join(outputDir, zipFileName);
    zip.writeZip(zipPath);

    // 5. 返回zip文件给客户端下载
    const zipBuffer = fs.readFileSync(zipPath);
    this.ctx.set('Content-Type', 'application/zip');
    this.ctx.set(
      'Content-Disposition',
      `attachment; filename="${zipFileName}"`
    );
    this.ctx.body = zipBuffer;

    // 6. 清理临时目录
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
   * 转发请求到 http://192.168.0.191:8002/api/macd_kdj
   */
  @Post('/startTask', { summary: '启动任务' })
  async startTask() {
    const res = await axios.post('http://192.168.0.191:8002/api/macd_kdj', {});
    return res.data;
  }
}
