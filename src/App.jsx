import React, { useState, useEffect, useRef } from 'react'
import Input from './components/Input';
import cardImg from './assets/card.jpg';

function todayFormatted() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

export default function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const [calibrate, setCalibrate] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

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
        <button
          className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight ${calibrate ? 'bg-yellow-100 border-yellow-400 text-yellow-800' : 'text-gray-500'}`}
          onClick={() => setCalibrate(c => !c)}
        >
          {calibrate ? 'CALIBRATE ON' : 'CALIBRATE OFF'}
        </button>
        <p className='text-xs text-gray-400 leading-snug'>
          Lege die vorbedruckte Karte in den Drucker (Rückseite oben). Drucke auf A6.
        </p>
      </aside>

      {/* Card preview: 104mm × 147mm = 393 × 556px at 96dpi */}
      {/* In print mode this renders at exact card size with margin:0 */}
      <section
        ref={sectionRef}
        className='preview relative bg-white shrink-0'
        style={{ width: '393px', height: '556px', cursor: calibrate ? 'crosshair' : 'default' }}
        onMouseMove={e => {
          if (!calibrate) return;
          const rect = sectionRef.current.getBoundingClientRect();
          setCursor({ x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) });
        }}
      >
        {/* Values — positioned ON the dotted lines, after the labels */}
        {/* TOP = vertical center of each label row, LEFT = after the label text */}
        {/* Adjust after a test print */}
        <div style={{
          position: 'absolute',
          left: '110px',
          top: '232px',
          fontSize: '13px',
          lineHeight: '1',
          fontFamily: '"Shadows Into Light", cursive',
        }}>
          {formData.value}
        </div>

        <div style={{
          position: 'absolute',
          left: '110px',
          top: '270px',
          fontSize: '13px',
          lineHeight: '1',
          fontFamily: '"Shadows Into Light", cursive',
        }}>
          {formData.gift_card_code}
        </div>

        <div style={{
          position: 'absolute',
          left: '110px',
          top: '312px',
          fontSize: '13px',
          lineHeight: '1',
          fontFamily: '"Shadows Into Light", cursive',
        }}>
          {formData.expiration_date}
        </div>

        {/* Screen-only: card photo background */}
        <img
          src={cardImg}
          className='printHide absolute inset-0 w-full h-full pointer-events-none'
          style={{ objectFit: 'fill', opacity: 0.5 }}
          alt=""
        />

        {/* Calibration overlay */}
        {calibrate && (
          <div className='printHide absolute inset-0 pointer-events-none' style={{ zIndex: 10 }}>
            {/* Crosshair lines */}
            <div style={{ position: 'absolute', top: cursor.y, left: 0, right: 0, borderTop: '1px solid red' }} />
            <div style={{ position: 'absolute', left: cursor.x, top: 0, bottom: 0, borderLeft: '1px solid red' }} />
            {/* Coordinate readout */}
            <div style={{
              position: 'absolute',
              top: cursor.y + 6,
              left: cursor.x + 6,
              background: 'red',
              color: 'white',
              fontSize: '11px',
              padding: '2px 5px',
              borderRadius: '3px',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
            }}>
              x: {cursor.x} / y: {cursor.y}
            </div>
          </div>
        )}

        {/* Border for screen only */}
        <div className='printHide absolute inset-0 border border-gray-300 pointer-events-none' />
      </section>
    </div>
  )
}
