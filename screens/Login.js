import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, ImageBackground,Alert,Image } from 'react-native';
import PantallasContext from './PantallaContext';
import { useContext, useState, useEffect } from 'react';


const Login = ({ navigation }) => {
    const { nombre, setNombre } = useContext(PantallasContext);
    const [ name, setName] = useState("");
    const [ pass, setPass] = useState("");
    const [ correct, setCorrect] = useState(false);

    const fetchData = async () => {
        const setting = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            body: JSON.stringify({
                Nombre: name,
                Password: pass
            }),
        }

        try {
            const fetchResponse = await fetch('http://35.172.79.148:5001/RecruitProyect/login', setting);
            const data = await fetchResponse.json();

            setNombre(name);
            if(data.correct=="true"){
                setCorrect(true);
            }else if(data.correct=="false"){
                Alert.alert("Contraseña incorrecta");
            }else{
                Alert.alert("Usuario no existe");
            }
        } catch (e) {
            Alert.alert("User or password incorrect");
        }
    };

    useEffect(() => {
        if (correct === true) {
            navigation.navigate('Hogar');
        }
    }, [correct]);

    useEffect(() => {
        const unsubscribe = navigation.addListener("blur", () => {
            setCorrect(false);
            setName('');
            setPass('');
        });
        return unsubscribe;
    }, [navigation]);
    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            setCorrect(false);
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <ImageBackground source={require('../Imagen/Login.jpg')} style={{ width: '100%', height: '100%' }} resizeMode='cover'>
            <View style={styles.container}>
                
                <View style={{flex:1 , paddingTop:70}}>
                <Image source={require('../Imagen/logo.png')} style={{ width: 170, height: 170 }}/>
                </View>
                <View style={{ flex:1, width: '95%',alignItems:'center' }}>
                <TextInput style={styles.inputs} placeholder='Nombre' onChangeText={(text) => setName(text)} value={name}/>
                <TextInput style={styles.inputs} placeholder='Contraseña' onChangeText={(text) => setPass(text)} value={pass} secureTextEntry={true}/>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.7}
                    onPress={() => {fetchData()}}
                >
                    <Text style={{textAlign: 'center', fontSize:18, fontWeight: 'bold', color:'white'}}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => { navigation.navigate('Registrar') }}
                >
                    <Text style={{textAlign: 'center', fontSize:18, fontWeight: 'bold', color:'#002AAD',margin:10}}>Registrarse</Text>
                </TouchableOpacity>
                
                </View>
            </View>
        </ImageBackground>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    button: {
        width: '80%',
        padding: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'blue',
        backgroundColor: '#0750DC',
        margin:10
    },
    inputs:{
        width:'80%',
        height: 60,
        borderWidth:2,
        margin:10,
        borderRadius:5,
        borderColor: 'blue',
        fontWeight: 'bold',
        fontSize:17,
        backgroundColor: '#87AFFC',
        paddingLeft:10
    }
})

export default Login;