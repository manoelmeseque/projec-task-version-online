import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import Auth from './screens/Auth'
import taskList from './screens/TaskList'

const mainRoutes = {
    Auth:{
        name: 'Auth',
        screen: Auth
    },
    Home:{
        name: 'Home',
        screen: taskList
    }
}

const mainNavigator = createSwitchNavigator(mainRoutes, {
    initialRouteName:"Auth"
})

export default createAppContainer(mainNavigator)