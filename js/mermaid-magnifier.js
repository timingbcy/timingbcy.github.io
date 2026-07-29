/**
 * Mermaid 图表放大功能
 * 点击按钮后横向放大显示
 */

(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    // 等待 Mermaid 渲染完成
    setTimeout(initMermaidZoom, 1000);
  });

  function initMermaidZoom() {
    // 获取所有 Mermaid 图表
    const mermaidDiagrams = document.querySelectorAll('.mermaid');

    if (mermaidDiagrams.length === 0) return;

    mermaidDiagrams.forEach(function(diagram) {
      // 创建放大按钮
      const zoomButton = document.createElement('button');
      zoomButton.className = 'mermaid-zoom-button';
      zoomButton.innerHTML = '🔍 放大查看';
      zoomButton.title = '点击放大图表';

      // 插入到图表前面
      diagram.parentNode.insertBefore(zoomButton, diagram);

      let isZoomed = false;
      let originalContent = null;

      // 点击按钮
      zoomButton.addEventListener('click', function() {
        if (!isZoomed) {
          // 放大
          zoomDiagram();
          isZoomed = true;
          zoomButton.innerHTML = '❌ 关闭放大';
          zoomButton.classList.add('active');
        } else {
          // 恢复
          restoreDiagram();
          isZoomed = false;
          zoomButton.innerHTML = '🔍 放大查看';
          zoomButton.classList.remove('active');
        }
      });

      function zoomDiagram() {
        // 保存原始内容
        originalContent = diagram.innerHTML;

        // 获取 SVG
        const svg = diagram.querySelector('svg');
        if (!svg) return;

        // 设置 SVG 样式，确保文字不被裁剪
        svg.style.width = 'auto';
        svg.style.height = 'auto';
        svg.style.minWidth = '100%';
        svg.style.overflow = 'visible';

        // 设置所有文字元素不被裁剪
        const textElements = svg.querySelectorAll('text, tspan');
        textElements.forEach(function(text) {
          text.style.overflow = 'visible';
          text.style.display = 'block';
        });

        // 创建放大容器
        const zoomContainer = document.createElement('div');
        zoomContainer.className = 'mermaid-zoom-container';

        // 克隆 SVG
        const clonedSvg = svg.cloneNode(true);

        // 设置放大后的尺寸（横向放大）
        const originalWidth = svg.getBoundingClientRect().width;
        const zoomWidth = Math.max(1200, originalWidth * 2); // 至少 1200px 或原宽度的 2 倍

        clonedSvg.style.width = zoomWidth + 'px';
        clonedSvg.style.height = 'auto';
        clonedSvg.style.minWidth = zoomWidth + 'px';

        // 确保所有文字可见
        const clonedTextElements = clonedSvg.querySelectorAll('text, tspan');
        clonedTextElements.forEach(function(text) {
          text.style.overflow = 'visible';
          text.style.whiteSpace = 'nowrap';
          text.style.display = 'block';
        });

        zoomContainer.appendChild(clonedSvg);

        // 替换原始内容
        diagram.innerHTML = '';
        diagram.appendChild(zoomContainer);

        // 添加横向滚动提示
        const scrollHint = document.createElement('div');
        scrollHint.className = 'mermaid-scroll-hint';
        scrollHint.innerHTML = '← 左右拖动查看完整图表 →';
        diagram.appendChild(scrollHint);

        // 3秒后隐藏提示
        setTimeout(function() {
          scrollHint.style.opacity = '0';
        }, 3000);
      }

      function restoreDiagram() {
        // 恢复原始内容
        diagram.innerHTML = originalContent;
      }
    });
  }
})();
