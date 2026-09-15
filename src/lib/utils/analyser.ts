// watchLevel samples an AnalyserNode (or wraps a MediaStream in one) on
// requestAnimationFrame and reports barCount normalized frequency peaks.
// Returns a cleanup that stops sampling and closes a created AudioContext.

export function watchLevel(
  source: MediaStream | AnalyserNode,
  barCount: number,
  cb: (bars: number[]) => void
): () => void {
  let ctx: AudioContext | undefined
  let analyser: AnalyserNode
  if ('getByteFrequencyData' in source) {
    analyser = source
  } else {
    ctx = new AudioContext()
    analyser = ctx.createAnalyser()
    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.8
    ctx.createMediaStreamSource(source).connect(analyser)
  }
  const buf = new Uint8Array(analyser.frequencyBinCount)
  let raf = 0
  const tick = () => {
    analyser.getByteFrequencyData(buf)
    const out = new Array<number>(barCount)
    const stride = buf.length / barCount
    for (let i = 0; i < barCount; i++) {
      let peak = 0
      for (let j = Math.floor(i * stride); j < Math.floor((i + 1) * stride); j++) {
        const v = buf[j] ?? 0
        if (v > peak) peak = v
      }
      out[i] = Math.min(1, (peak / 255) * 1.6)
    }
    cb(out)
    raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
  return () => {
    cancelAnimationFrame(raf)
    void ctx?.close()
  }
}
