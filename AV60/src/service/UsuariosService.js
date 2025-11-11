import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseConnections";

const usuarioCollection = collection(db, "usuarios");

export const criarUsuario = async (usuario) => {
  const payload = {
    usuario: usuario.usuario,
    cpf: usuario.cpf,
    email: usuario.email,
    descricao: usuario.descricao,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(usuarioCollection, payload);
  return ref.id;
};

export const subscribeUsuarios = (callback) => {
  const q = query(usuarioCollection, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const itens = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(itens);
  });
};

export const obterUsuarios = async () => {
  const snap = await getDocs(usuarioCollection);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const obterUsuarioPorId = async (id) => {
  const docRef = doc(db, "usuarios", id);
  const d = await getDoc(docRef);
  if (!d.exists()) return null;
  return { id: d.id, ...d.data() };
};

export const atualizarUsuario = async (id, dados) => {
  const docRef = doc(db, "usuarios", id);
  await updateDoc(docRef, { ...dados, updateAt: serverTimestamp() });
};

export const deletarUsuario = async (id) => {
  const docRef = doc(db, "usuarios", id);
  await deleteDoc(docRef);
};