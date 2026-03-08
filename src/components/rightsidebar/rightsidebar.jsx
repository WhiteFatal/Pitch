import './rightsidebar.css'

export default function RightSidebar() {
    return (
        <>
          <aside className="panel right-panel" id="right-panel">
        
        {/*--- PITCH MAP CARD ---*/}
            <div className="panel-card">
              <div className="panel-card-title">&#127967; Pitch Map</div>
              <div className="pitch">
                <div className="pitch-line"></div><div className="pitch-goal left"></div><div className="pitch-goal right"></div>
                <div className="pitch-center"></div><div className="pitch-label">Pitch A &middot; 6-a-side</div>
              </div>
              <div className='map-container'>
                <span className='dot-format'><span className='dot-color blue'></span>Open</span>
                {/*<span style={{display:'flex', alignItems:'center', gap:'5px'}}><span style={{width:'8px', height:'8px',background:'var(--lblue)', borderRadius:'50%',display:'inline-block'}}></span>Open</span>*/}
                <span className='dot-format'><span className='dot-color green'></span>Full</span>
                <span className='dot-format'><span className='dot-color red'></span>Cancelled</span>
              </div>
            </div>

        {/*--- TOP PLAYER CARDS ---*/}
            <div className="panel-card">
              <div className="panel-card-title">&#127942; Top Players</div>
              <div className="rank-list">

                <div className="rank-item">
                    <div className="rank-num gold">1</div>
                    <div className="rank-avatar" style={{background: "linear-gradient(135deg,#f5c518,#ef4444)"}}>MG</div>
                    <div className="rank-info"><div className="rank-name">Marcus Green</div>
                        <div className="rank-stat">
                           <span style={{color: "var(--gold)", fontSize: "14px"}}>&#9733;</span> <strong style={{color: "var(--text)"}}>210</strong> &middot; 42 games &middot; <span style={{color: "var(--gold)"}}>5.0&#9733;/g</span>
                        </div>
                    </div>
                </div>
                <div className="rank-item">
                    <div className="rank-num silver">2</div>
                    <div className="rank-avatar" style={{background: "linear-gradient(135deg,#10b981,#3b82f6)"}}>TL</div>
                    <div className="rank-info"><div className="rank-name">Tom Larson</div>
                        <div className="rank-stat">
                           <span style={{color: "var(--gold)", fontSize: "14px"}}>&#9733;</span> <strong style={{color: "var(--text)"}}>183</strong> &middot; 38 games &middot; <span style={{color: "var(--gold)"}}>4.8&#9733;/g</span>
                        </div>
                    </div>
                </div>
                <div className="rank-item">
                    <div className="rank-num bronze">3</div>
                    <div className="rank-avatar" style={{background: "linear-gradient(135deg,#ec4899,#8b5cf6)"}}>NR</div>
                    <div className="rank-info"><div className="rank-name">Noa Rosen</div>
                        <div className="rank-stat">
                           <span style={{color: "var(--gold)", fontSize: "14px"}}>&#9733;</span> <strong style={{color: "var(--text)"}}>161</strong> &middot; 35 games &middot; <span style={{color: "var(--gold)"}}>4.6&#9733;/g</span>
                        </div>
                    </div>
                </div>
                <div className="rank-item" style={{background: "var(--accent-dim)", borderRadius:"var(--rs)"}}>
                    <div className="rank-num" style={{color: "var(--accent)"}}>7</div>
                    <div className="rank-avatar" style={{background: "linear-gradient(135deg,#ec4899,#8b5cf6)"}}>AK</div>
                    <div className="rank-info"><div className="rank-name" style={{color: "var(--accent)"}}>You</div>
                        <div className="rank-stat">
                           <span style={{color: "var(--gold)", fontSize: "14px"}}>&#9733;</span> <strong style={{color: "var(--text)"}}>74</strong> &middot; 19 games &middot; <span style={{color: "var(--gold)"}}>3.9&#9733;/g</span>
                        </div>
                    </div>
                </div>
              </div>
            </div>
        
        {/*--- NOTIFICATION CARDS ---*/}
            <div className="panel-card">
              <div className="panel-card-title">&#128276; Notifications</div>
              <div className="notif-list-panel">
                
                <div className="notif-item" style={{borderLeftColor: "var(--accent)"}}>
                    <div>&#9917; New game created &mdash; <strong>06:00</strong> on 03 March</div>
                    <div className="notif-time">2 min ago</div>
                </div>
                <div className="notif-item" style={{borderLeftColor: "var(--green)"}}>
                    <div>&#128101; 12:00 game is now full &mdash; all 18 spots taken</div>
                    <div className="notif-time">Yesterday</div>
                </div>
                <div className="notif-item" style={{borderLeftColor: "var(--red)", opacity: ".75"}}>
                    <div>&#128683; 18:00 game was cancelled by admin</div>
                    <div className="notif-time">Yesterday</div>
                </div>
                
              </div>
            </div>
            
          </aside>
        </>
    )
}