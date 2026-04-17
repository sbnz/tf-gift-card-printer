import React, { useState, useEffect } from 'react'
import Input from './components/Input';

export default function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const [formData, setFormData] = useState({
    gift_card_code: "",
    value: "",
    expiration_date: "",
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
      setFormData(prev => {
        return { ...prev, [key]: value }
      })
    })
  }, [])
  const handlePrint = () => {
    window.print()
  }
  return (
    <div className='flex flex-row max-w-6xl mx-auto justify-between items-center gap-8 p-8'>
      <aside className='printHide flex flex-col gap-4 w-64 shrink-0'>
        <h1 className='text-lg font-bold text-gray-800'>TOM FLOWERS<br />Gift Card Printer</h1>
        <Input handleChange={handleChange} name="gift_card_code" label="Gift Card Code" value={formData["gift_card_code"]} />
        <Input handleChange={handleChange} name="value" label="Value (€)" value={formData["value"]} />
        <Input handleChange={handleChange} name="expiration_date" label="Expiration Date" value={formData["expiration_date"]} />
        <button
          className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight hover:bg-gray-50'
          onClick={handlePrint}
        >
          PRINT
        </button>
      </aside>

      <section className='preview flex flex-col w-[745px] h-[529px] shadow-xl border overflow-hidden rounded-sm shrink-0'>
        {/* Header */}
        <div className='bg-green-800 text-white flex items-center justify-center py-5'>
          <span className='font-["quickpen"] text-4xl tracking-wide'>Tom Flowers</span>
        </div>

        {/* Main content */}
        <div className='flex-1 flex flex-col items-center justify-center gap-5 bg-white'>
          <span className='text-xs uppercase tracking-[0.3em] text-gray-400'>Geschenkgutschein</span>

          <div className='text-[90px] font-bold text-green-800 leading-none'>
            {formData.value ? `€\u202F${formData.value}` : '€\u00A0—'}
          </div>

          <div className='px-8 py-3 border-2 border-green-800 rounded'>
            <span className='font-mono text-xl tracking-[0.25em] text-green-900'>
              {formData.gift_card_code || '—'}
            </span>
          </div>

          <span className='text-sm text-gray-500'>
            Gültig bis:{' '}
            <span className='text-gray-700 font-semibold'>
              {formData.expiration_date || '—'}
            </span>
          </span>
        </div>

        {/* Footer */}
        <div className='bg-green-800 text-white py-2 text-center'>
          <span className='text-xs tracking-[0.3em] uppercase'>tomflowers.de</span>
        </div>
      </section>
    </div>
  )
}
