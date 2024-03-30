import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View, Button,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    FlatList,
    Alert
} from 'react-native';
import { useContext, useLayoutEffect, useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import PantallasContext from './PantallaContext';

const Home = ({ navigation }) => {

    const { user, setUser, nombre, cursos, setCursos, setCursosSelect, setNotificaciones, setMyProyects } = useContext(PantallasContext);

    const fetchData = async () => {
        try {
            const fetchResponse = await fetch('http://35.172.79.148:5001/RecruitProyect/ramas');
            const data = await fetchResponse.json();
            setCursos(data.Ramas[0].Cursos);
        } catch (e) {
            Alert.alert(e.message);
        }
    }
    const fetchData2 = async () => {
        try {
            const fetchResponse = await fetch('http://35.172.79.148:5001/RecruitProyect/usuario?=' + nombre);
            const data = await fetchResponse.json();
            setUser({ Nombre: data.Nombre, Gmail: data.Gmail, Proyectos: data.Proyectos, Chats: data.Chats });
        } catch (e) {
            Alert.alert(e.message);
        }
    }

    const buscarNotificacion = async () => {
        try {
            const fetchResponse = await fetch('http://35.172.79.148:5001/RecruitProyect/notificaciones?=' + nombre);
            const data = await fetchResponse.json();
            setNotificaciones(data.encargos);
        } catch (e) {
            Alert.alert(e.message);
        }
    }
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            fetchData();
            fetchData2();
            buscarNotificacion();
            setMyProyects([]);
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("blur", () => {
            buscarNotificacion();
        });
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }) => {

        return (
            <View style={{
                width: 380,

                alignItems: 'center',
                marginTop: 25
            }}>
                <TouchableOpacity style={styles.button}
                    onPress={() => { setCursosSelect(item); navigation.navigate("SelectPro") }}
                    activeOpacity={0.8}>
                    <Text style={styles.letra}>{item}</Text>
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Cursos</Text>
            <FlatList
                data={cursos}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}

            />

        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#DEE9FF",
    },
    button: {
        width: '90%',
        padding: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#300098',
        backgroundColor: '#0750DC',
        margin: 5,
    },
    letra: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    titulo: {
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'Sans-Serif',
        color: '#300098',
    }
});
export default Home;
