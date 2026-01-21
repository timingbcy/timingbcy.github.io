// SiliconFlow API 代理
// 这个文件在构建时会被处理，避免浏览器直接调用 SiliconFlow API 导致的 CORS 问题

module.exports = async (req, res) => {
  try {
    console.log('[AI Proxy] 收到请求，URL:', req.url);
    console.log('[AI Proxy] 请求方法:', req.method);
    console.log('[AI Proxy] 请求体:', req.body);

    // 从请求体获取 prompt
    const { prompt } = req.body;
    
    if (!prompt) {
      console.error('[AI Proxy] 错误: Missing prompt');
      return res.status(400).json({ error: 'Missing prompt' });
    }

    console.log('[AI Proxy] 正在调用 SiliconFlow API，prompt:', prompt.substring(0, 50) + '...');

    // 调用 SiliconFlow API
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sk-xrmpgnilmazuarlgeyxiqypnnbnhcfwtnhncryzjuogrrsza',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "deepseek-ai/DeepSeek-V3.2-Exp",
        messages: [{ 
          role: "user", 
          content: prompt 
        }],
        stream: false,
        max_tokens: 4096,
        temperature: 0.7,
        top_p: 0.7
      })
    });

    console.log('[AI Proxy] SiliconFlow API 响应状态:', response.status);
    console.log('[AI Proxy] SiliconFlow API 响应头:', response.headers.raw());

    const data = await response.json();
    console.log('[AI Proxy] SiliconFlow API 返回数据:', JSON.stringify(data, null, 2));
    
    if (data.error) {
      console.error('[AI Proxy] API 返回错误:', data.error);
      return res.status(500).json({ error: data.error.message });
    }

    // 返回结果
    res.json(data);
    console.log('[AI Proxy] 成功返回结果给客户端');
    
  } catch (error) {
    console.error('[AI Proxy] 捕获异常:', error);
    res.status(500).json({ error: error.message });
  }
};
