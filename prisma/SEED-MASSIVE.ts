// MASSIVE DEMO DATA SEED FOR BUILDFLOW
// Run with: npx prisma db seed

import { PrismaClient } from "@prisma/client"
import bcryptjs from "bcryptjs"

const prisma = new PrismaClient()

const passwordHash = await bcryptjs.hash("BuildFlow2026!", 12)

// Helper: Generate week timesheet entries
function generateWeekEntries(timesheetId: string, jobId: string, monday: Date, hours: number[]) {
  const entries: { timesheetId: string; jobId: string; date: Date; hours: number }[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    if (hours[i] > 0) {
      entries.push({ timesheetId, jobId, date: d, hours: hours[i] })
    }
  }
  return entries
}

async function main() {
  console.log("🌱 Seeding BuildFlow with MASSIVE demo data...")

  // ========================================
  // 1. COMPANY
  // ========================================
  const company = await prisma.company.upsert({
    where: { id: "demo-company-001" },
    update: {},
    create: {
      id: "demo-company-001",
      name: "BuildFlow Construction Ltd",
      registrationNumber: "12345678",
      vatNumber: "GB987654321",
      cisUtr: "1234567890",
      address: "Unit 7, Riverside Business Park, Chelmsford, Essex CM1 1AB",
      subscriptionPlan: "business",
    },
  })

  // ========================================
  // 2. USERS (12 team members)
  // ========================================
  const users = [
    { id: "user-001", name: "James Morrison", email: "james@buildflow.demo", role: "DIRECTOR" as const, phone: "07700 900001", cscsNumber: "CSCS-JM-001234", cscsExpiry: new Date("2027-09-15") },
    { id: "user-002", name: "Sarah Chen", email: "sarah@buildflow.demo", role: "ESTIMATOR" as const, phone: "07700 900002", cscsNumber: "CSCS-SC-005678", cscsExpiry: new Date("2026-04-10") },
    { id: "user-003", name: "Mike O'Brien", email: "mike@buildflow.demo", role: "PROJECT_MANAGER" as const, phone: "07700 900003", cscsNumber: "CSCS-MOB-009012", cscsExpiry: new Date("2028-01-20") },
    { id: "user-004", name: "Dave Wilson", email: "dave@buildflow.demo", role: "SITE_MANAGER" as const, phone: "07700 900004", cscsNumber: "CSCS-DW-003456", cscsExpiry: new Date("2027-06-30") },
    { id: "user-005", name: "Lisa Patel", email: "lisa@buildflow.demo", role: "OFFICE_ADMIN" as const, phone: "07700 900005", cscsNumber: null, cscsExpiry: null },
    { id: "user-006", name: "Tom Richards", email: "tom@buildflow.demo", role: "SITE_MANAGER" as const, phone: "07700 900006", cscsNumber: "CSCS-TR-007890", cscsExpiry: new Date("2025-11-01") },
    { id: "user-007", name: "Emma Clarke", email: "emma@buildflow.demo", role: "PROJECT_MANAGER" as const, phone: "07700 900007", cscsNumber: "CSCS-EC-002345", cscsExpiry: new Date("2027-12-15") },
    { id: "user-008", name: "Ryan Hughes", email: "ryan@buildflow.demo", role: "ESTIMATOR" as const, phone: "07700 900008", cscsNumber: "CSCS-RH-006789", cscsExpiry: new Date("2028-03-01") },
    { id: "user-009", name: "Sophie Turner", email: "sophie@buildflow.demo", role: "SITE_MANAGER" as const, phone: "07700 900009", cscsNumber: "CSCS-ST-004512", cscsExpiry: new Date("2027-08-20") },
    { id: "user-010", name: "Ben Jackson", email: "ben@buildflow.demo", role: "PROJECT_MANAGER" as const, phone: "07700 900010", cscsNumber: "CSCS-BJ-008901", cscsExpiry: new Date("2027-11-10") },
    { id: "user-011", name: "Rachel Green", email: "rachel@buildflow.demo", role: "ESTIMATOR" as const, phone: "07700 900011", cscsNumber: "CSCS-RG-003344", cscsExpiry: new Date("2028-02-14") },
    { id: "user-012", name: "Chris Brown", email: "chris@buildflow.demo", role: "SITE_MANAGER" as const, phone: "07700 900012", cscsNumber: "CSCS-CB-007766", cscsExpiry: new Date("2027-05-25") },
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
        cscsNumber: u.cscsNumber,
        cscsExpiry: u.cscsExpiry,
      },
    })
  }

  console.log(`✓ Created ${users.length} team members`)

  // ========================================
  // 3. JOBS (55 realistic UK construction jobs)
  // ========================================
  
  const jobs = [
    // LIVE JOBS (20)
    { id: "job-001", reference: "BF-2026-001", title: "Victoria Road Rear Extension", clientName: "Mr & Mrs Patterson", clientEmail: "patterson@email.com", clientPhone: "01245 123456", siteAddress: "42 Victoria Road, Chelmsford", sitePostcode: "CM1 3PA", lat: 51.7356, lng: 0.4685, status: "LIVE" as const, sector: "Residential", contractValue: 185000, startDate: new Date("2026-01-15"), endDate: new Date("2026-06-30"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-003" },
    { id: "job-002", reference: "BF-2026-002", title: "Canary Wharf Office Fit-Out", clientName: "Meridian Capital Partners", clientEmail: "facilities@meridian.co.uk", clientPhone: "020 7123 4567", siteAddress: "Level 12, One Canada Square, Canary Wharf", sitePostcode: "E14 5AB", lat: 51.5049, lng: -0.0187, status: "LIVE" as const, sector: "Commercial", contractValue: 2450000, startDate: new Date("2025-11-01"), endDate: new Date("2026-08-31"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-007" },
    { id: "job-005", reference: "BF-2026-005", title: "Romford New Build — 6 Detached Houses", clientName: "Havering Land Ltd", clientEmail: "projects@haveringland.co.uk", clientPhone: "01708 765432", siteAddress: "Former Nursery Site, North Street, Romford", sitePostcode: "RM1 1BA", lat: 51.5753, lng: 0.1835, status: "LIVE" as const, sector: "Residential", contractValue: 1200000, startDate: new Date("2025-09-01"), endDate: new Date("2026-09-30"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-007" },
    { id: "job-006", reference: "BF-2026-006", title: "Brentwood High Street Shop Conversion", clientName: "Brentwood Retail Partners", clientEmail: "info@brp.co.uk", clientPhone: "01277 234567", siteAddress: "14-16 High Street, Brentwood", sitePostcode: "CM14 4AB", lat: 51.6214, lng: 0.3051, status: "LIVE" as const, sector: "Commercial", contractValue: 95000, startDate: new Date("2026-02-01"), endDate: new Date("2026-04-30"), retentionPercent: 3, defectsPeriodMonths: 6, pmId: "user-003" },
    { id: "job-011", reference: "BF-2026-011", title: "Epping Forest Swimming Pool Refurb", clientName: "Epping Forest DC", clientEmail: "leisure@eppingforestdc.gov.uk", clientPhone: "020 8508 4200", siteAddress: "Epping Sports Centre, Hemnall Street", sitePostcode: "CM16 4LU", lat: 51.6974, lng: 0.1104, status: "LIVE" as const, sector: "Leisure", contractValue: 680000, startDate: new Date("2026-01-10"), endDate: new Date("2026-07-31"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-010" },
    { id: "job-012", reference: "BF-2026-012", title: "Barking Care Home Extension", clientName: "Barking Care Group", clientEmail: "projects@barkingcare.co.uk", clientPhone: "020 8594 3456", siteAddress: "Riverside Care Home, River Road, Barking", sitePostcode: "IG11 0HG", lat: 51.5373, lng: 0.0786, status: "LIVE" as const, sector: "Healthcare", contractValue: 420000, startDate: new Date("2025-12-01"), endDate: new Date("2026-06-30"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-003" },
    { id: "job-013", reference: "BF-2026-013", title: "Harlow Industrial Unit — New Build", clientName: "Harlow Enterprise Zone", clientEmail: "development@harlowez.co.uk", clientPhone: "01279 446655", siteAddress: "Plot 7B, Edinburgh Way, Harlow", sitePostcode: "CM20 2NQ", lat: 51.7639, lng: 0.1198, status: "LIVE" as const, sector: "Industrial", contractValue: 1150000, startDate: new Date("2025-10-01"), endDate: new Date("2026-08-31"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-007" },
    { id: "job-014", reference: "BF-2026-014", title: "Ilford Mosque Extension", clientName: "Ilford Islamic Centre", clientEmail: "admin@ilfordislamic.org", clientPhone: "020 8478 5555", siteAddress: "125 Ilford Lane, Ilford", sitePostcode: "IG1 2RJ", lat: 51.5619, lng: 0.0722, status: "LIVE" as const, sector: "Community", contractValue: 320000, startDate: new Date("2026-02-10"), endDate: new Date("2026-09-15"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-003" },
    { id: "job-015", reference: "BF-2026-015", title: "Chigwell Detached House — New Build", clientName: "Mr Simon Davies", clientEmail: "simon.davies@email.com", clientPhone: "020 8500 1234", siteAddress: "Plot A, Manor Road, Chigwell", sitePostcode: "IG7 5BL", lat: 51.6178, lng: 0.0788, status: "LIVE" as const, sector: "Residential", contractValue: 550000, startDate: new Date("2026-01-05"), endDate: new Date("2026-11-30"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-010" },
    { id: "job-016", reference: "BF-2026-016", title: "Basildon Retail Park Roofing", clientName: "Eastgate Shopping Centre", clientEmail: "maintenance@eastgate.co.uk", clientPhone: "01268 533200", siteAddress: "Eastgate Shopping Centre, Basildon", sitePostcode: "SS14 1AE", lat: 51.5762, lng: 0.4885, status: "LIVE" as const, sector: "Commercial", contractValue: 190000, startDate: new Date("2026-03-01"), endDate: new Date("2026-05-31"), retentionPercent: 3, defectsPeriodMonths: 6, pmId: "user-009" },
    { id: "job-017", reference: "BF-2026-017", title: "Walthamstow Stadium Conversion", clientName: "Walthamstow Development Corp", clientEmail: "projects@walthamstowdev.co.uk", clientPhone: "020 8496 3000", siteAddress: "Chingford Road, Walthamstow", sitePostcode: "E17 5FJ", lat: 51.5911, lng: -0.0235, status: "LIVE" as const, sector: "Mixed Use", contractValue: 3200000, startDate: new Date("2025-08-01"), endDate: new Date("2027-03-31"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-007" },
    { id: "job-018", reference: "BF-2026-018", title: "Dagenham Primary School — Classroom Block", clientName: "Barking & Dagenham Council", clientEmail: "education.projects@lbbd.gov.uk", clientPhone: "020 8227 2000", siteAddress: "Riverside Primary School, Marsh Way, Dagenham", sitePostcode: "RM10 8AD", lat: 51.5389, lng: 0.1502, status: "LIVE" as const, sector: "Education", contractValue: 890000, startDate: new Date("2026-04-01"), endDate: new Date("2026-12-20"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-010" },
    { id: "job-019", reference: "BF-2026-019", title: "Grays Town Centre Regeneration Ph1", clientName: "Thurrock Council", clientEmail: "regeneration@thurrock.gov.uk", clientPhone: "01375 652000", siteAddress: "High Street, Grays", sitePostcode: "RM17 6LU", lat: 51.4764, lng: 0.3259, status: "LIVE" as const, sector: "Commercial", contractValue: 1750000, startDate: new Date("2025-11-15"), endDate: new Date("2026-10-31"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-007" },
    { id: "job-020", reference: "BF-2026-020", title: "Enfield Warehouse Conversion to Flats", clientName: "Enfield Properties Ltd", clientEmail: "info@enfieldprop.co.uk", clientPhone: "020 8363 4000", siteAddress: "Unit 12, Montagu Industrial Estate, Edmonton", sitePostcode: "N18 2XY", lat: 51.6169, lng: -0.0648, status: "LIVE" as const, sector: "Residential", contractValue: 1450000, startDate: new Date("2025-10-01"), endDate: new Date("2026-12-31"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-010" },
    { id: "job-021", reference: "BF-2026-021", title: "Chelmsford City Hospital Extension", clientName: "Mid Essex Hospital Trust", clientEmail: "estates@meht.nhs.uk", clientPhone: "01245 514000", siteAddress: "Broomfield Hospital, Court Road, Chelmsford", sitePostcode: "CM1 7ET", lat: 51.7534, lng: 0.4846, status: "LIVE" as const, sector: "Healthcare", contractValue: 2800000, startDate: new Date("2025-09-01"), endDate: new Date("2027-02-28"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-007" },
    { id: "job-022", reference: "BF-2026-022", title: "Redbridge Fire Station — Refurbishment", clientName: "London Fire Brigade", clientEmail: "estates@london-fire.gov.uk", clientPhone: "020 8555 1200", siteAddress: "Forest Road, Ilford", sitePostcode: "IG6 3HP", lat: 51.5936, lng: 0.0841, status: "LIVE" as const, sector: "Public Sector", contractValue: 540000, startDate: new Date("2026-02-01"), endDate: new Date("2026-08-31"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-003" },
    { id: "job-023", reference: "BF-2026-023", title: "Brentwood Theatre Backstage Extension", clientName: "Brentwood Arts Trust", clientEmail: "hello@brentwoodarts.org", clientPhone: "01277 200305", siteAddress: "Brentwood Theatre, Shenfield Road", sitePostcode: "CM15 8AG", lat: 51.6204, lng: 0.3020, status: "LIVE" as const, sector: "Arts & Culture", contractValue: 380000, startDate: new Date("2026-01-20"), endDate: new Date("2026-07-15"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-009" },
    { id: "job-024", reference: "BF-2026-024", title: "Colchester Riverside Apartments — Ph2", clientName: "Colchester Developments Ltd", clientEmail: "projects@colchdev.co.uk", clientPhone: "01206 561200", siteAddress: "Riverside Quarter, Colchester", sitePostcode: "CO2 8HT", lat: 51.8847, lng: 0.8987, status: "LIVE" as const, sector: "Residential", contractValue: 2950000, startDate: new Date("2025-07-01"), endDate: new Date("2027-01-31"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-007" },
    { id: "job-025", reference: "BF-2026-025", title: "Rainham Logistics Hub — New Build", clientName: "Gateway Logistics PLC", clientEmail: "construction@gatewaylogistics.com", clientPhone: "01708 555600", siteAddress: "Ferry Lane, Rainham", sitePostcode: "RM13 9YY", lat: 51.5149, lng: 0.1865, status: "LIVE" as const, sector: "Industrial", contractValue: 4500000, startDate: new Date("2025-06-01"), endDate: new Date("2026-12-31"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-007" },

    // WON (Upcoming start) — 8 jobs
    { id: "job-003", reference: "BF-2026-003", title: "Chelmsford Academy Science Block Refurb", clientName: "Essex County Council", clientEmail: "estates@essex.gov.uk", clientPhone: "0345 743 0430", siteAddress: "Chelmsford Academy, Lawn Lane", sitePostcode: "CM1 7LT", lat: 51.7293, lng: 0.4543, status: "WON" as const, sector: "Education", contractValue: 890000, startDate: new Date("2026-07-01"), endDate: new Date("2026-12-20"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-003" },
    { id: "job-026", reference: "BF-2026-026", title: "Loughton Community Centre", clientName: "Epping Forest DC", clientEmail: "community@eppingforestdc.gov.uk", clientPhone: "020 8508 4200", siteAddress: "Borders Lane, Loughton", sitePostcode: "IG10 3SA", lat: 51.6493, lng: 0.0743, status: "WON" as const, sector: "Community", contractValue: 420000, startDate: new Date("2026-08-01"), endDate: new Date("2027-02-28"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-010" },
    { id: "job-027", reference: "BF-2026-027", title: "Witham Medical Centre Extension", clientName: "Witham Health Trust", clientEmail: "estates@withamhealth.nhs.uk", clientPhone: "01376 512000", siteAddress: "Collingwood Road, Witham", sitePostcode: "CM8 2TT", lat: 51.7998, lng: 0.6360, status: "WON" as const, sector: "Healthcare", contractValue: 680000, startDate: new Date("2026-06-01"), endDate: new Date("2026-12-31"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-003" },
    { id: "job-028", reference: "BF-2026-028", title: "Chelmsford Office Park — Unit 3", clientName: "Essex Business Parks Ltd", clientEmail: "lettings@essexbp.co.uk", clientPhone: "01245 467200", siteAddress: "Parkway Industrial Estate, Chelmsford", sitePostcode: "CM2 7PX", lat: 51.7177, lng: 0.5024, status: "WON" as const, sector: "Commercial", contractValue: 950000, startDate: new Date("2026-09-01"), endDate: new Date("2027-04-30"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-007" },
    { id: "job-029", reference: "BF-2026-029", title: "Epping Station Car Park Extension", clientName: "Transport for London", clientEmail: "property@tfl.gov.uk", clientPhone: "0343 222 1234", siteAddress: "Epping Underground Station", sitePostcode: "CM16 4HW", lat: 51.6936, lng: 0.1140, status: "WON" as const, sector: "Transport", contractValue: 780000, startDate: new Date("2026-10-01"), endDate: new Date("2027-03-31"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-010" },
    { id: "job-030", reference: "BF-2026-030", title: "Clacton Pavilion — Restoration", clientName: "Tendring District Council", clientEmail: "heritage@tendring.gov.uk", clientPhone: "01255 686000", siteAddress: "Clacton Pier Approach", sitePostcode: "CO15 1QX", lat: 51.7895, lng: 1.1526, status: "WON" as const, sector: "Heritage", contractValue: 1200000, startDate: new Date("2026-05-01"), endDate: new Date("2027-06-30"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-007" },
    { id: "job-031", reference: "BF-2026-031", title: "Braintree Retail Park — Phase 3", clientName: "Braintree Village", clientEmail: "development@braintreevillage.co.uk", clientPhone: "01376 348800", siteAddress: "Charter Way, Braintree", sitePostcode: "CM77 8YH", lat: 51.8784, lng: 0.5511, status: "WON" as const, sector: "Retail", contractValue: 1500000, startDate: new Date("2026-11-01"), endDate: new Date("2027-09-30"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-007" },
    { id: "job-032", reference: "BF-2026-032", title: "Southend Airport Terminal — Refurb", clientName: "London Southend Airport", clientEmail: "facilities@southendairport.com", clientPhone: "01702 538500", siteAddress: "Southend Airport, Eastwoodbury Crescent", sitePostcode: "SS2 6YF", lat: 51.5714, lng: 0.6956, status: "WON" as const, sector: "Transport", contractValue: 2100000, startDate: new Date("2026-08-01"), endDate: new Date("2027-05-31"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-007" },

    // TENDER (Bidding) — 12 jobs
    { id: "job-004", reference: "BF-2026-004", title: "Warehouse Conversion to Apartments", clientName: "Thames Gateway Developments", clientEmail: "info@tgd.co.uk", clientPhone: "01375 856123", siteAddress: "Unit 7, Port Road, Tilbury", sitePostcode: "RM18 7HQ", lat: 51.4621, lng: 0.3578, status: "TENDER" as const, sector: "Residential", contractValue: 420000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
    { id: "job-009", reference: "BF-2026-009", title: "Stratford Mixed-Use Development Ph2", clientName: "Olympic Legacy Developments", clientEmail: "pm@oldplc.co.uk", clientPhone: "020 8234 5678", siteAddress: "Plot B2, Queen Elizabeth Olympic Park", sitePostcode: "E20 2ST", lat: 51.5430, lng: -0.0164, status: "TENDER" as const, sector: "Mixed Use", contractValue: 1850000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
    { id: "job-033", reference: "BF-2026-033", title: "Waltham Abbey Leisure Centre", clientName: "Epping Forest DC", clientEmail: "leisure@eppingforestdc.gov.uk", clientPhone: "020 8508 4200", siteAddress: "Roundhills, Waltham Abbey", sitePostcode: "EN9 1PL", lat: 51.6874, lng: -0.0031, status: "TENDER" as const, sector: "Leisure", contractValue: 1750000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
    { id: "job-034", reference: "BF-2026-034", title: "Billericay Health Hub", clientName: "NHS Mid Essex CCG", clientEmail: "estates@midessexccg.nhs.uk", clientPhone: "01245 398000", siteAddress: "High Street, Billericay", sitePostcode: "CM12 9BD", lat: 51.6278, lng: 0.4188, status: "TENDER" as const, sector: "Healthcare", contractValue: 980000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
    { id: "job-035", reference: "BF-2026-035", title: "Upminster Station Plaza", clientName: "Havering Council", clientEmail: "regeneration@havering.gov.uk", clientPhone: "01708 434343", siteAddress: "Station Road, Upminster", sitePostcode: "RM14 2TU", lat: 51.5589, lng: 0.2509, status: "TENDER" as const, sector: "Public Realm", contractValue: 450000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
    { id: "job-036", reference: "BF-2026-036", title: "Lakeside Shopping Centre — West Wing", clientName: "intu Properties PLC", clientEmail: "leasing@intu.co.uk", clientPhone: "01708 869933", siteAddress: "West Thurrock Way, Grays", sitePostcode: "RM20 2ZP", lat: 51.4869, lng: 0.2832, status: "TENDER" as const, sector: "Retail", contractValue: 2800000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
    { id: "job-037", reference: "BF-2026-037", title: "Hornchurch Care Village", clientName: "Sanctuary Housing", clientEmail: "development@sanctuary-housing.co.uk", clientPhone: "01708 437800", siteAddress: "Suttons Lane, Hornchurch", sitePostcode: "RM12 6RD", lat: 51.5702, lng: 0.2182, status: "TENDER" as const, sector: "Residential Care", contractValue: 3200000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
    { id: "job-038", reference: "BF-2026-038", title: "Canvey Island Flood Defence", clientName: "Environment Agency", clientEmail: "thamesestuary@environment-agency.gov.uk", clientPhone: "0370 850 6506", siteAddress: "Canvey Island Seafront", sitePostcode: "SS8 7SX", lat: 51.5166, lng: 0.5797, status: "TENDER" as const, sector: "Infrastructure", contractValue: 1950000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
    { id: "job-039", reference: "BF-2026-039", title: "Saffron Walden Museum Extension", clientName: "Uttlesford DC", clientEmail: "museum@uttlesford.gov.uk", clientPhone: "01799 510333", siteAddress: "Museum Street, Saffron Walden", sitePostcode: "CB10 1JL", lat: 52.0227, lng: 0.2434, status: "TENDER" as const, sector: "Heritage", contractValue: 820000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
    { id: "job-040", reference: "BF-2026-040", title: "Laindon Community Library", clientName: "Essex County Council", clientEmail: "libraries@essex.gov.uk", clientPhone: "0345 603 7628", siteAddress: "High Road, Laindon", sitePostcode: "SS15 6LG", lat: 51.5775, lng: 0.4152, status: "TENDER" as const, sector: "Community", contractValue: 420000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
    { id: "job-041", reference: "BF-2026-041", title: "Romford Market Square Regeneration", clientName: "Havering Council", clientEmail: "regeneration@havering.gov.uk", clientPhone: "01708 434343", siteAddress: "Market Place, Romford", sitePostcode: "RM1 3AB", lat: 51.5779, lng: 0.1821, status: "TENDER" as const, sector: "Public Realm", contractValue: 1200000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
    { id: "job-042", reference: "BF-2026-042", title: "Basildon Arts Centre", clientName: "Basildon Council", clientEmail: "culture@basildon.gov.uk", clientPhone: "01268 533333", siteAddress: "Townsend Walk, Basildon", sitePostcode: "SS14 2FQ", lat: 51.5761, lng: 0.4875, status: "TENDER" as const, sector: "Arts & Culture", contractValue: 1600000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },

    // PRACTICAL_COMPLETION — 5 jobs
    { id: "job-007", reference: "BF-2026-007", title: "Southend Seafront Restaurant Fit-Out", clientName: "Coastal Dining Group", clientEmail: "dev@coastaldining.co.uk", clientPhone: "01702 345678", siteAddress: "The Arches, Marine Parade, Southend-on-Sea", sitePostcode: "SS1 2EJ", lat: 51.5360, lng: 0.7122, status: "PRACTICAL_COMPLETION" as const, sector: "Hospitality", contractValue: 310000, startDate: new Date("2025-06-01"), endDate: new Date("2025-12-15"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-007" },
    { id: "job-043", reference: "BF-2025-043", title: "Tilbury Community Centre", clientName: "Thurrock Council", clientEmail: "community@thurrock.gov.uk", clientPhone: "01375 652000", siteAddress: "Dock Road, Tilbury", sitePostcode: "RM18 7LF", lat: 51.4602, lng: 0.3643, status: "PRACTICAL_COMPLETION" as const, sector: "Community", contractValue: 480000, startDate: new Date("2025-03-01"), endDate: new Date("2025-11-30"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-003" },
    { id: "job-044", reference: "BF-2025-044", title: "Harold Hill Surgery Extension", clientName: "Havering Health Trust", clientEmail: "estates@haveringhealth.nhs.uk", clientPhone: "01708 503000", siteAddress: "Gooshays Drive, Harold Hill", sitePostcode: "RM3 9LA", lat: 51.6104, lng: 0.2226, status: "PRACTICAL_COMPLETION" as const, sector: "Healthcare", contractValue: 320000, startDate: new Date("2025-04-01"), endDate: new Date("2025-10-31"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-010" },
    { id: "job-045", reference: "BF-2025-045", title: "Brentwood School Sports Hall", clientName: "Brentwood School", clientEmail: "bursar@brentwoodschool.co.uk", clientPhone: "01277 243243", siteAddress: "Ingrave Road, Brentwood", sitePostcode: "CM15 8AS", lat: 51.6163, lng: 0.2949, status: "PRACTICAL_COMPLETION" as const, sector: "Education", contractValue: 890000, startDate: new Date("2025-01-15"), endDate: new Date("2025-11-30"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-007" },
    { id: "job-046", reference: "BF-2025-046", title: "Westcliff Library Refurbishment", clientName: "Southend-on-Sea BC", clientEmail: "libraries@southend.gov.uk", clientPhone: "01702 215000", siteAddress: "London Road, Westcliff-on-Sea", sitePostcode: "SS0 7JQ", lat: 51.5419, lng: 0.7021, status: "PRACTICAL_COMPLETION" as const, sector: "Community", contractValue: 250000, startDate: new Date("2025-05-01"), endDate: new Date("2025-10-15"), retentionPercent: 5, defectsPeriodMonths: 12, pmId: "user-009" },

    // FINAL_ACCOUNT — 3 jobs
    { id: "job-008", reference: "BF-2026-008", title: "Basildon Industrial Unit Roofing", clientName: "Basildon Properties Ltd", clientEmail: "maint@basildonprop.co.uk", clientPhone: "01268 567890", siteAddress: "Unit 23, Festival Business Park, Basildon", sitePostcode: "SS14 3WN", lat: 51.5761, lng: 0.4887, status: "FINAL_ACCOUNT" as const, sector: "Industrial", contractValue: 67000, startDate: new Date("2025-10-01"), endDate: new Date("2025-11-30"), retentionPercent: 5, defectsPeriodMonths: 6, pmId: "user-003" },
    { id: "job-047", reference: "BF-2025-047", title: "Chelmsford Office Interior Fit-Out", clientName: "Anglia Business Solutions", clientEmail: "premises@angliabiz.co.uk", clientPhone: "01245 261000", siteAddress: "Baddow Road, Chelmsford", sitePostcode: "CM2 0DG", lat: 51.7251, lng: 0.4792, status: "FINAL_ACCOUNT" as const, sector: "Commercial", contractValue: 185000, startDate: new Date("2025-07-01"), endDate: new Date("2025-10-31"), retentionPercent: 5, defectsPeriodMonths: 6, pmId: "user-007" },
    { id: "job-048", reference: "BF-2025-048", title: "Rainham Fire Station — Minor Works", clientName: "London Fire Brigade", clientEmail: "estates@london-fire.gov.uk", clientPhone: "020 8555 1200", siteAddress: "Upminster Road South, Rainham", sitePostcode: "RM13 9AA", lat: 51.5207, lng: 0.1908, status: "FINAL_ACCOUNT" as const, sector: "Public Sector", contractValue: 42000, startDate: new Date("2025-08-01"), endDate: new Date("2025-09-30"), retentionPercent: 3, defectsPeriodMonths: 6, pmId: "user-009" },

    // LOST — 7 jobs
    { id: "job-010", reference: "BF-2026-010", title: "Colchester Period Property Restoration", clientName: "Heritage Homes Trust", clientEmail: "hello@heritagehomes.org", clientPhone: "01206 789012", siteAddress: "The Old Rectory, High Street, Colchester", sitePostcode: "CO1 1PJ", lat: 51.8891, lng: 0.9014, status: "LOST" as const, sector: "Residential", contractValue: 340000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
    { id: "job-049", reference: "BF-2026-049", title: "Barking Riverside — Phase 7", clientName: "Barking Riverside Ltd", clientEmail: "tenders@barkingriverside.co.uk", clientPhone: "020 8724 5000", siteAddress: "Renwick Road, Barking", sitePostcode: "IG11 0FZ", lat: 51.5144, lng: 0.1102, status: "LOST" as const, sector: "Residential", contractValue: 4200000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
    { id: "job-050", reference: "BF-2026-050", title: "Brentwood Civic Offices Extension", clientName: "Brentwood Borough Council", clientEmail: "estates@brentwood.gov.uk", clientPhone: "01277 312500", siteAddress: "Town Hall, Ingrave Road, Brentwood", sitePostcode: "CM15 8AY", lat: 51.6162, lng: 0.3029, status: "LOST" as const, sector: "Public Sector", contractValue: 1200000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
    { id: "job-051", reference: "BF-2026-051", title: "Harlow Cycle Hub", clientName: "Harlow Council", clientEmail: "transport@harlow.gov.uk", clientPhone: "01279 446655", siteAddress: "Harlow Town Station", sitePostcode: "CM20 2DP", lat: 51.7693, lng: 0.0969, status: "LOST" as const, sector: "Transport", contractValue: 290000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
    { id: "job-052", reference: "BF-2026-052", title: "Loughton Library Extension", clientName: "Essex County Council", clientEmail: "libraries@essex.gov.uk", clientPhone: "0345 603 7628", siteAddress: "Traps Hill, Loughton", sitePostcode: "IG10 1HD", lat: 51.6460, lng: 0.0731, status: "LOST" as const, sector: "Community", contractValue: 380000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
    { id: "job-053", reference: "BF-2026-053", title: "Southend Pier — Walkway Repairs", clientName: "Southend-on-Sea BC", clientEmail: "pier@southend.gov.uk", clientPhone: "01702 215000", siteAddress: "Western Esplanade, Southend-on-Sea", sitePostcode: "SS1 2EL", lat: 51.5314, lng: 0.7165, status: "LOST" as const, sector: "Heritage", contractValue: 650000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
    { id: "job-054", reference: "BF-2026-054", title: "Dagenham Civic Square Paving", clientName: "Barking & Dagenham Council", clientEmail: "highways@lbbd.gov.uk", clientPhone: "020 8227 2000", siteAddress: "Rainham Road North, Dagenham", sitePostcode: "RM10 7UD", lat: 51.5471, lng: 0.1512, status: "LOST" as const, sector: "Public Realm", contractValue: 180000, startDate: null, endDate: null, retentionPercent: 5, defectsPeriodMonths: 12, pmId: null },
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

  console.log(`✓ Created ${jobs.length} jobs`)

  console.log("✅ Seed complete! Run with: npx prisma db push --force-reset && npx tsx prisma/SEED-MASSIVE.ts")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
