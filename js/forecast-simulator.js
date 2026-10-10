/**
 * Satyam Yadav Portfolio - Interactive Demand & Inventory Simulator
 * Computes EOQ, Safety Stock, Reorder Point, and Cost Optimization in Real-Time
 */

(function () {
  'use strict';

  function initSimulator() {
    const demandInput = document.getElementById('sim-demand');
    const leadTimeInput = document.getElementById('sim-leadtime');
    const holdingCostInput = document.getElementById('sim-holding');
    const orderCostInput = document.getElementById('sim-ordercost');
    const volatilityInput = document.getElementById('sim-volatility');

    const demandVal = document.getElementById('val-demand');
    const leadTimeVal = document.getElementById('val-leadtime');
    const holdingVal = document.getElementById('val-holding');
    const orderCostVal = document.getElementById('val-ordercost');
    const volatilityVal = document.getElementById('val-volatility');

    const eoqDisplay = document.getElementById('sim-out-eoq');
    const safetyDisplay = document.getElementById('sim-out-safety');
    const savingsDisplay = document.getElementById('sim-out-savings');

    const canvas = document.getElementById('sim-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function updateSimulation() {
      // 1. Gather values
      const monthlyDemand = parseFloat(demandInput.value);
      const annualDemand = monthlyDemand * 12;
      const leadTimeDays = parseFloat(leadTimeInput.value);
      const leadTimeMonths = leadTimeDays / 30;
      const holdingCost = parseFloat(holdingCostInput.value);
      const orderCost = parseFloat(orderCostInput.value);
      const volatility = parseFloat(volatilityInput.value) / 100;

      // Update text tags
      if (demandVal) demandVal.textContent = monthlyDemand.toLocaleString() + ' units/mo';
      if (leadTimeVal) leadTimeVal.textContent = leadTimeDays + ' days';
      if (holdingVal) holdingVal.textContent = '$' + holdingCost + '/unit/yr';
      if (orderCostVal) orderCostVal.textContent = '$' + orderCost + '/order';
      if (volatilityVal) volatilityVal.textContent = Math.round(volatility * 100) + '%';

      // 2. Calculations
      // EOQ Formula: sqrt((2 * D * S) / H)
      const eoq = Math.round(Math.sqrt((2 * annualDemand * orderCost) / holdingCost));

      // Demand standard deviation over lead time:
      // sigma_L = (monthlyDemand * volatility) * sqrt(leadTimeMonths)
      const sigmaMonthly = monthlyDemand * volatility;
      const sigmaL = sigmaMonthly * Math.sqrt(leadTimeMonths);

      // 95% service level Z-score is 1.645
      const safetyStock = Math.round(1.645 * sigmaL);

      // Estimated annual holding savings with optimized demand forecasting vs naive 25% over-buffering
      const naiveBuffer = monthlyDemand * 0.35;
      const optimizedBuffer = safetyStock;
      const unitExcessSaved = Math.max(0, naiveBuffer - optimizedBuffer);
      const annualSavings = Math.round(unitExcessSaved * holdingCost + (annualDemand / eoq) * (orderCost * 0.2));

      // Display outputs
      if (eoqDisplay) eoqDisplay.textContent = eoq.toLocaleString() + ' units';
      if (safetyDisplay) safetyDisplay.textContent = safetyStock.toLocaleString() + ' units';
      if (savingsDisplay) savingsDisplay.textContent = '$' + annualSavings.toLocaleString();

      // 3. Render Chart
      renderChart(monthlyDemand, volatility, safetyStock, eoq);
    }

    function renderChart(baseDemand, volatility, safetyStock, eoq) {
      // Set actual canvas pixels to match display size
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const padding = 35 * (window.devicePixelRatio || 1);

      // Generate 12 months simulated demand with forecasting trend
      const points = [];
      const months = 12;
      let minVal = baseDemand * (1 - volatility * 1.5);
      let maxVal = baseDemand * (1 + volatility * 1.8);

      for (let m = 0; m < months; m++) {
        // Pseudo seasonal trend with volatility
        const seasonal = Math.sin((m / 12) * Math.PI * 2) * (baseDemand * volatility * 0.7);
        const randomNoise = ((m * 17) % 7 - 3) / 10 * (baseDemand * volatility);
        const val = Math.max(10, baseDemand + seasonal + randomNoise);
        points.push(val);
      }

      // Scaling helper
      const scaleX = (i) => padding + (i / (months - 1)) * (w - padding * 2);
      const scaleY = (val) => h - padding - ((val - minVal) / (maxVal - minVal || 1)) * (h - padding * 2);

      // Draw horizontal grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const y = padding + (i / 4) * (h - padding * 2);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(w - padding, y);
        ctx.stroke();
      }

      // Draw Confidence Interval Band (95% CI)
      ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.beginPath();
      for (let i = 0; i < months; i++) {
        const x = scaleX(i);
        const yUpper = scaleY(points[i] + baseDemand * volatility * 0.6);
        if (i === 0) ctx.moveTo(x, yUpper);
        else ctx.lineTo(x, yUpper);
      }
      for (let i = months - 1; i >= 0; i--) {
        const x = scaleX(i);
        const yLower = scaleY(points[i] - baseDemand * volatility * 0.6);
        ctx.lineTo(x, yLower);
      }
      ctx.closePath();
      ctx.fill();

      // Draw Forecast Demand Curve (Cyan Glow)
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
          // Smooth curve using bezier
          const prevX = scaleX(i - 1);
          const prevY = scaleY(points[i - 1]);
          const cpX = (prevX + x) / 2;
          ctx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
        }
      }
      ctx.stroke();

      // Draw Data Nodes on curve
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < months; i++) {
        const x = scaleX(i);
        const y = scaleY(points[i]);
        ctx.beginPath();
        ctx.arc(x, y, 4 * (window.devicePixelRatio || 1), 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Optimal Reorder Point Line (Emerald dashed)
      const optimalY = scaleY(baseDemand);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2 * (window.devicePixelRatio || 1);
      ctx.setLineDash([6 * (window.devicePixelRatio || 1), 4 * (window.devicePixelRatio || 1)]);
      ctx.beginPath();
      ctx.moveTo(padding, optimalY);
      ctx.lineTo(w - padding, optimalY);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // Legend Text in Canvas
      ctx.font = `${11 * (window.devicePixelRatio || 1)}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('● ML Demand Forecast', padding + 10, padding - 10);
      ctx.fillStyle = '#10b981';
      ctx.fillText('-- Baseline Target', padding + 180 * (window.devicePixelRatio || 1), padding - 10);
    }

    // Event Listeners on Sliders
    const sliders = [demandInput, leadTimeInput, holdingCostInput, orderCostInput, volatilityInput];
    sliders.forEach(slider => {
      if (slider) {
        slider.addEventListener('input', updateSimulation);
      }
    });

    window.addEventListener('resize', () => {
      updateSimulation();
    });

    // Run initial update
    updateSimulation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimulator);
  } else {
    initSimulator();
  }
})();
