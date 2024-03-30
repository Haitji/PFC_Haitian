
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView, Alert } from 'react-native';
import { useContext, useState, useLayoutEffect, useEffect } from 'react';
import PantallasContext from './PantallaContext';
import moment from 'moment';

const Proyects = ({ navigation }) => {

    /*const data = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
const data2 = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
const image2 = 'https://as2.ftcdn.net/v2/jpg/03/15/18/09/1000_F_315180932_rhiXFrJN27zXCCdrgx8V5GWbLd9zTHHA.jpg';
*/

    const { proyects, user, nombreChat, setProyects,setNotificaciones,esteProyecto } = useContext(PantallasContext);
    const esteP = esteProyecto.filter(proyect => proyect.Nombre_chat === nombreChat);
    const today = new Date();
    const formattedDate = moment(today).format('YYYY-MM-DD');

    const fetchData = async () => {
        const setting = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: JSON.stringify({
                Autor: user.Nombre,
                Destinatario: proyects[0].Autor,
                Mensaje: user.Nombre + " desea unirse al proyecto: " + proyects[0].Nombre_proyecto,
                Estado: "No",
                Tipo: "Solicitud",
                Fecha_envio: formattedDate,
                Proyecto: proyects[0].Nombre_proyecto,
                Chat: proyects[0].Nombre_chat
            }),
        }
        try {
            const fetchResponse = await fetch('http://35.172.79.148:5001/RecruitProyect/enviar_notificacion', setting);
            const data = await fetchResponse.json();

            if (data.correct == "true") {
                Alert.alert("Solicitud enviada con exito");
            } else if (data.correct == "false") {
                Alert.alert("Error al solicitar");
            } else if (data.correct == "exist") {
                Alert.alert("Ya solicitastes el acceso a este proyecto");
            } else {
                Alert.alert("Error de coneccion");
            }
        } catch (e) {
            Alert.alert("Error registering");
            Alert.alert(e);
        }
    };




    useLayoutEffect(() => {
        navigation.setOptions({ title: 'Proyect' });
        navigation.getParent().getParent().setOptions({ headerShown: false });
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            navigation.getParent().getParent().setOptions({ headerShown: true });
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            navigation.getParent().getParent().setOptions({ headerShown: false });
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <ScrollView style={styles.container}>
            {/* <Image
        style={{ width: 350, height: 200,marginBottom:5,borderRadius:10,resizeMode:'contain' }}
        source={{ uri: image2 }}
        /> */}
            <Text style={styles.titulo}>{esteP[0].Nombre_proyecto}</Text>
            {esteP[0].Imagen != "" ? <Image
                style={{ width: '100%', height: 200, marginBottom: 5, borderRadius: 10, resizeMode: 'contain' }}
                source={{ uri: esteP[0].Imagen }}
            /> : <Image style={{ width: '100%', height: 200, marginBottom: 5, borderRadius: 10, resizeMode: 'contain' }} source={require('../Imagen/notImage.jpeg')} />}
            <Text style={styles.subtitulo}>Descripción</Text>
            <Text style={styles.textoNormal}>{proyects[0].Descripcion_proyecto}</Text>

            <Text style={styles.subtitulo}>Requisitos</Text>
            {esteP[0].Requisitos.map((fruit, index) => (
                <Text key={index} style={styles.textoNromal2}>-{fruit}</Text>
            ))}
            <Text style={styles.subtitulo}>Autor</Text>
            <Text style={styles.textoNromal3}>{esteP[0].Gmail}</Text>
            <Text style={styles.subtitulo}>Miembros: {esteP[0].Lista_miembros.length}</Text>
            <Text></Text>
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity style={styles.button} onPress={() => { fetchData() }}>
                    <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold', textAlign: 'center' }}>Join</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#DEE9FF'
    },
    button: {
        width: '80%',
        padding: 10,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#300098',
        backgroundColor: '#0750DC',
        margin: 5,
        marginBottom: 35
    },
    textoNormal: {
        fontSize: 16,
        marginHorizontal: 10,
        paddingRight: 15,
        paddingLeft: 5,
        color: '#300098',
        flexWrap: 'wrap'
    },
    textoNromal2: {
        fontSize: 23,
        fontWeight: '400',
        paddingLeft: 24,
        color: '#300098',
        marginBottom: 2
    },
    textoNromal3: {
        fontSize: 20,
        fontWeight: '400',
        paddingLeft: 24,
        color: '#300098',
        marginBottom: 0
    },
    titulo: {
        fontSize: 38,
        fontWeight: 'bold',
        fontFamily: 'Sans-Serif',
        color: '#300098',
        paddingLeft: 5,
        paddingBottom: 4,
        margin: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#300098'
    },
    subtitulo: {
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'Sans-Serif',
        color: '#300098',
        margin: 10,
        marginTop: 34
        /*textDecorationLine: 'underline' */
    },
});
export default Proyects;