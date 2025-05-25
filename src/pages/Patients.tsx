import React, { useState, useEffect, useCallback } from "react";
import { useDatabase } from "@/contexts/DatabaseContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import PatientForm from "@/components/PatientForm";
import PatientList from "@/components/PatientList";
import { Plus, Users, UserCheck, Calendar } from "lucide-react";

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

interface StatsRow {
  total: string;
  this_month: string;
  this_week: string;
}

const Patients = () => {
  const { db, isInitialized } = useDatabase();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    thisWeek: 0,
  });

  const loadPatients = useCallback(async () => {
    if (!db || !isInitialized) return;

    try {
      setLoading(true);
      const result = await db.query(`
        SELECT * FROM patients 
        ORDER BY created_at DESC
      `);

      setPatients(result.rows as Patient[]);

      // Calculate stats
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

      const statsResult = await db.query(
        `
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN created_at >= $1 THEN 1 END) as this_month,
          COUNT(CASE WHEN created_at >= $2 THEN 1 END) as this_week
        FROM patients
      `,
        [startOfMonth.toISOString(), startOfWeek.toISOString()]
      );

      if (statsResult.rows.length > 0) {
        const row = statsResult.rows[0] as StatsRow;
        setStats({
          total: parseInt(row.total),
          thisMonth: parseInt(row.this_month),
          thisWeek: parseInt(row.this_week),
        });
      }

      // Only notify other tabs when data is actually changed (not just loaded)
      // localStorage.setItem('patient-registry-sync', Date.now().toString());
    } catch (error) {
      console.error("Error loading patients:", error);
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [db, isInitialized]);

  // Function to notify other tabs when data has changed
  const notifyDataChanged = () => {
    localStorage.setItem("patient-registry-sync", Date.now().toString());
  };

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  // Listen for cross-tab updates
  useEffect(() => {
    const handleDataChange = (e: StorageEvent) => {
      if (e.key === "patient-registry-sync") {
        loadPatients();
      }
    };

    window.addEventListener("storage", handleDataChange);
    return () => window.removeEventListener("storage", handleDataChange);
  }, [loadPatients]);

  const handleAddPatient = () => {
    setEditingPatient(null);
    setShowForm(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPatient(null);
    loadPatients();
    // Notify other tabs about the change
    notifyDataChanged();
  };

  const handleDeletePatient = async (patientId: string) => {
    if (!db) return;

    try {
      await db.query("DELETE FROM patients WHERE id = $1", [patientId]);
      toast({
        title: "Success",
        description: "Patient deleted successfully",
      });
      loadPatients();
      // Notify other tabs about the change
      notifyDataChanged();
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast({
        title: "Error",
        description: "Failed to delete patient",
        variant: "destructive",
      });
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Patient Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage patient registrations and medical records
            </p>
          </div>
          <Button
            onClick={handleAddPatient}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Patient
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              This Month
            </CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.thisMonth}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              This Week
            </CardTitle>
            <UserCheck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.thisWeek}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Form Modal */}
      {showForm && (
        <PatientForm patient={editingPatient} onClose={handleFormClose} />
      )}

      {/* Patient List */}
      <PatientList
        patients={patients}
        loading={loading}
        onEdit={handleEditPatient}
        onDelete={handleDeletePatient}
      />
    </div>
  );
};

export default Patients;
