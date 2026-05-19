"use client";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Shield, Database, CreditCard, Server, UserCheck, Cookie, Mail, AlertCircle, RefreshCw, Globe } from "lucide-react";

const Section = ({ icon: Icon, title, children }) => (
  <section className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-8 py-5 border-b border-slate-100 dark:border-zinc-800">
      <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--brand-color)15", color: "var(--brand-color)" }}>
        <Icon size={16} />
      </div>
      <h2 className="text-sm font-black uppercase italic tracking-tight text-slate-900 dark:text-white">{title}</h2>
    </div>
    <div className="px-8 py-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
      {children}
    </div>
  </section>
);

const Sub = ({ children }) => (
  <p className="font-bold text-slate-800 dark:text-slate-200 mt-2">{children}</p>
);

const Hl = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80" style={{ color: "var(--brand-color)" }}>{children}</a>
);

export default function Datenschutz() {
  const { language } = useLanguage();
  const de = language !== "en";

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "var(--brand-color)" }}>
          {de ? "Rechtliches" : "Legal"}
        </p>
        <h1 
          className="text-2xl sm:text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white"
          style={{ hyphens: "auto", wordBreak: "break-word" }}
        >
          {de ? "Datenschutzerklärung" : "Privacy Policy"}
        </h1>
        <p className="text-xs text-slate-400 mt-2">{de ? "Stand: Mai 2025 · DSGVO-konform" : "As of: May 2025 · GDPR-compliant"}</p>
      </div>

      <div className="space-y-5">

        {/* 1. Überblick */}
        <Section icon={Shield} title={de ? "1. Datenschutz auf einen Blick" : "1. Data Protection at a Glance"}>
          <Sub>{de ? "Allgemeine Hinweise" : "General Information"}</Sub>
          <p>
            {de
              ? "Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer nachfolgenden Datenschutzerklärung."
              : "The following information provides a simple overview of what happens to your personal data when you visit this website. Personal data is any data with which you can be personally identified. Detailed information on data protection can be found in our privacy policy below."}
          </p>
          <Sub>{de ? "Datenerfassung auf dieser Website" : "Data Collection on This Website"}</Sub>
          <p>
            {de
              ? "Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Die Kontaktdaten des Verantwortlichen finden Sie im Abschnitt 'Verantwortliche Stelle'. Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen (z. B. durch Eingabe in ein Kontaktformular oder bei der Buchung). Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst (Cookies, Logfiles)."
              : "Data processing on this website is carried out by the website operator. Contact details of the controller can be found in section 'Responsible Body'. Your data is collected, on the one hand, by you providing it to us (e.g., by entering it into a contact form or during booking). Other data is collected automatically or after your consent when you visit the website (cookies, log files)."}
          </p>
          <Sub>{de ? "Ihre Rechte" : "Your Rights"}</Sub>
          <p>
            {de
              ? "Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten (Art. 15 DSGVO). Sie haben außerdem ein Recht auf Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie Widerspruch gegen die Verarbeitung (Art. 21 DSGVO). Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO verstößt, steht Ihnen das Recht auf Beschwerde bei einer Aufsichtsbehörde zu."
              : "You have the right to obtain free information about the origin, recipient, and purpose of your stored personal data at any time (Art. 15 GDPR). You also have the right to rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20), and to object to processing (Art. 21 GDPR). You also have the right to lodge a complaint with a supervisory authority."}
          </p>
        </Section>

        {/* 2. Verantwortliche Stelle */}
        <Section icon={UserCheck} title={de ? "2. Verantwortliche Stelle (Art. 13 DSGVO)" : "2. Responsible Body (Art. 13 GDPR)"}>
          <p>
            <strong className="text-slate-800 dark:text-slate-100">Sinthujan Sivanantham</strong><br />
            Jettura – {de ? "Reisevermittlung" : "Travel Agency"}<br />
            Friedrich-Ebert-Platz 18<br />
            30459 Hannover<br />
            {de ? "Deutschland" : "Germany"}<br />
            E-Mail: <Hl href="mailto:support@jettura.com">support@jettura.com</Hl><br />
            {de ? "Telefon:" : "Phone:"} +49 160 8733984
          </p>
          <p className="text-xs text-slate-400">
            {de
              ? "Ein Datenschutzbeauftragter ist gemäß Art. 37 DSGVO nicht verpflichtend bestellt, da die Voraussetzungen (Art. 37 Abs. 1 DSGVO) nicht erfüllt sind."
              : "A data protection officer has not been appointed, as the requirements of Art. 37 para. 1 GDPR are not met."}
          </p>
        </Section>

        {/* 3. Hosting */}
        <Section icon={Server} title={de ? "3. Hosting & technische Infrastruktur" : "3. Hosting & Technical Infrastructure"}>
          <Sub>Vercel Inc.</Sub>
          <p>
            {de
              ? "Unsere Website wird bei Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA gehostet. Vercel verarbeitet beim Zugriff auf unsere Website automatisch Serverlogs (IP-Adresse, Browsertyp, aufgerufene Seite, Zeitpunkt). Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an stabilem Betrieb). Es besteht ein EU-Standardvertragsklauseln-Abkommen mit Vercel."
              : "Our website is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA. Vercel automatically processes server logs upon access (IP address, browser type, page accessed, timestamp). Legal basis: Art. 6 para. 1 lit. f GDPR (legitimate interest in stable operation). An EU Standard Contractual Clauses agreement exists with Vercel."}
          </p>
          <Sub>Supabase Inc.</Sub>
          <p>
            {de
              ? "Wir nutzen Supabase (970 Toa Payoh North, Singapur) als Datenbank-Backend für Benutzerkonten und gespeicherte Reisedaten. Bei Registrierung werden Name, E-Mail-Adresse und Passwort (verschlüsselt) gespeichert. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung). Supabase speichert Daten in der EU (Frankfurt/AWS eu-central-1) oder alternativ in den USA (mit SCCs)."
              : "We use Supabase (970 Toa Payoh North, Singapore) as a database backend for user accounts and stored travel data. Upon registration, name, email address and password (encrypted) are stored. Legal basis: Art. 6 para. 1 lit. b GDPR (contract performance). Supabase stores data in the EU (Frankfurt/AWS eu-central-1) or alternatively in the USA (with SCCs)."}
          </p>
          <Sub>{de ? "KI-Dienste (Groq / OpenAI)" : "AI Services (Groq / OpenAI)"}</Sub>
          <p>
            {de
              ? "Zur Bereitstellung unseres KI-Reiseplaners übertragen wir Suchanfragen (Reiseziele, Präferenzen – keine Klarnamen) an die Groq Cloud API (USA) oder OpenAI API (USA). Es bestehen SCCs. Es werden keine personenbezogenen Daten ohne Ihre ausdrückliche Eingabe übertragen. Rechtsgrundlage: Art. 6 Abs. 1 lit. b / lit. f DSGVO."
              : "To provide our AI travel planner, we transmit search queries (destinations, preferences – no real names) to the Groq Cloud API (USA) or OpenAI API (USA). SCCs are in place. No personal data is transferred without your explicit input. Legal basis: Art. 6 para. 1 lit. b / lit. f GDPR."}
          </p>
        </Section>

        {/* 4. Buchungsdaten */}
        <Section icon={Globe} title={de ? "4. Verarbeitung von Buchungs- und Reisedaten" : "4. Processing of Booking and Travel Data"}>
          <Sub>{de ? "Welche Daten erheben wir bei einer Buchung?" : "What data do we collect during a booking?"}</Sub>
          <p>
            {de
              ? "Zur Vermittlung von Reiseleistungen erheben wir folgende Daten: Vor- und Nachname, Geburtsdatum, Nationalität, Reisepassdaten (bei internationalen Flügen), Wohnanschrift, E-Mail-Adresse, Telefonnummer, Zahlungsdaten (nur verschlüsselt via Stripe/PayPal), Sitzplatzpräferenzen, Gepäckoptionen."
              : "To broker travel services, we collect: First and last name, date of birth, nationality, passport data (for international flights), home address, email address, phone number, payment data (only encrypted via Stripe/PayPal), seat preferences, luggage options."}
          </p>
          <Sub>{de ? "Weitergabe an Leistungsträger (Pflichtübermittlung)" : "Transmission to Service Providers (Mandatory Transfer)"}</Sub>
          <p>
            {de
              ? "Da wir als Reisevermittler tätig sind, ist die Übermittlung Ihrer Buchungsdaten an die jeweiligen Leistungsträger (z. B. Fluggesellschaften via Amadeus GDS, Hotelketten, Mietwagenanbieter) zwingend erforderlich, um den Vermittlungsauftrag auszuführen. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Die Leistungsträger sind für die weitere Verarbeitung selbst verantwortlich."
              : "As a travel intermediary, the transmission of your booking data to the respective service providers (e.g., airlines via Amadeus GDS, hotel chains, car rental companies) is mandatory to execute the brokerage order. Legal basis: Art. 6 para. 1 lit. b GDPR. Service providers are responsible for further processing themselves."}
          </p>
          <Sub>{de ? "Speicherdauer" : "Retention Period"}</Sub>
          <p>
            {de
              ? "Buchungsdaten werden für die Dauer der gesetzlichen Aufbewahrungspflicht (10 Jahre gem. § 147 AO / § 257 HGB) gespeichert. Kontodaten werden nach Löschung des Nutzerkontos unverzüglich gelöscht."
              : "Booking data is retained for the duration of the statutory retention period (10 years pursuant to § 147 AO / § 257 HGB). Account data is deleted immediately upon deletion of the user account."}
          </p>
        </Section>

        {/* 5. Zahlungsdienstleister */}
        <Section icon={CreditCard} title={de ? "5. Zahlungsdienstleister" : "5. Payment Service Providers"}>
          <p>
            {de
              ? "Zur Zahlungsabwicklung setzen wir externe, PCI-DSS-zertifizierte Zahlungsdienstleister ein:"
              : "We use external, PCI-DSS-certified payment service providers for payment processing:"}
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li><strong>Stripe, Inc.</strong> – 510 Townsend Street, San Francisco, CA 94103, USA (<Hl href="https://stripe.com/de/privacy">Datenschutz</Hl>)</li>
            <li><strong>PayPal (Europe)</strong> – 22-24 Boulevard Royal, 2449 Luxemburg (<Hl href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full">Datenschutz</Hl>)</li>
          </ul>
          <p>
            {de
              ? "Ihre vollständigen Zahlungsdaten werden ausschließlich verschlüsselt (TLS/SSL) an diese Anbieter übermittelt. Wir speichern keine Kreditkartendaten auf unseren Servern. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO."
              : "Your complete payment data is transmitted exclusively encrypted (TLS/SSL) to these providers. We do not store credit card data on our servers. Legal basis: Art. 6 para. 1 lit. b GDPR."}
          </p>
        </Section>

        {/* 6. Cookies */}
        <Section icon={Cookie} title={de ? "6. Cookies & Tracking (TTDSG / ePrivacy)" : "6. Cookies & Tracking (TTDSG / ePrivacy)"}>
          <p>
            {de
              ? "Unsere Website verwendet Cookies gemäß den Anforderungen des TTDSG (Telekommunikation-Telemedien-Datenschutz-Gesetz) und der ePrivacy-Richtlinie. Technisch notwendige Cookies werden ohne Einwilligung gesetzt. Alle weiteren Cookies (Analyse, Marketing, Drittanbieter) werden nur nach Ihrer ausdrücklichen Einwilligung aktiviert."
              : "Our website uses cookies in accordance with the requirements of TTDSG (Telecommunications and Telemedia Data Protection Act) and the ePrivacy Directive. Technically necessary cookies are set without consent. All other cookies (analytics, marketing, third-party) are only activated after your explicit consent."}
          </p>
          <div className="overflow-x-auto">
            <table className="text-xs w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-700">
                  <th className="text-left py-2 pr-4 font-bold text-slate-700 dark:text-slate-300">{de ? "Kategorie" : "Category"}</th>
                  <th className="text-left py-2 pr-4 font-bold text-slate-700 dark:text-slate-300">{de ? "Rechtsgrundlage" : "Legal Basis"}</th>
                  <th className="text-left py-2 font-bold text-slate-700 dark:text-slate-300">{de ? "Einwilligung nötig?" : "Consent required?"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {[
                  [de ? "Notwendige Cookies" : "Necessary Cookies", "Art. 6 Abs. 1 lit. f DSGVO", de ? "Nein" : "No"],
                  [de ? "Funktionale Cookies" : "Functional Cookies", "Art. 6 Abs. 1 lit. a DSGVO", de ? "Ja" : "Yes"],
                  [de ? "Analyse-Cookies" : "Analytics Cookies", "Art. 6 Abs. 1 lit. a DSGVO", de ? "Ja" : "Yes"],
                  [de ? "Marketing-Cookies" : "Marketing Cookies", "Art. 6 Abs. 1 lit. a DSGVO", de ? "Ja" : "Yes"],
                  [de ? "Drittanbieter (Mapbox etc.)" : "Third-party (Mapbox etc.)", "Art. 6 Abs. 1 lit. a DSGVO", de ? "Ja" : "Yes"],
                ].map(([cat, basis, consent]) => (
                  <tr key={cat}>
                    <td className="py-2 pr-4">{cat}</td>
                    <td className="py-2 pr-4 text-slate-400">{basis}</td>
                    <td className="py-2">{consent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400">
            {de
              ? "Sie können Ihre Cookie-Einwilligung jederzeit über den Button 'Cookie-Einstellungen' im Footer widerrufen."
              : "You can withdraw your cookie consent at any time via the 'Cookie Settings' button in the footer."}
          </p>
        </Section>

        {/* 7. Ihre Rechte */}
        <Section icon={UserCheck} title={de ? "7. Ihre Rechte als betroffene Person (Art. 15–22 DSGVO)" : "7. Your Rights as a Data Subject (Art. 15–22 GDPR)"}>
          <ul className="space-y-2">
            {(de ? [
              ["Art. 15 DSGVO", "Auskunftsrecht – Kopie Ihrer gespeicherten Daten"],
              ["Art. 16 DSGVO", "Berichtigungsrecht – Korrektur unrichtiger Daten"],
              ["Art. 17 DSGVO", "Recht auf Löschung ('Recht auf Vergessenwerden')"],
              ["Art. 18 DSGVO", "Recht auf Einschränkung der Verarbeitung"],
              ["Art. 20 DSGVO", "Recht auf Datenübertragbarkeit (maschinenlesbar)"],
              ["Art. 21 DSGVO", "Widerspruchsrecht gegen berechtigte Interessen"],
              ["Art. 7 Abs. 3 DSGVO", "Widerruf Ihrer erteilten Einwilligung"],
              ["Art. 77 DSGVO", "Beschwerderecht bei der Aufsichtsbehörde"],
            ] : [
              ["Art. 15 GDPR", "Right of access – copy of your stored data"],
              ["Art. 16 GDPR", "Right to rectification of inaccurate data"],
              ["Art. 17 GDPR", "Right to erasure ('right to be forgotten')"],
              ["Art. 18 GDPR", "Right to restriction of processing"],
              ["Art. 20 GDPR", "Right to data portability (machine-readable)"],
              ["Art. 21 GDPR", "Right to object to legitimate interests processing"],
              ["Art. 7 para. 3 GDPR", "Right to withdraw consent"],
              ["Art. 77 GDPR", "Right to lodge a complaint with a supervisory authority"],
            ]).map(([art, desc]) => (
              <li key={art} className="flex gap-3">
                <span className="font-bold text-xs shrink-0 pt-0.5" style={{ color: "var(--brand-color)" }}>{art}</span>
                <span>{desc}</span>
              </li>
            ))}
          </ul>
          <p>
            {de
              ? "Zur Ausübung Ihrer Rechte wenden Sie sich bitte per E-Mail an:"
              : "To exercise your rights, please contact us by email at:"}{" "}
            <Hl href="mailto:support@jettura.com">support@jettura.com</Hl>
          </p>
          <Sub>{de ? "Zuständige Aufsichtsbehörde:" : "Competent supervisory authority:"}</Sub>
          <p>
            {de ? "Landesbeauftragte für Datenschutz Niedersachsen" : "State Commissioner for Data Protection Lower Saxony"}<br />
            Prinzenstraße 5, 30159 Hannover<br />
            <Hl href="https://www.lfd.niedersachsen.de">www.lfd.niedersachsen.de</Hl>
          </p>
        </Section>

        {/* 8. Änderungen */}
        <Section icon={RefreshCw} title={de ? "8. Aktualität und Änderung dieser Datenschutzerklärung" : "8. Updates to this Privacy Policy"}>
          <p>
            {de
              ? "Diese Datenschutzerklärung ist aktuell gültig und hat den Stand Mai 2025. Durch die Weiterentwicklung unserer Website oder aufgrund geänderter gesetzlicher bzw. behördlicher Vorgaben kann es notwendig werden, diese Datenschutzerklärung zu ändern. Die jeweils aktuelle Datenschutzerklärung kann jederzeit auf dieser Seite abgerufen werden."
              : "This privacy policy is currently valid and has the status of May 2025. Due to the further development of our website or changes in legal or regulatory requirements, it may be necessary to amend this privacy policy. The current privacy policy can be accessed on this page at any time."}
          </p>
        </Section>

      </div>
    </div>
  );
}
