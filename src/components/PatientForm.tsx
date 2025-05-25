
import React, { useState, useEffect } from 'react';
import { useDatabase } from '@/contexts/DatabaseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { X, Save, User } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

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
}

interface PatientFormProps {
  patient?: Patient | null;
  onClose: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ patient, onClose }) => {
  const { db } = useDatabase();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_history: '',
    allergies: '',
    medications: '',
    insurance_provider: '',
    insurance_policy_number: '',
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        first_name: patient.first_name || '',
        last_name: patient.last_name || '',
        email: patient.email || '',
        phone: patient.phone || '',
        date_of_birth: patient.date_of_birth || '',
        gender: patient.gender || '',
        address: patient.address || '',
        emergency_contact_name: patient.emergency_contact_name || '',
        emergency_contact_phone: patient.emergency_contact_phone || '',
        medical_history: patient.medical_history || '',
        allergies: patient.allergies || '',
        medications: patient.medications || '',
        insurance_provider: patient.insurance_provider || '',
        insurance_policy_number: patient.insurance_policy_number || '',
      });
    }
  }, [patient]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    // Validation
    if (!formData.first_name || !formData.last_name) {
      toast({
        title: "Validation Error",
        description: "First name and last name are required",
        variant: "destructive",
      });
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (patient) {
        // Update existing patient
        await db.query(`
          UPDATE patients SET
            first_name = $1,
            last_name = $2,
            email = $3,
            phone = $4,
            date_of_birth = $5,
            gender = $6,
            address = $7,
            emergency_contact_name = $8,
            emergency_contact_phone = $9,
            medical_history = $10,
            allergies = $11,
            medications = $12,
            insurance_provider = $13,
            insurance_policy_number = $14
          WHERE id = $15
        `, [
          formData.first_name,
          formData.last_name,
          formData.email || null,
          formData.phone || null,
          formData.date_of_birth || null,
          formData.gender || null,
          formData.address || null,
          formData.emergency_contact_name || null,
          formData.emergency_contact_phone || null,
          formData.medical_history || null,
          formData.allergies || null,
          formData.medications || null,
          formData.insurance_provider || null,
          formData.insurance_policy_number || null,
          patient.id
        ]);

        toast({
          title: "Success",
          description: "Patient updated successfully",
        });
      } else {
        // Create new patient
        const patientId = uuidv4();
        await db.query(`
          INSERT INTO patients (
            id, first_name, last_name, email, phone, date_of_birth, gender,
            address, emergency_contact_name, emergency_contact_phone,
            medical_history, allergies, medications, insurance_provider,
            insurance_policy_number
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        `, [
          patientId,
          formData.first_name,
          formData.last_name,
          formData.email || null,
          formData.phone || null,
          formData.date_of_birth || null,
          formData.gender || null,
          formData.address || null,
          formData.emergency_contact_name || null,
          formData.emergency_contact_phone || null,
          formData.medical_history || null,
          formData.allergies || null,
          formData.medications || null,
          formData.insurance_provider || null,
          formData.insurance_policy_number || null,
        ]);

        toast({
          title: "Success",
          description: "Patient registered successfully",
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving patient:', error);
      toast({
        title: "Error",
        description: `Failed to ${patient ? 'update' : 'register'} patient`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600" />
            <CardTitle>
              {patient ? 'Edit Patient' : 'Register New Patient'}
            </CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                  <Input
                    id="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                  <Input
                    id="emergency_contact_phone"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="medical_history">Medical History</Label>
                  <Textarea
                    id="medical_history"
                    value={formData.medical_history}
                    onChange={(e) => handleInputChange('medical_history', e.target.value)}
                    rows={3}
                    placeholder="Previous surgeries, chronic conditions, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    rows={2}
                    placeholder="Drug allergies, food allergies, environmental allergies, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea
                    id="medications"
                    value={formData.medications}
                    onChange={(e) => handleInputChange('medications', e.target.value)}
                    rows={3}
                    placeholder="List current medications with dosages"
                  />
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Insurance Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="insurance_provider">Insurance Provider</Label>
                  <Input
                    id="insurance_provider"
                    value={formData.insurance_provider}
                    onChange={(e) => handleInputChange('insurance_provider', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="insurance_policy_number">Policy Number</Label>
                  <Input
                    id="insurance_policy_number"
                    value={formData.insurance_policy_number}
                    onChange={(e) => handleInputChange('insurance_policy_number', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    {patient ? 'Update Patient' : 'Register Patient'}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientForm;
