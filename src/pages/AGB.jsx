import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function AGB() {
    const brandColor = "var(--brand-color)";
    const { language } = useLanguage();

    const content = {
        de: {
            title: "Allgemeine Geschäftsbedingungen (AGB)",
            section1: {
                title: "1. Geltungsbereich",
                text: "Für die Geschäftsbeziehung zwischen Simona Sinthujan (Jettura) (nachfolgend \"Anbieter\") und dem Kunden (nachfolgend \"Kunde\") gelten ausschließlich die nachfolgenden Allgemeinen Geschäftsbedingungen in ihrer zum Zeitpunkt der Bestellung gültigen Fassung. Der Anbieter betreibt ein Kleingewerbe und ist keine registrierte GmbH."
            },
            section2: {
                title: "2. Vertragsgegenstand",
                text: "Der Anbieter stellt eine Plattform zur Suche und zum Vergleich von Reiseangeboten (Flüge, Hotels, eSIMs etc.) zur Verfügung. Die eigentliche Buchung und der Vertragsschluss für die Reiseleistung kommen ausschließlich zwischen dem Kunden und dem jeweiligen Reiseanbieter (z.B. Airline, Hotel, Partner) zustande."
            },
            section3: {
                title: "3. Haftung",
                text: "Für die Richtigkeit, Vollständigkeit und Aktualität der von den Partnern bereitgestellten Daten (Flugzeiten, Preise, Verfügbarkeiten) übernimmt Jettura keine Gewähr. Die Haftung für eigene Inhalte richtet sich nach den gesetzlichen Vorschriften."
            },
            section4: {
                title: "4. Nutzerpflichten",
                text: "Der Nutzer verpflichtet sich, die Plattform nicht für missbräuchliche Zwecke zu nutzen und keine Schadsoftware einzubringen."
            },
            section5: {
                title: "5. Schlussbestimmungen",
                text: "Auf Verträge zwischen dem Anbieter und den Kunden findet das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts Anwendung. Gerichtsstand ist, soweit gesetzlich zulässig, Hannover."
            }
        },
        en: {
            title: "Terms and Conditions (AGB)",
            section1: {
                title: "1. Scope",
                text: "For the business relationship between Simona Sinthujan (Jettura) (hereinafter \"Provider\") and the customer (hereinafter \"Customer\"), the following General Terms and Conditions apply exclusively in the version valid at the time of the order. The provider operates as a small business and is not a registered GmbH."
            },
            section2: {
                title: "2. Subject of Contract",
                text: "The provider provides a platform for searching and comparing travel offers (flights, hotels, eSIMs, etc.). The actual booking and the conclusion of the contract for the travel service take place exclusively between the customer and the respective travel provider (e.g. airline, hotel, partner)."
            },
            section3: {
                title: "3. Liability",
                text: "Jettura assumes no liability for the correctness, completeness, and topicality of the data provided by the partners (flight times, prices, availabilities). Liability for our own content is governed by statutory provisions."
            },
            section4: {
                title: "4. User Obligations",
                text: "The user undertakes not to use the platform for abusive purposes and not to introduce any malware."
            },
            section5: {
                title: "5. Final Provisions",
                text: "Contracts between the provider and the customer shall be governed by the law of the Federal Republic of Germany, excluding the UN Sales Convention. The place of jurisdiction is, to the extent legally permissible, Hannover."
            }
        }
    };

    const t = content[language === "de" ? "de" : "en"];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter mb-8" style={{ color: brandColor }}>
                {t.title}
            </h1>

            <div className="space-y-6 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{t.section1.title}</h2>
                    <p>{t.section1.text}</p>
                </section>

                <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{t.section2.title}</h2>
                    <p>{t.section2.text}</p>
                </section>

                <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{t.section3.title}</h2>
                    <p>{t.section3.text}</p>
                </section>

                <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{t.section4.title}</h2>
                    <p>{t.section4.text}</p>
                </section>

                <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{t.section5.title}</h2>
                    <p>{t.section5.text}</p>
                </section>
            </div>
        </div>
    );
}
