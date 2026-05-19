"use client";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Scale, FileText, HelpCircle, ShieldAlert, CreditCard, RefreshCw, Globe, AlertTriangle } from "lucide-react";

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

export default function AGB() {
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
          {de ? "Allgemeine Vermittlungsbedingungen (AGB)" : "General Terms and Conditions of Agency (T&C)"}
        </h1>
        <p className="text-xs text-slate-400 mt-2">
          {de 
            ? "Allgemeine Geschäftsbedingungen für die Vermittlung von Reiseleistungen · Stand: Mai 2025" 
            : "General Terms and Conditions for the brokering of travel services · As of: May 2025"}
        </p>
      </div>

      <div className="space-y-5">

        {/* 1. Geltungsbereich */}
        <Section icon={Scale} title={de ? "1. Geltungsbereich & Vermittlungsvertrag" : "1. Scope & Brokerage Contract"}>
          <p>
            {de
              ? "Diese Allgemeinen Vermittlungsbedingungen gelten für alle Vermittlungsaufträge von Reiseleistungen (z. B. Flüge, Hotels, Mietwagen, eSIMs, Tickets), die Kunden über das Online-Portal Jettura (Sinthujan Sivanantham, Friedrich-Ebert-Platz 18, 30459 Hannover) erteilen."
              : "These General Terms and Conditions of Agency apply to all brokerage orders for travel services (e.g. flights, hotels, rental cars, eSIMs, tickets) placed by customers via the Jettura online portal (Sinthujan Sivanantham, Friedrich-Ebert-Platz 18, 30459 Hannover)."}
          </p>
          <p>
            {de
              ? "Gegenstand dieses Vertrages ist ausschließlich die ordnungsgemäße Vermittlung der Reiseleistung. Jettura tritt zu keinem Zeitpunkt als Reiseveranstalter im Sinne der §§ 651a ff. BGB auf. Bei einer Buchung kommt der Vertrag über die Reiseleistung ausschließlich und direkt zwischen dem Kunden und dem jeweiligen Leistungsträger (z. B. Fluggesellschaft, Hotelier, Mietwagenunternehmen, eSIM-Provider) zustande."
              : "The subject of this contract is exclusively the proper brokering of the travel service. Jettura does not act as a tour operator within the meaning of §§ 651a et seq. BGB at any time. When making a booking, the contract for the travel service is concluded exclusively and directly between the customer and the respective service provider (e.g. airline, hotelier, car rental company, eSIM provider)."}
          </p>
          <p>
            {de
              ? "Für die Erbringung der vermittelten Reiseleistungen gelten ausschließlich die Allgemeinen Geschäftsbedingungen (AGB) und Tarifbedingungen des jeweiligen Leistungsträgers."
              : "The general terms and conditions and fare rules of the respective service provider apply exclusively to the provision of the brokered travel services."}
          </p>
        </Section>

        {/* 2. Buchungsauftrag */}
        <Section icon={FileText} title={de ? "2. Buchungsauftrag & Vertragsabschluss" : "2. Booking Order & Conclusion of Contract"}>
          <p>
            {de
              ? "Mit Absenden des Buchungsformulars (Betätigen des Buttons 'Zahlungspflichtig buchen' bzw. 'Buchen') erteilt der Kunde Jettura einen verbindlichen Auftrag, eine bestimmte Reiseleistung bei einem Leistungsträger zu vermitteln."
              : "By submitting the booking form (clicking the button 'Book with obligation to pay' or 'Book'), the customer places a binding order with Jettura to broker a specific travel service with a service provider."}
          </p>
          <p>
            {de
              ? "Der Vermittlungsvertrag zwischen dem Kunden und Jettura kommt mit der schriftlichen oder elektronischen Annahme (z. B. Buchungsbestätigung per E-Mail) durch Jettura zustande. Die Zuteilung von E-Tickets oder Hotelgutscheinen stellt gleichzeitig die Bestätigung des vermittelten Hauptvertrages mit dem Leistungsträger dar."
              : "The brokerage contract between the customer and Jettura is concluded upon written or electronic acceptance (e.g. booking confirmation by email) by Jettura. The allocation of e-tickets or hotel vouchers simultaneously represents confirmation of the mediated main contract with the service provider."}
          </p>
        </Section>

        {/* 3. Pflichten & Haftung */}
        <Section icon={ShieldAlert} title={de ? "3. Haftung von Jettura als Vermittler" : "3. Liability of Jettura as Intermediary"}>
          <p>
            {de
              ? "Jettura haftet ausschließlich für die ordnungsgemäße Erbringung der Vermittlungsleistung (z. B. korrekte Weiterleitung der Daten an den Leistungsträger, Beratung und Buchungsabwicklung)."
              : "Jettura is liable exclusively for the proper execution of the brokerage service (e.g. correct forwarding of data to the service provider, advice, and booking processing)."}
          </p>
          <p>
            {de
              ? "Jettura haftet nicht für die tatsächliche Erbringung, Qualität, Sicherheit, Verfügbarkeit oder Mängel der vermittelten Reiseleistung selbst (z. B. Flugausfälle, Verspätungen, Hotelmängel, Streiks). Für diese Ansprüche ist ausschließlich der jeweilige Leistungsträger haftbar."
              : "Jettura is not liable for the actual provision, quality, safety, availability, or defects of the brokered travel service itself (e.g. flight cancellations, delays, hotel defects, strikes). The respective service provider is solely liable for these claims."}
          </p>
          <p>
            {de
              ? "Die Haftung für einfache Fahrlässigkeit bei der Vermittlung ist ausgeschlossen, es sei denn, es handelt sich um eine Verletzung von Vertragspflichten, deren Erfüllung die ordnungsgemäße Durchführung des Vermittlungsvertrages überhaupt erst ermöglicht (Kardinalpflichten) oder um Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit."
              : "Liability for simple negligence in brokerage is excluded, unless it concerns a breach of contractual obligations, the fulfillment of which makes the proper execution of the brokerage contract possible in the first place (cardinal obligations) or damages resulting from injury to life, limb, or health."}
          </p>
        </Section>

        {/* 4. Zahlung & Entgelte */}
        <Section icon={CreditCard} title={de ? "4. Preise, Service-Entgelte & Zahlung" : "4. Prices, Service Fees & Payment"}>
          <p>
            {de
              ? "Die Preise für die vermittelten Reiseleistungen werden von den jeweiligen Leistungsträgern festgelegt. Jettura behält sich das Recht vor, für die Vermittlungstätigkeit ein separates Service-Entgelt zu erheben. Dieses wird dem Kunden vor Abschluss der Buchung transparent ausgewiesen."
              : "The prices for the brokered travel services are set by the respective service providers. Jettura reserves the right to charge a separate service fee for its brokerage activities. This will be transparently displayed to the customer before the booking is completed."}
          </p>
          <p>
            {de
              ? "Service-Entgelte von Jettura sind im Falle einer Stornierung oder Nichtinanspruchnahme der Reiseleistung durch den Kunden nicht erstattungsfähig, da die Vermittlungsdienstleistung mit der Buchungsbestätigung vollständig erbracht wurde."
              : "Jettura's service fees are non-refundable in the event of cancellation or non-use of the travel service by the customer, as the brokerage service was fully performed upon booking confirmation."}
          </p>
          <p>
            {de
              ? "Die Zahlungen erfolgen über sichere, zertifizierte Drittanbieter (z. B. Stripe, PayPal). Die Belastung des Zahlungsmittels erfolgt je nach Leistungsträger direkt durch den Leistungsträger oder durch Jettura im Inkasso-Auftrag für den Leistungsträger."
              : "Payments are processed via secure, certified third-party providers (e.g. Stripe, PayPal). Depending on the service provider, the payment method will be charged directly by the service provider or by Jettura on behalf of the service provider."}
          </p>
        </Section>

        {/* 5. Stornierungen & Umbuchungen */}
        <Section icon={RefreshCw} title={de ? "5. Umbuchungen, Stornierungen & Nichtantritt" : "5. Rebookings, Cancellations & Non-attendance"}>
          <p>
            {de
              ? "Umbuchungen oder Stornierungen von vermittelten Verträgen richten sich ausschließlich nach den Bedingungen (Tarifvorschriften, AGB) des jeweiligen Leistungsträgers."
              : "Rebookings or cancellations of brokered contracts are governed exclusively by the conditions (fare rules, terms and conditions) of the respective service provider."}
          </p>
          <p>
            {de
              ? "Der Kunde muss entsprechende Erklärungen (Stornierung, Rücktritt) direkt gegenüber dem Leistungsträger abgeben. Reicht der Kunde die Stornierung über Jettura ein, agiert Jettura lediglich als Bote. Jettura ist berechtigt, für die Bearbeitung von Stornierungen, Rückerstattungen oder Umbuchungen ein angemessenes Bearbeitungsentgelt zu erheben, sofern die Änderung nicht durch Jettura verschuldet wurde."
              : "The customer must make corresponding declarations (cancellation, withdrawal) directly to the service provider. If the customer submits the cancellation via Jettura, Jettura acts merely as a messenger. Jettura is entitled to charge a reasonable processing fee for handling cancellations, refunds, or rebookings, provided the change was not caused by Jettura's fault."}
          </p>
        </Section>

        {/* 6. Einreisebestimmungen */}
        <Section icon={Globe} title={de ? "6. Pass-, Visa-, Zoll- & Gesundheitsbestimmungen" : "6. Passport, Visa, Customs & Health Regulations"}>
          <p>
            {de
              ? "Der Kunde ist für die Einhaltung und Beschaffung aller notwendigen Pass-, Visa-, Zoll-, Devisen- und Gesundheitsbestimmungen (z. B. Impfungen, Testnachweise) für die Durchführung der Reise selbst verantwortlich."
              : "The customer is responsible for compliance with and procurement of all necessary passport, visa, customs, currency, and health regulations (e.g. vaccinations, test certificates) for the execution of the trip."}
          </p>
          <p>
            {de
              ? "Hinweise von Jettura bezüglich dieser Bestimmungen erfolgen nach bestem Wissen, beziehen sich jedoch in der Regel auf deutsche Staatsbürger ohne Besonderheiten und sind unverbindlich. Jettura übernimmt keine Haftung für die Verweigerung der Beförderung oder Einreise aufgrund fehlender Reisedokumente."
              : "Information provided by Jettura regarding these regulations is correct to the best of its knowledge, but usually refers to German citizens without special circumstances and is non-binding. Jettura accepts no liability for refusal of carriage or entry due to missing travel documents."}
          </p>
        </Section>

        {/* 7. Streitschlichtung */}
        <Section icon={AlertTriangle} title={de ? "7. Streitbeilegung & Schlichtung" : "7. Dispute Resolution & Arbitration"}>
          <p>
            {de
              ? "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:"
              : "The European Commission provides a platform for online dispute resolution (ODR):"}
          </p>
          <p>
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 break-all" style={{ color: "var(--brand-color)" }}>
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p>
            {de
              ? "Jettura ist weder bereit noch verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG)."
              : "Jettura is neither willing nor obliged to participate in dispute resolution proceedings before a consumer arbitration board (§ 36 VSBG)."}
          </p>
        </Section>

        {/* 8. Schlussbestimmungen */}
        <Section icon={Scale} title={de ? "8. Rechtswahl, Gerichtsstand & Salvatorische Klausel" : "8. Governing Law, Jurisdiction & Severability Clause"}>
          <p>
            {de
              ? "Auf das gesamte Vermittlungsverhältnis zwischen dem Kunden und Jettura findet ausschließlich das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts Anwendung."
              : "The entire brokerage relationship between the customer and Jettura is governed exclusively by the law of the Federal Republic of Germany, to the exclusion of the UN Convention on Contracts for the International Sale of Goods."}
          </p>
          <p>
            {de
              ? "Sofern der Kunde Kaufmann, eine juristische Person des öffentlichen Rechts oder ein öffentlich-rechtliches Sondervermögen ist, ist der Gerichtsstand für alle Streitigkeiten aus oder im Zusammenhang mit diesem Vertrag Hannover, Deutschland."
              : "If the customer is a merchant, a legal entity under public law, or a special fund under public law, the place of jurisdiction for all disputes arising out of or in connection with this contract is Hannover, Germany."}
          </p>
          <p>
            {de
              ? "Sollte eine Bestimmung dieser Allgemeinen Vermittlungsbedingungen unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen hiervon unberührt. Die unwirksame Bestimmung wird durch die gesetzliche Regelung ersetzt."
              : "Should any provision of these General Terms and Conditions of Agency be or become invalid, the validity of the remaining provisions shall remain unaffected. The invalid provision shall be replaced by the statutory regulation."}
          </p>
        </Section>

      </div>
    </div>
  );
}
