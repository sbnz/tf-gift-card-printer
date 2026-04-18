import React, { useState, useEffect } from 'react'
import Input from './components/Input';

function todayFormatted() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const [formData, setFormData] = useState({
    value: "",
    gift_card_code: "",
    expiration_date: todayFormatted(),
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  useEffect(() => {
    queryParams.forEach((value, key) => {
      setFormData(prev => ({ ...prev, [key]: value }))
    })
  }, [])
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className='flex flex-row items-start gap-8 p-8'>
      {/* Sidebar form */}
      <aside className='printHide flex flex-col gap-4 w-56 shrink-0'>
        <h1 className='text-base font-bold text-gray-800'>TOM FLOWERS<br />Gift Card Printer</h1>
        <Input handleChange={handleChange} name="value" label="Wert (z.B. CHF 50)" value={formData["value"]} />
        <Input handleChange={handleChange} name="gift_card_code" label="Code" value={formData["gift_card_code"]} />
        <Input handleChange={handleChange} name="expiration_date" label="Datum" value={formData["expiration_date"]} />
        <button
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:bg-gray-50'
          onClick={handlePrint}
        >
          PRINT
        </button>
        <p className='text-xs text-gray-400 leading-snug'>
          Lege die vorbedruckte Karte in den Drucker (Rückseite oben). Drucke auf A6.
        </p>
      </aside>

      {/* Card preview: 104mm × 147mm = 393 × 556px at 96dpi */}
      {/* In print mode this renders at exact card size with margin:0 */}
      <section
        className='preview relative bg-white shrink-0'
        style={{ width: '393px', height: '556px' }}
      >
        {/* Values — positioned to land on pre-printed dotted lines */}
        {/* Adjust TOP values (in px) to calibrate after a test print */}
        <div style={{
          position: 'absolute',
          left: '52px',   /* ~13mm from left edge */
          top: '284px',   /* WERT line — adjust after test print */
          fontSize: '14px',
          fontFamily: 'Arial, Helvetica, sans-serif',
          letterSpacing: '0.02em',
        }}>
          {formData.value}
        </div>

        <div style={{
          position: 'absolute',
          left: '52px',
          top: '349px',   /* CODE line — adjust after test print */
          fontSize: '14px',
          fontFamily: 'Arial, Helvetica, sans-serif',
          letterSpacing: '0.02em',
        }}>
          {formData.gift_card_code}
        </div>

        <div style={{
          position: 'absolute',
          left: '52px',
          top: '414px',   /* DATUM line — adjust after test print */
          fontSize: '14px',
          fontFamily: 'Arial, Helvetica, sans-serif',
          letterSpacing: '0.02em',
        }}>
          {formData.expiration_date}
        </div>

        {/* Screen-only: card background reference (hidden when printing) */}
        <div className='printHide absolute inset-0 pointer-events-none' style={{ opacity: 0.12 }}>
          <div style={{ position: 'absolute', top: '38%', left: '50%', transform: 'translateX(-50%)', fontSize: '28px', fontWeight: '900', whiteSpace: 'nowrap', fontFamily: 'Georgia, serif' }}>Flowers for you</div>
          <div style={{ position: 'absolute', top: '47%', left: '52px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', fontFamily: 'Arial' }}>WERT*</div>
          <div style={{ position: 'absolute', top: '50%', left: '52px', right: '52px', borderBottom: '1px dotted #000' }} />
          <div style={{ position: 'absolute', top: '57%', left: '52px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', fontFamily: 'Arial' }}>CODE</div>
          <div style={{ position: 'absolute', top: '60.5%', left: '52px', right: '52px', borderBottom: '1px dotted #000' }} />
          <div style={{ position: 'absolute', top: '67.5%', left: '52px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.15em', fontFamily: 'Arial' }}>DATUM</div>
          <div style={{ position: 'absolute', top: '71%', left: '52px', right: '52px', borderBottom: '1px dotted #000' }} />
        </div>

        {/* Border for screen only */}
        <div className='printHide absolute inset-0 border border-gray-300 pointer-events-none' />
      </section>
    </div>
  )
}
