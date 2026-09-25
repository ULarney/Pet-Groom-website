import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { PawPrint, Edit, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export default function MyPets() {
  const [pets, setPets] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    loadPets();
  }, [user]);

  const loadPets = async () => {
    if (user?.id) {
      try {
        const userPets = await api.pets.getByUser(user.id);
        setPets(userPets);
      } catch (err) {
        console.error('Error fetching pets:', err);
      }
    }
  };

  const handleDelete = async (petId: number, petName: string) => {
    if (confirm(`Are you sure you want to delete ${petName}?`)) {
      try {
        await api.pets.delete(petId);
        loadPets();
      } catch (err) {
        console.error('Error deleting pet:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Pets</h1>
          <Link
            to="/add-pet"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add New Pet
          </Link>
        </div>

        {pets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <PawPrint className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Pets Yet</h2>
            <p className="text-gray-500 mb-6">Add your first pet to get started!</p>
            <Link
              to="/add-pet"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Add a Pet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map(pet => (
              <div key={pet.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <PawPrint className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{pet.name}</h3>
                      <p className="text-sm text-gray-500">{pet.breed}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600">
                      <span className="font-semibold">Age:</span> {pet.age} {pet.ageUnit}
                    </p>
                    {pet.notes && (
                      <p className="text-gray-600">
                        <span className="font-semibold">Notes:</span> {pet.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/edit-pet/${pet.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(pet.id, pet.name)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
