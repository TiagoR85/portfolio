// Gera foto e máscara da gravata com bordas suavizadas (braços cortados deixam de ter corte seco).
// Também remove a franja semitransparente clara que sobra do recorte original (halo em volta do cabelo).
import sharp from 'sharp';

// SRC pode ser trocado por env para testar variações: PORTRAIT_SRC=caminho.png
const SRC = process.env.PORTRAIT_SRC ?? 'D:/opencode-temp/Fotos CV/Eu_CV.png';
const W = 1000;
// fração de alpha descartada na borda: 0.62 remove o halo sem comer a silhueta
const EDGE_CUT = 0.62;

const smooth = (t) => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);

function featherAlpha(data, w, h, scoop = false) {
  const fx = Math.round(w * 0.07); // 70px
  const fy = Math.round(h * 0.16); // ~200px
  // corte concavo na base: o fundo "come" mais no centro (parabola) → foto afunda
  // numa bacia em vez de terminar reto; o feather de ~200px esconde a linha
  const dpx = Math.round(h * 0.1);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4 + 3;
      const a = data[i];
      if (a === 0) continue;
      const left = smooth(x / fx);
      const right = smooth((w - 1 - x) / fx);
      const xb = (2 * x) / (w - 1) - 1;
      const bnd = (h - 1) - (scoop ? dpx * (1 - xb * xb) : 0);
      const bottom = smooth((bnd - y) / fy);
      const f = Math.min(left, right, bottom);
      data[i] = Math.round(a * f);
    }
  }
}

// alpha abaixo do corte vira 0 e o resto é reescalado: some a borda clara do recorte
function erodeAlpha(data, k) {
  const cut = k * 255, denom = 1 - k;
  for (let i = 3; i < data.length; i += 4) {
    const a = data[i];
    data[i] = a <= cut ? 0 : Math.round((a - cut) / denom);
  }
}

// compressão de altas luzes + leve dessaturação: tira o brilho da pele sem cinza
// (t = onde a curva começa, k = força, sat = saturação preservada acima)
const LIGHT = { t: 0.68, k: 1.6, sat: 0.96 };
function toneSkin(data, { t, k, sat }) {
  const ro = (v) => { const x = Math.max(0, v - t); return Math.min(1, v - k * x * x); };
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const r = ro(data[i] / 255), g = ro(data[i + 1] / 255), b = ro(data[i + 2] / 255);
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    data[i] = Math.round((luma + (r - luma) * sat) * 255);
    data[i + 1] = Math.round((luma + (g - luma) * sat) * 255);
    data[i + 2] = Math.round((luma + (b - luma) * sat) * 255);
  }
}

// o resize do sharp não pré-multiplica: sem isso o Lanczos mistura o RGB de pixels
// transparentes na borda e recria a franja clara
function premultiply(data) {
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3] / 255;
    data[i] *= a; data[i + 1] *= a; data[i + 2] *= a;
  }
}
function unpremultiply(data) {
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3] / 255;
    if (a > 0) {
      data[i] = Math.min(255, Math.round(data[i] / a));
      data[i + 1] = Math.min(255, Math.round(data[i + 1] / a));
      data[i + 2] = Math.min(255, Math.round(data[i + 2] / a));
    }
  }
}

const { data: raw, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 3; i < raw.length; i += 4) if (raw[i] < 25) raw[i] = 0;

// trim UMA vez: foto e máscara precisam do mesmo enquadramento
const trimmed = await sharp(raw, { raw: { width: info.width, height: info.height, channels: 4 } })
  .trim().raw().toBuffer({ resolveWithObject: true });

// 1) foto: corta a franja, resize premultiplicado, feather
const photoRaw = Buffer.from(trimmed.data);
erodeAlpha(photoRaw, EDGE_CUT);
premultiply(photoRaw);
const resized = await sharp(photoRaw, { raw: { width: trimmed.info.width, height: trimmed.info.height, channels: 4 } })
  .resize({ width: W, withoutEnlargement: true }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
// erosão espacial SEPARÁVEL (mínimo em janela r×r) só no canal alpha:
// mata a franja branca opaca que sai do editor embutida na silhueta —
// o EDGE_CUT numérico não a vê porque ela é opaca. sharp.erode() mexe
// no RGB e estraga a imagem (testado: fique psicodélico).
function erodeAlphaEspacial(data2, w, h, r) {
  const n = w * h;
  const a = new Uint8Array(n);
  for (let p = 0; p < n; p++) a[p] = data2[p * 4 + 3];
  const t = new Uint8Array(n);
  for (let y = 0; y < h; y++) {
    const row = y * w;
    for (let x = 0; x < w; x++) {
      let min = 255;
      for (let d = -r; d <= r; d++) {
        const xx = x + d;
        const v = xx < 0 || xx >= w ? 0 : a[row + xx];
        if (v < min) min = v;
      }
      t[row + x] = min;
    }
  }
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let min = 255;
      for (let d = -r; d <= r; d++) {
        const yy = y + d;
        const v = yy < 0 || yy >= h ? 0 : t[yy * w + x];
        if (v < min) min = v;
      }
      data2[(y * w + x) * 4 + 3] = min;
    }
  }
}

// a master 300dpi sai do editor com franja branca opaca fechada no contorno
// (rosto/cabelo); o EDGE_CUT so ve alpha, entao esprema a silhueta 3px aqui
// — o feather final dissimula a borda recuada
erodeAlphaEspacial(resized.data, resized.info.width, resized.info.height, 3);
const photoBuf = resized;
toneSkin(photoBuf.data, LIGHT);
featherAlpha(photoBuf.data, photoBuf.info.width, photoBuf.info.height, true);
await sharp(photoBuf.data, { raw: { width: photoBuf.info.width, height: photoBuf.info.height, channels: 4 } })
  .webp({ quality: 86, effort: 6, alphaQuality: 95 })
  .toFile('public/img/tiao.webp');

// 2) máscara da gravata com o mesmo enquadramento e feather
const maskBase = await sharp(trimmed.data, { raw: { width: trimmed.info.width, height: trimmed.info.height, channels: 4 } })
  .resize({ width: W, withoutEnlargement: true }).raw().toBuffer({ resolveWithObject: true });
const mw = maskBase.info.width, mh = maskBase.info.height;
const md = maskBase.data;
const out = Buffer.alloc(mw * mh * 4);
for (let p = 0; p < mw * mh; p++) {
  const i = p * 4;
  const r = md[i] / 255, g = md[i + 1] / 255, b = md[i + 2] / 255, a = md[i + 3];
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  let hue = 0;
  if (d > 0) {
    if (max === r) hue = 60 * (((g - b) / d) % 6);
    else if (max === g) hue = 60 * ((b - r) / d + 2);
    else hue = 60 * ((r - g) / d + 4);
  }
  if (hue < 0) hue += 360;
  const sat = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  const isTie = a > 40 && hue > 178 && hue < 206 && sat > 0.22 && l > 0.12 && l < 0.9;
  out[i] = 255; out[i + 1] = 255; out[i + 2] = 255; out[i + 3] = isTie ? 255 : 0;
}
featherAlpha(out, mw, mh);
await sharp(out, { raw: { width: mw, height: mh, channels: 4 } }).blur(1.1).png({ compressionLevel: 9 }).toFile('public/img/tie-mask.png');

const fs = await import('node:fs');
console.log('foto', photoBuf.info.width + 'x' + photoBuf.info.height, Math.round(fs.statSync('public/img/tiao.webp').size / 1024) + ' KB');
console.log('mask', mw + 'x' + mh, Math.round(fs.statSync('public/img/tie-mask.png').size / 1024) + ' KB');

