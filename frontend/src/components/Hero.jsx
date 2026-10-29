export default function Hero({ children }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__atmosphere" aria-hidden="true">
        <span className="hero__glow hero__glow--a" />
        <span className="hero__glow hero__glow--b" />
        <span className="hero__ridge" />
      </div>
      <div className="container hero__inner">
        <h1 id="hero-title" className="hero__title">
          Weather, <span className="hero__accent">Made Simple.</span>
        </h1>
        <p className="hero__subtitle">
          Current weather and a 5-day forecast for any city in the world. Search a city and plan your day.
        </p>
        {children}
      </div>
    </section>
  );
}
