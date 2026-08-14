import { SOURCE_VIDEOS, type SourceVideoId } from "../djing/videos";

export function YouTubeEmbed({
  video,
  caption,
}: {
  video: SourceVideoId;
  caption?: string;
}) {
  const src = SOURCE_VIDEOS[video];
  return (
    <figure className="yt-embed">
      <div className="yt-embed-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${src.id}`}
          title={src.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      <figcaption>
        <a href={src.watchUrl} target="_blank" rel="noreferrer">
          Watch on YouTube: {src.title}
        </a>
        <span className="yt-embed-credit">{caption ?? src.credit}</span>
      </figcaption>
    </figure>
  );
}
