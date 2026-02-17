import { checklist } from '../data/home/checklist'

export function GuideSection() {
  return (
    <section className="section" id="ghid-rapid">
      <div className="container">
        <div className="section-head">
          <h2>Ghid rapid inainte de plecare</h2>
          <p>Un checklist compact care te ajuta sa organizezi un city-break fara stres.</p>
        </div>

        <div className="grid check-grid">
          {checklist.map((item, index) => (
            <article className="check-item" key={item.title}>
              <span className="check-index">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
