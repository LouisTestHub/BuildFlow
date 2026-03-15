import { PrismaClient } from "@prisma/client"
import bcryptjs from "bcryptjs"

const prisma = new PrismaClient()

function generateWeekEntries(
  timesheetId: string,
  jobId: string,
  monday: Date,
  hours: number[],
  _startOffset = 0,
  extraHours?: number[]
): { timesheetId: string; jobId: string; date: Date; hours: number }[] {
  const entries: { timesheetId: string; jobId: string; date: Date; hours: number }[] = []
  const h = extraHours || hours
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const dayHours = extraHours ? extraHours[i] : hours[i]
    if (dayHours > 0) {
      entries.push({ timesheetId, jobId, date: d, hours: dayHours })
    }
  }
  return entries
}

async function main() {
  console.log("🌱 Seeding BuildFlow database...")

  const passwordHash = await bcryptjs.hash("BuildFlow2026!", 12)

  // Company
  const company = await prisma.company.upsert({
    where: { id: "demo-company-001" },
    update: {},
    create: {
      id: "demo-company-001",
      name: "BuildFlow Demo Ltd",
      registrationNumber: "12345678",
      vatNumber: "GB123456789",
      cisUtr: "1234567890",
      address: "Unit 4, Riverside Business Park, Chelmsford, Essex CM1 1AB",
      subscriptionPlan: "business",
    },
  })

  // Users
  const users = [
    { id: "user-001", name: "James Morrison", email: "admin@buildflow.demo", role: "DIRECTOR" as const, phone: "07700 900001" },
    { id: "user-002", name: "Sarah Chen", email: "sarah@buildflow.demo", role: "ESTIMATOR" as const, phone: "07700 900002" },
    { id: "user-003", name: "Mike O'Brien", email: "mike@buildflow.demo", role: "PROJECT_MANAGER" as const, phone: "07700 900003" },
    { id: "user-004", name: "Dave Wilson", email: "dave@buildflow.demo", role: "SITE_MANAGER" as const, phone: "07700 900004" },
    { id: "user-005", name: "Lisa Patel", email: "lisa@buildflow.demo", role: "OFFICE_ADMIN" as const, phone: "07700 900005" },
    { id: "user-006", name: "Tom Richards", email: "tom@buildflow.demo", role: "SITE_MANAGER" as const, phone: "07700 900006" },
    { id: "user-007", name: "Emma Clarke", email: "emma@buildflow.demo", role: "PROJECT_MANAGER" as const, phone: "07700 900007" },
    { id: "user-008", name: "Ryan Hughes", email: "ryan@buildflow.demo", role: "ESTIMATOR" as const, phone: "07700 900008" },
    // Demo login aliases for one-click access
    { id: "user-101", name: "Demo Project Manager", email: "pm@buildflow.demo", role: "PROJECT_MANAGER" as const, phone: "07700 900101" },
    { id: "user-102", name: "Demo Site Manager", email: "site@buildflow.demo", role: "SITE_MANAGER" as const, phone: "07700 900102" },
    { id: "user-103", name: "Demo Estimator", email: "estimator@buildflow.demo", role: "ESTIMATOR" as const, phone: "07700 900103" },
    { id: "user-104", name: "Demo Subcontractor", email: "sub@buildflow.demo", role: "SUBCONTRACTOR" as const, phone: "07700 900104" },
  ]

  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id,
        companyId: company.id,
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role,
        phone: u.phone,
      },
    })
  }

  // Jobs
  const jobs = [
    { id: "job-001", reference: "BF-2026-001", title: "Victoria Road Rear Extension", clientName: "Mr & Mrs Patterson", clientEmail: "patterson@email.com", clientPhone: "01245 123456", siteAddress: "42 Victoria Road, Chelmsford", sitePostcode: "CM1 3PA", lat: 51.7356, lng: 0.4685, status: "LIVE" as const, sector: "Residential", contractValue: 185000, startDate: new Date("2026-01-15"), endDate: new Date("2026-06-30"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-003" },
    { id: "job-002", reference: "BF-2026-002", title: "Canary Wharf Office Fit-Out", clientName: "Meridian Capital Partners", clientEmail: "facilities@meridian.co.uk", clientPhone: "020 7123 4567", siteAddress: "Level 12, One Canada Square, Canary Wharf", sitePostcode: "E14 5AB", lat: 51.5049, lng: -0.0187, status: "LIVE" as const, sector: "Commercial", contractValue: 2450000, startDate: new Date("2025-11-01"), endDate: new Date("2026-08-31"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-007" },
    { id: "job-003", reference: "BF-2026-003", title: "Chelmsford Academy Science Block Refurb", clientName: "Essex County Council", clientEmail: "estates@essex.gov.uk", clientPhone: "0345 743 0430", siteAddress: "Chelmsford Academy, Lawn Lane", sitePostcode: "CM1 7LT", lat: 51.7293, lng: 0.4543, status: "WON" as const, sector: "Education", contractValue: 890000, startDate: new Date("2026-07-01"), endDate: new Date("2026-12-20"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-003" },
    { id: "job-004", reference: "BF-2026-004", title: "Warehouse Conversion to Apartments", clientName: "Thames Gateway Developments", clientEmail: "info@tgd.co.uk", clientPhone: "01375 856123", siteAddress: "Unit 7, Port Road, Tilbury", sitePostcode: "RM18 7HQ", lat: 51.4621, lng: 0.3578, status: "TENDER" as const, sector: "Residential", contractValue: 420000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
    { id: "job-005", reference: "BF-2026-005", title: "Romford New Build — 6 Detached Houses", clientName: "Havering Land Ltd", clientEmail: "projects@haveringland.co.uk", clientPhone: "01708 765432", siteAddress: "Former Nursery Site, North Street, Romford", sitePostcode: "RM1 1BA", lat: 51.5753, lng: 0.1835, status: "LIVE" as const, sector: "Residential", contractValue: 1200000, startDate: new Date("2025-09-01"), endDate: new Date("2026-09-30"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-007" },
    { id: "job-006", reference: "BF-2026-006", title: "Brentwood High Street Shop Conversion", clientName: "Brentwood Retail Partners", clientEmail: "info@brp.co.uk", clientPhone: "01277 234567", siteAddress: "14-16 High Street, Brentwood", sitePostcode: "CM14 4AB", lat: 51.6214, lng: 0.3051, status: "LIVE" as const, sector: "Commercial", contractValue: 95000, startDate: new Date("2026-02-01"), endDate: new Date("2026-04-30"), retentionPercent: 3, defectsPeriodMonths: 6, pmId: "user-003" },
    { id: "job-007", reference: "BF-2026-007", title: "Southend Seafront Restaurant Fit-Out", clientName: "Coastal Dining Group", clientEmail: "dev@coastaldining.co.uk", clientPhone: "01702 345678", siteAddress: "The Arches, Marine Parade, Southend-on-Sea", sitePostcode: "SS1 2EJ", lat: 51.5360, lng: 0.7122, status: "PRACTICAL_COMPLETION" as const, sector: "Hospitality", contractValue: 310000, startDate: new Date("2025-06-01"), endDate: new Date("2025-12-15"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-007" },
    { id: "job-008", reference: "BF-2026-008", title: "Basildon Industrial Unit Roofing", clientName: "Basildon Properties Ltd", clientEmail: "maint@basildonprop.co.uk", clientPhone: "01268 567890", siteAddress: "Unit 23, Festival Business Park, Basildon", sitePostcode: "SS14 3WN", lat: 51.5761, lng: 0.4887, status: "FINAL_ACCOUNT" as const, sector: "Industrial", contractValue: 67000, startDate: new Date("2025-10-01"), endDate: new Date("2025-11-30"), retentionPercent: 5, defectsPeriodMonths: 6, pmId: "user-003" },
    { id: "job-009", reference: "BF-2026-009", title: "Stratford Mixed-Use Development Ph2", clientName: "Olympic Legacy Developments", clientEmail: "pm@oldplc.co.uk", clientPhone: "020 8234 5678", siteAddress: "Plot B2, Queen Elizabeth Olympic Park", sitePostcode: "E20 2ST", lat: 51.5430, lng: -0.0164, status: "TENDER" as const, sector: "Mixed Use", contractValue: 1850000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
    { id: "job-010", reference: "BF-2026-010", title: "Colchester Period Property Restoration", clientName: "Heritage Homes Trust", clientEmail: "hello@heritagehomes.org", clientPhone: "01206 789012", siteAddress: "The Old Rectory, High Street, Colchester", sitePostcode: "CO1 1PJ", lat: 51.8891, lng: 0.9014, status: "LOST" as const, sector: "Residential", contractValue: 340000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
  ]

  for (const j of jobs) {
    await prisma.job.upsert({
      where: { id: j.id },
      update: {},
      create: {
        id: j.id,
        companyId: company.id,
        reference: j.reference,
        title: j.title,
        clientName: j.clientName,
        clientEmail: j.clientEmail,
        clientPhone: j.clientPhone,
        siteAddress: j.siteAddress,
        sitePostcode: j.sitePostcode,
        lat: j.lat,
        lng: j.lng,
        status: j.status,
        sector: j.sector,
        contractValue: j.contractValue,
        startDate: j.startDate,
        endDate: j.endDate,
        retentionPercent: j.retentionPercent,
        defectsPeriodMonths: j.defectsPeriodMonths,
        pmId: j.pmId,
      },
    })
  }

  // Job Phases
  const phases = [
    // Job 1 - Victoria Road Extension
    { id: "phase-001", jobId: "job-001", name: "Groundworks & Foundations", order: 1, budget: 28000, startDate: new Date("2026-01-15"), endDate: new Date("2026-02-15"), status: "COMPLETE" as const },
    { id: "phase-002", jobId: "job-001", name: "Structural Steel & Brickwork", order: 2, budget: 45000, startDate: new Date("2026-02-16"), endDate: new Date("2026-03-31"), status: "IN_PROGRESS" as const },
    { id: "phase-003", jobId: "job-001", name: "Roofing & Weatherproofing", order: 3, budget: 22000, startDate: new Date("2026-04-01"), endDate: new Date("2026-04-21"), status: "NOT_STARTED" as const },
    { id: "phase-004", jobId: "job-001", name: "First Fix (M&E)", order: 4, budget: 35000, startDate: new Date("2026-04-22"), endDate: new Date("2026-05-15"), status: "NOT_STARTED" as const },
    { id: "phase-005", jobId: "job-001", name: "Second Fix & Finishes", order: 5, budget: 40000, startDate: new Date("2026-05-16"), endDate: new Date("2026-06-20"), status: "NOT_STARTED" as const },
    { id: "phase-006", jobId: "job-001", name: "Snagging & Handover", order: 6, budget: 15000, startDate: new Date("2026-06-21"), endDate: new Date("2026-06-30"), status: "NOT_STARTED" as const },

    // Job 2 - Canary Wharf
    { id: "phase-007", jobId: "job-002", name: "Strip Out & Demolition", order: 1, budget: 180000, startDate: new Date("2025-11-01"), endDate: new Date("2025-12-15"), status: "COMPLETE" as const },
    { id: "phase-008", jobId: "job-002", name: "Structural Alterations", order: 2, budget: 350000, startDate: new Date("2025-12-16"), endDate: new Date("2026-02-28"), status: "COMPLETE" as const },
    { id: "phase-009", jobId: "job-002", name: "M&E Rough-In", order: 3, budget: 520000, startDate: new Date("2026-03-01"), endDate: new Date("2026-04-30"), status: "IN_PROGRESS" as const },
    { id: "phase-010", jobId: "job-002", name: "Partitioning & Ceilings", order: 4, budget: 420000, startDate: new Date("2026-05-01"), endDate: new Date("2026-06-30"), status: "NOT_STARTED" as const },
    { id: "phase-011", jobId: "job-002", name: "Finishes & Joinery", order: 5, budget: 680000, startDate: new Date("2026-07-01"), endDate: new Date("2026-08-15"), status: "NOT_STARTED" as const },
    { id: "phase-012", jobId: "job-002", name: "Commissioning & Handover", order: 6, budget: 300000, startDate: new Date("2026-08-16"), endDate: new Date("2026-08-31"), status: "NOT_STARTED" as const },

    // Job 3 - Chelmsford Academy
    { id: "phase-013", jobId: "job-003", name: "Enabling Works", order: 1, budget: 65000, startDate: new Date("2026-07-01"), endDate: new Date("2026-07-21"), status: "NOT_STARTED" as const },
    { id: "phase-014", jobId: "job-003", name: "Structural Works", order: 2, budget: 210000, startDate: new Date("2026-07-22"), endDate: new Date("2026-09-15"), status: "NOT_STARTED" as const },
    { id: "phase-015", jobId: "job-003", name: "M&E Installation", order: 3, budget: 280000, startDate: new Date("2026-09-16"), endDate: new Date("2026-11-15"), status: "NOT_STARTED" as const },
    { id: "phase-016", jobId: "job-003", name: "Fit-Out & Finishes", order: 4, budget: 245000, startDate: new Date("2026-11-16"), endDate: new Date("2026-12-10"), status: "NOT_STARTED" as const },
    { id: "phase-017", jobId: "job-003", name: "Commissioning", order: 5, budget: 90000, startDate: new Date("2026-12-11"), endDate: new Date("2026-12-20"), status: "NOT_STARTED" as const },

    // Job 5 - Romford New Build
    { id: "phase-018", jobId: "job-005", name: "Site Clearance & Foundations", order: 1, budget: 120000, startDate: new Date("2025-09-01"), endDate: new Date("2025-11-30"), status: "COMPLETE" as const },
    { id: "phase-019", jobId: "job-005", name: "Superstructure (Plots 1-3)", order: 2, budget: 180000, startDate: new Date("2025-12-01"), endDate: new Date("2026-02-28"), status: "COMPLETE" as const },
    { id: "phase-020", jobId: "job-005", name: "Superstructure (Plots 4-6)", order: 3, budget: 180000, startDate: new Date("2026-03-01"), endDate: new Date("2026-05-31"), status: "IN_PROGRESS" as const },
    { id: "phase-021", jobId: "job-005", name: "Roofing All Plots", order: 4, budget: 145000, startDate: new Date("2026-04-01"), endDate: new Date("2026-06-30"), status: "NOT_STARTED" as const },
    { id: "phase-022", jobId: "job-005", name: "Internal Fit-Out", order: 5, budget: 380000, startDate: new Date("2026-05-01"), endDate: new Date("2026-08-31"), status: "NOT_STARTED" as const },
    { id: "phase-023", jobId: "job-005", name: "External Works & Landscaping", order: 6, budget: 195000, startDate: new Date("2026-08-01"), endDate: new Date("2026-09-30"), status: "NOT_STARTED" as const },

    // Job 6 - Brentwood
    { id: "phase-024", jobId: "job-006", name: "Strip Out", order: 1, budget: 12000, startDate: new Date("2026-02-01"), endDate: new Date("2026-02-10"), status: "COMPLETE" as const },
    { id: "phase-025", jobId: "job-006", name: "Structural Opening", order: 2, budget: 18000, startDate: new Date("2026-02-11"), endDate: new Date("2026-02-28"), status: "COMPLETE" as const },
    { id: "phase-026", jobId: "job-006", name: "M&E First Fix", order: 3, budget: 22000, startDate: new Date("2026-03-01"), endDate: new Date("2026-03-15"), status: "IN_PROGRESS" as const },
    { id: "phase-027", jobId: "job-006", name: "Shopfront & Finishes", order: 4, budget: 28000, startDate: new Date("2026-03-16"), endDate: new Date("2026-04-15"), status: "NOT_STARTED" as const },
    { id: "phase-028", jobId: "job-006", name: "Handover", order: 5, budget: 15000, startDate: new Date("2026-04-16"), endDate: new Date("2026-04-30"), status: "NOT_STARTED" as const },

    // Job 7 - Southend
    { id: "phase-029", jobId: "job-007", name: "Strip Out", order: 1, budget: 35000, startDate: new Date("2025-06-01"), endDate: new Date("2025-06-30"), status: "COMPLETE" as const },
    { id: "phase-030", jobId: "job-007", name: "Structural Works", order: 2, budget: 55000, startDate: new Date("2025-07-01"), endDate: new Date("2025-08-15"), status: "COMPLETE" as const },
    { id: "phase-031", jobId: "job-007", name: "M&E Installation", order: 3, budget: 85000, startDate: new Date("2025-08-16"), endDate: new Date("2025-10-15"), status: "COMPLETE" as const },
    { id: "phase-032", jobId: "job-007", name: "Kitchen & Bar Fit-Out", order: 4, budget: 95000, startDate: new Date("2025-10-16"), endDate: new Date("2025-11-30"), status: "COMPLETE" as const },
    { id: "phase-033", jobId: "job-007", name: "Finishes & Snagging", order: 5, budget: 40000, startDate: new Date("2025-12-01"), endDate: new Date("2025-12-15"), status: "COMPLETE" as const },

    // Job 4 - Warehouse Conversion (new phases)
    { id: "phase-038", jobId: "job-004", name: "Site Survey & Enabling Works", order: 1, budget: 35000, startDate: null, endDate: null, status: "NOT_STARTED" as const },
    { id: "phase-039", jobId: "job-004", name: "Structural Conversion Works", order: 2, budget: 120000, startDate: null, endDate: null, status: "NOT_STARTED" as const },
    { id: "phase-040", jobId: "job-004", name: "M&E Installation", order: 3, budget: 95000, startDate: null, endDate: null, status: "NOT_STARTED" as const },
    { id: "phase-041", jobId: "job-004", name: "Internal Fit-Out & Finishes", order: 4, budget: 130000, startDate: null, endDate: null, status: "NOT_STARTED" as const },
    { id: "phase-042", jobId: "job-004", name: "External Works & Handover", order: 5, budget: 40000, startDate: null, endDate: null, status: "NOT_STARTED" as const },

    // Job 8 - Basildon
    { id: "phase-034", jobId: "job-008", name: "Scaffold & Access", order: 1, budget: 8000, startDate: new Date("2025-10-01"), endDate: new Date("2025-10-07"), status: "COMPLETE" as const },
    { id: "phase-035", jobId: "job-008", name: "Strip & Repair", order: 2, budget: 22000, startDate: new Date("2025-10-08"), endDate: new Date("2025-10-31"), status: "COMPLETE" as const },
    { id: "phase-036", jobId: "job-008", name: "New Roof Covering", order: 3, budget: 28000, startDate: new Date("2025-11-01"), endDate: new Date("2025-11-21"), status: "COMPLETE" as const },
    { id: "phase-037", jobId: "job-008", name: "Scaffold Down & Clean", order: 4, budget: 9000, startDate: new Date("2025-11-22"), endDate: new Date("2025-11-30"), status: "COMPLETE" as const },
  ]

  for (const p of phases) {
    await prisma.jobPhase.upsert({
      where: { id: p.id },
      update: {},
      create: p,
    })
  }

  // Daily Logs
  const dailyLogs = [
    { id: "log-001", jobId: "job-001", userId: "user-004", date: new Date("2026-03-10"), weather: "Overcast, dry", labourCount: 8, visitors: "Building control inspector", notes: "Steel delivery arrived. Crane on site for beam installation. BC signed off foundations.", photos: null },
    { id: "log-002", jobId: "job-001", userId: "user-004", date: new Date("2026-03-11"), weather: "Light rain AM, clearing PM", labourCount: 6, visitors: null, notes: "Rain delay in morning. Brickwork continued PM. First floor joists installed.", photos: null },
    { id: "log-003", jobId: "job-001", userId: "user-004", date: new Date("2026-03-12"), weather: "Sunny, mild 12°C", labourCount: 9, visitors: "Client visit (Mrs Patterson)", notes: "Good progress on external walls. Client happy with progress. Discussed kitchen window position change.", photos: null },
    { id: "log-004", jobId: "job-001", userId: "user-004", date: new Date("2026-03-13"), weather: "Cloudy, cold 6°C", labourCount: 7, visitors: null, notes: "Continued brickwork to first floor. Scaffolding adjusted. Material delivery - bricks and blocks.", photos: null },
    { id: "log-005", jobId: "job-001", userId: "user-004", date: new Date("2026-03-14"), weather: "Dry, windy", labourCount: 8, visitors: "Structural engineer", notes: "Engineer approved beam connections. Wind causing issues with scaffolding sheeting. Secured properly.", photos: null },
    { id: "log-006", jobId: "job-002", userId: "user-006", date: new Date("2026-03-10"), weather: "N/A (internal)", labourCount: 22, visitors: "M&E consultant, fire engineer", notes: "HVAC ductwork installation floors 12-14. Fire damper installation progressing. Clash detected with sprinkler main - resolved on site.", photos: null },
    { id: "log-007", jobId: "job-002", userId: "user-006", date: new Date("2026-03-11"), weather: "N/A (internal)", labourCount: 24, visitors: "Client PM", notes: "Electrical containment 90% complete. Data cabling started. Client requested additional power points in boardroom - variation raised.", photos: null },
    { id: "log-008", jobId: "job-002", userId: "user-006", date: new Date("2026-03-12"), weather: "N/A (internal)", labourCount: 20, visitors: null, notes: "Plumbing rough-in for washrooms. Hot works permit issued for welding steel support brackets. All welding completed by 14:00.", photos: null },
    { id: "log-009", jobId: "job-002", userId: "user-006", date: new Date("2026-03-13"), weather: "N/A (internal)", labourCount: 23, visitors: "Landlord rep", notes: "Continued M&E installation. Landlord inspection of common areas - no issues raised. Night shift arranged for noisy works.", photos: null },
    { id: "log-010", jobId: "job-002", userId: "user-006", date: new Date("2026-03-14"), weather: "N/A (internal)", labourCount: 18, visitors: null, notes: "Reduced labour due to other project demands. Focus on completing ductwork floor 14. BMS contractor mobilising next week.", photos: null },
    { id: "log-011", jobId: "job-005", userId: "user-004", date: new Date("2026-03-10"), weather: "Overcast, dry", labourCount: 14, visitors: "NHBC inspector", notes: "Block work to plots 4-5 progressing. NHBC inspection passed on plots 1-2. Drainage connection for plot 3 complete.", photos: null },
    { id: "log-012", jobId: "job-005", userId: "user-004", date: new Date("2026-03-11"), weather: "Heavy rain", labourCount: 6, visitors: null, notes: "Minimal external work due to weather. Internal first fix on plots 1-3 continued. Plasterer started plot 1.", photos: null },
    { id: "log-013", jobId: "job-005", userId: "user-004", date: new Date("2026-03-12"), weather: "Dry, cold", labourCount: 12, visitors: "Warranty inspector", notes: "Roof trusses delivered for plots 4-5. Crane booked for Thursday. Electrician completing first fix plot 2.", photos: null },
    { id: "log-014", jobId: "job-005", userId: "user-004", date: new Date("2026-03-13"), weather: "Dry, mild", labourCount: 15, visitors: null, notes: "Truss installation plots 4-5 complete. Great progress. Felt and batten started immediately. Plumber on plot 3.", photos: null },
    { id: "log-015", jobId: "job-005", userId: "user-004", date: new Date("2026-03-14"), weather: "Sunny", labourCount: 16, visitors: "Client (Havering Land director)", notes: "Client impressed with progress. Tile delivery confirmed for Monday. Plot 1 plaster complete - 2 weeks drying time.", photos: null },
    { id: "log-016", jobId: "job-006", userId: "user-004", date: new Date("2026-03-10"), weather: "Dry", labourCount: 4, visitors: null, notes: "First fix electrics started. Plumber routing waste pipes for new WC. Steelwork for new opening fully installed and signed off.", photos: null },
    { id: "log-017", jobId: "job-006", userId: "user-004", date: new Date("2026-03-11"), weather: "Dry", labourCount: 5, visitors: "Building control", notes: "BC inspection of structural steel - approved. Continued first fix. New shopfront frame measurements confirmed with manufacturer.", photos: null },
    { id: "log-018", jobId: "job-006", userId: "user-004", date: new Date("2026-03-12"), weather: "Rain", labourCount: 4, visitors: null, notes: "Internal work only. Electrical first fix complete. Plaster boarding started.", photos: null },
    { id: "log-019", jobId: "job-006", userId: "user-004", date: new Date("2026-03-13"), weather: "Dry", labourCount: 5, visitors: null, notes: "Plaster boarding complete. Skim coat tomorrow. Shopfront lead time confirmed as 3 weeks.", photos: null },
    { id: "log-020", jobId: "job-006", userId: "user-004", date: new Date("2026-03-14"), weather: "Dry, mild", labourCount: 3, visitors: null, notes: "Plastering in progress. Looking good. Decorator booked for w/c 24th March.", photos: null },
    // Additional logs for variety
    { id: "log-021", jobId: "job-001", userId: "user-004", date: new Date("2026-03-07"), weather: "Frost AM, sunny PM", labourCount: 7, visitors: null, notes: "Delayed start due to frost. Brickwork from 10am. Lintels installed over ground floor openings.", photos: null },
    { id: "log-022", jobId: "job-002", userId: "user-006", date: new Date("2026-03-07"), weather: "N/A (internal)", labourCount: 21, visitors: "Fire officer", notes: "Fire stopping installation. Fire officer pre-inspection - minor comments on compartment line. Addressed same day.", photos: null },
    { id: "log-023", jobId: "job-005", userId: "user-004", date: new Date("2026-03-07"), weather: "Cold, dry", labourCount: 13, visitors: null, notes: "Foundation pour for plot 6. Concrete delivery on time. Vibrated and levelled by 15:00. Good finish.", photos: null },
    { id: "log-024", jobId: "job-001", userId: "user-004", date: new Date("2026-03-06"), weather: "Overcast", labourCount: 8, visitors: "Architect", notes: "Architect site visit. Reviewed window positions against drawings. All correct. DPC course complete.", photos: null },
    { id: "log-025", jobId: "job-002", userId: "user-006", date: new Date("2026-03-06"), weather: "N/A (internal)", labourCount: 19, visitors: null, notes: "Sprinkler main installation. Coordinating with ceiling grid contractor on access. Good progress.", photos: null },
    { id: "log-026", jobId: "job-005", userId: "user-004", date: new Date("2026-03-06"), weather: "Light rain", labourCount: 11, visitors: null, notes: "Drainage runs for plots 4-6. Laser levels set. Inspection chamber installed. Slow progress due to wet ground.", photos: null },
    { id: "log-027", jobId: "job-006", userId: "user-004", date: new Date("2026-03-06"), weather: "Dry", labourCount: 6, visitors: "Landlord", notes: "Strip out complete. All waste removed. Landlord approved condition. Ready for structural works.", photos: null },
    // CW2 additional logs — 15 more realistic entries
    { id: "log-028", jobId: "job-001", userId: "user-004", date: new Date("2026-03-05"), weather: "Dry, cold 4°C", labourCount: 9, visitors: null, notes: "[WORK] Plastering commenced on ground floor internal walls. Scratch coat applied to kitchen and utility room. Bricklayers continued external leaf to first floor.\n[ISSUES] Slight delay waiting for sand delivery — arrived at 11am instead of 8am.\n[H&S] Scaffold check completed. All boards and toe boards secure.", photos: null },
    { id: "log-029", jobId: "job-001", userId: "user-004", date: new Date("2026-03-04"), weather: "Heavy rain", labourCount: 4, visitors: null, notes: "[WORK] Internal work only due to persistent rain. Electrician ran cables for downstairs lighting circuits. Plumber marked out bathroom waste positions.\n[ISSUES] No external work possible — ground waterlogged. Lost half day on brickwork.\n[H&S] Temporary covers placed over open blockwork to prevent water ingress.", photos: null },
    { id: "log-030", jobId: "job-002", userId: "user-006", date: new Date("2026-03-05"), weather: "N/A (internal)", labourCount: 25, visitors: "M&E design team", notes: "[WORK] Electrical first fix 95% complete on floor 12. Cable tray installation continuing on floor 13. BMS panel delivered and positioned in riser.\n[ISSUES] Minor clash between cable tray and ductwork run on floor 13 — rerouted cable tray.\n[H&S] Hot works permit issued for brazing copper pipework. Fire watch in place.", photos: null },
    { id: "log-031", jobId: "job-002", userId: "user-006", date: new Date("2026-03-04"), weather: "N/A (internal)", labourCount: 22, visitors: null, notes: "[WORK] Concrete pour for raised access floor plinths on floor 14. Vibrated and levelled. Plumbing rough-in for executive washroom.\n[ISSUES] Concrete pump had 45-minute breakdown — repaired on site.\n[H&S] Concrete splash guards in place. All operatives wearing goggles during pour.", photos: null },
    { id: "log-032", jobId: "job-002", userId: "user-006", date: new Date("2026-03-03"), weather: "N/A (internal)", labourCount: 20, visitors: "Client directors (3)", notes: "[WORK] Completed ductwork installation floor 12. Started ceiling grid layout for floor 12. Painting contractor mobilised for back-of-house areas.\n[ISSUES] Client requested change to reception desk position — TI issued.\n[H&S] Weekly H&S walkthrough completed. One minor issue with trailing leads — rectified.", photos: null },
    { id: "log-033", jobId: "job-005", userId: "user-004", date: new Date("2026-03-05"), weather: "Overcast, dry", labourCount: 14, visitors: "NHBC inspector", notes: "[WORK] Bricklaying to plot 5 external walls — up to first floor. Plot 1 second fix electrical started. Kitchen units delivered for plot 1.\n[ISSUES] NHBC flagged minor cavity tray detail on plot 3 — remedied same day.\n[H&S] New starter induction completed for apprentice bricklayer.", photos: null },
    { id: "log-034", jobId: "job-005", userId: "user-004", date: new Date("2026-03-04"), weather: "Sunny, mild", labourCount: 16, visitors: null, notes: "[WORK] Roof tile installation on plots 1 and 2. Lead flashing to valleys. Plumber completed first fix on plot 3. Plasterer skimming plot 2.\n[ISSUES] None — excellent progress today.\n[H&S] Harness checks completed for roofers. All in date.", photos: null },
    { id: "log-035", jobId: "job-005", userId: "user-004", date: new Date("2026-03-03"), weather: "Cloudy, cold", labourCount: 12, visitors: null, notes: "[WORK] Scaffolding erected for plot 6. Block and beam floor installed on plot 5. Groundworker completing drainage for plot 6.\n[ISSUES] Scaffold delivery 2 hours late — adjusted programme.\n[H&S] Scaffold handover inspection completed and tagged.", photos: null },
    { id: "log-036", jobId: "job-006", userId: "user-004", date: new Date("2026-03-05"), weather: "Rain AM, dry PM", labourCount: 5, visitors: null, notes: "[WORK] Plaster skim coat applied to all new partition walls. Looking excellent finish. Electrician trimming back cables ready for second fix.\n[ISSUES] Slight damp patch on rear wall from rain — will monitor.\n[H&S] COSHH assessment updated for plastering materials.", photos: null },
    { id: "log-037", jobId: "job-006", userId: "user-004", date: new Date("2026-03-04"), weather: "Dry", labourCount: 4, visitors: "Client (shop tenant)", notes: "[WORK] Plasterboard to ceiling complete. Bulkhead constructed for extract duct. New consumer unit wired and tested.\n[ISSUES] Client wants to add extra socket behind counter — variation agreed.\n[H&S] All clear.", photos: null },
    { id: "log-038", jobId: "job-001", userId: "user-004", date: new Date("2026-03-03"), weather: "Sunny, 10°C", labourCount: 10, visitors: "Client visit (Mr Patterson)", notes: "[WORK] Steel beams positioned and bolted. Brickwork tied in around steels. Good progress on external walls — approaching eaves height.\n[ISSUES] None. Client happy with quality of brickwork.\n[H&S] Crane banksman in place for all lifts. Exclusion zone maintained.", photos: null },
    { id: "log-039", jobId: "job-002", userId: "user-006", date: new Date("2026-02-28"), weather: "N/A (internal)", labourCount: 18, visitors: null, notes: "[WORK] Completed structural alterations on floor 14. New steelwork for open-plan area welded and painted. MEP risers cored through all floors.\n[ISSUES] Core drilling hit rebar — diamond drilling contractor brought in.\n[H&S] Dust extraction running during all coring operations. RPE worn by all operatives.", photos: null },
    { id: "log-040", jobId: "job-005", userId: "user-004", date: new Date("2026-02-28"), weather: "Frost, then sunny", labourCount: 10, visitors: null, notes: "[WORK] Blockwork to plot 4 ground floor walls. DPC installed. Cavity insulation boards going in as walls progress. Carpenter fitting first floor joists plot 3.\n[ISSUES] Frost delayed start by 1 hour. Mortar mixed with frost proofer after 10am.\n[H&S] Ground conditions icy — grit spread on all walkways.", photos: null },
    { id: "log-041", jobId: "job-006", userId: "user-004", date: new Date("2026-03-03"), weather: "Dry, windy", labourCount: 4, visitors: null, notes: "[WORK] Studwork partition walls complete. Plasterboard fixing 80% done. Fire stopping around service penetrations.\n[ISSUES] Wind causing issues with rear temporary hoarding — re-secured.\n[H&S] Hoarding checked and additional bracing added.", photos: null },
    { id: "log-042", jobId: "job-001", userId: "user-004", date: new Date("2026-02-28"), weather: "Cloudy, dry", labourCount: 8, visitors: "Structural engineer", notes: "[WORK] Concrete lintels installed over all ground floor openings. Cavity trays fitted above lintels. Brickwork to first floor level on rear elevation.\n[ISSUES] One lintel delivered wrong size — replacement ordered for next day.\n[H&S] Manual handling assessment reviewed for lintel installation. Two-man lifts enforced.", photos: null },
  ]

  for (const l of dailyLogs) {
    await prisma.dailyLog.upsert({
      where: { id: l.id },
      update: {},
      create: l,
    })
  }

  // Estimates
  const estimates = [
    { id: "est-001", companyId: company.id, jobId: "job-001", reference: "EST-2025-042", title: "Victoria Road Rear Extension", clientName: "Mr & Mrs Patterson", status: "ACCEPTED" as const, revision: 2, totalCost: 148000, marginPercent: 25, sellPrice: 185000 },
    { id: "est-002", companyId: company.id, jobId: "job-004", reference: "EST-2026-003", title: "Warehouse Conversion - Tilbury", clientName: "Thames Gateway Developments", status: "SUBMITTED" as const, revision: 1, totalCost: 336000, marginPercent: 25, sellPrice: 420000 },
    { id: "est-003", companyId: company.id, jobId: null, reference: "EST-2026-004", title: "Harlow Community Centre Extension", clientName: "Harlow District Council", status: "DRAFT" as const, revision: 1, totalCost: 520000, marginPercent: 20, sellPrice: 624000 },
    { id: "est-004", companyId: company.id, jobId: "job-003", reference: "EST-2025-038", title: "Chelmsford Academy Science Block", clientName: "Essex County Council", status: "ACCEPTED" as const, revision: 3, totalCost: 712000, marginPercent: 25, sellPrice: 890000 },
    { id: "est-005", companyId: company.id, jobId: null, reference: "EST-2026-005", title: "Witham Office Refurbishment", clientName: "Witham Business Centre Ltd", status: "DECLINED" as const, revision: 1, totalCost: 84000, marginPercent: 20, sellPrice: 100800 },
    { id: "est-006", companyId: company.id, jobId: "job-009", reference: "EST-2026-006", title: "Stratford Mixed-Use Ph2", clientName: "Olympic Legacy Developments", status: "REVISED" as const, revision: 2, totalCost: 1480000, marginPercent: 25, sellPrice: 1850000 },
  ]

  for (const e of estimates) {
    await prisma.estimate.upsert({
      where: { id: e.id },
      update: {},
      create: e,
    })
  }

  // Estimate sections and items for est-001
  const section1 = await prisma.estimateSection.upsert({
    where: { id: "esec-001" },
    update: {},
    create: { id: "esec-001", estimateId: "est-001", name: "Groundworks", order: 1 },
  })
  const section2 = await prisma.estimateSection.upsert({
    where: { id: "esec-002" },
    update: {},
    create: { id: "esec-002", estimateId: "est-001", name: "Superstructure", order: 2 },
  })
  const section3 = await prisma.estimateSection.upsert({
    where: { id: "esec-003" },
    update: {},
    create: { id: "esec-003", estimateId: "est-001", name: "Roofing", order: 3 },
  })

  const items = [
    { id: "eitem-001", sectionId: section1.id, description: "Excavation to reduced levels", unit: "m³", quantity: 45, materialCost: 0, labourCost: 35, plantCost: 25, subcontractCost: 0, markupPercent: 15 },
    { id: "eitem-002", sectionId: section1.id, description: "Concrete foundations (C30)", unit: "m³", quantity: 12, materialCost: 95, labourCost: 45, plantCost: 15, subcontractCost: 0, markupPercent: 15 },
    { id: "eitem-003", sectionId: section1.id, description: "Drainage runs (110mm)", unit: "m", quantity: 35, materialCost: 18, labourCost: 22, plantCost: 5, subcontractCost: 0, markupPercent: 15 },
    { id: "eitem-004", sectionId: section1.id, description: "Block & beam floor", unit: "m²", quantity: 48, materialCost: 55, labourCost: 30, plantCost: 8, subcontractCost: 0, markupPercent: 15 },
    { id: "eitem-005", sectionId: section2.id, description: "Blockwork walls (100mm dense)", unit: "m²", quantity: 120, materialCost: 22, labourCost: 28, plantCost: 0, subcontractCost: 0, markupPercent: 15 },
    { id: "eitem-006", sectionId: section2.id, description: "Facing brickwork (external)", unit: "m²", quantity: 85, materialCost: 45, labourCost: 38, plantCost: 0, subcontractCost: 0, markupPercent: 15 },
    { id: "eitem-007", sectionId: section2.id, description: "Steel beam (UB 254x102x28)", unit: "nr", quantity: 3, materialCost: 420, labourCost: 280, plantCost: 350, subcontractCost: 0, markupPercent: 15 },
    { id: "eitem-008", sectionId: section2.id, description: "First floor joists (C24 timber)", unit: "m", quantity: 65, materialCost: 12, labourCost: 8, plantCost: 0, subcontractCost: 0, markupPercent: 15 },
    { id: "eitem-009", sectionId: section3.id, description: "Roof trusses (supply & fix)", unit: "nr", quantity: 12, materialCost: 180, labourCost: 0, plantCost: 0, subcontractCost: 250, markupPercent: 15 },
    { id: "eitem-010", sectionId: section3.id, description: "Concrete roof tiles", unit: "m²", quantity: 65, materialCost: 28, labourCost: 0, plantCost: 0, subcontractCost: 22, markupPercent: 15 },
    { id: "eitem-011", sectionId: section3.id, description: "Lead flashing", unit: "m", quantity: 18, materialCost: 45, labourCost: 0, plantCost: 0, subcontractCost: 35, markupPercent: 15 },
  ]

  for (const item of items) {
    await prisma.estimateItem.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    })
  }

  // ========================================
  // CW3: Additional Estimates with full sections and items
  // ========================================

  // Estimate 7: Loft Conversion — 8 Birch Close (DRAFT, ~£38,000 sell price)
  const est7 = await prisma.estimate.upsert({
    where: { id: "est-007" },
    update: {},
    create: {
      id: "est-007", companyId: company.id, reference: "EST-2026-007",
      title: "Loft Conversion — 8 Birch Close", clientName: "Mr & Mrs Turner",
      status: "DRAFT", revision: 1, totalCost: 28500, marginPercent: 18, sellPrice: 34756,
    },
  })

  const est7Sections = [
    { id: "esec-007-1", name: "Demolition & Enabling", order: 1, items: [
      { id: "ei-07-01", desc: "Strip existing roof covering", unit: "m²", qty: 55, mat: 0, lab: 15, plant: 0, sub: 12 },
      { id: "ei-07-02", desc: "Remove ceiling joists", unit: "m", qty: 24, mat: 0, lab: 18, plant: 0, sub: 0 },
      { id: "ei-07-03", desc: "Skip hire & waste removal", unit: "nr", qty: 3, mat: 0, lab: 0, plant: 0, sub: 285 },
    ]},
    { id: "esec-007-2", name: "Structural", order: 2, items: [
      { id: "ei-07-04", desc: "Steel ridge beam (UB 203x133x25)", unit: "nr", qty: 1, mat: 680, lab: 450, plant: 320, sub: 0 },
      { id: "ei-07-05", desc: "New rafters (C24 timber 47x200mm)", unit: "m", qty: 48, mat: 8, lab: 12, plant: 0, sub: 0 },
      { id: "ei-07-06", desc: "Floor joists (C24 47x225mm)", unit: "m", qty: 36, mat: 10, lab: 14, plant: 0, sub: 0 },
      { id: "ei-07-07", desc: "Structural steelwork connections", unit: "nr", qty: 4, mat: 85, lab: 120, plant: 0, sub: 0 },
    ]},
    { id: "esec-007-3", name: "Roofing", order: 3, items: [
      { id: "ei-07-08", desc: "Concrete interlocking roof tiles", unit: "m²", qty: 58, mat: 32, lab: 0, plant: 0, sub: 18 },
      { id: "ei-07-09", desc: "Breathable membrane & battens", unit: "m²", qty: 58, mat: 8, lab: 6, plant: 0, sub: 0 },
      { id: "ei-07-10", desc: "Lead flashing to abutments", unit: "m", qty: 12, mat: 48, lab: 0, plant: 0, sub: 35 },
      { id: "ei-07-11", desc: "Velux roof windows (CK04)", unit: "nr", qty: 3, mat: 420, lab: 0, plant: 0, sub: 180 },
    ]},
    { id: "esec-007-4", name: "M&E First Fix", order: 4, items: [
      { id: "ei-07-12", desc: "Electrical first fix (lighting, sockets)", unit: "lot", qty: 1, mat: 450, lab: 680, plant: 0, sub: 0 },
      { id: "ei-07-13", desc: "Plumbing first fix (radiator feeds)", unit: "nr", qty: 4, mat: 85, lab: 120, plant: 0, sub: 0 },
      { id: "ei-07-14", desc: "En-suite plumbing rough-in", unit: "lot", qty: 1, mat: 320, lab: 480, plant: 0, sub: 0 },
    ]},
    { id: "esec-007-5", name: "Finishes", order: 5, items: [
      { id: "ei-07-15", desc: "Insulation (100mm Kingspan between rafters)", unit: "m²", qty: 58, mat: 22, lab: 8, plant: 0, sub: 0 },
      { id: "ei-07-16", desc: "Plasterboard & skim (walls & ceiling)", unit: "m²", qty: 95, mat: 8, lab: 14, plant: 0, sub: 0 },
      { id: "ei-07-17", desc: "Staircase (bespoke softwood)", unit: "nr", qty: 1, mat: 1200, lab: 0, plant: 0, sub: 850 },
      { id: "ei-07-18", desc: "Oak engineered flooring", unit: "m²", qty: 28, mat: 45, lab: 12, plant: 0, sub: 0 },
      { id: "ei-07-19", desc: "Decoration (mist coat + 2 coats emulsion)", unit: "m²", qty: 95, mat: 3, lab: 8, plant: 0, sub: 0 },
      { id: "ei-07-20", desc: "En-suite fit-out (sanitaryware + tiles)", unit: "lot", qty: 1, mat: 1800, lab: 0, plant: 0, sub: 1200 },
    ]},
  ]

  for (const sec of est7Sections) {
    await prisma.estimateSection.upsert({
      where: { id: sec.id }, update: {},
      create: { id: sec.id, estimateId: est7.id, name: sec.name, order: sec.order },
    })
    for (const item of sec.items) {
      await prisma.estimateItem.upsert({
        where: { id: item.id }, update: {},
        create: {
          id: item.id, sectionId: sec.id, description: item.desc,
          unit: item.unit, quantity: item.qty, materialCost: item.mat,
          labourCost: item.lab, plantCost: item.plant, subcontractCost: item.sub,
        },
      })
    }
  }

  // Estimate 8: Restaurant Fit-Out — High Street (SUBMITTED, ~£95,000 sell price)
  const est8 = await prisma.estimate.upsert({
    where: { id: "est-008" },
    update: {},
    create: {
      id: "est-008", companyId: company.id, reference: "EST-2026-008",
      title: "Restaurant Fit-Out — High Street", clientName: "Artisan Dining Co",
      status: "SUBMITTED", revision: 1, totalCost: 72000, marginPercent: 22, sellPrice: 92308,
    },
  })

  const est8Sections = [
    { id: "esec-008-1", name: "Demolition & Strip Out", order: 1, items: [
      { id: "ei-08-01", desc: "Soft strip of existing fit-out", unit: "m²", qty: 180, mat: 0, lab: 12, plant: 0, sub: 0 },
      { id: "ei-08-02", desc: "Removal of redundant M&E services", unit: "lot", qty: 1, mat: 0, lab: 0, plant: 0, sub: 2800 },
      { id: "ei-08-03", desc: "Waste disposal & skip hire", unit: "nr", qty: 6, mat: 0, lab: 0, plant: 0, sub: 340 },
    ]},
    { id: "esec-008-2", name: "Structural Alterations", order: 2, items: [
      { id: "ei-08-04", desc: "New opening in load-bearing wall (RSJ)", unit: "nr", qty: 2, mat: 550, lab: 420, plant: 280, sub: 0 },
      { id: "ei-08-05", desc: "Stud partition walls", unit: "m²", qty: 45, mat: 18, lab: 22, plant: 0, sub: 0 },
      { id: "ei-08-06", desc: "Mezzanine structure (steel)", unit: "m²", qty: 35, mat: 0, lab: 0, plant: 0, sub: 185 },
    ]},
    { id: "esec-008-3", name: "Mechanical Services", order: 3, items: [
      { id: "ei-08-07", desc: "Kitchen extract system", unit: "lot", qty: 1, mat: 0, lab: 0, plant: 0, sub: 8500 },
      { id: "ei-08-08", desc: "Fresh air supply system", unit: "lot", qty: 1, mat: 0, lab: 0, plant: 0, sub: 4200 },
      { id: "ei-08-09", desc: "Gas installation (commercial)", unit: "lot", qty: 1, mat: 0, lab: 0, plant: 0, sub: 3800 },
      { id: "ei-08-10", desc: "Plumbing & drainage", unit: "lot", qty: 1, mat: 1200, lab: 1800, plant: 0, sub: 0 },
    ]},
    { id: "esec-008-4", name: "Electrical Services", order: 4, items: [
      { id: "ei-08-11", desc: "3-phase electrical supply upgrade", unit: "lot", qty: 1, mat: 0, lab: 0, plant: 0, sub: 4500 },
      { id: "ei-08-12", desc: "Lighting installation (mood + task)", unit: "nr", qty: 45, mat: 85, lab: 35, plant: 0, sub: 0 },
      { id: "ei-08-13", desc: "Fire alarm system", unit: "lot", qty: 1, mat: 0, lab: 0, plant: 0, sub: 2200 },
      { id: "ei-08-14", desc: "Data & CCTV cabling", unit: "lot", qty: 1, mat: 450, lab: 680, plant: 0, sub: 0 },
    ]},
    { id: "esec-008-5", name: "Kitchen Build", order: 5, items: [
      { id: "ei-08-15", desc: "Stainless steel wall cladding", unit: "m²", qty: 32, mat: 65, lab: 0, plant: 0, sub: 25 },
      { id: "ei-08-16", desc: "Non-slip vinyl flooring", unit: "m²", qty: 45, mat: 38, lab: 0, plant: 0, sub: 15 },
      { id: "ei-08-17", desc: "Grease trap installation", unit: "nr", qty: 1, mat: 850, lab: 0, plant: 0, sub: 420 },
    ]},
    { id: "esec-008-6", name: "Front of House Finishes", order: 6, items: [
      { id: "ei-08-18", desc: "Hardwood timber flooring", unit: "m²", qty: 120, mat: 55, lab: 0, plant: 0, sub: 18 },
      { id: "ei-08-19", desc: "Feature bar construction", unit: "lot", qty: 1, mat: 2200, lab: 1800, plant: 0, sub: 0 },
      { id: "ei-08-20", desc: "Banquette seating (bespoke joinery)", unit: "m", qty: 14, mat: 0, lab: 0, plant: 0, sub: 280 },
      { id: "ei-08-21", desc: "Decorative plasterwork & paint", unit: "m²", qty: 240, mat: 5, lab: 12, plant: 0, sub: 0 },
      { id: "ei-08-22", desc: "WC fit-out (2nr cubicles + accessible)", unit: "lot", qty: 1, mat: 2400, lab: 0, plant: 0, sub: 1600 },
    ]},
    { id: "esec-008-7", name: "Shopfront & External", order: 7, items: [
      { id: "ei-08-23", desc: "Aluminium shopfront glazing", unit: "lot", qty: 1, mat: 0, lab: 0, plant: 0, sub: 6800 },
      { id: "ei-08-24", desc: "External signage", unit: "nr", qty: 2, mat: 0, lab: 0, plant: 0, sub: 1200 },
      { id: "ei-08-25", desc: "External terrace decking", unit: "m²", qty: 18, mat: 65, lab: 0, plant: 0, sub: 35 },
    ]},
  ]

  for (const sec of est8Sections) {
    await prisma.estimateSection.upsert({
      where: { id: sec.id }, update: {},
      create: { id: sec.id, estimateId: est8.id, name: sec.name, order: sec.order },
    })
    for (const item of sec.items) {
      await prisma.estimateItem.upsert({
        where: { id: item.id }, update: {},
        create: {
          id: item.id, sectionId: sec.id, description: item.desc,
          unit: item.unit, quantity: item.qty, materialCost: item.mat,
          labourCost: item.lab, plantCost: item.plant, subcontractCost: item.sub,
        },
      })
    }
  }

  // Estimate 9: School Science Lab Refurb (ACCEPTED, ~£62,000 sell price)
  const est9 = await prisma.estimate.upsert({
    where: { id: "est-009" },
    update: {},
    create: {
      id: "est-009", companyId: company.id, reference: "EST-2026-009",
      title: "School Science Lab Refurb", clientName: "Chelmsford Grammar School",
      status: "ACCEPTED", revision: 2, totalCost: 48500, marginPercent: 20, sellPrice: 60625,
    },
  })

  const est9Sections = [
    { id: "esec-009-1", name: "Demolition & Strip Out", order: 1, items: [
      { id: "ei-09-01", desc: "Remove existing lab benches & fume cupboards", unit: "nr", qty: 12, mat: 0, lab: 65, plant: 0, sub: 0 },
      { id: "ei-09-02", desc: "Strip vinyl flooring", unit: "m²", qty: 85, mat: 0, lab: 4, plant: 0, sub: 0 },
      { id: "ei-09-03", desc: "Remove suspended ceiling grid", unit: "m²", qty: 85, mat: 0, lab: 5, plant: 0, sub: 0 },
      { id: "ei-09-04", desc: "Disposal of hazardous materials (asbestos survey)", unit: "lot", qty: 1, mat: 0, lab: 0, plant: 0, sub: 2800 },
    ]},
    { id: "esec-009-2", name: "M&E Services", order: 2, items: [
      { id: "ei-09-05", desc: "New gas supply with isolation valves to benches", unit: "nr", qty: 8, mat: 180, lab: 0, plant: 0, sub: 120 },
      { id: "ei-09-06", desc: "Cold water supply to lab taps", unit: "nr", qty: 8, mat: 45, lab: 65, plant: 0, sub: 0 },
      { id: "ei-09-07", desc: "Fume cupboard extract ducting", unit: "nr", qty: 2, mat: 0, lab: 0, plant: 0, sub: 3200 },
      { id: "ei-09-08", desc: "LED panel lighting (600x600)", unit: "nr", qty: 24, mat: 65, lab: 35, plant: 0, sub: 0 },
      { id: "ei-09-09", desc: "Emergency eyewash stations", unit: "nr", qty: 2, mat: 320, lab: 85, plant: 0, sub: 0 },
      { id: "ei-09-10", desc: "Data points & interactive whiteboard install", unit: "lot", qty: 1, mat: 450, lab: 320, plant: 0, sub: 0 },
    ]},
    { id: "esec-009-3", name: "Lab Fit-Out", order: 3, items: [
      { id: "ei-09-11", desc: "Trespa-topped lab benches (island)", unit: "nr", qty: 4, mat: 0, lab: 0, plant: 0, sub: 2800 },
      { id: "ei-09-12", desc: "Trespa-topped perimeter benches", unit: "m", qty: 12, mat: 0, lab: 0, plant: 0, sub: 380 },
      { id: "ei-09-13", desc: "Fume cupboards (Ductaire)", unit: "nr", qty: 2, mat: 0, lab: 0, plant: 0, sub: 4500 },
      { id: "ei-09-14", desc: "Chemical storage cabinets", unit: "nr", qty: 3, mat: 580, lab: 0, plant: 0, sub: 0 },
      { id: "ei-09-15", desc: "Teacher's demonstration bench", unit: "nr", qty: 1, mat: 0, lab: 0, plant: 0, sub: 3200 },
    ]},
    { id: "esec-009-4", name: "Finishes", order: 4, items: [
      { id: "ei-09-16", desc: "Safety vinyl flooring (Polysafe)", unit: "m²", qty: 85, mat: 32, lab: 0, plant: 0, sub: 12 },
      { id: "ei-09-17", desc: "Suspended ceiling (mineral fibre tiles)", unit: "m²", qty: 85, mat: 14, lab: 0, plant: 0, sub: 8 },
      { id: "ei-09-18", desc: "Hygienic wall cladding (splashbacks)", unit: "m²", qty: 22, mat: 45, lab: 0, plant: 0, sub: 18 },
      { id: "ei-09-19", desc: "Decoration to walls & doors", unit: "m²", qty: 120, mat: 3, lab: 8, plant: 0, sub: 0 },
      { id: "ei-09-20", desc: "Fire door replacement (FD30)", unit: "nr", qty: 2, mat: 280, lab: 120, plant: 0, sub: 0 },
    ]},
  ]

  for (const sec of est9Sections) {
    await prisma.estimateSection.upsert({
      where: { id: sec.id }, update: {},
      create: { id: sec.id, estimateId: est9.id, name: sec.name, order: sec.order },
    })
    for (const item of sec.items) {
      await prisma.estimateItem.upsert({
        where: { id: item.id }, update: {},
        create: {
          id: item.id, sectionId: sec.id, description: item.desc,
          unit: item.unit, quantity: item.qty, materialCost: item.mat,
          labourCost: item.lab, plantCost: item.plant, subcontractCost: item.sub,
        },
      })
    }
  }

  // Estimate 10: Industrial Unit Mezzanine (DECLINED, ~£28,000 sell price)
  const est10 = await prisma.estimate.upsert({
    where: { id: "est-010" },
    update: {},
    create: {
      id: "est-010", companyId: company.id, reference: "EST-2026-010",
      title: "Industrial Unit Mezzanine", clientName: "Apex Warehousing Ltd",
      status: "DECLINED", revision: 1, totalCost: 21200, marginPercent: 18, sellPrice: 25854,
    },
  })

  const est10Sections = [
    { id: "esec-010-1", name: "Structural Steelwork", order: 1, items: [
      { id: "ei-10-01", desc: "Primary steel columns (UC 203x203x60)", unit: "nr", qty: 6, mat: 420, lab: 0, plant: 0, sub: 280 },
      { id: "ei-10-02", desc: "Primary beams (UB 305x165x40)", unit: "m", qty: 28, mat: 65, lab: 0, plant: 0, sub: 35 },
      { id: "ei-10-03", desc: "Secondary beams (UB 203x133x25)", unit: "m", qty: 42, mat: 45, lab: 0, plant: 0, sub: 28 },
      { id: "ei-10-04", desc: "Steelwork connections & bolts", unit: "lot", qty: 1, mat: 850, lab: 0, plant: 0, sub: 420 },
      { id: "ei-10-05", desc: "Crane hire for steel erection", unit: "days", qty: 2, mat: 0, lab: 0, plant: 850, sub: 0 },
    ]},
    { id: "esec-010-2", name: "Mezzanine Floor", order: 2, items: [
      { id: "ei-10-06", desc: "Composite metal decking", unit: "m²", qty: 120, mat: 42, lab: 0, plant: 0, sub: 18 },
      { id: "ei-10-07", desc: "Edge protection (steel handrail + mesh)", unit: "m", qty: 44, mat: 55, lab: 0, plant: 0, sub: 25 },
      { id: "ei-10-08", desc: "Industrial staircase (galvanised)", unit: "nr", qty: 1, mat: 0, lab: 0, plant: 0, sub: 3200 },
      { id: "ei-10-09", desc: "Pallet gate", unit: "nr", qty: 1, mat: 0, lab: 0, plant: 0, sub: 1850 },
    ]},
    { id: "esec-010-3", name: "Fire Protection & Finishes", order: 3, items: [
      { id: "ei-10-10", desc: "Intumescent paint to steelwork (60 min)", unit: "m²", qty: 180, mat: 8, lab: 0, plant: 0, sub: 12 },
      { id: "ei-10-11", desc: "Fire alarm points (mezzanine)", unit: "nr", qty: 4, mat: 85, lab: 45, plant: 0, sub: 0 },
      { id: "ei-10-12", desc: "Emergency lighting", unit: "nr", qty: 6, mat: 65, lab: 35, plant: 0, sub: 0 },
      { id: "ei-10-13", desc: "Power & lighting to mezzanine", unit: "lot", qty: 1, mat: 650, lab: 0, plant: 0, sub: 1200 },
    ]},
  ]

  for (const sec of est10Sections) {
    await prisma.estimateSection.upsert({
      where: { id: sec.id }, update: {},
      create: { id: sec.id, estimateId: est10.id, name: sec.name, order: sec.order },
    })
    for (const item of sec.items) {
      await prisma.estimateItem.upsert({
        where: { id: item.id }, update: {},
        create: {
          id: item.id, sectionId: sec.id, description: item.desc,
          unit: item.unit, quantity: item.qty, materialCost: item.mat,
          labourCost: item.lab, plantCost: item.plant, subcontractCost: item.sub,
        },
      })
    }
  }

  // ========================================
  // CW4: Subcontractors, Certs, and Orders
  // ========================================

  const subcontractors = [
    { id: "sub-001", name: "ABC Electrical Ltd", trade: "Electrician", contactName: "Alan Baker", email: "alan@abcelectrical.co.uk", phone: "07700 800001", cisUtr: "1234567891", cisVerified: true, cisTaxStatus: "NET" as const, vatRegistered: true, insuranceExpiry: new Date("2026-11-15"), rating: 5, portalToken: "portal-abc-electrical-token-001" },
    { id: "sub-002", name: "Thames Plumbing & Heating", trade: "Plumber", contactName: "Brian Thames", email: "brian@thamesplumbing.co.uk", phone: "07700 800002", cisUtr: "1234567892", cisVerified: true, cisTaxStatus: "GROSS" as const, vatRegistered: true, insuranceExpiry: new Date("2027-03-20"), rating: 4, portalToken: "portal-thames-plumbing-token-002" },
    { id: "sub-003", name: "Essex Groundworks Ltd", trade: "Groundworker", contactName: "Charlie Essex", email: "charlie@essexground.co.uk", phone: "07700 800003", cisUtr: "1234567893", cisVerified: true, cisTaxStatus: "NET" as const, vatRegistered: true, insuranceExpiry: new Date("2025-12-01"), rating: 3, portalToken: null },
    { id: "sub-004", name: "Premier Brickwork", trade: "Bricklayer", contactName: "Derek Stone", email: "derek@premierbrick.co.uk", phone: "07700 800004", cisUtr: "1234567894", cisVerified: true, cisTaxStatus: "NET" as const, vatRegistered: false, insuranceExpiry: new Date("2026-08-30"), rating: 4, portalToken: null },
    { id: "sub-005", name: "Skyline Scaffolding", trade: "Scaffolder", contactName: "Eddie Skyline", email: "eddie@skylinescaff.co.uk", phone: "07700 800005", cisUtr: "1234567895", cisVerified: true, cisTaxStatus: "GROSS" as const, vatRegistered: true, insuranceExpiry: new Date("2026-09-10"), rating: 5, portalToken: "portal-skyline-scaffolding-token-005" },
    { id: "sub-006", name: "Dave's Decorating", trade: "Decorator", contactName: "Dave Painter", email: "dave@davesdecorating.co.uk", phone: "07700 800006", cisUtr: "1234567896", cisVerified: false, cisTaxStatus: "HIGHER_RATE" as const, vatRegistered: false, insuranceExpiry: new Date("2026-06-15"), rating: 3, portalToken: null },
    { id: "sub-007", name: "Apex Roofing Solutions", trade: "Roofer", contactName: "Frank Apex", email: "frank@apexroofing.co.uk", phone: "07700 800007", cisUtr: "1234567897", cisVerified: true, cisTaxStatus: "NET" as const, vatRegistered: true, insuranceExpiry: new Date("2026-10-22"), rating: 4, portalToken: null },
    { id: "sub-008", name: "Oakwood Carpentry", trade: "Carpenter", contactName: "George Oak", email: "george@oakwoodcarp.co.uk", phone: "07700 800008", cisUtr: "1234567898", cisVerified: true, cisTaxStatus: "GROSS" as const, vatRegistered: false, insuranceExpiry: new Date("2026-07-05"), rating: 4, portalToken: null },
    { id: "sub-009", name: "Dynamic M&E Services", trade: "M&E", contactName: "Harry Dynamic", email: "harry@dynamicme.co.uk", phone: "07700 800009", cisUtr: "1234567899", cisVerified: true, cisTaxStatus: "NET" as const, vatRegistered: true, insuranceExpiry: new Date("2027-01-18"), rating: 5, portalToken: null },
    { id: "sub-010", name: "GreenScape Landscaping", trade: "Landscaping", contactName: "Ian Green", email: "ian@greenscapeland.co.uk", phone: "07700 800010", cisUtr: null, cisVerified: false, cisTaxStatus: "NOT_VERIFIED" as const, vatRegistered: false, insuranceExpiry: new Date("2026-04-30"), rating: 3, portalToken: null },
  ]

  for (const s of subcontractors) {
    await prisma.subcontractor.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        companyId: company.id,
        name: s.name,
        trade: s.trade,
        contactName: s.contactName,
        email: s.email,
        phone: s.phone,
        cisUtr: s.cisUtr,
        cisVerified: s.cisVerified,
        cisTaxStatus: s.cisTaxStatus,
        vatRegistered: s.vatRegistered,
        insuranceExpiry: s.insuranceExpiry,
        rating: s.rating,
        portalToken: s.portalToken,
      },
    })
  }

  // Subcontractor Certs
  const certs = [
    // ABC Electrical — 2 certs
    { id: "cert-001", subcontractorId: "sub-001", type: "NICEIC", reference: "NIC-2024-88431", expiryDate: new Date("2027-06-30") },
    { id: "cert-002", subcontractorId: "sub-001", type: "Gas Safe", reference: "GS-556781", expiryDate: new Date("2026-12-15") },
    // Thames Plumbing — 3 certs
    { id: "cert-003", subcontractorId: "sub-002", type: "Gas Safe", reference: "GS-334455", expiryDate: new Date("2027-02-28") },
    { id: "cert-004", subcontractorId: "sub-002", type: "Public Liability", reference: "PL-THP-2026", expiryDate: new Date("2027-03-20") },
    { id: "cert-005", subcontractorId: "sub-002", type: "Employers Liability", reference: "EL-THP-2026", expiryDate: new Date("2027-03-20") },
    // Essex Groundworks — 1 cert (expired!)
    { id: "cert-006", subcontractorId: "sub-003", type: "Public Liability", reference: "PL-EG-2025", expiryDate: new Date("2025-12-01") },
    // Premier Brickwork — 2 certs
    { id: "cert-007", subcontractorId: "sub-004", type: "CSCS", reference: "CSCS-DS-44221", expiryDate: new Date("2027-09-15") },
    { id: "cert-008", subcontractorId: "sub-004", type: "Public Liability", reference: "PL-PB-2026", expiryDate: new Date("2026-08-30") },
    // Skyline Scaffolding — 2 certs
    { id: "cert-009", subcontractorId: "sub-005", type: "Public Liability", reference: "PL-SS-2026", expiryDate: new Date("2026-09-10") },
    { id: "cert-010", subcontractorId: "sub-005", type: "SSIP", reference: "SSIP-SKY-2026", expiryDate: new Date("2027-01-31") },
    // Apex Roofing — 2 certs
    { id: "cert-011", subcontractorId: "sub-007", type: "Public Liability", reference: "PL-AR-2026", expiryDate: new Date("2026-10-22") },
    { id: "cert-012", subcontractorId: "sub-007", type: "Working at Height", reference: "WAH-AR-2026", expiryDate: new Date("2027-04-15") },
    // Oakwood Carpentry — 1 cert
    { id: "cert-013", subcontractorId: "sub-008", type: "CSCS", reference: "CSCS-GO-55332", expiryDate: new Date("2027-11-20") },
    // Dynamic M&E — 3 certs
    { id: "cert-014", subcontractorId: "sub-009", type: "NICEIC", reference: "NIC-2025-99012", expiryDate: new Date("2027-08-31") },
    { id: "cert-015", subcontractorId: "sub-009", type: "Gas Safe", reference: "GS-778899", expiryDate: new Date("2027-01-18") },
    { id: "cert-016", subcontractorId: "sub-009", type: "Public Liability", reference: "PL-DM-2026", expiryDate: new Date("2027-01-18") },
    // GreenScape — 1 cert
    { id: "cert-017", subcontractorId: "sub-010", type: "Public Liability", reference: "PL-GS-2026", expiryDate: new Date("2026-04-30") },
  ]

  for (const c of certs) {
    await prisma.subcontractorCert.upsert({
      where: { id: c.id },
      update: {},
      create: c,
    })
  }

  // Subcontract Orders
  const subOrders = [
    { id: "so-001", jobId: "job-001", subcontractorId: "sub-004", trade: "Brickwork", value: 28000, orderDate: new Date("2026-02-01"), status: "IN_PROGRESS" as const, scopeDescription: "External brickwork to rear extension including feature panels" },
    { id: "so-002", jobId: "job-001", subcontractorId: "sub-001", trade: "Electrical first fix", value: 12500, orderDate: new Date("2026-03-01"), status: "ISSUED" as const, scopeDescription: "Full electrical first fix including consumer unit upgrade" },
    { id: "so-003", jobId: "job-002", subcontractorId: "sub-009", trade: "M&E Installation", value: 520000, orderDate: new Date("2025-12-01"), status: "IN_PROGRESS" as const, scopeDescription: "Complete M&E installation floors 12-14 including HVAC, electrical, and plumbing" },
    { id: "so-004", jobId: "job-002", subcontractorId: "sub-005", trade: "Scaffolding", value: 45000, orderDate: new Date("2025-11-15"), status: "COMPLETE" as const, scopeDescription: "External scaffold for facade works" },
    { id: "so-005", jobId: "job-005", subcontractorId: "sub-003", trade: "Groundworks", value: 85000, orderDate: new Date("2025-09-01"), status: "COMPLETE" as const, scopeDescription: "Foundations, drainage and ground floor slabs for all 6 plots" },
    { id: "so-006", jobId: "job-005", subcontractorId: "sub-007", trade: "Roofing", value: 95000, orderDate: new Date("2026-03-01"), status: "ACCEPTED" as const, scopeDescription: "Tiled roofing to all 6 plots including lead work and fascias" },
    { id: "so-007", jobId: "job-006", subcontractorId: "sub-006", trade: "Decorating", value: 8500, orderDate: new Date("2026-03-15"), status: "DRAFT" as const, scopeDescription: "Full decoration of shop interior including feature wall" },
    { id: "so-008", jobId: "job-005", subcontractorId: "sub-004", trade: "Brickwork", value: 120000, orderDate: new Date("2025-10-15"), status: "IN_PROGRESS" as const, scopeDescription: "All external brickwork for 6 detached houses" },
    { id: "so-009", jobId: "job-001", subcontractorId: "sub-002", trade: "Plumbing", value: 18000, orderDate: new Date("2026-03-10"), status: "ISSUED" as const, scopeDescription: "Full plumbing installation including bathroom and kitchen" },
    { id: "so-010", jobId: "job-005", subcontractorId: "sub-010", trade: "Landscaping", value: 65000, orderDate: new Date("2026-06-01"), status: "DRAFT" as const, scopeDescription: "External landscaping, driveways, and gardens for all 6 plots" },
  ]

  for (const so of subOrders) {
    await prisma.subcontractOrder.upsert({
      where: { id: so.id },
      update: {},
      create: so,
    })
  }

  // ========================================
  // CW5: Invoices, CIS Deductions, Valuations
  // ========================================

  // Sales Invoices (8)
  const salesInvoices = [
    { id: "inv-s01", companyId: company.id, jobId: "job-002", type: "SALES" as const, number: "INV-2026-001", amount: 245000, vat: 49000, vatReverseCharge: false, total: 294000, status: "PAID" as const, dueDate: new Date("2026-01-15"), createdAt: new Date("2025-12-15"), updatedAt: new Date("2026-01-10") },
    { id: "inv-s02", companyId: company.id, jobId: "job-002", type: "SALES" as const, number: "INV-2026-002", amount: 380000, vat: 76000, vatReverseCharge: false, total: 456000, status: "PAID" as const, dueDate: new Date("2026-02-20"), createdAt: new Date("2026-01-20"), updatedAt: new Date("2026-02-18") },
    { id: "inv-s03", companyId: company.id, jobId: "job-001", type: "SALES" as const, number: "INV-2026-003", amount: 55000, vat: 11000, vatReverseCharge: false, total: 66000, status: "PAID" as const, dueDate: new Date("2026-02-28"), createdAt: new Date("2026-01-28"), updatedAt: new Date("2026-02-25") },
    { id: "inv-s04", companyId: company.id, jobId: "job-005", type: "SALES" as const, number: "INV-2026-004", amount: 180000, vat: 36000, vatReverseCharge: false, total: 216000, status: "SENT" as const, dueDate: new Date("2026-03-30"), createdAt: new Date("2026-02-28"), updatedAt: new Date("2026-02-28") },
    { id: "inv-s05", companyId: company.id, jobId: "job-006", type: "SALES" as const, number: "INV-2026-005", amount: 35000, vat: 7000, vatReverseCharge: false, total: 42000, status: "OVERDUE" as const, dueDate: new Date("2026-02-15"), createdAt: new Date("2026-01-15"), updatedAt: new Date("2026-01-15") },
    { id: "inv-s06", companyId: company.id, jobId: "job-007", type: "SALES" as const, number: "INV-2026-006", amount: 95000, vat: 0, vatReverseCharge: true, total: 95000, status: "OVERDUE" as const, dueDate: new Date("2026-01-31"), createdAt: new Date("2025-12-31"), updatedAt: new Date("2025-12-31") },
    { id: "inv-s07", companyId: company.id, jobId: "job-001", type: "SALES" as const, number: "INV-2026-007", amount: 42000, vat: 8400, vatReverseCharge: false, total: 50400, status: "DRAFT" as const, dueDate: new Date("2026-04-15"), createdAt: new Date("2026-03-14"), updatedAt: new Date("2026-03-14") },
    { id: "inv-s08", companyId: company.id, jobId: "job-005", type: "SALES" as const, number: "INV-2026-008", amount: 120000, vat: 24000, vatReverseCharge: false, total: 144000, status: "SENT" as const, dueDate: new Date("2026-04-10"), createdAt: new Date("2026-03-10"), updatedAt: new Date("2026-03-10") },
  ]

  for (const inv of salesInvoices) {
    await prisma.invoice.upsert({
      where: { id: inv.id },
      update: {},
      create: inv,
    })
  }

  // Purchase Invoices (6) — linked to subcontractors with CIS
  const purchaseInvoices = [
    { id: "inv-p01", companyId: company.id, jobId: "job-001", subcontractorId: "sub-004", type: "PURCHASE" as const, number: "PI-2026-001", amount: 14000, vat: 0, vatReverseCharge: true, total: 14000, status: "PAID" as const, dueDate: new Date("2026-03-01"), createdAt: new Date("2026-02-01"), updatedAt: new Date("2026-02-28") },
    { id: "inv-p02", companyId: company.id, jobId: "job-002", subcontractorId: "sub-009", type: "PURCHASE" as const, number: "PI-2026-002", amount: 85000, vat: 17000, vatReverseCharge: false, total: 102000, status: "PAID" as const, dueDate: new Date("2026-02-15"), createdAt: new Date("2026-01-15"), updatedAt: new Date("2026-02-12") },
    { id: "inv-p03", companyId: company.id, jobId: "job-005", subcontractorId: "sub-003", type: "PURCHASE" as const, number: "PI-2026-003", amount: 42500, vat: 0, vatReverseCharge: true, total: 42500, status: "PAID" as const, dueDate: new Date("2026-01-31"), createdAt: new Date("2025-12-31"), updatedAt: new Date("2026-01-28") },
    { id: "inv-p04", companyId: company.id, jobId: "job-002", subcontractorId: "sub-005", type: "PURCHASE" as const, number: "PI-2026-004", amount: 45000, vat: 9000, vatReverseCharge: false, total: 54000, status: "PAID" as const, dueDate: new Date("2026-01-15"), createdAt: new Date("2025-12-15"), updatedAt: new Date("2026-01-12") },
    { id: "inv-p05", companyId: company.id, jobId: "job-001", subcontractorId: "sub-001", type: "PURCHASE" as const, number: "PI-2026-005", amount: 6500, vat: 1300, vatReverseCharge: false, total: 7800, status: "SENT" as const, dueDate: new Date("2026-04-01"), createdAt: new Date("2026-03-01"), updatedAt: new Date("2026-03-01") },
    { id: "inv-p06", companyId: company.id, jobId: "job-006", subcontractorId: "sub-006", type: "PURCHASE" as const, number: "PI-2026-006", amount: 4250, vat: 0, vatReverseCharge: true, total: 4250, status: "DRAFT" as const, dueDate: new Date("2026-04-15"), createdAt: new Date("2026-03-14"), updatedAt: new Date("2026-03-14") },
  ]

  for (const inv of purchaseInvoices) {
    await prisma.invoice.upsert({
      where: { id: inv.id },
      update: {},
      create: inv,
    })
  }

  // CIS Deductions (6) — linked to purchase invoices, correct rates
  // sub-004 Premier Brickwork: NET (20%), sub-009 Dynamic M&E: NET (20%)
  // sub-003 Essex Groundworks: NET (20%), sub-005 Skyline Scaffolding: GROSS (0%)
  // sub-001 ABC Electrical: NET (20%), sub-006 Dave's Decorating: HIGHER_RATE (30%)
  const cisDeductions = [
    { id: "cis-001", invoiceId: "inv-p01", subcontractorId: "sub-004", gross: 14000, deductionRate: 20, deductionAmount: 2200, net: 11800, taxMonth: "2026-02" },
    // Materials £3000 exempt: CIS-liable = 14000 - 3000 = 11000, 20% of 11000 = 2200
    { id: "cis-002", invoiceId: "inv-p02", subcontractorId: "sub-009", gross: 85000, deductionRate: 20, deductionAmount: 14000, net: 71000, taxMonth: "2026-01" },
    // Materials £15000 exempt: CIS-liable = 85000 - 15000 = 70000, 20% of 70000 = 14000
    { id: "cis-003", invoiceId: "inv-p03", subcontractorId: "sub-003", gross: 42500, deductionRate: 20, deductionAmount: 6500, net: 36000, taxMonth: "2025-12" },
    // Materials £10000 exempt: CIS-liable = 42500 - 10000 = 32500, 20% of 32500 = 6500
    { id: "cis-004", invoiceId: "inv-p04", subcontractorId: "sub-005", gross: 45000, deductionRate: 0, deductionAmount: 0, net: 45000, taxMonth: "2025-12" },
    // GROSS status = 0% deduction
    { id: "cis-005", invoiceId: "inv-p05", subcontractorId: "sub-001", gross: 6500, deductionRate: 20, deductionAmount: 900, net: 5600, taxMonth: "2026-03" },
    // Materials £2000 exempt: CIS-liable = 6500 - 2000 = 4500, 20% of 4500 = 900
    { id: "cis-006", invoiceId: "inv-p06", subcontractorId: "sub-006", gross: 4250, deductionRate: 30, deductionAmount: 1275, net: 2975, taxMonth: "2026-03" },
    // HIGHER_RATE = 30%, no materials: CIS-liable = 4250, 30% of 4250 = 1275
  ]

  for (const cis of cisDeductions) {
    await prisma.cISDeduction.upsert({
      where: { id: cis.id },
      update: {},
      create: cis,
    })
  }

  // Valuations (3) — across 2 jobs
  const valuations = [
    { id: "val-001", jobId: "job-002", number: 1, periodStart: new Date("2025-11-01"), periodEnd: new Date("2025-12-31"), grossValue: 530000, retention: 26500, previousCerts: 0, thisCert: 503500, status: "PAID" as const },
    { id: "val-002", jobId: "job-002", number: 2, periodStart: new Date("2026-01-01"), periodEnd: new Date("2026-02-28"), grossValue: 870000, retention: 43500, previousCerts: 503500, thisCert: 323000, status: "CERTIFIED" as const },
    { id: "val-003", jobId: "job-005", number: 1, periodStart: new Date("2025-09-01"), periodEnd: new Date("2025-12-31"), grossValue: 480000, retention: 24000, previousCerts: 0, thisCert: 456000, status: "PAID" as const },
  ]

  for (const val of valuations) {
    await prisma.valuation.upsert({
      where: { id: val.id },
      update: {},
      create: val,
    })
  }

  // Cash flow forecast data for realism
  const cashFlowForecasts = [
    { id: "cf-001", jobId: "job-002", month: new Date("2026-04-01"), incomeForecast: 320000, costForecast: 240000 },
    { id: "cf-002", jobId: "job-002", month: new Date("2026-05-01"), incomeForecast: 280000, costForecast: 210000 },
    { id: "cf-003", jobId: "job-002", month: new Date("2026-06-01"), incomeForecast: 350000, costForecast: 260000 },
    { id: "cf-004", jobId: "job-005", month: new Date("2026-04-01"), incomeForecast: 150000, costForecast: 120000 },
    { id: "cf-005", jobId: "job-005", month: new Date("2026-05-01"), incomeForecast: 180000, costForecast: 140000 },
    { id: "cf-006", jobId: "job-001", month: new Date("2026-04-01"), incomeForecast: 45000, costForecast: 35000 },
  ]

  for (const cf of cashFlowForecasts) {
    await prisma.cashFlowForecast.upsert({
      where: { id: cf.id },
      update: {},
      create: cf,
    })
  }

  // ========================================
  // CW6: Safety (RAMS, Incidents, Inductions) & Snagging
  // ========================================

  // RAMS — 4 records
  const ramsData = [
    {
      id: "rams-001", jobId: "job-002", title: "Working at Height — Tower Crane & Scaffold", version: 1, status: "APPROVED" as const,
      approvedBy: "James Morrison", approvedDate: new Date("2025-11-10"),
      content: {
        hazards: [
          { description: "Falls from height during scaffold erection/dismantling", whoAtRisk: "Scaffold erectors, trades working at height", riskBefore: "Very High", controls: "Scaffolding erected by CISRS-trained operatives only. Full edge protection. Scaffold inspected weekly and after adverse weather. All operatives to wear harness when above 2m with no edge protection.", riskAfter: "Low", responsible: "Tom Richards" },
          { description: "Falling objects from height", whoAtRisk: "Ground-level workers, public", riskBefore: "High", controls: "Brick guards and toe boards on all scaffold lifts. Debris netting installed. Exclusion zone at ground level clearly marked with barriers and signage. Hard hats mandatory within 6m of scaffold.", riskAfter: "Low", responsible: "Tom Richards" },
          { description: "Collapse of temporary works", whoAtRisk: "All site operatives", riskBefore: "High", controls: "Temporary works designed by competent engineer. Independent check before loading. TW register maintained. No alterations without TW coordinator approval.", riskAfter: "Low", responsible: "Emma Clarke" },
        ],
        ppe: ["Hard Hat", "Hi-Vis", "Steel Toes", "Harness", "Gloves"],
        emergency: { hospital: "Royal London Hospital, Whitechapel Road, E1 1FR", firstAider: "Tom Richards", assemblyPoint: "Canada Square Gardens — North Side" },
      },
    },
    {
      id: "rams-002", jobId: "job-001", title: "Hot Works — Welding Steel Beams", version: 1, status: "APPROVED" as const,
      approvedBy: "Mike O'Brien", approvedDate: new Date("2026-02-20"),
      content: {
        hazards: [
          { description: "Fire from welding sparks and molten metal", whoAtRisk: "Welder, adjacent trades, building occupants", riskBefore: "Very High", controls: "Hot works permit required for every session. Fire watch maintained for 60 minutes after works cease. All combustible materials cleared within 10m radius. Fire extinguisher within 2m of works at all times.", riskAfter: "Low", responsible: "Dave Wilson" },
          { description: "Burns from hot metal and UV radiation", whoAtRisk: "Welder, nearby operatives", riskBefore: "High", controls: "Welding screens erected. Full PPE including welding mask, leather gauntlets, and fire-resistant overalls. Warning signs displayed. No lone working during welding operations.", riskAfter: "Low", responsible: "Dave Wilson" },
          { description: "Fume inhalation from welding", whoAtRisk: "Welder, nearby operatives", riskBefore: "High", controls: "LEV (local exhaust ventilation) used where practicable. RPE (FFP3) worn by welder. Area well ventilated — natural or forced. COSHH assessment for welding rod type completed.", riskAfter: "Low", responsible: "Dave Wilson" },
        ],
        ppe: ["Hard Hat", "Hi-Vis", "Steel Toes", "Gloves", "Eye Protection", "Mask/RPE"],
        emergency: { hospital: "Broomfield Hospital, Court Road, CM1 7ET", firstAider: "Dave Wilson", assemblyPoint: "Front driveway — by site entrance" },
      },
    },
    {
      id: "rams-003", jobId: "job-005", title: "Excavation — Foundation Trenches", version: 1, status: "DRAFT" as const,
      approvedBy: null, approvedDate: null,
      content: {
        hazards: [
          { description: "Collapse of excavation sides", whoAtRisk: "Groundworkers, anyone entering excavation", riskBefore: "Very High", controls: "Trench support or battering back to safe angle. No entry to excavations deeper than 1.2m without support. Daily inspection by competent person. Stop work in heavy rain — reassess stability.", riskAfter: "Medium", responsible: "Dave Wilson" },
          { description: "Striking underground services (gas, electric, water)", whoAtRisk: "Machine operators, groundworkers", riskBefore: "Very High", controls: "CAT scanner and Genny used before any excavation. Service plans obtained from all utility providers. Hand dig within 500mm of known services. Permit to dig system enforced.", riskAfter: "Low", responsible: "Dave Wilson" },
          { description: "Plant striking personnel in excavation area", whoAtRisk: "Groundworkers, site visitors", riskBefore: "High", controls: "Exclusion zone around operating plant. Banksman required when reversing. All operatives to wear hi-vis. No one in excavation when machine operating within 5m.", riskAfter: "Low", responsible: "Dave Wilson" },
        ],
        ppe: ["Hard Hat", "Hi-Vis", "Steel Toes", "Gloves"],
        emergency: { hospital: "Queen's Hospital, Rom Valley Way, RM7 0AG", firstAider: "Dave Wilson", assemblyPoint: "Site entrance gate — North Street" },
      },
    },
    {
      id: "rams-004", jobId: "job-002", title: "Electrical Installation — Distribution Boards", version: 2, status: "SUPERSEDED" as const,
      approvedBy: "Emma Clarke", approvedDate: new Date("2025-12-01"),
      content: {
        hazards: [
          { description: "Electric shock from live conductors", whoAtRisk: "Electricians, other trades working nearby", riskBefore: "Very High", controls: "All work carried out dead wherever possible. Lock-off procedure with personal padlocks. Voltage tested before work begins. Only NICEIC-qualified electricians to work on distribution boards. Permit to work system for live working (exceptional circumstances only).", riskAfter: "Low", responsible: "Alan Baker (ABC Electrical)" },
          { description: "Arc flash during testing", whoAtRisk: "Electricians", riskBefore: "High", controls: "Arc-rated PPE worn during testing. Blast-resistant face shield. Testing carried out by competent person only. Exclusion zone during energisation.", riskAfter: "Low", responsible: "Alan Baker (ABC Electrical)" },
        ],
        ppe: ["Hard Hat", "Hi-Vis", "Steel Toes", "Gloves", "Eye Protection"],
        emergency: { hospital: "Royal London Hospital, Whitechapel Road, E1 1FR", firstAider: "Tom Richards", assemblyPoint: "Canada Square Gardens — North Side" },
      },
    },
  ]

  for (const r of ramsData) {
    await prisma.rAMS.upsert({
      where: { id: r.id },
      update: {},
      create: r,
    })
  }

  // Incidents — 6 records
  const incidentsData = [
    {
      id: "inc-001", jobId: "job-005", userId: "user-004", date: new Date("2026-02-14T09:30:00Z"),
      severity: "NEAR_MISS" as const, description: "Unsecured scaffold board on level 3 slid when stepped on. Operative grabbed handrail and did not fall. Board had not been properly clipped after being moved for material hoist access.",
      investigationNotes: "Involved: Steve Morris (bricklayer)\nWitnesses: Paul Dean\nRoot Cause: Procedure Gap",
      correctiveActions: "Immediate: Board secured and all boards on level 3 checked\nCorrective: Toolbox talk delivered on scaffold board security. Additional clips ordered. Scaffold checklist updated to include board clip verification.",
      photos: { involved: "Steve Morris", witnesses: "Paul Dean", rootCause: "Procedure Gap", immediateActions: "Board secured and inspected" },
      status: "CLOSED" as const,
    },
    {
      id: "inc-002", jobId: "job-002", userId: "user-006", date: new Date("2026-01-22T14:15:00Z"),
      severity: "NEAR_MISS" as const, description: "Water leak from floor above dripped onto live temporary distribution board. Sparking observed. RCD tripped and isolated supply. No injuries.",
      investigationNotes: "Involved: None directly\nWitnesses: Tom Richards, Harry Dynamic\nRoot Cause: Environmental",
      correctiveActions: "Immediate: Power isolated. Area cordoned off. Leak source identified as burst temporary supply pipe.\nCorrective: All temporary DBs now fitted with weather covers. Weekly check of temporary plumbing added to site checklist.",
      photos: { involved: "N/A", witnesses: "Tom Richards, Harry Dynamic", rootCause: "Environmental", immediateActions: "Power isolated, leak fixed" },
      status: "CLOSED" as const,
    },
    {
      id: "inc-003", jobId: "job-001", userId: "user-004", date: new Date("2026-03-05T11:00:00Z"),
      severity: "MINOR" as const, description: "Apprentice bricklayer cut finger on brick edge while carrying bricks without gloves. Small laceration requiring first aid treatment on site. No hospital visit needed.",
      investigationNotes: "Involved: Jack Cooper (apprentice)\nWitnesses: Dave Wilson\nRoot Cause: Training Gap",
      correctiveActions: "Immediate: First aid applied — cleaned and dressed on site\nCorrective: Apprentice reminded of mandatory PPE policy. One-to-one briefing with supervisor on manual handling and PPE requirements.",
      photos: { involved: "Jack Cooper", witnesses: "Dave Wilson", rootCause: "Training Gap", immediateActions: "First aid applied on site" },
      status: "CLOSED" as const,
    },
    {
      id: "inc-004", jobId: "job-005", userId: "user-004", date: new Date("2026-03-10T16:45:00Z"),
      severity: "MINOR" as const, description: "Nail gun misfire on plot 3 during second fix carpentry. Nail deflected off joist hanger and struck carpenter's forearm. Puncture wound treated at A&E as precaution. Returned to work next day.",
      investigationNotes: "Involved: Mark Johnson (carpenter)\nWitnesses: Dave Wilson, Gary Peters\nRoot Cause: Equipment Failure",
      correctiveActions: "Immediate: First aid applied. Operative taken to A&E. Nail gun removed from service.\nCorrective: All nail guns inspected and serviced. Defective unit replaced. Toolbox talk on nail gun safety. Pre-use checks now mandatory.",
      photos: { involved: "Mark Johnson", witnesses: "Dave Wilson, Gary Peters", rootCause: "Equipment Failure", immediateActions: "First aid, A&E visit, nail gun removed" },
      status: "INVESTIGATING" as const,
    },
    {
      id: "inc-005", jobId: "job-002", userId: "user-006", date: new Date("2026-02-18T10:30:00Z"),
      severity: "MAJOR" as const, description: "Ceiling tile grid section (approx 2m x 1.2m) collapsed during installation on floor 13. Two operatives below were struck by falling framework. One sustained bruised shoulder, the other a cut to the head requiring 4 stitches at hospital. Both off work for 3 days.",
      investigationNotes: "Involved: Peter Smith (ceiling fixer), James Taylor (M&E)\nWitnesses: Tom Richards, 3 other operatives\nRoot Cause: Human Error",
      correctiveActions: "Immediate: Area cordoned off. Both operatives taken to hospital. All ceiling work stopped pending investigation.\nCorrective: Suspension system manufacturer recalled to site to re-train. Additional hanger points specified. Independent check of all installed grid sections. Method statement revised.",
      photos: { involved: "Peter Smith, James Taylor", witnesses: "Tom Richards + 3 others", rootCause: "Human Error", immediateActions: "Area cordoned, operatives to hospital, ceiling work stopped" },
      status: "INVESTIGATING" as const,
    },
    {
      id: "inc-006", jobId: "job-005", userId: "user-004", date: new Date("2026-01-08T08:45:00Z"),
      severity: "RIDDOR" as const, description: "Groundworker fell into open excavation (approx 1.8m deep) on Plot 6 when edge protection was removed for material access and not replaced. Operative suffered fractured wrist and concussion. Ambulance called. Hospitalised for 2 days. Off work for 6 weeks.",
      investigationNotes: "Involved: Colin Price (groundworker, Essex Groundworks)\nWitnesses: Dave Wilson, Steve Morris, Paul Dean\nRoot Cause: Procedure Gap",
      correctiveActions: "Immediate: Ambulance called. Excavation barriered off. All excavations on site checked.\nCorrective: Formal investigation completed. Written warning issued to operative who removed barriers. New policy: edge protection removal requires permit and banksman. Retro-fitted all excavations with physical stop-blocks. HSE notified same day.",
      photos: { involved: "Colin Price", witnesses: "Dave Wilson, Steve Morris, Paul Dean", rootCause: "Procedure Gap", immediateActions: "999 called, excavation secured", riddorRef: "RIDD-2026-004412", riddorDate: "2026-01-08" },
      status: "CLOSED" as const,
    },
  ]

  for (const inc of incidentsData) {
    await prisma.incident.upsert({
      where: { id: inc.id },
      update: {},
      create: inc,
    })
  }

  // Inductions — 12 records across 3 jobs
  const inductionsData = [
    { id: "ind-001", jobId: "job-001", personName: "Jack Cooper", companyName: "BuildFlow Demo Ltd", date: new Date("2026-01-15"), inductedBy: "Dave Wilson", signed: true, topics: ["Site Rules", "PPE Requirements", "Welfare Facilities", "First Aid", "Fire Procedures", "Hazard Awareness", "Trade: Apprentice Bricklayer"] },
    { id: "ind-002", jobId: "job-001", personName: "Alan Baker", companyName: "ABC Electrical Ltd", date: new Date("2026-03-01"), inductedBy: "Dave Wilson", signed: true, topics: ["Site Rules", "PPE Requirements", "First Aid", "Fire Procedures", "Hazard Awareness", "Permits to Work", "Trade: Electrician"] },
    { id: "ind-003", jobId: "job-001", personName: "Brian Thames", companyName: "Thames Plumbing & Heating", date: new Date("2026-03-10"), inductedBy: "Dave Wilson", signed: true, topics: ["Site Rules", "PPE Requirements", "First Aid", "Fire Procedures", "Hazard Awareness", "Trade: Plumber"] },
    { id: "ind-004", jobId: "job-001", personName: "Derek Stone", companyName: "Premier Brickwork", date: new Date("2026-02-01"), inductedBy: "Dave Wilson", signed: true, topics: ["Site Rules", "PPE Requirements", "Welfare Facilities", "First Aid", "Fire Procedures", "Working Hours", "Trade: Bricklayer"] },
    { id: "ind-005", jobId: "job-002", personName: "Harry Dynamic", companyName: "Dynamic M&E Services", date: new Date("2025-11-01"), inductedBy: "Tom Richards", signed: true, topics: ["Site Rules", "PPE Requirements", "Welfare Facilities", "First Aid", "Fire Procedures", "Hazard Awareness", "Permits to Work", "Reporting Procedures", "Trade: M&E Engineer"] },
    { id: "ind-006", jobId: "job-002", personName: "Eddie Skyline", companyName: "Skyline Scaffolding", date: new Date("2025-11-01"), inductedBy: "Tom Richards", signed: true, topics: ["Site Rules", "PPE Requirements", "First Aid", "Fire Procedures", "Hazard Awareness", "Working Hours", "Trade: Scaffolder"] },
    { id: "ind-007", jobId: "job-002", personName: "Peter Smith", companyName: "Apex Ceilings Ltd", date: new Date("2026-01-10"), inductedBy: "Tom Richards", signed: true, topics: ["Site Rules", "PPE Requirements", "First Aid", "Fire Procedures", "Hazard Awareness", "Trade: Ceiling Fixer"] },
    { id: "ind-008", jobId: "job-002", personName: "James Taylor", companyName: "Dynamic M&E Services", date: new Date("2025-11-01"), inductedBy: "Tom Richards", signed: true, topics: ["Site Rules", "PPE Requirements", "First Aid", "Fire Procedures", "Hazard Awareness", "Permits to Work", "Trade: M&E Apprentice"] },
    { id: "ind-009", jobId: "job-005", personName: "Colin Price", companyName: "Essex Groundworks Ltd", date: new Date("2025-09-01"), inductedBy: "Dave Wilson", signed: true, topics: ["Site Rules", "PPE Requirements", "Welfare Facilities", "First Aid", "Fire Procedures", "Hazard Awareness", "Trade: Groundworker"] },
    { id: "ind-010", jobId: "job-005", personName: "Mark Johnson", companyName: "Oakwood Carpentry", date: new Date("2026-01-06"), inductedBy: "Dave Wilson", signed: true, topics: ["Site Rules", "PPE Requirements", "First Aid", "Fire Procedures", "Hazard Awareness", "Working Hours", "Trade: Carpenter"] },
    { id: "ind-011", jobId: "job-005", personName: "Steve Morris", companyName: "Premier Brickwork", date: new Date("2025-10-15"), inductedBy: "Dave Wilson", signed: true, topics: ["Site Rules", "PPE Requirements", "Welfare Facilities", "First Aid", "Fire Procedures", "Hazard Awareness", "Reporting Procedures", "Trade: Bricklayer"] },
    { id: "ind-012", jobId: "job-005", personName: "Frank Apex", companyName: "Apex Roofing Solutions", date: new Date("2026-03-01"), inductedBy: "Dave Wilson", signed: true, topics: ["Site Rules", "PPE Requirements", "First Aid", "Fire Procedures", "Hazard Awareness", "Permits to Work", "Trade: Roofer"] },
  ]

  for (const ind of inductionsData) {
    await prisma.induction.upsert({
      where: { id: ind.id },
      update: {},
      create: ind,
    })
  }

  // Snag Lists — 3 across 2 jobs
  const snagListsData = [
    { id: "snag-001", jobId: "job-007", area: "Main Dining Area", status: "IN_PROGRESS" as const },
    { id: "snag-002", jobId: "job-007", area: "Kitchen & Back of House", status: "OPEN" as const },
    { id: "snag-003", jobId: "job-005", area: "Plot 1 — Ground Floor", status: "IN_PROGRESS" as const },
  ]

  for (const sl of snagListsData) {
    await prisma.snagList.upsert({
      where: { id: sl.id },
      update: {},
      create: sl,
    })
  }

  // Snag Items — 18 items across 3 lists
  const snagItemsData = [
    // Snag List 1: Main Dining Area (snag-001) — 7 items
    { id: "si-001", snagListId: "snag-001", description: "Paint touch-up required on feature wall — visible roller marks", location: "East wall, behind bar area", assignedTo: "Dave's Decorating", priority: "MEDIUM" as const, status: "RESOLVED" as const, dueDate: new Date("2026-03-01"), completedDate: new Date("2026-02-28"), photos: { category: "Defective Work" } },
    { id: "si-002", snagListId: "snag-001", description: "Skirting board not flush with wall — 3mm gap visible", location: "South wall near entrance", assignedTo: "Oakwood Carpentry", priority: "LOW" as const, status: "VERIFIED" as const, dueDate: new Date("2026-03-01"), completedDate: new Date("2026-02-27"), photos: { category: "Incomplete Work" } },
    { id: "si-003", snagListId: "snag-001", description: "Ceiling light fitting not centred over table 4", location: "Centre of dining area", assignedTo: "ABC Electrical", priority: "MEDIUM" as const, status: "IN_PROGRESS" as const, dueDate: new Date("2026-03-10"), completedDate: null, photos: { category: "Defective Work" } },
    { id: "si-004", snagListId: "snag-001", description: "Hardwood floor scratched during furniture delivery — 3 boards affected", location: "Main walkway, near front door", assignedTo: "TBC", priority: "HIGH" as const, status: "OPEN" as const, dueDate: new Date("2026-03-15"), completedDate: null, photos: { category: "Damage" } },
    { id: "si-005", snagListId: "snag-001", description: "Window reveal plaster cracked — hairline crack approx 400mm", location: "Front window, left reveal", assignedTo: "Dave's Decorating", priority: "LOW" as const, status: "RESOLVED" as const, dueDate: new Date("2026-03-05"), completedDate: new Date("2026-03-04"), photos: { category: "Defective Work" } },
    { id: "si-006", snagListId: "snag-001", description: "Banquette upholstery stained during painting — needs professional clean", location: "Right side banquette seating", assignedTo: "TBC", priority: "MEDIUM" as const, status: "OPEN" as const, dueDate: new Date("2026-03-12"), completedDate: null, photos: { category: "Cleaning" } },
    { id: "si-007", snagListId: "snag-001", description: "Emergency exit sign not illuminated", location: "Rear fire exit", assignedTo: "ABC Electrical", priority: "HIGH" as const, status: "IN_PROGRESS" as const, dueDate: new Date("2026-03-08"), completedDate: null, photos: { category: "Incomplete Work" } },

    // Snag List 2: Kitchen & Back of House (snag-002) — 5 items
    { id: "si-008", snagListId: "snag-002", description: "Extraction hood not pulling sufficient air — CFM below spec", location: "Main cooking line", assignedTo: "Dynamic M&E", priority: "HIGH" as const, status: "OPEN" as const, dueDate: new Date("2026-03-08"), completedDate: null, photos: { category: "Defective Work" } },
    { id: "si-009", snagListId: "snag-002", description: "Grout missing from 4 tiles behind prep area", location: "Prep counter splashback", assignedTo: "TBC", priority: "LOW" as const, status: "OPEN" as const, dueDate: new Date("2026-03-15"), completedDate: null, photos: { category: "Incomplete Work" } },
    { id: "si-010", snagListId: "snag-002", description: "Staff toilet cistern running constantly", location: "Staff WC", assignedTo: "Thames Plumbing", priority: "MEDIUM" as const, status: "OPEN" as const, dueDate: new Date("2026-03-10"), completedDate: null, photos: { category: "Defective Work" } },
    { id: "si-011", snagListId: "snag-002", description: "Fire door closer not adjusted — door not self-closing fully", location: "Kitchen to dining divide", assignedTo: "Oakwood Carpentry", priority: "HIGH" as const, status: "OPEN" as const, dueDate: new Date("2026-03-07"), completedDate: null, photos: { category: "Defective Work" } },
    { id: "si-012", snagListId: "snag-002", description: "Vinyl flooring seam lifting near walk-in fridge", location: "Cold store entrance", assignedTo: "TBC", priority: "MEDIUM" as const, status: "OPEN" as const, dueDate: new Date("2026-03-12"), completedDate: null, photos: { category: "Defective Work" } },

    // Snag List 3: Plot 1 Ground Floor (snag-003) — 6 items
    { id: "si-013", snagListId: "snag-003", description: "Kitchen socket plate not level — visibly skewed approx 5°", location: "Kitchen, south wall", assignedTo: "ABC Electrical", priority: "LOW" as const, status: "RESOLVED" as const, dueDate: new Date("2026-03-01"), completedDate: new Date("2026-03-01"), photos: { category: "Defective Work" } },
    { id: "si-014", snagListId: "snag-003", description: "Plaster bubble on lounge ceiling — approx 200mm diameter", location: "Lounge, centre of ceiling", assignedTo: "Dave's Decorating", priority: "MEDIUM" as const, status: "IN_PROGRESS" as const, dueDate: new Date("2026-03-10"), completedDate: null, photos: { category: "Defective Work" } },
    { id: "si-015", snagListId: "snag-003", description: "Front door not closing flush — dragging on threshold", location: "Main entrance", assignedTo: "Oakwood Carpentry", priority: "HIGH" as const, status: "OPEN" as const, dueDate: new Date("2026-03-08"), completedDate: null, photos: { category: "Defective Work" } },
    { id: "si-016", snagListId: "snag-003", description: "Downstairs WC — silicone sealant gap around basin", location: "Ground floor WC", assignedTo: "Thames Plumbing", priority: "LOW" as const, status: "VERIFIED" as const, dueDate: new Date("2026-02-28"), completedDate: new Date("2026-02-27"), photos: { category: "Incomplete Work" } },
    { id: "si-017", snagListId: "snag-003", description: "Radiator in hallway not heating — possible airlock", location: "Entrance hallway", assignedTo: "Thames Plumbing", priority: "MEDIUM" as const, status: "RESOLVED" as const, dueDate: new Date("2026-03-05"), completedDate: new Date("2026-03-04"), photos: { category: "Defective Work" } },
    { id: "si-018", snagListId: "snag-003", description: "Builder's clean not complete — dust on window sills and skirting", location: "All rooms", assignedTo: "TBC", priority: "LOW" as const, status: "OPEN" as const, dueDate: new Date("2026-03-15"), completedDate: null, photos: { category: "Cleaning" } },
  ]

  for (const si of snagItemsData) {
    await prisma.snagItem.upsert({
      where: { id: si.id },
      update: {},
      create: si,
    })
  }

  // ========================================
  // CW7: Team Certs, Timesheets, Documents
  // ========================================

  // Update users with CSCS data
  const cscsUpdates = [
    { id: "user-001", cscsNumber: "CSCS-JM-001234", cscsExpiry: new Date("2027-09-15") },
    { id: "user-002", cscsNumber: "CSCS-SC-005678", cscsExpiry: new Date("2026-04-10") }, // expiring soon
    { id: "user-003", cscsNumber: "CSCS-MOB-009012", cscsExpiry: new Date("2028-01-20") },
    { id: "user-004", cscsNumber: "CSCS-DW-003456", cscsExpiry: new Date("2027-06-30") },
    { id: "user-005", cscsNumber: null, cscsExpiry: null }, // No CSCS
    { id: "user-006", cscsNumber: "CSCS-TR-007890", cscsExpiry: new Date("2025-11-01") }, // expired
    { id: "user-007", cscsNumber: "CSCS-EC-002345", cscsExpiry: new Date("2027-12-15") },
    { id: "user-008", cscsNumber: "CSCS-RH-006789", cscsExpiry: new Date("2028-03-01") },
  ]

  for (const u of cscsUpdates) {
    await prisma.user.update({
      where: { id: u.id },
      data: { cscsNumber: u.cscsNumber, cscsExpiry: u.cscsExpiry },
    })
  }

  // Team member certs (stored as Documents with jobId=null, category=cert type, title=reference, fileUrl=expiryDate)
  const userCerts = [
    // James Morrison (Director) — SMSTS, First Aid, Fire Marshal, Asbestos Awareness
    { id: "ucert-001", uploadedBy: "user-001", category: "SMSTS", title: "SMSTS-JM-2024-001", fileUrl: "2027-06-15" },
    { id: "ucert-002", uploadedBy: "user-001", category: "First Aid", title: "FA-JM-2025-044", fileUrl: "2027-02-28" },
    { id: "ucert-003", uploadedBy: "user-001", category: "Fire Marshal", title: "FM-JM-2025-012", fileUrl: "2027-08-10" },
    { id: "ucert-004", uploadedBy: "user-001", category: "Asbestos Awareness", title: "AA-JM-2025-033", fileUrl: "2026-09-20" },

    // Sarah Chen (Estimator) — First Aid, Manual Handling, Asbestos Awareness
    { id: "ucert-005", uploadedBy: "user-002", category: "First Aid", title: "FA-SC-2025-078", fileUrl: "2026-03-25" }, // expiring soon
    { id: "ucert-006", uploadedBy: "user-002", category: "Manual Handling", title: "MH-SC-2025-015", fileUrl: "2027-04-12" },
    { id: "ucert-007", uploadedBy: "user-002", category: "Asbestos Awareness", title: "AA-SC-2024-088", fileUrl: "2025-12-01" }, // expired

    // Mike O'Brien (PM) — SMSTS, First Aid, PASMA, Fire Marshal
    { id: "ucert-008", uploadedBy: "user-003", category: "SMSTS", title: "SMSTS-MOB-2024-002", fileUrl: "2027-10-30" },
    { id: "ucert-009", uploadedBy: "user-003", category: "First Aid", title: "FA-MOB-2025-056", fileUrl: "2027-05-18" },
    { id: "ucert-010", uploadedBy: "user-003", category: "PASMA", title: "PASMA-MOB-2025-009", fileUrl: "2027-03-22" },
    { id: "ucert-011", uploadedBy: "user-003", category: "Fire Marshal", title: "FM-MOB-2025-019", fileUrl: "2027-07-14" },

    // Dave Wilson (Site Manager) — SSSTS, First Aid, IPAF, Abrasive Wheels
    { id: "ucert-012", uploadedBy: "user-004", category: "SSSTS", title: "SSSTS-DW-2025-003", fileUrl: "2027-08-25" },
    { id: "ucert-013", uploadedBy: "user-004", category: "First Aid", title: "FA-DW-2025-091", fileUrl: "2027-01-15" },
    { id: "ucert-014", uploadedBy: "user-004", category: "IPAF", title: "IPAF-DW-2025-007", fileUrl: "2026-04-05" }, // expiring soon
    { id: "ucert-015", uploadedBy: "user-004", category: "Abrasive Wheels", title: "AW-DW-2025-022", fileUrl: "2027-11-30" },

    // Lisa Patel (Office Admin) — First Aid, Fire Marshal, Manual Handling
    { id: "ucert-016", uploadedBy: "user-005", category: "First Aid", title: "FA-LP-2025-102", fileUrl: "2027-09-08" },
    { id: "ucert-017", uploadedBy: "user-005", category: "Fire Marshal", title: "FM-LP-2025-025", fileUrl: "2027-04-20" },
    { id: "ucert-018", uploadedBy: "user-005", category: "Manual Handling", title: "MH-LP-2025-031", fileUrl: "2027-06-15" },

    // Tom Richards (Site Manager) — SSSTS, First Aid, Confined Spaces, PASMA
    { id: "ucert-019", uploadedBy: "user-006", category: "SSSTS", title: "SSSTS-TR-2024-004", fileUrl: "2026-12-20" },
    { id: "ucert-020", uploadedBy: "user-006", category: "First Aid", title: "FA-TR-2025-067", fileUrl: "2027-03-10" },
    { id: "ucert-021", uploadedBy: "user-006", category: "Confined Spaces", title: "CS-TR-2025-005", fileUrl: "2027-05-28" },
    { id: "ucert-022", uploadedBy: "user-006", category: "PASMA", title: "PASMA-TR-2025-011", fileUrl: "2027-02-14" },

    // Emma Clarke (PM) — SMSTS, First Aid, IPAF, Fire Marshal
    { id: "ucert-023", uploadedBy: "user-007", category: "SMSTS", title: "SMSTS-EC-2024-005", fileUrl: "2027-11-15" },
    { id: "ucert-024", uploadedBy: "user-007", category: "First Aid", title: "FA-EC-2025-045", fileUrl: "2027-06-22" },
    { id: "ucert-025", uploadedBy: "user-007", category: "IPAF", title: "IPAF-EC-2025-008", fileUrl: "2027-01-30" },
    { id: "ucert-026", uploadedBy: "user-007", category: "Fire Marshal", title: "FM-EC-2025-030", fileUrl: "2027-09-18" },

    // Ryan Hughes (Estimator) — First Aid, Manual Handling, Asbestos Awareness
    { id: "ucert-027", uploadedBy: "user-008", category: "First Aid", title: "FA-RH-2025-088", fileUrl: "2027-07-05" },
    { id: "ucert-028", uploadedBy: "user-008", category: "Manual Handling", title: "MH-RH-2025-019", fileUrl: "2027-10-12" },
    { id: "ucert-029", uploadedBy: "user-008", category: "Asbestos Awareness", title: "AA-RH-2025-041", fileUrl: "2027-04-30" },
  ]

  for (const c of userCerts) {
    await prisma.document.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        companyId: company.id,
        jobId: null,
        category: c.category,
        title: c.title,
        fileUrl: c.fileUrl,
        uploadedBy: c.uploadedBy,
      },
    })
  }

  // Timesheets — 3 weeks for 4 users
  const monday1 = new Date("2026-03-02") // Week 1 (all APPROVED)
  const monday2 = new Date("2026-03-09") // Week 2 (2 APPROVED, 2 SUBMITTED)
  const monday3 = new Date("2026-03-16") // Week 3 (2 DRAFT, 2 not started) — current week

  const timesheetData = [
    // Week 1 — all APPROVED
    { id: "ts-001", userId: "user-001", weekStart: monday1, status: "APPROVED" as const },
    { id: "ts-002", userId: "user-003", weekStart: monday1, status: "APPROVED" as const },
    { id: "ts-003", userId: "user-004", weekStart: monday1, status: "APPROVED" as const },
    { id: "ts-004", userId: "user-006", weekStart: monday1, status: "APPROVED" as const },

    // Week 2 — 2 APPROVED, 2 SUBMITTED
    { id: "ts-005", userId: "user-001", weekStart: monday2, status: "APPROVED" as const },
    { id: "ts-006", userId: "user-003", weekStart: monday2, status: "APPROVED" as const },
    { id: "ts-007", userId: "user-004", weekStart: monday2, status: "SUBMITTED" as const },
    { id: "ts-008", userId: "user-006", weekStart: monday2, status: "SUBMITTED" as const },

    // Week 3 — 2 DRAFT
    { id: "ts-009", userId: "user-001", weekStart: monday3, status: "DRAFT" as const },
    { id: "ts-010", userId: "user-003", weekStart: monday3, status: "DRAFT" as const },
  ]

  for (const ts of timesheetData) {
    await prisma.timesheet.upsert({
      where: { id: ts.id },
      update: {},
      create: ts,
    })
  }

  // Timesheet entries — realistic hours
  const tsEntries = [
    // ts-001: James Morrison, Week 1, job-001 + job-006
    ...generateWeekEntries("ts-001", "job-001", monday1, [8, 8, 8, 8, 8, 0, 0]),
    ...generateWeekEntries("ts-001", "job-006", monday1, [0, 0, 0, 0, 0, 0, 0], 1, [1, 1.5, 0, 1, 0, 0, 0]),

    // ts-002: Mike O'Brien, Week 1, job-001 + job-002
    ...generateWeekEntries("ts-002", "job-001", monday1, [8, 4, 8, 8, 4, 0, 0]),
    ...generateWeekEntries("ts-002", "job-002", monday1, [0, 4, 0, 0, 4, 0, 0]),

    // ts-003: Dave Wilson, Week 1, job-001 + job-005 + job-006
    ...generateWeekEntries("ts-003", "job-001", monday1, [8, 8, 0, 0, 8, 0, 0]),
    ...generateWeekEntries("ts-003", "job-005", monday1, [0, 0, 8, 8, 0, 0, 0]),
    ...generateWeekEntries("ts-003", "job-006", monday1, [0, 0, 0, 0, 0, 4, 0]),

    // ts-004: Tom Richards, Week 1, job-002
    ...generateWeekEntries("ts-004", "job-002", monday1, [9, 8.5, 9, 8, 8.5, 0, 0]),

    // ts-005: James, Week 2, job-001
    ...generateWeekEntries("ts-005", "job-001", monday2, [8, 8, 8, 8, 8, 0, 0]),

    // ts-006: Mike, Week 2, job-001 + job-006
    ...generateWeekEntries("ts-006", "job-001", monday2, [8, 8, 4, 8, 8, 0, 0]),
    ...generateWeekEntries("ts-006", "job-006", monday2, [0, 0, 4, 0, 0, 0, 0]),

    // ts-007: Dave, Week 2, job-001 + job-005
    ...generateWeekEntries("ts-007", "job-001", monday2, [8, 8, 8, 0, 0, 0, 0]),
    ...generateWeekEntries("ts-007", "job-005", monday2, [0, 0, 0, 9, 8.5, 4, 0]),

    // ts-008: Tom, Week 2, job-002
    ...generateWeekEntries("ts-008", "job-002", monday2, [8, 9.5, 8, 8, 9, 0, 0]),

    // ts-009: James, Week 3, job-001 (current week, draft)
    ...generateWeekEntries("ts-009", "job-001", monday3, [8, 8, 0, 0, 0, 0, 0]),

    // ts-010: Mike, Week 3, job-001 + job-002
    ...generateWeekEntries("ts-010", "job-001", monday3, [4, 8, 0, 0, 0, 0, 0]),
    ...generateWeekEntries("ts-010", "job-002", monday3, [4, 0, 0, 0, 0, 0, 0]),
  ]

  let entryCounter = 0
  for (const entry of tsEntries) {
    if (entry.hours === 0) continue
    entryCounter++
    const entryId = `tse-${String(entryCounter).padStart(3, "0")}`
    await prisma.timesheetEntry.upsert({
      where: { id: entryId },
      update: {},
      create: {
        id: entryId,
        timesheetId: entry.timesheetId,
        jobId: entry.jobId,
        date: entry.date,
        hoursNormal: Math.min(entry.hours, 8),
        hoursOvertime: Math.max(0, entry.hours - 8),
        travel: false,
        notes: null,
      },
    })
  }

  // Documents — 20 documents across 4 jobs
  const jobDocuments = [
    // Drawings (5)
    { id: "doc-001", jobId: "job-001", category: "Drawings", title: "Ground Floor Plan Rev C", uploadedBy: "user-003", createdAt: new Date("2026-01-10") },
    { id: "doc-002", jobId: "job-001", category: "Drawings", title: "First Floor Plan Rev B", uploadedBy: "user-003", createdAt: new Date("2026-01-10") },
    { id: "doc-003", jobId: "job-002", category: "Drawings", title: "Floor 12 Layout — Partition Plan", uploadedBy: "user-007", createdAt: new Date("2025-10-15") },
    { id: "doc-004", jobId: "job-002", category: "Drawings", title: "M&E Services Coordination Drawing", uploadedBy: "user-007", createdAt: new Date("2025-11-01") },
    { id: "doc-005", jobId: "job-005", category: "Drawings", title: "Plot 1-3 Elevations Rev D", uploadedBy: "user-007", createdAt: new Date("2025-08-20") },

    // Specifications (3)
    { id: "doc-006", jobId: "job-001", category: "Specifications", title: "Electrical Specification", uploadedBy: "user-003", createdAt: new Date("2026-01-05") },
    { id: "doc-007", jobId: "job-002", category: "Specifications", title: "HVAC Performance Specification", uploadedBy: "user-007", createdAt: new Date("2025-10-01") },
    { id: "doc-008", jobId: "job-005", category: "Specifications", title: "External Materials Specification", uploadedBy: "user-007", createdAt: new Date("2025-08-15") },

    // Contracts (2)
    { id: "doc-009", jobId: "job-001", category: "Contracts", title: "JCT Contract Signed", uploadedBy: "user-001", createdAt: new Date("2025-12-20") },
    { id: "doc-010", jobId: "job-002", category: "Contracts", title: "JCT Design & Build Contract", uploadedBy: "user-001", createdAt: new Date("2025-10-01") },

    // Correspondence (3)
    { id: "doc-011", jobId: "job-001", category: "Correspondence", title: "Site Meeting Minutes 07-03", uploadedBy: "user-003", createdAt: new Date("2026-03-07") },
    { id: "doc-012", jobId: "job-002", category: "Correspondence", title: "Architect's Instruction AI-012", uploadedBy: "user-007", createdAt: new Date("2026-02-15") },
    { id: "doc-013", jobId: "job-005", category: "Correspondence", title: "NHBC Inspection Report Feb 2026", uploadedBy: "user-004", createdAt: new Date("2026-02-20") },

    // Health & Safety (3)
    { id: "doc-014", jobId: "job-001", category: "Health & Safety", title: "RAMS — Working at Height", uploadedBy: "user-004", createdAt: new Date("2026-02-01") },
    { id: "doc-015", jobId: "job-002", category: "Health & Safety", title: "Construction Phase Plan Rev 3", uploadedBy: "user-006", createdAt: new Date("2025-11-01") },
    { id: "doc-016", jobId: "job-005", category: "Health & Safety", title: "Site Traffic Management Plan", uploadedBy: "user-004", createdAt: new Date("2025-09-01") },

    // Photos (2)
    { id: "doc-017", jobId: "job-001", category: "Photos", title: "Progress Photos Week 8", uploadedBy: "user-004", createdAt: new Date("2026-03-12") },
    { id: "doc-018", jobId: "job-006", category: "Photos", title: "Strip Out Complete — Before & After", uploadedBy: "user-004", createdAt: new Date("2026-02-10") },

    // Financial (2)
    { id: "doc-019", jobId: "job-002", category: "Financial", title: "Valuation 2 — Interim Certificate", uploadedBy: "user-001", createdAt: new Date("2026-02-28") },
    { id: "doc-020", jobId: "job-005", category: "Financial", title: "Cost Tracker March 2026", uploadedBy: "user-001", createdAt: new Date("2026-03-01") },
  ]

  for (const doc of jobDocuments) {
    await prisma.document.upsert({
      where: { id: doc.id },
      update: {},
      create: {
        id: doc.id,
        companyId: company.id,
        jobId: doc.jobId,
        category: doc.category,
        title: doc.title,
        fileUrl: null,
        uploadedBy: doc.uploadedBy,
        createdAt: doc.createdAt,
      },
    })
  }

  console.log("✅ Seed complete!")
  console.log(`   Company: ${company.name}`)
  console.log(`   Users: ${users.length} (with CSCS data)`)
  console.log(`   Jobs: ${jobs.length}`)
  console.log(`   Phases: ${phases.length} (including 5 new for Warehouse Conversion)`)
  console.log(`   Daily Logs: ${dailyLogs.length} (including 15 additional CW2 entries)`)
  console.log(`   Estimates: ${estimates.length} + 4 CW3 estimates with sections/items`)
  console.log(`   Subcontractors: ${subcontractors.length}`)
  console.log(`   Certs: ${certs.length}`)
  console.log(`   Subcontract Orders: ${subOrders.length}`)
  console.log(`   Sales Invoices: ${salesInvoices.length}`)
  // ── Notifications ──
  const notificationsData = [
    { id: "notif-001", userId: "user-001", type: "invoice_overdue", title: "Invoice Overdue", message: "Invoice INV-2026-003 is overdue by 15 days — £24,000 from Meridian Capital Partners", read: false, actionUrl: "/dashboard/finance/invoices", createdAt: new Date("2026-03-14T09:15:00") },
    { id: "notif-002", userId: "user-001", type: "cert_expiring", title: "CSCS Card Expiring", message: "CSCS card for Dave Wilson expires in 12 days — renew before 27 March 2026", read: false, actionUrl: "/dashboard/team/user-004", createdAt: new Date("2026-03-14T08:30:00") },
    { id: "notif-003", userId: "user-001", type: "timesheet_submitted", title: "Timesheet Submitted", message: "Mike O'Brien submitted timesheet for week of 3 March 2026 — awaiting your approval", read: false, actionUrl: "/dashboard/team/timesheets", createdAt: new Date("2026-03-13T17:45:00") },
    { id: "notif-004", userId: "user-001", type: "incident_reported", title: "Incident Reported", message: "New near-miss incident reported on Riverside Office Fit-Out by Tom Richards", read: false, actionUrl: "/dashboard/safety/incidents", createdAt: new Date("2026-03-13T14:20:00") },
    { id: "notif-005", userId: "user-001", type: "snag_assigned", title: "Snag Assigned", message: "Snag item 'Cracked tile in reception area' assigned to you on Victoria School Extension", read: false, actionUrl: "/dashboard/snagging", createdAt: new Date("2026-03-13T11:00:00") },
    { id: "notif-006", userId: "user-001", type: "estimate_declined", title: "Estimate Declined", message: "Estimate EST-2026-004 for Warehouse Conversion was declined by the client", read: true, actionUrl: "/dashboard/estimates", createdAt: new Date("2026-03-12T16:30:00") },
    { id: "notif-007", userId: "user-001", type: "invoice_overdue", title: "Invoice Overdue", message: "Invoice INV-2026-005 is overdue by 8 days — £12,500 from Mr & Mrs Patterson", read: true, actionUrl: "/dashboard/finance/invoices", createdAt: new Date("2026-03-12T09:00:00") },
    { id: "notif-008", userId: "user-001", type: "document_uploaded", title: "Document Uploaded", message: "Emma Clarke uploaded 'Structural Engineer Report v2' to Canary Wharf Office Fit-Out", read: true, actionUrl: "/dashboard/documents", createdAt: new Date("2026-03-11T15:20:00") },
    { id: "notif-009", userId: "user-001", type: "job_status", title: "Job Status Changed", message: "Southend Seafront Restaurant Fit-Out moved to Practical Completion", read: true, actionUrl: "/dashboard/jobs/job-007", createdAt: new Date("2026-03-11T10:45:00") },
    { id: "notif-010", userId: "user-001", type: "cert_expiring", title: "Insurance Expiring", message: "Public Liability insurance for Apex Electrical Services expires in 21 days", read: true, actionUrl: "/dashboard/subcontractors", createdAt: new Date("2026-03-10T14:00:00") },
    { id: "notif-011", userId: "user-001", type: "timesheet_submitted", title: "Timesheet Submitted", message: "Ryan Hughes submitted timesheet for week of 3 March 2026", read: false, actionUrl: "/dashboard/team/timesheets", createdAt: new Date("2026-03-10T17:30:00") },
    { id: "notif-012", userId: "user-001", type: "snag_assigned", title: "Snag Resolved", message: "Snag 'Paint defect corridor B2' on Romford New Build marked as resolved by Dave Wilson", read: true, actionUrl: "/dashboard/snagging", createdAt: new Date("2026-03-10T11:15:00") },
  ]

  for (const n of notificationsData) {
    await prisma.notification.upsert({
      where: { id: n.id },
      update: {},
      create: n,
    })
  }

  // ── Audit Logs ──
  const auditLogsData = [
    { id: "audit-001", companyId: company.id, userId: "user-001", action: "created", entity: "Invoice", entityId: "inv-001", details: { number: "INV-2026-001" }, createdAt: new Date("2026-03-14T10:00:00") },
    { id: "audit-002", companyId: company.id, userId: "user-003", action: "updated", entity: "Job", entityId: "job-001", details: { field: "status" }, createdAt: new Date("2026-03-14T09:30:00") },
    { id: "audit-003", companyId: company.id, userId: "user-002", action: "submitted", entity: "Estimate", entityId: "est-001", details: { number: "EST-2026-001" }, createdAt: new Date("2026-03-13T16:00:00") },
    { id: "audit-004", companyId: company.id, userId: "user-004", action: "reported", entity: "Incident", entityId: "inc-001", details: { severity: "NEAR_MISS" }, createdAt: new Date("2026-03-13T14:20:00") },
    { id: "audit-005", companyId: company.id, userId: "user-007", action: "uploaded", entity: "Document", entityId: "doc-001", details: { title: "Structural Report" }, createdAt: new Date("2026-03-13T11:45:00") },
    { id: "audit-006", companyId: company.id, userId: "user-003", action: "approved", entity: "Timesheet", entityId: "ts-001", details: { week: "24 Feb" }, createdAt: new Date("2026-03-12T15:00:00") },
    { id: "audit-007", companyId: company.id, userId: "user-005", action: "sent", entity: "Invoice", entityId: "inv-002", details: { number: "INV-2026-006" }, createdAt: new Date("2026-03-12T10:30:00") },
    { id: "audit-008", companyId: company.id, userId: "user-001", action: "created", entity: "Job", entityId: "job-009", details: { title: "New Project" }, createdAt: new Date("2026-03-11T09:00:00") },
    { id: "audit-009", companyId: company.id, userId: "user-006", action: "resolved", entity: "SnagItem", entityId: "snag-001", details: { description: "Paint defect" }, createdAt: new Date("2026-03-11T14:00:00") },
    { id: "audit-010", companyId: company.id, userId: "user-008", action: "created", entity: "Estimate", entityId: "est-005", details: { number: "EST-2026-005" }, createdAt: new Date("2026-03-10T11:00:00") },
  ]

  for (const a of auditLogsData) {
    await prisma.auditLog.upsert({
      where: { id: a.id },
      update: {},
      create: a,
    })
  }

  console.log(`   Purchase Invoices: ${purchaseInvoices.length}`)
  console.log(`   CIS Deductions: ${cisDeductions.length}`)
  console.log(`   Valuations: ${valuations.length}`)
  console.log(`   Cash Flow Forecasts: ${cashFlowForecasts.length}`)
  console.log(`   RAMS: ${ramsData.length}`)
  console.log(`   Incidents: ${incidentsData.length}`)
  console.log(`   Inductions: ${inductionsData.length}`)
  console.log(`   Snag Lists: ${snagListsData.length}`)
  console.log(`   Snag Items: ${snagItemsData.length}`)
  console.log(`   User Certs: ${userCerts.length}`)
  console.log(`   Timesheets: ${timesheetData.length}`)
  console.log(`   Timesheet Entries: ${entryCounter}`)
  console.log(`   Documents: ${jobDocuments.length}`)
  console.log(`   Notifications: ${notificationsData.length}`)
  console.log(`   Audit Logs: ${auditLogsData.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
