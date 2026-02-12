import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import './config/amplifyConfig';
import Header from './components/Header';
import ErrorMessage from './components/ErrorMessage';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import TaskDetail from './pages/TaskDetail';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';

function App() {
  const { user, userRole, handleSignOut } = useAuth();
  const { 
    tasks, 
    loading, 
    error, 
    setError, 
    createTask, 
    updateTaskStatus, 
    deleteTask,
    updateTask
  } = useTasks(user, userRole);

  const [filterStatus, setFilterStatus] = useState('all');

  return (
    <Authenticator
      signUpAttributes={['email']}
      loginMechanisms={['email']}
      socialProviders={[]}
      formFields={{
        signIn: {
          username: {
            label: 'Email',
            placeholder: 'Enter your email'
          }
        },
        signUp: {
          email: {
            label: 'Email',
            placeholder: 'Enter your email',
            order: 1
          },
          password: {
            label: 'Password',
            placeholder: 'Enter your password',
            order: 2
          },
          confirm_password: {
            label: 'Confirm Password',
            order: 3
          }
        }
      }}
    >
      {({ user }) => (
        <Router>
          <div className="App">
            <Header 
              userEmail={user?.attributes?.email} 
              userRole={userRole} 
              onSignOut={handleSignOut} 
            />

            <main className="main-content">
              <ErrorMessage message={error} onClose={() => setError(null)} />

              <Routes>
                <Route 
                  path="/" 
                  element={
                    userRole === 'admin' ? (
                      <AdminDashboard
                        tasks={tasks}
                        userRole={userRole}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                        updateTaskStatus={updateTaskStatus}
                        deleteTask={deleteTask}
                        loading={loading}
                      />
                    ) : (
                      <MemberDashboard
                        tasks={tasks}
                        userRole={userRole}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                        updateTaskStatus={updateTaskStatus}
                        loading={loading}
                      />
                    )
                  } 
                />
                <Route 
                  path="/create-task" 
                  element={
                    userRole === 'admin' ? (
                      <CreateTask
                        createTask={createTask}
                        loading={loading}
                      />
                    ) : (
                      <Navigate to="/" replace />
                    )
                  } 
                />
                <Route 
                  path="/edit-task/:taskId" 
                  element={
                    userRole === 'admin' ? (
                      <EditTask
                        tasks={tasks}
                        updateTask={updateTask}
                        loading={loading}
                      />
                    ) : (
                      <Navigate to="/" replace />
                    )
                  } 
                />
                <Route 
                  path="/task/:taskId" 
                  element={
                    <TaskDetail
                      tasks={tasks}
                      userRole={userRole}
                      updateTaskStatus={updateTaskStatus}
                      deleteTask={deleteTask}
                      loading={loading}
                    />
                  } 
                />
              </Routes>
            </main>
          </div>
        </Router>
      )}
    </Authenticator>
  );
}

export default App;