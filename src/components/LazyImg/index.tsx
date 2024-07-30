import { useEffect, useRef } from "react";

const ob = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        ob.unobserve(img);
        const src = img.getAttribute("data-src");

        if (src) {
          const imgDom = document.createElement("img");
          imgDom.onload = () => {
            img.src = src;
          };
          imgDom.src = src;
        }
      }
    });
  },
  {
    threshold: 1,
  }
);

const LazyImg = (props) => {
  const { src, dataSrc, className } = props;
  const imgRef = useRef(null);
  useEffect(() => {
    if (imgRef.current) {
      ob.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        ob.unobserve(imgRef.current);
      }
    };
  }, []);
  return (
    <img ref={imgRef} className={className} src={src} data-src={dataSrc} />
  );
};

export default LazyImg;
