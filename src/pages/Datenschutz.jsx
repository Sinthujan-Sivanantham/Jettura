import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Datenschutz() {
    const brandColor = "var(--brand-color)";
    const { language } = useLanguage();

    const content = {
        de: {
            title: "Datenschutzerklärung",
            section1: {
                title: "1. Datenschutz auf einen Blick",
                subtitle: "Allgemeine Hinweise",
                text: "Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können."
            },
            section2: {
                title: "2. Hosting und Content Delivery Networks (CDN)",
                text: "Wir hosten die Inhalte unserer Website bei folgenden Anbietern:",
                list: ["Vercel (Hosting)", "Supabase (Datenbank)"]
            },
            section3: {
                title: "3. Allgemeine Hinweise und Pflichtinformationen",
                subtitle1: "Datenschutz",
                text1: "Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.",
                subtitle2: "Hinweis zur verantwortlichen Stelle",
                text2: <>
                    Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br /><br />
                    Sinthujan Sivanantham<br />
                    Friedrich-Ebert-Platz 18<br />
                    30459 Hannover<br />
                    Deutschland<br />
                    E-Mail: support@jettura.com
                </>
            },
            section4: {
                title: "4. Datenerfassung auf dieser Website",
                subtitle1: "Cookies",
                text1: "Soweit Sie Ihre Einwilligung erklärt haben, nutzen wir Cookies und andere Technologien, um unsere Dienste anzubieten. Sie können Ihre Einstellungen jederzeit in den Cookie-Einstellungen ändern.",
                subtitle2: "Flug- und Reisesuche",
                text2: "Wenn Sie unsere Flugsuche nutzen, leiten wir Ihre Suchanfragen ggf. an Partner wie Amadeus oder Travelpayouts. Hierbei werden jedoch nur anonymisierte Reisedaten übermittelt, sofern Sie nicht explizit eine Buchung tätigen."
            },
            section5: {
                title: "5. Analyse-Tools und Werbung",
                text: "Wir nutzen ggf. Tools zur Analyse des Nutzerverhaltens, um unser Angebot zu verbessern."
            }
        },
        en: {
            title: "Privacy Policy",
            section1: {
                title: "1. Data Protection at a Glance",
                subtitle: "General Information",
                text: "The following information provides a simple overview of what happens to your personal data when you visit this website. Personal data is any data with which you can be personally identified."
            },
            section2: {
                title: "2. Hosting and Content Delivery Networks (CDN)",
                text: "We host the content of our website with the following providers:",
                list: ["Vercel (Hosting)", "Supabase (Database)"]
            },
            section3: {
                title: "3. General Information and Mandatory Information",
                subtitle1: "Data Protection",
                text1: "The operators of these pages take the protection of your personal data very seriously. We treat your personal data confidentially and in accordance with the statutory data protection regulations and this privacy policy.",
                subtitle2: "Note on the Responsible Body",
                text2: <>
                    The responsible body for data processing on this website is:<br /><br />
                    Simona Sinthujan<br />
                    Friedrich-Ebert-Platz 18<br />
                    30459 Hannover<br />
                    Germany<br />
                    Email: support@jettura.com
                </>
            },
            section4: {
                title: "4. Data Collection on this Website",
                subtitle1: "Cookies",
                text1: "If you have given your consent, we use cookies and other technologies to offer our services. You can change your settings at any time in the cookie settings.",
                subtitle2: "Flight and Travel Search",
                text2: "When you use our flight search, we may forward your search queries to partners such as Amadeus or Travelpayouts. In this case, only anonymized travel data is transmitted, unless you explicitly make a booking."
            },
            section5: {
                title: "5. Analysis Tools and Advertising",
                text: "We may use tools to analyze user behavior in order to improve our offer."
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
                    <h3 className="text-lg font-bold mt-4 mb-2 text-slate-900 dark:text-slate-100">{t.section1.subtitle}</h3>
                    <p>{t.section1.text}</p>
                </section>

                <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{t.section2.title}</h2>
                    <p>{t.section2.text}</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        {t.section2.list.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </section>

                <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{t.section3.title}</h2>
                    <h3 className="text-lg font-bold mt-4 mb-2 text-slate-900 dark:text-slate-100">{t.section3.subtitle1}</h3>
                    <p className="mb-4">{t.section3.text1}</p>

                    <h3 className="text-lg font-bold mt-4 mb-2 text-slate-900 dark:text-slate-100">{t.section3.subtitle2}</h3>
                    <p className="mb-4">{t.section3.text2}</p>
                </section>

                <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{t.section4.title}</h2>

                    <h3 className="text-lg font-bold mt-4 mb-2 text-slate-900 dark:text-slate-100">{t.section4.subtitle1}</h3>
                    <p className="mb-4">{t.section4.text1}</p>

                    <h3 className="text-lg font-bold mt-4 mb-2 text-slate-900 dark:text-slate-100">{t.section4.subtitle2}</h3>
                    <p>{t.section4.text2}</p>
                </section>

                <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{t.section5.title}</h2>
                    <p>{t.section5.text}</p>
                </section>
            </div>
        </div>
    );
}
