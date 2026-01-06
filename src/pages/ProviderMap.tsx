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

const allProviders = [
  // AUSTIN, TX - Primary Care (3)
  { id: 1, name: "Dr. Sarah Chen", specialty: "Primary Care", specialtyId: "primary", clinic: "Choice Health Partners", address: "123 Medical Center Dr, Austin, TX 78701", city: "Austin", state: "TX", zip: "78701", rating: 4.9, reviews: 342, distance: "0.8 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "wellness", "checkup", "annual physical", "preventive care"] },
  { id: 2, name: "Dr. Robert Kim", specialty: "Primary Care", specialtyId: "primary", clinic: "Downtown Family Medicine", address: "100 Congress Ave, Austin, TX 78701", city: "Austin", state: "TX", zip: "78701", rating: 4.6, reviews: 298, distance: "0.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["family", "general practice", "wellness", "preventive", "checkup"] },
  { id: 3, name: "Dr. Helen Torres", specialty: "Primary Care", specialtyId: "primary", clinic: "Austin Internal Medicine", address: "4500 S Lamar Blvd, Austin, TX 78745", city: "Austin", state: "TX", zip: "78745", rating: 4.7, reviews: 267, distance: "3.2 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["internal medicine", "adult care", "chronic disease", "diabetes", "hypertension"] },
  // AUSTIN, TX - Cardiology (3)
  { id: 4, name: "Dr. Michael Roberts", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Heart & Vascular Institute", address: "456 Cardiac Way, Austin, TX 78702", city: "Austin", state: "TX", zip: "78702", rating: 4.8, reviews: 218, distance: "1.2 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "blood pressure", "cholesterol", "cardiac"] },
  { id: 5, name: "Dr. Patricia Lane", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Austin Heart Clinic", address: "3705 Medical Pkwy, Austin, TX 78756", city: "Austin", state: "TX", zip: "78756", rating: 4.9, reviews: 189, distance: "2.8 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["heart failure", "arrhythmia", "pacemaker", "cardiac imaging"] },
  { id: 6, name: "Dr. George Franklin", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Seton Heart Institute", address: "1201 W 38th St, Austin, TX 78705", city: "Austin", state: "TX", zip: "78705", rating: 4.7, reviews: 156, distance: "1.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["Group", "Individual"], keywords: ["interventional cardiology", "stents", "cardiac catheterization"] },
  // AUSTIN, TX - Pediatrics (3)
  { id: 7, name: "Dr. Emily Watson", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Children's Wellness Center", address: "789 Kids Blvd, Austin, TX 78703", city: "Austin", state: "TX", zip: "78703", rating: 5.0, reviews: 567, distance: "2.1 mi", acceptingNew: false, nextAvailable: "2 Weeks", price: "$$", insurances: ["Individual", "Group"], keywords: ["children", "kids", "baby", "infant", "toddler", "child", "pediatric", "vaccines", "immunizations"] },
  { id: 8, name: "Dr. Lisa Martinez", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Austin Kids Health", address: "555 Family Way, Austin, TX 78745", city: "Austin", state: "TX", zip: "78745", rating: 4.9, reviews: 423, distance: "4.2 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "newborn", "adolescent", "teen", "pediatric", "well-child visits"] },
  { id: 9, name: "Dr. Nathan Brooks", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Dell Children's Pediatrics", address: "4900 Mueller Blvd, Austin, TX 78723", city: "Austin", state: "TX", zip: "78723", rating: 4.8, reviews: 389, distance: "3.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["children", "kids", "infant", "newborn", "developmental", "ADHD", "asthma"] },
  // AUSTIN, TX - Orthopedics (3)
  { id: 10, name: "Dr. James Park", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Sports Medicine & Ortho", address: "321 Athletic Dr, Austin, TX 78704", city: "Austin", state: "TX", zip: "78704", rating: 4.7, reviews: 189, distance: "3.4 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["bones", "joints", "sports injury", "knee", "hip", "shoulder", "back pain", "spine"] },
  { id: 11, name: "Dr. William Hayes", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Texas Orthopedics Austin", address: "4700 Seton Center Pkwy, Austin, TX 78759", city: "Austin", state: "TX", zip: "78759", rating: 4.8, reviews: 234, distance: "5.1 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["joint replacement", "arthroscopy", "rotator cuff", "ACL", "meniscus"] },
  { id: 12, name: "Dr. Rebecca Stone", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Austin Spine & Sports", address: "6818 Austin Center Blvd, Austin, TX 78731", city: "Austin", state: "TX", zip: "78731", rating: 4.6, reviews: 167, distance: "4.8 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["spine surgery", "herniated disc", "sciatica", "sports medicine"] },
  // AUSTIN, TX - Neurology (3)
  { id: 13, name: "Dr. David Nguyen", specialty: "Neurology", specialtyId: "neurology", clinic: "Austin Brain & Spine Center", address: "750 Neuro Dr, Austin, TX 78756", city: "Austin", state: "TX", zip: "78756", rating: 4.9, reviews: 312, distance: "3.8 mi", acceptingNew: true, nextAvailable: "Next Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["brain", "headache", "migraine", "stroke", "seizure", "memory", "nerve"] },
  { id: 14, name: "Dr. Catherine Mills", specialty: "Neurology", specialtyId: "neurology", clinic: "UT Health Austin Neurology", address: "1601 Trinity St, Austin, TX 78712", city: "Austin", state: "TX", zip: "78712", rating: 4.8, reviews: 245, distance: "1.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Individual"], keywords: ["epilepsy", "Parkinson's", "multiple sclerosis", "neuropathy"] },
  { id: 15, name: "Dr. Marcus Webb", specialty: "Neurology", specialtyId: "neurology", clinic: "Central Texas Neurology", address: "3901 Medical Pkwy, Austin, TX 78756", city: "Austin", state: "TX", zip: "78756", rating: 4.7, reviews: 178, distance: "2.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["dementia", "Alzheimer's", "tremor", "movement disorders"] },
  // AUSTIN, TX - Ophthalmology (3)
  { id: 16, name: "Dr. Amanda Foster", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Clear Vision Eye Care", address: "200 Vision Pkwy, Austin, TX 78746", city: "Austin", state: "TX", zip: "78746", rating: 4.8, reviews: 156, distance: "5.1 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["Group", "Individual"], keywords: ["eyes", "vision", "glasses", "contacts", "lasik", "cataracts", "glaucoma"] },
  { id: 17, name: "Dr. Steven Bright", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Austin Eye Center", address: "3705 Medical Pkwy, Austin, TX 78756", city: "Austin", state: "TX", zip: "78756", rating: 4.9, reviews: 234, distance: "2.8 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["retina", "macular degeneration", "diabetic eye", "eye surgery"] },
  { id: 18, name: "Dr. Linda Chang", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Eye Physicians of Austin", address: "1300 W Lynn St, Austin, TX 78703", city: "Austin", state: "TX", zip: "78703", rating: 4.7, reviews: 189, distance: "1.8 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["eye exam", "contacts", "dry eye", "routine vision care"] },

  // HOUSTON, TX - Primary Care (3)
  { id: 19, name: "Dr. Jennifer Adams", specialty: "Primary Care", specialtyId: "primary", clinic: "Houston Family Health", address: "1200 Main St, Houston, TX 77002", city: "Houston", state: "TX", zip: "77002", rating: 4.8, reviews: 456, distance: "1.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "wellness", "checkup", "annual physical", "preventive care", "diabetes"] },
  { id: 20, name: "Dr. Angela Davis", specialty: "Primary Care", specialtyId: "primary", clinic: "Memorial Hermann Primary Care", address: "929 Gessner Rd, Houston, TX 77024", city: "Houston", state: "TX", zip: "77024", rating: 4.6, reviews: 312, distance: "5.2 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["family medicine", "internal medicine", "wellness", "chronic care"] },
  { id: 21, name: "Dr. Marcus Johnson", specialty: "Primary Care", specialtyId: "primary", clinic: "Houston Medical Center Clinic", address: "6400 Fannin St, Houston, TX 77030", city: "Houston", state: "TX", zip: "77030", rating: 4.9, reviews: 378, distance: "2.8 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["internal medicine", "preventive health", "executive physicals"] },
  // HOUSTON, TX - Cardiology (3)
  { id: 22, name: "Dr. William Thompson", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Texas Heart Center", address: "6550 Fannin St, Houston, TX 77030", city: "Houston", state: "TX", zip: "77030", rating: 4.9, reviews: 534, distance: "2.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "heart failure", "arrhythmia", "cardiac surgery"] },
  { id: 23, name: "Dr. Robert Chen", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Houston Methodist Cardiology", address: "6565 Fannin St, Houston, TX 77030", city: "Houston", state: "TX", zip: "77030", rating: 5.0, reviews: 456, distance: "2.6 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["interventional cardiology", "structural heart", "TAVR", "cardiac imaging"] },
  { id: 24, name: "Dr. Sandra Lee", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Baylor St. Luke's Heart", address: "6720 Bertner Ave, Houston, TX 77030", city: "Houston", state: "TX", zip: "77030", rating: 4.8, reviews: 389, distance: "2.7 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["Group", "Individual"], keywords: ["electrophysiology", "pacemaker", "defibrillator", "atrial fibrillation"] },
  // HOUSTON, TX - Pediatrics (3)
  { id: 25, name: "Dr. Maria Garcia", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Texas Children's Primary Care", address: "6621 Fannin St, Houston, TX 77030", city: "Houston", state: "TX", zip: "77030", rating: 5.0, reviews: 789, distance: "2.6 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "infant", "pediatric", "vaccines", "growth development"] },
  { id: 26, name: "Dr. Rebecca White", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Houston Pediatric Associates", address: "1102 Bates Ave, Houston, TX 77030", city: "Houston", state: "TX", zip: "77030", rating: 4.9, reviews: 534, distance: "2.4 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["children", "kids", "newborn", "adolescent", "teen health", "behavioral"] },
  { id: 27, name: "Dr. Thomas Wright", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Memorial Hermann Children's", address: "6411 Fannin St, Houston, TX 77030", city: "Houston", state: "TX", zip: "77030", rating: 4.8, reviews: 423, distance: "2.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Individual", "Group"], keywords: ["children", "kids", "infant", "NICU follow-up", "developmental delays"] },
  // HOUSTON, TX - Orthopedics (3)
  { id: 28, name: "Dr. Christopher Lee", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Houston Orthopedic & Spine", address: "7401 Main St, Houston, TX 77030", city: "Houston", state: "TX", zip: "77030", rating: 4.7, reviews: 267, distance: "3.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["bones", "joints", "spine surgery", "knee replacement", "hip replacement", "sports medicine"] },
  { id: 29, name: "Dr. Mark Stevens", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Houston Methodist Orthopedics", address: "6550 Fannin St, Houston, TX 77030", city: "Houston", state: "TX", zip: "77030", rating: 4.9, reviews: 312, distance: "2.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["joint replacement", "sports injury", "shoulder surgery", "hand surgery"] },
  { id: 30, name: "Dr. Diana Ross", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Fondren Orthopedic Group", address: "7401 S Main St, Houston, TX 77030", city: "Houston", state: "TX", zip: "77030", rating: 4.6, reviews: 234, distance: "3.1 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["Group", "Individual"], keywords: ["orthopedic surgery", "fractures", "arthritis", "foot ankle"] },
  // HOUSTON, TX - Neurology (3)
  { id: 31, name: "Dr. Patricia Brown", specialty: "Neurology", specialtyId: "neurology", clinic: "Houston Neurology Associates", address: "1213 Hermann Dr, Houston, TX 77004", city: "Houston", state: "TX", zip: "77004", rating: 4.8, reviews: 198, distance: "1.8 mi", acceptingNew: true, nextAvailable: "Next Week", price: "$$$", insurances: ["ICHRA", "Individual"], keywords: ["brain", "headache", "epilepsy", "Parkinson's", "multiple sclerosis", "nerve damage"] },
  { id: 32, name: "Dr. Andrew Kim", specialty: "Neurology", specialtyId: "neurology", clinic: "UT Health Neurology Houston", address: "6431 Fannin St, Houston, TX 77030", city: "Houston", state: "TX", zip: "77030", rating: 4.9, reviews: 267, distance: "2.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["stroke", "movement disorders", "ALS", "neuromuscular"] },
  { id: 33, name: "Dr. Elizabeth Moore", specialty: "Neurology", specialtyId: "neurology", clinic: "Houston Methodist Neurology", address: "6565 Fannin St, Houston, TX 77030", city: "Houston", state: "TX", zip: "77030", rating: 4.7, reviews: 189, distance: "2.6 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["migraine", "headache center", "sleep disorders", "memory"] },
  // HOUSTON, TX - Ophthalmology (3)
  { id: 34, name: "Dr. Kevin Wright", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Eye Institute of Houston", address: "6560 Fannin St, Houston, TX 77030", city: "Houston", state: "TX", zip: "77030", rating: 4.9, reviews: 345, distance: "2.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["eyes", "vision", "retina", "cataracts", "glaucoma", "macular degeneration"] },
  { id: 35, name: "Dr. Nancy Chen", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Baylor Eye Physicians", address: "6620 Main St, Houston, TX 77030", city: "Houston", state: "TX", zip: "77030", rating: 4.8, reviews: 278, distance: "2.6 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["cornea", "refractive surgery", "lasik", "PRK"] },
  { id: 36, name: "Dr. James Miller", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Houston Eye Associates", address: "2855 Gramercy St, Houston, TX 77025", city: "Houston", state: "TX", zip: "77025", rating: 4.6, reviews: 198, distance: "4.2 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["Individual", "Group"], keywords: ["eye exam", "glasses", "contacts", "routine eye care"] },

  // DALLAS, TX - Primary Care (3)
  { id: 37, name: "Dr. Steven Miller", specialty: "Primary Care", specialtyId: "primary", clinic: "Dallas Family Medicine", address: "3500 Gaston Ave, Dallas, TX 75246", city: "Dallas", state: "TX", zip: "75246", rating: 4.7, reviews: 289, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "wellness", "checkup", "preventive care", "diabetes management"] },
  { id: 38, name: "Dr. Rachel Green", specialty: "Primary Care", specialtyId: "primary", clinic: "UT Southwestern Primary Care", address: "5939 Harry Hines Blvd, Dallas, TX 75390", city: "Dallas", state: "TX", zip: "75390", rating: 4.9, reviews: 356, distance: "3.2 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["internal medicine", "academic medicine", "complex cases"] },
  { id: 39, name: "Dr. Daniel Park", specialty: "Primary Care", specialtyId: "primary", clinic: "Parkland Health Dallas", address: "5201 Harry Hines Blvd, Dallas, TX 75235", city: "Dallas", state: "TX", zip: "75235", rating: 4.6, reviews: 234, distance: "3.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["community health", "preventive medicine", "chronic disease"] },
  // DALLAS, TX - Cardiology (3)
  { id: 40, name: "Dr. Elizabeth Taylor", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Baylor Heart Center", address: "621 N Hall St, Dallas, TX 75226", city: "Dallas", state: "TX", zip: "75226", rating: 4.9, reviews: 467, distance: "2.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "interventional cardiology", "heart surgery", "pacemaker"] },
  { id: 41, name: "Dr. Richard Hayes", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Texas Health Heart & Vascular", address: "8200 Walnut Hill Ln, Dallas, TX 75231", city: "Dallas", state: "TX", zip: "75231", rating: 4.8, reviews: 345, distance: "4.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["preventive cardiology", "cardiac imaging", "stress test"] },
  { id: 42, name: "Dr. Michelle Wong", specialty: "Cardiology", specialtyId: "cardiology", clinic: "UT Southwestern Cardiology", address: "5323 Harry Hines Blvd, Dallas, TX 75390", city: "Dallas", state: "TX", zip: "75390", rating: 5.0, reviews: 289, distance: "3.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["Group", "Individual"], keywords: ["heart failure", "transplant", "LVAD", "advanced heart"] },
  // DALLAS, TX - Pediatrics (3)
  { id: 43, name: "Dr. Thomas Anderson", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Children's Health Dallas", address: "1935 Medical District Dr, Dallas, TX 75235", city: "Dallas", state: "TX", zip: "75235", rating: 5.0, reviews: 612, distance: "3.2 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "infant", "adolescent", "pediatric specialty", "vaccines"] },
  { id: 44, name: "Dr. Sarah Collins", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Dallas Pediatric Associates", address: "7777 Forest Ln, Dallas, TX 75230", city: "Dallas", state: "TX", zip: "75230", rating: 4.9, reviews: 445, distance: "6.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["children", "kids", "well-child", "immunizations", "developmental"] },
  { id: 45, name: "Dr. Kevin Patel", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "UT Southwestern Pediatrics", address: "5323 Harry Hines Blvd, Dallas, TX 75390", city: "Dallas", state: "TX", zip: "75390", rating: 4.8, reviews: 378, distance: "3.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["Individual", "Group"], keywords: ["children", "kids", "infant", "complex conditions", "subspecialty"] },
  // DALLAS, TX - Orthopedics (3)
  { id: 46, name: "Dr. Nancy Wilson", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Texas Orthopedic Associates", address: "8230 Walnut Hill Ln, Dallas, TX 75231", city: "Dallas", state: "TX", zip: "75231", rating: 4.8, reviews: 234, distance: "4.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["bones", "joints", "spine", "knee", "hip", "shoulder surgery", "physical therapy"] },
  { id: 47, name: "Dr. Brian Foster", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "UT Southwestern Orthopedics", address: "1801 Inwood Rd, Dallas, TX 75390", city: "Dallas", state: "TX", zip: "75390", rating: 4.9, reviews: 289, distance: "3.8 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["sports medicine", "joint replacement", "trauma", "fracture care"] },
  { id: 48, name: "Dr. Laura Mitchell", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Dallas Orthopedic Specialists", address: "3600 Gaston Ave, Dallas, TX 75246", city: "Dallas", state: "TX", zip: "75246", rating: 4.6, reviews: 178, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["hand surgery", "wrist", "carpal tunnel", "arthritis"] },
  // DALLAS, TX - Neurology (3)
  { id: 49, name: "Dr. Richard Moore", specialty: "Neurology", specialtyId: "neurology", clinic: "UT Southwestern Neurology", address: "5323 Harry Hines Blvd, Dallas, TX 75390", city: "Dallas", state: "TX", zip: "75390", rating: 4.9, reviews: 378, distance: "3.8 mi", acceptingNew: true, nextAvailable: "Next Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["brain", "headache", "stroke", "epilepsy", "movement disorders", "dementia"] },
  { id: 50, name: "Dr. Jennifer Kim", specialty: "Neurology", specialtyId: "neurology", clinic: "Texas Health Neurology", address: "8200 Walnut Hill Ln, Dallas, TX 75231", city: "Dallas", state: "TX", zip: "75231", rating: 4.7, reviews: 234, distance: "4.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["ICHRA", "Individual"], keywords: ["migraine", "MS", "Parkinson's", "neuropathy"] },
  { id: 51, name: "Dr. Anthony Brooks", specialty: "Neurology", specialtyId: "neurology", clinic: "Baylor Neurology Dallas", address: "3600 Gaston Ave, Dallas, TX 75246", city: "Dallas", state: "TX", zip: "75246", rating: 4.8, reviews: 267, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["Group", "Individual"], keywords: ["epilepsy center", "seizure", "EEG", "brain monitoring"] },
  // DALLAS, TX - Ophthalmology (3)
  { id: 52, name: "Dr. Susan Clark", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Dallas Eye Associates", address: "3030 McKinnon St, Dallas, TX 75201", city: "Dallas", state: "TX", zip: "75201", rating: 4.7, reviews: 189, distance: "1.2 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["Group", "Individual"], keywords: ["eyes", "vision", "lasik", "cataracts", "dry eye", "contacts", "glasses"] },
  { id: 53, name: "Dr. Michael Stern", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "UT Southwestern Eye Center", address: "5323 Harry Hines Blvd, Dallas, TX 75390", city: "Dallas", state: "TX", zip: "75390", rating: 4.9, reviews: 312, distance: "3.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["retina", "macular degeneration", "diabetic retinopathy", "vitreous"] },
  { id: 54, name: "Dr. Amy Chen", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Texas Eye Institute Dallas", address: "8440 Walnut Hill Ln, Dallas, TX 75231", city: "Dallas", state: "TX", zip: "75231", rating: 4.8, reviews: 234, distance: "4.6 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["glaucoma", "cornea", "cataract surgery", "lens implants"] },

  // SAN ANTONIO, TX - Primary Care (3)
  { id: 55, name: "Dr. Daniel Harris", specialty: "Primary Care", specialtyId: "primary", clinic: "San Antonio Family Practice", address: "7703 Floyd Curl Dr, San Antonio, TX 78229", city: "San Antonio", state: "TX", zip: "78229", rating: 4.8, reviews: 356, distance: "2.1 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "wellness", "checkup", "preventive care", "geriatric"] },
  { id: 56, name: "Dr. Maria Santos", specialty: "Primary Care", specialtyId: "primary", clinic: "University Health Primary Care", address: "4502 Medical Dr, San Antonio, TX 78229", city: "San Antonio", state: "TX", zip: "78229", rating: 4.7, reviews: 289, distance: "2.3 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["bilingual", "Spanish speaking", "community health", "diabetes"] },
  { id: 57, name: "Dr. Robert Martinez", specialty: "Primary Care", specialtyId: "primary", clinic: "Methodist Hospital Primary", address: "7700 Floyd Curl Dr, San Antonio, TX 78229", city: "San Antonio", state: "TX", zip: "78229", rating: 4.6, reviews: 234, distance: "2.2 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["Group", "Individual"], keywords: ["internal medicine", "chronic disease management", "wellness exams"] },
  // SAN ANTONIO, TX - Cardiology (3)
  { id: 58, name: "Dr. Karen Martinez", specialty: "Cardiology", specialtyId: "cardiology", clinic: "South Texas Cardiology", address: "4411 Medical Dr, San Antonio, TX 78229", city: "San Antonio", state: "TX", zip: "78229", rating: 4.7, reviews: 234, distance: "2.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "heart failure", "cardiac rehab", "echocardiogram"] },
  { id: 59, name: "Dr. William Reyes", specialty: "Cardiology", specialtyId: "cardiology", clinic: "UT Health SA Cardiology", address: "7703 Floyd Curl Dr, San Antonio, TX 78229", city: "San Antonio", state: "TX", zip: "78229", rating: 4.9, reviews: 312, distance: "2.1 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["interventional cardiology", "cardiac catheterization", "stents"] },
  { id: 60, name: "Dr. Patricia Hill", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Methodist Heart Center", address: "7700 Floyd Curl Dr, San Antonio, TX 78229", city: "San Antonio", state: "TX", zip: "78229", rating: 4.8, reviews: 267, distance: "2.2 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["Group", "Individual"], keywords: ["electrophysiology", "arrhythmia", "pacemaker", "AFib ablation"] },
  // SAN ANTONIO, TX - Pediatrics (3)
  { id: 61, name: "Dr. Jose Rodriguez", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Alamo Children's Clinic", address: "333 N Santa Rosa St, San Antonio, TX 78207", city: "San Antonio", state: "TX", zip: "78207", rating: 4.9, reviews: 445, distance: "1.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "bilingual", "Spanish speaking", "pediatric", "vaccines"] },
  { id: 62, name: "Dr. Amanda Garcia", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Children's Hospital SA", address: "333 N Santa Rosa St, San Antonio, TX 78207", city: "San Antonio", state: "TX", zip: "78207", rating: 5.0, reviews: 534, distance: "1.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["children", "kids", "infant", "specialty care", "chronic conditions"] },
  { id: 63, name: "Dr. Thomas Rivera", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "UT Health Pediatrics SA", address: "7703 Floyd Curl Dr, San Antonio, TX 78229", city: "San Antonio", state: "TX", zip: "78229", rating: 4.8, reviews: 378, distance: "2.1 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Individual", "Group"], keywords: ["children", "kids", "developmental", "ADHD", "autism evaluation"] },
  // SAN ANTONIO, TX - Orthopedics (3)
  { id: 64, name: "Dr. Michelle Lewis", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Ortho San Antonio", address: "400 Concord Plaza Dr, San Antonio, TX 78216", city: "San Antonio", state: "TX", zip: "78216", rating: 4.6, reviews: 178, distance: "4.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["bones", "joints", "sports medicine", "fractures", "physical therapy"] },
  { id: 65, name: "Dr. Steven Wright", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "SA Ortho Specialists", address: "18600 Hardy Oak Blvd, San Antonio, TX 78258", city: "San Antonio", state: "TX", zip: "78258", rating: 4.8, reviews: 234, distance: "8.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["joint replacement", "knee", "hip", "robotic surgery"] },
  { id: 66, name: "Dr. Jennifer Young", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "UT Health Orthopedics SA", address: "7703 Floyd Curl Dr, San Antonio, TX 78229", city: "San Antonio", state: "TX", zip: "78229", rating: 4.7, reviews: 189, distance: "2.1 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["Group", "Individual"], keywords: ["sports injury", "ACL", "shoulder", "spine"] },
  // SAN ANTONIO, TX - Neurology (3)
  { id: 67, name: "Dr. Brian Jackson", specialty: "Neurology", specialtyId: "neurology", clinic: "UT Health San Antonio Neurology", address: "7703 Floyd Curl Dr, San Antonio, TX 78229", city: "San Antonio", state: "TX", zip: "78229", rating: 4.8, reviews: 267, distance: "2.1 mi", acceptingNew: true, nextAvailable: "Next Week", price: "$$$", insurances: ["ICHRA", "Individual"], keywords: ["brain", "headache", "migraine", "stroke", "epilepsy", "memory loss"] },
  { id: 68, name: "Dr. Catherine Adams", specialty: "Neurology", specialtyId: "neurology", clinic: "South Texas Neurology", address: "4411 Medical Dr, San Antonio, TX 78229", city: "San Antonio", state: "TX", zip: "78229", rating: 4.7, reviews: 198, distance: "2.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["Parkinson's", "tremor", "movement disorders", "MS"] },
  { id: 69, name: "Dr. David Phillips", specialty: "Neurology", specialtyId: "neurology", clinic: "Methodist Neurosciences", address: "7700 Floyd Curl Dr, San Antonio, TX 78229", city: "San Antonio", state: "TX", zip: "78229", rating: 4.9, reviews: 234, distance: "2.2 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["Group", "Individual"], keywords: ["stroke center", "neurosurgery", "brain tumor", "spine"] },
  // SAN ANTONIO, TX - Ophthalmology (3)
  { id: 70, name: "Dr. Laura White", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "San Antonio Eye Center", address: "311 Camden St, San Antonio, TX 78215", city: "San Antonio", state: "TX", zip: "78215", rating: 4.7, reviews: 145, distance: "0.8 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["eyes", "vision", "cataracts", "glaucoma", "diabetic eye care"] },
  { id: 71, name: "Dr. Michael Torres", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Eye Institute of SA", address: "7940 Floyd Curl Dr, San Antonio, TX 78229", city: "San Antonio", state: "TX", zip: "78229", rating: 4.9, reviews: 267, distance: "2.3 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["retina", "macular degeneration", "lasik", "refractive surgery"] },
  { id: 72, name: "Dr. Susan Brown", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "SA Eye Specialists", address: "8550 Datapoint Dr, San Antonio, TX 78229", city: "San Antonio", state: "TX", zip: "78229", rating: 4.6, reviews: 178, distance: "2.8 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["eye exam", "glasses", "contacts", "routine care"] },

  // FORT WORTH, TX - All specialties (3 each)
  { id: 73, name: "Dr. Mark Robinson", specialty: "Primary Care", specialtyId: "primary", clinic: "Fort Worth Medical Group", address: "1325 Pennsylvania Ave, Fort Worth, TX 76104", city: "Fort Worth", state: "TX", zip: "76104", rating: 4.7, reviews: 267, distance: "1.8 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "wellness", "checkup", "chronic disease management"] },
  { id: 74, name: "Dr. Linda Foster", specialty: "Primary Care", specialtyId: "primary", clinic: "Texas Health Primary Care", address: "1400 8th Ave, Fort Worth, TX 76104", city: "Fort Worth", state: "TX", zip: "76104", rating: 4.8, reviews: 234, distance: "1.9 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["internal medicine", "preventive health", "wellness exams"] },
  { id: 75, name: "Dr. Carlos Mendez", specialty: "Primary Care", specialtyId: "primary", clinic: "JPS Health Fort Worth", address: "1500 S Main St, Fort Worth, TX 76104", city: "Fort Worth", state: "TX", zip: "76104", rating: 4.5, reviews: 189, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["Individual", "Group"], keywords: ["community health", "bilingual", "Spanish speaking"] },
  { id: 76, name: "Dr. Jennifer Scott", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Texas Health Heart & Vascular", address: "1301 Pennsylvania Ave, Fort Worth, TX 76104", city: "Fort Worth", state: "TX", zip: "76104", rating: 4.8, reviews: 198, distance: "1.8 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "cardiac imaging", "heart rhythm", "preventive cardiology"] },
  { id: 77, name: "Dr. Richard Adams", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Baylor Heart Fort Worth", address: "1400 8th Ave, Fort Worth, TX 76104", city: "Fort Worth", state: "TX", zip: "76104", rating: 4.9, reviews: 234, distance: "1.9 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["interventional", "stents", "heart attack", "cardiac cath"] },
  { id: 78, name: "Dr. Patricia Lane", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Medical City Heart Fort Worth", address: "900 8th Ave, Fort Worth, TX 76104", city: "Fort Worth", state: "TX", zip: "76104", rating: 4.7, reviews: 167, distance: "1.7 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["Group", "Individual"], keywords: ["heart failure", "echocardiogram", "stress test"] },
  { id: 79, name: "Dr. Andrew Young", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Cook Children's Pediatrics", address: "801 7th Ave, Fort Worth, TX 76104", city: "Fort Worth", state: "TX", zip: "76104", rating: 5.0, reviews: 534, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "infant", "pediatric specialty", "childhood illness"] },
  { id: 80, name: "Dr. Emily Chen", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Fort Worth Pediatric Group", address: "1650 W Magnolia Ave, Fort Worth, TX 76104", city: "Fort Worth", state: "TX", zip: "76104", rating: 4.9, reviews: 389, distance: "2.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["children", "kids", "newborn", "vaccines", "well-child"] },
  { id: 81, name: "Dr. Michael Brooks", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Texas Health Pediatrics FW", address: "1400 8th Ave, Fort Worth, TX 76104", city: "Fort Worth", state: "TX", zip: "76104", rating: 4.8, reviews: 312, distance: "1.9 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Individual", "Group"], keywords: ["children", "adolescent", "teen", "developmental"] },
  { id: 82, name: "Dr. William Hayes", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Texas Health Orthopedics FW", address: "1301 Pennsylvania Ave, Fort Worth, TX 76104", city: "Fort Worth", state: "TX", zip: "76104", rating: 4.7, reviews: 198, distance: "1.8 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["bones", "joints", "sports", "knee", "hip"] },
  { id: 83, name: "Dr. Sarah Miller", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Fort Worth Bone & Joint", address: "6301 Harris Pkwy, Fort Worth, TX 76132", city: "Fort Worth", state: "TX", zip: "76132", rating: 4.8, reviews: 245, distance: "5.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["joint replacement", "spine", "fractures", "trauma"] },
  { id: 84, name: "Dr. Kevin Park", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Medical City Orthopedics", address: "900 8th Ave, Fort Worth, TX 76104", city: "Fort Worth", state: "TX", zip: "76104", rating: 4.6, reviews: 167, distance: "1.7 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["Group", "Individual"], keywords: ["hand surgery", "shoulder", "sports injury"] },
  { id: 85, name: "Dr. Nancy Stewart", specialty: "Neurology", specialtyId: "neurology", clinic: "Texas Health Neurology FW", address: "1400 8th Ave, Fort Worth, TX 76104", city: "Fort Worth", state: "TX", zip: "76104", rating: 4.7, reviews: 178, distance: "1.9 mi", acceptingNew: true, nextAvailable: "Next Week", price: "$$$", insurances: ["ICHRA", "Individual"], keywords: ["brain", "headache", "migraine", "stroke"] },
  { id: 86, name: "Dr. Thomas Wright", specialty: "Neurology", specialtyId: "neurology", clinic: "Fort Worth Brain & Spine", address: "1325 Pennsylvania Ave, Fort Worth, TX 76104", city: "Fort Worth", state: "TX", zip: "76104", rating: 4.8, reviews: 198, distance: "1.8 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["epilepsy", "Parkinson's", "MS", "neuropathy"] },
  { id: 87, name: "Dr. Rachel Kim", specialty: "Neurology", specialtyId: "neurology", clinic: "Cook Children's Neurology", address: "801 7th Ave, Fort Worth, TX 76104", city: "Fort Worth", state: "TX", zip: "76104", rating: 4.9, reviews: 234, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["Group", "Individual"], keywords: ["pediatric neurology", "seizures", "developmental", "autism"] },
  { id: 88, name: "Dr. James Foster", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Fort Worth Eye Associates", address: "1650 W Magnolia Ave, Fort Worth, TX 76104", city: "Fort Worth", state: "TX", zip: "76104", rating: 4.7, reviews: 156, distance: "2.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["eyes", "vision", "cataracts", "glaucoma"] },
  { id: 89, name: "Dr. Amanda Lee", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Texas Eye Center FW", address: "6100 Harris Pkwy, Fort Worth, TX 76132", city: "Fort Worth", state: "TX", zip: "76132", rating: 4.8, reviews: 198, distance: "5.3 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["lasik", "PRK", "refractive surgery", "dry eye"] },
  { id: 90, name: "Dr. David Chen", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Retina Specialists FW", address: "1301 Pennsylvania Ave, Fort Worth, TX 76104", city: "Fort Worth", state: "TX", zip: "76104", rating: 4.9, reviews: 234, distance: "1.8 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["retina", "macular degeneration", "diabetic eye", "injections"] },

  // MIAMI, FL - All specialties (3 each)
  { id: 91, name: "Dr. Carlos Fernandez", specialty: "Primary Care", specialtyId: "primary", clinic: "Miami Family Health", address: "1611 NW 12th Ave, Miami, FL 33136", city: "Miami", state: "FL", zip: "33136", rating: 4.8, reviews: 389, distance: "1.2 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "bilingual", "Spanish speaking", "wellness", "preventive care"] },
  { id: 92, name: "Dr. Maria Santos", specialty: "Primary Care", specialtyId: "primary", clinic: "Jackson Health Primary", address: "1611 NW 12th Ave, Miami, FL 33136", city: "Miami", state: "FL", zip: "33136", rating: 4.7, reviews: 312, distance: "1.2 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["community health", "Spanish", "Portuguese", "Creole speaking"] },
  { id: 93, name: "Dr. Robert Cohen", specialty: "Primary Care", specialtyId: "primary", clinic: "UM Health Primary Care", address: "1120 NW 14th St, Miami, FL 33136", city: "Miami", state: "FL", zip: "33136", rating: 4.9, reviews: 356, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["internal medicine", "academic center", "complex care"] },
  { id: 94, name: "Dr. Rachel Cohen", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Miami Cardiac & Vascular Institute", address: "8900 N Kendall Dr, Miami, FL 33176", city: "Miami", state: "FL", zip: "33176", rating: 4.9, reviews: 456, distance: "5.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "heart surgery", "valve repair", "cardiac imaging"] },
  { id: 95, name: "Dr. Antonio Perez", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Jackson Heart Institute", address: "1611 NW 12th Ave, Miami, FL 33136", city: "Miami", state: "FL", zip: "33136", rating: 4.8, reviews: 378, distance: "1.2 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["interventional", "structural heart", "TAVR", "heart transplant"] },
  { id: 96, name: "Dr. Michelle Green", specialty: "Cardiology", specialtyId: "cardiology", clinic: "UM Cardiology", address: "1120 NW 14th St, Miami, FL 33136", city: "Miami", state: "FL", zip: "33136", rating: 5.0, reviews: 289, distance: "1.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["Group", "Individual"], keywords: ["electrophysiology", "AFib", "pacemaker", "defibrillator"] },
  { id: 97, name: "Dr. Sofia Hernandez", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Nicklaus Children's Primary Care", address: "3100 SW 62nd Ave, Miami, FL 33155", city: "Miami", state: "FL", zip: "33155", rating: 5.0, reviews: 678, distance: "3.2 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "bilingual", "Spanish", "pediatric", "tropical medicine"] },
  { id: 98, name: "Dr. David Martinez", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Miami Children's Health", address: "3200 SW 60th Ct, Miami, FL 33155", city: "Miami", state: "FL", zip: "33155", rating: 4.9, reviews: 534, distance: "3.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["children", "kids", "infant", "vaccines", "developmental"] },
  { id: 99, name: "Dr. Jennifer Lopez", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Jackson Holtz Children's", address: "1611 NW 12th Ave, Miami, FL 33136", city: "Miami", state: "FL", zip: "33136", rating: 4.8, reviews: 445, distance: "1.2 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Individual", "Group"], keywords: ["children", "kids", "subspecialty", "complex care", "NICU"] },
  { id: 100, name: "Dr. Michael Stein", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Miami Orthopedics & Sports Medicine", address: "5000 University Dr, Coral Gables, FL 33146", city: "Miami", state: "FL", zip: "33146", rating: 4.7, reviews: 234, distance: "4.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["bones", "joints", "sports injury", "knee", "shoulder", "arthroscopy"] },
  { id: 101, name: "Dr. Ricardo Garcia", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "UM Sports Medicine", address: "1120 NW 14th St, Miami, FL 33136", city: "Miami", state: "FL", zip: "33136", rating: 4.9, reviews: 312, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["sports medicine", "team physician", "shoulder", "knee", "ankle"] },
  { id: 102, name: "Dr. Sarah Mitchell", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Jackson Orthopedics", address: "1611 NW 12th Ave, Miami, FL 33136", city: "Miami", state: "FL", zip: "33136", rating: 4.6, reviews: 189, distance: "1.2 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["Group", "Individual"], keywords: ["joint replacement", "hip", "knee", "trauma", "fractures"] },
  { id: 103, name: "Dr. Diana Rodriguez", specialty: "Neurology", specialtyId: "neurology", clinic: "University of Miami Neurology", address: "1150 NW 14th St, Miami, FL 33136", city: "Miami", state: "FL", zip: "33136", rating: 4.8, reviews: 289, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Next Week", price: "$$$", insurances: ["ICHRA", "Individual"], keywords: ["brain", "headache", "stroke", "memory", "movement disorders", "neurological"] },
  { id: 104, name: "Dr. Benjamin Park", specialty: "Neurology", specialtyId: "neurology", clinic: "Jackson Neuroscience", address: "1611 NW 12th Ave, Miami, FL 33136", city: "Miami", state: "FL", zip: "33136", rating: 4.9, reviews: 267, distance: "1.2 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["epilepsy center", "seizures", "brain surgery", "deep brain stimulation"] },
  { id: 105, name: "Dr. Laura Chen", specialty: "Neurology", specialtyId: "neurology", clinic: "Baptist Neurology Miami", address: "8900 N Kendall Dr, Miami, FL 33176", city: "Miami", state: "FL", zip: "33176", rating: 4.7, reviews: 198, distance: "5.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["migraine", "MS", "Parkinson's", "dementia"] },
  { id: 106, name: "Dr. Alan Goldberg", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Bascom Palmer Eye Institute", address: "900 NW 17th St, Miami, FL 33136", city: "Miami", state: "FL", zip: "33136", rating: 5.0, reviews: 567, distance: "1.8 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["eyes", "vision", "retina", "cornea", "glaucoma", "world renowned"] },
  { id: 107, name: "Dr. Maria Gonzalez", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Bascom Palmer Retina", address: "900 NW 17th St, Miami, FL 33136", city: "Miami", state: "FL", zip: "33136", rating: 4.9, reviews: 445, distance: "1.8 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["retina", "macular degeneration", "diabetic retinopathy", "retinal detachment"] },
  { id: 108, name: "Dr. James Wright", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Miami Eye Center", address: "8940 N Kendall Dr, Miami, FL 33176", city: "Miami", state: "FL", zip: "33176", rating: 4.7, reviews: 234, distance: "5.6 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["Individual", "Group"], keywords: ["eye exam", "glasses", "contacts", "lasik", "cataract surgery"] },

  // ORLANDO, FL - All specialties (3 each)
  { id: 109, name: "Dr. Timothy Baker", specialty: "Primary Care", specialtyId: "primary", clinic: "Orlando Health Physician Group", address: "1414 Kuhl Ave, Orlando, FL 32806", city: "Orlando", state: "FL", zip: "32806", rating: 4.7, reviews: 312, distance: "2.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "internal medicine", "wellness", "checkup"] },
  { id: 110, name: "Dr. Michelle Davis", specialty: "Primary Care", specialtyId: "primary", clinic: "AdventHealth Primary Orlando", address: "601 E Rollins St, Orlando, FL 32803", city: "Orlando", state: "FL", zip: "32803", rating: 4.8, reviews: 289, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["preventive care", "chronic disease", "diabetes", "wellness exams"] },
  { id: 111, name: "Dr. Robert Torres", specialty: "Primary Care", specialtyId: "primary", clinic: "UCF Health Orlando", address: "6850 Lake Nona Blvd, Orlando, FL 32827", city: "Orlando", state: "FL", zip: "32827", rating: 4.6, reviews: 234, distance: "8.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["Individual", "Group"], keywords: ["family medicine", "sports physicals", "student health"] },
  { id: 112, name: "Dr. Catherine Hill", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Heart of Florida Cardiology", address: "1222 S Orange Ave, Orlando, FL 32806", city: "Orlando", state: "FL", zip: "32806", rating: 4.8, reviews: 234, distance: "1.8 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "heart rhythm", "preventive cardiology", "echo"] },
  { id: 113, name: "Dr. William Foster", specialty: "Cardiology", specialtyId: "cardiology", clinic: "AdventHealth Heart Institute", address: "601 E Rollins St, Orlando, FL 32803", city: "Orlando", state: "FL", zip: "32803", rating: 4.9, reviews: 312, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["interventional", "heart surgery", "valve repair", "TAVR"] },
  { id: 114, name: "Dr. Sandra Lee", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Orlando Health Heart", address: "1414 Kuhl Ave, Orlando, FL 32806", city: "Orlando", state: "FL", zip: "32806", rating: 4.7, reviews: 189, distance: "2.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["Group", "Individual"], keywords: ["heart failure", "cardiac rehab", "pacemaker"] },
  { id: 115, name: "Dr. Benjamin Cruz", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Arnold Palmer Children's Health", address: "92 W Miller St, Orlando, FL 32806", city: "Orlando", state: "FL", zip: "32806", rating: 5.0, reviews: 489, distance: "2.2 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "infant", "pediatric specialty", "childhood diseases"] },
  { id: 116, name: "Dr. Jennifer Park", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Nemours Children's Orlando", address: "13535 Nemours Pkwy, Orlando, FL 32827", city: "Orlando", state: "FL", zip: "32827", rating: 4.9, reviews: 567, distance: "9.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["children", "kids", "subspecialty", "complex conditions", "chronic illness"] },
  { id: 117, name: "Dr. David Miller", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Orlando Pediatric Group", address: "400 Celebration Pl, Celebration, FL 34747", city: "Orlando", state: "FL", zip: "34747", rating: 4.8, reviews: 345, distance: "12.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Individual", "Group"], keywords: ["children", "kids", "well-child", "vaccines", "developmental"] },
  { id: 118, name: "Dr. Stephanie King", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Jewett Orthopedic Clinic", address: "1285 Orange Ave, Orlando, FL 32806", city: "Orlando", state: "FL", zip: "32806", rating: 4.6, reviews: 178, distance: "1.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["bones", "joints", "sports", "knee surgery", "hip replacement"] },
  { id: 119, name: "Dr. Michael Brooks", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Orlando Health Orthopedics", address: "1414 Kuhl Ave, Orlando, FL 32806", city: "Orlando", state: "FL", zip: "32806", rating: 4.8, reviews: 267, distance: "2.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["joint replacement", "trauma", "spine surgery", "fractures"] },
  { id: 120, name: "Dr. Patricia Adams", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Florida Ortho Institute Orlando", address: "2500 W Oak Ridge Rd, Orlando, FL 32809", city: "Orlando", state: "FL", zip: "32809", rating: 4.7, reviews: 198, distance: "4.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["Group", "Individual"], keywords: ["sports medicine", "shoulder", "knee", "ankle", "foot"] },
  { id: 121, name: "Dr. Gregory Adams", specialty: "Neurology", specialtyId: "neurology", clinic: "Orlando Neurology Associates", address: "21 W Columbia St, Orlando, FL 32806", city: "Orlando", state: "FL", zip: "32806", rating: 4.7, reviews: 156, distance: "2.0 mi", acceptingNew: true, nextAvailable: "Next Week", price: "$$$", insurances: ["ICHRA", "Individual"], keywords: ["brain", "headache", "migraine", "stroke", "seizure", "Parkinson's"] },
  { id: 122, name: "Dr. Sarah Wright", specialty: "Neurology", specialtyId: "neurology", clinic: "AdventHealth Neuroscience", address: "601 E Rollins St, Orlando, FL 32803", city: "Orlando", state: "FL", zip: "32803", rating: 4.8, reviews: 234, distance: "1.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["stroke center", "epilepsy", "MS", "movement disorders"] },
  { id: 123, name: "Dr. Thomas Chen", specialty: "Neurology", specialtyId: "neurology", clinic: "Orlando Health Neurology", address: "1414 Kuhl Ave, Orlando, FL 32806", city: "Orlando", state: "FL", zip: "32806", rating: 4.6, reviews: 178, distance: "2.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["headache center", "neuropathy", "memory", "dementia"] },
  { id: 124, name: "Dr. Nicole Turner", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Center for Sight Orlando", address: "6900 Turkey Lake Rd, Orlando, FL 32819", city: "Orlando", state: "FL", zip: "32819", rating: 4.8, reviews: 234, distance: "5.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["eyes", "vision", "lasik", "cataracts", "dry eye", "contacts"] },
  { id: 125, name: "Dr. Richard Green", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Florida Retina Institute", address: "7500 Southland Blvd, Orlando, FL 32809", city: "Orlando", state: "FL", zip: "32809", rating: 4.9, reviews: 289, distance: "4.2 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["retina", "macular degeneration", "diabetic eye", "vitreous"] },
  { id: 126, name: "Dr. Lisa Wong", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Orlando Eye Care", address: "1222 S Orange Ave, Orlando, FL 32806", city: "Orlando", state: "FL", zip: "32806", rating: 4.6, reviews: 167, distance: "1.8 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["eye exam", "glasses", "contacts", "routine vision"] },

  // TAMPA, FL - All specialties (3 each)
  { id: 127, name: "Dr. Robert Phillips", specialty: "Primary Care", specialtyId: "primary", clinic: "Tampa General Medical Group", address: "1 Tampa General Cir, Tampa, FL 33606", city: "Tampa", state: "FL", zip: "33606", rating: 4.8, reviews: 345, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "wellness", "checkup", "preventive care", "chronic care"] },
  { id: 128, name: "Dr. Maria Lopez", specialty: "Primary Care", specialtyId: "primary", clinic: "BayCare Primary Tampa", address: "2985 Drew St, Clearwater, FL 33759", city: "Tampa", state: "FL", zip: "33759", rating: 4.7, reviews: 289, distance: "8.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["family medicine", "Spanish speaking", "bilingual"] },
  { id: 129, name: "Dr. William Chen", specialty: "Primary Care", specialtyId: "primary", clinic: "USF Health Primary Care", address: "13330 USF Laurel Dr, Tampa, FL 33612", city: "Tampa", state: "FL", zip: "33612", rating: 4.6, reviews: 234, distance: "6.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["Group", "Individual"], keywords: ["academic medicine", "internal medicine", "complex care"] },
  { id: 130, name: "Dr. Victoria Campbell", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Tampa Heart Institute", address: "2727 W Martin Luther King Jr Blvd, Tampa, FL 33607", city: "Tampa", state: "FL", zip: "33607", rating: 4.9, reviews: 389, distance: "3.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "heart failure", "cardiac surgery", "valve replacement"] },
  { id: 131, name: "Dr. James Martin", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Tampa General Cardiology", address: "1 Tampa General Cir, Tampa, FL 33606", city: "Tampa", state: "FL", zip: "33606", rating: 4.8, reviews: 312, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["interventional", "structural heart", "TAVR", "heart transplant"] },
  { id: 132, name: "Dr. Patricia Kim", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Moffitt Cardio-Oncology", address: "12902 USF Magnolia Dr, Tampa, FL 33612", city: "Tampa", state: "FL", zip: "33612", rating: 5.0, reviews: 234, distance: "6.2 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["Group", "Individual"], keywords: ["cardio-oncology", "cancer heart care", "specialized cardiology"] },
  { id: 133, name: "Dr. Anthony Mitchell", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "St. Joseph's Children's Hospital", address: "3001 W Martin Luther King Jr Blvd, Tampa, FL 33607", city: "Tampa", state: "FL", zip: "33607", rating: 5.0, reviews: 512, distance: "3.2 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "infant", "pediatric", "childhood illness", "vaccines"] },
  { id: 134, name: "Dr. Jennifer Adams", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Tampa Pediatrics Group", address: "500 E Jackson St, Tampa, FL 33602", city: "Tampa", state: "FL", zip: "33602", rating: 4.9, reviews: 389, distance: "0.8 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["children", "kids", "newborn", "well-child", "immunizations"] },
  { id: 135, name: "Dr. David Wright", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "USF Pediatrics", address: "13330 USF Laurel Dr, Tampa, FL 33612", city: "Tampa", state: "FL", zip: "33612", rating: 4.8, reviews: 312, distance: "6.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Individual", "Group"], keywords: ["children", "kids", "subspecialty", "developmental", "chronic conditions"] },
  { id: 136, name: "Dr. Linda Perez", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Florida Orthopaedic Institute", address: "13020 N Telecom Pkwy, Temple Terrace, FL 33637", city: "Tampa", state: "FL", zip: "33637", rating: 4.7, reviews: 267, distance: "8.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["bones", "joints", "spine", "sports medicine", "fractures", "arthritis"] },
  { id: 137, name: "Dr. Michael Foster", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Tampa General Orthopedics", address: "1 Tampa General Cir, Tampa, FL 33606", city: "Tampa", state: "FL", zip: "33606", rating: 4.9, reviews: 312, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["joint replacement", "hip", "knee", "robotic surgery", "trauma"] },
  { id: 138, name: "Dr. Sarah Brooks", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "BayCare Orthopedics", address: "2727 W Martin Luther King Jr Blvd, Tampa, FL 33607", city: "Tampa", state: "FL", zip: "33607", rating: 4.6, reviews: 198, distance: "3.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["Group", "Individual"], keywords: ["sports injury", "shoulder", "hand surgery", "foot ankle"] },
  { id: 139, name: "Dr. Edward Collins", specialty: "Neurology", specialtyId: "neurology", clinic: "USF Health Neurology", address: "2 Tampa General Cir, Tampa, FL 33606", city: "Tampa", state: "FL", zip: "33606", rating: 4.8, reviews: 198, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Next Week", price: "$$$", insurances: ["ICHRA", "Individual"], keywords: ["brain", "headache", "stroke", "epilepsy", "dementia", "movement disorders"] },
  { id: 140, name: "Dr. Nancy Lee", specialty: "Neurology", specialtyId: "neurology", clinic: "Tampa Neurology Associates", address: "500 E Jackson St, Tampa, FL 33602", city: "Tampa", state: "FL", zip: "33602", rating: 4.7, reviews: 167, distance: "0.8 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["migraine", "MS", "Parkinson's", "neuropathy"] },
  { id: 141, name: "Dr. Kevin Park", specialty: "Neurology", specialtyId: "neurology", clinic: "Moffitt Neuro-Oncology", address: "12902 USF Magnolia Dr, Tampa, FL 33612", city: "Tampa", state: "FL", zip: "33612", rating: 5.0, reviews: 289, distance: "6.2 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["Group", "Individual"], keywords: ["brain tumor", "neuro-oncology", "cancer", "specialized neurology"] },
  { id: 142, name: "Dr. Samantha Reed", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Tampa Bay Eye Institute", address: "3030 N Rocky Point Dr W, Tampa, FL 33607", city: "Tampa", state: "FL", zip: "33607", rating: 4.7, reviews: 178, distance: "4.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["eyes", "vision", "cataracts", "glaucoma", "retina", "diabetic eye"] },
  { id: 143, name: "Dr. Richard Stone", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Florida Eye Center Tampa", address: "2727 W Martin Luther King Jr Blvd, Tampa, FL 33607", city: "Tampa", state: "FL", zip: "33607", rating: 4.9, reviews: 267, distance: "3.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["retina", "macular degeneration", "lasik", "refractive surgery"] },
  { id: 144, name: "Dr. Amy Chang", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "USF Eye Center", address: "13330 USF Laurel Dr, Tampa, FL 33612", city: "Tampa", state: "FL", zip: "33612", rating: 4.6, reviews: 145, distance: "6.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["eye exam", "glasses", "contacts", "cornea", "oculoplastics"] },

  // JACKSONVILLE, FL - All specialties (3 each)
  { id: 145, name: "Dr. Christopher Wood", specialty: "Primary Care", specialtyId: "primary", clinic: "Baptist Primary Care", address: "800 Prudential Dr, Jacksonville, FL 32207", city: "Jacksonville", state: "FL", zip: "32207", rating: 4.7, reviews: 289, distance: "2.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "wellness", "checkup", "preventive", "geriatric care"] },
  { id: 146, name: "Dr. Maria Santos", specialty: "Primary Care", specialtyId: "primary", clinic: "Mayo Clinic Primary Jax", address: "4500 San Pablo Rd S, Jacksonville, FL 32224", city: "Jacksonville", state: "FL", zip: "32224", rating: 5.0, reviews: 456, distance: "12.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["executive health", "comprehensive exams", "Mayo Clinic", "world class"] },
  { id: 147, name: "Dr. James Brown", specialty: "Primary Care", specialtyId: "primary", clinic: "UF Health Jax Primary", address: "653 W 8th St, Jacksonville, FL 32209", city: "Jacksonville", state: "FL", zip: "32209", rating: 4.6, reviews: 234, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$", insurances: ["Individual", "Group"], keywords: ["academic medicine", "community health", "internal medicine"] },
  { id: 148, name: "Dr. Michelle Barnes", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Baptist Heart Specialists", address: "836 Prudential Dr, Jacksonville, FL 32207", city: "Jacksonville", state: "FL", zip: "32207", rating: 4.8, reviews: 234, distance: "2.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "heart failure", "cardiac rehab", "echocardiogram"] },
  { id: 149, name: "Dr. William Foster", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Mayo Clinic Cardiology Jax", address: "4500 San Pablo Rd S, Jacksonville, FL 32224", city: "Jacksonville", state: "FL", zip: "32224", rating: 5.0, reviews: 389, distance: "12.0 mi", acceptingNew: true, nextAvailable: "2 Weeks", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["interventional", "structural heart", "heart transplant", "Mayo Clinic"] },
  { id: 150, name: "Dr. Patricia Kim", specialty: "Cardiology", specialtyId: "cardiology", clinic: "UF Health Cardiology Jax", address: "653 W 8th St, Jacksonville, FL 32209", city: "Jacksonville", state: "FL", zip: "32209", rating: 4.7, reviews: 198, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["heart failure", "preventive cardiology", "cardiac imaging"] },
  { id: 151, name: "Dr. Jason Rivera", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Wolfson Children's Hospital", address: "800 Prudential Dr, Jacksonville, FL 32207", city: "Jacksonville", state: "FL", zip: "32207", rating: 5.0, reviews: 456, distance: "2.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "infant", "pediatric", "childhood diseases", "vaccines"] },
  { id: 152, name: "Dr. Jennifer Chen", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Nemours Children's Jax", address: "807 Children's Way, Jacksonville, FL 32207", city: "Jacksonville", state: "FL", zip: "32207", rating: 4.9, reviews: 534, distance: "2.2 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["children", "kids", "subspecialty", "chronic illness", "complex care"] },
  { id: 153, name: "Dr. Michael Wright", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Jacksonville Pediatric Group", address: "4131 University Blvd S, Jacksonville, FL 32216", city: "Jacksonville", state: "FL", zip: "32216", rating: 4.8, reviews: 312, distance: "5.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Individual", "Group"], keywords: ["children", "kids", "well-child", "vaccines", "developmental"] },
  { id: 154, name: "Dr. Amanda Green", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Jacksonville Orthopaedic Institute", address: "1325 San Marco Blvd, Jacksonville, FL 32207", city: "Jacksonville", state: "FL", zip: "32207", rating: 4.6, reviews: 189, distance: "2.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["bones", "joints", "sports", "knee", "hip", "shoulder", "spine surgery"] },
  { id: 155, name: "Dr. Robert Hayes", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Mayo Clinic Orthopedics Jax", address: "4500 San Pablo Rd S, Jacksonville, FL 32224", city: "Jacksonville", state: "FL", zip: "32224", rating: 5.0, reviews: 345, distance: "12.0 mi", acceptingNew: true, nextAvailable: "2 Weeks", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["joint replacement", "spine surgery", "Mayo Clinic", "complex orthopedics"] },
  { id: 156, name: "Dr. Sarah Miller", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Baptist Orthopedics Jax", address: "836 Prudential Dr, Jacksonville, FL 32207", city: "Jacksonville", state: "FL", zip: "32207", rating: 4.7, reviews: 234, distance: "2.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["sports medicine", "fractures", "trauma", "hand surgery"] },
  { id: 157, name: "Dr. Paul Stewart", specialty: "Neurology", specialtyId: "neurology", clinic: "Mayo Clinic Neurology Jacksonville", address: "4500 San Pablo Rd S, Jacksonville, FL 32224", city: "Jacksonville", state: "FL", zip: "32224", rating: 5.0, reviews: 423, distance: "12.0 mi", acceptingNew: true, nextAvailable: "2 Weeks", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["brain", "headache", "stroke", "epilepsy", "world class", "Mayo Clinic"] },
  { id: 158, name: "Dr. Linda Foster", specialty: "Neurology", specialtyId: "neurology", clinic: "Baptist Neurology Jax", address: "800 Prudential Dr, Jacksonville, FL 32207", city: "Jacksonville", state: "FL", zip: "32207", rating: 4.7, reviews: 198, distance: "2.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["ICHRA", "Individual"], keywords: ["migraine", "MS", "Parkinson's", "neuropathy"] },
  { id: 159, name: "Dr. Thomas Kim", specialty: "Neurology", specialtyId: "neurology", clinic: "UF Health Neurology Jax", address: "653 W 8th St, Jacksonville, FL 32209", city: "Jacksonville", state: "FL", zip: "32209", rating: 4.8, reviews: 234, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["Group", "Individual"], keywords: ["stroke center", "epilepsy", "movement disorders", "dementia"] },
  { id: 160, name: "Dr. Emily Foster", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Florida Eye Specialists Jacksonville", address: "1639 Atlantic Blvd, Jacksonville, FL 32207", city: "Jacksonville", state: "FL", zip: "32207", rating: 4.7, reviews: 156, distance: "3.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["eyes", "vision", "cataracts", "glaucoma", "lasik", "retina"] },
  { id: 161, name: "Dr. Kevin Chen", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Mayo Clinic Ophthalmology Jax", address: "4500 San Pablo Rd S, Jacksonville, FL 32224", city: "Jacksonville", state: "FL", zip: "32224", rating: 5.0, reviews: 312, distance: "12.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["retina", "cornea", "oculoplastics", "Mayo Clinic", "complex eye"] },
  { id: 162, name: "Dr. Nancy Wright", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Jacksonville Eye Center", address: "4131 University Blvd S, Jacksonville, FL 32216", city: "Jacksonville", state: "FL", zip: "32216", rating: 4.6, reviews: 178, distance: "5.5 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["eye exam", "glasses", "contacts", "routine vision", "dry eye"] },

  // FORT LAUDERDALE & ST. PETERSBURG - abbreviated (3 each specialty)
  { id: 163, name: "Dr. David Palmer", specialty: "Primary Care", specialtyId: "primary", clinic: "Holy Cross Medical Group", address: "4725 N Federal Hwy, Fort Lauderdale, FL 33308", city: "Fort Lauderdale", state: "FL", zip: "33308", rating: 4.8, reviews: 267, distance: "3.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "wellness", "checkup", "preventive care"] },
  { id: 164, name: "Dr. Maria Rodriguez", specialty: "Primary Care", specialtyId: "primary", clinic: "Broward Health Primary", address: "1600 S Andrews Ave, Fort Lauderdale, FL 33316", city: "Fort Lauderdale", state: "FL", zip: "33316", rating: 4.6, reviews: 198, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["community health", "Spanish speaking", "bilingual"] },
  { id: 165, name: "Dr. James Wilson", specialty: "Primary Care", specialtyId: "primary", clinic: "Cleveland Clinic FL Primary", address: "2950 Cleveland Clinic Blvd, Weston, FL 33331", city: "Fort Lauderdale", state: "FL", zip: "33331", rating: 4.9, reviews: 356, distance: "12.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["Cleveland Clinic", "executive health", "comprehensive care"] },
  { id: 166, name: "Dr. Christine Hayes", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Broward Heart Center", address: "1600 S Andrews Ave, Fort Lauderdale, FL 33316", city: "Fort Lauderdale", state: "FL", zip: "33316", rating: 4.7, reviews: 198, distance: "1.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "heart rhythm", "interventional cardiology"] },
  { id: 167, name: "Dr. Robert Chen", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Cleveland Clinic FL Cardiology", address: "2950 Cleveland Clinic Blvd, Weston, FL 33331", city: "Fort Lauderdale", state: "FL", zip: "33331", rating: 5.0, reviews: 423, distance: "12.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["heart surgery", "structural heart", "TAVR", "Cleveland Clinic"] },
  { id: 168, name: "Dr. Patricia Adams", specialty: "Cardiology", specialtyId: "cardiology", clinic: "Memorial Cardiac Care", address: "3501 Johnson St, Hollywood, FL 33021", city: "Fort Lauderdale", state: "FL", zip: "33021", rating: 4.8, reviews: 289, distance: "5.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["Group", "Individual"], keywords: ["electrophysiology", "AFib", "pacemaker", "defibrillator"] },
  { id: 169, name: "Dr. Raymond Lopez", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Joe DiMaggio Children's Hospital", address: "1005 Joe DiMaggio Dr, Hollywood, FL 33021", city: "Fort Lauderdale", state: "FL", zip: "33021", rating: 5.0, reviews: 534, distance: "6.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "pediatric specialty", "childhood cancer", "heart"] },
  { id: 170, name: "Dr. Jennifer Park", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Fort Lauderdale Pediatrics", address: "4725 N Federal Hwy, Fort Lauderdale, FL 33308", city: "Fort Lauderdale", state: "FL", zip: "33308", rating: 4.8, reviews: 312, distance: "3.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["children", "kids", "well-child", "vaccines", "newborn"] },
  { id: 171, name: "Dr. Michael Santos", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Broward Pediatric Associates", address: "1600 S Andrews Ave, Fort Lauderdale, FL 33316", city: "Fort Lauderdale", state: "FL", zip: "33316", rating: 4.7, reviews: 234, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Individual", "Group"], keywords: ["children", "kids", "bilingual", "Spanish", "developmental"] },
  { id: 172, name: "Dr. Sandra Bell", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Orthopedic Institute of South Florida", address: "1411 N Flagler Dr, Fort Lauderdale, FL 33304", city: "Fort Lauderdale", state: "FL", zip: "33304", rating: 4.6, reviews: 145, distance: "2.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["bones", "joints", "sports medicine", "knee", "hip replacement"] },
  { id: 173, name: "Dr. Thomas Wright", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Cleveland Clinic FL Orthopedics", address: "2950 Cleveland Clinic Blvd, Weston, FL 33331", city: "Fort Lauderdale", state: "FL", zip: "33331", rating: 4.9, reviews: 312, distance: "12.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["joint replacement", "spine", "sports medicine", "Cleveland Clinic"] },
  { id: 174, name: "Dr. Laura Chen", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Memorial Orthopedics", address: "3501 Johnson St, Hollywood, FL 33021", city: "Fort Lauderdale", state: "FL", zip: "33021", rating: 4.7, reviews: 198, distance: "5.5 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["Group", "Individual"], keywords: ["fractures", "trauma", "hand surgery", "foot ankle"] },
  { id: 175, name: "Dr. Matthew Price", specialty: "Neurology", specialtyId: "neurology", clinic: "Neurology Partners Fort Lauderdale", address: "4800 NE 20th Ter, Fort Lauderdale, FL 33308", city: "Fort Lauderdale", state: "FL", zip: "33308", rating: 4.7, reviews: 167, distance: "3.5 mi", acceptingNew: true, nextAvailable: "Next Week", price: "$$$", insurances: ["ICHRA", "Individual"], keywords: ["brain", "headache", "migraine", "memory", "sleep disorders"] },
  { id: 176, name: "Dr. Susan Kim", specialty: "Neurology", specialtyId: "neurology", clinic: "Cleveland Clinic FL Neurology", address: "2950 Cleveland Clinic Blvd, Weston, FL 33331", city: "Fort Lauderdale", state: "FL", zip: "33331", rating: 5.0, reviews: 356, distance: "12.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["epilepsy", "stroke", "MS", "movement disorders", "Cleveland Clinic"] },
  { id: 177, name: "Dr. Daniel Foster", specialty: "Neurology", specialtyId: "neurology", clinic: "Broward Neuroscience", address: "1600 S Andrews Ave, Fort Lauderdale, FL 33316", city: "Fort Lauderdale", state: "FL", zip: "33316", rating: 4.6, reviews: 145, distance: "1.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["Parkinson's", "dementia", "neuropathy", "headache"] },
  { id: 178, name: "Dr. Jessica Morgan", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Rand Eye Institute", address: "2825 N Federal Hwy, Fort Lauderdale, FL 33306", city: "Fort Lauderdale", state: "FL", zip: "33306", rating: 4.8, reviews: 234, distance: "2.5 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["eyes", "vision", "lasik", "cataracts", "glaucoma", "lens implants"] },
  { id: 179, name: "Dr. Kevin Wright", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Cleveland Clinic FL Eye", address: "2950 Cleveland Clinic Blvd, Weston, FL 33331", city: "Fort Lauderdale", state: "FL", zip: "33331", rating: 4.9, reviews: 289, distance: "12.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["retina", "cornea", "oculoplastics", "Cleveland Clinic"] },
  { id: 180, name: "Dr. Amy Lee", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Broward Eye Care", address: "4725 N Federal Hwy, Fort Lauderdale, FL 33308", city: "Fort Lauderdale", state: "FL", zip: "33308", rating: 4.6, reviews: 156, distance: "3.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["eye exam", "glasses", "contacts", "routine care"] },

  // ST. PETERSBURG, FL (3 each)
  { id: 181, name: "Dr. Ryan Cooper", specialty: "Primary Care", specialtyId: "primary", clinic: "Johns Hopkins All Children's Primary", address: "501 6th Ave S, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.8, reviews: 312, distance: "1.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["family medicine", "wellness", "adult medicine", "chronic care"] },
  { id: 182, name: "Dr. Patricia Lane", specialty: "Primary Care", specialtyId: "primary", clinic: "BayCare Primary St Pete", address: "701 6th St S, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.7, reviews: 234, distance: "1.2 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$", insurances: ["ICHRA", "Individual, Group"], keywords: ["internal medicine", "preventive health", "chronic disease"] },
  { id: 183, name: "Dr. James Miller", specialty: "Primary Care", specialtyId: "primary", clinic: "St. Pete Medical Group", address: "333 1st St N, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.6, reviews: 178, distance: "0.8 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["Group", "Individual"], keywords: ["family medicine", "wellness exams", "geriatric care"] },
  { id: 184, name: "Dr. Megan Hughes", specialty: "Cardiology", specialtyId: "cardiology", clinic: "St. Petersburg Cardiology", address: "701 6th St S, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.7, reviews: 189, distance: "1.2 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["heart", "cardiovascular", "preventive cardiology", "heart failure"] },
  { id: 185, name: "Dr. William Chen", specialty: "Cardiology", specialtyId: "cardiology", clinic: "BayCare Heart St Pete", address: "501 6th Ave S, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.9, reviews: 267, distance: "1.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["interventional", "cardiac cath", "stents", "heart attack"] },
  { id: 186, name: "Dr. Sandra Kim", specialty: "Cardiology", specialtyId: "cardiology", clinic: "All Children's Cardiology", address: "501 6th Ave S, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 5.0, reviews: 234, distance: "1.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["Group", "Individual"], keywords: ["pediatric cardiology", "congenital heart", "heart defects"] },
  { id: 187, name: "Dr. Luis Sanchez", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "Johns Hopkins All Children's Hospital", address: "501 6th Ave S, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 5.0, reviews: 567, distance: "1.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["children", "kids", "baby", "infant", "pediatric specialty", "world class"] },
  { id: 188, name: "Dr. Jennifer Adams", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "St. Pete Pediatrics", address: "333 1st St N, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.8, reviews: 345, distance: "0.8 mi", acceptingNew: true, nextAvailable: "Today", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["children", "kids", "well-child", "vaccines", "newborn"] },
  { id: 189, name: "Dr. Michael Foster", specialty: "Pediatrics", specialtyId: "pediatrics", clinic: "BayCare Pediatrics St Pete", address: "701 6th St S, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.7, reviews: 267, distance: "1.2 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Individual", "Group"], keywords: ["children", "kids", "developmental", "behavioral", "ADHD"] },
  { id: 190, name: "Dr. Ashley Ward", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Bayfront Orthopedics", address: "701 6th St S, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.6, reviews: 134, distance: "1.2 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["ICHRA", "Group"], keywords: ["bones", "joints", "sports", "fractures", "arthritis"] },
  { id: 191, name: "Dr. Robert Hayes", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "Florida Ortho St Pete", address: "501 6th Ave S, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.8, reviews: 198, distance: "1.0 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$$", insurances: ["ICHRA", "Group", "Individual"], keywords: ["joint replacement", "knee", "hip", "sports medicine"] },
  { id: 192, name: "Dr. Lisa Park", specialty: "Orthopedics", specialtyId: "orthopedics", clinic: "St. Pete Sports Medicine", address: "333 1st St N, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.7, reviews: 156, distance: "0.8 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$", insurances: ["Group", "Individual"], keywords: ["sports injury", "shoulder", "ankle", "foot"] },
  { id: 193, name: "Dr. Kevin Brooks", specialty: "Neurology", specialtyId: "neurology", clinic: "St. Petersburg Neurology", address: "701 6th St S, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.7, reviews: 145, distance: "1.2 mi", acceptingNew: true, nextAvailable: "Next Week", price: "$$$", insurances: ["ICHRA", "Individual"], keywords: ["brain", "headache", "stroke", "epilepsy", "memory"] },
  { id: 194, name: "Dr. Nancy Chen", specialty: "Neurology", specialtyId: "neurology", clinic: "All Children's Neurology", address: "501 6th Ave S, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.9, reviews: 234, distance: "1.0 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["pediatric neurology", "seizures", "epilepsy", "developmental"] },
  { id: 195, name: "Dr. Thomas Wright", specialty: "Neurology", specialtyId: "neurology", clinic: "BayCare Neuroscience St Pete", address: "701 6th St S, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.6, reviews: 167, distance: "1.2 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["migraine", "Parkinson's", "MS", "neuropathy"] },
  { id: 196, name: "Dr. Heather Ross", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "St. Petersburg Eye Associates", address: "333 1st St N, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.8, reviews: 178, distance: "0.8 mi", acceptingNew: true, nextAvailable: "Tomorrow", price: "$$", insurances: ["Group", "Individual"], keywords: ["eyes", "vision", "cataracts", "glaucoma", "retina", "dry eye"] },
  { id: 197, name: "Dr. David Miller", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "Florida Eye Center St Pete", address: "701 6th St S, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.9, reviews: 234, distance: "1.2 mi", acceptingNew: true, nextAvailable: "This Week", price: "$$$", insurances: ["ICHRA", "Group"], keywords: ["retina", "macular degeneration", "lasik", "refractive"] },
  { id: 198, name: "Dr. Amy Foster", specialty: "Ophthalmology", specialtyId: "ophthalmology", clinic: "BayCare Eye Care", address: "501 6th Ave S, St. Petersburg, FL 33701", city: "St. Petersburg", state: "FL", zip: "33701", rating: 4.6, reviews: 145, distance: "1.0 mi", acceptingNew: true, nextAvailable: "Today", price: "$", insurances: ["ICHRA", "Individual", "Group"], keywords: ["eye exam", "glasses", "contacts", "routine vision"] },
];

// Calculate specialty counts dynamically from provider data
const getSpecialtyCounts = () => {
  const counts: Record<string, number> = {};
  allProviders.forEach(p => {
    counts[p.specialtyId] = (counts[p.specialtyId] || 0) + 1;
  });
  return counts;
};

const specialtyCounts = getSpecialtyCounts();

const specialties = [
  { id: "primary", name: "Primary Care", icon: Stethoscope, count: specialtyCounts.primary || 0 },
  { id: "cardiology", name: "Cardiology", icon: Heart, count: specialtyCounts.cardiology || 0 },
  { id: "neurology", name: "Neurology", icon: Brain, count: specialtyCounts.neurology || 0 },
  { id: "ophthalmology", name: "Ophthalmology", icon: Eye, count: specialtyCounts.ophthalmology || 0 },
  { id: "pediatrics", name: "Pediatrics", icon: Baby, count: specialtyCounts.pediatrics || 0 },
  { id: "orthopedics", name: "Orthopedics", icon: Bone, count: specialtyCounts.orthopedics || 0 },
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
