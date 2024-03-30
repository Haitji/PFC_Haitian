import { StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, Alert } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import 'react-native-gesture-handler'
import PantallasContext from './PantallaContext';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import { IconButton,ActivityIndicator } from 'react-native-paper';

const Notification = ({ navigation }) => {

    const[pul,setPul]=useState(false);
    const { user, setUser, nombre, notificaciones, setNotificaciones,setProyects,setMyProyects } = useContext(PantallasContext);

    /*     const DATA = [
            { mensaje: 'Javier desea unirse al proyecto tres en raya', estado: 'Nulo', tipo: 'Solicitud' },
            { mensaje: 'Javier desea unirse al proyecto tres en raya', estado: 'Nulo', tipo: 'Solicitud' },
            { mensaje: 'Javier desea unirse al proyecto tres en raya', estado: 'Nulo', tipo: 'Solicitud' }
        ]; */
    const fetchData = async () => {
        try {
            const fetchResponse = await fetch('http://35.172.79.148:5001/RecruitProyect/notificaciones?=' + nombre);
            const data = await fetchResponse.json();
            setNotificaciones(data.encargos);
        } catch (e) {
            Alert.alert(e.message);
        }
        setPul(true);
    }

    const fetchDataPost = async (autor, desti, proy, esta,metodo) => {

        const setting = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: JSON.stringify({
                Autor: autor,
                Destinatario: desti,
                Proyecto: proy,
                Estado: esta
            }),
        }
        try {
            const fetchResponse = await fetch('http://35.172.79.148:5001/RecruitProyect/aceptar_notificacion', setting);
            const data = await fetchResponse.json();
            if (data.correct == "true") {
                if(metodo=="aceptar"){
                    Alert.alert("Solicitud aceptado correcto");
                }else{
                    Alert.alert("Solicitud rechazado correcto");
                }
                fetchData();
            } else if (data.correct == "false") {
                Alert.alert("Error al actualizar Solicitud");
                fetchData();
            } else {
                Alert.alert("Error de coneccion");
            }
        } catch (e) {
            Alert.alert("Error registering");
            Alert.alert(e.message);
        }
        setPul(false);
    };
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            fetchData();
        });
        return unsubscribe;
    }, [navigation]);
    useEffect(() => {
        const unsubscribe = navigation.addListener("blur", () => {
          setPul(false);
        });
        return unsubscribe;
      }, [navigation]);
    const renderItem = ({ item }) => (
        <View style={styles.container}>
            <Text style={styles.title}>{item.Tipo}</Text>
            <Text style={styles.normalText}>{item.Mensaje}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity style={styles.boton} onPress={() => { fetchDataPost(item.Autor, item.Destinatario, item.Proyecto, "No","rechazar"); fetchData() }}>
                    <Text style={styles.textBoton}>Rechazar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.boton} onPress={() => { fetchDataPost(item.Autor, item.Destinatario, item.Proyecto, "Si","aceptar"); fetchData(); actualizarDocumentoFirebase(item.Chat, item.Autor) }}>
                    <Text style={styles.textBoton}>Aceptar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    function actualizarDocumentoFirebase(chat, autor) {
        const docRef = firestore().collection('chats').doc(chat);

        firebase.firestore().runTransaction(async (transaction) => {
            const doc = await transaction.get(docRef);

            if (!doc.exists) {
                throw new Error('El documento no existe');
            }

            const data = doc.data();
            const newArray = [...data.miembros, autor];

            transaction.update(docRef, { miembros: newArray });
        })
            .then(() => {
                console.log('Campo de tipo array actualizado exitosamente');
            })
            .catch((error) => {
                console.error('Error al actualizar el campo de tipo array:', error);
            });
    }
    return (
        <View>
            {pul ?((notificaciones.length != 0)?<FlatList
                data={notificaciones}
                renderItem={renderItem}
                keyExtractor={(item) => item.Mensaje}
                numColumns={1} // Configurar orientación de columna
            />:<Text style={styles.noDisponible}>No tienes ninguna notificacion</Text>): <ActivityIndicator style={{marginVertical:200}} size={60} animating={true} color={'#300098'}/>}
            
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "#DEE9FF",
        margin: 10,
        marginTop: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#300098',
    },
    title: {
        fontSize: 30, fontWeight: 'bold', letterSpacing: 1, color: '#300098',
    },
    normalText: {
        fontSize: 18,
        marginTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
        color: '#300098',
    },
    boton: {
        width: '45%',
        height: 55,
        borderWidth: 2,
        margin: 10,
        borderRadius: 5,
        borderColor: 'blue',
        fontWeight: 'bold',
        fontSize: 17,
        backgroundColor: '#0750DC',
        justifyContent: 'center'
    },
    textBoton: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        paddingBottom: 4
    },
    noDisponible:{
        color: '#300098',
        fontSize:20,
        alignContent:'center',
        alignItems:'center',
        margin:50,
        marginVertical:200
      }
});
export default Notification;