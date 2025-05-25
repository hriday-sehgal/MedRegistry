import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Database,
  Heart,
  Shield,
  Zap,
  Globe,
  Activity,
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Users,
      title: "Patient Management",
      description:
        "Complete patient registration with comprehensive medical information tracking.",
    },
    {
      icon: Database,
      title: "SQL Query Interface",
      description:
        "Powerful raw SQL query capabilities for advanced data analysis and reporting.",
    },
    {
      icon: Shield,
      title: "Data Persistence",
      description:
        "Reliable local storage with automatic data persistence across sessions.",
    },
    {
      icon: Zap,
      title: "Real-time Sync",
      description:
        "Multi-tab synchronization ensures data consistency across browser tabs.",
    },
    {
      icon: Globe,
      title: "Responsive Design",
      description:
        "Optimized for all devices with a professional, healthcare-focused interface.",
    },
    {
      icon: Activity,
      title: "Healthcare Focused",
      description:
        "Built specifically for medical environments with HIPAA-compliant design principles.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-blue-600 text-white">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-repeat bg-center opacity-20"></div>
          <div className="absolute w-96 h-96 -top-24 -left-24 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute w-96 h-96 -bottom-24 -right-24 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="block text-blue-200">Advanced Healthcare</span>
                <span className="block">Data Management</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-xl">
                A comprehensive patient registration system with secure, local
                data storage and multi-tab synchronization.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/patients">
                  <Button
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto"
                  >
                    Register Patient
                  </Button>
                </Link>
                <Link to="/query">
                  <Button
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600 border border-blue-400 text-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto"
                  >
                    Query Database
                  </Button>
                </Link>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-72 h-72 md:w-80 md:h-80 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                <Activity className="h-32 w-32 text-white animate-pulse" />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full blur-sm opacity-75"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,96L48,85.3C96,75,192,53,288,48C384,43,480,53,576,69.3C672,85,768,107,864,106.7C960,107,1056,85,1152,69.3C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for modern patient data management in a
              single, secure application.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Begin managing patient data with our intuitive, secure platform.
          </p>
          <Link to="/patients">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Start Registering Patients
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
