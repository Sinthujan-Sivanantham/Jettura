"use client";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Building2, Phone, Mail, Scale, AlertCircle, Globe, FileText, Shield } from "lucide-react";

const Section = ({ icon: Icon, title, children, color = "var(--brand-color)" }) => (
  <section className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-8 py-5 border-b border-slate-100 dark:border-zinc-800">
      <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}15`, color }}>
        <Icon size={16} />
      </div>
      <h2 className="text-sm font-black uppercase italic tracking-tight text-slate-900 dark:text-white">{title}</h2>
    </div>
    <div className="px-8 py-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
      {children}
    </div>
  </section>
);

export default function Impressum() {
  const { language } = useLanguage();
  const de = language !== "en";

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: "var(--brand-color)" }}>
          {de ? "Rechtliches" : "Legal"}
        </p>
        <h1 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white">
          {de ? "Impressum" : "Legal Notice (Impressum)"}
        </h1>
        <p className="text-xs text-slate-400 mt-2">{de ? "Stand: Mai 2025" : "As of: May 2025"}</p>
      </div>

      <div className="space-y-5">

        {/* §5 TMG */}
        <Section icon={Building2} title={de ? "Angaben gemäß § 5 TMG" : "Information pursuant to § 5 TMG"}>
          <p>
            <strong className="text-slate-800 dark:text-slate-100">Sinthujan Sivanantham</strong><br />
            {de ? "Einzelunternehmer" : "Sole trader"}<br />
            {de ? "handelnd unter:" : "trading as:"} <strong>Jettura</strong> – {de ? "Ihr Reisevermittler" : "Your Travel Agent"}<br />
            Friedrich-Ebert-Platz 18<br />
            30459 Hannover<br />
            {de ? "Deutschland" : "Germany"}
          </p>
        </Section>

        {/* Kontakt */}
        <Section icon={Phone} title={de ? "Kontakt" : "Contact"}>
          <p>
            {de ? "Telefon:" : "Phone:"} +49 160 8733984<br />
            E-Mail:{" "}
            <a href="mailto:support@jettura.com" className="underline hover:opacity-80 transition-opacity" style={{ color: "var(--brand-color)" }}>
              support@jettura.com
            </a>
          </p>
        </Section>

        {/* Steuer */}
        <Section icon={FileText} title={de ? "Steuerliche Angaben" : "Tax Information"}>
          <p>
            {de
              ? "Es liegt keine Umsatzsteuer-Identifikationsnummer vor, da die Kleinunternehmerregelung gemäß § 19 UStG greift. Umsatzsteuer wird daher nicht ausgewiesen."
              : "No VAT identification number is available, as the small business regulation pursuant to § 19 UStG applies. VAT is therefore not shown."}
          </p>
        </Section>

        {/* Reisevermittler-Status */}
        <Section icon={Globe} title={de ? "Status als Reisevermittler gemäß § 651a BGB" : "Status as Travel Intermediary pursuant to § 651a BGB"}>
          <p>
            {de
              ? "Jettura (Sinthujan Sivanantham) ist ein gewerblicher Reisevermittler und kein Reiseveranstalter im Sinne des § 651a BGB. Jettura vermittelt ausschließlich Einzelleistungen (Flüge, Hotels, Mietwagen, eSIMs etc.) im Namen und auf Rechnung der jeweiligen Leistungsträger (Fluggesellschaften, Hoteliers, Autovermieter etc.). Der Reiseleistungsvertrag kommt ausschließlich zwischen dem Kunden und dem Leistungsträger zustande."
              : "Jettura (Sinthujan Sivanantham) is a commercial travel intermediary and not a tour operator within the meaning of § 651a BGB. Jettura exclusively brokers individual services (flights, hotels, rental cars, eSIMs, etc.) in the name and on behalf of the respective service providers (airlines, hoteliers, car rental companies, etc.). The travel service contract is concluded exclusively between the customer and the service provider."}
          </p>
          <p>
            {de
              ? "Berufsrechtliche Regelungen: Die Tätigkeit als Reisevermittler unterliegt den Bestimmungen der Gewerbeordnung (GewO). Eine gesetzliche Pflichtmitgliedschaft in einer Berufsorganisation besteht nicht."
              : "Professional regulations: The activity as a travel intermediary is subject to the provisions of the German Trade Regulation Act (GewO). There is no mandatory membership in a professional organisation."}
          </p>
        </Section>

        {/* Berufshaftpflicht */}
        <Section icon={Shield} title={de ? "Berufshaftpflicht / Insolvenzsicherung" : "Professional Liability / Insolvency Protection"}>
          <p>
            {de
              ? "Als reiner Reisevermittler (kein Pauschalreiseveranstalter) besteht keine gesetzliche Pflicht zur Insolvenzsicherung gemäß § 651r BGB. Alle Zahlungen erfolgen direkt an die Leistungsträger oder zertifizierte Zahlungsdienstleister. Kunden werden ausdrücklich darauf hingewiesen, dass sie bei Insolvenz des Leistungsträgers direkt gegen diesen vorzugehen haben."
              : "As a pure travel intermediary (not a package tour operator), there is no statutory obligation to provide insolvency protection pursuant to § 651r BGB. All payments are made directly to the service providers or certified payment service providers. Customers are expressly advised that in the event of insolvency of the service provider, they must proceed directly against the service provider."}
          </p>
        </Section>

        {/* Aufsichtsbehörde */}
        <Section icon={Building2} title={de ? "Zuständige Aufsichtsbehörde" : "Responsible Supervisory Authority"}>
          <p>
            {de
              ? "Gewerbeaufsichtsamt / Ordnungsamt der Stadt Hannover (zuständig für die Erteilung der Gewerbeerlaubnis gemäß GewO)"
              : "Trade supervision authority / regulatory office of the City of Hannover (responsible for issuing the business licence pursuant to GewO)"}
          </p>
        </Section>

        {/* Streitschlichtung */}
        <Section icon={Scale} title={de ? "EU-Streitschlichtung (§ 36 VSBG)" : "EU Online Dispute Resolution (§ 36 VSBG)"}>
          <p>
            {de
              ? "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:"
              : "The European Commission provides a platform for online dispute resolution (ODR):"}
          </p>
          <p>
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-80 transition-opacity break-all"
              style={{ color: "var(--brand-color)" }}
            >
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p>
            {de
              ? "Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG)."
              : "We are not willing and not obliged to participate in dispute resolution proceedings before a consumer arbitration board (§ 36 VSBG)."}
          </p>
        </Section>

        {/* Haftungsausschluss */}
        <Section icon={AlertCircle} title={de ? "Haftungsausschluss" : "Disclaimer"}>
          <p className="font-semibold text-slate-700 dark:text-slate-200">{de ? "Haftung für Inhalte (§§ 7–10 TMG)" : "Liability for Content (§§ 7–10 TMG)"}</p>
          <p>
            {de
              ? "Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt."
              : "As a service provider, we are responsible for our own content on these pages in accordance with general laws pursuant to § 7 para. 1 TMG. However, pursuant to §§ 8 to 10 TMG, we as service providers are not obligated to monitor transmitted or stored external information or to investigate circumstances indicating illegal activity."}
          </p>
          <p className="font-semibold text-slate-700 dark:text-slate-200">{de ? "Haftung für Links" : "Liability for Links"}</p>
          <p>
            {de
              ? "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen."
              : "Our website contains links to external third-party websites whose content we have no influence over. Therefore, we cannot accept any liability for this external content. The respective provider or operator of the linked pages is always responsible for their content. Upon becoming aware of any infringements, we will remove such links immediately."}
          </p>
          <p className="font-semibold text-slate-700 dark:text-slate-200">{de ? "Urheberrecht" : "Copyright"}</p>
          <p>
            {de
              ? "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet."
              : "The content and works created by the site operators on these pages are subject to German copyright law. Duplication, processing, distribution, and any form of commercial exploitation require the written consent of the respective author or creator. Downloads and copies of this page are only permitted for private, non-commercial use."}
          </p>
        </Section>

        {/* Plattform §18 MStV */}
        <Section icon={FileText} title={de ? "Inhaltlich verantwortlich gemäß § 18 Abs. 2 MStV" : "Content Responsible pursuant to § 18 para. 2 MStV"}>
          <p>
            Sinthujan Sivanantham<br />
            Friedrich-Ebert-Platz 18<br />
            30459 Hannover
          </p>
        </Section>

      </div>
    </div>
  );
}
