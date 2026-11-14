const MOLECULE_GUIDE = {
  "diallyl disulfide": {
    family: "organosulfur compound",
    plainMeaning: "A sulfur-containing compound commonly associated with the characteristic pungent, savory garlic-like aroma.",
    culinaryRelevance: "Useful as a clue for garlic's sharp allium character; it does not quantify how strongly a dish will smell or taste of garlic.",
    interpretationLevel: "general-compound-knowledge"
  },
  "diallyl trisulfide": {
    family: "organosulfur compound",
    plainMeaning: "A sulfur-rich compound associated with strong allium and cooked-garlic aroma notes.",
    culinaryRelevance: "Can help explain why garlic contributes a forceful savory aroma, but the dataset does not reveal its concentration in the ingredient or dish.",
    interpretationLevel: "general-compound-knowledge"
  },
  "diallyl sulfide": {
    family: "organosulfur compound",
    plainMeaning: "A volatile sulfur compound associated with the characteristic smell of allium ingredients.",
    culinaryRelevance: "Supports a broad explanation of garlic's sulfurous aroma character, not a prediction of final dish intensity.",
    interpretationLevel: "general-compound-knowledge"
  },
  "allyl methyl sulfide": {
    family: "organosulfur compound",
    plainMeaning: "A sulfur-containing volatile associated with allium-like aroma.",
    culinaryRelevance: "A possible contributor to garlic's pungent aromatic profile; no amount or sensory impact is supplied by this response.",
    interpretationLevel: "general-compound-knowledge"
  },
  "allyl mercaptan": {
    family: "organosulfur compound",
    plainMeaning: "A volatile sulfur compound with a potent sulfurous odor.",
    culinaryRelevance: "Can be mentioned when explaining pungent garlic-like notes, but should not be treated as a standalone flavor recommendation.",
    interpretationLevel: "general-compound-knowledge"
  },
  "linalool": {
    family: "terpene alcohol",
    plainMeaning: "An aromatic compound often described with floral and citrus-like notes.",
    culinaryRelevance: "Its presence in a broad provider association list does not establish that it meaningfully shapes garlic's aroma.",
    interpretationLevel: "general-compound-knowledge"
  },
  "vanillin": {
    family: "aromatic aldehyde",
    plainMeaning: "The compound associated with the familiar vanilla aroma.",
    culinaryRelevance: "Do not infer that garlic tastes like vanilla; the provider list alone does not establish concentration, origin, or sensory contribution.",
    interpretationLevel: "general-compound-knowledge"
  },
  "3-ethyl-2,5-dimethylpyrazine": {
    family: "pyrazine",
    plainMeaning: "A pyrazine commonly associated with roasted, nutty, toasted aroma notes.",
    culinaryRelevance: "May be useful in a general explanation of roasted-food aroma chemistry, but this record does not prove a meaningful contribution in raw garlic.",
    interpretationLevel: "general-compound-knowledge"
  },
  "2,5-dimethylpyrazine": {
    family: "pyrazine",
    plainMeaning: "A pyrazine associated with roasted and nutty aroma descriptors.",
    culinaryRelevance: "Do not attribute a roasted taste to garlic from this association alone; cooking conditions and measured concentration are unknown.",
    interpretationLevel: "general-compound-knowledge"
  }
};

function normalizeName(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function explainMolecules(molecules = []) {
  const seen = new Set();
  const insights = [];
  let unclassifiedCount = 0;

  for (const molecule of molecules) {
    const name = molecule?.common_name ?? molecule?.commonName ?? molecule?.name;
    const normalized = normalizeName(name);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    const guide = MOLECULE_GUIDE[normalized];
    if (!guide) {
      unclassifiedCount += 1;
      continue;
    }
    insights.push({
      name,
      pubchemId: molecule.pubchem_id ?? molecule.pubchemId ?? null,
      ...guide
    });
  }

  return {
    insights,
    note: "These are cautious, curated explanations of selected compound families and commonly reported aroma descriptors. They are not proof that the compound is present at a sensory-relevant concentration in this ingredient or dish.",
    method: "curated-allowlist",
    unclassifiedCount
  };
}
