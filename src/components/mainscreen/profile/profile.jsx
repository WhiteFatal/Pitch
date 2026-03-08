import './profile.css'

export default function ProfileScreen() {
    return (
        <>
          <div className="content screen" id="screen-profile">
            <div className="topbar">
              <div className="mobile-logo">PITCH</div>
              <div className="topbar-greeting">Good morning, <strong>Alex K.</strong> &#128075;</div>
              <div className="mobile-nav">
                <div className="mobile-nav-icon" id="mnav-games-profile" onclick="showScreen('games')">&#9917;</div>
                <div className="mobile-nav-icon gold-icon active" id="mnav-profile-profile" onclick="showScreen('profile')"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg></div>
                <div className="mobile-nav-icon" id="mnav-players-profile" onclick="showScreen('players')">&#127942;</div>
                <div className="mobile-nav-icon" id="mnav-notifs-profile" style={{position: "relative"}} onclick="showScreen('notifs')">&#128276;<div className="notif-dot"></div></div>
              </div>
              <div className="user-menu" id="userMenu-profile">
                <div className="user-btn" onclick="toggleUserMenu('profile')">
                  <div className="user-avatar">AK</div>
                  <span className="user-name">Alex K.</span>
                  <span className="user-chevron">&#9660;</span>
                </div>
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">AK</div>
                    <div>
                      <div className="dropdown-name">Alex Kowalski</div>
                      <div className="dropdown-email">alex [at] pitchup.ge</div>
                    </div>
                  </div>
                  <div className="dropdown-items">
                    <div className="dropdown-item"><span className="dropdown-icon">&#9881;&#65039;</span> Settings</div>
                    <div className="dropdown-item danger"><span className="dropdown-icon">&#8617;</span> Log Out</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="page-header" style={{marginBottom: "28px"}}>
              <div>
                <div className="page-title">MY PROFILE</div>
                <div className="page-subtitle">Your stats &amp; account details</div>
              </div>
            </div>

            <div className="profile-hero">
              <div className="profile-avatar-lg">AK</div>
              <div>
                <div className="profile-name">Alex Kowalski</div>
                <div className="profile-email">alex [at] pitchup.ge</div>
              </div>
            </div>

            <div className="profile-stats-grid">
              <div className="profile-stat-card">
                <div className="profile-stat-val">19</div>
                <div className="profile-stat-label">Games Played</div>
                <div className="profile-stat-sub">Since Jan 2026</div>
              </div>
              <div className="profile-stat-card">
                <div className="profile-stat-val" style={{color: "var(--gold)"}}>&#9733; 74</div>
                <div className="profile-stat-label">Stars Received</div>
                <div className="profile-stat-sub">Avg 3.9 per game</div>
              </div>
            </div>

            <div className="profile-form">
              <div className="profile-form-title">Edit Profile</div>
              <div className="profile-field">
                <label className="profile-label">Full Name</label>
                <input className="profile-input" type="text" value="Alex Kowalski" />
              </div>
              <div className="profile-field">
                <label className="profile-label">Email</label>
                <input className="profile-input" type="email" value="alex@pitchup.ge" />
              </div>
              <button className="btn btn-primary">Save Changes</button>
            </div>
          </div>
        </>
    )
}