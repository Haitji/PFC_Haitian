
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
    FlatList
} from 'react-native';
import { useContext, useState, useLayoutEffect, useEffect, useRef } from 'react';
import 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons';
import PantallasContext from './PantallaContext';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import firebase from '@react-native-firebase/app';



const Chat = ({ navigation }) => {

    const { idChat, user, chat } = useContext(PantallasContext);
    const [mensajes, setMansajes] = useState([]);
    const [messageText, setMessageText] = useState("");
    const flatListRef = useRef(null);


    useLayoutEffect(() => {
        navigation.setOptions({ title: 'Chat: ' + chat });
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
    const [inputHeight, setInputHeight] = useState();
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };


    useEffect(() => {
        cargarMensajes();
    }, [])


    async function cargarMensajes() {
        /* try {
            const chatsRef = firestore().collection('chats').doc(idChat).collection('mensajes');
            const query = chatsRef.orderBy('fecha', 'asc');
            const unsubscribe = query.onSnapshot((snapshot) => {
                const mensaje = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMansajes(mensaje);

            }); 
        } catch (error) {
            console.log('Error fetching messages:', error);
        }  */
        const chatRef = firestore().collection('chats').doc(idChat);
        const unsubscribe = chatRef.onSnapshot((snapshot) => {
            const chatData = snapshot.data();
            const mensajesArray = chatData.mensajes || [];
            const mensajesOrdenados = mensajesArray.slice().sort((a, b) => a.fecha - b.fecha);
            setMansajes(mensajesOrdenados);
            scrollToBottom();

          });
        return () => unsubscribe();
    } 
    /*     const agregarMensaje = () => {
            const mensajesCollection = firestore()
                .collection('chats')
                .doc(idChat)
                .collection('mensajes');
    
            const nuevoMensaje = {
                usuario: user.Nombre,
                texto: messageText,
                fecha: new Date(),
            };
    
            mensajesCollection
                .add(nuevoMensaje)
                .then(() => {
                    console.log('Mensaje agregado exitosamente');
                    setMessageText(''); // Limpiar el campo de texto después de agregar el mensaje
                })
                .catch((error) => {
                    console.error('Error al agregar el mensaje:', error);
                });
        }; */

    const agregarMensaje = () => {
        const docRef = firestore().collection('chats').doc(idChat);

        firebase.firestore().runTransaction(async (transaction) => {
            const doc = await transaction.get(docRef);

            if (!doc.exists) {
                throw new Error('El documento no existe');
            }
            const fechaActual = new Date();
            const data = doc.data();
            const newArray = [...data.mensajes, {
                texto: messageText,
                usuario: user.Nombre,
                fecha: fechaActual
            }];

            transaction.update(docRef, { mensajes: newArray });
        })
            .then(() => {
                console.log('Campo de tipo array actualizado exitosamente');
                setMessageText('');
            })
            .catch((error) => {
                console.error('Error al actualizar el campo de tipo array:', error);
            });
    }

    const menssageItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.item}
                /* onPress={() => navigation.navigate("Chat")} */
                activeOpacity={0.8}>
                <View style={{
                    flexDirection: 'row',
                    borderBottomWidth: 0,
                    marginBottom: 5
                }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10, marginRight: 10, marginBottom: 5, color: '#040567', width: '50%' }}>{item.usuario}</Text>
                    <Text style={{ fontSize: 14, marginTop: 10, marginRight: 10, marginBottom: 5, paddingTop: 4, color: '#6D0882', width: '50%' }}>{moment(item.fecha.toDate()).format('YYYY-MM-DD HH:mm:ss')}</Text>
                </View>
                <Text style={{ fontSize: 16, padding: 5, color: '#000000' }}>{item.texto}</Text>
            </TouchableOpacity>
        )
    }
    const scrollToBottom = () => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    };
    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: '#B6CFFF' }}>
                    <FlatList
                        ref={flatListRef}
                        data={mensajes}
                        renderItem={menssageItem}
                        keyExtractor={(item) => item.fecha}
                        onContentSizeChange={scrollToBottom}
                        numColumns={1} // Configurar orientación de columna
                    />
                </View>

                <View style={{
                    justifyContent: 'flex-end',
                    height: 50
                }}>
                    <KeyboardAvoidingView style={{
                        padding: 10,
                        backgroundColor: '#fff',
                        borderTopWidth: 1,
                        borderTopColor: '#E4E7EF',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',

                    }}
                        behavior={Platform.OS === 'android' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'android' ? 20 : 0}>
                        <View style={{
                            borderRadius: 8,
                            borderColor: '#E4E7EF',
                            backgroundColor: '#E4E7EF',
                            width: '90%',
                            borderWidth: 1,
                            justifyContent: 'center',
                            paddingHorizontal: 12,
                            marginBottom: 8,
                        }}>
                            <TextInput style={{ height: inputHeight }}
                                value={messageText}
                                multiline={true}
                                onContentSizeChange={(e) => setInputHeight(e.nativeEvent.contentSize.height)}
                                onChangeText={(text) => setMessageText(text)} />
                        </View>
                        <Icon name="send" size={27} color={'#1115B1'} style={{ paddingBottom: 6 }} onPress={agregarMensaje} />
                    </KeyboardAvoidingView>
                </View>
            </View>
        </TouchableWithoutFeedback>
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
        borderWidth: 0,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#300098',
        backgroundColor: '#E7EFFE',
        paddingLeft: 20,
        paddingRight: 10,
        paddingBottom: 8,
        marginVertical: 2,
        marginHorizontal: 1,
        flex: 1, // Ajustar el tamaño de la columna
        alignItems: 'flex-start', // Alinear elementos en el centro

    },
    titulo: {
        fontSize: 30, fontWeight: 'bold', letterSpacing: 1, color: '#300098',
    },


});

export default Chat;