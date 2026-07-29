/*
 * TTS 文本朗读功能
 * 支持全文朗读和段落朗读
 */

(function() {
  'use strict';

  // 检查浏览器是否支持语音合成
  const SpeechSynthesis = window.speechSynthesis;
  if (!SpeechSynthesis) {
    console.warn('当前浏览器不支持语音合成功能');
    return;
  }

  // 朗读器状态
  let synthesis = SpeechSynthesis;
  let currentUtterance = null;
  let isReading = false;
  let isPaused = false;
  let currentParagraphIndex = -1;
  let paragraphs = [];

  // 创建朗读控制面板
  function createTTSControlPanel() {
    const panel = document.createElement('div');
    panel.id = 'tts-control-panel';
    panel.className = 'tts-control-panel';
    panel.innerHTML = `
      <div class="tts-panel-header">
        <span class="tts-panel-title">语音朗读</span>
        <button class="tts-panel-close" title="关闭">×</button>
      </div>
      <div class="tts-panel-content">
        <div class="tts-controls">
          <button id="tts-play-all" class="tts-btn tts-play-btn" title="朗读全文">
            <i class="fas fa-play"></i>
            <span>朗读全文</span>
          </button>
          <button id="tts-pause" class="tts-btn tts-pause-btn" title="暂停" disabled>
            <i class="fas fa-pause"></i>
            <span>暂停</span>
          </button>
          <button id="tts-stop" class="tts-btn tts-stop-btn" title="停止" disabled>
            <i class="fas fa-stop"></i>
            <span>停止</span>
          </button>
        </div>
        <div class="tts-settings">
          <label class="tts-setting-item">
            <span>语速：</span>
            <input type="range" id="tts-rate" min="0.5" max="2" step="0.1" value="1">
            <span id="tts-rate-value">1.0x</span>
          </label>
          <label class="tts-setting-item">
            <span>音调：</span>
            <input type="range" id="tts-pitch" min="0.5" max="2" step="0.1" value="1">
            <span id="tts-pitch-value">1.0</span>
          </label>
          <label class="tts-setting-item">
            <span>音量：</span>
            <input type="range" id="tts-volume" min="0" max="1" step="0.1" value="1">
            <span id="tts-volume-value">100%</span>
          </label>
        </div>
        <div class="tts-progress">
          <div class="tts-progress-bar">
            <div id="tts-progress-current" class="tts-progress-current"></div>
          </div>
          <div class="tts-progress-text">
            <span id="tts-current-paragraph">0/0</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    return panel;
  }

  // 创建侧边栏朗读按钮
  function createToCTTSButton() {
    const tocContainer = document.querySelector('.toc-container');
    if (!tocContainer) return;

    const button = document.createElement('button');
    button.id = 'toc-tts-toggle';
    button.className = 'toc-tts-toggle';
    button.innerHTML = '<i class="fas fa-volume-up"></i> 朗读';
    button.title = '打开朗读控制面板';

    tocContainer.appendChild(button);

    button.addEventListener('click', function() {
      const panel = document.getElementById('tts-control-panel');
      if (panel) {
        panel.classList.toggle('active');
      }
    });
  }

  // 创建固定的朗读按钮（右下角）
  function createFixedTTSButton() {
    const button = document.createElement('button');
    button.id = 'fixed-tts-toggle';
    button.className = 'fixed-tts-toggle';
    button.innerHTML = '<i class="fas fa-volume-up"></i>';
    button.title = '打开朗读控制面板';
    button.setAttribute('aria-label', '朗读');

    document.body.appendChild(button);

    button.addEventListener('click', function() {
      const panel = document.getElementById('tts-control-panel');
      if (panel) {
        panel.classList.toggle('active');
      }
    });
  }

  // 为段落添加朗读按钮
  function addParagraphTTSButtons() {
    const postContent = document.querySelector('.post-content');
    if (!postContent) return;

    // 获取所有段落（排除代码块）
    paragraphs = postContent.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');

    paragraphs.forEach((paragraph, index) => {
      // 跳过空段落
      const text = paragraph.textContent.trim();
      if (!text) return;

      // 创建段落朗读按钮容器
      const buttonContainer = document.createElement('span');
      buttonContainer.className = 'paragraph-tts-btn';
      buttonContainer.setAttribute('data-paragraph-index', index);
      buttonContainer.innerHTML = '<i class="fas fa-volume-up"></i>';

      // 将按钮添加到段落前面
      paragraph.insertBefore(buttonContainer, paragraph.firstChild);

      // 鼠标点击按钮朗读该段落
      buttonContainer.addEventListener('click', function(e) {
        e.stopPropagation();
        readParagraph(index);
      });
    });
  }

  // 朗读单个段落
  function readParagraph(index) {
    if (index < 0 || index >= paragraphs.length) return;

    stopReading();

    const paragraph = paragraphs[index];
    const text = paragraph.textContent.trim();

    if (!text) return;

    startReading(text, index);
  }

  // 开始朗读
  function startReading(text, startIndex = 0) {
    stopReading();

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.rate = parseFloat(document.getElementById('tts-rate').value);
    currentUtterance.pitch = parseFloat(document.getElementById('tts-pitch').value);
    currentUtterance.volume = parseFloat(document.getElementById('tts-volume').value);
    currentUtterance.lang = 'zh-CN';

    // 事件监听
    currentUtterance.onstart = function() {
      isReading = true;
      isPaused = false;
      updateButtons();
    };

    currentUtterance.onend = function() {
      isReading = false;
      isPaused = false;
      updateButtons();
    };

    currentUtterance.onpause = function() {
      isPaused = true;
      updateButtons();
    };

    currentUtterance.onresume = function() {
      isPaused = false;
      updateButtons();
    };

    synthesis.speak(currentUtterance);
  }

  // 朗读全文
  function readFullText() {
    const postContent = document.querySelector('.post-content');
    if (!postContent) return;

    stopReading();

    // 获取所有文本内容
    const text = postContent.textContent.trim();
    if (!text) {
      alert('没有可朗读的内容');
      return;
    }

    currentParagraphIndex = 0;
    startReading(text, 0);
  }

  // 暂停朗读
  function pauseReading() {
    if (isReading && !isPaused) {
      synthesis.pause();
    }
  }

  // 继续朗读
  function resumeReading() {
    if (isReading && isPaused) {
      synthesis.resume();
    }
  }

  // 停止朗读
  function stopReading() {
    if (synthesis.speaking || synthesis.paused) {
      synthesis.cancel();
    }
    isReading = false;
    isPaused = false;
    currentUtterance = null;
    updateButtons();
  }

  // 更新按钮状态
  function updateButtons() {
    const playBtn = document.getElementById('tts-play-all');
    const pauseBtn = document.getElementById('tts-pause');
    const stopBtn = document.getElementById('tts-stop');

    if (!playBtn || !pauseBtn || !stopBtn) return;

    if (isReading) {
      playBtn.disabled = true;
      pauseBtn.disabled = false;
      stopBtn.disabled = false;

      if (isPaused) {
        pauseBtn.innerHTML = '<i class="fas fa-play"></i><span>继续</span>';
      } else {
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i><span>暂停</span>';
      }
    } else {
      playBtn.disabled = false;
      pauseBtn.disabled = true;
      stopBtn.disabled = true;
      pauseBtn.innerHTML = '<i class="fas fa-pause"></i><span>暂停</span>';
    }
  }

  // 初始化事件监听
  function initEventListeners() {
    // 朗读全文按钮
    const playBtn = document.getElementById('tts-play-all');
    if (playBtn) {
      playBtn.addEventListener('click', readFullText);
    }

    // 暂停/继续按钮
    const pauseBtn = document.getElementById('tts-pause');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', function() {
        if (isPaused) {
          resumeReading();
        } else {
          pauseReading();
        }
      });
    }

    // 停止按钮
    const stopBtn = document.getElementById('tts-stop');
    if (stopBtn) {
      stopBtn.addEventListener('click', stopReading);
    }

    // 关闭按钮
    const closeBtn = document.querySelector('.tts-panel-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        const panel = document.getElementById('tts-control-panel');
        if (panel) {
          panel.classList.remove('active');
        }
      });
    }

    // 语速调节
    const rateInput = document.getElementById('tts-rate');
    const rateValue = document.getElementById('tts-rate-value');
    if (rateInput && rateValue) {
      rateInput.addEventListener('input', function() {
        rateValue.textContent = parseFloat(this.value).toFixed(1) + 'x';
        if (currentUtterance) {
          currentUtterance.rate = parseFloat(this.value);
        }
      });
    }

    // 音调调节
    const pitchInput = document.getElementById('tts-pitch');
    const pitchValue = document.getElementById('tts-pitch-value');
    if (pitchInput && pitchValue) {
      pitchInput.addEventListener('input', function() {
        pitchValue.textContent = parseFloat(this.value).toFixed(1);
        if (currentUtterance) {
          currentUtterance.pitch = parseFloat(this.value);
        }
      });
    }

    // 音量调节
    const volumeInput = document.getElementById('tts-volume');
    const volumeValue = document.getElementById('tts-volume-value');
    if (volumeInput && volumeValue) {
      volumeInput.addEventListener('input', function() {
        volumeValue.textContent = Math.round(parseFloat(this.value) * 100) + '%';
        if (currentUtterance) {
          currentUtterance.volume = parseFloat(this.value);
        }
      });
    }

    // 点击面板外部关闭
    document.addEventListener('click', function(e) {
      const panel = document.getElementById('tts-control-panel');
      const tocBtn = document.getElementById('toc-tts-toggle');
      const fixedBtn = document.getElementById('fixed-tts-toggle');

      if (panel) {
        const clickedOnButton = (tocBtn && tocBtn.contains(e.target)) ||
                               (fixedBtn && fixedBtn.contains(e.target));
        if (!panel.contains(e.target) && !clickedOnButton) {
          panel.classList.remove('active');
        }
      }
    });
  }

  // 初始化TTS功能
  function initTTS() {
    // 只在文章页面初始化
    const postContent = document.querySelector('.post-content');
    if (!postContent) return;

    // 创建控制面板
    createTTSControlPanel();

    // 创建侧边栏按钮
    createToCTTSButton();

    // 创建固定的朗读按钮
    createFixedTTSButton();

    // 为段落添加朗读按钮
    addParagraphTTSButtons();

    // 初始化事件监听
    initEventListeners();
  }

  // DOM加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTTS);
  } else {
    initTTS();
  }

})();