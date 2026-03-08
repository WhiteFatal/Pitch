import './App.css'
import Sidebar from './components/sidebar/sidebar.jsx'
import MainScreen from './components/mainscreen/mainscreen.jsx'

function App() {
  
    (function() {
        
        // // ── MONTH SWITCHER ──
        // var MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
        // var MONTH_DAYS = [31,28,31,30,31,30,31,31,30,31,30,31];
        // var MONTH_START_DAYS = [3,6,0,3,5,1,3,6,2,4,0,2]; // day of week for 1st of each month in 2026 (0=Sun)
        // var currentMonth = 2; // 0-indexed, March = 2

        // window.changeMonth = function(dir) {
        //   currentMonth = (currentMonth + dir + 12) % 12;
        //   var label = document.getElementById('month-label');
        //   if (label) label.textContent = MONTHS[currentMonth];
        //   rebuildDays();
        // };

        // function rebuildDays() {
        //   var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        //   var numDays = MONTH_DAYS[currentMonth];
        //   var startDay = MONTH_START_DAYS[currentMonth];
        //   var rows = document.querySelectorAll('.date-row');
        //   rows.forEach(function(row) {
        //     var html = '';
        //     for (var d = 1; d <= numDays; d++) {
        //       var dow = days[(startDay + d - 1) % 7];
        //       var dom = d < 10 ? '0' + d : '' + d;
        //       html += '<div class="date-chip"><div class="dow">' + dow + '</div><div class="dom">' + dom + '</div></div>';
        //     }
        //     row.innerHTML = html;
        //     // re-attach click handlers
        //     row.querySelectorAll('.date-chip').forEach(function(chip) {
        //       chip.addEventListener('click', function() {
        //         row.querySelectorAll('.date-chip').forEach(function(c){ c.classList.remove('active'); });
        //         chip.classList.add('active');
        //       });
        //     });
        //   });
        // }

        // // ── USER MENU ──
        // window.toggleUserMenu = function(suffix) {
        //   var id = suffix ? 'userMenu-' + suffix : 'userMenu';
        //   document.querySelectorAll('.user-menu').forEach(function(m) {
        //     if (m.id !== id) m.classList.remove('open');
        //   });
        //   document.getElementById(id).classList.toggle('open');
        // };
        // document.addEventListener('click', function(e) {
        //   document.querySelectorAll('.user-menu').forEach(function(m) {
        //     if (!m.contains(e.target)) m.classList.remove('open');
        //   });
        // });

        // // ── DATE CHIPS ──
        // document.querySelectorAll('.date-chip').forEach(function(chip) {
        //   chip.addEventListener('click', function() {
        //     document.querySelectorAll('.date-chip').forEach(function(c) { c.classList.remove('active'); });
        //     chip.classList.add('active');
        //   });
        // });

        // // ── MODALS ──
        // function openModal(id) { document.getElementById(id).classList.add('open'); }
        // function closeModal(id) { document.getElementById(id).classList.remove('open'); }
        // window.closeModal = closeModal;
        // window.handleOverlayClick = function(e, id) { if (e.target === document.getElementById(id)) closeModal(id); };
        // document.addEventListener('keydown', function(e) {
        //   if (e.key === 'Escape') { closeModal('gameModal'); closeModal('adminModal'); }
        // });

        // window.openGameModal = function(time, spots, balance) {
        //   if (time) {
        //     document.getElementById('gm-title').textContent = time + ' Game';
        //     document.getElementById('gm-spots').textContent = spots || '11 / 18';
        //     var bal = document.getElementById('gm-balance');
        //     if (balance === 'Balanced')   { bal.textContent = 'Balanced \u2713';  bal.style.color = 'var(--accent)'; }
        //     else if (balance === 'Unbalanced') { bal.textContent = 'Unbalanced \u26a0'; bal.style.color = 'var(--red)'; }
        //     else if (balance === 'Cancelled')  { bal.textContent = 'Cancelled \u2715'; bal.style.color = 'var(--red)'; }
        //     else { bal.textContent = 'TBD'; bal.style.color = 'var(--muted)'; }
        //   }
        //   openModal('gameModal');
        // };

        // // window.openAdminModal = function() { openModal('adminModal'); updateSummary(); };

        // window.updateSummary = function() {
        //   var teams = parseInt(document.getElementById('f-teams').value) || 3;
        //   var size  = parseInt(document.getElementById('f-teamsize').value) || 6;
        //   var price = parseInt(document.getElementById('f-price').value) || 0;
        //   var total = teams * size;
        //   document.getElementById('f-capacity').textContent = total + ' players (' + teams + ' x ' + size + ')';
        //   document.getElementById('f-summary').innerHTML = '&#128203; <div><strong>Game Summary:</strong> ' + teams + ' teams of ' + size + ' &middot; ' + total + ' spots &middot; ' + price + ' GEL per spot &middot; Total pool: <strong>' + (total * price) + ' GEL</strong></div>';
        // };

        // window.updateDayOfWeek = function() {
        //   var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        //   var val = document.getElementById('f-date').value;
        //   if (!val) return;
        //   var p = val.split('-');
        //   var d = new Date(parseInt(p[0]), parseInt(p[1]) - 1, parseInt(p[2]));
        //   document.getElementById('f-day-of-week').textContent = days[d.getDay()];
        // };

        // window.submitReservation = function() { closeModal('adminModal'); };

        // // // ── NOTIFICATION TOGGLES ──
        // // window.saveToggle = function(el, key) {
        // //   // In a real app this would persist to backend
        // // };

      })();


  return (
    <>
      <div className="app">
        <Sidebar />    
        <MainScreen /> 
        
      </div>
      
      
    </>
  )
}

export default App
