const GUIDANCE = {
  garlic: {
    aroma: [
      {
        id: "garlic-disrupt-tissue",
        goal: "increase-fresh-garlic-aroma",
        action: "Crush or finely chop the garlic before adding it to the dish.",
        reason: "Breaking the clove's tissue brings alliin and the enzyme alliinase into contact, enabling formation of allicin and related pungent sulfur compounds.",
        expectedEffect: "A sharper, more characteristic fresh-garlic aroma than cooking an intact clove.",
        evidenceLevel: "mechanistic-and-review-evidence",
        caveat: "The exact aroma intensity depends on garlic variety, handling, timing, and the rest of the dish.",
        sourceIds: ["garlic-volatile-review-2020", "ema-allium-assessment"]
      },
      {
        id: "garlic-avoid-prolonged-open-boil",
        goal: "retain-pungent-garlic-notes",
        action: "Avoid prolonged open boiling after crushing garlic if the goal is to retain its sharp, pungent notes.",
        reason: "Thiosulfinates formed after tissue disruption are chemically unstable and volatile; open-container cooking can cause their loss through evaporation and further chemical transformation.",
        expectedEffect: "More of the freshly generated pungent character may remain when exposure to prolonged open heat is reduced.",
        evidenceLevel: "processing-review-and-assessment-evidence",
        caveat: "This is not a universal instruction to undercook garlic. The best method depends on the dish and the desired cooked flavour.",
        sourceIds: ["ema-allium-assessment", "garlic-volatile-review-2020"]
      },
      {
        id: "garlic-cook-whole-mellow",
        goal: "milder-garlic-character",
        action: "Use whole or coarsely cut cloves and cook them when a less sharp garlic profile is desired.",
        reason: "Heating intact or coarsely cut garlic can inactivate alliinase before extensive tissue disruption, limiting the enzymatic formation of allicin and related thiosulfinates.",
        expectedEffect: "A different, generally less pungent sulfur profile than freshly crushed garlic.",
        evidenceLevel: "mechanistic-and-review-evidence",
        caveat: "The final result still depends on temperature, duration, moisture, and whether the clove is later crushed.",
        sourceIds: ["ema-allium-assessment", "garlic-sulfur-review-2025"]
      }
    ]
  }
};

const SOURCE_CATALOG = {
  "ema-allium-assessment": {
    title: "Assessment report on Allium sativum L., bulbus",
    publisher: "European Medicines Agency",
    url: "https://www.ema.europa.eu/en/documents/herbal-report/final-assessment-report-allium-sativum-l-bulbus_en.pdf",
    sourceType: "regulatory-assessment"
  },
  "garlic-volatile-review-2020": {
    title: "Volatile compounds of fresh and processed garlic",
    publisher: "Peer-reviewed review article",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6966211/",
    sourceType: "scientific-review"
  },
  "garlic-sulfur-review-2025": {
    title: "Functionality of garlic sulfur compounds",
    publisher: "Peer-reviewed review article",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12150274/",
    sourceType: "scientific-review"
  }
};

export function getCulinaryGuidance(ingredient, goal) {
  const key = String(ingredient ?? "").trim().toLowerCase();
  const requestedGoal = String(goal ?? "").trim().toLowerCase();
  const all = GUIDANCE[key];
  if (!all) return { ingredient: key, goal: requestedGoal || "all", guidance: [], sources: [], limitation: "No curated culinary guidance is available for this ingredient yet." };

  const guidance = Object.values(all).flat().filter((item) => !requestedGoal || item.goal === requestedGoal || requestedGoal === "aroma");
  const sourceIds = [...new Set(guidance.flatMap((item) => item.sourceIds))];
  return {
    ingredient: key,
    goal: requestedGoal || "all",
    guidance,
    sources: sourceIds.map((id) => ({ id, ...SOURCE_CATALOG[id] })),
    limitation: "Guidance is based on published garlic-processing evidence and curated rules. It is not a personalized recipe diagnosis; the system has not observed the user's actual cooking process."
  };
}
