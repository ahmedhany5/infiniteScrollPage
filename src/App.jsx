import { useCallback, useEffect, useState } from "react";

import "./style.css";

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const limit = 100;
  const imageRef = useCallback((currentImage) => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.unobserve(currentImage);
        }
      },
      { threshold: 1 }
    );

    observer.observe(currentImage);
  }, []);

  async function getData(url) {
    setLoading(true);
    await fetch(url)
      .then((res) => res.json())
      .then((data) => setPhotos(data));
  }

  useEffect(() => {
    getData(
      `http://localhost:3000/photos-short-list?_page=1&_limit=${limit}`
    ).finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid">
      {photos.map((photo) => (
        <img ref={imageRef} key={photo.id} src={photo.url} alt="" />
      ))}
      {loading &&
        Array.from({ length: limit }, (_, i) => i).map((p) => {
          return (
            <div key={p} className="skeleton">
              Loading...
            </div>
          );
        })}
    </div>
  );
}
