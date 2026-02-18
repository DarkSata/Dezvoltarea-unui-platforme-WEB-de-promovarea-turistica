import { perks } from '../data/home/perks'
import { testimonials } from '../data/home/testimonials'

export function PerksSection() {
  return (
    <section className="section" id="de-ce">
      <div className="container">
        <div className="section-head">
          <h2>De ce merită Moldova?</h2>
          <p>Mică, dar plină de surprize. Perfectă pentru weekenduri.</p>
        </div>

        <div className="grid perks">
          {perks.map((perk) => (
            <div className="perk" key={perk.title}>
              <i className={perk.icon} aria-hidden="true"></i>
              <h3>{perk.title}</h3>
              <p>{perk.description}</p>
            </div>
          ))}
        </div>

        <div className="testimonials" aria-label="Recomandări de la călători">
          {testimonials.map((testimonial) => (
            <blockquote className="quote" key={testimonial.author}>
              <p>{testimonial.quote}</p>
              <cite>{testimonial.author}</cite>
            </blockquote>
          ))}
        </div>

        <div className="cta" id="contact">
          <div className="cta-text">
            <h3>Vrei să-ți facem un itinerar?</h3>
            <p>Scrie-ne ce preferi (natură / vin / istorie) și câte zile ai.</p>
          </div>
          <a className="btn primary" href="mailto:contact@moldovatravel.md">
            Contactează-ne
          </a>
        </div>
      </div>
    </section>
  )
}
