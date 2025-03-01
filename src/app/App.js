import React from 'react'
import { Routes, Route } from 'react-router-dom'
// admin
import Admin from './pages/Admin'
import Hospitals from './pages/Admin/Hospitals'
import Approved from './pages/Admin/Hospitals/Approved'
import Pending from './pages/Admin/Hospitals/Pending'
import HospitalDetails from './pages/Admin/Hospitals/Details'
import UsersDetails from './pages/Admin/Users/Details'
import UserDetailed from './pages/Admin/Users/Detailed'
import NewAgent from './pages/Admin/Agents/NewAgent'
import { ThemeProvider } from './theme/Theme/ThemeContext'
import NotFound from './pages/NotFound'
import Blogs from './pages/Admin/Marketing/Blogs'
import Youtube from './pages/Admin/Marketing/Youtube'
import Alert from './components/Alert'
import EmailBox from './components/EmailBox'
import Users from './pages/Admin/Users'
import Agents from './pages/Admin/Agents'
import AgentLogs from './pages/Admin/Agents/AgentLogs'
import AgentDetails from './pages/Admin/Agents/AgentDetails'
import MobileUsers from './pages/Admin/Users/MobileUsers'
import MobileUserDetailed from './pages/Admin/Users/MobileUserDetailed'
import Records from './pages/Admin/Users/Records'
import Transactions from './pages/Admin/Transactions'
import Database from './pages/Admin/Database'

// Add AdminChallenges imports
import AdminChallenges from './pages/Admin/AdminChallenges'
import AdminChallengeDetails from './pages/Admin/AdminChallenges/AdminChallengeDetails'

import ViewImage from './components/ViewImage'
import { Toaster } from 'react-hot-toast'
import './App.css'
// public
import Public from './pages/Public'
import Home from './pages/Public/Home'
import ListOfHospitals from './pages/Public/Hospitals'
import HospitalForPublic from './pages/Public/Hospital'
import Blog from './pages/Public/Blog'
import Plans from './pages/Public/Plans'
import About from './pages/Public/About'
import Profile from './pages/Public/Profile'
import Plan from './pages/Public/Plan'
import Testimonials from './pages/Public/Testimonials'
import PublicBlogs from './pages/Public/Blogs'
import RequestForDemo from './pages/Public/RequestForDemo'
// authentications
import Auth from './auth'
import UserLogin from './auth/UserLogin'
import UserSignup from './auth/UserSignup'
import Registration from './pages/Registration'
import AdminLogin from './auth/AdminLogin'
// registration
import NewHospital from './pages/Registration/NewHospital'
import NewUser from './pages/Registration/NewUser'
import UserRenewal from './pages/Registration/UserRenewal'

// challenges
import Challenges from './pages/Public/Challenges'
import ChallengesContainer from './pages/Public/Challenges/ChallengesContainer'
import Challenge from './pages/Public/Challenges/Challange'
import DashBoard from './pages/Public/Challenges/Dashboard'

// terms and conditions
import RefundPolicies from './pages/Public/TermsAndConditions/RefundPolicies'

function App() {
  return (
    <ThemeProvider>
      <Alert />
      <EmailBox />
      <ViewImage />
      <Toaster />
      <Routes>
        <Route path='/auth' element={ <Auth /> } >
          <Route path="user/login" element={ <UserLogin /> } />
          <Route path="user/signup" element={ <UserSignup /> } />
          <Route path="admin/login" element={ <AdminLogin /> } />
        </Route>
        <Route path="/" element={ <Public /> } >
          <Route path="user/login" element={ <UserLogin /> } />
          <Route path="user/signup" element={ <UserSignup /> } />
          <Route path="/" element={ <Home /> } />
          <Route path='about' element={ <About /> } />
          <Route path='plans/:planId' element={ <Plan /> } />
          <Route path='plans' element={ <Plans /> } />
          <Route path='blog/:blogId' element={ <Blog /> } />
          <Route path='hospitals' element={ <ListOfHospitals /> } />
          <Route path='hospital/:hospitalId' element={ <HospitalForPublic /> } />
          <Route path='profile/:userId' element={ <Profile /> } />
          <Route path='challenges' element={ <Challenges /> } >
            <Route path='' element={ <ChallengesContainer /> } />
            <Route path=':challengeId' element={ <Challenge /> } />
            <Route path='dashboard' element={ <DashBoard /> } />
          </Route>
          <Route path='testimonials' element={ <Testimonials /> } />
          <Route path='blogs' element={ <PublicBlogs /> } />
          <Route path='request-for-demo' element={ <RequestForDemo /> } />
          <Route path='refund-policy' element={ <RefundPolicies /> } />
        </Route>
        <Route path="admin" element={ <Admin /> }>
          <Route path="hospitals" element={ <Hospitals /> } >
            <Route path="approved" element={ <Approved /> } >
              <Route path=":hospitalId" element={ <HospitalDetails /> } />
            </Route>
            <Route path="pending" element={ <Pending /> } >
              <Route path=":hospitalId" element={ <HospitalDetails /> } />
            </Route>
          </Route>
          <Route path="users" element={ <Users /> } >
            <Route path="healtkards" element={ <UsersDetails /> } >
              <Route path=":userId" element={ <UserDetailed /> } />
            </Route>
            <Route path="mobile" element={ <MobileUsers /> } >
              <Route path=":userId" element={ <MobileUserDetailed /> } />
            </Route>
            <Route path="records" element={ <Records /> } />
          </Route>
          <Route path="agents" element={ <Agents /> } >
            <Route path="new" element={ <NewAgent /> } />
            <Route path="logs" element={ <AgentLogs /> } >
              <Route path=":agentId" element={ <AgentDetails /> } />
            </Route>
          </Route>
          {/* Add AdminChallenges routes */}
          <Route path="adminChallenges" element={ <AdminChallenges /> } >
            <Route path=":userId" element={ <AdminChallengeDetails /> } />
          </Route>
          <Route path="marketing/blogs" element={ <Blogs /> } />
          <Route path="marketing/testimonials" element={ <Testimonials /> } />
          <Route path="marketing/youtube" element={ <Youtube /> } />
          <Route path="transactions" element={ <Transactions /> } />
          <Route path="database" element={ <Database /> } />
        </Route>
        <Route path='registration' element={ <Registration /> } >
          <Route path='new-hospital' element={ <NewHospital /> } />
          <Route path='new-user' element={ <NewUser /> } />
          <Route path='user-renewal' element={ <UserRenewal /> } />
        </Route>

        <Route path='*' element={ <NotFound /> } />
      </Routes>
    </ThemeProvider>
  )
}

export default App