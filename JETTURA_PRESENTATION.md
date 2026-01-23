# Jettura: Die Zukunft der Reiseplanung
*(Pitch Deck & Präsentationsnotizen)*

---

## 🚀 1. Die Vision
**"One App. Everything."**

Jettura ist nicht einfach nur eine weitere Buchungsseite. Es ist ein **ganzheitliches Reise-Ökosystem**. Wir verbinden die Präzision einer Suchmaschine mit der Ästhetik eines Premium-Magazins und der Intelligenz eines persönlichen Assistenten.

---

## 🛑 2. Das Problem
Reisende heute sind überfordert:
*   **Fragmentierung**: Flüge bei Skyscanner, Hotels bei Booking, Inspiration auf Instagram, Notizen in Apple Notes.
*   **Veraltetes Design**: Viele Reise-Tools wirken funktional, aber lieblos und kompliziert.
*   **Fehlende Personalisierung**: Apps kennen deine Ziele nicht.

---

## 💡 3. Die Lösung: Jettura
Jettura zentralisiert den gesamten Reisezyklus in einer **einzigen, wunderschönen Oberfläche**.

### 🔥 Kern-Features (Die "Wow"-Faktoren)

#### A. Smart Flight Search ✈️
*   **Technologie**: Integration von Top-APIs (Amadeus / Aviasales) für Echtzeit-Preise.
*   **Design**: Übersichtliche "Boarding Pass"-Optik. Kein Clutter.
*   **Feature**: Multi-Stopp und One-Way Unterstützung mit intuitiver Filterung.

#### B. Premium Hotel Intelligence 🏨
*   **Kuratierung**: Wir zeigen nicht nur Listen, wir zeigen Erlebnisse.
*   **Maps-Integration**: Interaktive Google-Maps-Style Karten (Mapbox) direkt in der Karte. Rote "Pin"-Marker zeigen exakte Standorte.
*   **Content**: "Intelligence Engine" liefert verifizierte Details (WLAN, Pool, GDS Sync).

#### C. Community & Stories ✍️
*   **Inspiration**: Nutzer teilen ihre Reiseberichte in einem editorialen Blog-Format.
*   **Interaktion**: Löschen und Bearbeiten eigener Beiträge (Supabase Auth geschützt).
*   **Visuell**: Große Hero-Images, automatisches dunkles Design (Dark Mode).

#### D. AI Planner 🤖
*   **Die Magie**: Ein Klick auf "Plan Now" generiert basierend auf dem Zielort eine individuelle Reiseroute.

---

## 🎨 4. Design & UX (Das "Premium"-Gefühl)
Wir setzen auf **Emotional Design**:
*   **Golden Rule Layout**: Alle Detailseiten (`SavedFlight`, `Hotel`) folgen einem strikten Grid-System (`max-w-7xl`).
*   **Visuelle Konsistenz**:
    *   Buttons: "JETZT BUCHEN" mit Shine-Effekt (CSS Animation).
    *   Headings: Einheitliche Typografie (maximal `text-4xl` für Eleganz).
    *   Maps: Einheitliche Mini-Maps (50px Mobile -> 144px Desktop).
*   **Dark Mode**: Vollständige Unterstützung für ein kinoreifes Erlebnis bei Nacht.

---

## 🛠️ 5. Der Tech-Stack (Für Entwickler & CTOs)
Gebaut für Geschwindigkeit, Skalierbarkeit und Developer Experience:

### Frontend Architektur
*   **Framework**: React 18 + Vite (HMR, schnelle Builds).
*   **Routing**: React Router DOM v6 mit dynamischen Parametern.
*   **State Management**: Context API (`LanguageContext`, `AuthContext`, `ThemeContext`) für sauberen Datenfluss.

### Styling & UI
*   **Tailwind CSS**: Utility-first Ansatz für schnelle UI-Iterationen und responsive Designs.
*   **Framer Motion**: Deklarative Animationen für komplexe Page-Transitions und Micro-Interactions.
*   **Icons**: Lucide React für konsistente, leichtgewichtige SVG-Icons.
*   **Maps**: Mapbox GL JS Integration für hochperformante Vektorkarten mit Custom-Markern.

### Backend & Services
*   **Supabase**:
    *   **Auth**: Sichere Authentifizierung inkl. Social Logins.
    *   **Database**: PostgreSQL mit Row Level Security (RLS) für Nutzerdaten (`saved_flights`, `posts`).
    *   **Storage**: Effizientes Speichern von Beitragsbildern.
*   **APIs**:
    *   **Amadeus & Aviasales**: Flugdaten-Aggregation.
    *   **Mapbox Geocoding**: Umwandlung von Ortsnamen in Koordinaten.

---

## 📈 6. Business & Markt (Für Investoren)
**Jettura schließt die Lücke zwischen "Suchen" und "Träumen".**

### Umsatzmodelle
1.  **Affiliate & Commission**: Verdienst pro Flug/Hotel-Buchung über Partner-APIs (bereits technisch vorbereitet via Deep-Links).
2.  **Premium Subscription**: Zukünftiges "Jettura Pro" für AI-Features und exklusive Deals.
3.  **Sponsored Content**: Hotels/Airlines können in den "Stories" gefeatured werden.

### Markt-Validierung
*   Der Trend geht weg von rein funktionalen Tools hin zu **Experience-Plattformen** (siehe Airbnb's Erfolg mit "Experiences").
*   Jettura bedient die "Gen Z" und "Millennial" Zielgruppe, die Mobile-First und Design-First erwartet.

---

## 🎯 7. Live Demo (Der Pitch Flow)
*Öffnen Sie die Startseite (Home).*
1.  **Der Hook**: Nutzen Sie den neuen interaktiven "Showcase"-Bereich. Switchen Sie zwischen "Smart Flights", "Premium Hotels" und "Stories".
2.  **Der Beweis**: Klicken Sie auf "Mehr Erfahren" bei den Karten, um die echte Tiefe der Anwendung zu zeigen (Modals, Alerts).
3.  **Die Tiefe**: Navigieren Sie zu einer Detailseite (z.B. Paris Flug), zeigen Sie die interaktive Map mit dem roten Pin und den Dark Mode Switch.

---

## 🔮 8. Roadmap
*   **eSIM Integration**: Datenpakete direkt in der App buchen.
*   **Mietwagen**: Nahtlose Anbindung an Car-Rental-APIs.
*   **Mobile App**: Native iOS/Android Version basierend auf diesem React-Code (Capacitor/React Native).

---

*Jettura - Travel Smart. Travel Beautiful.*
