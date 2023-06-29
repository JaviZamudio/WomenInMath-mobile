import { useContext, useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import { Checkbox } from 'react-native-paper';
import { addCategory, getCategories, removeCategory } from '../services/categoriesServices';

export default function ProfileScreen() {
    const { logout, user } = useContext(AuthContext);
    const [categories, setCategories] = useState<UsableCategory[]>([]);

    useEffect(() => {
        getCategories(user.uid).then((categories) => {
            setCategories(categories);
        });
    }, []);

    return (
        <View style={{}}>
            <Text style={{}}>Profile</Text>
            <TouchableOpacity
                style={{ marginTop: 20, backgroundColor: '#01a0aa', padding: 10, borderRadius: 5, width: 150 }}
                onPress={() => logout()}
            >
                <Text style={{ color: '#fff', fontSize: 20, textAlign: "center" }}>Logout</Text>
            </TouchableOpacity>

            {/* Categories */}
            <Text style={{fontSize: 20, marginTop: 20}}>Categories</Text>
            <FlatList
                data={categories}
                renderItem={({ item }) => <Category category={item} />}
                keyExtractor={item => item.id}
            />

        </View>
    );
}

interface UsableCategory {
    id: string;
    nombre: string;
    color: string;
    inUser: boolean;
}
const Category = ({ category }: {category: UsableCategory}) => {
    const { user } = useContext(AuthContext);
    const [checked, setChecked] = useState(category.inUser);

    const handlePress = async () => {
        if (checked) {
            console.log("Removing category");
            await removeCategory(user.uid, category.id);
        } else {
            console.log("Adding category");
            await addCategory(user.uid, category.id);
        }

        setChecked(!checked);
    }

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginLeft: 20 }}>
            <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: category.color }}></View>
            <Text style={{ marginLeft: 10 }}>{category.nombre}</Text>

            <Checkbox
                status={checked ? 'checked' : 'unchecked'}
                onPress={handlePress}
            />
        </View>
    )
}