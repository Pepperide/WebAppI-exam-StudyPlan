import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { LoginRoute } from './components/Authentication';
import StudyPlanTable from './components/StudyPlantable';
import { useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { Container } from 'react-bootstrap'

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
								<>
								</> :
								<>
									<Container fluid>
										<h1>Polito study plan</h1>
										<StudyPlanTable />
									</Container>
								</>
						} />
					</Route>

				</Routes>
			</Router>
		</>
	);
}

export default App;
