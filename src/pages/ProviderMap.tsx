import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  Heart,
  Stethoscope,
  Brain,
  Eye,
  Baby,
  Bone,
  ArrowRight,
  Sparkles
} from "lucide-react";

const specialties = [
  { id: "primary", name: "Primary Care", icon: Stethoscope, count: "12.4k" },
  { id: "cardiology", name: "Cardiology", icon: Heart, count: "8.3k" },
  { id: "neurology", name: "Neurology", icon: Brain, count: "6.7k" },
  { id: "ophthalmology", name: "Ophthalmology", icon: Eye, count: "5.8k" },
  { id: "pediatrics", name: "Pediatrics", icon: Baby, count: "9.4k" },
  { id: "orthopedics", name: "Orthopedics", icon: Bone, count: "7.1k" },
];

const ProviderMap = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery, "in", locationQuery);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section - Futuristic & Clean */}
        <section className="relative min-h-[60vh] flex items-center overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />
          
          {/* Background visuals - faded healthcare imagery */}
          {/* US Map silhouette */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
              viewBox="0 0 959 593"
              className="w-[80%] max-w-4xl h-auto opacity-[0.04] text-primary"
              fill="currentColor"
            >
              <path d="M833.88,553.72c-12.39-2.09-24.87-3.85-37.14-6.47c-6.89-1.47-13.59-3.68-20.22-5.93c-3.37-1.15-6.51-2.94-9.84-4.27c-10.27-4.1-20.58-8.11-30.87-12.17c-1.59-0.63-3.18-1.28-4.76-1.94c-1.37,1.27-0.72,2.54-0.78,3.66c-0.22,3.95-0.34,7.92-0.46,11.88c-0.06,1.88-0.63,2.49-2.53,2.08c-6.95-1.49-13.91-2.9-20.86-4.38c-5.35-1.14-10.68-2.38-16.03-3.51c-2.93-0.62-4.59-2.09-5.36-5.04c-0.7-2.69-1.7-5.3-2.57-7.94c-0.18-0.54-0.31-1.14-0.62-1.59c-2.53-3.68-5.08-7.34-7.73-11.18c-3.81,2.91-7.41,5.88-11.25,8.48c-7.39,5.01-15.01,9.71-22.39,14.77c-4.09,2.81-7.9,6.04-11.84,9.07c-0.13,0.1-0.27,0.23-0.34,0.37c-2.16,4.38-6.18,5.49-10.42,6.14c-3.98,0.61-7.79-0.15-10.67-2.96c-3.12-3.04-6.62-5.52-9.02-9.18c-3.71-5.65-7.92-10.96-11.79-16.51c-3.11-4.46-6.08-9.03-9.2-13.68c-0.99,0.47-1.93,0.84-2.79,1.35c-5.67,3.36-11.4,6.64-16.97,10.16c-3.19,2.02-6.19,4.34-9.17,6.66c-3.68,2.87-7.26,5.87-10.9,8.78c-6.74,5.39-14.65,5.8-22.44,5.95c-0.74,0.01-1.67-1.54-2.24-2.53c-3.63-6.33-7.28-12.66-10.68-19.12c-1.57-2.99-2.66-6.24-4.06-9.62c-3.36,0.69-6.65,1.55-9.99,2.01c-5.98,0.82-11.57-0.57-16.78-3.46c-2.6-1.44-5.16-2.98-7.6-4.65c-2.71-1.86-5.24-3.98-7.9-5.91c-4.87-3.54-9.86-6.94-14.65-10.59c-4.26-3.25-8.39-6.69-12.47-10.16c-2.83-2.41-5.46-5.05-8.25-7.52c-4.68-4.14-9.37-8.27-14.16-12.28c-5.9-4.93-11.9-9.76-17.88-14.59c-4.07-3.29-8.19-6.52-12.26-9.82c-1.43-1.16-2.75-2.46-4.19-3.61c-2.89-2.3-5.88-4.47-8.72-6.84c-3.58-2.99-7.04-6.13-10.57-9.18c-1.78-1.54-3.62-3.01-5.38-4.57c-4.57-4.04-9.16-8.06-13.65-12.19c-2.89-2.66-5.64-5.49-8.47-8.22c-4.34-4.19-8.71-8.35-13.02-12.57c-2.68-2.63-5.28-5.35-7.94-8.01c-3.52-3.52-7.08-7-10.56-10.56c-4.85-4.97-9.64-10-14.48-14.98c-3.1-3.19-6.27-6.31-9.35-9.52c-3.97-4.14-7.88-8.34-11.85-12.48c-3.07-3.2-6.2-6.35-9.25-9.57c-3.31-3.49-6.52-7.07-9.85-10.54c-3.18-3.31-6.47-6.52-9.66-9.82c-3.25-3.36-6.43-6.79-9.66-10.17c-3.47-3.63-6.97-7.22-10.42-10.87c-3.19-3.38-6.34-6.8-9.53-10.18c-3.26-3.46-6.56-6.88-9.82-10.33c-3.44-3.64-6.86-7.29-10.29-10.93l-0.55,0.39c0.75,2.24,1.43,4.51,2.28,6.71c1.95,5.04,4.02,10.03,5.96,15.07c1.1,2.86,2,5.8,3.12,8.65c2.67,6.78,5.42,13.53,8.11,20.3c1.17,2.95,2.26,5.93,3.48,8.86c2.37,5.7,4.84,11.36,7.2,17.06c2.19,5.28,4.28,10.61,6.47,15.89c1.75,4.22,3.61,8.39,5.35,12.62c2.13,5.18,4.17,10.4,6.28,15.58c1.12,2.75,2.32,5.46,3.44,8.21c2.35,5.77,4.65,11.55,7.01,17.32c1.31,3.2,2.71,6.37,4.01,9.58c2.48,6.12,4.91,12.26,7.39,18.38c1.56,3.85,3.19,7.68,4.73,11.54c2.07,5.19,4.07,10.4,6.14,15.59c1.4,3.52,2.88,7.01,4.26,10.53c2.21,5.62,4.36,11.26,6.58,16.88c1.43,3.62,2.94,7.21,4.36,10.83c2.26,5.76,4.47,11.54,6.73,17.3c1.35,3.43,2.78,6.82,4.11,10.26c0.38,0.98,0.87,1.55,1.97,1.73c4.73,0.77,9.44,1.65,14.16,2.46c1.75,0.3,3.52,0.51,5.28,0.81c4.42,0.75,8.83,1.55,13.25,2.3c3.96,0.67,7.93,1.28,11.89,1.96c4.26,0.73,8.52,1.51,12.77,2.26c4.15,0.73,8.3,1.43,12.45,2.17c4.08,0.73,8.16,1.49,12.23,2.24c4.48,0.83,8.96,1.68,13.45,2.49c4.3,0.78,8.61,1.51,12.91,2.29c4.52,0.82,9.04,1.68,13.55,2.49c4.5,0.81,9.01,1.57,13.51,2.37c4.47,0.79,8.93,1.62,13.4,2.4c4.61,0.81,9.23,1.56,13.84,2.37c4.33,0.76,8.66,1.58,12.99,2.35c3.37,0.6,6.75,1.17,10.12,1.76c0.86,0.15,1.72,0.34,2.58,0.46c4.93,0.68,9.88,1.26,14.79,2.04c4.2,0.67,8.36,1.55,12.55,2.28c4.71,0.82,9.43,1.58,14.14,2.39c4.14,0.71,8.27,1.45,12.41,2.17c4.67,0.81,9.35,1.59,14.02,2.41c4.31,0.76,8.61,1.55,12.92,2.32c4.24,0.76,8.48,1.52,12.73,2.25c3.97,0.69,7.95,1.32,11.92,2c4.9,0.84,9.79,1.71,14.69,2.56c4.48,0.78,8.96,1.55,13.45,2.31c3.5,0.59,7.01,1.14,10.51,1.73c4.72,0.79,9.43,1.61,14.14,2.41c4.68,0.79,9.37,1.54,14.05,2.33c4.61,0.78,9.22,1.6,13.82,2.39c4.61,0.79,9.22,1.55,13.83,2.35c4.37,0.76,8.73,1.56,13.1,2.31c4.61,0.79,9.22,1.53,13.83,2.33c4.29,0.74,8.57,1.55,12.86,2.29c4.27,0.74,8.55,1.42,12.82,2.17c3.97,0.7,7.93,1.47,11.9,2.18c4.58,0.82,9.16,1.6,13.74,2.42c5.76,1.03,11.52,2.11,17.29,3.13c2.7,0.48,5.43,0.82,8.14,1.26c3.71,0.6,7.42,1.23,11.12,1.87c4.69,0.81,9.38,1.64,14.07,2.45c4.3,0.74,8.6,1.46,12.9,2.19c4.53,0.77,9.06,1.52,13.59,2.29c4.47,0.76,8.94,1.54,13.41,2.29c4.42,0.74,8.84,1.44,13.26,2.18c4.8,0.8,9.59,1.63,14.39,2.44c4.61,0.78,9.23,1.53,13.84,2.32c4.56,0.78,9.11,1.6,13.67,2.39c4.45,0.77,8.9,1.52,13.36,2.27c4.37,0.74,8.75,1.45,13.12,2.19c4.59,0.78,9.17,1.58,13.76,2.36c4.14,0.7,8.29,1.37,12.43,2.08c4.06,0.7,8.11,1.44,12.17,2.14c4.51,0.78,9.03,1.52,13.55,2.3c4.22,0.73,8.44,1.49,12.66,2.22c4.56,0.79,9.12,1.55,13.68,2.34c4.52,0.78,9.04,1.58,13.56,2.36c4.48,0.77,8.96,1.5,13.45,2.28c3.48,0.61,6.95,1.27,10.43,1.89c4.51,0.8,9.02,1.58,13.54,2.35c4.45,0.76,8.91,1.49,13.37,2.24C833.4,553.05,833.64,553.38,833.88,553.72z"/>
              <path d="M68.21,250.97c-0.31,3.27-0.58,6.13-0.87,9.2c-0.51-0.06-0.88-0.06-1.22-0.16c-5.84-1.72-11.66-3.49-17.51-5.18c-3.29-0.95-6.61-1.77-9.92-2.66c-4.33-1.16-8.66-2.34-13-3.49c-4.22-1.12-8.46-2.19-12.67-3.34c-3.11-0.85-6.19-1.79-9.31-2.61c-1.24-0.33-1.66-0.87-1.52-2.13c0.67-5.98,1.24-11.97,1.87-17.96c0.56-5.35,1.14-10.7,1.69-16.05c0.72-6.99,1.42-13.99,2.14-20.98c0.53-5.14,1.09-10.27,1.61-15.41c0.68-6.71,1.33-13.43,2-20.14c0.55-5.52,1.12-11.04,1.66-16.56c0.72-7.35,1.42-14.71,2.14-22.06c0.36-3.71,0.76-7.42,1.11-11.14c0.54-5.73,1.05-11.47,1.59-17.2c0.52-5.52,1.07-11.03,1.59-16.55c0.71-7.52,1.41-15.05,2.11-22.57c0.25-2.67,0.48-5.34,0.73-8.01c0.06-0.62,0.13-1.25,0.25-1.86c0.12-0.59,0.52-0.82,1.1-0.66c1.23,0.34,2.46,0.66,3.68,1.03c4.64,1.41,9.27,2.85,13.92,4.24c2.67,0.8,5.38,1.51,8.05,2.32c4.5,1.37,8.98,2.79,13.48,4.17c2.7,0.83,5.42,1.58,8.11,2.43c4.5,1.42,8.98,2.89,13.48,4.32c2.53,0.8,5.08,1.54,7.61,2.35c4.71,1.51,9.41,3.05,14.12,4.57c2.51,0.81,5.03,1.59,7.53,2.42c4.47,1.48,8.93,3,13.4,4.48c2.51,0.83,5.04,1.62,7.55,2.46c4.88,1.63,9.75,3.29,14.63,4.92c2.34,0.78,4.7,1.53,7.04,2.32c4.83,1.63,9.65,3.28,14.48,4.91c2.35,0.79,4.72,1.55,7.07,2.35c4.88,1.66,9.75,3.35,14.63,5.01c2.53,0.86,5.08,1.67,7.61,2.54c4.49,1.54,8.96,3.11,13.45,4.65c2.89,0.99,5.8,1.94,8.69,2.92c5.56,1.89,11.11,3.79,16.67,5.68c1.02,0.35,2.06,0.65,3.08,1c4.87,1.67,9.73,3.36,14.6,5.03c2.51,0.86,5.03,1.69,7.54,2.55c4.85,1.66,9.69,3.33,14.54,4.99c2.52,0.86,5.05,1.71,7.57,2.57c4.63,1.58,9.26,3.17,13.89,4.75c2.37,0.81,4.74,1.59,7.1,2.42c4.88,1.71,9.74,3.46,14.63,5.14c3.23,1.11,6.49,2.14,9.73,3.23c4.48,1.51,8.94,3.06,13.42,4.58c2.89,0.98,5.79,1.93,8.68,2.91c4.68,1.58,9.35,3.18,14.03,4.77c2.72,0.92,5.45,1.83,8.17,2.75c4.81,1.63,9.61,3.26,14.42,4.89c2.9,0.98,5.81,1.95,8.71,2.93c4.63,1.57,9.25,3.15,13.88,4.71c2.86,0.97,5.74,1.91,8.6,2.88c4.69,1.59,9.37,3.2,14.06,4.79c2.72,0.92,5.45,1.82,8.17,2.75c4.81,1.64,9.61,3.3,14.42,4.94c2.72,0.93,5.46,1.83,8.18,2.76c4.76,1.63,9.51,3.28,14.27,4.91c2.36,0.81,4.74,1.58,7.1,2.41c4.87,1.71,9.73,3.45,14.6,5.16c2.71,0.95,5.44,1.87,8.15,2.81c5.23,1.82,10.45,3.65,15.68,5.48c2.36,0.83,4.72,1.66,7.08,2.49c0.3,0.11,0.6,0.18,0.98,0.3c0.47-1.62,0.91-3.16,1.39-4.82c0.44,0.13,0.84,0.22,1.22,0.36c4.64,1.69,9.27,3.4,13.91,5.08c2.89,1.05,5.79,2.07,8.68,3.11c4.39,1.58,8.78,3.17,13.17,4.76c2.93,1.06,5.87,2.11,8.8,3.17c4.49,1.63,8.97,3.27,13.46,4.89c2.87,1.04,5.76,2.04,8.62,3.1c4.65,1.72,9.28,3.49,13.93,5.21c2.57,0.95,5.16,1.86,7.73,2.81c4.86,1.79,9.7,3.61,14.56,5.39c2.66,0.97,5.35,1.88,8.01,2.85c4.95,1.81,9.88,3.65,14.83,5.46c2.74,1,5.5,1.96,8.24,2.96c4.61,1.68,9.22,3.38,13.83,5.07c2.91,1.07,5.83,2.12,8.74,3.19c4.34,1.6,8.66,3.22,13,4.81c3.09,1.13,6.2,2.22,9.29,3.34c4.47,1.62,8.92,3.26,13.39,4.88c2.78,1.01,5.57,2,8.35,3.01c4.9,1.78,9.78,3.58,14.68,5.37c2.46,0.9,4.94,1.77,7.4,2.67c4.84,1.78,9.66,3.59,14.5,5.37c2.72,1,5.46,1.97,8.18,2.97c4.56,1.68,9.11,3.37,13.67,5.05c2.89,1.06,5.79,2.11,8.68,3.17c0.3,0.11,0.59,0.24,0.95,0.39c-0.41,1.59-0.81,3.13-1.23,4.76c0.73,0.27,1.42,0.51,2.1,0.77c4.4,1.7,8.78,3.43,13.19,5.11c2.89,1.1,5.81,2.13,8.71,3.21c4.47,1.66,8.93,3.35,13.4,5.01c2.87,1.07,5.76,2.1,8.63,3.18c4.74,1.78,9.46,3.6,14.2,5.38c2.58,0.97,5.18,1.89,7.77,2.85c4.75,1.77,9.5,3.55,14.25,5.33c2.78,1.04,5.57,2.06,8.35,3.1c4.55,1.71,9.09,3.44,13.64,5.15c2.73,1.02,5.48,2,8.21,3.02c4.65,1.73,9.28,3.5,13.93,5.23c2.68,1,5.39,1.95,8.07,2.95c4.61,1.72,9.2,3.47,13.81,5.2c2.77,1.04,5.56,2.05,8.33,3.09c4.65,1.74,9.28,3.52,13.93,5.25c2.68,1,5.39,1.96,8.08,2.95c4.83,1.78,9.64,3.59,14.47,5.38c2.76,1.02,5.54,2.01,8.3,3.03c4.55,1.69,9.09,3.4,13.63,5.11c2.89,1.09,5.78,2.18,8.68,3.25c4.35,1.61,8.71,3.2,13.06,4.82c3.06,1.14,6.11,2.3,9.17,3.45c4.19,1.57,8.38,3.14,12.57,4.71c3.24,1.21,6.48,2.42,9.72,3.64c4.42,1.66,8.83,3.34,13.25,5c2.95,1.11,5.91,2.2,8.86,3.31c4.6,1.73,9.2,3.48,13.8,5.2c2.74,1.03,5.49,2.03,8.23,3.06c4.55,1.71,9.1,3.44,13.65,5.16c2.78,1.05,5.57,2.08,8.35,3.13c4.54,1.71,9.06,3.46,13.6,5.17c2.78,1.05,5.58,2.06,8.36,3.12c4.73,1.8,9.44,3.64,14.17,5.44c2.68,1.02,5.39,2,8.07,3.02c4.57,1.73,9.12,3.49,13.69,5.22c2.86,1.08,5.74,2.13,8.6,3.21c4.47,1.68,8.92,3.4,13.39,5.08c2.86,1.07,5.74,2.1,8.6,3.17c4.87,1.82,9.73,3.66,14.6,5.49c1.96,0.74,3.94,1.44,5.9,2.2c4.27,1.66,8.51,3.4,12.79,5.02c1.99,0.75,4.02,1.39,6.45,2.22C68.21,245.53,68.21,248.13,68.21,250.97z"/>
            </svg>
          </div>
          
          {/* Doctor/stethoscope visual - right side */}
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-[0.06]">
            <svg viewBox="0 0 200 200" className="w-full h-full text-primary" fill="none" stroke="currentColor" strokeWidth="1">
              {/* Stethoscope shape */}
              <circle cx="100" cy="40" r="25" />
              <path d="M75 40 L75 90 Q75 130 100 130 Q125 130 125 90 L125 40" />
              <circle cx="75" cy="90" r="15" />
              <circle cx="125" cy="90" r="15" />
              <path d="M100 130 L100 160 Q100 180 80 180" />
              <circle cx="80" cy="180" r="10" />
              {/* Heartbeat line */}
              <path d="M20 100 L50 100 L60 80 L70 120 L80 90 L90 110 L100 100 L180 100" strokeWidth="1.5" />
            </svg>
          </div>
          
          {/* Medical cross pattern - left side */}
          <div className="absolute -left-10 top-1/4 pointer-events-none opacity-[0.04]">
            <svg width="200" height="200" viewBox="0 0 100 100" className="text-primary" fill="currentColor">
              <rect x="40" y="10" width="20" height="80" rx="3" />
              <rect x="10" y="40" width="80" height="20" rx="3" />
            </svg>
          </div>
          
          {/* Gradient orbs */}
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              {/* Minimal badge */}
              <div className="flex items-center gap-2 mb-8 justify-center">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/50" />
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary/70">
                  50,000+ Verified Providers
                </span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/50" />
              </div>

              {/* Main heading */}
              <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 tracking-tight">
                <span className="text-foreground">Find </span>
                <span className="text-gradient-primary">Your Care</span>
              </h1>
              
              <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12 leading-relaxed">
                Search our nationwide network of healthcare providers. 
                Transparent pricing. Verified credentials. Your health, simplified.
              </p>

              {/* Futuristic Search Bar */}
              <div className="relative max-w-3xl mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-lg opacity-50" />
                <div className="relative glass-card rounded-2xl p-2">
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex-1 relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        placeholder="Specialty, condition, or provider name..."
                        className="pl-12 h-14 border-0 bg-background/50 text-base rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex-1 relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input
                        placeholder="City, State, or ZIP"
                        className="pl-12 h-14 border-0 bg-background/50 text-base rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50"
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                      />
                    </div>
                    <Button 
                      size="lg" 
                      className="h-14 px-8 rounded-xl gradient-primary hover:opacity-90 transition-opacity"
                      onClick={handleSearch}
                    >
                      <Search className="h-5 w-5 md:mr-2" />
                      <span className="hidden md:inline">Search</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex items-center justify-center gap-8 mt-10 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span>48 States</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>250+ Hospitals</span>
                </div>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet animate-pulse" />
                  <span>98% Satisfaction</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Specialties - Clean Grid */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-12">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-sm font-medium tracking-[0.15em] uppercase text-muted-foreground">
                Browse Specialties
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {specialties.map((specialty, index) => (
                <button
                  key={specialty.id}
                  className="group relative p-6 rounded-2xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 text-left overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <specialty.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {specialty.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {specialty.count} providers
                    </div>
                  </div>
                  
                  {/* Arrow indicator */}
                  <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-primary opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Expanded */}
        <section className="py-24 border-t border-border/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Healthcare, <span className="text-gradient-primary">Reimagined</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  We believe you deserve to know exactly what you're paying for, who's providing your care, and have the power to choose what's best for you.
                </p>
              </div>

              {/* Three Pillars - Expanded */}
              <div className="grid md:grid-cols-3 gap-8">
                {/* Search */}
                <div className="group relative p-8 rounded-3xl border border-border/50 bg-card/30 hover:bg-card/60 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Search className="h-7 w-7 text-primary" />
                      </div>
                      <div className="text-6xl font-bold text-primary/15">01</div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-3">Search Your Way</h3>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Find care that fits your life. Our intelligent search understands your preferences and matches you with providers based on specialty, location, availability, and your specific health needs.
                    </p>
                    
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </div>
                        <span className="text-muted-foreground">Search by condition, specialty, or provider name</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </div>
                        <span className="text-muted-foreground">Filter by distance, ratings, and availability</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </div>
                        <span className="text-muted-foreground">Access providers across all 48 states</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Compare */}
                <div className="group relative p-8 rounded-3xl border border-border/50 bg-card/30 hover:bg-card/60 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                        <svg className="h-7 w-7 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 3v18h18" />
                          <path d="M7 12h2v5H7z" />
                          <path d="M12 8h2v9h-2z" />
                          <path d="M17 5h2v12h-2z" />
                        </svg>
                      </div>
                      <div className="text-6xl font-bold text-accent/15">02</div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-3">Compare with Confidence</h3>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      No more hidden costs or surprises. See transparent pricing upfront and compare providers side-by-side on what matters most—quality, cost, and patient experiences.
                    </p>
                    
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        </div>
                        <span className="text-muted-foreground">Transparent pricing before you book</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        </div>
                        <span className="text-muted-foreground">Verified credentials and certifications</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        </div>
                        <span className="text-muted-foreground">Real patient ratings and reviews</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        </div>
                        <span className="text-muted-foreground">Side-by-side provider comparisons</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Connect */}
                <div className="group relative p-8 rounded-3xl border border-border/50 bg-card/30 hover:bg-card/60 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet/20 to-violet/5 flex items-center justify-center">
                        <svg className="h-7 w-7 text-violet" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      </div>
                      <div className="text-6xl font-bold text-violet/15">03</div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-3">Connect Seamlessly</h3>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Build your personal care team. Book appointments instantly, save your favorite providers, and manage all your healthcare relationships in one place.
                    </p>
                    
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-violet/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-violet" />
                        </div>
                        <span className="text-muted-foreground">One-click appointment booking</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-violet/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-violet" />
                        </div>
                        <span className="text-muted-foreground">Build your personal care team</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-violet/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-violet" />
                        </div>
                        <span className="text-muted-foreground">Secure messaging with providers</span>
                      </li>
                      <li className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-violet/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-violet" />
                        </div>
                        <span className="text-muted-foreground">Works with ICHRA, Group, or Individual plans</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Value Statement */}
              <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-primary/5 via-accent/5 to-violet/5 border border-border/30 text-center">
                <p className="text-lg text-foreground font-medium max-w-3xl mx-auto">
                  "Healthcare providers compete on <span className="text-primary font-semibold">price</span> and <span className="text-accent font-semibold">value</span>. You get <span className="text-violet font-semibold">transparency</span> and the power to choose what's best for you."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA - Clean */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Your health journey starts here
              </h2>
              <p className="text-muted-foreground mb-8">
                All plan types accepted—ICHRA, Group, or Individual coverage.
              </p>
              <Button 
                size="lg" 
                className="rounded-xl px-8"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Start Your Search
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProviderMap;
