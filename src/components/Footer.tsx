import React from "react";
import { Link } from "react-router-dom";
import { Activity, Github } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-blue-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <Link to="/" className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">
                MedRegistry
              </span>
            </Link>
          </div>

          <div className="mt-8 md:mt-0">
            <div className="flex justify-center md:justify-end space-x-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-600"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-center text-base text-gray-500">
            &copy; {currentYear} MedRegistry. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <Link to="/" className="text-sm text-gray-500 hover:text-blue-600">
              Home
            </Link>
            <Link
              to="/patients"
              className="text-sm text-gray-500 hover:text-blue-600"
            >
              Patients
            </Link>
            <Link
              to="/query"
              className="text-sm text-gray-500 hover:text-blue-600"
            >
              Query Database
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
