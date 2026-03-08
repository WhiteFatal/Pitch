import './notifications.css'

export default function NotificationsScreen() {
    return (
        <>
          <div className="content screen" id="screen-notifs">
            <div className="topbar">
              <div className="mobile-logo">PITCH</div>
              <div className="topbar-greeting">Good morning, <strong>Alex K.</strong> &#128075;</div>
              <div className="mobile-nav">
                <div className="mobile-nav-icon" id="mnav-games-notifs" onclick="showScreen('games')">&#9917;</div>
                <div className="mobile-nav-icon gold-icon" id="mnav-profile-notifs" onclick="showScreen('profile')"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg></div>
                <div className="mobile-nav-icon" id="mnav-players-notifs" onclick="showScreen('players')">&#127942;</div>
                <div className="mobile-nav-icon active" id="mnav-notifs-notifs" style={{position: "relative"}} onclick="showScreen('notifs')">&#128276;<div className="notif-dot"></div></div>
              </div>
              <div className="user-menu" id="userMenu-notifs">
                <div className="user-btn" onclick="toggleUserMenu('notifs')">
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
                <div className="page-title">NOTIFICATIONS</div>
                <div className="page-subtitle">Your recent alerts &amp; preferences</div>
              </div>
            </div>

            <div className="section-label" style={{marginBottom: "14px"}}>Recent</div>
            <div className="notif-screen-list">
              <div className="notif-screen-item unread">
                <div className="notif-icon-wrap" style={{background: "rgba(200,242,90,0.1)"}}>&#9917;</div>
                <div className="notif-body">
                  <div className="notif-title">New game created &mdash; 06:00 on 03 March</div>
                  <div className="notif-desc">A new 6-a-side game was scheduled on Pitch A. 18 spots available.</div>
                  <div className="notif-ts">2 minutes ago</div>
                </div>
                <div className="notif-unread-dot"></div>
              </div>

              <div className="notif-screen-item">
                <div className="notif-icon-wrap" style={{background: "rgba(74,222,128,0.1)"}}>&#128101;</div>
                <div className="notif-body">
                  <div className="notif-title">12:00 game is now full</div>
                  <div className="notif-desc">All 18 spots on Pitch A have been reserved.</div>
                  <div className="notif-ts">Yesterday, 11:45</div>
                </div>
              </div>
              <div className="notif-screen-item">
                <div className="notif-icon-wrap" style={{background: "rgba(251,146,60,0.1)"}}>&#128683;</div>
                <div className="notif-body">
                  <div className="notif-title">18:00 game was cancelled</div>
                  <div className="notif-desc">The Pitch C game on 02 March has been cancelled by the admin.</div>
                  <div className="notif-ts">Yesterday, 16:20</div>
                </div>
              </div>
              <div className="notif-screen-item">
                <div className="notif-icon-wrap" style={{background: "rgba(255,77,77,0.1)"}}>&#128683;</div>
                <div className="notif-body">
                  <div className="notif-title">Tom L. withdrew from your game</div>
                  <div className="notif-desc">1 spot opened up in the 06:00 game &mdash; Team A now has a free slot.</div>
                  <div className="notif-ts">2 days ago</div>
                </div>
              </div>
            </div>

            <div className="notif-settings-card">
              <div className="notif-settings-title">Notification Preferences</div>
              <div className="toggle-row">
                <div className="toggle-info">
                  <div className="toggle-label">New game created</div>
                  <div className="toggle-desc">Alert when admin schedules a new game slot</div>
                </div>
                <label className="toggle"><input type="checkbox" checked onchange="saveToggle(this,'new_game')" /><div className="toggle-track"></div><div className="toggle-thumb"></div></label>
              </div>
              <div className="toggle-row">
                <div className="toggle-info">
                  <div className="toggle-label">Game cancelled</div>
                  <div className="toggle-desc">Alert when a game you joined gets cancelled</div>
                </div>
                <label className="toggle"><input type="checkbox" checked onchange="saveToggle(this,'cancelled')" /><div className="toggle-track"></div><div className="toggle-thumb"></div></label>
              </div>
              <div className="toggle-row">
                <div className="toggle-info">
                  <div className="toggle-label">Player withdraws</div>
                  <div className="toggle-desc">Alert when someone leaves a game you're in</div>
                </div>
                <label className="toggle"><input type="checkbox" onchange="saveToggle(this,'withdraw')" /><div className="toggle-track"></div><div className="toggle-thumb"></div></label>
              </div>
              <div className="toggle-row">
                <div className="toggle-info">
                  <div className="toggle-label">Game is full</div>
                  <div className="toggle-desc">Alert when all spots in a game are taken</div>
                </div>
                <label className="toggle"><input type="checkbox" checked onchange="saveToggle(this,'full')" /><div className="toggle-track"></div><div className="toggle-thumb"></div></label>
              </div>
            </div>
          </div>
        </>
    )
}