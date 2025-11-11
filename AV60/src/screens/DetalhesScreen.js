import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  Alert,
  Button,
  ActivityIndicator,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { obterUsuarioPorId, atualizarUsuario, deletarUsuario } from "../service/UsuariosService";

export default function DetalhesScreen({ route, navigation }) {
  const { idusuario } = route.params;

  const [usuario, setUsuario] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);

  
  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const data = await obterUsuarioPorId(idusuario);
        if (!data) {
          Alert.alert("Erro", "Usuário não encontrado!");
          navigation.goBack();
          return;
        }

        setUsuario(data.usuario);
        setCpf(data.cpf);
        setEmail(data.email);
        setDescricao(data.descricao);
      } catch (error) {
        console.error("Erro ao buscar usuário: ", error);
        Alert.alert("Erro", "Não foi possível buscar o usuário.");
      } finally {
        setLoading(false);
      }
    };

    carregarUsuario();
  }, []);

  
  const handleAtualizar = async () => {
    if (!usuario || !cpf || !email || !descricao) {
      Platform.OS === "web"
        ? window.alert("Preencha todos os campos antes de atualizar!")
        : Alert.alert("Aviso", "Preencha todos os campos antes de atualizar!");
      return;
    }

    try {
      await atualizarUsuario(idusuario, {
        usuario,
        cpf,
        email,
        descricao,
      });

      Platform.OS === "web"
        ? window.alert("Usuário atualizado com sucesso!")
        : Alert.alert("Sucesso", "Usuário atualizado com sucesso!");

      setEditando(false);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      Platform.OS === "web"
        ? window.alert("Não foi possível atualizar o usuário.")
        : Alert.alert("Erro", "Não foi possível atualizar o usuário.");
    }
  };

  
  const handlerExcluir = async () => {
    const confirmarExclusao = async () => {
      try {
        await deletarUsuario(idusuario);
        Platform.OS === "web"
          ? window.alert("Usuário excluído com sucesso!")
          : Alert.alert("Sucesso", "Usuário excluído com sucesso!");
        navigation.goBack();
      } catch (error) {
        console.error("Erro ao deletar:", error);
        Platform.OS === "web"
          ? window.alert("Não foi possível excluir o usuário.")
          : Alert.alert("Erro", "Não foi possível excluir o usuário.");
      }
    };

    if (Platform.OS === "web") {
      const confirmar = window.confirm("Deseja realmente excluir este usuário?");
      if (confirmar) await confirmarExclusao();
    } else {
      Alert.alert("Confirmação", "Deseja realmente excluir este usuário?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: confirmarExclusao },
      ]);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detalhes do Usuário</Text>

      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={usuario}
        onChangeText={setUsuario}
        editable={editando}
      />

      <Text style={styles.label}>CPF:</Text>
      <TextInput
        style={styles.input}
        value={cpf}
        onChangeText={setCpf}
        editable={editando}
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        editable={editando}
      />

      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={descricao}
        onChangeText={setDescricao}
        editable={editando}
        multiline
      />

      <View style={styles.botoes}>
        {!editando ? (
          <Button title="Editar" onPress={() => setEditando(true)} />
        ) : (
          <Button title="Salvar Alterações" onPress={handleAtualizar} />
        )}
      </View>

      <View style={styles.botoes}>
        <Button title="Excluir Usuário" color="red" onPress={handlerExcluir} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginTop: 10,
  },
  botoes: {
    marginTop: 10,
  },
});