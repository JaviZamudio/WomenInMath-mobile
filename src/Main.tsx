import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import LoginScreen from "./screens/LoginScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import FactsScreen from "./screens/FactsScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import ProfileScreen from "./screens/ProfileScreen";
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function Main() {
  const { user } = useContext(AuthContext);

  const chooseIcon = ({ focused, color, size }, route) => {
    let iconName;

    switch (route.name) {
      case "Home":
        iconName = focused
          ? 'home'
          : 'home-outline';
        break;
      case "Facts":
        iconName = focused
          ? 'information-circle'
          : 'information-circle-outline';
        break;
      case "Favorites":
        iconName = focused
          ? 'heart'
          : 'heart-outline';
        break;
      case "Profile":
        iconName = focused
          ? 'person'
          : 'person-outline';
        break;
    }

    // You can return any component that you like here!
    return <Ionicons name={iconName} size={size} color={color} />;
  }

  return (
    <>
      {!user?.uid ?
        <LoginScreen />
        :
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: (props) => chooseIcon(props, route),
            tabBarActiveTintColor: '#0e666c',
            tabBarInactiveTintColor: 'gray',
            headerTitle: "DiApp",
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Facts" component={FactsScreen} />
          <Tab.Screen name="Favorites" component={FavoritesScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      }
    </>
  )
};