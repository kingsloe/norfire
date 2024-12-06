import FontAwesome from '@expo/vector-icons/FontAwesome';

import Dashboard from './dashboard';
import Upcoming from './upcoming';
import Completed from './completed';
import Profile from './profile';

const IconColor = ({name}) => {
    return ({ color }) => <FontAwesome size={25} name={name} color={color} />
  }
  
const TabIcons = [
{
    name: 'dashboard',
    title: 'Dashboard',
    component: Dashboard,
    iconName: 'home'
},
{
    name: 'upcoming',
    title: 'Upcoming',
    component: Upcoming,
    iconName: 'calendar'
},
{
    name: 'completed',
    title: 'Completed',
    component: Completed,
    iconName: 'check'
},
{
    name: 'profile',
    title: 'Profile',
    component: Profile,
    iconName: 'user'
},
]

export { IconColor, TabIcons }