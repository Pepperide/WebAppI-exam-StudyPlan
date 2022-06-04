import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { LoginRoute } from './components/Authentication';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LoggedInView from './components/LoggedInView';
import NotLoggedInView from './components/NotLoggedInView';

function App() {
	const [loading, setLoading] = useState(true);
	const [loggedIn, setLoggedIn] = useState(false);

	return (
		<>
			<Router>
				<Routes>

					<Route path='/login' element={
						<LoginRoute />
					} />

					<Route path='/' element={<Layout />}>
						<Route path='' element={
							loggedIn ?
								<LoggedInView />
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
