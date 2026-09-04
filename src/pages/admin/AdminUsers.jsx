import { useEffect, useState } from 'react';
import { Users, ShieldCheck, UserCircle, Search, Trash2 } from 'lucide-react';
import { adminService } from '../../services/api.js';
import Spinner from '../../components/ui/Spinner.jsx';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const loadUsers = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (roleFilter) params.role = roleFilter;
    adminService
      .getUsers(params)
      .then((res) => setUsers(res.data || []))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const delay = setTimeout(loadUsers, 300);
    return () => clearTimeout(delay);
  }, [search, roleFilter]);

  const handleRoleChange = async (targetUser, newRole) => {
    if (targetUser.id === currentUser?.id && newRole !== 'admin') {
      toast.error('No puedes quitar tu propio rol de administrador');
      return;
    }
    if (!window.confirm(`¿Cambiar el rol de ${targetUser.name} a ${newRole === 'admin' ? 'Administrador' : 'Cliente'}?`)) return;
    try {
      await adminService.setUserRole(targetUser.id, newRole);
      toast.success('Rol actualizado');
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (targetUser) => {
    if (targetUser.id === currentUser?.id) {
      toast.error('No puedes eliminar tu propia cuenta');
      return;
    }
    if (!window.confirm(`¿Eliminar al usuario ${targetUser.name} (${targetUser.email})?`)) return;
    try {
      await adminService.deleteUser(targetUser.id);
      toast.success('Usuario eliminado');
      loadUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Gestión de usuarios</h1>
        <p className="text-gray-400 text-sm mt-1">Administra roles y cuentas registradas</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="input-app !pl-10"
          />
        </div>
        <div className="flex gap-2">
          {['', 'admin', 'client'].map((val) => (
            <button
              key={val || 'all'}
              onClick={() => setRoleFilter(val)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                roleFilter === val ? 'bg-brand-600 text-white' : 'bg-dark-600 text-gray-400 hover:bg-dark-500'
              }`}
            >
              {val === '' ? 'Todos' : val === 'admin' ? 'Admins' : 'Clientes'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-dark-800 rounded-3xl border border-dashed border-dark-500">
          <Users className="w-14 h-14 text-dark-500 mx-auto mb-3" />
          <p className="text-gray-400">No se encontraron usuarios</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.id} className="card-surface p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt="" className="w-full h-full object-cover rounded-xl" />
                ) : u.name ? u.name.charAt(0).toUpperCase() : <UserCircle className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white flex items-center gap-2 truncate">
                  {u.name}
                  {u.id === currentUser?.id && (
                    <span className="text-xs text-gray-500">(tú)</span>
                  )}
                </p>
                <p className="text-sm text-gray-500 truncate">{u.email}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex bg-dark-700 rounded-xl p-1">
                  <button
                    onClick={() => handleRoleChange(u, 'client')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      u.role === 'client' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Cliente
                  </button>
                  <button
                    onClick={() => handleRoleChange(u, 'admin')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      u.role === 'admin' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    Admin
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(u)}
                  className="p-2 rounded-lg bg-brand-600/20 text-brand-400 hover:bg-brand-600/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
