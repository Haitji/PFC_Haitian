
import { StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, keyboardVerticalOffset, Alert, ScrollView, Image } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import { RadioButton } from 'react-native-paper';
import PantallasContext from './PantallaContext';
import { Dropdown } from 'react-native-element-dropdown';
import ImagePicker from 'react-native-image-crop-picker';

const MyProyect = ({ navigation }) => {
    const [checked, setChecked] = useState('Publico');
    const { myProyects, user, nombreChat, setMyProyects,setNotificaciones } = useContext(PantallasContext);
    const esteP = myProyects.filter(proyect => proyect.Nombre_chat === nombreChat);
    const [nom, setNom] = useState('');
    const [desc, setDesc] = useState('');
    const [requ1, setRequ1] = useState("");
    const [requ2, setRequ2] = useState("");
    const [requ3, setRequ3] = useState("");
    const [requ4, setRequ4] = useState("");
    const [requ5, setRequ5] = useState("");
    const [req, setReq] = useState(null);
    const [autor, setAutor] = useState('');
    const [lista, setLista] = useState([]);
    const [imagen, setImagen] = useState("");
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


    function crearRequisitos() {

        const array = [];
        if (requ1 == null) {
            array.push("");
        } else {
            array.push(requ1);
        }
        if (requ2 == null) {
            array.push("");
        } else {
            array.push(requ2);
        }
        if (requ3 == null) {
            array.push("");
        } else {
            array.push(requ3);
        }
        if (requ4 == null) {
            array.push("");
        } else {
            array.push(requ4);
        }
        if (requ5 == null) {
            array.push("");
        } else {
            array.push(requ5);
        }
        setReq(array);
        setEjecutar(true);
    }


    useEffect(() => {
        if (ejecutar) {
            Alert.alert(
                'Confirmación',
                '¿Estás seguro de que deseas actualizar el proyecto?',
                [
                    { text: 'Cancelar', onPress: () => console.log('Cancelado') },
                    { text: 'Aceptar', onPress: () => fetchData() }
                ]
            );

            setEjecutar(false);
        }
    }, [req]);

    const fetchData = async () => {
        const setting = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: JSON.stringify({
                Descripcion_proyecto: desc,
                Nombre_chat: nombreChat,
                Visualizacion: checked,
                Requisitos: req,
                Curso: curso,
                Imagen: imagen
            }),
        }
        try {
            const fetchResponse = await fetch('http://35.172.79.148:5001/RecruitProyect/actualizar_proyect', setting);
            const data = await fetchResponse.json();

            if (data.correct == "true") {
                Alert.alert("Proyecto actualizado correctamente");
            } else if (data.correct == "proyecto") {
                Alert.alert("Error al actualizar el proyecto");
            } else {
                Alert.alert("Error de coneccion");
            }
        } catch (e) {
            Alert.alert("Error registering");
            Alert.alert(e.message);
        }
    };


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setNom(esteP[0].Nombre_proyecto);
            setDesc(esteP[0].Descripcion_proyecto);
            setRequ1(esteP[0].Requisitos[0]);
            setRequ2(esteP[0].Requisitos[1]);
            setRequ3(esteP[0].Requisitos[2]);
            setRequ4(esteP[0].Requisitos[3]);
            setRequ5(esteP[0].Requisitos[4]);
            setImagen(esteP[0].Imagen);
            setMyProyects(esteP);
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        setNom(esteP[0].Nombre_proyecto);
        setDesc(esteP[0].Descripcion_proyecto);
        setRequ1(esteP[0].Requisitos[0]);
        setRequ2(esteP[0].Requisitos[1]);
        setRequ3(esteP[0].Requisitos[2]);
        setRequ4(esteP[0].Requisitos[3]);
        setRequ5(esteP[0].Requisitos[4]);
        setAutor(esteP[0].Autor);
        setChecked(esteP[0].Visualizacion);
        setCurso(esteP[0].Curso);
        setLista(esteP[0].Lista_miembros);
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'SelectMyProyect' }], // reemplaza 'ScreenName' con el nombre de tu pantalla hija
            });
        });
        return unsubscribe;
    }, [navigation]);

    const volverAtras = () => {
        navigation.goBack();
    };


    const handleTextChange = (newText) => {

        const lines = newText.split('\n');

        const nonEmptyLines = lines.filter((line) => line.trim() !== '');

        const cleanedText = nonEmptyLines.join('\n');

        setDesc(cleanedText);
    };

    const selectImage = () => {
        ImagePicker.openPicker({
            cropping: true,
            includeBase64: true,
        })
            .then((image) => {
                // Aquí tienes la imagen seleccionada como objeto 'image'
                const base64Data = `data:${image.mime};base64,${image.data}`;
                setImagen(base64Data);
                console.log('Imagen convertida a base64:', base64Data);
            })
            .catch((error) => {
                console.log('Error al seleccionar la imagen:', error);
            });
    };
    return (
        <ScrollView style={styles.container}>
            {imagen != "" ? <Image
                style={{ width: '90%', height: 200, marginBottom: 5, borderRadius: 10, marginLeft: 'auto', marginRight: 'auto', marginTop: 15, marginBottom: 15, resizeMode: 'contain' }}
                source={{ uri: imagen }}
            /> : <Image style={{ width: '90%', height: 200, marginBottom: 5, borderRadius: 10, marginLeft: 'auto', marginRight: 'auto', marginTop: 15, marginBottom: 15, resizeMode: 'contain' }} source={require('../Imagen/notImage.jpeg')} />}
            <TouchableOpacity style={styles.boton2} onPress={() => { selectImage() }}>
                <Text style={styles.textBoton}>Selecionar imagen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boton2} onPress={() => { setImagen("") }}>
                <Text style={styles.textBoton}>Quitar imagen</Text>
            </TouchableOpacity>
            <View style={styles.contenedor_cabezera}>
                <Text style={styles.cabezera}>Nombre del proyecto</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder='Nombre'
                placeholderTextColor="#00308E"
                value={nom}
            />
            <Text style={{ marginLeft: 15, marginTop: -8, marginBottom: 5 }}>El campo nombre no es modificable</Text>
            <View style={styles.contenedor_cabezera}>
                <Text style={styles.cabezera}>Descripcion del proyecto</Text>
            </View>
            <TextInput
                style={styles.textarea}
                multiline={true}
                numberOfLines={4}
                placeholder="Descripcion del proyecto"
                textAlignVertical="top"
                value={desc}
                onChangeText={handleTextChange}
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
                value={requ1}
                onChangeText={(text) => setRequ1(text)}
            />
            <TextInput
                style={styles.input2}
                placeholder='Requisito 2'
                placeholderTextColor="#00308E"
                value={requ2}
                onChangeText={(text) => setRequ2(text)}
            />
            <TextInput
                style={styles.input2}
                placeholder='Requisito 3'
                placeholderTextColor="#00308E"
                value={requ3}
                onChangeText={(text) => setRequ3(text)}
            />
            <TextInput
                style={styles.input2}
                placeholder='Requisito 4'
                placeholderTextColor="#00308E"
                value={requ4}
                onChangeText={(text) => setRequ4(text)}
            />
            <TextInput
                style={styles.input2}
                placeholder='Requisito 5'
                placeholderTextColor="#00308E"
                value={requ5}
                onChangeText={(text) => setRequ5(text)}
            />

            <View style={styles.contenedor_cabezera}>
                <Text style={styles.cabezera}>Autor: {autor}</Text>
            </View>
            <View style={styles.contenedor_cabezera}>
                <Text style={styles.cabezera}>Miembros: {lista.length}</Text>
            </View>
            <Text></Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity style={styles.boton} onPress={() => { volverAtras() }}>
                    <Text style={styles.textBoton} >Volver</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.boton} onPress={() => { crearRequisitos() }}>
                    <Text style={styles.textBoton} >Actualizar</Text>
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
        width: '42%',
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
export default MyProyect;