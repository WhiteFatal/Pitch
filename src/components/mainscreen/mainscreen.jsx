import Header from '../header/header'
import GamesScreen from './games/games'
import RightSidebar from '../rightsidebar/rightsidebar'
import ProfileScreen from './profile/profile'
import PlayersScreen from './players/players'
import NotificationsScreen from './notifications/notifications'

export default function MainScreen({ activeScreen, onNavigate, user }) {
  return (
    <div className="main-wrapper">
      <Header activeScreen={activeScreen} onNavigate={onNavigate} user={user} />
      <div className="main">
        <GamesScreen active={activeScreen === 'games'} user={user} />
        <ProfileScreen active={activeScreen === 'profile'} user={user} />
        <PlayersScreen active={activeScreen === 'players'} />
        <NotificationsScreen active={activeScreen === 'notifs'} />
        <RightSidebar />
      </div>
    </div>
  )
}
