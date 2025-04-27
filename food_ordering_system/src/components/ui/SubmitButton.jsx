
export default function SubmitButton({title,type,styles,onClick,isSubmitting,isValid}){
    return(
        <button disabled={isSubmitting || !isValid} type={type} onClick={onClick} className={`w-full text-sm font-semibold rounded-[8px] h-[2.5rem] cursor-pointer ${styles} ${(!isValid || isSubmitting) ? 'bg-zinc-300 text-white' : 'bg-black text-white'}`}>
            {title}
        </button>
    )
}