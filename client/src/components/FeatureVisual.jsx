const chips = (value, limit = 3) => value.split(',').map((item) => item.trim()).filter(Boolean).slice(0, limit)

export default function FeatureVisual({ variant, primary = '', secondary = '', items = [], image, alt = '' }) {
  const ingredientChips = items.length ? items : chips(primary)

  return (
    <aside className={`feature-visual visual-${variant}`} aria-label={`${variant} culinary visual`}>
      {variant === 'intelligence' && (
        <>
          <div className="molecule-orbit"><i /><i /><i /><i /><i /></div>
          {image && <img className="molecule-image" src={image} alt={alt} />}
          <div className="visual-chips">{ingredientChips.map((item) => <span key={item}>{item}</span>)}</div>
          <p>INGREDIENT RELATIONSHIPS</p>
        </>
      )}
      {variant === 'substitution' && (
        <div className="swap-stage">
          <div><small>ORIGINAL</small><strong>{primary}</strong><span>●</span></div>
          <b aria-hidden="true">→</b>
          <div><small>PROPOSED SWAP</small><strong>{secondary}</strong><span>✦</span></div>
          <p>COMPARE CULINARY ROLES</p>
        </div>
      )}
      {variant === 'rescue' && (
        <div className="heat-stage">
          <span className="heat-glow" />
          <i className="heat-flame flame-a" />
          <i className="heat-flame flame-b" />
          <i className="heat-flame flame-c" />
          <div className="heat-pan"><span>{primary || 'READY'}</span></div>
          <small>HEAT CHECK · {secondary || 'MONITOR'}</small>
        </div>
      )}
      {variant === 'nutrition' && (
        <div className="nutrition-stage">
          <div className="nutrition-ring"><span>DATA<br />PENDING</span></div>
          <div className="nutrition-leaf">✿</div>
          <p>{primary} · {secondary}</p>
          <small>NO NUTRITION VALUES ARE ASSUMED</small>
        </div>
      )}
      {variant === 'generator' && (
        <div className="pot-stage">
          <div className="steam"><i /><i /><i /></div>
          <div className="pot-body"><span>✦</span></div>
          <div className="ingredient-rain">{ingredientChips.map((item) => <span key={item}>{item}</span>)}</div>
          <p>{secondary} · BUILD A BRIEF, THEN EXPERIMENT</p>
        </div>
      )}
      {variant === 'discover' && (
        <div className="discover-stage">
          {['✿', '◉', '✦'].map((symbol, index) => (
            <div className={`discover-card discover-card-${index + 1}`} key={symbol}>
              <span>{symbol}</span><strong>{ingredientChips[index] || ['Herbs', 'Citrus', 'Spice'][index]}</strong>
            </div>
          ))}
          <p>{primary} · {secondary}</p>
        </div>
      )}
      {variant === 'compare' && (
        <div className="compare-stage">
          <div><small>BEFORE</small><span className="dish-orbit">◉</span><strong>{primary}</strong></div>
          <b aria-hidden="true">⇢</b>
          <div><small>AFTER</small><span className="dish-orbit transformed">◉</span><strong>{secondary}</strong></div>
        </div>
      )}
      {variant === 'taste' && (
        <div className="taste-stage">
          <div className="taste-orbit"><i /><i /><i /><i /><i /></div>
          <div><strong>{primary}</strong><span>{secondary}</span></div>
          <small>YOUR SELF-REPORTED PROFILE</small>
        </div>
      )}
    </aside>
  )
}
