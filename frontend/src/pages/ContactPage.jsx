import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import PageHeader from '../components/PageHeader.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { CONTACT_EMAIL } from '../config/site.js';
import { sendContactMessage } from '../services/contactService.js';
import { describeContactError } from '../utils/contactErrors.js';

const TOPICS = ['Feedback', 'Question', 'Problem report', 'Other'];
const MAX_MESSAGE = 4000;
const EMPTY = { name: '', email: '', topic: 'Feedback', message: '', company: '' };

export default function ContactPage() {
  usePageTitle('Contact – MS Weather');
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    if (status === 'error') {
      setStatus('idle');
      setError('');
    }
  }

  async function submit(event) {
    event.preventDefault();
    if (status === 'sending') return;
    // Read the spam-trap field straight from the form, so it counts even if a bot fills it without React noticing.
    const company = new FormData(event.currentTarget).get('company') ?? '';
    setStatus('sending');
    setError('');
    try {
      await sendContactMessage({ ...form, company: String(company) });
      setForm(EMPTY);
      setStatus('sent');
    } catch (err) {
      setError(describeContactError(err));
      setStatus('error');
    }
  }

  return (
    <>
      <PageHeader icon="phone-arrow-right" title="Contact" subtitle="Have a question or feedback? Send us a message." />
      <div className="container page-body contact-page">
        <section className="contact-intro">
          <span className="tile tile--accent"><Icon name="mail" size={26} /></span>
          <p className="eyebrow">LET’S TALK</p>
          <h2>Get in touch</h2>
          <p>Send us feedback, a question or a problem report. We will reply to the email address you provide.</p>
        </section>

        <div className="contact-form-layout">
          {status === 'sent' ? (
            <section className="card contact-form contact-sent" role="status">
              <span className="tile tile--accent"><Icon name="mail" size={22} /></span>
              <h3>Message sent</h3>
              <p>Thank you! We received your message and will reply to the email address you gave.</p>
              <button type="button" className="btn btn--primary" onClick={() => setStatus('idle')}>Send another message</button>
            </section>
          ) : (
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
                <span>Topic *</span>
                <select name="topic" value={form.topic} onChange={update} required>
                  {TOPICS.map((topic) => <option key={topic} value={topic}>{topic}</option>)}
                </select>
              </label>
              <label className="contact-field">
                <span>Message *</span>
                <textarea name="message" value={form.message} onChange={update} required minLength={5} maxLength={MAX_MESSAGE} rows={6} placeholder="Write your message here…" />
                <small className="contact-count">{form.message.length}/{MAX_MESSAGE}</small>
              </label>

              {/* Spam trap: real visitors never see or fill this in. */}
              <div className="contact-hp" aria-hidden="true">
                <label>Company<input name="company" value={form.company} onChange={update} tabIndex={-1} autoComplete="off" /></label>
              </div>

              <button className="btn btn--primary contact-submit" type="submit" disabled={status === 'sending'}>
                <Icon name="mail" size={18} /> {status === 'sending' ? 'Sending…' : 'Send message'} <Icon name="arrowRight" size={17} />
              </button>
              {error && <p className="contact-form__error" role="alert">{error}</p>}
              <p className="contact-form__privacy"><Icon name="shield" size={16} /> Don’t include passwords or other sensitive information.</p>
            </form>
          )}

          <aside className="contact-side">
            {CONTACT_EMAIL && (
              <article className="card contact-side__card">
                <span className="tile tile--accent"><Icon name="mail" size={22} /></span>
                <h3>Prefer email?</h3>
                <p>You can also write to us directly.</p>
                <a className="contact-email-link" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </article>
            )}
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
