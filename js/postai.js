if (!window.hasOwnProperty("aiExecuted")) {
    console.log(`%cPost-Summary-AI 文章摘要AI生成工具:%chttps://github.com/qxchuckle/Post-Summary-AI%c`, "border:1px #888 solid;border-right:0;border-radius:5px 0 0 5px;padding: 5px 10px;color:white;background:#4976f5;margin:10px 0", "border:1px #888 solid;border-left:0;border-radius:0 5px 5px 0;padding: 5px 10px;", "");
    window.aiExecuted = "chuckle";
}

function ChucklePostAI(AI_option) {
    MAIN(AI_option);

    if (AI_option.pjax) {
        document.addEventListener('pjax:complete', () => {
            setTimeout(() => {
                MAIN(AI_option);
            }, 0);
        });
    }

    function MAIN(AI_option) {
        // 如果有则删除
        const box = document.querySelector(".post-ai");
        if (box) {
            box.parentElement.removeChild(box);
        }

        const currentURL = window.location.href;

        // 排除页面检查
        if (AI_option.eliminate && AI_option.eliminate.length && AI_option.eliminate.some(item => currentURL.includes(item))) {
            console.log("Post-Summary-AI 已排除当前页面(黑名单)");
            return;
        }
        if (AI_option.whitelist && AI_option.whitelist.length && !AI_option.whitelist.some(item => currentURL.includes(item))) {
            console.log("Post-Summary-AI 已排除当前页面(白名单)");
            return;
        }

        // 获取挂载元素
        let targetElement = "";
        if (!AI_option.auto_mount && AI_option.el) {
            targetElement = document.querySelector(AI_option.el ? AI_option.el : '#post #article-container');
        } else {
            targetElement = getArticleElements();
        }

        // 获取文章标题
        const post_title = document.querySelector(AI_option.title_el) ? document.querySelector(AI_option.title_el).textContent : document.title;

        if (!targetElement) {
            return;
        };

        const interface = {
            name: "timing-AI",
            introduce: "我是文章辅助AI: timing-AI，其实就是个免费的deepseek接口，有什么可以帮到您？😊",
            version: "SiliconFlow",
            button: ["介绍自己😎", "来点灵感💡", "生成AI简介🤖"],
            ...AI_option.interface
        }

        insertCSS(); // 插入css

        // 插入html结构
        const post_ai_box = document.createElement('div');
        post_ai_box.className = 'post-ai';
        post_ai_box.setAttribute('id', 'post-ai');
        targetElement.insertBefore(post_ai_box, targetElement.firstChild);

        post_ai_box.innerHTML = `<div class="ai-title">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="21px" height="21px" viewBox="0 0 48 48">
        <g id="&#x673A;&#x5668;&#x4EBA;" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M34.717885,5.03561087 C36.12744,5.27055371 37.079755,6.60373651 36.84481,8.0132786 L35.7944,14.3153359 L38.375,14.3153359 C43.138415,14.3153359 47,18.1768855 47,22.9402569 L47,34.4401516 C47,39.203523 43.138415,43.0650727 38.375,43.0650727 L9.625,43.0650727 C4.861585,43.0650727 1,39.203523 1,34.4401516 L1,22.9402569 C1,18.1768855 4.861585,14.3153359 9.625,14.3153359 L12.2056,14.3153359 L11.15519,8.0132786 C10.920245,6.60373651 11.87256,5.27055371 13.282115,5.03561087 C14.69167,4.80066802 16.024865,5.7529743 16.25981,7.16251639 L17.40981,14.0624532 C17.423955,14.1470924 17.43373,14.2315017 17.43948,14.3153359 L30.56052,14.3153359 C30.56627,14.2313867 30.576045,14.1470924 30.59019,14.0624532 L31.74019,7.16251639 C31.975135,5.7529743 33.30833,4.80066802 34.717885,5.03561087 Z M38.375,19.4902885 L9.625,19.4902885 C7.719565,19.4902885 6.175,21.0348394 6.175,22.9402569 L6.175,34.4401516 C6.175,36.3455692 7.719565,37.89012 9.625,37.89012 L38.375,37.89012 C40.280435,37.89012 41.825,36.3455692 41.825,34.4401516 L41.825,22.9402569 C41.825,21.0348394 40.280435,19.4902885 38.375,19.4902885 Z M14.8575,23.802749 C16.28649,23.802749 17.445,24.9612484 17.445,26.3902253 L17.445,28.6902043 C17.445,30.1191812 16.28649,31.2776806 14.8575,31.2776806 C13.42851,31.2776806 12.27,30.1191812 12.27,28.6902043 L12.27,26.3902253 C12.27,24.9612484 13.42851,23.802749 14.8575,23.802749 Z M33.1425,23.802749 C34.57149,23.802749 35.73,24.9612484 35.73,26.3902253 L35.73,28.6902043 C35.73,30.1191812 34.57149,31.2776806 33.1425,31.2776806 C31.71351,31.2776806 30.555,30.1191812 30.555,28.6902043 L30.555,26.3902253 C30.555,24.9612484 31.71351,23.802749 33.1425,23.802749 Z" id="&#x5F62;&#x72B6;&#x7ED3;&#x5408;" fill="#444444" fill-rule="nonzero"></path></g></svg>
        <div class="ai-title-text">${interface.name}</div>
        <div class="ai-tag">${interface.version}</div>
        <div class="ai-settings-btn" title="配置自己的大模型API">⚙</div>
      </div>
      <div class="ai-settings-panel" style="display:none;">
        <div class="ai-settings-row">
          <label>API 地址</label>
          <input type="text" class="ai-setting-apiurl" placeholder="https://api.siliconflow.cn/v1/chat/completions" autocomplete="off">
        </div>
        <div class="ai-settings-row">
          <label>API Key</label>
          <input type="password" class="ai-setting-apikey" placeholder="sk-..." autocomplete="off">
        </div>
        <div class="ai-settings-row">
          <label>模型名称</label>
          <input type="text" class="ai-setting-model" placeholder="deepseek-ai/DeepSeek-V3" autocomplete="off">
        </div>
        <div class="ai-settings-tip">配置保存在浏览器本地(localStorage)，仅你本机可见。需填写支持跨域(CORS)的 API 地址。</div>
        <div class="ai-settings-actions">
          <button class="ai-settings-save">保存</button>
          <button class="ai-settings-cancel">取消</button>
        </div>
      </div>
      <div class="ai-explanation">${interface.name}初始化中...</div>
      <div class="ai-input-box">
        <input type="text" class="ai-input" placeholder="输入你想问的问题..." autocomplete="off">
        <button class="ai-send-btn">发送</button>
      </div>
      <div class="ai-btn-box">
        <div class="ai-btn-item">${interface.button[0]}</div>
        <div class="ai-btn-item">${interface.button[1]}</div>
        <div class="ai-btn-item">${interface.button[2]}</div>
      </div>`;

        // AI主体业务逻辑
        let animationRunning = true;
        let explanation = document.querySelector('.ai-explanation');
        let post_ai = document.querySelector('.post-ai');
        let ai_btn_item = document.querySelectorAll('.ai-btn-item');
        let ai_str = '';
        let ai_str_length = '';
        let delay_init = 600;
        let i = 0;
        let j = 0;
        let speed = AI_option.speed || 20;
        let character_speed = speed * 7.5;
        let sto = [];
        let elapsed = 0;
        let completeGenerate = false;
        let controller = new AbortController();
        let signal = controller.signal;

        // DeepSeek API配置
        // 从主题配置中获取API密钥，如果没有配置则使用默认值（实际使用时应配置有效密钥）
        const apiKey = window.theme && window.theme.ai_summary && window.theme.ai_summary.api_key 
          ? window.theme.ai_summary.api_key 
          : "";

        // 打字机动画
        const animate = (timestamp) => {
            if (!animationRunning) {
                return;
            }
            if (!animate.start) animate.start = timestamp;
            elapsed = timestamp - animate.start;
            if (elapsed >= speed) {
                animate.start = timestamp;
                if (i < ai_str_length - 1) {
                    let char = ai_str.charAt(i + 1);
                    let delay = /[,.，。!?！？]/.test(char) ? character_speed : speed;
                    if (explanation.firstElementChild) {
                        explanation.removeChild(explanation.firstElementChild);
                    }
                    explanation.innerHTML += char;
                    let div = document.createElement('div');
                    div.className = "ai-cursor";
                    explanation.appendChild(div);
                    i++;
                    if (delay === character_speed) {
                        document.querySelector('.ai-explanation .ai-cursor').style.opacity = "0";
                    }
                    if (i === ai_str_length - 1) {
                        observer.disconnect();
                        explanation.removeChild(explanation.firstElementChild);
                        // 动画完成后，将纯文本转换为 Markdown
                        if (window.marked) {
                            const renderedMarkdown = marked.parse(ai_str);
                            explanation.innerHTML = renderedMarkdown;
                        }
                    }
                    sto[0] = setTimeout(() => {
                        requestAnimationFrame(animate);
                    }, delay);
                }
            } else {
                requestAnimationFrame(animate);
            }
        };

        const observer = new IntersectionObserver((entries) => {
            let isVisible = entries[0].isIntersecting;
            animationRunning = isVisible;
            if (animationRunning) {
                delay_init = i === 0 ? 200 : 20;
                sto[1] = setTimeout(() => {
                    if (j) {
                        i = 0;
                        j = 0;
                    }
                    if (i === 0) {
                        explanation.innerHTML = ai_str.charAt(0);
                    }
                    requestAnimationFrame(animate);
                }, delay_init);
            }
        }, { threshold: 0 });

        function clearSTO() {
            if (sto.length) {
                sto.forEach((item) => {
                    if (item) {
                        clearTimeout(item);
                    }
                });
            }
        }

        function resetAI(df = true, str = '生成中. . .') {
            i = 0;
            j = 1;
            clearSTO();
            animationRunning = false;
            elapsed = 0;
            if (df) {
                explanation.innerHTML = str;
            } else {
                explanation.innerHTML = '请等待. . .';
            }
            if (!completeGenerate) {
                controller.abort();
            }
            ai_str = '';
            ai_str_length = '';
            observer.disconnect();
        }

        function startAI(str, df = true) {
            // 如果开启动画，先显示纯文本，动画完成后转换为 Markdown
            if (AI_option.hasOwnProperty('typewriter') && !AI_option.typewriter) {
                // 不开启动画，直接渲染 Markdown
                const renderedMarkdown = window.marked ? marked.parse(str) : str;
                explanation.innerHTML = renderedMarkdown;
            } else {
                resetAI(df);
                // 保存原始 Markdown 文本
                ai_str = str;
                ai_str_length = ai_str.length;
                // 动画完成后会转换为 Markdown
                observer.observe(post_ai);
            }
        }

        function aiIntroduce() {
            const cfg = getUserAPIConfig();
            if (!cfg) {
                startAI(`${interface.introduce}\n\n当前未配置 API，请点击右上角 ⚙ 填写你自己的大模型 API 地址、Key 和模型名称（支持 SiliconFlow / OpenAI 兼容接口）。配置保存在浏览器本地。`);
            } else {
                startAI(interface.introduce);
            }
        }

        // 新的灵感生成功能
        async function aiInspiration() {
            resetAI();
            await streamAIResponse("你是一个灵感发生器，给用户提供有意思的灵感，不要超过100字，不要分段，不要分点，不要换行");
        }

        async function aiGenerateAbstract() {
            resetAI();
            const ele = targetElement;
            const content = getTextContent(ele);
            console.log("获取到的文章内容:", content.substring(0, 200) + "...");
            const prompt = `请根据以下文章内容生成一个简洁的摘要，不要超过200字，不要换行，不要提出建议或评论，只需总结文章主要内容。文章标题和内容如下：${content}`;
            await streamAIResponse(prompt);
        }

        // 矩阵穿梭功能已移除

        // 流式 AI 响应：边接收边渲染
        async function streamAIResponse(prompt) {
            completeGenerate = false;
            controller = new AbortController();
            signal = controller.signal;

            const userConfig = getUserAPIConfig();
            if (!userConfig) {
                startAI('请先点击右上角 ⚙ 配置你自己的大模型 API（API 地址、Key、模型名称），配置保存在浏览器本地。');
                completeGenerate = true;
                return;
            }

            console.log('[AI Client] 流式请求 →', userConfig.apiUrl);

            // 重置显示区，准备流式输出
            animationRunning = false;
            clearSTO();
            observer.disconnect();
            explanation.innerHTML = '';
            let fullText = '';
            let firstChunk = true;
            let renderTimer = null;

            // 定时渲染 Markdown（避免每个 chunk 都 parse）
            function scheduleRender() {
                if (renderTimer) return;
                renderTimer = setTimeout(() => {
                    renderTimer = null;
                    if (window.marked) {
                        explanation.innerHTML = marked.parse(fullText);
                    } else {
                        explanation.textContent = fullText;
                    }
                    // 追加光标
                    const cursor = document.createElement('div');
                    cursor.className = 'ai-cursor';
                    explanation.appendChild(cursor);
                }, 80);
            }

            try {
                const response = await fetch(userConfig.apiUrl, {
                    signal: signal,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userConfig.apiKey}`
                    },
                    body: JSON.stringify({
                        model: userConfig.model,
                        messages: [{ role: "user", content: prompt }],
                        stream: true,
                        max_tokens: 4096,
                        temperature: 0.7,
                        top_p: 0.7
                    })
                });

                if (response.status === 429) {
                    startAI('请求过于频繁，请稍后再请求AI。');
                    completeGenerate = true;
                    return;
                }
                if (response.status === 401) {
                    startAI('API Key 无效，请点击 ⚙ 重新配置。');
                    completeGenerate = true;
                    return;
                }
                if (!response.ok) {
                    const errText = await response.text().catch(() => '');
                    throw new Error(`API ${response.status}: ${errText.substring(0, 200)}`);
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });

                    // SSE 格式：每条消息以 \n\n 分隔，前缀 "data: "
                    const lines = buffer.split('\n');
                    buffer = lines.pop(); // 保留最后不完整的一行

                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed || !trimmed.startsWith('data:')) continue;
                        const dataStr = trimmed.slice(5).trim();
                        if (dataStr === '[DONE]') continue;

                        try {
                            const json = JSON.parse(dataStr);
                            const delta = json.choices && json.choices[0] && json.choices[0].delta;
                            if (delta && delta.content) {
                                if (firstChunk) {
                                    explanation.innerHTML = '';
                                    firstChunk = false;
                                }
                                fullText += delta.content;
                                scheduleRender();
                            }
                        } catch (e) {
                            // JSON 解析失败，跳过（可能是不完整的 chunk）
                        }
                    }
                }

                // 处理 buffer 中剩余的数据
                if (buffer.trim().startsWith('data:')) {
                    const dataStr = buffer.trim().slice(5).trim();
                    if (dataStr && dataStr !== '[DONE]') {
                        try {
                            const json = JSON.parse(dataStr);
                            const delta = json.choices && json.choices[0] && json.choices[0].delta;
                            if (delta && delta.content) {
                                fullText += delta.content;
                            }
                        } catch (e) { /* ignore */ }
                    }
                }

                // 最终渲染（取消定时器，直接渲染）
                if (renderTimer) {
                    clearTimeout(renderTimer);
                    renderTimer = null;
                }
                if (fullText) {
                    ai_str = fullText;
                    if (window.marked) {
                        explanation.innerHTML = marked.parse(fullText);
                    } else {
                        explanation.textContent = fullText;
                    }
                } else {
                    explanation.innerHTML = 'AI 未返回内容，请重试。';
                }

                completeGenerate = true;
                console.log('[AI Client] 流式完成，共', fullText.length, '字');

            } catch (error) {
                if (renderTimer) {
                    clearTimeout(renderTimer);
                    renderTimer = null;
                }
                if (error.name === "AbortError") {
                    console.log('[AI Client] 请求被中止');
                    if (fullText) {
                        if (window.marked) {
                            explanation.innerHTML = marked.parse(fullText);
                        } else {
                            explanation.textContent = fullText;
                        }
                    }
                } else {
                    console.error('[AI Client] 捕获异常:', error);
                    if (fullText) {
                        // 已有部分内容，追加错误提示
                        const errDiv = document.createElement('div');
                        errDiv.style.cssText = 'color:#e74c3c;font-size:12px;margin-top:4px;';
                        errDiv.textContent = `\n\n[请求中断: ${error.message}]`;
                        explanation.appendChild(errDiv);
                    } else {
                        startAI(`${interface.name}请求AI出错了：${error.message}。请点击 ⚙ 检查API配置。`);
                    }
                }
                completeGenerate = true;
            }
        }

        // ── 用户 API 配置管理 ──
        const API_CONFIG_KEY = 'post_ai_api_config';

        function getUserAPIConfig() {
            try {
                const raw = localStorage.getItem(API_CONFIG_KEY);
                if (!raw) return null;
                const cfg = JSON.parse(raw);
                if (!cfg.apiUrl || !cfg.apiKey || !cfg.model) return null;
                return cfg;
            } catch (e) {
                return null;
            }
        }

        function saveUserAPIConfig(apiUrl, apiKey, model) {
            localStorage.setItem(API_CONFIG_KEY, JSON.stringify({ apiUrl, apiKey, model }));
        }

        function bindSettingsEvents() {
            const settingsBtn = document.querySelector('.ai-settings-btn');
            const panel = document.querySelector('.ai-settings-panel');
            const saveBtn = document.querySelector('.ai-settings-save');
            const cancelBtn = document.querySelector('.ai-settings-cancel');
            const urlInput = document.querySelector('.ai-setting-apiurl');
            const keyInput = document.querySelector('.ai-setting-apikey');
            const modelInput = document.querySelector('.ai-setting-model');

            if (!settingsBtn) return;

            // 打开/关闭面板时回填已保存的配置
            settingsBtn.addEventListener('click', () => {
                const visible = panel.style.display !== 'none';
                panel.style.display = visible ? 'none' : 'block';
                if (!visible) {
                    const cfg = getUserAPIConfig();
                    if (cfg) {
                        urlInput.value = cfg.apiUrl || '';
                        keyInput.value = cfg.apiKey || '';
                        modelInput.value = cfg.model || '';
                    }
                }
            });

            saveBtn.addEventListener('click', () => {
                const apiUrl = urlInput.value.trim();
                const apiKey = keyInput.value.trim();
                const model = modelInput.value.trim();
                if (!apiUrl || !apiKey || !model) {
                    alert('请填写完整：API 地址、API Key、模型名称');
                    return;
                }
                saveUserAPIConfig(apiUrl, apiKey, model);
                panel.style.display = 'none';
                // 更新版本标签显示当前模型
                const tag = document.querySelector('.ai-tag');
                if (tag) tag.textContent = model.split('/').pop().substring(0, 20);
                startAI('API 配置已保存！现在可以正常使用 AI 功能了。😊');
            });

            cancelBtn.addEventListener('click', () => {
                panel.style.display = 'none';
            });
        }

        // 获取文章内容
        function getTextContent(element) {
            const totalLength = AI_option.total_length || 3000; // 增加默认长度限制
            // 获取完整的文章内容，不再截取
            const content = `文章标题：${post_title}。文章内容：${getText(element)}`;
            return content;
        }

        // 提取纯文本
        function getText(element) {
            // 添加调试日志
            console.log("开始提取文章内容，元素:", element);

            const excludeClasses = AI_option.exclude ? AI_option.exclude : ['highlight', 'Copyright-Notice', 'post-ai', 'post-series'];
            if (!excludeClasses.includes('post-ai')) { excludeClasses.push('post-ai'); }
            const excludeTags = ['script', 'style', 'iframe', 'embed', 'video', 'audio', 'img', 'svg'];

            let textContent = '';

            // 尝试使用innerText作为备选方案，它比递归遍历更可靠
            if (element.innerText) {
                textContent = element.innerText;
                console.log("使用innerText获取的内容长度:", textContent.length);
            } else {
                // 原有递归方法作为备选
                for (let node of element.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        textContent += node.textContent.trim();
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        let hasExcludeClass = false;
                        for (let className of node.classList) {
                            if (excludeClasses.includes(className)) {
                                hasExcludeClass = true;
                                break;
                            }
                        }
                        let hasExcludeTag = excludeTags.includes(node.tagName.toLowerCase());
                        if (!hasExcludeClass && !hasExcludeTag) {
                            let innerTextContent = getText(node);
                            textContent += innerTextContent;
                        }
                    }
                }
                console.log("使用递归方法获取的内容长度:", textContent.length);
            }

            // 清理文本内容
            textContent = textContent.replace(/\s+/g, ' ').trim();

            // 如果内容太短，可能是提取失败，尝试使用更通用的选择器
            if (textContent.length < 100) {
                console.log("提取的内容可能不完整，尝试使用备选方法");
                const commonSelectors = ['.post-content', '.entry-content', '.content', 'article', '#article-container', '.article-content', '.post-body'];
                for (let selector of commonSelectors) {
                    const fallbackElement = document.querySelector(selector);
                    if (fallbackElement && fallbackElement !== element) {
                        console.log("尝试使用备选选择器:", selector);
                        const fallbackContent = fallbackElement.innerText || getText(fallbackElement);
                        if (fallbackContent.length > textContent.length) {
                            textContent = fallbackContent;
                            console.log("使用备选选择器获取到更长的内容");
                            break;
                        }
                    }
                }
            }

            console.log("最终提取的内容长度:", textContent.length);
            return textContent;
        }

        // 按比例切割字符串
        function extractString(str, totalLength = 1000) {
            totalLength = Math.min(totalLength, 5000);
            if (str.length <= totalLength) { return str; }

            const firstPart = str.substring(0, Math.floor(totalLength * 0.5));
            const lastPart = str.substring(str.length - Math.floor(totalLength * 0.5));
            return firstPart + lastPart;
        }

        // 自动获取文章内容容器
        function getArticleElements() {
            // 扩展选择器列表，增加更多可能的选择器
            const selectors = [
                'article', 
                '.post-content', 
                '.entry-content', 
                '.content', 
                '#article-container',
                '.article-content',
                '.post-body',
                '.post-entry',
                '.main-content',
                '.article',
                '.post',
                '.blog-post',
                '.post-text',
                '.article-body'
            ];

            // 添加调试日志
            console.log("尝试查找文章内容容器...");

            for (let selector of selectors) {
                const element = document.querySelector(selector);
                if (element) {
                    console.log("找到文章内容容器:", selector);
                    // 检查元素是否有足够的内容
                    const textLength = element.innerText ? element.innerText.length : 0;
                    console.log("元素内容长度:", textLength);

                    // 如果内容太少，继续寻找
                    if (textLength > 100) {
                        return element;
                    }
                }
            }

            // 如果没有找到合适的选择器，尝试查找包含最大文本量的元素
            console.log("未找到合适的文章内容容器，尝试查找包含最多文本的元素...");
            const allElements = document.querySelectorAll('div, section, main, article');
            let maxTextElement = null;
            let maxTextLength = 0;

            for (let element of allElements) {
                // 排除导航、页脚等元素
                const classList = element.className || '';
                const id = element.id || '';
                if (classList.includes('nav') || classList.includes('menu') || 
                    classList.includes('sidebar') || classList.includes('footer') ||
                    classList.includes('header') || classList.includes('comment') ||
                    id.includes('nav') || id.includes('menu') || 
                    id.includes('sidebar') || id.includes('footer') ||
                    id.includes('header') || id.includes('comment')) {
                    continue;
                }

                const textLength = element.innerText ? element.innerText.length : 0;
                if (textLength > maxTextLength && textLength > 200) {
                    maxTextLength = textLength;
                    maxTextElement = element;
                }
            }

            if (maxTextElement) {
                console.log("找到包含最多文本的元素，内容长度:", maxTextLength);
                return maxTextElement;
            }

            console.log("未找到合适的文章内容容器，使用document.body");
            return document.body;
        }

        // 插入CSS
        function insertCSS() {
            const styleId = 'qx-ai-style';
            if (document.getElementById(styleId)) { return; }
            const styleElement = document.createElement('style');
            styleElement.id = styleId;
            styleElement.textContent = AI_option.css || `:root{--ai-font-color:#353535;--ai-post-bg:#f1f3f8;--ai-content-bg:#fff;--ai-content-border:1px solid #e3e8f7;--ai-border:1px solid #e3e8f7bd;--ai-tag-bg:rgba(48,52,63,0.80);--ai-cursor:#333;--ai-btn-bg:rgba(48,52,63,0.75);--ai-title-color:#4c4948;--ai-btn-color:#fff;--ai-input-bg:#fff;--ai-input-border:#e3e8f7;--ai-input-placeholder:#999;}[data-theme=dark],.theme-dark,body.dark,body.dark-theme{--ai-font-color:rgba(255,255,255,0.9);--ai-post-bg:#30343f;--ai-content-bg:#1d1e22;--ai-content-border:1px solid #42444a;--ai-border:1px solid #3d3d3f;--ai-tag-bg:#1d1e22;--ai-cursor:rgb(255,255,255,0.9);--ai-btn-bg:#1d1e22;--ai-title-color:rgba(255,255,255,0.86);--ai-btn-color:rgb(255,255,255,0.9);--ai-input-bg:#2a2d35;--ai-input-border:#42444a;--ai-input-placeholder:rgba(255,255,255,0.5);}[data-theme=dark] #post-ai .ai-explanation code,.theme-dark #post-ai .ai-explanation code,body.dark #post-ai .ai-explanation code,body.dark-theme #post-ai .ai-explanation code{background:rgba(255,255,255,0.15);}[data-theme=dark] #post-ai .ai-explanation pre,.theme-dark #post-ai .ai-explanation pre,body.dark #post-ai .ai-explanation pre,body.dark-theme #post-ai .ai-explanation pre{background:rgba(255,255,255,0.1);}[data-theme=dark] #post-ai .ai-explanation blockquote,.theme-dark #post-ai .ai-explanation blockquote,body.dark #post-ai .ai-explanation blockquote,body.dark-theme #post-ai .ai-explanation blockquote{color:rgba(255,255,255,0.6);}[data-theme=dark] #post-ai .ai-explanation th,.theme-dark #post-ai .ai-explanation th,body.dark #post-ai .ai-explanation th,body.dark-theme #post-ai .ai-explanation th{background:rgba(255,255,255,0.1);}#post-ai.post-ai{background:var(--ai-post-bg);border-radius:12px;padding:10px 12px 11px;line-height:1.3;border:var(--ai-border);margin-top:10px;margin-bottom:6px;transition:all 0.3s;}#post-ai .ai-title{display:flex;color:var(--ai-title-color);border-radius:8px;align-items:center;padding:0 6px;position:relative;}#post-ai .ai-title-text{font-weight:bold;margin-left:8px;font-size:17px;}#post-ai .ai-tag{font-size:12px;background-color:var(--ai-tag-bg);color:var(--ai-btn-color);border-radius:4px;margin-left:auto;line-height:1;padding:4px 5px;border:var(--ai-border);}#post-ai .ai-explanation{margin-top:10px;padding:8px 12px;background:var(--ai-content-bg);border-radius:8px;border:var(--ai-content-border);font-size:16px;line-height:1.6;color:var(--ai-font-color);}#post-ai .ai-explanation h1{font-size:1.5em;margin:0.5em 0;border-bottom:1px solid var(--ai-border);padding-bottom:0.3em;}#post-ai .ai-explanation h2{font-size:1.3em;margin:0.5em 0;border-bottom:1px solid var(--ai-border);padding-bottom:0.3em;}#post-ai .ai-explanation h3{font-size:1.15em;margin:0.5em 0;}#post-ai .ai-explanation h4{font-size:1.05em;margin:0.5em 0;}#post-ai .ai-explanation p{margin:0.5em 0;}#post-ai .ai-explanation ul,#post-ai .ai-explanation ol{margin:0.5em 0;padding-left:1.5em;}#post-ai .ai-explanation li{margin:0.25em 0;}#post-ai .ai-explanation code{background:rgba(0,0,0,0.1);padding:0.2em 0.4em;border-radius:3px;font-family:'Courier New',monospace;font-size:0.9em;}#post-ai .ai-explanation pre{background:rgba(0,0,0,0.1);padding:0.8em;border-radius:6px;overflow-x:auto;margin:0.5em 0;}#post-ai .ai-explanation pre code{background:none;padding:0;}#post-ai .ai-explanation blockquote{border-left:4px solid #49b0f5;margin:0.5em 0;padding-left:0.8em;color:rgba(0,0,0,0.6);}#post-ai .ai-explanation a{color:#49b0f5;text-decoration:none;}#post-ai .ai-explanation a:hover{text-decoration:underline;}#post-ai .ai-explanation hr{border:none;border-top:1px solid var(--ai-border);margin:0.8em 0;}#post-ai .ai-explanation table{border-collapse:collapse;width:100%;margin:0.5em 0;}#post-ai .ai-explanation th,#post-ai .ai-explanation td{border:1px solid var(--ai-border);padding:0.5em;text-align:left;}#post-ai .ai-explanation th{background:rgba(0,0,0,0.05);}#post-ai .ai-cursor{display:inline-block;width:7px;background:var(--ai-cursor);height:16px;margin-bottom:-2px;opacity:0.95;margin-left:3px;transition:all 0.3s;}#post-ai .ai-input-box{margin-top:10px;display:flex;gap:8px;}#post-ai .ai-input{flex:1;padding:8px 12px;border:1px solid var(--ai-input-border);border-radius:6px;background:var(--ai-input-bg);color:var(--ai-font-color);font-size:14px;outline:none;transition:all 0.3s;}#post-ai .ai-input:focus{border-color:#49b0f5;}#post-ai .ai-input::placeholder{color:var(--ai-input-placeholder);}#post-ai .ai-send-btn{padding:8px 16px;background:var(--ai-btn-bg);color:var(--ai-btn-color);border:var(--ai-border);border-radius:6px;cursor:pointer;font-size:14px;transition:all 0.3s;user-select:none;}#post-ai .ai-send-btn:hover{background:#49b0f5dc;}#post-ai .ai-send-btn:disabled{opacity:0.5;cursor:not-allowed;}#post-ai .ai-btn-box{font-size:15.5px;width:100%;display:flex;flex-direction:row;flex-wrap:wrap;}#post-ai .ai-btn-item{padding:5px 10px;margin:10px 16px 0px 5px;width:fit-content;line-height:1;background:var(--ai-btn-bg);border:var(--ai-border);color:var(--ai-btn-color);border-radius:6px 6px 6px 0;user-select:none;transition:all 0.3s;cursor:pointer;}#post-ai .ai-btn-item:hover{background:#49b0f5dc;}@media screen and (max-width:768px){#post-ai .ai-btn-box{justify-content:center;}}#post-ai .ai-title>svg{width:21px;height:fit-content;}#post-ai .ai-title>svg path{fill:var(--ai-font-color);}`;
            AI_option.additional_css && (styleElement.textContent += AI_option.additional_css);
            // 设置面板样式
            styleElement.textContent += `#post-ai .ai-settings-btn{margin-left:auto;cursor:pointer;font-size:16px;line-height:21px;opacity:0.6;transition:opacity 0.2s;user-select:none;}#post-ai .ai-settings-btn:hover{opacity:1;}#post-ai .ai-settings-panel{margin:8px 0;padding:10px;border-radius:8px;background:var(--ai-content-bg);border:var(--ai-content-border);}#post-ai .ai-settings-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;}#post-ai .ai-settings-row label{flex-shrink:0;width:70px;font-size:12px;color:var(--ai-font-color);}#post-ai .ai-settings-row input{flex:1;padding:5px 8px;border:1px solid var(--ai-input-border);border-radius:6px;background:var(--ai-input-bg);color:var(--ai-font-color);font-size:12px;outline:none;}#post-ai .ai-settings-row input:focus{border-color:#4976f5;}#post-ai .ai-settings-tip{font-size:11px;color:var(--ai-input-placeholder);margin-bottom:8px;line-height:1.4;}#post-ai .ai-settings-actions{display:flex;gap:8px;justify-content:flex-end;}#post-ai .ai-settings-save,#post-ai .ai-settings-cancel{padding:4px 14px;border:none;border-radius:6px;font-size:12px;cursor:pointer;color:var(--ai-btn-color);}#post-ai .ai-settings-save{background:var(--ai-btn-bg);}#post-ai .ai-settings-cancel{background:#999;}`;
            document.head.appendChild(styleElement);
        }

        // AI初始化，绑定按钮事件
        async function ai_init() {
            explanation = document.querySelector('.ai-explanation');
            post_ai = document.querySelector('.post-ai');
            ai_btn_item = document.querySelectorAll('.ai-btn-item');

            // 绑定设置面板事件
            bindSettingsEvents();

            // 如果已有配置，更新版本标签显示当前模型
            const cfg = getUserAPIConfig();
            if (cfg) {
                const tag = document.querySelector('.ai-tag');
                if (tag) tag.textContent = cfg.model.split('/').pop().substring(0, 20);
            }

            // 绑定输入框和发送按钮
            const aiInput = document.querySelector('.ai-input');
            const aiSendBtn = document.querySelector('.ai-send-btn');

            // 获取文章内容
            function getArticleContent() {
                // 尝试获取文章标题
                const title = document.querySelector('h1, .post-title, .article-title')?.textContent || document.title;

                // 尝试获取文章正文
                let content = '';

                // 查找文章内容容器
                const contentSelectors = [
                    '.post-content',
                    '.article-content',
                    '.entry-content',
                    'article',
                    '.markdown-body'
                ];

                for (const selector of contentSelectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        content = element.innerText || element.textContent;
                        break;
                    }
                }

                // 如果没找到，获取整个 body 的文本（排除脚本和样式）
                if (!content) {
                    const bodyClone = document.body.cloneNode(true);
                    // 移除不需要的元素
                    const elementsToRemove = bodyClone.querySelectorAll('script, style, nav, header, footer, .sidebar, .post-ai');
                    elementsToRemove.forEach(el => el.remove());
                    content = bodyClone.innerText || bodyClone.textContent;
                }

                // 清理内容（移除多余空白）
                content = content.replace(/\s+/g, ' ').trim();

                // 限制内容长度（避免 token 过多）
                const maxLength = 3000;
                if (content.length > maxLength) {
                    content = content.substring(0, maxLength) + '...(内容已截断)';
                }

                return { title, content };
            }

            // 发送消息函数（基于网页内容）
            async function sendUserMessage() {
                const userMessage = aiInput.value.trim();
                if (!userMessage) return;

                // 禁用输入和按钮
                aiInput.disabled = true;
                aiSendBtn.disabled = true;

                // 获取网页内容
                const { title, content } = getArticleContent();

                // 构造带上下文的 prompt
                const contextPrompt = `你是一个文章助手，请基于以下文章内容回答用户的问题。

文章标题：${title}

文章内容：
${content}

用户问题：${userMessage}

请基于文章内容回答，如果文章中没有相关信息，请说明。`;

                // 调用 AI（流式）
                await streamAIResponse(contextPrompt);

                // 恢复输入和按钮
                aiInput.disabled = false;
                aiSendBtn.disabled = false;
                aiInput.value = '';
                aiInput.focus();
            }

            // 发送按钮点击事件
            aiSendBtn.addEventListener('click', sendUserMessage);

            // 输入框回车事件
            aiInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendUserMessage();
                }
            });

            const funArr = [aiIntroduce, aiInspiration, aiGenerateAbstract];

            ai_btn_item.forEach((item, index) => {
                item.addEventListener('click', () => {
                    funArr[index]();
                });
            });

            if (AI_option.summary_directly) {
                aiGenerateAbstract();
            } else {
                aiIntroduce();
            }
        }

        ai_init();
    }
}

// 兼容旧版本配置项
if (typeof ai_option !== "undefined") {
    console.log("正在使用旧版本配置方式，请前往项目仓库查看最新配置写法");
    new ChucklePostAI(ai_option);
}