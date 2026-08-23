/**
 * fhirService.js — HL7 FHIR R4 Standard Clinical Bundle Generator
 * Ayushman Bharat Digital Mission (ABDM) Compliant Architecture
 */

export function generateAbdmFhirBundle({ patient, healthProfile, clinicalSummary, doctor, appointment }) {
  const timestamp = new Date().toISOString();
  const bundleId = `bundle-medikiosk-${Date.now()}`;
  const patientId = patient?._id || "patient-anonymous";
  const abhaAddress = healthProfile?.userProvided?.consentAndAbha?.abhaId || patient?.email || "91-9473-6297-0012@abdm";

  const ud = healthProfile?.userProvided || {};
  const ai = healthProfile?.aiExtracted || {};
  const socrates = ud?.socratesHpi || {};
  const ayush = ud?.ayushAssessment || {};

  const entries = [
    // 1. Composition Resource (Clinical Document Header)
    {
      fullUrl: `urn:uuid:composition-opd-${Date.now()}`,
      resource: {
        resourceType: "Composition",
        id: `comp-${Date.now()}`,
        status: "final",
        type: {
          coding: [
            {
              system: "http://loinc.org",
              code: "34117-2",
              display: "History and Physical Examination Document",
            },
          ],
          text: "MediKiosk OPD Clinical Intake Record",
        },
        subject: {
          reference: `urn:uuid:patient-${patientId}`,
          display: patient?.name || "Patient",
        },
        date: timestamp,
        author: [
          {
            display: doctor?.name ? `Dr. ${doctor.name}` : "MediKiosk AI Intake Engine",
          },
        ],
        title: "ABDM Clinical History & AYUSH Intake Summary",
        section: [
          {
            title: "Chief Complaint & SOCRATES HPI",
            code: {
              coding: [{ system: "http://loinc.org", code: "10154-3", display: "Chief Complaint" }],
            },
            text: {
              status: "generated",
              div: `<div><p><b>Complaint:</b> ${ud.chiefComplaint || "General Consultation"}</p><p><b>SOCRATES:</b> Site: ${socrates.site || "N/A"}, Onset: ${socrates.onset || "N/A"}, Character: ${socrates.character || "N/A"}, Severity: ${socrates.severity || 5}/10</p></div>`,
            },
          },
          ...(ayush?.prakriti
            ? [
                {
                  title: "AYUSH Dashavidha Pariksha",
                  code: {
                    coding: [{ system: "http://ayush.gov.in/fhir", code: "AYUSH-DP-01", display: "Ayurvedic Constitution" }],
                  },
                  text: {
                    status: "generated",
                    div: `<div><p><b>Prakriti:</b> ${ayush.prakriti}</p><p><b>Agni:</b> ${ayush.agni}</p><p><b>Koshtha:</b> ${ayush.koshtha}</p></div>`,
                  },
                },
              ]
            : []),
        ],
      },
    },

    // 2. Patient Resource (with ABHA Identifier)
    {
      fullUrl: `urn:uuid:patient-${patientId}`,
      resource: {
        resourceType: "Patient",
        id: patientId,
        identifier: [
          {
            system: "https://healthid.ndhm.gov.in",
            type: {
              coding: [{ system: "http://terminology.hl7.org/CodeSystem/v2-0203", code: "MR", display: "ABHA Number" }],
            },
            value: abhaAddress,
          },
        ],
        name: [{ text: patient?.name || "Patient" }],
        telecom: [
          ...(patient?.phone ? [{ system: "phone", value: patient.phone }] : []),
          ...(patient?.email ? [{ system: "email", value: patient.email }] : []),
        ],
        gender: "other",
      },
    },

    // 3. QuestionnaireResponse (SOCRATES Elicitation Record)
    {
      fullUrl: `urn:uuid:questionnaire-socrates-${Date.now()}`,
      resource: {
        resourceType: "QuestionnaireResponse",
        id: `qr-${Date.now()}`,
        status: "completed",
        subject: { reference: `urn:uuid:patient-${patientId}` },
        authored: timestamp,
        item: [
          {
            linkId: "1",
            text: "Chief Complaint",
            answer: [{ valueString: ud.chiefComplaint || "General OPD" }],
          },
          {
            linkId: "2",
            text: "SOCRATES Site",
            answer: [{ valueString: socrates.site || "Local" }],
          },
          {
            linkId: "3",
            text: "SOCRATES Severity (1-10)",
            answer: [{ valueInteger: socrates.severity || 5 }],
          },
          {
            linkId: "4",
            text: "Radiation",
            answer: [{ valueString: socrates.radiation || "None" }],
          },
          {
            linkId: "5",
            text: "Associated Symptoms",
            answer: (socrates.associations || []).map((s) => ({ valueString: s })),
          },
        ],
      },
    },

    // 4. Condition (Clinical Chief Finding)
    {
      fullUrl: `urn:uuid:condition-1`,
      resource: {
        resourceType: "Condition",
        id: `cond-1`,
        clinicalStatus: {
          coding: [{ system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" }],
        },
        code: {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "22253000",
              display: ud.chiefComplaint || "Pain symptom",
            },
          ],
          text: ud.chiefComplaint || "Clinical Presenting Symptom",
        },
        subject: { reference: `urn:uuid:patient-${patientId}` },
      },
    },
  ];

  // 5. Observations for Extracted Labs (if any)
  if (ai?.labValues) {
    Object.entries(ai.labValues).forEach(([testName, data], idx) => {
      if (data && (data.value || (typeof data === "object" && data.value))) {
        const val = typeof data === "object" ? data.value : data;
        const unit = typeof data === "object" ? data.unit : "";
        entries.push({
          fullUrl: `urn:uuid:observation-lab-${idx}`,
          resource: {
            resourceType: "Observation",
            id: `obs-${idx}`,
            status: "final",
            code: {
              coding: [{ system: "http://loinc.org", display: testName.toUpperCase() }],
              text: testName,
            },
            subject: { reference: `urn:uuid:patient-${patientId}` },
            valueQuantity: {
              value: parseFloat(val) || val,
              unit: unit || "",
            },
          },
        });
      }
    });
  }

  // Construct standard FHIR R4 Bundle
  const fhirBundle = {
    resourceType: "Bundle",
    id: bundleId,
    meta: {
      lastUpdated: timestamp,
      profile: ["https://nrces.in/ndhm/fhir/r4/StructureDefinition/DocumentBundle"],
    },
    identifier: {
      system: "https://abdm.gov.in/bundle",
      value: bundleId,
    },
    type: "document",
    timestamp: timestamp,
    entry: entries,
  };

  return fhirBundle;
}

export function downloadFhirJson(bundle, filename = "ABDM_FHIR_Clinical_Record.json") {
  const jsonStr = JSON.stringify(bundle, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
