import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  Clock, 
  Filter,
  Heart,
  Stethoscope,
  Brain,
  Eye,
  Baby,
  Bone
} from "lucide-react";

const specialties = [
  { id: "primary", name: "Primary Care", icon: Stethoscope, count: 2847 },
  { id: "cardiology", name: "Cardiology", icon: Heart, count: 892 },
  { id: "neurology", name: "Neurology", icon: Brain, count: 456 },
  { id: "ophthalmology", name: "Ophthalmology", icon: Eye, count: 623 },
  { id: "pediatrics", name: "Pediatrics", icon: Baby, count: 1234 },
  { id: "orthopedics", name: "Orthopedics", icon: Bone, count: 789 },
];

const allProviders = [
  // AUSTIN, TX
  { id: 1, name: "Dr. Sarah Chen", specialty: "Primary Care", specialtyId: "primary", clinic: "Choice Health Partners", address: "123 Medical Center Dr, Austin, TX 78701", city: "Austin", state: "TX", zip: "78701", rating: 4.9, reviews: 342, distance: "0.8 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "wellness", "checkup", "annual physical", "preventive care"] },
  { id: 2, name: "Dr. Michael Roberts", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Heart & Vascular Institute", address: "456 Cardiac Way, Austin, TX 78702", city: "Austin", state: "TX", zip: "78702", rating: 4.8, reviews: 218, distance: "1.2 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "blood pressure", "cholesterol", "cardiac"] },
  { id: 3, name: "Dr. Emily Watson", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Children's Wellness Center", address: "789 Kids Blvd, Austin, TX 78703", city: "Austin", state: "TX", zip: "78703", rating: 5.0, reviews: 567, distance: "2.1 mi", acceptingNew: false, nextAvailable: "2 Weeks", price: "$$", insurances: ["Individual", "Group"], keywords: ["children", "kids", "baby", "infant", "toddler", "child", "pediatric", "vaccines", "immunizations"] },
  { id: 4, name: "Dr. James Park", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Sports Medicine & Ortho", address: "321 Athletic Dr, Austin, TX 78704", city: "Austin", state: "TX", zip: "78704", rating: 4.7, reviews: 189, distance: "3.4 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["bones", "joints", "sports injury", "knee", "hip", "shoulder", "back pain", "spine"] },
  { id: 5, name: "Dr. Lisa Martinez", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Austin Kids Health", address: "555 Family Way, Austin, TX 78745", city: "Austin", state: "TX", zip: "78745", rating: 4.9, reviews: 423, distance: "4.2 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "newborn", "adolescent", "teen", "pediatric", "well-child visits"] },
  { id: 6, name: "Dr. Robert Kim", specialty: "Primary Care", specialtyId: "primary", clinic: "Downtown Family Medicine", address: "100 Congress Ave, Austin, TX 78701", city: "Austin", state: "TX", zip: "78701", rating: 4.6, reviews: 298, distance: "0.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["family", "general practice", "wellness", "preventive", "checkup"] },
  { id: 7, name: "Dr. Amanda Foster", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Clear Vision Eye Care", address: "200 Vision Pkwy, Austin, TX 78746", city: "Austin", state: "TX", zip: "78746", rating: 4.8, reviews: 156, distance: "5.1 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["Group", "Individual"], keywords: ["eyes", "vision", "glasses", "contacts", "lasik", "cataracts", "glaucoma"] },
  { id: 8, name: "Dr. David Nguyen", specialty: "Neurology", specialtyId: "neurology", clinic: "Austin Brain & Spine Center", address: "750 Neuro Dr, Austin, TX 78756", city: "Austin", state: "TX", zip: "78756", rating: 4.9, reviews: 312, distance: "3.8 mi", acceptingNew: true, nextAvailable: "Next Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["brain", "headache", "migraine", "stroke", "seizure", "memory", "nerve"] },

  // HOUSTON, TX
  { id: 9, name: "Dr. Jennifer Adams", specialty: "Primary Care", specialtyId: "primary", clinic: "Houston Family Health", address: "1200 Main St, Houston, TX 77002", city: "Houston", state: "TX", zip: "77002", rating: 4.8, reviews: 456, distance: "1.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "wellness", "checkup", "annual physical", "preventive care", "diabetes"] },
  { id: 10, name: "Dr. William Thompson", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Texas Heart Center", address: "6550 Fannin St, Houston, TX 77030", city: "Houston", state: "TX", zip: "77030", rating: 4.9, reviews: 534, distance: "2.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "heart failure", "arrhythmia", "cardiac surgery"] },
  { id: 11, name: "Dr. Maria Garcia", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Texas Children's Primary Care", address: "6621 Fannin St, Houston, TX 77030", city: "Houston", state: "TX", zip: "77030", rating: 5.0, reviews: 789, distance: "2.6 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "infant", "pediatric", "vaccines", "growth development"] },
  { id: 12, name: "Dr. Christopher Lee", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Houston Orthopedic & Spine", address: "7401 Main St, Houston, TX 77030", city: "Houston", state: "TX", zip: "77030", rating: 4.7, reviews: 267, distance: "3.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["bones", "joints", "spine surgery", "knee replacement", "hip replacement", "sports medicine"] },
  { id: 13, name: "Dr. Patricia Brown", specialty: "Neurology", specialtyId: "neurology", clinic: "Houston Neurology Associates", address: "1213 Hermann Dr, Houston, TX 77004", city: "Houston", state: "TX", zip: "77004", rating: 4.8, reviews: 198, distance: "1.8 mi", acceptingNew: true, nextAvailable: "Next Week", price: "$$$", insurances: ["ICHRA", "Individual"], keywords: ["brain", "headache", "epilepsy", "Parkinson's", "multiple sclerosis", "nerve damage"] },
  { id: 14, name: "Dr. Kevin Wright", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Eye Institute of Houston", address: "6560 Fannin St, Houston, TX 77030", city: "Houston", state: "TX", zip: "77030", rating: 4.9, reviews: 345, distance: "2.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["eyes", "vision", "retina", "cataracts", "glaucoma", "macular degeneration"] },
  { id: 15, name: "Dr. Angela Davis", specialty: "Primary Care", specialtyId: "primary", clinic: "Memorial Hermann Primary Care", address: "929 Gessner Rd, Houston, TX 77024", city: "Houston", state: "TX", zip: "77024", rating: 4.6, reviews: 312, distance: "5.2 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["family medicine", "internal medicine", "wellness", "chronic care"] },

  // DALLAS, TX
  { id: 16, name: "Dr. Steven Miller", specialty: "Primary Care", specialtyId: "primary", clinic: "Dallas Family Medicine", address: "3500 Gaston Ave, Dallas, TX 75246", city: "Dallas", state: "TX", zip: "75246", rating: 4.7, reviews: 289, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "wellness", "checkup", "preventive care", "diabetes management"] },
  { id: 17, name: "Dr. Elizabeth Taylor", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Baylor Heart Center", address: "621 N Hall St, Dallas, TX 75226", city: "Dallas", state: "TX", zip: "75226", rating: 4.9, reviews: 467, distance: "2.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "interventional cardiology", "heart surgery", "pacemaker"] },
  { id: 18, name: "Dr. Thomas Anderson", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Children's Health Dallas", address: "1935 Medical District Dr, Dallas, TX 75235", city: "Dallas", state: "TX", zip: "75235", rating: 5.0, reviews: 612, distance: "3.2 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "infant", "adolescent", "pediatric specialty", "vaccines"] },
  { id: 19, name: "Dr. Nancy Wilson", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Texas Orthopedic Associates", address: "8230 Walnut Hill Ln, Dallas, TX 75231", city: "Dallas", state: "TX", zip: "75231", rating: 4.8, reviews: 234, distance: "4.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["bones", "joints", "spine", "knee", "hip", "shoulder surgery", "physical therapy"] },
  { id: 20, name: "Dr. Richard Moore", specialty: "Neurology", specialtyId: "neurology", clinic: "UT Southwestern Neurology", address: "5323 Harry Hines Blvd, Dallas, TX 75390", city: "Dallas", state: "TX", zip: "75390", rating: 4.9, reviews: 378, distance: "3.8 mi", acceptingNew: true, nextAvailable: "Next Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["brain", "headache", "stroke", "epilepsy", "movement disorders", "dementia"] },
  { id: 21, name: "Dr. Susan Clark", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Dallas Eye Associates", address: "3030 McKinnon St, Dallas, TX 75201", city: "Dallas", state: "TX", zip: "75201", rating: 4.7, reviews: 189, distance: "1.2 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["Group", "Individual"], keywords: ["eyes", "vision", "lasik", "cataracts", "dry eye", "contacts", "glasses"] },

  // SAN ANTONIO, TX
  { id: 22, name: "Dr. Daniel Harris", specialty: "Primary Care", specialtyId: "primary", clinic: "San Antonio Family Practice", address: "7703 Floyd Curl Dr, San Antonio, TX 78229", city: "San Antonio", state: "TX", zip: "78229", rating: 4.8, reviews: 356, distance: "2.1 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "wellness", "checkup", "preventive care", "geriatric"] },
  { id: 23, name: "Dr. Karen Martinez", specialty: "Cardiology", specialtyId: "cardiology", clinic: "South Texas Cardiology", address: "4411 Medical Dr, San Antonio, TX 78229", city: "San Antonio", state: "TX", zip: "78229", rating: 4.7, reviews: 234, distance: "2.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "heart failure", "cardiac rehab", "echocardiogram"] },
  { id: 24, name: "Dr. Jose Rodriguez", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Alamo Children's Clinic", address: "333 N Santa Rosa St, San Antonio, TX 78207", city: "San Antonio", state: "TX", zip: "78207", rating: 4.9, reviews: 445, distance: "1.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "bilingual", "Spanish speaking", "pediatric", "vaccines"] },
  { id: 25, name: "Dr. Michelle Lewis", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Ortho San Antonio", address: "400 Concord Plaza Dr, San Antonio, TX 78216", city: "San Antonio", state: "TX", zip: "78216", rating: 4.6, reviews: 178, distance: "4.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["bones", "joints", "sports medicine", "fractures", "physical therapy"] },
  { id: 26, name: "Dr. Brian Jackson", specialty: "Neurology", specialtyId: "neurology", clinic: "UT Health San Antonio Neurology", address: "7703 Floyd Curl Dr, San Antonio, TX 78229", city: "San Antonio", state: "TX", zip: "78229", rating: 4.8, reviews: 267, distance: "2.1 mi", acceptingNew: true, nextAvailable: "Next Week", price: "$$$", insurances: ["ICHRA", "Individual"], keywords: ["brain", "headache", "migraine", "stroke", "epilepsy", "memory loss"] },
  { id: 27, name: "Dr. Laura White", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "San Antonio Eye Center", address: "311 Camden St, San Antonio, TX 78215", city: "San Antonio", state: "TX", zip: "78215", rating: 4.7, reviews: 145, distance: "0.8 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["eyes", "vision", "cataracts", "glaucoma", "diabetic eye care"] },

  // FORT WORTH, TX
  { id: 28, name: "Dr. Mark Robinson", specialty: "Primary Care", specialtyId: "primary", clinic: "Fort Worth Medical Group", address: "1325 Pennsylvania Ave, Fort Worth, TX 76104", city: "Fort Worth", state: "TX", zip: "76104", rating: 4.7, reviews: 267, distance: "1.8 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "wellness", "checkup", "chronic disease management"] },
  { id: 29, name: "Dr. Jennifer Scott", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Texas Health Heart & Vascular", address: "1301 Pennsylvania Ave, Fort Worth, TX 76104", city: "Fort Worth", state: "TX", zip: "76104", rating: 4.8, reviews: 198, distance: "1.8 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "cardiac imaging", "heart rhythm", "preventive cardiology"] },
  { id: 30, name: "Dr. Andrew Young", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Cook Children's Pediatrics", address: "801 7th Ave, Fort Worth, TX 76104", city: "Fort Worth", state: "TX", zip: "76104", rating: 5.0, reviews: 534, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "infant", "pediatric specialty", "childhood illness"] },

  // MIAMI, FL
  { id: 31, name: "Dr. Carlos Fernandez", specialty: "Primary Care", specialtyId: "primary", clinic: "Miami Family Health", address: "1611 NW 12th Ave, Miami, FL 33136", city: "Miami", state: "FL", zip: "33136", rating: 4.8, reviews: 389, distance: "1.2 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "bilingual", "Spanish speaking", "wellness", "preventive care"] },
  { id: 32, name: "Dr. Rachel Cohen", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Miami Cardiac & Vascular Institute", address: "8900 N Kendall Dr, Miami, FL 33176", city: "Miami", state: "FL", zip: "33176", rating: 4.9, reviews: 456, distance: "5.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "heart surgery", "valve repair", "cardiac imaging"] },
  { id: 33, name: "Dr. Sofia Hernandez", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Nicklaus Children's Primary Care", address: "3100 SW 62nd Ave, Miami, FL 33155", city: "Miami", state: "FL", zip: "33155", rating: 5.0, reviews: 678, distance: "3.2 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "bilingual", "Spanish", "pediatric", "tropical medicine"] },
  { id: 34, name: "Dr. Michael Stein", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Miami Orthopedics & Sports Medicine", address: "5000 University Dr, Coral Gables, FL 33146", city: "Miami", state: "FL", zip: "33146", rating: 4.7, reviews: 234, distance: "4.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["bones", "joints", "sports injury", "knee", "shoulder", "arthroscopy"] },
  { id: 35, name: "Dr. Diana Rodriguez", specialty: "Neurology", specialtyId: "neurology", clinic: "University of Miami Neurology", address: "1150 NW 14th St, Miami, FL 33136", city: "Miami", state: "FL", zip: "33136", rating: 4.8, reviews: 289, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Next Week", price: "$$$", insurances: ["ICHRA", "Individual"], keywords: ["brain", "headache", "stroke", "memory", "movement disorders", "neurological"] },
  { id: 36, name: "Dr. Alan Goldberg", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Bascom Palmer Eye Institute", address: "900 NW 17th St, Miami, FL 33136", city: "Miami", state: "FL", zip: "33136", rating: 5.0, reviews: 567, distance: "1.8 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["eyes", "vision", "retina", "cornea", "glaucoma", "world renowned"] },

  // ORLANDO, FL
  { id: 37, name: "Dr. Timothy Baker", specialty: "Primary Care", specialtyId: "primary", clinic: "Orlando Health Physician Group", address: "1414 Kuhl Ave, Orlando, FL 32806", city: "Orlando", state: "FL", zip: "32806", rating: 4.7, reviews: 312, distance: "2.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "internal medicine", "wellness", "checkup"] },
  { id: 38, name: "Dr. Catherine Hill", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Heart of Florida Cardiology", address: "1222 S Orange Ave, Orlando, FL 32806", city: "Orlando", state: "FL", zip: "32806", rating: 4.8, reviews: 234, distance: "1.8 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "heart rhythm", "preventive cardiology", "echo"] },
  { id: 39, name: "Dr. Benjamin Cruz", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Arnold Palmer Children's Health", address: "92 W Miller St, Orlando, FL 32806", city: "Orlando", state: "FL", zip: "32806", rating: 5.0, reviews: 489, distance: "2.2 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "infant", "pediatric specialty", "childhood diseases"] },
  { id: 40, name: "Dr. Stephanie King", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Jewett Orthopedic Clinic", address: "1285 Orange Ave, Orlando, FL 32806", city: "Orlando", state: "FL", zip: "32806", rating: 4.6, reviews: 178, distance: "1.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["bones", "joints", "sports", "knee surgery", "hip replacement"] },
  { id: 41, name: "Dr. Gregory Adams", specialty: "Neurology", specialtyId: "neurology", clinic: "Orlando Neurology Associates", address: "21 W Columbia St, Orlando, FL 32806", city: "Orlando", state: "FL", zip: "32806", rating: 4.7, reviews: 156, distance: "2.0 mi", acceptingNew: true, nextAvailable: "Next Week", price: "$$$", insurances: ["ICHRA", "Individual"], keywords: ["brain", "headache", "migraine", "stroke", "seizure", "Parkinson's"] },
  { id: 42, name: "Dr. Nicole Turner", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Center for Sight Orlando", address: "6900 Turkey Lake Rd, Orlando, FL 32819", city: "Orlando", state: "FL", zip: "32819", rating: 4.8, reviews: 234, distance: "5.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["eyes", "vision", "lasik", "cataracts", "dry eye", "contacts"] },

  // TAMPA, FL
  { id: 43, name: "Dr. Robert Phillips", specialty: "Primary Care", specialtyId: "primary", clinic: "Tampa General Medical Group", address: "1 Tampa General Cir, Tampa, FL 33606", city: "Tampa", state: "FL", zip: "33606", rating: 4.8, reviews: 345, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "wellness", "checkup", "preventive care", "chronic care"] },
  { id: 44, name: "Dr. Victoria Campbell", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Tampa Heart Institute", address: "2727 W Martin Luther King Jr Blvd, Tampa, FL 33607", city: "Tampa", state: "FL", zip: "33607", rating: 4.9, reviews: 389, distance: "3.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "heart failure", "cardiac surgery", "valve replacement"] },
  { id: 45, name: "Dr. Anthony Mitchell", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "St. Joseph's Children's Hospital", address: "3001 W Martin Luther King Jr Blvd, Tampa, FL 33607", city: "Tampa", state: "FL", zip: "33607", rating: 5.0, reviews: 512, distance: "3.2 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "infant", "pediatric", "childhood illness", "vaccines"] },
  { id: 46, name: "Dr. Linda Perez", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Florida Orthopaedic Institute", address: "13020 N Telecom Pkwy, Temple Terrace, FL 33637", city: "Tampa", state: "FL", zip: "33637", rating: 4.7, reviews: 267, distance: "8.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["bones", "joints", "spine", "sports medicine", "fractures", "arthritis"] },
  { id: 47, name: "Dr. Edward Collins", specialty: "Neurology", specialtyId: "neurology", clinic: "USF Health Neurology", address: "2 Tampa General Cir, Tampa, FL 33606", city: "Tampa", state: "FL", zip: "33606", rating: 4.8, reviews: 198, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Next Week", price: "$$$", insurances: ["ICHRA", "Individual"], keywords: ["brain", "headache", "stroke", "epilepsy", "dementia", "movement disorders"] },
  { id: 48, name: "Dr. Samantha Reed", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Tampa Bay Eye Institute", address: "3030 N Rocky Point Dr W, Tampa, FL 33607", city: "Tampa", state: "FL", zip: "33607", rating: 4.7, reviews: 178, distance: "4.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["eyes", "vision", "cataracts", "glaucoma", "retina", "diabetic eye"] },

  // JACKSONVILLE, FL
  { id: 49, name: "Dr. Christopher Wood", specialty: "Primary Care", specialtyId: "primary", clinic: "Baptist Primary Care", address: "800 Prudential Dr, Jacksonville, FL 32207", city: "Jacksonville", state: "FL", zip: "32207", rating: 4.7, reviews: 289, distance: "2.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "wellness", "checkup", "preventive", "geriatric care"] },
  { id: 50, name: "Dr. Michelle Barnes", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Baptist Heart Specialists", address: "836 Prudential Dr, Jacksonville, FL 32207", city: "Jacksonville", state: "FL", zip: "32207", rating: 4.8, reviews: 234, distance: "2.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "heart failure", "cardiac rehab", "echocardiogram"] },
  { id: 51, name: "Dr. Jason Rivera", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Wolfson Children's Hospital", address: "800 Prudential Dr, Jacksonville, FL 32207", city: "Jacksonville", state: "FL", zip: "32207", rating: 5.0, reviews: 456, distance: "2.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "infant", "pediatric", "childhood diseases", "vaccines"] },
  { id: 52, name: "Dr. Amanda Green", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Jacksonville Orthopaedic Institute", address: "1325 San Marco Blvd, Jacksonville, FL 32207", city: "Jacksonville", state: "FL", zip: "32207", rating: 4.6, reviews: 189, distance: "2.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["bones", "joints", "sports", "knee", "hip", "shoulder", "spine surgery"] },
  { id: 53, name: "Dr. Paul Stewart", specialty: "Neurology", specialtyId: "neurology", clinic: "Mayo Clinic Neurology Jacksonville", address: "4500 San Pablo Rd S, Jacksonville, FL 32224", city: "Jacksonville", state: "FL", zip: "32224", rating: 5.0, reviews: 423, distance: "12.0 mi", acceptingNew: true, nextAvailable: "2 Weeks", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["brain", "headache", "stroke", "epilepsy", "world class", "Mayo Clinic"] },
  { id: 54, name: "Dr. Emily Foster", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Florida Eye Specialists Jacksonville", address: "1639 Atlantic Blvd, Jacksonville, FL 32207", city: "Jacksonville", state: "FL", zip: "32207", rating: 4.7, reviews: 156, distance: "3.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["eyes", "vision", "cataracts", "glaucoma", "lasik", "retina"] },

  // FORT LAUDERDALE, FL
  { id: 55, name: "Dr. David Palmer", specialty: "Primary Care", specialtyId: "primary", clinic: "Holy Cross Medical Group", address: "4725 N Federal Hwy, Fort Lauderdale, FL 33308", city: "Fort Lauderdale", state: "FL", zip: "33308", rating: 4.8, reviews: 267, distance: "3.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "wellness", "checkup", "preventive care"] },
  { id: 56, name: "Dr. Christine Hayes", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Broward Heart Center", address: "1600 S Andrews Ave, Fort Lauderdale, FL 33316", city: "Fort Lauderdale", state: "FL", zip: "33316", rating: 4.7, reviews: 198, distance: "1.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "heart rhythm", "interventional cardiology"] },
  { id: 57, name: "Dr. Raymond Lopez", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Joe DiMaggio Children's Hospital", address: "1005 Joe DiMaggio Dr, Hollywood, FL 33021", city: "Fort Lauderdale", state: "FL", zip: "33021", rating: 5.0, reviews: 534, distance: "6.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "pediatric specialty", "childhood cancer", "heart"] },
  { id: 58, name: "Dr. Sandra Bell", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Orthopedic Institute of South Florida", address: "1411 N Flagler Dr, Fort Lauderdale, FL 33304", city: "Fort Lauderdale", state: "FL", zip: "33304", rating: 4.6, reviews: 145, distance: "2.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["bones", "joints", "sports medicine", "knee", "hip replacement"] },
  { id: 59, name: "Dr. Matthew Price", specialty: "Neurology", specialtyId: "neurology", clinic: "Neurology Partners Fort Lauderdale", address: "4800 NE 20th Ter, Fort Lauderdale, FL 33308", city: "Fort Lauderdale", state: "FL", zip: "33308", rating: 4.7, reviews: 167, distance: "3.5 mi", acceptingNew: true, nextAvailable: "Next Week", price: "$$$", insurances: ["ICHRA", "Individual"], keywords: ["brain", "headache", "migraine", "memory", "sleep disorders"] },
  { id: 60, name: "Dr. Jessica Morgan", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Rand Eye Institute", address: "2825 N Federal Hwy, Fort Lauderdale, FL 33306", city: "Fort Lauderdale", state: "FL", zip: "33306", rating: 4.8, reviews: 234, distance: "2.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["eyes", "vision", "lasik", "cataracts", "glaucoma", "lens implants"] },

  // ST. PETERSBURG, FL
  { id: 61, name: "Dr. Ryan Cooper", specialty: "Primary Care", specialtyId: "primary", clinic: "Johns Hopkins All Children's Primary", address: "501 6th Ave S, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.8, reviews: 312, distance: "1.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "wellness", "adult medicine", "chronic care"] },
  { id: 62, name: "Dr. Megan Hughes", specialty: "Cardiology", specialtyId: "cardiology", clinic: "St. Petersburg Cardiology", address: "701 6th St S, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.7, reviews: 189, distance: "1.2 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "preventive cardiology", "heart failure"] },
  { id: 63, name: "Dr. Luis Sanchez", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Johns Hopkins All Children's Hospital", address: "501 6th Ave S, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 5.0, reviews: 567, distance: "1.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "infant", "pediatric specialty", "world class"] },
  { id: 64, name: "Dr. Ashley Ward", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Bayfront Orthopedics", address: "701 6th St S, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.6, reviews: 134, distance: "1.2 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["bones", "joints", "sports", "fractures", "arthritis"] },
  { id: 65, name: "Dr. Kevin Brooks", specialty: "Neurology", specialtyId: "neurology", clinic: "St. Petersburg Neurology", address: "701 6th St S, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.7, reviews: 145, distance: "1.2 mi", acceptingNew: true, nextAvailable: "Next Week", price: "$$$", insurances: ["ICHRA", "Individual"], keywords: ["brain", "headache", "stroke", "epilepsy", "memory"] },
  { id: 66, name: "Dr. Heather Ross", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "St. Petersburg Eye Associates", address: "333 1st St N, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.8, reviews: 178, distance: "0.8 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["eyes", "vision", "cataracts", "glaucoma", "retina", "dry eye"] },
];

const regions = [
  { name: "Austin Metro", providers: 2847, hospitals: 12 },
  { name: "Dallas-Fort Worth", providers: 4521, hospitals: 28 },
  { name: "Houston", providers: 5234, hospitals: 35 },
  { name: "San Antonio", providers: 1876, hospitals: 9 },
  { name: "Miami", providers: 3892, hospitals: 18 },
  { name: "Orlando", providers: 2456, hospitals: 14 },
  { name: "Tampa Bay", providers: 2789, hospitals: 16 },
  { name: "Jacksonville", providers: 1654, hospitals: 10 },
];

const ProviderMap = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("Austin, TX");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  // Filter providers based on search query, location, and specialty
  const filteredProviders = useMemo(() => {
    let results = allProviders;

    // Filter by specialty if selected
    if (selectedSpecialty) {
      results = results.filter(p => p.specialtyId === selectedSpecialty);
    }

    // Filter by location
    if (locationQuery.trim()) {
      const locationLower = locationQuery.toLowerCase();
      results = results.filter(p => 
        p.city.toLowerCase().includes(locationLower) ||
        p.state.toLowerCase().includes(locationLower) ||
        p.zip.includes(locationQuery) ||
        p.address.toLowerCase().includes(locationLower)
      );
    }

    // Filter by search query (matches name, specialty, clinic, keywords, or address)
    if (searchQuery.trim()) {
      const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
      results = results.filter(provider => {
        const searchableText = [
          provider.name,
          provider.specialty,
          provider.clinic,
          provider.address,
          ...provider.keywords
        ].join(" ").toLowerCase();

        // Check if ALL search terms match somewhere in the searchable text
        return searchTerms.every(term => searchableText.includes(term));
      });
    }

    return results;
  }, [searchQuery, locationQuery, selectedSpecialty]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                Nationwide Network
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Find Your Perfect Provider
              </h1>
              <p className="text-xl text-muted-foreground">
                Explore our network of 50,000+ healthcare providers with transparent pricing 
                and real patient reviews.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-2xl shadow-lg border border-border">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, specialty, or condition..."
                    className="pl-10 h-12 border-0 bg-muted/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="City, State, or ZIP code"
                    className="pl-10 h-12 border-0 bg-muted/50"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
                <Button size="lg" className="h-12 px-8">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Specialties Grid */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Browse by Specialty</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {specialties.map((specialty) => (
                <button
                  key={specialty.id}
                  onClick={() => setSelectedSpecialty(
                    selectedSpecialty === specialty.id ? null : specialty.id
                  )}
                  className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                    selectedSpecialty === specialty.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border hover:border-primary/50 hover:shadow-md"
                  }`}
                >
                  <specialty.icon className="h-8 w-8 mb-3" />
                  <div className="font-medium">{specialty.name}</div>
                  <div className={`text-sm ${
                    selectedSpecialty === specialty.id 
                      ? "text-primary-foreground/70" 
                      : "text-muted-foreground"
                  }`}>
                    {specialty.count.toLocaleString()} providers
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Distance
                      </label>
                      <select className="w-full p-2 rounded-lg border border-border bg-background">
                        <option>Within 5 miles</option>
                        <option>Within 10 miles</option>
                        <option>Within 25 miles</option>
                        <option>Within 50 miles</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Insurance Type
                      </label>
                      <div className="space-y-2">
                        {["ICHRA", "Group", "Individual"].map((type) => (
                          <label key={type} className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-border" defaultChecked />
                            <span className="text-sm">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Availability
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded border-border" />
                          <span className="text-sm">Accepting new patients</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded border-border" />
                          <span className="text-sm">Same-day appointments</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Rating
                      </label>
                      <select className="w-full p-2 rounded-lg border border-border bg-background">
                        <option>Any rating</option>
                        <option>4+ stars</option>
                        <option>4.5+ stars</option>
                      </select>
                    </div>

                    {/* Region Stats */}
                    <div className="pt-4 border-t border-border">
                      <h3 className="text-sm font-medium text-foreground mb-3">Regional Coverage</h3>
                      <div className="space-y-3">
                        {regions.map((region) => (
                          <div key={region.name} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{region.name}</span>
                            <span className="font-medium">{region.providers.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Provider List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{filteredProviders.length}</span> providers
                    {locationQuery && ` near ${locationQuery}`}
                  </p>
                  <select className="p-2 rounded-lg border border-border bg-background text-sm">
                    <option>Sort by: Relevance</option>
                    <option>Sort by: Distance</option>
                    <option>Sort by: Rating</option>
                    <option>Sort by: Price</option>
                  </select>
                </div>

                {filteredProviders.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">No providers found matching your search. Try adjusting your filters.</p>
                  </Card>
                ) : filteredProviders.map((provider) => (
                  <Card key={provider.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl font-semibold text-primary">
                            {provider.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="text-xl font-semibold text-foreground">
                                {provider.name}
                              </h3>
                              <p className="text-primary font-medium">{provider.specialty}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                              <span className="font-semibold">{provider.rating}</span>
                              <span className="text-muted-foreground">
                                ({provider.reviews} reviews)
                              </span>
                            </div>
                          </div>

                          <p className="text-muted-foreground mb-3">{provider.clinic}</p>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {provider.distance}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Next: {provider.nextAvailable}
                            </span>
                            <span className="font-medium text-foreground">{provider.price}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {provider.insurances.map((insurance) => (
                              <Badge 
                                key={insurance} 
                                variant="secondary"
                                className="bg-accent/10 text-accent border-accent/20"
                              >
                                {insurance}
                              </Badge>
                            ))}
                            {provider.acceptingNew && (
                              <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                                Accepting New Patients
                              </Badge>
                            )}
                          </div>

                          <div className="flex gap-3">
                            <Button className="flex-1 md:flex-none">
                              Book Appointment
                            </Button>
                            <Button variant="outline" size="icon">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Load More */}
                <div className="text-center pt-8">
                  <Button variant="outline" size="lg">
                    Load More Providers
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProviderMap;
