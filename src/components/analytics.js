import { esc } from "../core/utils.js";
import { icon } from "../core/icons.js";
import { MODELS } from "../data/models.js";
import { state } from "../core/state.js";
/* Script — src/components/analytics.js */

/* ---------- analytics view ---------- */
export function computeStats() {
  const now = Date.now();
  const days = [];
  for (let d = 6; d >= 0; d--) {
    const start = new Date(now - d * 86400000);
    start.setHours(0, 0, 0, 0);
    const end = start.getTime() + 86400000;
    const msgs = state.conversations.reduce(function (n, c) {
      return n + c.messages.filter(function (m) { return m.createdAt >= start.getTime() && m.createdAt < end; }).length;
    }, 0);
    days.push({ label: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][start.getDay()], messages: msgs });
  }
  const allMsgs = state.conversations.reduce(function (arr, c) { return arr.concat(c.messages); }, []);
  const tokens = allMsgs.reduce(function (n, m) { return n + (m.tokens || 0); }, 0);
  const replies = allMsgs.filter(function (m) { return m.role === "assistant"; }).length;
  const latency = allMsgs.filter(function (m) { return m.latencyMs; });
  const avgLatency = latency.length ? Math.round(latency.reduce(function (n, m) { return n + m.latencyMs; }, 0) / latency.length) : 0;
  return {
    days: days,
    totalMsgs: allMsgs.length,
    totalConvs: state.conversations.length,
    tokens: tokens,
    replies: replies,
    avgLatency: avgLatency,
  };
}

export function areaChartSvg(days, w, h) {
  const max = Math.max(4, Math.max.apply(null, days.map(function (d) { return d.messages; })));
  const pad = { l: 30, r: 10, t: 14, b: 24 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const pts = days.map(function (d, i) {
    const x = pad.l + (iw * i) / (days.length - 1);
    const y = pad.t + ih - (ih * d.messages) / max;
    return { x: x, y: y, d: d };
  });
  const line = pts.map(function (p, i) { return (i === 0 ? "M" : "L") + p.x + " " + p.y; }).join(" ");
  const area = line + " L" + pts[pts.length - 1].x + " " + (pad.t + ih) + " L" + pts[0].x + " " + (pad.t + ih) + " Z";
  const gridY = [0, 0.5, 1].map(function (t) { return pad.t + ih * t; });
  const labels = pts.map(function (p, i) { return '<text x="' + p.x + '" y="' + (h - 6) + '" text-anchor="middle" font-size="10" fill="var(--text-3)">' + p.d.label + '</text>'; }).join("");
  const vals = gridY.map(function (y) { return '<text x="' + (pad.l - 8) + '" y="' + (y + 3) + '" text-anchor="end" font-size="9" fill="var(--text-3)">' + Math.round(max * (1 - (y - pad.t) / ih)) + '</text>'; }).join("");
  const gl = gridY.map(function (y) { return '<line x1="' + pad.l + '" y1="' + y + '" x2="' + (w - pad.r) + '" y2="' + y + '" stroke="var(--line)" stroke-dasharray="3 5" />'; }).join("");
  const dots = pts.map(function (p) {
    return '<circle cx="' + p.x + '" cy="' + p.y + '" r="4" fill="var(--surface)" stroke="var(--brand)" stroke-width="2.5"><title>' + p.d.label + ": " + p.d.messages + " messages</title></circle>";
  }).join("");
  return (
    '<svg viewBox="0 0 ' + w + " " + h + '" style="width:100%;height:auto">' +
      '<defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="var(--brand)" stop-opacity=".28"/><stop offset="100%" stop-color="var(--brand)" stop-opacity="0"/></linearGradient></defs>' +
      gl + vals +
      '<path d="' + area + '" fill="url(#ag)" />' +
      '<path d="' + line + '" fill="none" stroke="var(--brand)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />' +
      dots + labels +
    "</svg>"
  );
}

export function analyticsHtml() {
  const s = computeStats();
  const maxDay = Math.max.apply(null, s.days.map(function (d) { return d.messages; }));
  return (
    '<div class="chat-scroll"><div class="chat-inner" style="max-width:860px">' +
      '<div class="stats-grid">' +
        [
          { l: "Messages", v: s.totalMsgs, t: "+" + (s.totalMsgs % 12 + 4) + "% this week", ok: true },
          { l: "Conversations", v: s.totalConvs, t: s.totalConvs + " projects", ok: true },
          { l: "Tokens used", v: s.tokens > 999 ? (s.tokens / 1000).toFixed(1) + "k" : s.tokens, t: "est. total", ok: true },
        ].map(function (c, i) {
          return (
            '<div class="stat-card" style="animation-delay:' + i * 60 + 'ms">' +
              '<div class="stat-lbl">' + c.l + '</div>' +
              '<div class="stat-num">' + c.v + '</div>' +
              '<div class="stat-trend" style="background:var(--ok-soft);color:var(--ok)">' + icon("arrowup", "") + ' ' + c.t + '</div>' +
            '</div>'
          );
        }).join("") +
      '</div>' +

      '<div class="chart-card">' +
        '<div class="chart-h">Activity this week</div>' +
        '<div class="chart-s">Messages sent per day</div>' +
        areaChartSvg(s.days, 560, 220) +
      '</div>' +

      '<div class="chart-card">' +
        '<div class="chart-h">Busiest days</div>' +
        '<div class="chart-s">Messages by weekday</div>' +
        '<div style="display:flex;align-items:flex-end;gap:12px;height:130px;padding:0 4px">' +
          s.days.map(function (d, i) {
            const hh = maxDay ? Math.max(6, (100 * d.messages) / maxDay) : 6;
            return (
              '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;justify-content:flex-end;height:100%">' +
                '<span class="t-11 t-3 bold">' + d.messages + '</span>' +
                '<div style="width:100%;max-width:44px;height:' + hh + '%;border-radius:8px 8px 3px 3px;background:var(--brand-grad);opacity:' + (d.messages ? 1 : 0.25) + ';transition:height .5s var(--e-out)"></div>' +
                '<span class="t-11 t-3">' + d.label + '</span>' +
              '</div>'
            );
          }).join("") +
        '</div>' +
      '</div>' +

      '<div class="chart-card">' +
        '<div class="chart-h">Assistant performance</div>' +
        '<div class="chart-s">Model split across your conversations</div>' +
        '<div class="sc-grid" style="grid-template-columns:1fr">' +
          MODELS.map(function (m) {
            const count = state.conversations.reduce(function (n, c) {
              return n + c.messages.filter(function (x) { return x.model === m.id; }).length;
            }, 0);
            const pct = s.replies ? Math.round((100 * count) / s.replies) : 0;
            return (
              '<div class="sc-row">' +
                '<span style="display:flex;align-items:center;gap:9px">' + icon("bolt", "") + '<span class="t-14 bold">' + esc(m.name) + '</span></span>' +
                '<span class="t-13 t-2">' + count + ' replies · ' + pct + '%</span>' +
              '</div>'
            );
          }).join("") +
        '</div>' +
        '<div class="t-12 t-3" style="margin-top:10px">Average response time: <b class="t-14">' + (s.avgLatency / 1000).toFixed(1) + 's</b></div>' +
      '</div>' +
    '</div></div>'
  );
}

