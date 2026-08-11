function hexParaHSL(hex) {
  const c = hex.replace('#', '')
  const r = parseInt(c.substr(0,2),16) / 255
  const g = parseInt(c.substr(2,2),16) / 255
  const b = parseInt(c.substr(4,2),16) / 255

  const max = Math.max(r,g,b), min = Math.min(r,g,b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch(max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

function hslParaHex(h, s, l) {
  s /= 100
  l /= 100
  const k = n => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  const toHex = x => Math.round(x * 255).toString(16).padStart(2,'0')
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`
}

function comOpacidade(hex, opacidade) {
  const alpha = Math.round(opacidade * 255).toString(16).padStart(2,'0')
  return `${hex}${alpha}`
}

function isEscura(hex) {
  const c = hex.replace('#', '')
  const r = parseInt(c.substr(0,2),16)
  const g = parseInt(c.substr(2,2),16)
  const b = parseInt(c.substr(4,2),16)
  return (r*299 + g*587 + b*114) / 1000 < 128
}

export function gerarPaleta(hex = "#22c55e") {
  if (!hex || !hex.startsWith('#') || hex.length < 7) hex = "#22c55e"

  const { h, s, l } = hexParaHSL(hex)

  return {
    primaria:     hex,
    clara:        hslParaHex(h, s, Math.min(l + 20, 95)),
    maisClara:    hslParaHex(h, s, Math.min(l + 35, 97)),
    escura:       hslParaHex(h, s, Math.max(l - 15, 5)),
    maisEscura:   hslParaHex(h, s, Math.max(l - 30, 5)),
    suave:        hslParaHex(h, Math.max(s - 30, 10), Math.min(l + 30, 96)),
    vibrante:     hslParaHex(h, Math.min(s + 20, 100), l),
    fundo:        comOpacidade(hex, 0.08),
    fundoMedio:   comOpacidade(hex, 0.15),
    borda:        comOpacidade(hex, 0.25),
    bordaForte:   comOpacidade(hex, 0.45),
    overlay:      comOpacidade(hex, 0.85),
    complementar: hslParaHex((h + 180) % 360, s, l),
    analogaA:     hslParaHex((h + 30) % 360, s, l),
    analogaB:     hslParaHex((h - 30 + 360) % 360, s, l),
    texto:        isEscura(hex) ? "#ffffff" : "#0f0f0f",
    textoSuave:   isEscura(hex) ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)",
    textoInverso: isEscura(hex) ? "#0f0f0f" : "#ffffff",
    isEscura:     isEscura(hex),
  }
}
