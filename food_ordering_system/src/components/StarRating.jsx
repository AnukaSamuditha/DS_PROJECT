export default function StarRating({ rating = 0, outOf = 5 }) {
    const filledStars = Math.round(rating);
    const emptyStars = outOf - filledStars;
  
    return (
      <div className="flex items-center text-yellow-400">
        {Array.from({ length: filledStars }).map((_, i) => (
          <span key={`filled-${i}`}>&#9733;</span> // ★
        ))}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className="text-zinc-500">
            &#9733;
          </span> // ☆ but styled like dimmed star
        ))}
      </div>
    );
  }
  