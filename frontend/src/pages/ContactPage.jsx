import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { CONTACT_EMAIL } from '../config/site.js';

export default function ContactPage() {
  usePageTitle('Contact – MS Weather');
  const [form, setForm] = useState({ name: '', email: '', subject: 'MS Weather feedback', message: '' });

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function submit(event) {
    event.preventDefault();
    const body = `Name: ${form.name}\nReply email: ${form.email}\n\n${form.message}`;
    const url = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  }

  return (
    <>
      <PageHeader icon="phone-arrow-right" title="Contact" subtitle="Have a question or feedback? Send us a message." />
      <div className="container page-body contact-page">
        <section className="contact-intro">
          <span className="tile tile--accent"><Icon name="mail" size={26} /></span>
          <p className="eyebrow">LET’S TALK</p>
          <h2>Get in touch</h2>
          <p>Use the form below to compose an email. Your email app will open with the details filled in, so you can review and send the message yourself.</p>
        </section>

        <div className="contact-form-layout">
          <form className="card contact-form" onSubmit={submit}>
            <div className="contact-form__heading">
              <h3>Send us a message</h3>
              <p>Fields marked with * are required.</p>
            </div>
            <div className="contact-form__grid">
              <label className="contact-field">
                <span>Your name *</span>
                <input name="name" value={form.name} onChange={update} autoComplete="name" required maxLength={100} placeholder="Enter your name" />
              </label>
              <label className="contact-field">
                <span>Your email *</span>
                <input name="email" type="email" value={form.email} onChange={update} autoComplete="email" required maxLength={254} placeholder="Your email address" />
              </label>
            </div>
            <label className="contact-field">
              <span>Subject *</span>
              <input name="subject" value={form.subject} onChange={update} required maxLength={120} placeholder="What is this about?" />
            </label>
            <label className="contact-field">
              <span>Message *</span>
              <textarea name="message" value={form.message} onChange={update} required minLength={5} maxLength={4000} rows={6} placeholder="Write your message here…" />
            </label>
            <button className="btn btn--primary contact-submit" type="submit"><Icon name="mail" size={18} /> Compose email <Icon name="arrowRight" size={17} /></button>
            <p className="contact-form__privacy"><Icon name="shield" size={16} /> Don’t include passwords or other sensitive information.</p>
          </form>

          <aside className="contact-side">
            <article className="card contact-side__card">
              <span className="tile tile--accent"><Icon name="mail" size={22} /></span>
              <h3>Email support</h3>
              <p>For feedback, questions, or help with a city that will not load.</p>
              <a className="contact-email-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </article>
            <article className="card contact-side__card">
              <span className="tile tile--accent"><Icon name="search" size={22} /></span>
              <h3>Reporting an issue?</h3>
              <p>Include the city you searched, the approximate time, and the error message you saw. This helps us understand the problem.</p>
            </article>
          </aside>
        </div>
      </div>
    </>
  );
}
