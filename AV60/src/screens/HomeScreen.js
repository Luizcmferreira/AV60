import React, {useEffect, useState} from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { subscribeUsuarios } from "../service/UsuariosService";

export default function HomeScreen({navigation}) {
   const [usuarios, setUsuarios] = useState([]);
   const [loading, setLoading] = useState(true);

    useEffect(() => {
    const unsubscribe = subscribeUsuarios((dados) => {
      setUsuarios(dados);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

   if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Carregando usuários...</Text>
      </View>
    );
  }

     const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.usuarioItem}
      onPress={() => navigation.navigate("Detalhes", { idusuario: item.id })}
    >
      <Text style={styles.usuarioNome}>{item.usuario}</Text>
      <Text>{item.email}</Text>
    </TouchableOpacity>
  );

     return (

    <View style={styles.container}>
        <Text style={styles.title}>Aplicativo de controle de usuário para melhorar o acompanhamento.</Text>

        <TouchableOpacity
          style={styles.styleButtom}
          onPress={()=> navigation.navigate("Cadastro")}  
        >
        <Text  style={styles.buttomText}>Cadastrar Usuário</Text>
        </TouchableOpacity>
        
        <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 10 }}
      />

        <TouchableOpacity
          style={styles.styleButtom}
          onPress={()=> navigation.navigate("Detalhes")}  
        >
        <Text style={styles.buttomText}>Detalhes do Usuário</Text>
        </TouchableOpacity>
    
      </View>
    );
  }

  const styles=StyleSheet.create({
    container:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      backgroundColor: '#f0f0f0'
    },

    title:{
      fontSize: 18,
      fontWeight:'bold',
      textAlign: "center",
      marginBottom: 20
    },

    styleButtom:{
      backgroundColor: '#007BFF',
      padding: 15,
      width: '80%',
      alignItems: 'center',
      marginBottom:20
    },

    buttomText:{
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold'
    }

  })