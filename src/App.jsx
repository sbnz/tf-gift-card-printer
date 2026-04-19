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

function Card({ value, code, expiration_date, calibrate, cursor, onMouseMove, sectionRef, isLast }) {
  return (
    <section
      ref={sectionRef}
      className='preview relative bg-white shrink-0'
      style={{
        width: '393px',
        height: '556px',
        cursor: calibrate ? 'crosshair' : 'default',
        pageBreakAfter: isLast ? 'auto' : 'always',
        breakAfter: isLast ? 'auto' : 'page',
      }}
      onMouseMove={onMouseMove}
    >
      <div style={{
        position: 'absolute',
        left: '110px',
        top: '218px',
        fontSize: '27px',
        lineHeight: '1',
        fontFamily: '"Shadows Into Light", cursive',
      }}>
        {value}
      </div>

      <div style={{
        position: 'absolute',
        left: '110px',
        top: '265px',
        fontSize: '18px',
        lineHeight: '1',
        fontFamily: '"Source Code Pro", monospace',
      }}>
        {code}
      </div>

      <div style={{
        position: 'absolute',
        left: '110px',
        top: '298px',
        fontSize: '27px',
        lineHeight: '1',
        fontFamily: '"Shadows Into Light", cursive',
      }}>
        {expiration_date}
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
          <div style={{ position: 'absolute', top: cursor.y, left: 0, right: 0, borderTop: '1px solid red' }} />
          <div style={{ position: 'absolute', left: cursor.x, top: 0, bottom: 0, borderLeft: '1px solid red' }} />
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
  )
}

export default function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const [calibrate, setCalibrate] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  const [formData, setFormData] = useState({
    value: "",
    gift_card_codes: "",
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

  const codes = formData.gift_card_codes
    .split('\n')
    .map(c => c.trim())
    .filter(c => c.length > 0);

  const displayCodes = codes.length > 0 ? codes : [''];

  return (
    <div className='flex flex-row items-start gap-8 p-8'>
      {/* Sidebar form */}
      <aside className='printHide flex flex-col gap-4 w-56 shrink-0'>
        <h1 className='text-base font-bold text-gray-800'>TOM FLOWERS<br />Gift Card Printer</h1>
        <Input handleChange={handleChange} name="value" label="Wert (z.B. CHF 50)" value={formData["value"]} />
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="gift_card_codes">
            Codes (einer pro Zeile)
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-mono text-sm"
            id="gift_card_codes"
            name="gift_card_codes"
            rows={6}
            onChange={handleChange}
            value={formData["gift_card_codes"]}
            placeholder={"TF-2025-A1B2\nTF-2025-C3D4\nTF-2025-E5F6"}
          />
          <p className='text-xs text-gray-400 mt-1'>{displayCodes.filter(c => c).length} Karte(n)</p>
        </div>
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
          Lege die vorbedruckten Karten in den Drucker. Drucke auf A6.
        </p>
      </aside>

      {/* One card per code */}
      <div className='flex flex-col gap-8'>
        {displayCodes.map((code, i) => (
          <Card
            key={i}
            value={formData.value}
            code={code}
            expiration_date={formData.expiration_date}
            calibrate={calibrate}
            cursor={cursor}
            sectionRef={i === 0 ? sectionRef : null}
            isLast={i === displayCodes.length - 1}
            onMouseMove={e => {
              if (!calibrate) return;
              const rect = e.currentTarget.getBoundingClientRect();
              setCursor({ x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) });
            }}
          />
        ))}
      </div>
    </div>
  )
}
