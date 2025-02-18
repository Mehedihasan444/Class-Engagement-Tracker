/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import api from '../api';
import { Student } from '../types';
import { ArrowUp, ArrowDown, Trash2, Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPanel() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await api.get('/admin/students');
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const deleteStudent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/admin/students/${id}`);
        setStudents(prev => prev.filter(s => s._id !== id));
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handlePromote = async (id: string) => {
    if (confirm('Promote this user to admin?')) {
      try {
        await api.patch(`/admin/students/${id}/role`, { role: 'admin' });
        setStudents(prev => prev.map(s => 
          s._id === id ? { ...s, role: 'admin' } : s
        ));
        toast.success('User promoted to admin');
      } catch (error: any) {
        console.log(error);
        toast.error('Promotion failed');
      }
    }
  };

  const handleDemote = async (id: string) => {
    if (confirm('Demote this admin to regular user?')) {
      try {
        await api.patch(`/admin/students/${id}/role`, { role: 'user' });
        setStudents(prev => prev.map(s => 
          s._id === id ? { ...s, role: 'user' } : s
        ));
        toast.success('Admin demoted to user');
      } catch (error:any) {
        console.log(error)
        toast.error('Demotion failed');
      }
    }
  };

  const handleSuspendResume = async (student: Student) => {
    const newStatus = student.status === 'active' ? 'suspended' : 'active';
    
    if (confirm(`Are you sure you want to ${newStatus === 'suspended' ? 'suspend' : 're-activate'} this user?`)) {
      try {
        await api.patch(`/admin/students/${student._id}/status`, {
          status: newStatus
        });
        
        setStudents(prev => prev.map(s => 
          s._id === student._id ? { ...s, status: newStatus } : s
        ));
        toast.success(`User ${newStatus === 'suspended' ? 'suspended' : 're-activated'}`);
      } catch (error:any) {
        console.log(error);
        toast.error('Status update failed');
      }
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Student Management</h2>
      
      {loading ? (
        <div>Loading students...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map(student => (
                <tr key={student._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      student.status === 'active' ? 'bg-green-100 text-green-800' :
                      student.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {student.role === 'user' && (
                        <button
                          onClick={() => handlePromote(student._id)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Promote to Admin"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                      )}
                      {student.role === 'admin' && (
                        <button
                          onClick={() => handleDemote(student._id)}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Demote to User"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleSuspendResume(student)}
                        className={`${
                          student.status === 'active' 
                            ? 'text-yellow-600 hover:text-yellow-800'
                            : 'text-green-600 hover:text-green-800'
                        }`}
                        title={student.status === 'active' ? 'Suspend User' : 'Re-activate User'}
                      >
                        {student.status === 'active' ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Unlock className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteStudent(student._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Student"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 