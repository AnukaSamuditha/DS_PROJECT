
export default function Label({title,name,styles}){
    return(
        <label htmlFor={name} style={styles} className={`text-sm font-medium text-white`}>
            {title}
        </label>
    )
}