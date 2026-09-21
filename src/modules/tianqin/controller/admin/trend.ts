import { TianqinTrendEntity } from '../../entity/trend';
import { Body, Inject, Post, Provide } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { TianqinTrendService } from '../../service/trend';
import { pDataPath } from '../../../../comm/path';
import { Context } from '@midwayjs/koa';
import * as path from 'path';
import * as fs from 'fs';
import * as AdmZip from 'adm-zip';
import axios from 'axios';

/**
 * 天勤趋势分析
 */
@Provide()
@CoolController({
  api: ['update', 'info', 'list', 'page'],
  entity: TianqinTrendEntity,
  service: TianqinTrendService,
  pageQueryOp: {
    fieldEq: ['trendDirection', 'trendState', 'status'],
    keyWordLikeFields: [
      'code',
      'name',
      'remark',
      'mainSymbol',
      'action',
      'actionDetail',
    ],
  },
})
export class AdminTianqinTrendController extends BaseController {
  @Inject()
  tianqinTrendService: TianqinTrendService;

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
    // 1. 查询与页面列表一致的数据
    const list = await this.tianqinTrendService.list(query, {
      fieldEq: ['trendDirection', 'trendState', 'status'],
      keyWordLikeFields: [
        'code',
        'name',
        'remark',
        'mainSymbol',
        'action',
        'actionDetail',
      ],
    });

    if (!list || list.length === 0) {
      return this.fail('没有可导出的数据');
    }

    // 2. 准备临时输出目录，清除上次生成的文件
    const outputDir = path.join(pDataPath(), 'tianqin-export');
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true });
    }
    fs.mkdirSync(outputDir, { recursive: true });

    // 模板目录（模块内 templates）
    const templatesDir = path.join(__dirname, '..', '..', 'templates');

    // 3. 遍历列表数据，根据trendDirection选择模板文件，直接复制到临时目录
    const zip = new AdmZip();

    for (const item of list) {
      const trendDirection = item.trendDirection || '';

      // 上涨使用TS04_L模板，下跌使用TS04_S模板，其它忽略
      let subDir: string;
      let prefix: string;
      if (trendDirection.includes('上涨')) {
        subDir = 'TS04_L';
        prefix = 'myunit';
      } else if (trendDirection.includes('下跌')) {
        subDir = 'TS04_S';
        prefix = 'myunit';
      } else {
        continue;
      }

      // 解析code占位符
      const code = this.parseCode(item.code || '');

      // 构建模板文件路径：TS04_L/TS04_L_[code]888_H1.xml
      const templateFileName = `${prefix}_${code}888_H1.xml`;
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
    const zipFileName = `tianqin-strategies-${Date.now()}.zip`;
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
   * 启动趋势分析任务
   * 转发请求到 http://192.168.0.191:8002/api/trend_analysis
   */
  @Post('/startTask', { summary: '启动任务' })
  async startTask() {
    const res = await axios.post(
      'http://192.168.0.191:8002/api/trend_analysis',
      {}
    );
    return res.data;
  }
}
