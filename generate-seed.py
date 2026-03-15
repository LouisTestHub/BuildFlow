#!/usr/bin/env python3
"""
Generate massive demo data seed for BuildFlow
Outputs TypeScript seed file with 50+ jobs, 100+ daily logs, 30+ estimates, etc.
"""

import json
from datetime import datetime, timedelta
import random

# UK construction company names, locations, project names
UK_LOCATIONS = [
    ("Chelmsford", "CM1", 51.7356, 0.4685),
    ("London Canary Wharf", "E14", 51.5049, -0.0187),
    ("Romford", "RM1", 51.5753, 0.1835),
    ("Brentwood", "CM14", 51.6214, 0.3051),
    ("Southend", "SS1", 51.5360, 0.7122),
    ("Basildon", "SS14", 51.5761, 0.4887),
    ("Colchester", "CO1", 51.8891, 0.9014),
    ("Harlow", "CM20", 51.7639, 0.1198),
    ("Barking", "IG11", 51.5373, 0.0786),
    ("Dagenham", "RM10", 51.5389, 0.1502),
    ("Ilford", "IG1", 51.5619, 0.0722),
    ("Grays", "RM17", 51.4764, 0.3259),
    ("Enfield", "N18", 51.6169, -0.0648),
    ("Walthamstow", "E17", 51.5911, -0.0235),
    ("Epping", "CM16", 51.6974, 0.1104),
    ("Loughton", "IG10", 51.6493, 0.0743),
    ("Witham", "CM8", 51.7998, 0.6360),
    ("Braintree", "CM77", 51.8784, 0.5511),
    ("Billericay", "CM12", 51.6278, 0.4188),
    ("Upminster", "RM14", 51.5589, 0.2509),
    ("Hornchurch", "RM12", 51.5702, 0.2182),
    ("Rainham", "RM13", 51.5149, 0.1865),
    ("Tilbury", "RM18", 51.4621, 0.3578),
    ("Canvey Island", "SS8", 51.5166, 0.5797),
    ("Saffron Walden", "CB10", 52.0227, 0.2434),
    ("Laindon", "SS15", 51.5775, 0.4152),
    ("Harold Hill", "RM3", 51.6104, 0.2226),
    ("Chigwell", "IG7", 51.6178, 0.0788),
    ("Waltham Abbey", "EN9", 51.6874, -0.0031),
    ("Clacton", "CO15", 51.7895, 1.1526),
]

PROJECT_TYPES = [
    ("Residential", ["Extension", "New Build", "Conversion", "Loft Conversion", "House", "Apartments"]),
    ("Commercial", ["Office Fit-Out", "Retail", "Shop Conversion", "Business Park", "Warehouse"]),
    ("Education", ["School", "Academy", "Science Block", "Sports Hall", "Classroom Block", "Library"]),
    ("Healthcare", ["Hospital Extension", "GP Surgery", "Care Home", "Medical Centre", "Health Hub"]),
    ("Industrial", ["Unit", "Warehouse", "Logistics Hub", "Factory", "Distribution Centre"]),
    ("Community", ["Community Centre", "Mosque", "Church", "Youth Centre", "Civic Offices"]),
    ("Leisure", ["Swimming Pool", "Sports Centre", "Gym", "Theatre", "Arts Centre"]),
    ("Infrastructure", ["Station", "Car Park", "Bridge", "Flood Defence", "Public Realm"]),
]

WEATHER = ["Dry", "Light rain", "Heavy rain", "Overcast", "Sunny", "Cloudy", "Frost", "Windy"]

TRADE_TYPES = ["Groundworker", "Bricklayer", "Carpenter", "Electrician", "Plumber", "Roofer", "Plasterer", "Decorator", "Scaffolder", "M&E Contractor", "Steelwork", "Glazier"]

# Generate realistic daily log notes
LOG_TEMPLATES = [
    "{trade} progressing well. {phase} {percent}% complete.",
    "Delayed start due to {weather}. {work_done}",
    "Material delivery for {item}. {progress}",
    "{visitor} on site for inspection. {outcome}",
    "Good progress on {phase}. {detail}",
    "{issue} identified. {resolution}",
]

def generate_jobs(count=54):
    """Generate realistic UK construction jobs"""
    jobs = []
    statuses = ["LIVE"] * 20 + ["WON"] * 8 + ["TENDER"] * 12 + ["PRACTICAL_COMPLETION"] * 5 + ["FINAL_ACCOUNT"] * 3 + ["LOST"] * 6
    
    for i in range(count):
        sector, types = random.choice(PROJECT_TYPES)
        location, postcode_prefix, lat, lng = random.choice(UK_LOCATIONS)
        project_type = random.choice(types)
        
        ref_num = str(2026000 + i + 1)[-3:]
        
        # Generate realistic contract value based on sector
        if sector == "Residential":
            value = random.randint(150, 600) * 1000
        elif sector in ["Commercial", "Industrial"]:
            value = random.randint(400, 3000) * 1000
        elif sector in ["Education", "Healthcare"]:
            value = random.randint(500, 2500) * 1000
        else:
            value = random.randint(200, 1500) * 1000
        
        job = {
            "id": f"job-{str(i+1).zfill(3)}",
            "reference": f"BF-2026-{ref_num}",
            "title": f"{location} {project_type}",
            "sector": sector,
            "contractValue": value,
            "status": statuses[i] if i < len(statuses) else "TENDER",
            "location": location,
            "postcode": f"{postcode_prefix} {random.randint(1,9)}{random.choice('ABCDEFGHJKLMNPQRSTUWXYZ')}{random.choice('ABCDEFGHJKLMNPQRSTUWXYZ')}",
            "lat": lat + random.uniform(-0.02, 0.02),
            "lng": lng + random.uniform(-0.02, 0.02),
        }
        jobs.append(job)
    
    return jobs

def generate_daily_logs(job_ids, count=120):
    """Generate realistic daily site logs"""
    logs = []
    base_date = datetime(2026, 1, 15)
    
    for i in range(count):
        job_id = random.choice(job_ids[:25])  # Focus on LIVE jobs
        date = base_date + timedelta(days=random.randint(0, 60))
        
        weather = random.choice(WEATHER)
        labour_count = random.randint(4, 25)
        
        # Generate realistic notes
        notes_parts = []
        notes_parts.append(f"[WORK] {random.choice(['Brickwork', 'Groundworks', 'Roofing', 'M&E installation', 'Plastering', 'Steelwork'])} progressing.")
        
        if random.random() < 0.3:
            notes_parts.append(f"[ISSUES] {random.choice(['Delivery delayed', 'Weather hold-up', 'Waiting for inspection', 'Material shortage'])}")
        
        notes_parts.append(f"[H&S] {random.choice(['All clear', 'Scaffold inspection', 'Fire extinguisher check', 'Toolbox talk delivered'])}")
        
        log = {
            "id": f"log-{str(i+1).zfill(3)}",
            "jobId": job_id,
            "date": date.isoformat(),
            "weather": weather,
            "labourCount": labour_count,
            "visitors": random.choice([None, "Client", "Building control", "Architect", "Structural engineer", None, None]),
            "notes": " ".join(notes_parts),
        }
        logs.append(log)
    
    return logs

def main():
    """Generate full seed data"""
    jobs = generate_jobs(54)
    logs = generate_daily_logs([j["id"] for j in jobs], 120)
    
    # Output stats
    print(f"✓ Generated {len(jobs)} jobs")
    print(f"✓ Generated {len(logs)} daily logs")
    print(f"\nNext: Write TypeScript seed file...")

if __name__ == "__main__":
    main()
