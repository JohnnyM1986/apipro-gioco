declare module 'zzfx' {
  export function zzfx(...p: (number | undefined)[]): AudioBufferSourceNode
  export const ZZFX: { volume: number; audioContext: AudioContext }
}
