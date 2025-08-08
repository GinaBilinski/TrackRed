function Home() {
  return (
    <main className="home">
      {/* Bildbanner */}
      <section className="home__banner">
        <img src="src/assets/images/banner.png" alt="Banner" />
      </section>

      {/* Inhalte im Container */}
      <div className="home__content">
        <section className="home__intro">
          <h1>
            Willkommen bei <span>TrackRed</span>
          </h1>
          <p className="home__subtitle">
            Deine digitale Lösung zur sicheren Verwaltung von Blutwerten.
          </p>
        </section>

        <section className="home__info">
          <h2>Warum TrackRed?</h2>
          <p>
            Regelmäßige Blutuntersuchungen liefern wichtige Hinweise auf deine
            Gesundheit – doch oft gehen die Ergebnisse verloren oder sind
            unübersichtlich dokumentiert.
          </p>
          <p>
            <strong>TrackRed</strong> hilft dir, deine Werte strukturiert zu
            erfassen, zu verfolgen und mit Ärzt:innen zu besprechen – jederzeit
            und überall.
          </p>
        </section>

        <section className="home__benefits">
          <h2>Deine Vorteile:</h2>
          <ul>
            <li>Sichere Speicherung deiner Blutwerte</li>
            <li>Übersichtlicher Verlauf und Vergleich</li>
            <li>Jederzeit Zugriff</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

export default Home;
