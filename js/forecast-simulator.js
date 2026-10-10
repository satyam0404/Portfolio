/**
 * Satyam Yadav Portfolio - Interactive Data & Business Analytics Engine
 * Simulates Predictive Sales Forecasting, Customer Lifetime Value (CLV), and Churn Mitigation
 */

(function () {
  'use strict';

  function initSimulator() {
    const ordersInput = document.getElementById('sim-orders');
    const aovInput = document.getElementById('sim-aov');
    const churnInput = document.getElementById('sim-churn');
    const growthInput = document.getElementById('sim-growth');
    const cacInput = document.getElementById('sim-cac');

    const ordersVal = document.getElementById('val-orders');
    const aovVal = document.getElementById('val-aov');
    const churnVal = document.getElementById('val-churn');
    const growthVal = document.getElementById('val-growth');
    const cacVal = document.getElementById('val-cac');

    const revenueDisplay = document.getElementById('sim-out-revenue');
    const clvDisplay = document.getElementById('sim-out-clv');
    const roiDisplay = document.getElementById('sim-out-roi');

    const canvas = document.getElementById('sim-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function updateSimulation() {
      // 1. Gather values
      const monthlyOrders = parseFloat(ordersInput.value);
      const aov = parseFloat(aovInput.value);
      const churnRate = parseFloat(churnInput.value) / 100;
      const growthRate = parseFloat(growthInput.value) / 100;
      const cac = parseFloat(cacInput.value);

      // Update text display tags
      if (ordersVal) ordersVal.textContent = monthlyOrders.toLocaleString() + ' orders/mo';
      if (aovVal) aovVal.textContent = '$' + aov.toFixed(0);
      if (churnVal) churnVal.textContent = Math.round(churnRate * 100) + '% / mo';
      if (growthVal) growthVal.textContent = '+' + Math.round(growthRate * 100) + '%';
      if (cacVal) cacVal.textContent = '$' + cac.toFixed(0);

      // 2. Calculations
      // Base Monthly Revenue
      const monthlyRevenue = monthlyOrders * aov;
      // Annualized Revenue factoring growth trend
      const annualRevenue = monthlyRevenue * 12 * (1 + growthRate * 0.5);

      // Customer Lifetime Value: CLV = (AOV * Annual Purchase Frequency) / Annual Churn Rate
      // Normalized annual churn = 1 - (1 - monthlyChurn)^12
      const annualChurn = Math.min(0.95, 1 - Math.pow(1 - churnRate, 12));
      const annualFrequency = 3.6; // average recurring transactions per customer per year
      const clv = Math.round((aov * annualFrequency) / (annualChurn || 0.1));

      // Revenue gained via ML Churn Retention & RFM Targeting (simulating 18% churn reduction)
      const churnMitigationGained = Math.round(monthlyRevenue * 12 * (churnRate * 0.18));

      // Display outputs
      if (revenueDisplay) revenueDisplay.textContent = '$' + Math.round(annualRevenue).toLocaleString();
      if (clvDisplay) clvDisplay.textContent = '$' + clv.toLocaleString();
      if (roiDisplay) roiDisplay.textContent = '+$' + churnMitigationGained.toLocaleString();

      // 3. Render Chart
      renderChart(monthlyRevenue, growthRate, churnRate);
    }

    function renderChart(baseMonthlyRevenue, growthRate, churnRate) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const padding = 35 * (window.devicePixelRatio || 1);

      // 12-Month Predictive Forecast
      const months = 12;
      const points = [];
      let minVal = baseMonthlyRevenue * 0.7;
      let maxVal = baseMonthlyRevenue * (1 + growthRate * 1.4);

      for (let m = 0; m < months; m++) {
        // Trend with compounding growth and seasonality
        const trend = baseMonthlyRevenue * Math.pow(1 + growthRate / 12, m);
        const seasonal = Math.sin((m / 12) * Math.PI * 2) * (baseMonthlyRevenue * 0.08);
        const noise = ((m * 19) % 7 - 3) / 100 * baseMonthlyRevenue;
        const val = Math.max(100, trend + seasonal + noise);
        points.push(val);
        if (val > maxVal) maxVal = val;
        if (val < minVal) minVal = val;
      }

      // Scaling helper
      const scaleX = (i) => padding + (i / (months - 1)) * (w - padding * 2);
      const scaleY = (val) => h - padding - ((val - minVal) / (maxVal - minVal || 1)) * (h - padding * 2);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padding + (i / 4) * (h - padding * 2);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(w - padding, y);
        ctx.stroke();
      }

      // 95% Confidence Interval Band (Violet-Cyan glow)
      const ciSpread = baseMonthlyRevenue * 0.09;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.09)';
      ctx.beginPath();
      for (let i = 0; i < months; i++) {
        const x = scaleX(i);
        const yUpper = scaleY(points[i] + ciSpread);
        if (i === 0) ctx.moveTo(x, yUpper);
        else ctx.lineTo(x, yUpper);
      }
      for (let i = months - 1; i >= 0; i--) {
        const x = scaleX(i);
        const yLower = scaleY(points[i] - ciSpread);
        ctx.lineTo(x, yLower);
      }
      ctx.closePath();
      ctx.fill();

      // Forecast Curve (Electric Cyan Line)
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3 * (window.devicePixelRatio || 1);
      ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
      ctx.shadowBlur = 12 * (window.devicePixelRatio || 1);

      ctx.beginPath();
      for (let i = 0; i < months; i++) {
        const x = scaleX(i);
        const y = scaleY(points[i]);
        if (i === 0) ctx.moveTo(x, y);
        else {
          const prevX = scaleX(i - 1);
          const prevY = scaleY(points[i - 1]);
          const cpX = (prevX + x) / 2;
          ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
        }
      }
      ctx.stroke();

      // Plot data points
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < months; i++) {
        const x = scaleX(i);
        const y = scaleY(points[i]);
        ctx.beginPath();
        ctx.arc(x, y, 4 * (window.devicePixelRatio || 1), 0, Math.PI * 2);
        ctx.fill();
      }

      // Baseline Target Line (Emerald Dashed)
      const targetY = scaleY(baseMonthlyRevenue);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2 * (window.devicePixelRatio || 1);
      ctx.setLineDash([6 * (window.devicePixelRatio || 1), 4 * (window.devicePixelRatio || 1)]);
      ctx.beginPath();
      ctx.moveTo(padding, targetY);
      ctx.lineTo(w - padding, targetY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Legend Text in Canvas
      ctx.font = `${11 * (window.devicePixelRatio || 1)}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('● ML Sales Forecast (95% CI)', padding + 10, padding - 10);
      ctx.fillStyle = '#10b981';
      ctx.fillText('-- Baseline Target', padding + 220 * (window.devicePixelRatio || 1), padding - 10);
    }

    // Event Listeners on Sliders
    const sliders = [ordersInput, aovInput, churnInput, growthInput, cacInput];
    sliders.forEach(slider => {
      if (slider) {
        slider.addEventListener('input', updateSimulation);
      }
    });

    window.addEventListener('resize', () => {
      updateSimulation();
    });

    updateSimulation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimulator);
  } else {
    initSimulator();
  }
})();
