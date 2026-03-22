export default function Newsletter() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <div className="rounded-2xl border border-cream-300/60 bg-cream-50 p-8 sm:p-12 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl text-bark-600 mb-3">
          Stay in the Loop
        </h2>
        <p className="text-sm sm:text-base text-bark-300 max-w-md mx-auto mb-8">
          Get notified when we launch new apps, drop updates, or do something
          beautifully weird.
        </p>

        {/*
          Mailchimp embedded form — replace the action URL and the
          hidden input name with your Mailchimp list values.

          To find your values:
          1. Go to Mailchimp → Audience → Signup forms → Embedded forms
          2. Copy the form action URL (ends with /post)
          3. Copy the hidden input name (like b_xxxx_yyyy)
        */}
        <form
          action="https://app.us1.list-manage.com/subscribe/post?u=MAILCHIMP_U&amp;id=MAILCHIMP_ID"
          method="post"
          target="_blank"
          noValidate
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            name="EMAIL"
            placeholder="your@email.com"
            required
            className="flex-1 px-4 py-3 rounded-xl border border-cream-300 bg-cream-100 text-bark-600 placeholder:text-bark-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400/40 focus:border-forest-400 transition-colors"
          />
          {/* Bot honeypot — do not remove */}
          <div style={{ position: 'absolute', left: '-5000px' }} aria-hidden="true">
            <input type="text" name="b_MAILCHIMP_U_MAILCHIMP_ID" tabIndex={-1} defaultValue="" />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-forest-400 text-cream-50 text-sm font-medium hover:bg-forest-500 active:bg-forest-600 transition-colors"
          >
            Notify Me
          </button>
        </form>

        <p className="text-xs text-bark-200 mt-4">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
