import { FlatList, ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { db } from '../configs/firebase';
import { getCurrentDate } from '../utils/utils';
import { useIsFocused } from '@react-navigation/native';
import { Fact } from './FavoritesScreen';

export default function FactsScreen() {
    const { user } = useContext(AuthContext);
    const [facts, setFacts] = useState<{ titulo: string, contenido: string, categoria: string, categoriaColor: string, id: string, isFavorite: boolean }[]>([]);
    const isFocused = useIsFocused();

    const getFacts = async () => {
        // facts with fecha == getCurrentDate(), categoriaId in usuario.categorias, just the last for each categoriaId
        let q = query(collection(db, 'usuarios'), where('uid', '==', user?.uid));
        const usuariosSnapshot = await getDocs(q);
        const usuario = usuariosSnapshot.docs[0]?.data() as any;

        // Get categorias
        q = query(collection(db, 'categorias'));
        const categoriasSnapshot = await getDocs(q);
        const categorias = categoriasSnapshot.docs.map(doc => doc.data()) as any;

        // Get facts
        q = query(collection(db, 'datos'), where('fecha', '==', getCurrentDate()), where('categoriaId', 'in', usuario.categorias));
        const datosSnapshot = await getDocs(q);

        const datos = datosSnapshot.docs.map(doc => {
            const data = doc.data();
            const categoria = categorias.find((categoria: any) => categoria.id === data.categoriaId);
            return {
                id: doc.id,
                titulo: data.titulo,
                contenido: data.contenido,
                categoria: categoria.nombre,
                categoriaColor: categoria.color,
                isFavorite: usuario.datos.includes(doc.id)
            }
        }) as any;
        console.log("Got Facts");

        setFacts(datos);
    }

    useEffect(() => {
        if (!isFocused) return;
        getFacts();
    }, [isFocused]);

    return (
        <ScrollView contentContainerStyle={{ backgroundColor: '#ddd', flexGrow: 1 }}>
            <View style={{ height: 20 }} />

            {facts.map((fact) => {
                return (
                    <Fact fact={fact} key={fact.id} />
                );
            })}
        </ScrollView>
    );
}

// const Fact = ({ factData, makeFavoriteCallback }) => {
//     const [isFavorite, setIsFavorite] = useState(factData.isFavorite);

//     const handleFavorite = () => {
//         setIsFavorite(!isFavorite);
//         makeFavoriteCallback();
//     }

//     return (
//         <View style={{ padding: 20, margin: 20, borderRadius: 10, backgroundColor: '#fff', marginTop: 0 }}>
//             <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
//                 {factData.titulo}
//             </Text>
//             <Text style={{ fontSize: 16, marginBottom: 20 }}>
//                 {factData.contenido}
//             </Text>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Text style={{ fontSize: 16, color: factData.categoriaColor, textAlign: 'right' }}>
//                     #{factData.categoria}
//                 </Text>

//                 {/* Button to make it favorite */}
//                 <Ionicons
//                     name={isFavorite ? "heart" : "heart-outline"}
//                     size={30} color={isFavorite ? "#dd0000" : "#333"}
//                     onPress={handleFavorite}
//                 />
//             </View>
//         </View>
//     );
// }