import Header from '../header/header'
import GamesScreen from './games/games'
import RightSidebar from '../rightsidebar/rightsidebar'
import ProfileScreen from './profile/profile'
import PlayersScreen from './players/players'
import NotificationsScreen from './notifications/notifications'

export default function MainScreen({ activeScreen, onNavigate }) {
  return (
    <div className="main-wrapper">
      <Header activeScreen={activeScreen} onNavigate={onNavigate} />
      <div className="main">
        <GamesScreen active={activeScreen === 'games'} />
        <ProfileScreen active={activeScreen === 'profile'} />
        <PlayersScreen active={activeScreen === 'players'} />
        <NotificationsScreen active={activeScreen === 'notifs'} />
        <RightSidebar />
      </div>
    </div>
  )
}
