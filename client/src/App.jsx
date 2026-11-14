import { useState } from 'react'

const modules = [
  { id: 'intelligence', icon: '◈', title: 'Recipe Intelligence', desc: 'Decode recipes, ingredients and nutritional composition.' },
  { id: 'substitution', icon: '⇄', title: 'Ingredient Swap', desc: 'Find alternatives while considering taste and cooking function.' },
  { id: 'repair', icon: '✳', title: 'Recipe Rescue', desc: 'Diagnose cooking problems and explore practical fixes.' },
]
const recipes = [
  { name: 'Paneer Butter Masala', cuisine: 'NORTH INDIAN', time: '35 MIN', emoji: '🍛' },
  { name: 'Thai Green Curry', cuisine: 'THAI', time: '30 MIN', emoji: '🍲' },
  { name: 'Mushroom Risotto', cuisine: 'ITALIAN', time: '40 MIN', emoji: '🍚' },
]
const swaps = {
  Paneer: ['Tofu', 'Tempeh', 'Halloumi'],
  Milk: ['Oat milk', 'Soy milk', 'Coconut milk'],
  Butter: ['Olive oil', 'Coconut oil', 'Vegan butter'],
  Sugar: ['Jaggery', 'Honey', 'Maple syrup'],
  Cream: ['Cashew cream', 'Coconut cream', 'Greek yogurt'],
}

export default function App() {
  const [active, setActive] = useState('intelligence')
  const [recipe, setRecipe] = useState(recipes[0].name)
  const [ingredient, setIngredient] = useState('Paneer')
  const [requirement, setRequirement] = useState('Vegan alternative')
  const [problem, setProblem] = useState('Too spicy')
  const [details, setDetails] = useState('')
  const [result, setResult] = useState(false)
  const current = modules.find(item => item.id === active)

  function changeModule(id) {
    setActive(id)
    setResult(false)
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <a className="brand" href="#"><span className="brand-mark">F.</span><span><b>flavourforge</b><small>COMPUTATIONAL GASTRONOMY</small></span></a>
        <p className="nav-label">WORKSPACE</p>
        <nav>{modules.map(item => <button key={item.id} className={active === item.id ? 'nav-link active' : 'nav-link'} onClick={() => changeModule(item.id)}><span>{item.icon}</span>{item.title}{active === item.id && <i />}</button>)}</nav>
        <div className="side-bottom"><span className="ready"><i /> SYSTEM READY</span><div className="profile"><span className="avatar">FF</span><span><b>Kitchen Lab</b><small>Research workspace</small></span></div></div>
      </aside>

      <main className="main">
        <header className="topbar"><span>Workspace <b>/</b> {current.title}</span><span className="demo">● DEMO MODE</span></header>
        <div className="content">
          <section className="hero">
            <div><p className="eyebrow">YOUR INTELLIGENT KITCHEN</p><h1>Think beyond<br /><em>the recipe.</em></h1><p className="intro">Understand food at a deeper level. Explore ingredients, engineer substitutions and rescue recipes with culinary intelligence.</p></div>
            <div className="hero-art"><div className="ring ring-a" /><div className="ring ring-b" /><span>🥘</span><small>FLAVOUR · SCIENCE · CREATIVITY</small></div>
          </section>

          <section className="section"><div className="section-head"><div><p className="eyebrow">01 / SELECT A TOOL</p><h2>Your culinary workspace</h2></div><small>3 INTELLIGENCE MODULES</small></div>
            <div className="module-grid">{modules.map(item => <button key={item.id} className={active === item.id ? 'module-card chosen' : 'module-card'} onClick={() => changeModule(item.id)}><div className="module-top"><span>{item.icon}</span><small>{item.id.toUpperCase()}</small></div><h3>{item.title}</h3><p>{item.desc}</p><div className="module-foot">{active === item.id ? 'CURRENTLY ACTIVE' : 'OPEN MODULE'} <b>↗</b></div></button>)}</div>
          </section>

          <section className="lab">
            <div className="lab-head"><div><p className="eyebrow">02 / INTERACTIVE LAB</p><h2>{current.title}</h2></div><span className="ready"><i /> READY TO EXPLORE</span></div>
            <div className="lab-grid"><div className="form">
              {active === 'intelligence' && <><label>SELECT A RECIPE</label><select value={recipe} onChange={e => {setRecipe(e.target.value);setResult(false)}}>{recipes.map(item => <option key={item.name}>{item.name}</option>)}</select><label>OR SEARCH FOR A RECIPE</label><input value={details} onChange={e => {setDetails(e.target.value);setResult(false)}} placeholder="e.g. Chicken Biryani..." /><button className="primary" onClick={() => setResult(true)}>Analyze recipe <b>↗</b></button></>}
              {active === 'substitution' && <><label>INGREDIENT TO REPLACE</label><select value={ingredient} onChange={e => {setIngredient(e.target.value);setResult(false)}}>{Object.keys(swaps).map(item => <option key={item}>{item}</option>)}</select><label>YOUR REQUIREMENT</label><select value={requirement} onChange={e => {setRequirement(e.target.value);setResult(false)}}><option>Vegan alternative</option><option>Dairy-free</option><option>Lower calorie</option><option>Commonly available</option></select><button className="primary" onClick={() => setResult(true)}>Find alternatives <b>↗</b></button></>}
              {active === 'repair' && <><label>WHAT WENT WRONG?</label><select value={problem} onChange={e => {setProblem(e.target.value);setResult(false)}}>{['Too spicy','Too salty','Too sour','Too watery','Too thick','Burnt or overcooked'].map(item => <option key={item}>{item}</option>)}</select><label>DESCRIBE YOUR DISH</label><textarea value={details} onChange={e => {setDetails(e.target.value);setResult(false)}} placeholder="Tell us what you were cooking..." /><button className="primary" onClick={() => setResult(true)}>Rescue my recipe <b>↗</b></button></>}
            </div><div className="lab-aside"><span className="aside-icon">{current.icon}</span><h3>{active === 'intelligence' ? <>Understand what's<br />on your plate.</> : active === 'substitution' ? <>Replace ingredients,<br />not the experience.</> : <>Not every mistake<br />ruins a meal.</>}</h3><p>{active === 'intelligence' ? 'Explore recipe composition, ingredient relationships and culinary characteristics.' : active === 'substitution' ? 'Discover alternatives with consideration for taste, texture and cooking function.' : 'Describe the problem and explore possible corrective techniques.'}</p><small>MOCK DATA · API NOT CONNECTED</small></div></div>
            {result && <div className="result"><p className="eyebrow">✳ SIMULATED RESULT</p>
              {active === 'intelligence' && <><h3>{details || recipe}</h3><p>Recipe analysis is ready for integration. Ingredient composition, instructions and nutritional information will be populated from RecipeDB.</p><div className="chips"><span>Composition</span><span>Ingredients</span><span>Nutrition</span></div></>}
              {active === 'substitution' && <><h3>Alternatives for {ingredient}</h3><div className="swap-list">{swaps[ingredient].map((item,i) => <div key={item}><span>0{i+1}</span><b>{item}</b><small>Potential {requirement.toLowerCase()}</small></div>)}</div><p>Illustrative suggestions only. Suitability and nutritional equivalence are not verified.</p></>}
              {active === 'repair' && <><h3>Let's fix: {problem}</h3><p>{problem === 'Too spicy' ? 'Try increasing the dish volume with compatible mild ingredients or adding a dairy-based component where suitable.' : problem === 'Too salty' ? 'Dilute with unsalted ingredients or increase the portion of the unsalted base.' : 'Adjust gradually with compatible ingredients, then recheck the dish texture and flavour.'}</p><small>General cooking guidance · Not a validated prediction</small></>}
            </div>}
          </section>

          <section className="section recipes"><div className="section-head"><div><p className="eyebrow">03 / EXPLORE</p><h2>Recipes to experiment with</h2></div><small>ILLUSTRATIVE SAMPLES</small></div><div className="recipe-grid">{recipes.map(item => <button className="recipe-card" key={item.name} onClick={() => {setActive('intelligence');setRecipe(item.name);setResult(false)}}><span className="food">{item.emoji}</span><span className="recipe-info"><small>{item.cuisine}</small><b>{item.name}</b><small>{item.time} · SAMPLE RECIPE</small></span><b className="arrow">↗</b></button>)}</div></section>
          <footer><span>FLAVOURFORGE © 2026</span><span>BUILT FOR FORK-IT 2026 · CULINARY INTELLIGENCE</span></footer>
        </div>
      </main>
    </div>
  )
}
