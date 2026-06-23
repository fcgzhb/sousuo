function seedDatabase(db) {
  const keywordCount = db.prepare('SELECT COUNT(*) as cnt FROM keywords').get().cnt;
  if (keywordCount > 0) {
    console.log('Seed data already exists, skipping.');
    return;
  }

  const insertKeywords = db.prepare(`
    INSERT INTO keywords (keyword, search_volume, competition_level, status, tags, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const keywords = [
    ['SEO优化', 12000, '高', 'active', 'SEO,搜索引擎,优化', '核心关键词'],
    ['关键词分析工具', 8500, '中', 'active', '工具,分析,关键词', '长尾关键词'],
    ['网站排名优化', 15000, '高', 'active', '排名,网站,优化', '高竞争关键词'],
    ['内容营销策略', 6800, '低', 'active', '内容,营销,策略', '新兴关键词'],
    ['搜索引擎营销', 9200, '中', 'pending', '搜索,营销,SEM', '待评估'],
  ];
  const insertManyKw = db.transaction((items) => {
    for (const item of items) insertKeywords.run(...item);
  });
  insertManyKw(keywords);

  const insertSuggestions = db.prepare(`
    INSERT INTO suggestions (keyword_id, keyword, priority_level, suggestion, performance_metrics, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const suggestions = [
    [1, 'SEO优化', '高', '增加长尾关键词布局，优化页面标题和描述', '{"CTR":3.2,"CVR":1.8,"Impression":50000}', 'pending', '首页优化建议'],
    [1, 'SEO优化', '中', '提升页面加载速度，优化移动端体验', '{"CTR":2.8,"CVR":1.5,"Impression":45000}', 'pending', '性能优化'],
    [2, '关键词分析工具', '高', '创建关键词分析工具对比评测内容', '{"CTR":4.1,"CVR":2.3,"Impression":20000}', 'active', '内容优化建议'],
    [3, '网站排名优化', '中', '优化内链结构，增加高质量外链', '{"CTR":2.5,"CVR":1.2,"Impression":60000}', 'pending', '链接建设'],
  ];
  const insertManySg = db.transaction((items) => {
    for (const item of items) insertSuggestions.run(...item);
  });
  insertManySg(suggestions);

  const insertUsers = db.prepare(`
    INSERT INTO users (username, email, phone, role, status)
    VALUES (?, ?, ?, ?, ?)
  `);

  const users = [
    ['admin', 'admin@example.com', '13800000001', 'admin', 'active'],
    ['editor', 'editor@example.com', '13800000002', 'editor', 'active'],
    ['analyst', 'analyst@example.com', '13800000003', 'analyst', 'active'],
  ];
  const insertManyU = db.transaction((items) => {
    for (const item of items) insertUsers.run(...item);
  });
  insertManyU(users);

  const insertCompetitors = db.prepare(`
    INSERT INTO competitors (name, website_url, industry, location, is_active, keywords, analysis_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const competitors = [
    ['竞品A公司', 'https://www.competitor-a.com', '互联网', '北京', 1, 'SEO,SEM,内容营销', '主要竞争对手，排名靠前'],
    ['竞品B公司', 'https://www.competitor-b.com', '科技', '上海', 1, '关键词工具,数据分析', '新兴竞争者'],
    ['竞品C公司', 'https://www.competitor-c.com', '营销', '广州', 0, '品牌营销,社交', '暂时不活跃'],
  ];
  const insertManyC = db.transaction((items) => {
    for (const item of items) insertCompetitors.run(...item);
  });
  insertManyC(competitors);

  const insertTrends = db.prepare(`
    INSERT INTO search_trends (keyword, region, trend_date, search_volume, related_keywords, trend_type, hot_score, analysis_notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const trends = [
    ['SEO优化', '全国', '2025-06', 12000, 'SEO教程,SEO技巧,SEO服务', '上升', 85, '持续上升趋势'],
    ['关键词分析', '全国', '2025-06', 7500, '关键词工具,关键词挖掘', '稳定', 72, '保持稳定'],
    ['网站排名', '全国', '2025-06', 9800, '排名查询,排名优化', '上升', 78, '季节性上升'],
  ];
  const insertManyT = db.transaction((items) => {
    for (const item of items) insertTrends.run(...item);
  });
  insertManyT(trends);

  const insertTraffic = db.prepare(`
    INSERT INTO traffic_sources (source_type, source_name, is_active, start_date, channels, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const traffic = [
    ['自然搜索', '百度搜索', 1, '2025-01-01', '百度,搜狗,360', '搜索引擎自然流量'],
    ['付费广告', '百度推广', 1, '2025-02-01', '百度竞价,信息流', 'SEM付费流量'],
    ['社交媒体', '微信公众号', 1, '2025-03-01', '微信,微博,抖音', '社交媒体引流'],
    ['直接访问', '直接输入', 0, '2025-01-15', '浏览器书签,品牌', '用户直接访问'],
  ];
  const insertManyTr = db.transaction((items) => {
    for (const item of items) insertTraffic.run(...item);
  });
  insertManyTr(traffic);

  const insertContent = db.prepare(`
    INSERT INTO content_strategies (content_title, content_description, target_audience, content_type, content_formats, publish_date, performance_metrics, strategy_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const content = [
    ['SEO入门指南', '面向初学者的SEO优化教程', '新手用户', '教程', '文章,视频', '2025-05-01', '{"views":5000,"shares":200,"comments":50}', 78],
    ['关键词分析实战', '高级关键词分析技巧分享', '进阶用户', '案例分析', '文章', '2025-05-15', '{"views":3200,"shares":150,"comments":80}', 82],
    ['内容营销策略', '内容营销全流程解析', '营销人员', '指南', '文章,电子书', '2025-06-01', '{"views":8000,"shares":300,"comments":120}', 90],
  ];
  const insertManyCs = db.transaction((items) => {
    for (const item of items) insertContent.run(...item);
  });
  insertManyCs(content);

  const insertHistory = db.prepare(`
    INSERT INTO data_history (keyword, search_volume, click_through_rate, ranking, performance_trend, date_range, keyword_impact_score, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const history = [
    ['SEO优化', 10000, 3.5, 5, '上升', '2025-Q2', 82, 'Q2表现良好'],
    ['关键词分析工具', 7200, 4.2, 8, '稳定', '2025-Q2', 75, '表现稳定'],
    ['网站排名优化', 13000, 2.8, 3, '下降', '2025-Q2', 68, '排名有所下降'],
    ['内容营销策略', 5500, 5.1, 12, '上升', '2025-Q2', 71, '新晋热门关键词'],
  ];
  const insertManyH = db.transaction((items) => {
    for (const item of items) insertHistory.run(...item);
  });
  insertManyH(history);

  const insertRoles = db.prepare(`
    INSERT INTO roles (role_name, role_description, user_list, status)
    VALUES (?, ?, ?, ?)
  `);

  const roles = [
    ['超级管理员', '拥有系统全部权限', 'admin', 'active'],
    ['编辑员', '可编辑关键词和建议内容', 'editor,analyst', 'active'],
    ['分析员', '可查看和分析数据', 'analyst', 'active'],
    ['访客', '仅可查看数据', '', 'inactive'],
  ];
  const insertManyR = db.transaction((items) => {
    for (const item of items) insertRoles.run(...item);
  });
  insertManyR(roles);

  console.log('Seed data inserted successfully.');
}

module.exports = { seedDatabase };
