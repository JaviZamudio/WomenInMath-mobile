import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { UsableDato, addFavorite, getFavorites, removeFavorite } from '../services/datosServices';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../configs/firebase';
import { AuthContext } from '../contexts/AuthContext';
import { useIsFocused } from '@react-navigation/native';

export default function FavoritesScreen() {
  const [facts, setFacts] = useState<UsableDato[]>([]);
  const { user } = useContext(AuthContext);
  const isFocused = useIsFocused();

  const initialize = async () => {
    try {
      // get user
      const userSnapshot = (await getDocs(query(collection(db, 'usuarios'), where('uid', '==', user?.uid)))).docs[0];

      // get favorites
      const favorites = await getFavorites(userSnapshot.id);
      console.log("Got Favorites", favorites);

      setFacts(favorites);
    } catch (error) {
      console.log("Error initializing FavoritesScreen", error);
    }
  }

  useEffect(() => {
    if (!isFocused) return;
    initialize();
  }, [isFocused]);

  return (
    <ScrollView contentContainerStyle={{ backgroundColor: '#ddd', flexGrow: 1 }}>
      <View style={{ height: 20 }} />
      {facts.map(fact => {
        return (
          <Fact fact={fact} key={fact.id} />
        )
      })}
    </ScrollView>
  );
}

export const Fact = ({ fact }: { fact: UsableDato }) => {
  const { user } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(fact.isFavorite);

  const handlePress = () => {
    if (isFavorite) {
      removeFavorite(user?.uid, fact.id);
    } else {
      addFavorite(user?.uid, fact.id);
    }

    setIsFavorite(!isFavorite);
  }

  useEffect(() => {
    setIsFavorite(fact.isFavorite);
  }, [fact]);
  
  return (
    <View style={{ padding: 20, margin: 20, borderRadius: 10, backgroundColor: '#fff', marginTop: 0 }} key={fact.id}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        {fact.titulo}
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 20 }}>
        {fact.contenido}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, color: fact.categoriaColor, textAlign: 'right' }}>
          #{fact.categoria}
        </Text>
        {/* Button to make it favorite */}
        {/* <Ionicons name="heart" size={30} color="#dd0000" /> */}
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={30}
          color={isFavorite ? "#dd0000" : "#000"}
          onPress={handlePress}
        />
      </View>
    </View>
  )
}