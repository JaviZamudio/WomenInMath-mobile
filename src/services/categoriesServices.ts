import { getDocs, query, collection, updateDoc, doc, arrayUnion, where, arrayRemove } from "firebase/firestore";
import { db } from "../configs/firebase";

export const getCategories = async (uid: any) => {
    const categoriasSnapshot = await getDocs(query(collection(db, "categorias")));
    const categorias = categoriasSnapshot.docs.map((categoriaSnapshot) => {
        const categoria = categoriaSnapshot.data();
        return {
            id: categoriaSnapshot.id,
            nombre: categoria.nombre,
            color: categoria.color,
            inUser: categoria.usuarios.includes(uid),
        };
    });

    return categorias;
};

export const addCategory = async (uid: any, categoriaId: any) => {
    await updateDoc(doc(db, "categorias", categoriaId), {
        usuarios: arrayUnion(uid),
    });
    console.log("Added user to categoria.usuarios");

    await updateDoc(doc(db, "usuarios", uid), {
        categorias: arrayUnion(categoriaId),
    });
    console.log("Added categoria to usuario.categorias");
}

export const removeCategory = async (uid: any, categoriaId: any) => {
    await updateDoc(doc(db, "categorias", categoriaId), {
        usuarios: arrayRemove(uid),
    });
    console.log("Removing user from categoria.usuarios");

    await updateDoc(doc(db, "usuarios", uid), {
        categorias: arrayRemove(categoriaId),
    });
    console.log("Removing categoria from usuario.categorias");
}