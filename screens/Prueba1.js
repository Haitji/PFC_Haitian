import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, FlatList, Alert, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';

const Prueba1 = ({ navigation }) => {
    const [datos, setDatos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        // Función para cargar los datos de la página actual
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const fetchResponse = await fetch('http://192.168.1.137:5001/prueba/ramas?=Page' + currentPage);
                const data = await fetchResponse.json();
                const nuevo = data.Ramas;
                const datosActualizado = [...datos, ...nuevo];
                if (nuevo.length != 0) {
                    setDatos(datosActualizado);
                    console.log("Soy el primero")
                }

            } catch (e) {
                Alert.alert(e.message);
            }
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
        // Llama a la función para cargar los datos de la página actual
        fetchData();
    }, [currentPage]);

    const loadNextPage = () => {
        if (isLoading) {
            return;
        }
        // Incrementa el número de página actual
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const renderFooter = () => {
        // Renderiza un indicador de carga más prominente y un mensaje informativo
        if (isLoading) {
            return (
                <View style={{ alignItems: 'center', padding: 10 }}>
                    <ActivityIndicator size="large" color="gray" />
                    <Text style={{ marginTop: 10 }}>Cargando más datos...</Text>
                </View>
            );
        }

        return null;
    };
    const [miembros, setMiembros] = useState(["avier", "pablo"])
    return (
        <View>
            <FlatList
                data={datos}
                renderItem={({ item }) => (
                    <View style={{ height: 800, borderWidth: 5 }}>
                        <Text>{item.hola}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.hola}
                onEndReached={loadNextPage}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
    },
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
export default Prueba1;