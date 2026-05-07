// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';
// import Swal from 'sweetalert2';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
//       Swal.fire('Success', 'Logged in', 'success');
//       navigate('/');
//     } catch (err) {
//       Swal.fire('Error', err.response?.data?.message || 'Login failed', 'error');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-6">Login</h2>
//         <form onSubmit={handleSubmit}>
//           <input type="email" placeholder="Email" className="w-full p-2 border mb-4 rounded" value={email} onChange={e => setEmail(e.target.value)} required />
//           <input type="password" placeholder="Password" className="w-full p-2 border mb-4 rounded" value={password} onChange={e => setPassword(e.target.value)} required />
//           <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
//         </form>
//         <p className="mt-4 text-center">No account? <Link to="/register" className="text-blue-600">Register</Link></p>
//       </div>
//     </div>
//   );
// }
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
      login();                      // ✅ updates AuthContext state
      Swal.fire('Success', 'Logged in', 'success');
      navigate('/');                // ✅ redirect to home
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'Login failed', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border mb-4 rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border mb-4 rounded"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Login
          </button>
        </form>
        <p className="mt-4 text-center">
          No account? <Link to="/register" className="text-blue-600">Register</Link>
        </p>
      </div>
    </div>
  );
}