import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Screens/Login';
import Home from './Screens/Home';
import ItemBoss from './Items/ItemBoss';
import ItemDepartmen from './Items/ItemDepartmen';
import AddDepartmen from './Screens/AddDepartmen';
import Manager from './Screens/Manager';
import AddManager from './Screens/AddManager';
import Staff from './Screens/Staff';
import AddStaff from './Screens/AddStaff';
import Departmen from './Screens/Departmen';
import StaffDetail from './ScreensDetail.js/StaffDetail';
import NotificationChat from './Screens/NotificationChat';
import HomeManager from './ScreensManager/HomeManager';
import NotificationManagerStaff from './Screens/NotificationManagerStaff';
import ItemChat from './ItemHomeManager/ItemChat';
import DepartmenManagerr from './ScreensManager/DepartmenManagerr';
import HomeStaff from './ScreensStaff/HomeStaff';
import DepartmenStaff from './ScreensStaff/DepartmenStaff';
import ManagerDetail from './ScreensDetail.js/ManagerDetail';
import SearchManager from './Screens/SearchManager';
import SearchStaff from './Screens/SearchStaff';
import SearchDepartment from './Screens/SearchDepartment';
import SearchDepartmenM from './ScreensManager/SearchDepartmenM';

const stack = createNativeStackNavigator();
const App=()=> {
  return (
    <NavigationContainer>
      <stack.Navigator initialRouteName='Login'>
        <stack.Screen name='Login' component={Login} options={{ headerShown: false }}/>
        <stack.Screen name='Home' component={Home} options={{headerShown: false}}/>
        <stack.Screen name='ItemBoss' component={ ItemBoss} />
        <stack.Screen name='ItemDeparmen' component={ItemDepartmen}/>
        <stack.Screen name='AddDepartmen' component={AddDepartmen} options={{headerShown: false}}/>
        <stack.Screen name='Departmen' component={Departmen} options={{headerShown: false}}/>
        <stack.Screen name='Manager' component={Manager} options={{headerShown: false}}/>
        <stack.Screen name='AddManager' component={AddManager} options={{headerShown: false}}/>
        <stack.Screen name='Staff' component={Staff} options={{headerShown: false}}/>
        <stack.Screen name='AddStaff' component={AddStaff} options={{headerShown: false}}/>
        <stack.Screen name='StaffDetail' component={StaffDetail} options={{headerShown:false}}/>
        <stack.Screen name='ManagerDetail' component={ManagerDetail} options={{headerShown: false}}/>
        <stack.Screen name='NotificationChat' component={NotificationChat} options={{headerShown:false}}/>
        <stack.Screen name='HomeManager' component={HomeManager} options={{headerShown: false}}/>
        <stack.Screen name='NotificationManagerStaff' component={NotificationManagerStaff} options={{headerShown: false}}/>
        <stack.Screen name='DepartmenManager' component={DepartmenManagerr} options={{headerShown: false}}/>
        <stack.Screen name='ItemChat' component={ItemChat} options={{headerShown: false}}/>
        <stack.Screen name='HomeStaff' component={HomeStaff} options={{headerShown: false}}/>
        <stack.Screen name='DepartmenStaff' component={DepartmenStaff} options={{headerShown: false}}/>
        <stack.Screen name='SearchManager' component={SearchManager} options={{headerShown: false}}/>
        <stack.Screen name='SearchStaff' component={SearchStaff} options={{headerShown: false}}/>
        <stack.Screen name='SearchDepartment' component={SearchDepartment} options={{headerShown: false}}/>
        <stack.Screen name='SearchDepartmenM' component={SearchDepartmenM} options={{headerShown: false}}/>
      </stack.Navigator>  
    </NavigationContainer>
  );
}
export default App;
