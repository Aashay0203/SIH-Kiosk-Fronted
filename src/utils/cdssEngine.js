/**
 * cdssEngine.js — Clinical Decision Support System (CDSS)
 * Real-time Drug-Drug, Drug-Allergy & Organ-Function Interaction Engine
 */

const ALLERGY_RULES = [
  {
    allergyKeyword: "penicillin",
    flaggedDrugs: ["amoxicillin", "ampicillin", "augmentin", "penicillin", "piperacillin", "amoxil"],
    severity: "CRITICAL",
    message: "Patient has documented Penicillin allergy. Prescribing beta-lactam antibiotics risks severe Anaphylaxis / Type-I hypersensitivity.",
  },
  {
    allergyKeyword: "sulfa",
    flaggedDrugs: ["bactrim", "co-trimoxazole", "sulfamethoxazole", "sulfasalazine", "dapsone"],
    severity: "CRITICAL",
    message: "Patient has documented Sulfa allergy. Prescribing sulfonamide agents risks severe cutaneous adverse reactions (SCAR / SJS).",
  },
  {
    allergyKeyword: "nsaid",
    flaggedDrugs: ["ibuprofen", "diclofenac", "naproxen", "aspirin", "aceclofenac", "ketorolac", "piroxicam"],
    severity: "URGENT",
    message: "Patient is allergic or sensitive to NSAIDs. Risk of acute bronchospasm, angioedema, or severe gastric ulceration.",
  },
];

const DRUG_DRUG_RULES = [
  {
    drugA: ["aspirin", "clopidogrel", "warfarin", "heparin", "dabigatran", "apixaban"],
    drugB: ["ibuprofen", "diclofenac", "naproxen", "aceclofenac", "ketorolac"],
    severity: "CRITICAL",
    type: "Bleeding Risk",
    message: "Major Drug-Drug Interaction: Combining Antiplatelet/Anticoagulant with NSAID exponentially increases risk of major gastrointestinal hemorrhage.",
  },
  {
    drugA: ["metformin"],
    drugB: ["radiocontrast", "iodinated contrast", "topiramate"],
    severity: "CRITICAL",
    type: "Metabolic Risk",
    message: "Risk of fatal Lactic Acidosis. Metformin must be temporarily withheld prior to contrast administration.",
  },
  {
    drugA: ["sildenafil", "tadalafil", "vardenafil"],
    drugB: ["nitroglycerin", "isosorbide", "sorbitrate", "mononitrate", "nitrate"],
    severity: "CRITICAL",
    type: "Cardiovascular Collapse",
    message: "Life-Threatening Interaction: PDE-5 Inhibitor + Nitrate co-administration can cause catastrophic refractory hypotension and cardiac arrest.",
  },
  {
    drugA: ["atorvastatin", "simvastatin", "rosuvastatin"],
    drugB: ["clarithromycin", "erythromycin", "itraconazole", "ketoconazole"],
    severity: "URGENT",
    type: "Rhabdomyolysis Risk",
    message: "CYP3A4 Inhibition: Co-administration significantly elevates serum statin levels, drastically increasing risk of acute rhabdomyolysis and myopathy.",
  },
  {
    drugA: ["enalapril", "ramipril", "losartan", "telmisartan"],
    drugB: ["spironolactone", "potassium chloride", "k-cl", "potassium"],
    severity: "URGENT",
    type: "Severe Hyperkalemia",
    message: "Additive Potassium Retention: High risk of dangerous cardiac arrhythmias due to severe Hyperkalemia.",
  },
];

export function checkPrescriptionSafety({
  newMedications = [], // e.g. ["Amoxicillin 500mg", "Ibuprofen 400mg"]
  patientAllergies = [], // e.g. ["Penicillin", "Dust"]
  currentMedications = [], // e.g. ["Warfarin 5mg", "Metformin 500mg"]
  labFlags = {}, // e.g. { kidneyIssue: true, liverIssue: true }
}) {
  const alerts = [];

  const cleanNewMeds = newMedications.map((m) => (typeof m === "string" ? m : m.name || "").toLowerCase());
  const cleanAllergies = patientAllergies.map((a) => a.toLowerCase());
  const cleanCurrentMeds = currentMedications.map((m) => (typeof m === "string" ? m : m.name || "").toLowerCase());

  // 1. Check Drug-Allergy Conflicts
  cleanNewMeds.forEach((newMed) => {
    ALLERGY_RULES.forEach((rule) => {
      const hasAllergy = cleanAllergies.some((a) => a.includes(rule.allergyKeyword));
      if (hasAllergy) {
        const matchesDrug = rule.flaggedDrugs.some((d) => newMed.includes(d));
        if (matchesDrug) {
          alerts.push({
            type: "DRUG_ALLERGY",
            severity: rule.severity,
            drug: newMed,
            title: `🚨 Severe Allergy Conflict: ${newMed.toUpperCase()}`,
            message: rule.message,
          });
        }
      }
    });
  });

  // 2. Check Drug-Drug Conflicts (New Meds vs Current Meds & New Meds vs New Meds)
  const allActiveDrugs = [...cleanCurrentMeds, ...cleanNewMeds];

  DRUG_DRUG_RULES.forEach((rule) => {
    const hasDrugA = allActiveDrugs.some((med) => rule.drugA.some((d) => med.includes(d)));
    const hasDrugB = cleanNewMeds.some((med) => rule.drugB.some((d) => med.includes(d)));

    if (hasDrugA && hasDrugB) {
      alerts.push({
        type: "DRUG_INTERACTION",
        severity: rule.severity,
        title: `⚠️ ${rule.type}: Interaction Detected`,
        message: rule.message,
      });
    }
  });

  // 3. Organ Impairment Safety Warnings
  if (labFlags.kidneyIssue) {
    const kidneyRisks = ["ibuprofen", "diclofenac", "gentamicin", "amikacin", "metformin"];
    cleanNewMeds.forEach((med) => {
      if (kidneyRisks.some((r) => med.includes(r))) {
        alerts.push({
          type: "RENAL_WARNING",
          severity: "URGENT",
          title: `🫘 Renal Safety Warning: ${med.toUpperCase()}`,
          message: "Patient's digitized lab tests show elevated Creatinine/Urea. Nephrotoxic medication requires strict dose adjustment or alternative.",
        });
      }
    });
  }

  if (labFlags.liverIssue) {
    const liverRisks = ["paracetamol", "acetaminophen", "isoniazid", "methotrexate"];
    cleanNewMeds.forEach((med) => {
      if (liverRisks.some((r) => med.includes(r))) {
        alerts.push({
          type: "HEPATIC_WARNING",
          severity: "URGENT",
          title: `🫁 Hepatic Safety Advisory: ${med.toUpperCase()}`,
          message: "Patient's digitized LFT shows elevated SGPT/SGOT. Hepatotoxic load should be limited.",
        });
      }
    });
  }

  return {
    isSafe: alerts.length === 0,
    alertCount: alerts.length,
    alerts,
  };
}
