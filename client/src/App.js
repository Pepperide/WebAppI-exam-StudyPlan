import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import UserContext from './UserContext';
import { deleteUserStudyPlan, getCourses, getStudyPlan, getUserInfo, login, logout, storeUserStudyPlan } from './API';

import { LoginRoute } from './components/Authentication';
import Layout from './components/Layout';
import NotLoggedInView from './components/NotLoggedInView';
import LoggedInView from './components/LoggedInView'
import EditStudyPlan from './components/EditStudyPlan';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({});
  const [allCourses, setAllCourses] = useState([]);
  const [studyPlan, setStudyPlan] = useState([]);
  const [oldStudyPlan, setOldStudyPlan] = useState([]);

  const loadCourses = async () => {
    const list = await getCourses();
    setAllCourses(list);
  }

  const loadStudyPlan = async () => {
    const list = await getStudyPlan(user.id);
    setOldStudyPlan(list);
    setStudyPlan(list);
  }

  const addCourseToStudyPlan = (course) => {
    setStudyPlan((old) => [...old, course]);
  }

  const removeCourseFromStudyPlan = (course) => {
    const plan = studyPlan.filter((s) => s.code !== course.code);
    setStudyPlan(plan)
  }

  const storeStudyPlan = async (workload) => {
    try {
      await storeUserStudyPlan({ studyPlan, workload });
    }
    catch {
      loadStudyPlan();
      loadCourses();
    }

  }

  const deleteStudyPlan = async () => {
    await deleteUserStudyPlan();
    loadStudyPlan();
    loadCourses();
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

  useEffect(() => {
    const userInfo = async () => {
      try {
        const u = await getUserInfo();
        setLoggedIn(true);
        setUser(u);
      }
      catch (err) {
        setLoggedIn(false);
        setMessage('');
        setUser({});
        setStudyPlan([]);
      }
    }

    userInfo();

  }, []);

  useEffect(() => {
    loadCourses();

    if (loggedIn) {
      loadStudyPlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  return (
    <>
      <UserContext.Provider value={user}>
        <Router>
          <Routes>

            <Route path='/login' element={
              <LoginRoute userLoginCallback={handleLogin} message={message} setMessage={setMessage} loggedIn={loggedIn} />
            } />

            <Route path='/' element={<Layout loggedIn={loggedIn} handleLogout={handleLogout} studyPlan={studyPlan} loadStudyPlan={loadStudyPlan} />}>
              <Route path='' element={<NotLoggedInView courses={allCourses} mode={"view"} />} />
              <Route path="*" element={
                <div style={{ color: "white" }}>
                  <h2>404 Page not found</h2>

                </div>
              } />
            </Route>

            <Route path='/user/:userID/' element={<Layout loggedIn={loggedIn} handleLogout={handleLogout} studyPlan={studyPlan} loadStudyPlan={loadStudyPlan} />}>
              <Route path='' element={<LoggedInView courses={allCourses} studyPlan={studyPlan} message={message} setMessage={setMessage} setUser={setUser} />} />
              <Route path='studyplan/add' element={
                <EditStudyPlan
                  courses={allCourses}
                  studyPlan={studyPlan}
                  oldStudyPlan={oldStudyPlan}
                  addCourseToStudyPlan={addCourseToStudyPlan}
                  removeCourseFromStudyPlan={removeCourseFromStudyPlan}
                  storeStudyPlan={storeStudyPlan}
                  deleteStudyPlan={deleteStudyPlan}
                  loadStudyPlan={loadStudyPlan} />} />
              <Route path='studyplan/edit' element={
                <EditStudyPlan
                  courses={allCourses}
                  studyPlan={studyPlan}
                  oldStudyPlan={oldStudyPlan}
                  addCourseToStudyPlan={addCourseToStudyPlan}
                  removeCourseFromStudyPlan={removeCourseFromStudyPlan}
                  storeStudyPlan={storeStudyPlan}
                  deleteStudyPlan={deleteStudyPlan}
                  loadStudyPlan={loadStudyPlan} />} />
              <Route path="*" element={
                <div style={{ color: "white" }}>
                  <h2>404 Page not found</h2>

                </div>
              } />
            </Route>

          </Routes>
        </Router>
      </UserContext.Provider>
    </>
  );
}

export default App;