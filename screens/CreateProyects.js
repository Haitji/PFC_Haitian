
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ScrollView, Image, Button } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import { RadioButton } from 'react-native-paper';
import PantallasContext from './PantallaContext';
import { Dropdown } from 'react-native-element-dropdown';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';


const CreateProyects = ({ navigation }) => {
    const [checked, setChecked] = useState('Publico');
    const { user, cursos,setNotificaciones } = useContext(PantallasContext);
    const [nom, setNom] = useState('');
    const [autor, setAutor] = useState('');
    const [dec, setDec] = useState('');
    const [chat, setChat] = useState('');
    const [img, setImg] = useState('');
    const [miembro, setMiembro] = useState([]);
    const [requ1, setRequ1] = useState('');
    const [requ2, setRequ2] = useState('');
    const [requ3, setRequ3] = useState('');
    const [requ4, setRequ4] = useState('');
    const [requ5, setRequ5] = useState('');
    const [req, setReq] = useState([]);
    const items = [
        { label: 'DAM', value: 'DAM' },
        { label: 'DAW', value: 'DAW' },
        { label: 'TELECOMUNICACIONES', value: 'TELECOMUNICACIONES' },
        { label: 'SISTEMA AUDIOVISUAL', value: 'SISTEMA AUDIOVISUAL' },
        { label: 'INGENIERIA INFORMATICA', value: 'INGENIERIA INFORMATICA' },
        { label: 'CIBERSEGURIDAD', value: 'CIBERSEGURIDAD' },
        { label: 'ROBOTICA', value: 'ROBOTICA' },
        { label: 'INTELIGENCIA ARTIFICIAL', value: 'INTELIGENCIA ARTIFICIAL' }
    ];
    const [curso, setCurso] = useState('DAM');
    const [ejecutar, setEjecutar] = useState(false);



    function limpiar() {
        setNom("");
        setDec("");
        setChat("");
        setMiembro([]);
        setRequ1("");
        setRequ2("");
        setRequ3("");
        setRequ4("");
        setRequ5("");
        setImg("");
        setCurso("DAM");
    }
    function crearChat() {
        setChat(user.Nombre + "_" + nom);
    }
    function crearRequisitos() {
        const array = [];
        array.push(requ1);
        array.push(requ2);
        array.push(requ3);
        array.push(requ4);
        array.push(requ5);
        setReq(array);
        crearMiembro();
        crearChat();
        setEjecutar(true);
    }
    function crearMiembro() {
        const array = [];
        array.push(user.Nombre);
        setMiembro(array);
    }

    function comprobarVacio() {
        crearChat();
        crearRequisitos();
        crearMiembro();
        let num = 0;
        if (nom == '') {
            Alert.alert("El nombre no puede estar vacio");
        } else {
            num++;
        }
        return num;
    }


    const fetchData = async () => {
        if (comprobarVacio() == 1) {
            const setting = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: JSON.stringify({
                    Autor: user.Nombre,
                    Nombre_proyecto: nom,
                    Descripcion_proyecto: dec,
                    Nombre_chat: chat,
                    Visualizacion: checked,
                    Imagen: img,
                    Requisitos: req,
                    Lista_miembros: miembro,
                    Curso: curso,
                    Gmail: user.Gmail
                }),
            }
            try {
                const fetchResponse = await fetch('http://35.172.79.148:5001/RecruitProyect/insertar_proyect', setting);
                const data = await fetchResponse.json();

                if (data.correct == "true") {
                    Alert.alert("Proyecto creado correctamente");
                    limpiar();
                    crearChatFireBase();
                } else if (data.correct == "proyecto") {
                    Alert.alert("Error al crear el proyecto");

                } else if (data.correct == "exist") {
                    Alert.alert("Ya tienes un proyecto con este nombre! Cambia de nombre");

                } else {
                    Alert.alert("Error de coneccion");
                }
            } catch (e) {
                Alert.alert("Error registering");
                Alert.alert(e.message);
            }

        }

    };

    /*     function crearChatFireBase() {
            const chat1DocRef = firestore().collection('chats').doc(chat);
            const mensajesCollection = chat1DocRef.collection('mensajes');
            const nuevoMensajeRef = mensajesCollection.doc();
            const fechaActual = new Date();
            const nuevoMensaje = {
                texto: 'Bienvenidos al chat del proyecto '+nom,
                usuario: 'Sistema',
                fecha: fechaActual
              };
              
              firestore().runTransaction(async (transaction) => {
                await transaction.set(chat1DocRef, { nombre: nom, miembros: miembro, autor: user.Nombre});
                await transaction.set(nuevoMensajeRef,nuevoMensaje);
              });
        } */
    function crearChatFireBase() {
        const chatRef = firestore().collection('chats').doc(chat);
        const fechaActual = new Date();
        const chatData = {
            mensajes: [{
                texto: 'Bienvenidos al chat del proyecto ' + nom,
                usuario: 'Sistema',
                fecha: fechaActual
            }],
            nombre: nom,
            miembros: miembro,
            autor: user.Nombre
        };
        chatRef.set(chatData)
            .then(() => {
                console.log('El chat se ha creado correctamente.');
            })
            .catch((error) => {
                console.error('Error al crear el chat:', error);
            });
    }
    useEffect(() => {
        if (ejecutar) {
            fetchData();
            setEjecutar(false);
        }
        setEjecutar(false);
    }, [req]);


    const handleTextChange = (newText) => {

        const lines = newText.split('\n');

        const nonEmptyLines = lines.filter((line) => line.trim() !== '');

        const cleanedText = nonEmptyLines.join('\n');

        setDec(cleanedText);
    };
    const selectImage = () => {
        ImagePicker.openPicker({
            cropping: true,
            includeBase64: true,
        })
            .then((image) => {
                // Aquí tienes la imagen seleccionada como objeto 'image'
                const base64Data = `data:${image.mime};base64,${image.data}`;
                setImg(base64Data);
                console.log('Imagen convertida a base64:', base64Data);
            })
            .catch((error) => {
                console.log('Error al seleccionar la imagen:', error);
            });
    };
    return (
        <ScrollView style={styles.container}>
            {img != "" ? <Image source={{ uri: img }} style={{ width: '90%', height: 200, marginLeft: 'auto', marginRight: 'auto', marginTop: 10, marginBottom: 10, resizeMode: 'contain' }} /> : <Image style={{ width: '90%', height: 200, marginBottom: 5, borderRadius: 10, marginLeft: 'auto', marginRight: 'auto', marginTop: 15, marginBottom: 15, resizeMode: 'contain' }} source={require('../Imagen/notImage.jpeg')} />}
            <TouchableOpacity style={styles.boton2} onPress={() => { selectImage() }}>
                <Text style={styles.textBoton}>Selecionar imagen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boton2} onPress={() => { setImg('') }}>
                <Text style={styles.textBoton}>Quitar imagen</Text>
            </TouchableOpacity>
            <View style={styles.contenedor_cabezera}>
                <Text style={styles.cabezera}>Nombre del proyecto</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder='Nombre'
                placeholderTextColor="#00308E"
                onChangeText={(text) => setNom(text)}
                value={nom}
            />

            <View style={styles.contenedor_cabezera}>
                <Text style={styles.cabezera}>Descripcion del proyecto</Text>
            </View>
            <TextInput
                style={styles.textarea}
                multiline={true}
                numberOfLines={4}
                placeholder="Descripcion del proyecto"
                textAlignVertical="top"
                onChangeText={handleTextChange}
                value={dec}
            // Aquí puedes añadir otras propiedades de TextInput como el estilo
            />

            <View style={styles.contenedor_cabezera}>
                <Text style={styles.cabezera}>Modalidad Curso</Text>
            </View>

            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                labelField="label"
                valueField="value"
                value={curso}
                data={items}
                onChange={item => {
                    setCurso(item.value);
                }}
            />
            <View style={styles.contenedor_cabezera}>
                <Text style={styles.cabezera}>Visualización del proyecto</Text>
            </View>
            <RadioButton.Group onValueChange={setChecked} value={checked}>
                <RadioButton.Item label="Publico" value="Publico" labelStyle={{ color: '#300098' }} />
                <RadioButton.Item label="Privado" value="Privado" labelStyle={{ color: '#300098' }} />
            </RadioButton.Group>

            <View style={styles.contenedor_cabezera}>
                <Text style={styles.cabezera}>Requisitos</Text>
            </View>
            <TextInput
                style={styles.input2}
                placeholder='Requisito 1'
                placeholderTextColor="#00308E"
                onChangeText={(text) => setRequ1(text)}
                value={requ1}
            />
            <TextInput
                style={styles.input2}
                placeholder='Requisito 2'
                placeholderTextColor="#00308E"
                onChangeText={(text) => setRequ2(text)}
                value={requ2}
            />
            <TextInput
                style={styles.input2}
                placeholder='Requisito 3'
                placeholderTextColor="#00308E"
                onChangeText={(text) => setRequ3(text)}
                value={requ3}
            />
            <TextInput
                style={styles.input2}
                placeholder='Requisito 4'
                placeholderTextColor="#00308E"
                onChangeText={(text) => setRequ4(text)}
                value={requ4}
            />
            <TextInput
                style={styles.input2}
                placeholder='Requisito 5'
                placeholderTextColor="#00308E"
                onChangeText={(text) => setRequ5(text)}
                value={requ5}
            />
            <Text></Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity style={styles.boton} onPress={() => { crearRequisitos() }}>
                    <Text style={styles.textBoton}>Crear</Text>
                </TouchableOpacity>
            </View>

            <Text></Text>
            <Text></Text>
        </ScrollView>
    );
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#B6CFFF",

    },
    input: {
        height: 55,
        width: '90%',
        margin: 12,
        marginTop: 2,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        opacity: 1,
        backgroundColor: "white",
        borderColor: "#00308E",
        fontSize: 18,
        letterSpacing: 0.6,
        color: "#004ADB"
    },
    input2: {
        height: 48,
        width: '88%',
        margin: 18,
        marginTop: 5,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        opacity: 1,
        backgroundColor: "white",
        borderColor: "#00308E",
        fontSize: 16,
        letterSpacing: 0.6,
        color: "#004ADB"
    },
    textarea: {
        height: 55,
        width: '90%',
        margin: 12,
        marginTop: 2,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        opacity: 1,
        backgroundColor: "white",
        borderColor: "#00308E",
        fontSize: 18,
        letterSpacing: 0.6,
        color: "#004ADB",
        height: 120
    },
    cabezera: {
        fontSize: 20,
        fontWeight: "bold",
        color: '#300098',
    },
    contenedor_cabezera: {
        width: '100%', alignItems: 'flex-start', paddingLeft: 21, marginTop: 20, marginBottom: 3
    },
    boton: {
        width: '80%',
        height: 47,
        borderWidth: 2,
        margin: 10,
        borderRadius: 5,
        borderColor: 'blue',
        fontWeight: 'bold',
        fontSize: 17,
        backgroundColor: '#0750DC',
        justifyContent: 'center'
    },
    boton2: {
        width: '90%',
        height: 47,
        borderWidth: 2,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: 10,
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
    dropdown: {
        paddingLeft: 10,
        borderColor: '#00308E',
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        width: '80%',
        height: '5%',
        padding: 2,
        borderRadius: 10,
        justifyContent: 'center',
        marginLeft: 13,
        color: 'blue'
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 17,
        backgroundColor: '#b1ddd9',
        borderRadius: 10,
    },
    selectedTextStyle: {
        fontSize: 18,
        color: '#00308E',
    },
})
export default CreateProyects;