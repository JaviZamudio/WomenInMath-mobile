import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../configs/firebase';
import { getCurrentDate } from '../utils/utils';
import { prepareFactsForFuture } from '../services/datosServices';

export default function HomeScreen() {
  const [apod, setApod] = useState({
    title: '',
    url: '-',
    explanation: ''
  });
  const [factOfTheDay, setFactOfTheDay] = useState({
    contenido: '',
    titulo: ''
  });
  const [conmemoration, setConmemoration] = useState({
    contenido: '',
  });

  const getAPOD = async () => {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=gi8iMBP7D9e8SVBo1iRp9AxRkEpaCHkNHXBpop47`);
    const body = await response.json();

    console.log("Got APOD");
    setApod(body);
  }

  const getFactOfTheDay = async () => {
    // fact with categoriaId = dato-del-dia and fecha = today (dd/mm/yyyy)
    const q = query(collection(db, 'datos'), where('categoriaId', '==', 'dato-del-dia'), where('fecha', '==', getCurrentDate()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No matching documents.');
      console.log(`Querying: find datos where categoriaId == dato-del-dia and fecha == ${getCurrentDate()}`);
      return;
    }

    setFactOfTheDay(querySnapshot.docs[0]?.data() as any);
    console.log("Got Fact of the day: ", querySnapshot.docs[0]?.data());
  }

  const getConmemoration = async () => {
    // efemeride with fecha == getCurrentDate()
    const q = query(collection(db, 'efemerides'), where('fecha', '==', getCurrentDate()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No matching documents.');
      return;
    }

    setConmemoration(querySnapshot.docs[0]?.data() as any);
    console.log("Got Conmemoration: ", querySnapshot.docs[0]?.data());
  }

  useEffect(() => {
    getAPOD();
    getFactOfTheDay();
    getConmemoration();
    // prepareFactsForFuture();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ backgroundColor: '#ddd' }}>
      {/* Header */}
      {/* <View style={{ backgroundColor: '#0e666c', paddingVertical: 15 }}>
                <Text style={{ fontSize: 25, fontWeight: '600', color: '#fff', marginLeft: 20 }}>
                    DiApp
                </Text>
            </View> */}

      {/* Fact of the day */}
      <View style={{ backgroundColor: '#fff', padding: 20, margin: 20, borderRadius: 10, marginBottom: 0 }}>
        {/* Fact title */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
          {factOfTheDay.titulo}
        </Text>
        {/* Fact data */}
        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          {factOfTheDay.contenido}
        </Text>
        {/* Tag (#FactOfTheDay) */}
        <Text style={{ fontSize: 16, color: '#aaa', textAlign: 'right' }}>
          #FactOfTheDay
        </Text>
      </View>

      {/* Conmemoration */}
      <View style={{ backgroundColor: '#fff', padding: 20, margin: 20, borderRadius: 10, marginBottom: 0 }}>
        {/* Conmemoration title */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
          {getCurrentDate()}
        </Text>
        {/* Conmemoration data */}
        <Text style={{ fontSize: 16, marginBottom: 10 }}>
          {conmemoration.contenido}
        </Text>
        {/* Tag (#Conmemoration) */}
        <Text style={{ fontSize: 16, color: '#aaa', textAlign: 'right' }}>
          #Conmemoration
        </Text>
      </View>

      {/* Astronomy picture of the day */}
      <View style={{ backgroundColor: '#fff', padding: 20, margin: 20, borderRadius: 10 }}>
        {/* Astronomy picture of the day title */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
          {apod.title}
        </Text>
        {/* Astronomy picture of the day data */}
        <Image
          source={{ uri: apod.url }}
          style={{ width: '100%', height: 300, marginBottom: 10 }}
        />
        {/* Tag (#AstronomyPictureOfTheDay) */}
        <Text style={{ fontSize: 16, color: '#aaa', textAlign: 'right' }}>
          #AstronomyPictureOfTheDay
        </Text>
      </View>
    </ScrollView>
  );
}