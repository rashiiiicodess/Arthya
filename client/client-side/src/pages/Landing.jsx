import React, { useContext } from 'react'; // Added useContext
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext'; // Added AppContext import
import Button from '../components/button'; 
import { ArrowRight, Shield, TrendingUp, Scale, Calculator, BookOpen, Sparkles, X } from 'lucide-react';

const HERO_IMG = 'https://media.base44.com/images/public/69d145fab4e9dff45f4e4d66/7fed1b2b0_generated_image.png';
const CALC_IMG = 'https://media.base44.com/images/public/69d145fab4e9dff45f4e4d66/6a6f28a41_generated_image.png';
const PEOPLE_IMG = 'https://media.base44.com/images/public/69d145fab4e9dff45f4e4d66/d123276ff_generated_image.png';
const CELEBRATION_IMG = 'https://media.base44.com/images/public/69d145fab4e9dff45f4e4d66/eb54f3132_generated_image.png';
const student_analyzing='https://media.base44.com/images/public/69d206a558379c18063c54f1/3e07c4e3e_generated_image.png';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } })
};

const problems = [
  { icon: Calculator, title: 'Hidden EMI Burden', desc: 'Students rarely calculate how much of their first salary goes toward loan repayment.' },
  { icon: BookOpen, title: 'Policy Blindness', desc: 'Complex terms like moratorium, floating rates, and prepayment penalties go unnoticed.' },
  { icon: TrendingUp, title: 'Salary Overestimation', desc: 'Unrealistic salary expectations lead to unmanageable financial commitments.' },
];

const features = [
  { icon: Scale, title: 'Smart Bank Comparison', desc: 'Compare 5 major banks side-by-side with real data and personalized analysis.' },
  { icon: Shield, title: 'Risk Intelligence', desc: 'Know exactly how risky your loan is before you sign — based on your income.' },
  { icon: Sparkles, title: 'AI-Powered Insights', desc: 'Get human-readable insights that explain what the numbers really mean for you.' },
];

const steps = [
  { num: '01', title: 'Enter Your Details', desc: 'Tell us about your loan amount, expected salary, and preferences.' },
  { num: '02', title: 'Review Smart Analysis', desc: 'We analyze all banks and provide risk scores, EMI breakdowns, and insights.' },
  { num: '03', title: 'Make an Informed Decision', desc: 'Compare, simulate scenarios, and save plans to make the best choice.' },
];

export default function Landing() {
  // --- AUTH LOGIC ---
  const { isLoggedIn, userData } = useContext(AppContext);
  
  // Decide where to send the user based on their status
  const targetRoute = (isLoggedIn && userData) ? "/dashboard" : "/login";

  return (
    <div className="min-h-screen bg-white overflow-hidden font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6D28D9] flex items-center justify-center shadow-lg shadow-purple-200 rotate-3">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">Arthya</span>
          </div>
          <Link to={targetRoute}>
            <Button size="sm" className="gap-2">
              Get Started <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-4 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-purple-50 text-[#6D28D9] rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" /> Smarter Loan Decisions for Students
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.1] text-slate-900 tracking-tight">
              Education loans, <br />
              <span className="text-[#6D28D9]">decoded.</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-8 text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
              Stop guessing. Compare real bank offers, understand your risk, and make confident financial decisions — all before you sign anything.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-wrap gap-4">
              <Link to={targetRoute}>
                <Button size="lg" className="gap-2">
                  Start Analyzing <ArrowRight size={20} />
                </Button>
              </Link>
            </motion.div>
            <motion.p variants={fadeUp} custom={4} className="mt-6 text-sm text-slate-400 font-medium">
              Free. No signup pressure. Real Indian bank data.
            </motion.p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-50" />
            <img src={HERO_IMG} alt="Student analysis" className="relative z-10 w-full max-w-md mx-auto drop-shadow-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Problem Section (Cards) */}
      <section className="py-24 px-4 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              The Problem Students Don't See
            </h2>
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-lg font-medium">
              Every year, lakhs of students take education loans without understanding the real impact on their future.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {problems.map((p, i) => (
              <motion.div
                key={p.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                  <p.icon className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{p.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dive Problem Section (Illustration) */}
      <section className="py-24 bg-white border-y border-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <img src={student_analyzing} alt="Student analyzing loans" className="rounded-[40px] w-full max-w-md mx-auto shadow-2xl" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="space-y-8">
              <span className="text-sm font-bold text-[#6D28D9] uppercase tracking-widest">The Reality</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">Education loans shouldn't be a gamble</h2>
              <p className="text-slate-500 text-lg leading-relaxed font-medium">
                Hidden charges, floating rates, and complex policies turn a simple loan into years of financial stress. We believe you deserve to know the truth before you sign.
              </p>
              <div className="space-y-5">
                {[
                  "70% of students don't know their total repayment amount",
                  "Most students overestimate their placement salary",
                  "Policy clauses are buried in fine print",
                  "Platform restrictions limit your options after applying"
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center mt-1 shrink-0">
                      <X className="w-3.5 h-3.5 text-red-500 stroke-[3px]" />
                    </div>
                    <p className="text-slate-700 font-medium">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solution Features */}
      <section className="py-24 px-4 bg-slate-50/30">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.img
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            src={CALC_IMG}
            alt="Calculator illustration"
            className="w-full max-w-sm mx-auto"
          />
          <div>
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12"
            >
              Arthya makes it <span className="text-[#6D28D9]">crystal clear</span>
            </motion.h2>
            <div className="space-y-8">
              {features.map((f, i) => (
                <motion.div 
                  key={f.title}
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={fadeUp} custom={i}
                  className="flex gap-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-6 h-6 text-[#6D28D9]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{f.title}</h3>
                    <p className="text-slate-500 mt-1 font-medium">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-slate-50/50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="inline-flex items-center gap-2 bg-purple-50 text-[#6D28D9] rounded-full px-4 py-1.5 text-sm font-semibold mb-4"
            >
              Our Process
            </motion.div>
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12"
            >
              Make a smart decision in <span className="text-[#6D28D9]">3 easy steps</span>
            </motion.h2>
            <div className="space-y-10">
              {steps.map((step, i) => (
                <motion.div 
                  key={step.num}
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={fadeUp} custom={i + 1}
                  className="flex gap-6 items-start"
                >
                  <div className="w-12 h-12 rounded-full bg-[#6D28D9] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {step.num}
                  </div>
                  <div className="border-l-2 border-purple-100 pl-6 pb-4">
                    <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                    <p className="text-slate-500 mt-1 font-medium">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.img
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            src={PEOPLE_IMG}
            alt="People discussing"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            src={CELEBRATION_IMG}
            alt="Success"
            className="w-40 mx-auto mb-10"
          />
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-8"
          >
            Ready to make a confident decision?
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
            <Link to={targetRoute}>
              <Button size="lg" className="gap-2 px-12">
                Start Now — It's Free <ArrowRight size={22} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6D28D9] flex items-center justify-center text-white font-bold">A</div>
            <span className="font-bold text-lg text-slate-900">Arthya</span>
          </div>
          <p className="text-sm text-slate-400 font-medium">
            © 2026 Arthya Decision Engine. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}