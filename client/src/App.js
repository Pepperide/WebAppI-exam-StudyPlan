import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { LoginRoute } from './components/Authentication';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LoggedInView from './components/LoggedInView';
import NotLoggedInView from './components/NotLoggedInView';
import { login, logout } from './API';

function App() {
	const [loading, setLoading] = useState(true);
	const [loggedIn, setLoggedIn] = useState(false);
	const [message, setMessage] = useState('');

	const handleLogin = async (credentials) => {
		try {
			const user = await login(credentials);
			setLoggedIn(true);
			setMessage({ msg: `Welcome, ${user.name} ${user.surname}!`, type: 'success' });
		}
		catch (err) {
			console.log(err);
			setMessage({ msg: `Wrong username or password`, type: 'danger' });
		}
	}

	const handleLogout = async () => {
		await logout();
		setLoggedIn(false);
		setMessage('');
	}

	return (
		<>
			<Router>
				<Routes>

					<Route path='/login' element={
						<LoginRoute userLoginCallback={handleLogin} message={message} setMessage={setMessage} />
					} />

					<Route path='/' element={<Layout loggedIn={loggedIn} handleLogout={handleLogout} />}>
						<Route path='' element={
							loggedIn ?
								<LoggedInView message={message} setMessage={setMessage} />
								:
								<NotLoggedInView />
						} />
					</Route>

				</Routes>
			</Router>
		</>
	);
}

export default App;
