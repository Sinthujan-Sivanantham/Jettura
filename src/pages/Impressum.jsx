import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

export default function Impressum() {
    const brandColor = "var(--brand-color)";
    const { language } = useLanguage();

    const content = {
        de: {
            title: "Impressum",
            section1: {
                title: "Angaben gemäß § 5 TMG",
                text: <>
                 Sinthujan Sivanantham <br />
                    Friedrich-Ebert-Platz 18<br />
                    30459 Hannover<br />
                    Deutschland
                </>
            },
            section2: {
                title: "Kontakt",
                text: <>
                    Telefon: +49 160 8733984<br />
                    E-Mail: <a href="mailto:support@jettura.com" className="hover:text-[var(--brand-color)] transition-colors">support@jettura.com</a>
                </>
            },
            section3: {
                title: "Umsatzsteuer-ID",
                text: "Keine Umsatzsteuer-Identifikationsnummer, da Kleinunternehmerregelung gemäß § 19 UStG greift."
            },
            section4: {
                title: "Haftungsausschluss",
                content: "Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen."
            },
            section5: {
                title: "Haftung für Links",
                content: "Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich."
            },
            section6: {
                title: "Urheberrecht",
                content: "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers."
            }
        },
        en: {
            title: "Legal Notice (Impressum)",
            section1: {
                title: "Information according to § 5 TMG",
                text: <>
                    Simona Sinthujan<br />
                    Friedrich-Ebert-Platz 18<br />
                    30459 Hannover<br />
                    Germany
                </>
            },
            section2: {
                title: "Contact",
                text: <>
                    Phone: +49 160 8733984<br />
                    Email: <a href="mailto:support@jettura.com" className="hover:text-[var(--brand-color)] transition-colors">support@jettura.com</a>
                </>
            },
            section3: {
                title: "VAT ID",
                text: "No VAT Identification Number according to small business regulations (§ 19 UStG)."
            },
            section4: {
                title: "Liability for Content",
                content: "As a service provider, we are responsible for our own content on these pages in accordance with general laws pursuant to § 7 Sect. 1 of the German Telemedia Act (TMG). However, according to §§ 8 to 10 TMG, we as service providers are not obliged to monitor transmitted or stored external information or to investigate circumstances that indicate illegal activity."
            },
            section5: {
                title: "Liability for Links",
                content: "Our offer contains links to external third-party websites, the content of which we have no influence on. Therefore, we cannot assume any liability for these external contents. The respective provider or operator of the pages is always responsible for the content of the linked pages."
            },
            section6: {
                title: "Copyright",
                content: "The content and works created by the site operators on these pages are subject to German copyright law. Duplication, processing, distribution, and any kind of exploitation outside the limits of copyright law require the written consent of the respective author or creator."
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
                    <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Disclaimer</h2>

                    <h3 className="text-lg font-bold mt-4 mb-2 text-slate-900 dark:text-slate-100">{t.section4.title}</h3>
                    <p className="mb-4">{t.section4.content}</p>

                    <h3 className="text-lg font-bold mt-4 mb-2 text-slate-900 dark:text-slate-100">{t.section5.title}</h3>
                    <p className="mb-4">{t.section5.content}</p>

                    <h3 className="text-lg font-bold mt-4 mb-2 text-slate-900 dark:text-slate-100">{t.section6.title}</h3>
                    <p>{t.section6.content}</p>
                </section>
            </div>
        </div>
    );
}
