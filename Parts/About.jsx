import React from "react";
import { FaArrowRight, FaAward, FaBookOpen, FaBuilding, FaUsers } from "react-icons/fa";
import skit from "../src/assest/skit.jpg";
import PrayasAssosiationlogo from "../src/assest/PrayasAssosiationlogo.png";
import skitDirector from "../src/assest/skitDirector.jpeg";
import logo from "../src/assest/logo.png";
import SKITC from "../src/assest/SKITC.jpg";

const highlights = [
  {
    title: "Established Legacy",
    description: "A learning ecosystem focused on academic consistency, modern facilities, and long-term student growth.",
    icon: FaBuilding,
  },
  {
    title: "Student-Centered Learning",
    description: "Programs are designed to combine classroom fundamentals with practical exposure and discipline.",
    icon: FaBookOpen,
  },
  {
    title: "Value-Driven Community",
    description: "The campus culture emphasizes respect, opportunity, mentorship, and social responsibility.",
    icon: FaUsers,
  },
];

const quickStats = [
  { value: "2008", label: "Institute foundation year" },
  { value: "2014", label: "Prayas Welfare Association formed" },
  { value: "CSJMU", label: "Affiliation and academic alignment" },
];

const About = () => {
  return (
    <main className="overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_30%),linear-gradient(180deg,_#020617_0%,_#0f172a_40%,_#e2e8f0_100%)] text-slate-900">
      <section className="relative">
        <div className="mx-auto grid min-h-[92vh] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24 ">
          <div className="text-white">
            <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] backdrop-blur">
              About SKIT
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              A campus built for disciplined learning, opportunity, and growth.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">
              Shakuntala Krishna Institute of Technology, Kanpur is focused on delivering quality education with a strong academic foundation, practical development, and a culture that encourages confidence, ethics, and ambition.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {quickStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-xl backdrop-blur"
                >
                  <p className="text-2xl font-black text-white">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto  ">
            <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -bottom-8 -right-6 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur ">
              <img
                src={skit}
                alt="Shakuntala Krishna Institute of Technology campus"
                className=" w-full rounded-[1.6rem] object-cover "
              />
              {/* <div className="absolute inset-x-6 bottom-6 rounded-[1.5rem] border border-white/20 bg-slate-950/65 p-5 text-white backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">
                  Institution Snapshot
                </p>
                <p className="mt-2 text-lg font-bold">Academic focus with a future-ready environment</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  Modern infrastructure, committed faculty, and a student-first ecosystem together shape the institute experience.
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 rounded-[2rem] border border-white/60 bg-white/85 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur sm:p-8 lg:grid-cols-3">
            {highlights.map(({ title, description, icon: Icon }) => (
              <article key={title} className="rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="inline-flex rounded-2xl bg-slate-900 p-3 text-white">
                  <Icon className="text-lg" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-slate-900">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24 ">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] bg-white rounded-[2rem] border border-white/20 p-6 shadow-xl backdrop-blur">
          <div className="overflow-hidden rounded-[2rem]  bg-white  h-[400px]">
            <img
              src={PrayasAssosiationlogo}
              alt="Prayas Welfare Association"
              className="h-full w-full object-contain  p-8"
            />
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-700">
              Supporting Organization
            </p>
            <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
              Prayas Welfare Association
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Prayas Welfare Association Society was established in 2014 by educationists and entrepreneurs as a nonprofit charitable organization registered under the Societies Registration Act of 1860.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Its vision is to expand quality education opportunities for talented students, especially those from underprivileged families, while contributing to social transformation, modernization, equality, and productive nation building.
            </p>
{/* 
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Registration Identity</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Registered society focused on structured educational development and welfare initiatives.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Social Mission</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Built to promote access, dignity, fairness, and long-term opportunity through education.
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 pb-16 sm:px-6 lg:px-8 lg:pt-0 lg:pb-24">
        <div className="grid gap-8 lg:grid-cols-[1.10fr_1fr] rounded-[2rem] border border-black/20 p-6 shadow-xl backdrop-blur items-center">
          

          <div className="rounded-[2rem] border border-slate-200 bg-white  p-7 shadow-xl sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-700">
         About Institute
            </p>
            <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
              Shakuntala Krishna Institute of Technology
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Shakuntala Krishna Institute of Technology is a premier educational institution dedicated to providing quality education and fostering.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Its vision is to expand quality education opportunities for talented students, especially those from underprivileged families, while contributing to social transformation, modernization, equality, and productive nation building.
            </p>
{/* 
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Registration Identity</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Registered society focused on structured educational development and welfare initiatives.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Social Mission</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Built to promote access, dignity, fairness, and long-term opportunity through education.
                </p>
              </div>
            </div> */}
          </div>

          <div className="overflow-hidden rounded-[2rem] h-[400px] ">
            <img
              src={logo}
              alt="Shakuntala Krishna Institute of Technology"
              className="h-full w-full object-contain p-8 "
            />
          </div>
        </div>
      </section>

     



      {/* skitc  */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            
          <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
              Chairman's Message
            </p>
            <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
              College education is the foundation for a successful and fulfilling life, and we are committed to providing that foundation with excellence and care.
            </h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
              <p>
                एस. के. आई. टी. कॉलेज के संस्थापक-अध्यक्ष के रूप में, हमारे कॉलेज की वेबसाइट का उपयोग करके आपसे संवाद करना वास्तव में मेरे लिए एक अनूठा सौभाग्य है।




              </p>
              <p>
                सफल और प्रसन्न व्यक्ति एक सफल राष्ट्र का निर्माण करते हैं। लेकिन वह क्या है जो सफलता, लक्ष्यों की प्राप्ति और एक खुशहाल और संतुष्ट जीवन जीने के आपके मिशन को पूरा करने में सहायता करता है? वह मजबूत नींव कोई और नहीं बल्कि अच्छी शिक्षा है। क्योंकि शिक्षा में ही व्यक्ति, राष्ट्र और दुनिया भर में मानवता की सबसे बड़ी सेवा निहित है।
              </p>
              <p>
                उत्कृष्टता प्राप्त करने के दृढ़ संकल्प से प्रेरित छात्र शिक्षकों के साथ, एक सक्षम और समर्पित संकाय ने सावधानीपूर्वक डिजाइन किए गए पाठ्यक्रम और इष्टतम बुनियादी ढांचे के साथ एस.के.आई.टी. कॉलेजशिक्षा की दुनिया में एक बड़ी ताकत बन गया है। मेरा लक्ष्य एस.आर.एम संस्थानों के प्रत्येक छात्र-शिक्षक को सर्वोत्तम शिक्षा और बुनियादी ढांचे से लैस करना है ताकि उन्हें जीवन में सर्वश्रेष्ठ हासिल करने में मदद मिल सके। हम न केवल उनमें सर्वोत्तम रचनात्मक और तकनीकी योग्यताएँ विकसित करते हैं, बल्कि उन्हें अपरिहार्य मानवीय गुण भी सिखाते हैं।"
              </p>
            </div>

            
          </article>
          <aside className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl sm:p-8">
            <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/5 p-3">
              <img
                src={SKITC}
                // alt="Director Vivek Pratap Singh"
                className="h-100 w-full rounded-[1.4rem] object-cover"
              />
            </div>
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                Leadership Note
              </p>
              <h3 className="mt-3 text-2xl font-black">Vivek Pratap Singh</h3>
              <p className="mt-1 text-sm text-slate-300">Director</p>
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start gap-3">
                  <FaAward className="mt-1 text-cyan-300" />
                  <p className="text-sm leading-7 text-slate-200">
                    A vision anchored in academic excellence, all-round development, and a strong sense of belonging for every learner.
                  </p>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl sm:p-8">
            <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/5 p-3">
              <img
                src={skitDirector}
                alt="Director Vivek Pratap Singh"
                className="h-80 w-full rounded-[1.4rem] object-cover"
              />
            </div>
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                Leadership Note
              </p>
              <h3 className="mt-3 text-2xl font-black">Vivek Pratap Singh</h3>
              <p className="mt-1 text-sm text-slate-300">Director</p>
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start gap-3">
                  <FaAward className="mt-1 text-cyan-300" />
                  <p className="text-sm leading-7 text-slate-200">
                    A vision anchored in academic excellence, all-round development, and a strong sense of belonging for every learner.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-xl sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
              Director's Message
            </p>
            <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
              Education here is designed to shape both competence and character.
            </h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
              <p>
                It gives us great pleasure to welcome learners and families to the spirit behind Shakuntala Krishna Institute of Technology. The institute is committed to combining academic seriousness with an energetic co-curricular culture that supports leadership, confidence, and personal growth.
              </p>
              <p>
                Our mission is to cultivate the love of knowledge and build lifelong learning habits so that students can move into the future with resilience, responsibility, and optimism. We believe meaningful education must strengthen values, relationships, and trust alongside subject expertise.
              </p>
              <p>
                At SKIT, education is approached as a holistic journey. The goal is not only to create strong academic performers, but to nurture thoughtful individuals who are ready to contribute to society with clarity, discipline, and purpose.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                Holistic development
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                Academic excellence
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                Values and leadership
              </div>
            </div>

            <div className="mt-10 rounded-[1.6rem] bg-slate-900 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-200">Why It Matters</p>
              <div className="mt-3 flex items-start justify-between gap-4">
                <p className="max-w-2xl text-sm leading-7 text-slate-200">
                  Students do better when they feel guided, challenged, and supported. This page now presents that story more clearly and in a more modern, trust-building format.
                </p>
                <FaArrowRight className="mt-1 shrink-0 text-cyan-300" />
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
};

export default About;
