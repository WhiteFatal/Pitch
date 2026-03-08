import './games.css'

export default function GamesScreen() {

        // ── MONTH SWITCHER ──
        var MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
        var MONTH_DAYS = [31,28,31,30,31,30,31,31,30,31,30,31];
        var MONTH_START_DAYS = [3,6,0,3,5,1,3,6,2,4,0,2]; // day of week for 1st of each month in 2026 (0=Sun)
        var currentMonth = 2; // 0-indexed, March = 2

        function changeMonth (dir) {
          currentMonth = (currentMonth + dir + 12) % 12;
          var label = document.getElementById('month-label');
          if (label) label.textContent = MONTHS[currentMonth];
          rebuildDays();
        };

        function rebuildDays() {
          var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
          var numDays = MONTH_DAYS[currentMonth];
          var startDay = MONTH_START_DAYS[currentMonth];
          var rows = document.querySelectorAll('.date-row');
          rows.forEach(function(row) {
            var html = '';
            for (var d = 1; d <= numDays; d++) {
              var dow = days[(startDay + d - 1) % 7];
              var dom = d < 10 ? '0' + d : '' + d;
              html += '<div class="date-chip"><div class="dow">' + dow + '</div><div class="dom">' + dom + '</div></div>';
            }
            row.innerHTML = html;
            // re-attach click handlers
            row.querySelectorAll('.date-chip').forEach(function(chip) {
              chip.addEventListener('click', function() {
                row.querySelectorAll('.date-chip').forEach(function(c){ c.classList.remove('active'); });
                chip.classList.add('active');
              });
            });
          });
        }

        // ── USER MENU ──
        function toggleUserMenu (suffix) {
          var id = suffix ? 'userMenu-' + suffix : 'userMenu';
          document.querySelectorAll('.user-menu').forEach(function(m) {
            if (m.id !== id) m.classList.remove('open');
          });
          document.getElementById(id).classList.toggle('open');
        };
        document.addEventListener('click', function(e) {
          document.querySelectorAll('.user-menu').forEach(function(m) {
            if (!m.contains(e.target)) m.classList.remove('open');
          });
        });

        // ── DATE CHIPS ──
        document.querySelectorAll('.date-chip').forEach(function(chip) {
          chip.addEventListener('click', function() {
            document.querySelectorAll('.date-chip').forEach(function(c) { c.classList.remove('active'); });
            chip.classList.add('active');
          });
        });

        // ── MODALS ──
        function openModal(id) { document.getElementById(id).classList.add('open'); }
        function closeModal(id) { document.getElementById(id).classList.remove('open'); }
        window.closeModal = closeModal;

        window.handleOverlayClick = function(e, id) { if (e.target === document.getElementById(id)) closeModal(id); };
        function handleOverlayClick(e, id) { if (e.target === document.getElementById(id)) closeModal(id); };
        
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') { closeModal('gameModal'); closeModal('adminModal'); }
        });

        window.openGameModal = function(time, spots, balance) {
          if (time) {
            document.getElementById('gm-title').textContent = time + ' Game';
            document.getElementById('gm-spots').textContent = spots || '11 / 18';
            var bal = document.getElementById('gm-balance');
            if (balance === 'Balanced')   { bal.textContent = 'Balanced \u2713';  bal.style.color = 'var(--accent)'; }
            else if (balance === 'Unbalanced') { bal.textContent = 'Unbalanced \u26a0'; bal.style.color = 'var(--red)'; }
            else if (balance === 'Cancelled')  { bal.textContent = 'Cancelled \u2715'; bal.style.color = 'var(--red)'; }
            else { bal.textContent = 'TBD'; bal.style.color = 'var(--muted)'; }
          }
          openModal('gameModal');
        };

        function openGameModal(time, spots, balance) {
          if (time) {
            document.getElementById('gm-title').textContent = time + ' Game';
            document.getElementById('gm-spots').textContent = spots || '11 / 18';
            var bal = document.getElementById('gm-balance');
            if (balance === 'Balanced')   { bal.textContent = 'Balanced \u2713';  bal.style.color = 'var(--accent)'; }
            else if (balance === 'Unbalanced') { bal.textContent = 'Unbalanced \u26a0'; bal.style.color = 'var(--red)'; }
            else if (balance === 'Cancelled')  { bal.textContent = 'Cancelled \u2715'; bal.style.color = 'var(--red)'; }
            else { bal.textContent = 'TBD'; bal.style.color = 'var(--muted)'; }
          }
          openModal('gameModal');
        };

        window.openAdminModal = function() { openModal('adminModal'); updateSummary(); };
        function openAdminModal() { openModal('adminModal'); updateSummary(); };

        window.updateSummary = function() {
          var teams = parseInt(document.getElementById('f-teams').value) || 3;
          var size  = parseInt(document.getElementById('f-teamsize').value) || 6;
          var price = parseInt(document.getElementById('f-price').value) || 0;
          var total = teams * size;
          document.getElementById('f-capacity').textContent = total + ' players (' + teams + ' x ' + size + ')';
          document.getElementById('f-summary').innerHTML = '&#128203; <div><strong>Game Summary:</strong> ' + teams + ' teams of ' + size + ' &middot; ' + total + ' spots &middot; ' + price + ' GEL per spot &middot; Total pool: <strong>' + (total * price) + ' GEL</strong></div>';
        };

        function updateSummary() {
          var teams = parseInt(document.getElementById('f-teams').value) || 3;
          var size  = parseInt(document.getElementById('f-teamsize').value) || 6;
          var price = parseInt(document.getElementById('f-price').value) || 0;
          var total = teams * size;
          document.getElementById('f-capacity').textContent = total + ' players (' + teams + ' x ' + size + ')';
          document.getElementById('f-summary').innerHTML = '&#128203; <div><strong>Game Summary:</strong> ' + teams + ' teams of ' + size + ' &middot; ' + total + ' spots &middot; ' + price + ' GEL per spot &middot; Total pool: <strong>' + (total * price) + ' GEL</strong></div>';
        };

        window.updateDayOfWeek = function() {
          var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
          var val = document.getElementById('f-date').value;
          if (!val) return;
          var p = val.split('-');
          var d = new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]));
          document.getElementById('f-day-of-week').textContent = days[d.getDay()];
        };

        window.submitReservation = function() { closeModal('adminModal'); };

        // // ── NOTIFICATION TOGGLES ──
        // window.saveToggle = function(el, key) {
        //   // In a real app this would persist to backend
        // };


    return (
        <>
          <div className="content screen active" id="screen-games">
            <div className="topbar">
              <div className="mobile-logo">PITCH</div>
              <div className="topbar-greeting">Good morning, <strong>Alex K.</strong> &#128075;</div>
              {/* MOBILE VERSION */}
              <div className="mobile-nav">
                <div className="mobile-nav-icon active" id="mnav-games" onclick="showScreen('games')">&#9917;</div>
                <div className="mobile-nav-icon gold-icon" id="mnav-profile" onclick="showScreen('profile')"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg></div>
                <div className="mobile-nav-icon" id="mnav-players" onclick="showScreen('players')">&#127942;</div>
                <div className="mobile-nav-icon" id="mnav-notifs" style={{position: 'relative'}} onclick="showScreen('notifs')">&#128276;<div className="notif-dot"></div></div>
              </div>
              {/* LARGE VERSION MENU*/}
              <div className="user-menu" id="userMenu">
                <div className="user-btn" onClick={() => toggleUserMenu()}>
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

            <div className="page-header">
              <div>
                <div className="page-title">TODAY'S GAMES</div>
                <div className="page-subtitle">Wednesday, 02 March &middot; Tbilisi Public Pitch</div>
              </div>
              <div className="header-actions">
                <button className="btn btn-admin" onClick={() => openAdminModal()}>&#9881; Create Reservation</button>
                <button className="btn btn-primary" onClick={() => openGameModal()}>+ Reserve Spot</button>
              </div>
            </div>
            
            {/* LARGE VERSION MONTH SWITCHER*/}
            <div className="month-divider">
              <div className="month-divider-line" />
              <div className="month-divider-center">
                <button className="month-divider-btn" onClick={() => changeMonth(-1)} title="Previous month">&#171;&#171;</button>
                <div className="month-divider-label" id="month-label">MARCH</div>
                <button className="month-divider-btn" onClick={() => changeMonth(1)} title="Next month">&#187;&#187;</button>
              </div>
              <div className="month-divider-line" />
            </div>
            
            {/* LARGE VERSION DAYS SWITCHER*/}
            <div className="date-row">
              <div className="date-chip"><div className="dow">Sun</div><div className="dom">01</div></div>
              <div className="date-chip active"><div className="dow">Mon</div><div className="dom">02</div></div>
              <div className="date-chip"><div className="dow">Tue</div><div className="dom">03</div></div>
              <div className="date-chip"><div className="dow">Wed</div><div className="dom">04</div></div>
              <div className="date-chip"><div className="dow">Thu</div><div className="dom">05</div></div>
              <div className="date-chip"><div className="dow">Fri</div><div className="dom">06</div></div>
              <div className="date-chip"><div className="dow">Sat</div><div className="dom">07</div></div>
              <div className="date-chip"><div className="dow">Sun</div><div className="dom">08</div></div>
              <div className="date-chip"><div className="dow">Mon</div><div className="dom">09</div></div>
              <div className="date-chip"><div className="dow">Tue</div><div className="dom">10</div></div>
              <div className="date-chip"><div className="dow">Wed</div><div className="dom">11</div></div>
              <div className="date-chip"><div className="dow">Thu</div><div className="dom">12</div></div>
              <div className="date-chip"><div className="dow">Fri</div><div className="dom">13</div></div>
              <div className="date-chip"><div className="dow">Sat</div><div className="dom">14</div></div>
              <div className="date-chip"><div className="dow">Sun</div><div className="dom">15</div></div>
              <div className="date-chip"><div className="dow">Mon</div><div className="dom">16</div></div>
              <div className="date-chip"><div className="dow">Tue</div><div className="dom">17</div></div>
              <div className="date-chip"><div className="dow">Wed</div><div className="dom">18</div></div>
              <div className="date-chip"><div className="dow">Thu</div><div className="dom">19</div></div>
              <div className="date-chip"><div className="dow">Fri</div><div className="dom">20</div></div>
              <div className="date-chip"><div className="dow">Sat</div><div className="dom">21</div></div>
              <div className="date-chip"><div className="dow">Sun</div><div className="dom">22</div></div>
              <div className="date-chip"><div className="dow">Mon</div><div className="dom">23</div></div>
              <div className="date-chip"><div className="dow">Tue</div><div className="dom">24</div></div>
              <div className="date-chip"><div className="dow">Wed</div><div className="dom">25</div></div>
              <div className="date-chip"><div className="dow">Thu</div><div className="dom">26</div></div>
              <div className="date-chip"><div className="dow">Fri</div><div className="dom">27</div></div>
              <div className="date-chip"><div className="dow">Sat</div><div className="dom">28</div></div>
              <div className="date-chip"><div className="dow">Sun</div><div className="dom">29</div></div>
              <div className="date-chip"><div className="dow">Mon</div><div className="dom">30</div></div>
              <div className="date-chip"><div className="dow">Tue</div><div className="dom">31</div></div>
            </div>

            <div className="section-label">Upcoming &middot; 4 Games &middot; 18 spots each (3 teams &times; 6 players)</div>

            <div className="games">
              <div className="game-card joined" onClick={() => openGameModal('06:00','11/18','Balanced')}>
                <div className="game-top"><div className="game-time">06:00</div><div className="game-badges"><span className="badge badge-joined">&#10003; Joined</span><span className="badge badge-open">Open</span></div></div>
                <div className="game-meta"><span>&#9917; 6-a-side &middot; 3 teams</span><span>&#128205; Pitch A</span><span>&#9201; 60 min</span></div>
                <div className="player-row">
                  <div className="avatars"><div className="avatar">AK</div><div className="avatar" style={{background: "linear-gradient(135deg,#f59e0b,#ef4444)"}}>MG</div><div className="avatar" style={{background:"linear-gradient(135deg,#10b981,#3b82f6)"}}>TL</div><div className="avatar" style={{background: "linear-gradient(135deg,#ec4899,#8b5cf6)"}}>NR</div><div className="avatar more">+7</div></div>
                  <div className="spots-bar"><div className="spots-track"><div className="spots-fill" style={{width: "61%"}}></div></div><div className="spots-text">11 / 18 spots filled</div></div>
                </div>
              </div>
              <div className="game-card" onClick={() => openGameModal('09:30','6/18','Unbalanced')}>
                <div className="game-top"><div className="game-time">09:30</div><div className="game-badges"><span className="badge badge-open">Open</span></div></div>
                <div className="game-meta"><span>&#9917; 6-a-side &middot; 3 teams</span><span>&#128205; Pitch B</span><span>&#9201; 90 min</span></div>
                <div className="player-row">
                  <div className="avatars"><div className="avatar" style={{background: "linear-gradient(135deg,#f59e0b,#ef4444)"}}>JK</div><div className="avatar" style={{background: "linear-gradient(135deg,#10b981,#3b82f6)"}}>RD</div><div className="avatar" style={{background: "linear-gradient(135deg,#ec4899,#8b5cf6)"}}>SV</div><div className="avatar more">+3</div></div>
                  <div className="spots-bar"><div className="spots-track"><div className="spots-fill" style={{width: "33%"}}></div></div><div className="spots-text">6 / 18 spots filled</div></div>
                </div>
              </div>
              <div className="game-card full" onClick={() => openGameModal('12:00','18/18','Balanced')}>
                <div className="game-top"><div className="game-time">12:00</div><div className="game-badges"><span className="badge badge-full">Full</span></div></div>
                <div className="game-meta"><span>&#9917; 6-a-side &middot; 3 teams</span><span>&#128205; Pitch A</span><span>&#9201; 60 min</span></div>
                <div className="player-row">
                  <div className="avatars"><div className="avatar" style={{background: "linear-gradient(135deg,#f59e0b,#ef4444)"}}>MM</div><div className="avatar" style={{background: "linear-gradient(135deg,#10b981,#3b82f6)"}}>PK</div><div className="avatar" style={{background: "linear-gradient(135deg,#6366f1,#ec4899)"}}>LB</div><div className="avatar more">+15</div></div>
                  <div className="spots-bar"><div className="spots-track"><div className="spots-fill s-full" style={{width: "100%"}}></div></div><div className="spots-text">18 / 18 spots filled</div></div>
                </div>
              </div>
              <div className="game-card cancelled" onClick={() => openGameModal('18:00','3/18','Cancelled')}>
                <div className="game-top"><div className="game-time">18:00</div><div className="game-badges"><span className="badge badge-cancelled">&#10005; Cancelled</span></div></div>
                <div className="game-meta"><span>&#9917; 6-a-side &middot; 3 teams</span><span>&#128205; Pitch C</span><span>&#9201; 90 min</span></div>
                <div className="player-row">
                  <div className="avatars"><div className="avatar" style={{background: "linear-gradient(135deg,#6366f1,#ec4899)"}}>AB</div><div className="avatar" style={{background: "linear-gradient(135deg,#f59e0b,#ef4444)"}}>CE</div><div className="avatar" style={{background: "linear-gradient(135deg,#10b981,#f59e0b)"}}>DV</div></div>
                  <div className="spots-bar"><div className="spots-track"><div className="spots-fill s-red" style={{width: "17%"}}></div></div><div className="spots-text">3 / 18 spots filled</div></div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- GAME MODAL --> */}
          <div className="modal-overlay" id="gameModal" onClick={() => handleOverlayClick(event,'gameModal')}>
            <div className="modal-box" style={{width: "520px"}}>
              <div className="modal-close" onClick={() => closeModal('gameModal')}>&#10005;</div>
              <div className="modal-title" id="gm-title">06:00 Game</div>
              <div className="modal-sub">Pitch A &middot; 6-a-side &middot; 3 teams of 6 &middot; Today</div>
              <div className="modal-stats">
                <div className="modal-stat"><div className="modal-stat-label">Spots</div><div className="modal-stat-val" id="gm-spots">11 / 18</div></div>
                <div className="modal-stat"><div className="modal-stat-label">Format</div><div className="modal-stat-val">6-a-side</div></div>
                <div className="modal-stat"><div className="modal-stat-label">Balance</div><div className="modal-stat-val" id="gm-balance" style={{color: "var(--accent)"}}>Balanced &#10003;</div></div>
              </div>
              <div style={{ fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform:"uppercase", color: "var(--muted)", marginBottom: "10px"}}>AI Team Split &middot; 3 &times; 6</div>
              <div className="team-split">
                <div className="team-box ta"><div className="team-label ta">Team A</div><div className="team-player"><div className="dot dot-a"></div>Marcus G.</div><div className="team-player"><div className="dot dot-a"></div>Tom L.</div><div className="team-player"><div className="dot dot-a"></div>You (AK)</div><div className="team-player"><div className="dot dot-a"></div>JK</div><div className="team-player"><div className="dot dot-a"></div>RD</div><div className="team-player" style={{opacity: ".4"}}><div className="dot dot-a"></div>Open slot</div></div>
                <div className="team-box tb"><div className="team-label tb">Team B</div><div className="team-player"><div className="dot dot-b"></div>Noa R.</div><div className="team-player"><div className="dot dot-b"></div>SV</div><div className="team-player"><div className="dot dot-b"></div>PK</div><div className="team-player"><div className="dot dot-b"></div>LB</div><div className="team-player" style={{opacity: ".4"}}><div className="dot dot-b"></div>Open slot</div><div className="team-player" style={{opacity: ".4"}}><div className="dot dot-b"></div>Open slot</div></div>
                <div className="team-box tc"><div className="team-label tc">Team C</div><div className="team-player"><div className="dot dot-c"></div>GN</div><div className="team-player"><div className="dot dot-c"></div>MM</div><div className="team-player" style={{opacity: ".4"}}><div className="dot dot-c"></div>Open slot</div><div className="team-player" style={{opacity: ".4"}}><div className="dot dot-c"></div>Open slot</div><div className="team-player" style={{opacity: ".4"}}><div className="dot dot-c"></div>Open slot</div><div className="team-player" style={{opacity: ".4"}}><div className="dot dot-c"></div>Open slot</div></div>
              </div>
              <button className="btn btn-primary" style={{width: "100%", justifyContent: "center", padding: "14px"}} onclick="closeModal('gameModal')">&#10003; Confirm Spot</button>
              <button className="btn btn-ghost" style={{width: "100%", justifyContent: "center", marginTop: "10px", padding: "12px"}} onclick="closeModal('gameModal')">Leave Game</button>
            </div>
          </div>

          {/* <!-- ADMIN MODAL --> */}
          <div className="modal-overlay" id="adminModal" onClick={() => handleOverlayClick(event,'adminModal')}>
            <div className="modal-box admin-modal-box">
              <div className="modal-close" onClick={() => closeModal('adminModal')}>&#10005;</div>
              <div className="admin-badge">&#9881; Admin Only</div>
              <div className="modal-title">Create Reservation</div>
              <div className="modal-sub">Set up a new game slot for players to reserve</div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Game Date</label>
                  <input type="date" className="form-input" id="f-date" value="2026-03-04" onchange="updateDayOfWeek()" />
                  <span className="form-hint" id="f-day-of-week" style={{color: "var(--accent);font-weight:600"}}>Wednesday</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Game Time</label>
                  <select className="form-select" id="f-time">
                    <option>00:00</option><option>00:30</option><option>01:00</option><option>01:30</option>
                    <option>02:00</option><option>02:30</option><option>03:00</option><option>03:30</option>
                    <option>04:00</option><option>04:30</option><option>05:00</option><option>05:30</option>
                    <option>06:00</option><option>06:30</option><option>07:00</option><option>07:30</option>
                    <option>08:00</option><option>08:30</option><option>09:00</option><option>09:30</option>
                    <option>10:00</option><option>10:30</option><option>11:00</option><option>11:30</option>
                    <option>12:00</option><option>12:30</option><option>13:00</option><option>13:30</option>
                    <option>14:00</option><option>14:30</option><option>15:00</option><option>15:30</option>
                    <option>16:00</option><option>16:30</option><option>17:00</option><option>17:30</option>
                    <option>18:00</option><option>18:30</option><option>19:00</option><option>19:30</option>
                    <option>20:00</option><option>20:30</option><option>21:00</option><option selected>21:30</option>
                    <option>22:00</option><option>22:30</option><option>23:00</option><option>23:30</option>
                  </select>
                </div>
                <div className="form-divider"></div>
                <div className="form-group">
                  <label className="form-label">Pitch</label>
                  <select className="form-select" id="f-pitch"><option value="A" selected>Pitch A</option><option value="B">Pitch B</option><option value="C">Pitch C</option></select>
                </div>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <select className="form-select" id="f-duration"><option value="60" selected>60 minutes</option><option value="90">90 minutes</option><option value="120">120 minutes</option></select>
                </div>
                <div className="form-divider"></div>
                <div className="form-group">
                  <label className="form-label">Number of Teams</label>
                  <select className="form-select" id="f-teams" onchange="updateSummary()"><option value="2">2 teams</option><option value="3" selected>3 teams (default)</option><option value="4">4 teams</option></select>
                </div>
                <div className="form-group">
                  <label className="form-label">Players per Team</label>
                  <select className="form-select" id="f-teamsize" onchange="updateSummary()"><option value="4">4 players</option><option value="5">5 players</option><option value="6" selected>6 players (default)</option><option value="7">7 players</option></select>
                </div>
                <div className="form-divider"></div>
                <div className="form-group">
                  <label className="form-label">Price per Spot</label>
                  <div className="price-wrap"><input type="number" className="form-input" id="f-price" value="10" min="0" oninput="updateSummary()" /><span className="price-currency">GEL</span></div>
                  <span className="form-hint">Per player reservation fee</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Total Capacity</label>
                  <div className="form-input" id="f-capacity" style={{pointerEvents: "none", opacity: ".7"}}>18 players (3 x 6)</div>
                  <span className="form-hint">Auto-calculated</span>
                </div>
              </div>
              <div className="admin-summary" id="f-summary">
                &#128203; <div><strong>Game Summary:</strong> 3 teams of 6 &middot; 18 spots &middot; 10 GEL per spot &middot; Total pool: <strong>180 GEL</strong></div>
              </div>
              <button className="btn btn-primary" style={{width: "100%", justifyContent: "center", padding: "14px"}} onclick="submitReservation()">&#10003; Create Game Slot</button>
              <button className="btn btn-ghost" style={{width: "100%", justifyContent: "center", marginTop: "10px", padding: "12px"}} onclick="closeModal('adminModal')">Cancel</button>
            </div>
          </div>
        </>
    )
}