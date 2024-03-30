import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, FlatList, Image } from 'react-native';
import { useContext, useState, useEffect, useLayoutEffect } from 'react';
import { IconButton, ActivityIndicator } from 'react-native-paper';
import PantallasContext from './PantallaContext';

const SelectProyect = ({ navigation }) => {

  /*     const image2='https://as2.ftcdn.net/v2/jpg/03/15/18/09/1000_F_315180932_rhiXFrJN27zXCCdrgx8V5GWbLd9zTHHA.jpg'
      const image="https://www.hallofseries.com/wp-content/uploads/2022/08/Zima-Blue-930x620.jpeg.webp"; */

  const [pul, setPul] = useState(false);
  const { cursosSelect, proyects, setProyects, user, setNombreChat, setNotificaciones,esteProyecto,setEsteProyecto } = useContext(PantallasContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [primero, setPrimero] = useState(true);
  const [isEndReached, setIsEndReached] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const fetchResponse = await fetch('http://35.172.79.148:5001/RecruitProyect/proyecto?=' + cursosSelect +"-"+user.Nombre+ "/Page" + currentPage);
      const data = await fetchResponse.json();
      var array = [];
      for (var i = 0; i < Object.keys(data.proyectos).length; i++) {
        var peti = {
          Autor: data.proyectos[i].Autor,
          Nombre_proyecto: data.proyectos[i].Nombre_proyecto,
          Descripcion_proyecto: data.proyectos[i].Descripcion_proyecto,
          Nombre_chat: data.proyectos[i].Nombre_chat,
          Visualizacion: data.proyectos[i].Visualizacion,
          Requisitos: data.proyectos[i].Requisitos,
          Lista_miembros: data.proyectos[i].Lista_miembros,
          Curso: data.proyectos[i].Curso,
          Gmail: data.proyectos[i].Gmail,
          Imagen: data.proyectos[i].Imagen
        }
        if (peti.Autor != user.Nombre) {
          if (!peti.Lista_miembros.includes(user.Nombre)) {
            array.push(peti);
          }
        }
      }
      if (primero) {
        if (array.length != 0) {
          setProyects(array);
          console.log("Recuperando contenido");
          setPrimero(false);
        }else{
          setIsEndReached(true);
        }
      } else {
        if (array.length != 0) {
          const datosActualizado = [...proyects, ...array];
          setProyects(datosActualizado);
          console.log("Recuperando contenido");
          setIsEndReached(false); 
        } else {
          setIsEndReached(true);
        }
      }
    } catch (e) {
      alert(e);
    }
    setPul(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }


  useEffect(() => {
    if (!isEndReached) {
      fetchData();
    }
  }, [isEndReached, currentPage]);

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  useLayoutEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setPul(false);
      setCurrentPage(1);
      setIsLoading(false);
      setPrimero(true);
      setIsEndReached(false);
    });
    return unsubscribe;
  }, [navigation]);


  function comprobar(array) {
    let num = 0;
    for (i = 0; i < array.length; i++) {
      if (array[i] != "") {
        num++;
      }
    }
    if (num == 0) {
      return false;
    } else {
      return true;
    }
  }
  function irAProyects(chat) {
    const esteP = proyects.filter(proyect => proyect.Nombre_chat === chat);
    setEsteProyecto(esteP);
    navigation.navigate("Proyects")
  }
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item}
      onPress={() => { setNombreChat(item.Nombre_chat); irAProyects(item.Nombre_chat) }}
      activeOpacity={0.8}>
      {item.Imagen != "" ? <Image
        style={{ width: '100%', height: 200, marginBottom: 5, borderRadius: 10, resizeMode: 'contain' }}
        source={{ uri: item.Imagen }}
      /> : <Image style={{ width: '100%', height: 200, marginBottom: 5, borderRadius: 10, resizeMode: 'contain' }} source={require('../Imagen/notImage.jpeg')} />}

      <Text style={styles.title}>{item.Nombre_proyecto}</Text>
      <Text style={styles.normalText}>Requisitos</Text>
      {comprobar(item.Requisitos) ? item.Requisitos.map((fruit, index) => (
        (fruit != "") ? <Text key={index} style={{ fontSize: 17, paddingLeft: 24, color: '#300098', }}>- {fruit}</Text> : <View key={index}></View>
      )) : <Text style={{ fontSize: 17, paddingLeft: 24, color: '#300098', }}>- No hay requisitos</Text>}
      <Text style={styles.normalText2}>Miembros: {item.Lista_miembros.length}</Text>
    </TouchableOpacity>
  );

  const loadNextPage = () => {
    if (isLoading) {
      return;
    }
      setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleEndReached = () => {
    if (!isLoading) {
      loadNextPage(); 
    }
  };
  const renderFooter = () => {
    if (isLoading) {
      return (
        <View style={{ alignItems: 'center', padding: 10, backgroundColor: "#DEE9FF" }}>
          <ActivityIndicator size="large" color='#300098' />
          <Text style={{ marginTop: 10, color: '#300098' }}>Cargando más datos...</Text>
        </View>
      );
    }

    return null;
  };
  return (
    <View style={styles.container}>
      {pul ? ((proyects.length != 0) ? <FlatList
        data={proyects}
        renderItem={renderItem}
        keyExtractor={(item) => item.Nombre_chat}
        numColumns={1}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      /> : <Text style={styles.noDisponible}>No hay proyectos disponibles.</Text>) : <ActivityIndicator style={{ marginVertical: 200 }} size={60} animating={true} color={'#300098'} />}
      <Text></Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    paddingHorizontal: 10,
    backgroundColor: "#DEE9FF",
    /* backgroundColor: '#BDC7FF', */

  },
  item: {
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#300098',
    backgroundColor: '#BDC7FF',
    padding: 20,
    marginVertical: 12,
    marginBottom: 20,
    marginHorizontal: 8,
    flex: 1, // Ajustar el tamaño de la columna
    alignItems: 'flex-start', // Alinear elementos en el centro
    justifyContent: 'center', // Justificar elementos en el centro

  },
  title: {
    fontSize: 35, fontWeight: 'bold', letterSpacing: 1, color: '#300098',
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
  noDisponible: {
    color: '#300098',
    fontSize: 20,
    alignContent: 'center',
    alignItems: 'center',
    margin: 50,
    marginVertical: 200
  }

});
export default SelectProyect;
