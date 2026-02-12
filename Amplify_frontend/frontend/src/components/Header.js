const Header = ({ userEmail, userRole, onSignOut }) => {
  return (
    <header className="App-header">
      <h1>Task Manager</h1>
      <div className="user-info">
        <span>Welcome, {userEmail}</span>
        <span className={`role-badge ${userRole?.toLowerCase()}`}>{userRole}</span>
        <button onClick={onSignOut} className="sign-out-btn">Sign Out</button>
      </div>
    </header>
  );
};

export default Header;
