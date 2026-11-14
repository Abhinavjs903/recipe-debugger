import { useState } from 'react'

const modules = [
  { id: 'understand', title: 'Understand a recipe', eyebrow: 'RECIPE INTELLIGENCE', description: 'Explore ingredients, cooking steps, nutrition and flavour relationships.', icon: '◈' },
  { id: 'swap', title: 'Find an ingredient swap', eyebrow: 'SMART SUBSTITUTION', description: 'Explore alternatives while considering taste, texture and cooking function.', icon: '⇄' },
  { id: 'rescue', title: 'Rescue a dish', eyebrow: 'RECIPE REPAIR', description: 'Describe what went wrong and explore practical ways to correct it.', icon: '✳' },
]
const recipeSamples = [
  { name: 'Paneer Butter Masala', region: 'North Indian', time: '35 min', level: 'Intermediate', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=85', tags: ['Creamy', 'Spiced'] },
  { name: 'Thai Green Curry', region: 'Thai', time: '30 min', level: 'Easy', image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=900&q=85', tags: ['Herbal', 'Coconut'] },
  { name: 'Mushroom Risotto', region: 'Italian', time: '40 min', level: 'Intermediate', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=900&q=85', tags: ['Earthy', 'Comfort'] },
  { name: 'Roasted Vegetable Bowl', region: 'Mediterranean', time: '25 min', level: 'Easy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85', tags: ['Fresh', 'Balanced'] },
]
const replacements = {
  Paneer: ['Tofu', 'Tempeh', 'Halloumi'],
  Milk: ['Oat milk', 'Soy milk', 'Coconut milk'],
  Butter: ['Olive oil', 'Coconut oil', 'Vegan butter'],
  Sugar: ['Jaggery', 'Honey', 'Maple syrup'],
  Cream: ['Cashew cream', 'Coconut cream', 'Greek yogurt'],
  Egg: ['Flaxseed gel', 'Applesauce', 'Aquafaba'],
}
const rescueTips = {
  'Too spicy': 'Increase the dish volume with compatible mild ingredients. A dairy-based component may soften heat in suitable recipes.',
  'Too salty': 'Add an unsalted base or compatible liquid gradually, then rebalance the other flavours.',
  'Too sour': 'Balance gradually with a little sweetness or fat where compatible with the dish.',
  'Too watery': 'Simmer uncovered to reduce excess liquid, or add a suitable thickening ingredient in small amounts.',
  'Too thick': 'Loosen gradually with warm stock, water or another liquid that belongs in the recipe.',
  'Burnt or overcooked': 'Move the unburnt portion to a clean pan without scraping the bottom; rebuild flavour separately if needed.',
}
const navItems = ['Overview', 'Recipe intelligence', 'Ingredient swap', 'Recipe rescue']

function Brand() {
  return <a className="brand" href="#top"><span className="brand-symbol">f<span>.</span></span><span className="brand-name">flavourforge<small>THE CULINARY INTELLIGENCE LAB</small></span></a>
}

function App() {
  const [active, setActive] = useState('understand')
  const [recipeQuery, setRecipeQuery] = useState('')
  const [chosenRecipe, setChosenRecipe] = useState(recipeSamples[0].name)
  const [ingredient, setIngredient] = useState('Paneer')
  const [goal, setGoal] = useState('Vegan alternative')
  const [problem, setProblem] = useState('Too spicy')
  const [notes, setNotes] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  function selectModule(id) {
    setActive(id)
    setShowResult(false)
  }
  const filteredRecipes = recipeSamples.filter(recipe => {
    const matchText = (recipe.name + recipe.region + recipe.tags.join(' ')).toLowerCase().includes(search.toLowerCase())
    return matchText && (filter === 'All' || recipe.region === filter)
  })

  return (
    <div id="top" className="site-shell">
      <header className="site-header">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item, i) => <a key={item} href={i === 0 ? '#top' : i === 1 ? '#lab' : i === 2 ? '#lab' : '#lab'} onClick={() => i > 1 && selectModule(i === 2 ? 'swap' : 'rescue')}>{item}</a>)}
        </nav>
        <a className="header-cta" href="#lab">Enter the lab <span>↗</span></a>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> A NEW WAY TO THINK ABOUT FOOD</div>
            <h1>Recipes are<br />a <em>starting point.</em></h1>
            <p className="hero-description">Explore the science behind ingredients, understand how flavours connect, and learn how to make every recipe your own.</p>
            <div className="hero-actions"><a className="button-primary" href="#lab">Explore the kitchen <span>↗</span></a><a className="text-link" href="#how-it-works">How it works <span>↓</span></a></div>
            <div className="hero-footnote"><span>01</span> DISCOVER · EXPERIMENT · UNDERSTAND</div>
          </div>
          <div className="hero-visual">
            <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1400&q=90" alt="Fresh ingredients and herbs arranged on a kitchen table" />
            <div className="image-shade" />
            <div className="image-caption"><span>THE ART OF UNDERSTANDING FOOD</span><b>Curiosity is the secret ingredient.</b></div>
            <div className="floating-note"><span>✳</span><div><b>Flavour is a system.</b><small>Not just a list of ingredients.</small></div></div>
          </div>
        </section>

        <section className="intro-strip" id="how-it-works">
          <div><span className="strip-number">01 / THE IDEA</span><h2>Cook with curiosity.<br/><em>Understand every choice.</em></h2></div>
          <p>Great cooking is part intuition, part experimentation. FlavourForge gives you a place to explore what goes into a dish, how ingredients behave, and what you might try when a recipe needs a rethink.</p>
          <div className="strip-mark">F.</div>
        </section>

        <section className="lab-section" id="lab">
          <div className="section-kicker">02 / YOUR CULINARY WORKSPACE</div>
          <div className="section-title-row"><div><h2>What are we <em>working on?</em></h2><p>Choose a direction. The lab is ready.</p></div><span className="section-index">FLAVOURFORGE / LAB 001</span></div>
          <div className="workspace-layout">
            <aside className="workspace-nav">
              <span className="nav-heading">CHOOSE YOUR EXPERIMENT</span>
              {modules.map((module, i) => <button key={module.id} className={active === module.id ? 'workspace-nav-item selected' : 'workspace-nav-item'} onClick={() => selectModule(module.id)}><span className="workspace-icon">{module.icon}</span><span><small>0{i + 1} / {module.eyebrow}</small><b>{module.title}</b></span><i>↗</i></button>)}
              <div className="nav-tip"><span>✦</span><p>Food is more than a formula. Every ingredient brings its own role.</p></div>
            </aside>

            <div className="experiment-panel">
              <div className="experiment-header"><div><span className="live-dot" /> EXPERIMENT MODE</div><span>MOCK DATA · BACKEND NOT CONNECTED</span></div>
              {active === 'understand' && <div className="experiment-body">
                <div className="experiment-copy"><span className="module-label">◈ RECIPE INTELLIGENCE</span><h3>Get to know<br/>your <em>recipe.</em></h3><p>Start with a dish and explore its ingredients, preparation, and culinary profile.</p>
                  <label htmlFor="recipe-choice">CHOOSE A SAMPLE RECIPE</label><select id="recipe-choice" value={chosenRecipe} onChange={e => {setChosenRecipe(e.target.value);setShowResult(false)}}>{recipeSamples.map(r => <option key={r.name}>{r.name}</option>)}</select>
                  <label htmlFor="recipe-search">OR SEARCH BY NAME</label><input id="recipe-search" value={recipeQuery} onChange={e => {setRecipeQuery(e.target.value);setShowResult(false)}} placeholder="e.g. Vegetable Biryani"/>
                  <button className="button-primary full" onClick={() => setShowResult(true)}>Explore this recipe <span>↗</span></button>
                </div><div className="experiment-art"><img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85" alt="A colourful bowl of prepared food"/><div className="art-stamp">INGREDIENTS<br/>×<br/>CURIOSITY</div></div>
              </div>}
              {active === 'swap' && <div className="experiment-body">
                <div className="experiment-copy"><span className="module-label">⇄ SMART INGREDIENT SUBSTITUTION</span><h3>Make room<br/>for <em>alternatives.</em></h3><p>Explore possible ingredient swaps based on the role an ingredient plays in a recipe.</p>
                  <label htmlFor="ingredient">INGREDIENT TO REPLACE</label><select id="ingredient" value={ingredient} onChange={e => {setIngredient(e.target.value);setShowResult(false)}}>{Object.keys(replacements).map(x => <option key={x}>{x}</option>)}</select>
                  <label htmlFor="swap-goal">YOUR PREFERENCE</label><select id="swap-goal" value={goal} onChange={e => {setGoal(e.target.value);setShowResult(false)}}><option>Vegan alternative</option><option>Dairy-free</option><option>Lower calorie</option><option>Commonly available</option></select>
                  <button className="button-primary full" onClick={() => setShowResult(true)}>Explore alternatives <span>↗</span></button>
                </div><div className="experiment-art"><img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85" alt="Fresh vegetables and ingredients"/><div className="art-stamp">SWAP<br/>WITH<br/>PURPOSE</div></div>
              </div>}
              {active === 'rescue' && <div className="experiment-body">
                <div className="experiment-copy"><span className="module-label">✳ RECIPE RESCUE</span><h3>Every mishap<br/>has a <em>next step.</em></h3><p>Tell us what happened. Explore practical ways to bring the dish back into balance.</p>
                  <label htmlFor="problem">WHAT WENT WRONG?</label><select id="problem" value={problem} onChange={e => {setProblem(e.target.value);setShowResult(false)}}>{Object.keys(rescueTips).map(x => <option key={x}>{x}</option>)}</select>
                  <label htmlFor="dish-notes">TELL US A LITTLE MORE</label><textarea id="dish-notes" value={notes} onChange={e => {setNotes(e.target.value);setShowResult(false)}} placeholder="What were you making? What did you notice?"/>
                  <button className="button-primary full" onClick={() => setShowResult(true)}>Find a way forward <span>↗</span></button>
                </div><div className="experiment-art"><img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=85" alt="A warm, inviting home kitchen"/><div className="art-stamp">LEARN<br/>FROM<br/>THE MESS</div></div>
              </div>}
              {showResult && <div className="mock-result"><div className="result-top"><span>✳ / A FIRST LOOK</span><small>ILLUSTRATIVE · NOT VERIFIED</small></div>
                {active === 'understand' && <><h4>{recipeQuery.trim() || chosenRecipe}</h4><p>Your recipe workspace is ready. In the connected version, ingredient composition, recipe steps, nutrition and flavour references will appear here.</p><div className="result-tags"><span>Recipe overview</span><span>Ingredients</span><span>Flavour profile</span></div></>}
                {active === 'swap' && <><h4>Alternatives for {ingredient}</h4><p>Possible options to explore for your preference: {goal.toLowerCase()}.</p><div className="swap-options">{replacements[ingredient].map((x,i)=><div key={x}><small>0{i+1}</small><b>{x}</b><span>Explore role and fit ↗</span></div>)}</div><p className="disclaimer">These are illustrative ideas, not verified one-to-one replacements. Suitability depends on the recipe.</p></>}
                {active === 'rescue' && <><h4>{problem}</h4><p>{rescueTips[problem]}</p><p className="disclaimer">General cooking guidance. Test gradually and use your judgment; this is not a validated diagnosis.</p></>}
              </div>}
            </div>
          </div>
        </section>

        <section className="recipe-section">
          <div className="section-kicker">03 / THE INSPIRATION SHELF</div>
          <div className="section-title-row"><div><h2>Good things <em>to explore.</em></h2><p>Browse a few starting points for your next kitchen experiment.</p></div><span className="section-index">SAMPLE COLLECTION</span></div>
          <div className="recipe-controls"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search recipes or ingredients..."/><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option>{[...new Set(recipeSamples.map(r=>r.region))].map(x=><option key={x}>{x}</option>)}</select></div>
          <div className="recipe-grid">{filteredRecipes.map((recipe,i)=><article key={recipe.name} className="recipe-card"><div className="recipe-image"><img src={recipe.image} alt={recipe.name}/><span>0{i+1}</span></div><div className="recipe-meta">{recipe.region}<span>{recipe.time}</span></div><h3>{recipe.name}</h3><div className="recipe-tags">{recipe.tags.map(t=><span key={t}>{t}</span>)}</div><button onClick={()=>{setActive('understand');setChosenRecipe(recipe.name);setRecipeQuery('');setShowResult(true);document.getElementById('lab').scrollIntoView({behavior:'smooth'})}}>Explore recipe <b>↗</b></button></article>)}</div>
          {filteredRecipes.length===0&&<p className="empty-state">No matching samples. Try another search.</p>}
        </section>

        <section className="closing-section"><div><span className="section-kicker">04 / KEEP EXPERIMENTING</span><h2>Make every meal<br/><em>a discovery.</em></h2><p>Start with what you know. Ask better questions. Find something new.</p><a href="#lab" className="button-light">Back to the lab <span>↗</span></a></div><div className="closing-symbol">F.</div></section>
      </main>
      <footer className="site-footer"><Brand/><span>COMPUTATIONAL GASTRONOMY · FORK-IT 2026</span><a href="#top">BACK TO TOP ↑</a></footer>
    </div>
  )
}

export default App
