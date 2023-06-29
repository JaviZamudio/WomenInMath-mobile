import { getDoc, doc, getDocs, query, collection, arrayUnion, updateDoc, arrayRemove, where } from "firebase/firestore";
import { db } from "../configs/firebase";

export interface UsableDato {
    id: string;
    titulo: string;
    contenido: string;
    categoria: string;
    categoriaColor: string;
    isFavorite: boolean;
}
/**
 * Function to get the favorite datos of a user
 * @param userId User Document ID (string)
 * @returns Array of usable datos
 */
export const getFavorites = async (userId: string) => {
    // Get user document by ID
    const usuarioSnapshot = await getDoc(doc(db, "usuarios", userId));
    const usuario = usuarioSnapshot.data();

    // Get all categories
    const categoriasSnapshot = await getDocs(query(collection(db, "categorias")));

    const datos = await Promise.all(usuario.datos.map(async (datoId: string) => {
        const datoSnapshot = await getDoc(doc(db, "datos", datoId));
        const dato = datoSnapshot.data();

        const categoriaSnapshot = categoriasSnapshot.docs.find((categoria) => categoria.id === dato.categoriaId);
        const categoria = categoriaSnapshot.data();

        return {
            id: dato.id,
            titulo: dato.titulo,
            contenido: dato.contenido,
            categoria: categoria.nombre,
            categoriaColor: categoria.color,
            isFavorite: true,
        };
    }));

    return datos as UsableDato[];
};

/**
 * Function to Add a dato to the user's favorites
 * @param userId User Document ID (string)
 * @param datoId Dato Document ID (string)
 * @returns Array of usable datos
 */
export const addFavorite = async (userId: string, datoId: string) => {
    await updateDoc(doc(db, "usuarios", userId), {
        datos: arrayUnion(datoId),
    });
    console.log("Added dato to usuario.datos");
};

/**
 * Function to Remove a dato from the user's favorites
 * @param userId User Document ID (string)
 * @param datoId Dato Document ID (string)
 * @returns Array of usable datos
 */
export const removeFavorite = async (userId: string, datoId: string) => {
    await updateDoc(doc(db, "usuarios", userId), {
        datos: arrayRemove(datoId),
    });
    console.log("Removed dato from usuario.datos");
};

export const prepareFactsForFuture = async () => {
    const q = query(collection(db, "datos"));
    const querySnapshot = await getDocs(q);
    const counters = {};

    console.log("Preparing facts for future...");

    querySnapshot.forEach((datoSnapshot) => {
        const dato = datoSnapshot.data();
        
        // add the counter's number of days to the current date
        counters[dato.categoriaId] = (counters[dato.categoriaId] ?? -1) + 1;
        console.log({counters})

        const newDate = new Date(Date.now() + counters[dato.categoriaId] * 24 * 60 * 60 * 1000);
        updateDoc(datoSnapshot.ref, { fecha: (newDate.getMonth() + 1) + "/" + newDate.getDate() + "/" + newDate.getFullYear()});

    });
};