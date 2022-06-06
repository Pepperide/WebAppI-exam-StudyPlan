import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { LoginRoute } from './components/Authentication';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoggedInView from './components/LoggedInView';
import NotLoggedInView from './components/NotLoggedInView';
import { getCourses, login, logout } from './API';
import UserContext from './UserContext';

function App() {
	const [loading, setLoading] = useState(true);
	const [loggedIn, setLoggedIn] = useState(false);
	const [message, setMessage] = useState('');
	const [user, setUser] = useState({});
	const [allCourses, setAllCourses] = useState([]);

	const loadCourses = async () => {
		const list = await getCourses();
		setAllCourses(list);
	}

	useEffect(() => {
		if (loggedIn === false)
			loadCourses();
	}, [loggedIn]);

	const handleLogin = async (credentials) => {
		try {
			const loggedUser = await login(credentials);
			setLoggedIn(true);
			setMessage({ msg: `Welcome, ${loggedUser.name} ${loggedUser.surname}!`, type: 'success' });
			setUser({ name: loggedUser.name, surname: loggedUser.surname });
		}
		catch (err) {
			console.log(err);
			setMessage({ msg: `Wrong username or password`, type: 'danger' });
			setUser({});
		}
	}

	const handleLogout = async () => {
		await logout();
		setLoggedIn(false);
		setMessage('');
	}

	return (
		<>
			<UserContext.Provider value={user}>
				<Router>
					<Routes>

						<Route path='/login' element={
							<LoginRoute userLoginCallback={handleLogin} message={message} setMessage={setMessage} loggedIn={loggedIn} />
						} />

						<Route path='/' element={<Layout loggedIn={loggedIn} handleLogout={handleLogout} />}>
							<Route path='' element={
								loggedIn ?
									<LoggedInView message={message} setMessage={setMessage} />
									:
									<NotLoggedInView courses={allCourses} />
							} />
						</Route>

					</Routes>
				</Router>
			</UserContext.Provider>
		</>
	);
}

export default App;
