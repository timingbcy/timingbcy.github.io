/**
 * Code Block and Mermaid Diagram Folding
 * 自动为代码块和 Mermaid 图表添加折叠功能
 */

(function() {
  'use strict';

  // 默认配置
  const DEFAULT_CONFIG = {
    enable: true,              // 是否启用功能
    code_max_height: 300,      // 代码块最大高度（像素）
    mermaid_max_height: 400,   // Mermaid 图表最大高度（像素）
    auto_fold: true,           // 是否自动折叠
    fold_button_text: {        // 按钮文本
      expand: '展开',
      collapse: '折叠',
      expand_code: '展开代码',
      collapse_code: '折叠代码',
      expand_mermaid: '展开图表',
      collapse_mermaid: '折叠图表'
    }
  };

  // 合并配置 - 需要解析 JSON 字符串
  let config = DEFAULT_CONFIG;
  try {
    if (window.theme && window.theme.code_mermaid_fold) {
      const themeConfig = typeof window.theme.code_mermaid_fold === 'string'
        ? JSON.parse(window.theme.code_mermaid_fold)
        : window.theme.code_mermaid_fold;
      config = Object.assign({}, DEFAULT_CONFIG, themeConfig);
    }
  } catch (e) {
    console.warn('Failed to parse code_mermaid_fold config:', e);
  }

  // 如果功能被禁用，直接返回
  if (!config.enable) {
    return;
  }

  /**
   * 为元素添加折叠功能
   */
  function addFoldFunctionality(element, type) {
    const maxHeight = type === 'mermaid' ? config.mermaid_max_height : config.code_max_height;
    
    console.log('CodeMermaidFold: Adding fold functionality to', type, 'element, height:', element.offsetHeight, 'max:', maxHeight);

    // 检查元素高度是否超过最大高度
    if (element.offsetHeight <= maxHeight) {
      console.log('CodeMermaidFold: Element height does not exceed max height, skipping');
      return;
    }

    // 创建包装器
    const wrapper = document.createElement('div');
    wrapper.className = `fold-wrapper ${type}-wrapper`;
    
    // 如果启用自动折叠，默认为折叠状态
    if (config.auto_fold) {
      wrapper.classList.add('collapsed');
    }

    // 插入包装器
    element.parentNode.insertBefore(wrapper, element);
    wrapper.appendChild(element);

    // 创建折叠按钮
    const button = document.createElement('button');
    button.className = `fold-button ${type}-fold-button`;
    
    // 设置按钮文本
    const buttonText = document.createElement('span');
    buttonText.className = 'fold-button-text';
    buttonText.textContent = wrapper.classList.contains('collapsed') 
      ? (type === 'mermaid' ? config.fold_button_text.expand_mermaid : config.fold_button_text.expand_code)
      : (type === 'mermaid' ? config.fold_button_text.collapse_mermaid : config.fold_button_text.collapse_code);
    button.appendChild(buttonText);

    // 添加图标
    const icon = document.createElement('span');
    icon.className = 'fold-button-icon';
    icon.textContent = '▼';
    button.appendChild(icon);

    // 添加按钮到包装器
    wrapper.appendChild(button);

    console.log('CodeMermaidFold: Fold wrapper and button added');

    // 点击事件
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      wrapper.classList.toggle('collapsed');
      wrapper.classList.toggle('expanded');
      
      // 更新按钮文本
      buttonText.textContent = wrapper.classList.contains('collapsed')
        ? (type === 'mermaid' ? config.fold_button_text.expand_mermaid : config.fold_button_text.expand_code)
        : (type === 'mermaid' ? config.fold_button_text.collapse_mermaid : config.fold_button_text.collapse_code);
      
      // 更新图标旋转
      icon.style.transform = wrapper.classList.contains('collapsed') ? 'rotate(0deg)' : 'rotate(180deg)';
    });
  }

  /**
   * 初始化代码块折叠
   */
  function initCodeBlockFolding() {
    console.log('CodeMermaidFold: Initializing code block folding...');

    // 查找所有代码块
    const codeBlocks = document.querySelectorAll('.post-content pre, .post-content figure.highlight, article pre, article figure.highlight, pre, figure.highlight');

    console.log('CodeMermaidFold: Found', codeBlocks.length, 'code blocks');

    codeBlocks.forEach(function(block, index) {
      // 跳过已经添加过折叠功能的代码块
      if (block.closest('.fold-wrapper')) {
        return;
      }
      
      addFoldFunctionality(block, 'code');
    });
  }

  /**
   * 初始化 Mermaid 图表折叠
   */
  function initMermaidFolding() {
    console.log('CodeMermaidFold: Initializing Mermaid folding...');

    // Mermaid 图表通常在 div.mermaid 或 pre.mermaid 中
    const mermaidBlocks = document.querySelectorAll('.post-content div.mermaid, .post-content pre.mermaid, article div.mermaid, article pre.mermaid, .mermaid');

    console.log('CodeMermaidFold: Found', mermaidBlocks.length, 'Mermaid blocks');

    mermaidBlocks.forEach(function(block, index) {
      // 跳过已经添加过折叠功能的图表
      if (block.closest('.fold-wrapper')) {
        console.log('CodeMermaidFold: Block', index, 'already has fold wrapper');
        return;
      }

      // 检查是否已经渲染（有子元素）
      if (block.children.length > 0) {
        console.log('CodeMermaidFold: Block', index, 'has content, adding fold functionality');
        addFoldFunctionality(block, 'mermaid');
      } else {
        console.log('CodeMermaidFold: Block', index, 'waiting for content...');

        // 等待 Mermaid 渲染
        const observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && block.children.length > 0) {
              console.log('CodeMermaidFold: Block', index, 'content loaded, adding fold functionality');
              addFoldFunctionality(block, 'mermaid');
              observer.disconnect();
            }
          });
        });
        
        observer.observe(block, { childList: true, subtree: true });

        // 5秒后超时，断开观察器
        setTimeout(function() {
          observer.disconnect();
        }, 5000);
      }
    });
  }

  /**
   * 重新初始化（用于动态加载的内容）
   */
  function reinit() {
    initCodeBlockFolding();
    initMermaidFolding();
  }

  /**
   * 初始化所有折叠功能
   */
  function init() {
    // 等待 DOM 完全加载
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    console.log('CodeMermaidFold: Initializing...');

    // 先初始化代码块（不需要等待 Mermaid）
    initCodeBlockFolding();

    // 等待 Mermaid 渲染完成后再初始化 Mermaid 图表
    if (window.mermaid) {
      // 监听 Mermaid 渲染完成事件
      document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initMermaidFolding, 1000);
      });
    } else {
      // 如果没有 Mermaid，延迟初始化以防万一
      setTimeout(initMermaidFolding, 1000);
    }

    // 再次延迟，确保所有内容都已渲染
    setTimeout(function() {
      initCodeBlockFolding();
      initMermaidFolding();
      console.log('CodeMermaidFold: Initialization complete');
    }, 3000);
  }

  // 暴露到全局
  window.CodeMermaidFold = {
    init: init,
    reinit: reinit,
    config: config
  };

  // 自动初始化
  init();

  // 导出函数供外部使用
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.CodeMermaidFold;
  }
})();