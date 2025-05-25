
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Search, Mail, Phone, Calendar, User } from 'lucide-react';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_history?: string;
  allergies?: string;
  medications?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  created_at: string;
  updated_at: string;
}

interface PatientListProps {
  patients: Patient[];
  loading: boolean;
  onEdit: (patient: Patient) => void;
  onDelete: (patientId: string) => void;
}

const PatientList: React.FC<PatientListProps> = ({ patients, loading, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredPatients = patients.filter(patient =>
    patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.includes(searchTerm)
  );

  const handleDelete = async (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      setDeletingId(patientId);
      try {
        await onDelete(patientId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Patients ({filteredPatients.length})
          </CardTitle>
          <div className="relative mt-4 sm:mt-0 sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredPatients.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'No patients found matching your search.' : 'No patients registered yet.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {patient.first_name} {patient.last_name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>ID: {patient.id.slice(0, 8)}...</span>
                            {patient.date_of_birth && (
                              <span>{calculateAge(patient.date_of_birth)} years old</span>
                            )}
                            {patient.gender && (
                              <Badge variant="secondary">{patient.gender}</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {patient.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            {patient.email}
                          </div>
                        )}
                        {patient.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {patient.phone}
                          </div>
                        )}
                        {patient.date_of_birth && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {formatDate(patient.date_of_birth)}
                          </div>
                        )}
                      </div>

                      {(patient.allergies || patient.medications || patient.insurance_provider) && (
                        <div className="space-y-2 mb-4">
                          {patient.allergies && (
                            <div className="text-sm">
                              <span className="font-medium text-red-600">Allergies:</span>
                              <span className="ml-2 text-gray-600">{patient.allergies}</span>
                            </div>
                          )}
                          {patient.medications && (
                            <div className="text-sm">
                              <span className="font-medium text-orange-600">Medications:</span>
                              <span className="ml-2 text-gray-600">{patient.medications}</span>
                            </div>
                          )}
                          {patient.insurance_provider && (
                            <div className="text-sm">
                              <span className="font-medium text-blue-600">Insurance:</span>
                              <span className="ml-2 text-gray-600">{patient.insurance_provider}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="text-xs text-gray-400">
                        Registered: {formatDate(patient.created_at)}
                        {patient.updated_at !== patient.created_at && (
                          <span className="ml-4">
                            Updated: {formatDate(patient.updated_at)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4 lg:mt-0 lg:ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(patient)}
                        className="flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(patient.id)}
                        disabled={deletingId === patient.id}
                        className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {deletingId === patient.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PatientList;
