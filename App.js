import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TouchableOpacity
} from 'react-native';
import Home from './screens/Home'
import Login from './screens/Login'
import Registrar from './screens/Registrar';
import Notification from './screens/Notification';
import SelectPro from './screens/SelectProyect'
import Proyects from './screens/Proyects';
import SelectChat from './screens/SelectChat';
import Chat from './screens/Chat';
import SelectMyProyect from './screens/SelectMyProyect';
import MyProyect from './screens/MyProyect';
import CreateProyects from './screens/CreateProyects';

import prueba from './screens/Prueba1'

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Iconos from 'react-native-vector-icons/Foundation';
import { PantallasProvider } from './screens/PantallaContext';
import { useContext, useState } from 'react';
import PantallasContext from './screens/PantallaContext';
import 'react-native-gesture-handler';
import { Badge, IconButton } from 'react-native-paper';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const App = () => (
  <PantallasProvider>
    <NavigationContainer>
      {StackNav()}
    </NavigationContainer>
  </PantallasProvider>
)

function StackNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Login'
        component={Login}
        options={{ headerShown: false }} />
      <Stack.Screen
        name='Hogar'
        component={DrawerGestor}
        options={{ headerShown: false }} />
      <Stack.Screen
        name='Registrar'
        component={Registrar}
        options={tabBarStackNav} />
        <Stack.Screen
        name='Prueba'
        component={prueba}
        options={tabBarStackNav} />
    </Stack.Navigator>
  )
}
const tabBarStackNav = ({ navigation }) => {
  return {
    headerStyle: {
      backgroundColor: 'blue',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 20,
    },
    headerLeft: () => (<TouchableOpacity style={{ marginLeft: 10 }} activeOpacity={0.6} onPress={() => navigation.goBack()}><Icon name="chevron-back-outline" size={30} color={'white'} /></TouchableOpacity>)
  }
}
function DrawerGestor() {
  const { user,setUser,nombre,notificaciones, setNotificaciones } = useContext(PantallasContext);
  return (
    <Drawer.Navigator
      initialRouteName='Home' drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ marginRight: 10 }}>

              <Icon.Button
                name="notifications"
                size={28}
                backgroundColor="blue"
                onPress={() => navigation.navigate("Notification")}>
                  
              </Icon.Button>
              {/* <IconButton icon="bell" size={26} color="#f00" onPress={() => navigation.navigate("Notification")} /> */}
              {notificaciones.length!=0?<Badge size={20} style={{ position: 'absolute', top: 3, right: 3 }}>
                {notificaciones.length}
              </Badge>:<></>}
              
            </View>
          </View>
        ),
        headerStyle: {
          backgroundColor: 'blue',
          height: 60,
        },
        headerTintColor: 'white',
      }
      )}
      resetOnBlur={true}
    >
      <Drawer.Screen name='Home' component={TabNav} options={{ title: "Inicio" }}/>

      <Drawer.Screen name='My Proyects' component={StackMyProyects} options={{ title: "Mis Proyectos" }} />
      <Drawer.Screen name='Create Proyect' component={CreateProyects} options={{ title: "Crear Proyectos" }} />
      <Drawer.Screen name='Notification' component={Notification} options={{ title: "Notificaciones" }}/>

      {/*  <Drawer.Screen name='olver' component={Volver} /> */}
    </Drawer.Navigator>
  )
}

function StackHome() {
  return (<Stack.Navigator>
    <Stack.Screen
      name='Inicio'
      component={Home}
      options={{ headerShown: false }} />
    <Stack.Screen
      name='SelectPro'
      component={SelectPro}
      options={{ headerShown: false }} />
    <Stack.Screen
      name='Proyects'
      component={Proyects}
      options={tabBarStackNav} />
  </Stack.Navigator>)
}


function StackChat() {
  return (<Stack.Navigator
    /* screenOptions={{
      animationEnabled: true,
      gestureEnabled: true, // Habilita el deslizamiento manual de las pantallas
      cardStyleInterpolator: ({ current: { progress } }) => ({
        cardStyle: {
          transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [1000, 0] }) }],
        },
      }),
    }} */>
    <Stack.Screen
      name='SelectChat'
      component={SelectChat}
      options={{ headerShown: false }} />
    <Stack.Screen
      name='Chat'
      component={Chat}
      options={tabBarStackNav} />
  </Stack.Navigator>)
}


function StackMyProyects() {
  return (<Stack.Navigator initialRouteName='SelectMyProyect'
    screenOptions={{ unmountOnBlur: false }}>
    <Stack.Screen
      name='SelectMyProyect'
      component={SelectMyProyect}
      options={{ headerShown: false }} />
    <Stack.Screen
      name='MyProyect'
      component={MyProyect}
      options={{ headerShown: false }} />
  </Stack.Navigator>)
}


function TabNav() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        activeTintColor: "blue",
        inactiveTintColor: 'black',
        tabBarStyle: { backgroundColor: "#EAF1FF" }
      }}

    >
      <Tab.Screen name="Tab1" component={StackHome}
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Icon name="ios-home" size={size} color={color} />
          )
        }} />
      <Tab.Screen name="Tab2" component={StackChat}
        options={{
          title: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Icon name="chatbox-ellipses" size={size} color={color} />
          )
        }} />
    </Tab.Navigator>);
}


function CustomDrawerContent(props) {
  const { navigation } = props;

  function handlePress() {
    navigation.popToTop();
  }
  const { nombre } = useContext(PantallasContext);

  //=============================================================================================  
  return (
    <DrawerContentScrollView {...props}>

      <View style={{ flex: 1, backgroundColor: 'blue', height: 100, marginTop: -5, justifyContent: 'flex-end', padding: 18 }}>
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', }}>{nombre}</Text>
      </View>
      <View style={{ flex: 1, height: '100%' }}>
        <DrawerItem
          icon={() => <Icon name="ios-home" size={22} color={'#A7A7A7'} />}
          label="Inicio"
          onPress={() => { navigation.navigate("Inicio") }}
        />
        <DrawerItem
          icon={() => <Icon name="newspaper" size={25} color={'#A7A7A7'} />}
          label="Mis Proyectos"
          onPress={() => { navigation.navigate('My Proyects'); }}
        />
        <DrawerItem
          icon={() => <Iconos name="plus" size={28} color={'#A7A7A7'} />}
          label="Crear Proyectos"
          onPress={() => { navigation.navigate("Create Proyect") }}
        />
        <DrawerItem
          icon={() => <Icon name="exit-sharp" size={22} color={'#A7A7A7'} />}
          label="Salir"
          onPress={handlePress}
        />
      </View>
    </DrawerContentScrollView>
  );
}
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
