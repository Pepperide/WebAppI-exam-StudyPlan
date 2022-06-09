import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import UserContext from './UserContext';
import { getCourses, getStudyPlan, login, logout } from './API';

import { LoginRoute } from './components/Authentication';
import Layout from './components/Layout';
import NotLoggedInView from './components/NotLoggedInView';
import LoggedInLayout from './components/LoggedInLayout';
import LoggedInView from './components/LoggedInView'
import StudyPlan from './components/StudyPlan';
import EditStudyPlan from './components/EditStudyPlan';


function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({});
  const [allCourses, setAllCourses] = useState([]);
  const [studyPlan, setStudyPlan] = useState([]);

  const loadCourses = async () => {
    const list = await getCourses();
    setAllCourses(list);
  }

  const loadStudyPlan = async () => {
    const list = await getStudyPlan(user.id);
    setStudyPlan(list);
  }

  useEffect(() => {
    loadCourses();
    if (loggedIn === true)
      loadStudyPlan();
  }, [loggedIn]);

  const addCourseToStudyPlan = (course) => {
    setStudyPlan((old) => [...old, course]);
  }

  const removeCourseFromStudyPlan = (course) => {
    const plan = studyPlan.filter((s) => s.code !== course.code);
    setStudyPlan(plan)
  }

  const storeStudyPlan = async () => {
    console.log("Stored");
    //TODO store studyplan
  }

  const handleLogin = async (credentials) => {
    try {
      const loggedUser = await login(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${loggedUser.name} ${loggedUser.surname}!`, type: 'success' });
      setUser({ id: loggedUser.id, username: loggedUser.username, name: loggedUser.name, surname: loggedUser.surname });
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
    setUser({});
    setStudyPlan([]);
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
              <Route path='' element={<NotLoggedInView courses={allCourses} mode={"view"} />} />
            </Route>

            <Route path='/user/:userID/' element={<LoggedInLayout loggedIn={loggedIn} handleLogout={handleLogout} />}>
              <Route path='' element={<LoggedInView courses={allCourses} message={message} setMessage={setMessage} />} />
              <Route path='studyplan' element={<StudyPlan courses={studyPlan} />} />
              <Route path='studyplan/add' element={
                <EditStudyPlan
                  courses={allCourses}
                  studyPlan={studyPlan}
                  addCourseToStudyPlan={addCourseToStudyPlan}
                  removeCourseFromStudyPlan={removeCourseFromStudyPlan}
                  storeStudyPlan={storeStudyPlan} />} />
            </Route>



          </Routes>
        </Router>
      </UserContext.Provider>
    </>
  );
}

export default App;
