import { Link } from "react-router-dom";
import { useGenre } from "../djing/GenreContext";
import { GENRE_OPTIONS, type GenreId } from "../djing/genres";

export function GenreBar() {
  const { genre, setGenre } = useGenre();

  return (
    <div className="genre-bar">
      <label className="genre-bar-label">
        <span>Style</span>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value as GenreId)}
          aria-label="DJ style this section is written for"
        >
          {GENRE_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
      <p className="genre-bar-hint">
        {genre === "any" ? (
          <>
            Pick a style to change the examples. Mix Ultra buttons stay the same.{" "}
            <Link to="/djing/style">How this music works</Link>.
          </>
        ) : (
          <>
            Examples follow this music. Mix Ultra buttons stay the same.{" "}
            <Link to="/djing/style">How this music works</Link>.
          </>
        )}
      </p>
    </div>
  );
}
