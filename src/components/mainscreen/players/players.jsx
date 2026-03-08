import './players.css'

export default function PlayersScreen() {
    return (
        <>
          <div className="content screen" id="screen-players">
            <div className="topbar">
              <div className="mobile-logo">PITCH</div>
              <div className="topbar-greeting">Good morning, <strong>Alex K.</strong> &#128075;</div>
              <div className="mobile-nav">
                <div className="mobile-nav-icon" id="mnav-games-players" onclick="showScreen('games')">&#9917;</div>
                <div className="mobile-nav-icon gold-icon" id="mnav-profile-players" onclick="showScreen('profile')"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg></div>
                <div className="mobile-nav-icon active" id="mnav-players-players" onclick="showScreen('players')">&#127942;</div>
                <div className="mobile-nav-icon" id="mnav-notifs-players" style={{position: "relative"}} onclick="showScreen('notifs')">&#128276;<div className="notif-dot"></div></div>
              </div>
              <div className="user-menu" id="userMenu-players">
                <div className="user-btn" onclick="toggleUserMenu('players')">
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
                <div className="page-title">TOP PLAYERS</div>
                <div className="page-subtitle">Ranked by stars &rarr; then games played</div>
              </div>
            </div>

            <div className="players-table">
              <div className="players-header" style={{gridTemplateColumns: "48px 1fr 100px 80px 90px"}}>
                <div>#</div>
                <div>Player</div>
                <div>Stars</div>
                <div>Games</div>
                <div>Avg/Game</div>
              </div>
              <div id="players-body"></div>
              <div className="players-pagination">
                <span id="pagination-info">Showing 1–50 of 120 players</span>
                <div className="pagination-btns">
                  <button className="page-btn active" onclick="goPage(1)">1</button>
                  <button className="page-btn" onclick="goPage(2)">2</button>
                  <button className="page-btn" onclick="goPage(3)">3</button>
                  <button className="page-btn" onclick="goPage(-1)">Next &rarr;</button>
                </div>
              </div>
            </div>
          </div>
        </>
    )
}