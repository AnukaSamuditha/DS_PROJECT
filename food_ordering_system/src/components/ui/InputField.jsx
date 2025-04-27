export default function InputField({
  name,
  type,
  styles,
  onChange,
  value,
  placeholder,
  register,
  error,
}) {
  return (
    <div className="w-full h-auto">
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full border border-[#E5E5E5] bg-transparent rounded-[8px] h-[2.5rem]  text-zinc-800 text-sm p-4 placeholder-zinc-400 ${styles}`}
        placeholder={placeholder}
        {...register(name)}
      />
      {error && <small className="text-xs text-red-600 font-medium">{error}</small>}
    </div>
  );
}
