import GamesScreen from "./games/games"
import RightSidebar from "../rightsidebar/rightsidebar"
import ProfileScreen from "./profile/profile"
import PlayersScreen from "./players/players"
import NotificationsScreen from "./notifications/notifications"

export default function MainScreen() {
    return (
        <main className="main">
            <GamesScreen />
            <ProfileScreen />
            <PlayersScreen />
            <NotificationsScreen />
            <RightSidebar />
            
        </main>
    )
}