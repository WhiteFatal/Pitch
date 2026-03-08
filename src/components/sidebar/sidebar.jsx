import './sidebar.css'

export default function Sidebar() {

    function showScreen(name) {
        document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
        document.querySelectorAll('.nav-icon').forEach(function(n) { n.classList.remove('active'); });
        var screenMap = { games:'screen-games', profile:'screen-profile', players:'screen-players', notifs:'screen-notifs' };
        var navMap    = { games:'nav-games', profile:'nav-profile', players:'nav-players', notifs:'nav-notifs' };
        var s = document.getElementById(screenMap[name]);
        if (s) s.classList.add('active');
        var n = document.getElementById(navMap[name]);
        if (n) n.classList.add('active');
        // sync mobile nav
        // sync all mobile nav icons across all screens
        document.querySelectorAll('.mobile-nav-icon').forEach(function(i){ i.classList.remove('active'); });
        document.querySelectorAll('.mobile-nav-icon[id*="mnav-' + name + '"]').forEach(function(i){ i.classList.add('active'); });

        // Build players list on first visit
        if (name === 'players' && !window._playersBuilt) buildPlayers();
        // Close user dropdown
        document.querySelectorAll('.user-menu').forEach(function(m){ m.classList.remove('open'); });
    }
    //window.showScreen = showScreen;

    var GRADIENTS = [
          'linear-gradient(135deg,#f5c518,#ef4444)',
          'linear-gradient(135deg,#10b981,#3b82f6)',
          'linear-gradient(135deg,#ec4899,#8b5cf6)',
          'linear-gradient(135deg,#f59e0b,#ef4444)',
          'linear-gradient(135deg,#4d9fff,#a855f7)',
          'linear-gradient(135deg,#6366f1,#ec4899)',
          'linear-gradient(135deg,#10b981,#f59e0b)',
          'linear-gradient(135deg,#f59e0b,#10b981)',
        ];

        var NAMES = ['Marcus Green','Tom Larson','Noa Rosen','Jake Kim','Ryan Davies','Sofia Vasquez',
          'Alex Kowalski','Luca Bianchi','Grace Nkosi','Pavel Horak','Mei Tanaka','Omar Hassan',
          'Elena Petrov','Carlos Ruiz','Amira Diallo','Ben Fletcher','Yuki Saito','Fatima Al-Amin',
          'Ivan Kozlov','Sara Lindqvist','Kwame Asante','Diana Moreau','Raj Patel','Chloe Martin',
          'Andrei Popescu','Hana Suzuki','Marco Silva','Ingrid Holm','Zara Ahmed','Felix Wagner',
          'Priya Sharma','Louis Dubois','Aisha Bello','Dmitri Volkov','Clara Jensen','Ahmed Khalil',
          'Mia Johansson','Tariq Nasser','Emma Wilson','Seun Adeyemi','Vlad Stanescu','Leila Hosseini',
          'Baptiste Laurent','Yuna Park','Tobias Muller','Chioma Obi','Radu Ionescu','Nina Kovac',
          'Hassan Diop','Astrid Berg'];

        var players = [];
        for (var i = 0; i < NAMES.length; i++) {
          var name = NAMES[i % NAMES.length] + (i >= NAMES.length ? ' ' + (Math.floor(i / NAMES.length) + 1) : '');
          var stars = Math.max(1, 210 - i * 1.7 + (Math.random() * 4 - 2));
          var games = Math.max(1, 45 - i * 0.35 + (Math.random() * 4 - 2));
          players.push({ name: name, stars: Math.round(stars), games: Math.round(games), grad: GRADIENTS[i % GRADIENTS.length], isYou: i === 6 });
        }
        // Sort: stars desc, then games desc
        players.sort(function(a, b) { return b.stars !== a.stars ? b.stars - a.stars : b.games - a.games; });

        //var currentPage = 1;
        var PER_PAGE = 50;

        function buildPlayers() {
          window._playersBuilt = true;
          renderPage(1);
        }

        function renderPage(page) {
          //currentPage = page;
          var start = (page - 1) * PER_PAGE;
          var end = Math.min(start + PER_PAGE, players.length);
          var body = document.getElementById('players-body');
          var html = '';
          for (var i = start; i < end; i++) {
            var p = players[i];
            var rank = i + 1;
            var rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : '';
            var initials = p.name.split(' ').map(function(w) { return w[0]; }).join('').substring(0,2).toUpperCase();
            html += '<div class="players-row' + (p.isYou ? ' you' : '') + '">';
            html += '<div class="p-rank ' + rankClass + '">' + rank + '</div>';
            html += '<div class="p-player"><div class="p-avatar" style="background:' + p.grad + '">' + initials + '</div><div class="p-name">' + p.name + (p.isYou ? '<span class="p-you">YOU</span>' : '') + '</div></div>';
            html += '<div class="p-stars">&#9733; <span>' + p.stars + '</span></div>';
            html += '<div class="p-games">' + p.games + '</div>';
            var avg = p.games > 0 ? (p.stars / p.games).toFixed(1) : '0.0';
            html += '<div class="p-games" style="color:var(--gold)">' + avg + ' &#9733;</div>';
            html += '</div>';
          }
          body.innerHTML = html;
          var totalPages = Math.ceil(players.length / PER_PAGE);
          document.getElementById('pagination-info').textContent = 'Showing ' + (start + 1) + '\u2013' + end + ' of ' + players.length + ' players';
          // Rebuild pagination buttons
          var btnsEl = document.querySelector('.pagination-btns');
          var btnsHtml = '';
          for (var pg = 1; pg <= totalPages; pg++) {
            btnsHtml += '<button class="page-btn' + (pg === page ? ' active' : '') + '" onclick="goPage(' + pg + ')">' + pg + '</button>';
          }
          if (page < totalPages) btnsHtml += '<button class="page-btn" onclick="goPage(' + (page + 1) + ')">Next &rarr;</button>';
          btnsEl.innerHTML = btnsHtml;
        }

        window.goPage = function(page) {
          if (page < 1) return;
          var totalPages = Math.ceil(players.length / PER_PAGE);
          if (page > totalPages) return;
          renderPage(page);
          document.getElementById('screen-players').scrollTop = 0;
        };

    return (
        <>
          <aside className="sidebar">
            <div className="logo">PITCH</div>
            <div className="nav-icon active" id="nav-games" onClick={() => showScreen('games')}>&#9917;</div>
            <div className="nav-icon gold-icon" id="nav-profile" onClick={() => showScreen('profile')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
            </div>
            <div className="nav-icon" id="nav-players" onClick={() => showScreen('players')}>
                &#127942;
            </div>
            <div className="nav-icon" id="nav-notifs" style={{position:'relative'}} onClick={() => showScreen('notifs')}>
                &#128276;
                <div className="notif-dot"></div>
            </div>
            <div className="sidebar-bottom"><div className="avatar-sm">AK</div></div>  
          </aside>
        </>
    )
}