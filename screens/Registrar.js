
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Button, ScrollView, KeyboardAvoidingView, keyboardVerticalOffset, Alert } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import 'react-native-gesture-handler'


const Registrar = ({ navigation }) => {
    const [nom, setNom] = useState('');
    const [pass, setPass] = useState('');
    const [conf, setConf] = useState('');
    const [gmail, setGmail] = useState('');

    const [c_nom, setC_nom] = useState(true);
    const [c_pass, setC_pass] = useState(true);
    const [c_conf, setC_conf] = useState(true);
    const [c_gmail, setC_gmail] = useState(true);



    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setNom('');
            setPass('');
            setConf('');
            setGmail('');
            setC_nom(true);
            setC_pass(true);
            setC_conf(true);
            setC_gmail(true);
        });

        return unsubscribe;
    }, [navigation]);
    function comprobarMail(pa) {
        const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (regex.test(pa)) {
            setC_gmail(true);
        } else {
            setC_gmail(false);
        }
    }
    function comprobarContraseña(pa) {
        const regex = /^\S{4,}$/;
        if (regex.test(pa)) {
            setC_pass(true);
        } else {
            setC_pass(false);
        }
    }
    function coincidir() {
        if (pass === conf) {
            return true;
        } else {
            return false;
        }
    }
    function comprobarVacio() {
        const regex2 = /^ $/;
        numero = 0;
        if (nom == '') {
            setC_nom(false);
        } else {
            if(!regex2.test(nom)) {
                setC_nom(true);
                numero++;
            }else{
                setC_nom(false);
            }
            
        }
        const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (gmail == '') {
            setC_gmail(false);
        } else {
            if (regex.test(gmail)) {
                setC_gmail(true);
                numero++;
            } else {
                setC_gmail(false);
            }
        }
        if (pass == '') {
            setC_pass(false);
        } else {
            if (pass.length >= 4) {
                setC_pass(true);
                numero++;
            } else {
                setC_pass(false);
            }
        }
        if (conf == '') {
            setC_conf(false);
        } else {
            setC_conf(true);
            numero++;
        }
        return numero;
    }


    const fetchData = async () => {
        if (comprobarVacio() == 4) {
            if (coincidir) {
                const setting = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                    body: JSON.stringify({
                        Gmail: gmail.toString(),
                        Password: pass.toString(),
                        Nombre: nom.toString()
                    }),
                }
                try {
                    const fetchResponse = await fetch('http://35.172.79.148:5001/RecruitProyect/registrar', setting);
                    const data = await fetchResponse.json();

                    if (data.correct == "true") {
                        Alert.alert("Registered succesfully");
                        navigation.navigate('Login');
                    } else if (data.correct == "nombre") {
                        Alert.alert("El nombre introducido ya existe");
                        setC_nom(false);
                    } else if (data.correct == "gmail") {
                        Alert.alert("El Mail introducido ya esiste");
                        setC_gmail(false);
                    } else {
                        Alert.alert("Error de coneccion");
                    }
                } catch (e) {
                    Alert.alert("Error registering");
                    Alert.alert(e.message);
                }
            }

        }

    };

    return (
        <KeyboardAvoidingView style={styles.container}
            behavior={Platform.OS === 'android' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'android' ? 20 : 0}>

            {/* <Text style={styles.titulo}>Registrar</Text> */}
            <Text></Text>
            <Text></Text>
            <View style={styles.inputcontainer}>
                <TextInput
                    style={(c_nom) ? styles.input : styles.input_error}
                    placeholder='Nombre'
                    placeholderTextColor="#00308E"
                    onChangeText={(text) => { setNom(text) }}
                />
                {(c_nom) ? <View></View> : <Text style={{ width: '88%', color: 'red' }}>Nombre incorrecto</Text>}
            </View>
            <View style={styles.inputcontainer}>
                <TextInput
                    style={(c_gmail) ? styles.input : styles.input_error}
                    placeholder='Mail'
                    placeholderTextColor="#00308E"
                    onChangeText={(text) => { comprobarMail(text); setGmail(text) }}
                />
                {(c_gmail) ? <View></View> : <Text style={{ width: '88%', color: 'red' }}>Mail incorrecto</Text>}
            </View>
            <View style={styles.inputcontainer}>
                <TextInput
                    style={(c_pass) ? styles.input : styles.input_error}
                    placeholder='Contraseña'
                    placeholderTextColor="#00308E"
                    secureTextEntry={true}
                    onChangeText={(text) => { setPass(text) }}
                />
                {(c_pass) ? <View></View> : <Text style={{ width: '88%', color: 'red' }}>Contraseña minimo 4 caracteres</Text>}
            </View>
            <View style={styles.inputcontainer}>
                <TextInput
                    style={(c_conf) ? styles.input : styles.input_error}
                    placeholder='Confirmar contraseña'
                    placeholderTextColor="#00308E"
                    secureTextEntry={true}
                    onChangeText={(text) => { setConf(text) }}
                />
                {(c_conf) ? <View></View> : <Text style={{ width: '88%', color: 'red' }}>Contraseña incorrecto</Text>}
            </View>
            <View style={styles.centrar}>
                <TouchableOpacity style={styles.boton} onPress={() => { (coincidir()) ? (comprobarVacio()) ? fetchData() : Alert.alert("No puede haber campos vacios") : Alert.alert("Contraseña incorrecto") }}>
                    <Text style={styles.textBoton}>Resgistrarse</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#B6CFFF",

    },
    inputcontainer: {
        margin: 12,
        width: '100%',
        alignItems: 'center',
        textAlign: 'left'
    },
    input: {
        height: 55,
        width: '90%',

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
    input_error: {
        height: 55,
        width: '90%',
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        opacity: 1,
        backgroundColor: "white",
        borderColor: "red",
        fontSize: 18,
        letterSpacing: 0.6,
        color: "#004ADB"
    },
    titulo: {
        color: "#3200D6",
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        margin: 10
    },
    boton: {
        width: '80%',
        height: 60,
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
    centrar: {
        width: '100%',
        alignItems: 'center'
    }
});
export default Registrar;
