
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, FlatList, Alert } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import 'react-native-gesture-handler'
import firestore from '@react-native-firebase/firestore';
import PantallasContext from './PantallaContext';

const SelectChat = ({ navigation }) => {
    const [chats, setChats] = useState([]);
    const { setIdChat, user,chat,setChat,setProyects,setMyProyects,setNotificaciones } = useContext(PantallasContext);


    async function cargarChats() {
        const chatsRef = firestore().collection('chats');
        try {
            const suscriber = chatsRef.where('miembros', 'array-contains', user.Nombre).onSnapshot(querySnapshot => {
                const chatList = [];
                querySnapshot.forEach((doc => {
                    const id = doc.id;
                    const data = doc.data();
                    console.log('ID:', id);
                    console.log('Datos:', data);

                    chatList.push({ id, ...data });
                }))
                setChats(chatList);
            })
            return () => suscriber()

            /*             const unsubscribe = chatsRef.where('miembros', 'array-contains', user.Nombre).onSnapshot((snapshot) => {
                            const chatlist = snapshot.docs.map((doc) => doc.data());
                            setChats(chatlist);
                          });
                          return () => unsubscribe(); */
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        cargarChats();
    }, [])

    function irAChat(id) {
        setIdChat(id);
        navigation.navigate("Chat");
    }
    const chatItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.item}
                onPress={() => {setChat(item.nombre);irAChat(item.id)}}
                activeOpacity={0.8}>
                <Text style={styles.titulo}>{item.nombre}</Text>
                <Text style={{color: '#300098',fontSize:18}}>autor: {item.autor}</Text>
            </TouchableOpacity>
        )
    }



    /*     function crearChat2() {
            const chat1DocRef = firestore().collection('chats').doc('new chat');
            const mensajesCollection = chat1DocRef.collection('mensajes');
            const nuevoMensajeRef = mensajesCollection.doc();
            const fechaActual = new Date();
            const nuevoMensaje = {
                texto: 'Bienvenidos al chat del proyecto ',
                usuario: 'Sistema',
                fecha: fechaActual
              };
              
              firestore().runTransaction(async (transaction) => {
                await transaction.set(chat1DocRef, { mensajeInicial: 'Hola',Usuarios: ["a","b"] });
                await transaction.set(nuevoMensajeRef,nuevoMensaje);
              });
        } */

    return (
        <View style={{ flex: 1, backgroundColor: "#DEE9FF", }}>
            <Text style={styles.titulo2}>Chats</Text>
            {(chats.length!=0)?
            <FlatList
                data={chats}
                renderItem={chatItem}
                keyExtractor={(item) => item.id}
                numColumns={1} // Configurar orientación de columna
            />:<Text style={styles.noDisponible}>No estas en ningun proyecto, no tienes acceso a ningun chat</Text>
        }
            {/*  <Button title="Press me 2" onPress={() => crearChat2()} /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0,
        paddingHorizontal: 10,
        /* backgroundColor: '#BDC7FF', */

    },
    item: {
        borderRadius: 10,
        borderWidth: 3,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#300098',
        backgroundColor: '#BDC7FF',
        padding: 20,
        paddingTop:10,
        marginVertical: 10,
        marginHorizontal: 10,
        flex: 1, // Ajustar el tamaño de la columna
        alignItems: 'flex-start', // Alinear elementos en el centro
        justifyContent: 'center', // Justificar elementos en el centro

    },
    titulo: {
        fontSize: 25, fontWeight: 'bold', letterSpacing: 1, color: '#300098',paddingBottom:5
    },
    normalText: {
        fontSize: 23,
        fontWeight: 'bold',
        marginTop: 5,
        paddingLeft: 10,
        color: '#300098',
    },
    normalText2: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 11,
        paddingLeft: 10,
        color: '#300098',
    },
    noDisponible:{
        color: '#300098',
        fontSize:20,
        alignContent:'center',
        alignItems:'center',
        margin:50,
        marginVertical:200
      },
      titulo2: {
        fontSize: 35,
        fontWeight: 'bold',
        fontFamily: 'Sans-Serif',
        color: '#300098',
        marginLeft:'auto',
        marginRight:'auto'
    }

});

export default SelectChat;