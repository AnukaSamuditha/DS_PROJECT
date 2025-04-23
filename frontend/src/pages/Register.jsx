import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'regular' // default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async () => {
    try {
      const res = await api.post('/users/create-user', formData);
      alert('Registration successful');
      navigate('/'); // redirect to login
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Create a new account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700 text-white sm:text-sm"
                  placeholder="Username"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700 text-white sm:text-sm"
                  placeholder="Email"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700 text-white sm:text-sm"
                  placeholder="Password"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300">
                Role
              </label>
              <select
                id="role"
                name="role"
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 bg-gray-700 text-white rounded-md sm:text-sm"
              >
                <option value="regular">Regular User</option>
                <option value="admin">Admin</option>
                <option value="restaurantOwner">Restaurant Owner</option>
                <option value="rider">Rider</option>
              </select>
            </div>

            <div>
              <button
                onClick={handleRegister}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Register
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/" className="font-medium text-yellow-500 hover:text-yellow-400">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}








// import { useState } from 'react';
// import api from '../api/axios';
// import { useNavigate } from 'react-router-dom';

// export default function Register() {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     role: 'regular' // default role
//   });

//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleRegister = async () => {
//     try {
//       const res = await api.post('/users/create-user', formData);
//       alert('Registration successful');
//       navigate('/'); // redirect to login
//     } catch (err) {
//       alert(err.response?.data?.message || 'Registration failed');
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <input name="username" placeholder="Username" onChange={handleChange} />
//       <input name="email" placeholder="Email" onChange={handleChange} />
//       <input name="password" type="password" placeholder="Password" onChange={handleChange} />
//       <select name="role" onChange={handleChange}>
//         <option value="regular">Regular</option>
//         <option value="admin">Admin</option>
//         <option value="restaurantOwner">Restaurant Owner</option>
//         <option value="rider">Rider</option>
//       </select>
//       <button onClick={handleRegister}>Register</button>
//     </div>
//   );
// }
