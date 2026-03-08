import { QRCodeSVG } from 'qrcode.react'

const BASE_URL = 'https://chiring-yfrt.vercel.app'

const hamacas = [
  '1A','1B','2A','2B','3A','3B','4A','4B','5A','5B',
  '6A','6B','7A','7B','8A','8B','9A','9B','10A','10B',
  '11A','11B','12A','12B','13A','13B','14A','14B','15A','15B'
]

export default function QRGenerator() {
  return (
    <div style={{padding:40, background:'white', minHeight:'100vh'}}>
      <h1 style={{fontFamily:'sans-serif', marginBottom:8}}>🌊 QR Hamacas - Chiringuito Playa Sol</h1>
      <p style={{fontFamily:'sans-serif', color:'#888', marginBottom:40}}>Imprime y coloca cada QR en su hamaca correspondiente</p>
      <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:30}}>
        {hamacas.map(num => (
          <div key={num} style={{textAlign:'center', padding:20, border:'2px solid #E0F0F8', borderRadius:16}}>
            <QRCodeSVG
              value={`${BASE_URL}/hamaca/${num}`}
              size={150}
              level="H"
            />
            <div style={{fontFamily:'sans-serif', fontWeight:900, fontSize:22, marginTop:12, color:'#0A2540'}}>
              Hamaca {num}
            </div>
            <div style={{fontFamily:'sans-serif', fontSize:11, color:'#aaa', marginTop:4}}>
              {BASE_URL}/hamaca/{num}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}