import React, { useState, useEffect, useRef } from 'react'
import cardImg from './assets/card.jpg';

function today() {
  const d = new Date();
  return {
    dd: String(d.getDate()).padStart(2, '0'),
    mm: String(d.getMonth() + 1).padStart(2, '0'),
    yyyy: String(d.getFullYear()),
  };
}

function Card({ value, code, dd, mm, yyyy, calibrate, cursor, onMouseMove, sectionRef, isLast }) {
  const displayValue = value ? `CHF ${value}.–` : '';
  const displayDate = (dd || mm || yyyy) ? `${dd}. ${mm}. ${yyyy}` : '';

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
        top: '213px',
        fontSize: '27px',
        lineHeight: '1',
        fontFamily: '"Shadows Into Light", cursive',
      }}>
        {displayValue}
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
        top: '303px',
        fontSize: '27px',
        lineHeight: '1',
        fontFamily: '"Shadows Into Light", cursive',
      }}>
        {displayDate}
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
  const t = today();

  const [formData, setFormData] = useState({
    value: "",
    gift_card_codes: "",
    dd: t.dd,
    mm: t.mm,
    yyyy: t.yyyy,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    queryParams.forEach((value, key) => {
      setFormData(prev => ({ ...prev, [key]: value }))
    })
  }, [])

  const handlePrint = () => { window.print() }

  const codes = formData.gift_card_codes
    .split('\n')
    .map(c => c.trim())
    .filter(c => c.length > 0);
  const displayCodes = codes.length > 0 ? codes : [''];

  const inputClass = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
  const labelClass = "block text-gray-700 text-sm font-bold mb-1";

  return (
    <div className='flex flex-row items-start gap-8 p-8'>
      {/* Sidebar */}
      <aside className='printHide flex flex-col gap-4 w-56 shrink-0'>
        <h1 className='text-base font-bold text-gray-800'>TOM FLOWERS<br />Gift Card Printer</h1>

        {/* Value */}
        <div>
          <label className={labelClass} htmlFor="value">Wert (CHF)</label>
          <input
            className={inputClass}
            type="number"
            id="value"
            name="value"
            onChange={handleChange}
            value={formData.value}
            placeholder="50"
          />
        </div>

        {/* Codes */}
        <div>
          <label className={labelClass} htmlFor="gift_card_codes">Codes (einer pro Zeile)</label>
          <textarea
            className={`${inputClass} font-mono text-sm`}
            id="gift_card_codes"
            name="gift_card_codes"
            rows={6}
            onChange={handleChange}
            value={formData.gift_card_codes}
            placeholder={"TF-2025-A1B2\nTF-2025-C3D4"}
          />
          <p className='text-xs text-gray-400 mt-1'>{displayCodes.filter(c => c).length} Karte(n)</p>
        </div>

        {/* Date — three fields */}
        <div>
          <label className={labelClass}>Datum</label>
          <div className='flex gap-2'>
            <div className='w-12'>
              <input className={inputClass + ' text-center px-1'} name="dd" maxLength={2} onChange={handleChange} value={formData.dd} placeholder="TT" />
              <p className='text-xs text-center text-gray-400 mt-0.5'>Tag</p>
            </div>
            <div className='w-12'>
              <input className={inputClass + ' text-center px-1'} name="mm" maxLength={2} onChange={handleChange} value={formData.mm} placeholder="MM" />
              <p className='text-xs text-center text-gray-400 mt-0.5'>Monat</p>
            </div>
            <div className='w-20'>
              <input className={inputClass + ' text-center px-1'} name="yyyy" maxLength={4} onChange={handleChange} value={formData.yyyy} placeholder="JJJJ" />
              <p className='text-xs text-center text-gray-400 mt-0.5'>Jahr</p>
            </div>
          </div>
        </div>

        <button
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:bg-gray-50'
          onClick={handlePrint}
        >
          PRINT
        </button>

        <p className='text-xs text-gray-400 leading-snug'>
          Druckformat: 104 × 147 mm (A6 ohne Schnittrand). Lege die vorbedruckten Karten entsprechend in den Drucker.
        </p>

        {/* Calibrate — subtle toggle */}
        <div className='flex items-center gap-2 pt-1'>
          <button
            onClick={() => setCalibrate(c => !c)}
            className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${calibrate ? 'bg-yellow-400' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${calibrate ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </button>
          <span className='text-xs text-gray-400'>Kalibrierung</span>
        </div>
      </aside>

      {/* One card per code */}
      <div className='cards-wrapper flex flex-col gap-8'>
        {displayCodes.map((code, i) => (
          <Card
            key={i}
            value={formData.value}
            code={code}
            dd={formData.dd}
            mm={formData.mm}
            yyyy={formData.yyyy}
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
