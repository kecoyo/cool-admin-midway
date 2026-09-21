import { TianqinTrendEntity } from '../../entity/trend';
import { Body, Get, Inject, Post, Provide, Query } from '@midwayjs/core';
import { CoolController, BaseController } from '@cool-midway/core';
import { TianqinTrendService } from '../../service/trend';
import { pDataPath } from '../../../../comm/path';
import { Context } from '@midwayjs/koa';
import * as path from 'path';
import * as fs from 'fs';
import * as AdmZip from 'adm-zip';

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

    // 3. 遍历列表数据，根据trendDirection选择模板并生成XML文件
    const zip = new AdmZip();

    for (const item of list) {
      const trendDirection = item.trendDirection || '';

      // 上涨使用L模板，下跌使用S模板，其它忽略
      let isUp: boolean;
      if (trendDirection.includes('上涨')) {
        isUp = true;
      } else if (trendDirection.includes('下跌')) {
        isUp = false;
      } else {
        continue;
      }

      // 选择模板文件
      const templateName = isUp ? 'TS04_L.xml' : 'TS04_S.xml';
      const templatePath = path.join(templatesDir, templateName);

      if (!fs.existsSync(templatePath)) {
        continue;
      }

      let content = fs.readFileSync(templatePath, 'utf-8');

      // 替换模板内容中的占位符
      const contractCode = item.contractCode || '';
      const contractName = item.contractName || '';
      content = content
        .replace(/\[contractCode\]/g, contractCode)
        .replace(/\[contractName\]/g, contractName);

      // 生成输出文件名（替换占位符）
      const outputFileName = `myunit_${contractCode}.xml`;

      // 写入XML文件到临时目录
      const outputFilePath = path.join(outputDir, outputFileName);
      fs.writeFileSync(outputFilePath, content, 'utf-8');

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
}
