export default function Input({handleChange, name, label, value}) {
  return (
    <div className="">
      <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor={name}>
        {label}
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        id={name}
        name={name}
        onChange={handleChange}
        value={value}
      />
    </div>
  )
}
